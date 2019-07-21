<template>
<div id="authorAuthentication" class="bgW">
    <div class="titleBox flexSpace">
        <span class="leftText">家教年限</span>
        <!-- <input type="text" v-model="year"> -->
        <sliderPopupPicker :gradesArr="yearsArr" :rightText="rightText"  v-on:changeResult="changeResultGrade"></sliderPopupPicker>
    </div>
   
    <div class="eachArea">
        <span class="titleBox leftText">机构背景</span>
        <group>
            <x-textarea style="background: #F5F5F5" v-model="value1" placeholder="例：“某年-某年：某培训机构”或“没有机构背景”"></x-textarea>
        </group>
    </div>
    <div class="eachArea">
        <span class="titleBox leftText">家教经历</span>
        <group>
            <x-textarea style="background: #F5F5F5" v-model="value2"></x-textarea>
        </group>
    </div>
    <!-- <div class="eachArea">
        <span class="titleBox leftText">写过的发行的家长名单</span>
        <group>
            <x-textarea style="background: #F5F5F5" v-model="value3"></x-textarea>
        </group>
    </div>
    <div class="eachArea">
        <span class="titleBox leftText">家教资质签发机构</span>
        <group>
            <x-textarea style="background: #F5F5F5" v-model="value4"></x-textarea>
        </group>
    </div>
     <div class="eachArea">
        <span class="titleBox leftText">资质号</span>
        <group>
            <x-textarea style="background: #F5F5F5" v-model="value0"></x-textarea>
        </group>
    </div> -->
    <div class="eachArea">
        <span class="titleBox leftText">家教资质验证资料（可选）</span>
        <div class="imgBox flexSpace">
            <div class="eachBox" @click.stop="frontImg">
                <img :src="frontUrl" alt="" v-if="frontUrl==''?false:true">
                <img src="../../assets/img/sfz@3x.png" alt="" v-if="frontUrl==''?true:false">
                <input v-if="isios" type="file" name="img" accept="image/*" id="upload_file1" mutiple="mutiple" class="add" @change="chooseImageFront">
                <input v-if="!isios" type="file" name="img" accept="image/*" id="upload_file1" capture="camera" mutiple="mutiple" class="add" @change="chooseImageFront">

                <!-- <img src="../../assets/img/sfz@3x.png" alt=""> -->
                <p class="text">材料1</p>
            </div>
            <div class="eachBox" @click.stop="backImg">
                <img :src="backUrl" alt="" v-if="backUrl==''?false:true">
                <img src="../../assets/img/sfz@3x.png" alt="" v-if="backUrl==''?true:false">
                <input v-if="isios" type="file" name="img" accept="image/*" id="upload_file2" mutiple="mutiple" class="add" @change="chooseImageBack">
                <input v-if="!isios" type="file" name="img" accept="image/*" id="upload_file2" capture="camera" mutiple="mutiple" class="add" @change="chooseImageBack">

                <!-- <img src="../../assets/img/sfz@3x.png" alt=""> -->
                <p class="text">材料2</p>
            </div>
        </div>
    </div>
    <button class="long_btn submit_btn" @click="submitData">提交</button>
</div>
</template>

<script>
import {
    XTextarea,
    Group,
    AlertModule
} from "vux";
import axios from 'axios'
import sliderPopupPicker from '@/components/sliderPopupPicker'
export default {
    data() {
        return {
            year: '',
            yearsArr: [],
            value1: '',
            value2: '',
            value3: '',
            value4: '',
            uid: this.$store.state.uid,
            isios: false,
            frontUrl: '',
            backUrl: '',
            rightText:'不限',
            orgfrontUrl:'',
            orgbackUrl:''
        }
    },
    components: {
        XTextarea,
        Group,
        AlertModule,
        sliderPopupPicker
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
        var arr = []
        for (let i = 0; i <= 100; i++) {
            arr.push(i)
        }
        this.yearsArr.push(arr);
        this.getUser()
    },
    methods: {
        getUser() {
            var that = this;
            var baseUrl = this.$store.state.baseUrl;
            var uid = that.$store.state.uid;
            that.$http('get', baseUrl + 'api/WebUser/' + uid).then(function (res) {
                that.shortName = res.data.data.nickname;
                // qualification
                 if(res.data.data.authorAuthInfo.qualification){
                    that.value0=res.data.data.authorAuthInfo.qualification;
                }
                if(res.data.data.authorAuthInfo.workAge){
                    that.rightText=res.data.data.authorAuthInfo.workAge;
                    that.year=res.data.data.authorAuthInfo.workAge;
                }
                if(res.data.data.authorAuthInfo.achievement){
                    that.value1=res.data.data.authorAuthInfo.achievement
                }
                if(res.data.data.authorAuthInfo.experience){
                    that.value2=res.data.data.authorAuthInfo.experience
                }
                if(res.data.data.authorAuthInfo.books){
                    that.value3=res.data.data.authorAuthInfo.books
                }
                if(res.data.data.authorAuthInfo.org){
                    that.value4=res.data.data.authorAuthInfo.org
                }
               
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
                    that.orgfrontUrl=res.data.data;
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
                    // that.imgArr.push(res.data.data)\
                    that.orgbackUrl=res.data.data;
                    var showUrl = that.$store.state.imgUrl + res.data.data
                    that.backUrl = showUrl
                    // console.log(that.imgArr)  
                }
            })
        },
        changeResultGrade(val) {
             console.log(val)
             this.rightText=val.value;
             this.year = val.value;
        },
        submitData() {
            var that = this;
            var data = {
                achievement: that.value1,
                books: that.value3,
                experience: that.value2,
                material: that.orgfrontUrl,
                org: that.value4,
                workAge: that.year,
                qualification:that.value0

            }
            console.log(data)
            var flag=true;
            // for(var i in data){
            //     if(!Boolean(data[i])){
            //          AlertModule.show({
            //             title:"请填写全部信息"
            //         })
            //         flag=false
            //         break;
            //     }
            //     continue;
            // }
            if(flag){
            data.othersMaterial=that.orgbackUrl;
            data.uid= that.$store.state.uid
            var baseUrl = this.$store.state.baseUrl;
            that.$http('post', baseUrl + 'api/WebUser/Certificate/Author', data).then(function (res) {
                if (res.data.code == '00') {
                    AlertModule.show({
                        title: '保存成功！',
                        onHide(){
                             that.$router.go(-1)
                        }
                    })
                } else {
                    AlertModule.show({
                        title: res.data.msg
                    })
                }
            })
            }
            
        }
    }
};
</script>

<style scoped>
#authorAuthentication {
    height: 100%;
    padding-top: 14px;
    padding-left: 50px;
    padding-right: 50px;
    padding-bottom: 1093px;
}

#authorAuthentication .leftText {
    color: #858585;
    font-size: 13px;
}

#authorAuthentication .titleBox {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #DDDDDD;

}

#authorAuthentication .titleBox input {
    height: 100%;
    border: none;
    text-align: right;
    color: #3375C5;
    font-size: 13px;
}

#authorAuthentication .eachArea .titleBox {
    border: none;
}

#authorAuthentication .vux-x-textarea.weui-cell {
    padding: 0;
    border-radius: 5px;
}

#authorAuthentication .imgBox {
    /* margin-top: 20px; */
    text-align: center;
    color: #C2C3C3;
    font-size: 12px;
}

#authorAuthentication .imgBox img {
    width: 92px;
    height: 63px;
    margin-bottom: 12px;
}

#authorAuthentication .submit_btn {
    margin-top: 45px;
}

#authorAuthentication .weui-cells:before {
    border: none
}
#authorAuthentication .imgBox input{
    display: none;
}
</style>
