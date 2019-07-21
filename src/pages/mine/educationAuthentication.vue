<template>
<div id="educationAuthentication" class="bgW">
    <div class="flexSpace eachHang">
        <span class="left">毕业院校</span>
        <input type="text" placeholder="请填写您的毕业院校" v-model="school">
        </div>
        <!--学历start-->
        <!-- <sliderPopupPicker :gradesArr="eduList" :leftText="leftText1" :rightText='rightText' v-on:changeResult="changeResultEdu"></sliderPopupPicker> -->
         <group>
             <!--年级选择器start-->
             <!-- <span>{{$refs.picker3&&$refs.picker3.getNameValues()}}</span> -->
            <popup-picker :title="leftText1" @on-change='changeResultEdu' ref="picker3"  :data="eduList"  :placeholder="rightText"  class="gradePicker"></popup-picker>
            <!--年级选择器end-->
        </group>
          <div class="flexSpace eachHang">
        <span class="left">学信网验证码</span>
        <input type="text" placeholder="请查看下方说明" v-model="schoolCode">
        </div>
        <div class="tips">
            请登录学信网。如已毕业，请生成《学历证书电子注册备案表》，拷贝在线生成码，输入到下边输入框中；如在校，请生成《学籍在线验证报告》，拷贝在线生成码，输入到下边输入框中；如因为毕业很早等原因，在学信网上不能认证，麻烦拍摄学位证，上传到下面的补充材料区域。谢谢！
        </div>
        <!--学历end-->
        <div class=" eachHang lastHang">
            <span class="left">学历证明补充资料（可选）</span>
            <div class="imgBox flexSpace">
                <div class="eachBox" @click="frontImg">
                    <img :src="frontUrl" alt="" v-if="frontUrl==''?false:true">
                    <img src="../../assets/img/sfz@3x.png" alt="" v-if="frontUrl==''?true:false">
                    <input v-if="isios" type="file" name="img" accept="image/*" id="upload_file1" mutiple="mutiple" class="add" @change="chooseImageFront">
                    <input v-if="!isios" type="file" name="img" accept="image/*" id="upload_file1" capture="camera" mutiple="mutiple" class="add" @change="chooseImageFront">

                    <p class="text">材料1</p>
                </div>
                <div class="eachBox" @click="backImg">
                    <img :src="backUrl" alt="" v-if="backUrl==''?false:true">
                    <img src="../../assets/img/sfz@3x.png" alt="" v-if="backUrl==''?true:false">
                    <input v-if="isios" type="file" name="img" accept="image/*" id="upload_file2" mutiple="mutiple" class="add" @change="chooseImageBack">
                    <input v-if="!isios" type="file" name="img" accept="image/*" id="upload_file2" capture="camera" mutiple="mutiple" class="add" @change="chooseImageBack">

                    <p class="text">材料2</p>
                </div>
            </div>
        </div>
        <button class="long_btn submit_btn" @click="submitMsg">提交</button>
        <!--<uploader></uploader>-->
    </div>
</template>

<script>
import sliderPopupPicker from '@/components/sliderPopupPicker'
import uploader from '@/components/uploader'
import axios from 'axios'
import {
    AlertModule,
    Group
} from 'vux'
export default {
    components: {
        uploader,
        sliderPopupPicker,
        Group
    },
    data() {
        return {
            degree: '',
            leftText1: '学历',
            rightText: '不限',
            certificate:'',
            eduList: [
                ['小学', '初中', '高中', '中专', '专科', '本科', '研究生']
            ],
            isios: false,
            frontUrl: '',
            backUrl: '',
            orifrontUrl: '',
            oribackUrl: '',
            school:'',
            schoolCode:''
        }
    },
    mounted() {
        //获取浏览器的userAgent,并转化为小写
        var ua = navigator.userAgent.toLowerCase();
        //判断是否是苹果手机，是则是true
        var isIos = ua.indexOf("iphone") != -1 || ua.indexOf("ipad") != -1;
        if (isIos) {
            this.isios = true;
        } else {
            this.isios = false;
        }
        this.getUser()
    },
    methods: {
         // 获取nickname
        getUser() {
            var that = this;
            var baseUrl = this.$store.state.baseUrl;
            var uid = that.$store.state.uid;
            that.$http('get', baseUrl + 'api/WebUser/' + uid).then(function (res) {
                that.shortName = res.data.data.nickname;
                // if(res.data.data.eduCertificate.certificate){
                //     that.certificate=res.data.data.eduCertificate.certificate
                   
                // }
                // if(res.data.data.eduCertificate.school){
                //     that.school=res.data.data.eduCertificate.school
                // }
                // if(res.data.data.eduCertificate.onlinecode){
                //     that.schoolCode=res.data.data.eduCertificate.onlinecode
                // }
                // if(res.data.data.eduCertificate.degree){
                //     that.rightText=res.data.data.eduCertificate.degree
                // }
               
            })
        },
        frontImg() {
            var file = document.getElementById("upload_file1");
            file.click()
        },
        backImg() {
            var file1 = document.getElementById("upload_file2");
            file1.click()
        },
        changeResultEdu(val) {
            console.log('=====')
            console.log(val)
             this.degree = val[0]
            this.rightText = val[0]
        },
        //   选择正面
        chooseImageFront() {
            var that = this;
            var baseUrl = that.$store.state.baseUrl
            var file = document.getElementById("upload_file1").files[0];
            var formdata1 = new FormData(); // 创建form对象
            formdata1.append('img', file); // 通过append向form对象添加数据,可以通过append继续添加数据
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            //添加请求头
            axios.post(baseUrl + 'file/img', formdata1, config).then(function (res) {
                // console.log(res)
                if (res.data.code != '00') {
                    AlertModule.show({
                        title: res.data.msg
                    })
                } else {
                    // that.imgArr.push(res.data.data)
                    that.orifrontUrl = res.data.data;
                    var showUrl = that.$store.state.imgUrl + res.data.data
                    that.frontUrl = showUrl
                    // console.log(that.imgArr)  
                }
            })
        },

        // 选择反面
        chooseImageBack() {
            var that = this;
            var baseUrl = that.$store.state.baseUrl
            var file = document.getElementById("upload_file2").files[0];
            var formdata1 = new FormData(); // 创建form对象
            formdata1.append('img', file); // 通过append向form对象添加数据,可以通过append继续添加数据
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }; //添加请求头

            axios.post(baseUrl + 'file/img', formdata1, config).then(function (res) {
                if (res.data.code != '00') {
                    AlertModule.show({
                        title: res.data.msg
                    })
                } else {
                    // that.imgArr.push(res.data.data)
                    that.oribackUrl = res.data.data
                    var showUrl = that.$store.state.imgUrl + res.data.data
                    that.backUrl = showUrl
                    // console.log(that.imgArr)  
                }
            })
        },
        // 提交
        submitMsg() {
            var that = this;
            var postData = {
                degree: that.degree,
                school:that.school,
                onlinecode:that.schoolCode
            }
            var flag = true;
            console.log(that.schoolCode.trim())
            if(that.schoolCode.trim().length>25){
                 AlertModule.show({
                        title: "抱歉，验证码长度不能超过25个"
                    })
                    that.schoolCode=''
                    return false;
            }
            for (var i in postData) {
                if (!Boolean(postData[i])) {
                    AlertModule.show({
                        title: "请填写全部信息"
                    })
                    flag = false
                    break;
                }
                continue;
            }
            if (flag) {
                postData.uid = that.$store.state.uid;
                postData.othersCertificate = that.oribackUrl;
                postData.certificate=that.orifrontUrl;
                var baseUrl = this.$store.state.baseUrl;
               
                console.log(postData)
                that.$http("post", baseUrl + "api/WebUser/Certificate/Edu", postData).then(function (res) {
                    if (res.data.code != '00') {
                        AlertModule.show({
                            title: res.data.msg
                        })
                    } else {
                        AlertModule.show({
                            title: "提交成功！",
                            onHide() {
                                that.$router.go(-1)
                            }

                        })
                    }

                })
            }

        }

    }

}
</script>

<style scoped>
html,
body {
    height: 100%;
    background: #fff !important;
}
.tips{
  font-size: 12px;
  color: rgb( 255, 0, 0 );
  line-height: 1.5;
  margin-top: 10px;
  padding: 0 5px;
}
#educationAuthentication {
    padding: 56px 50px 60px 50px;
    height: 100%;
}

#educationAuthentication .eachHang {
    padding: 0px 14px;
    border-bottom: 1px solid #DDDDDD;
}

#educationAuthentication .eachHang .left {
    color: #858585;
    font-size: 13px;
}

#educationAuthentication .eachHang input {
    height: 100%;
    padding: 19px 0px;
    border: none;
}

#educationAuthentication .eachHang input::-webkit-input-placeholder {
    color: #C2C3C3;
    font-size: 13px;
}

#educationAuthentication .eachHang input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #C2C3C3;
    font-size: 13px;
}

#educationAuthentication .eachHang input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #C2C3C3;
    font-size: 13px;
}

#educationAuthentication .eachHang input:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #C2C3C3;
    font-size: 13px;
}

#educationAuthentication .eachHang.lastHang {
    border: none;
    margin-top: 20px;
}

#educationAuthentication .eachHang.lastHang .imgBox {
    margin-top: 20px;
    text-align: center;
    color: #C2C3C3;
    font-size: 12px;
}

#educationAuthentication .eachHang.lastHang .imgBox img {
    width: 92px;
    height: 63px;
    margin-bottom: 12px;
}

#educationAuthentication .submit_btn {
    margin-top: 128px;
}

#educationAuthentication .eachHang.lastHang input {
    display: none;
}
</style>
