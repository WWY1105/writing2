<template>
<div id="realNameAuthentication" class="bgW">

    <div class="flexSpace eachHang">

        <span class="left">姓氏</span>

        <input type="text" v-model="firstName" placeholder="请填写您的真实姓氏">

        </div>

        <div class="flexSpace eachHang">

            <span class="left">名字</span>

            <input type="text" v-model="secondName" placeholder="请填写您的真实名字">

        </div>

            <div class="flexSpace eachHang">

                <span class="left">身份证号</span>

                <input type="number" v-model="idCard" placeholder="请填写您的身份证号">

        </div>

                <div class="eachHang lastHang">

                    <span class="left">身份证照</span>

                    <div class="imgBox flexSpace">

                        <div class="eachBox" @click.stop="frontImg">

                            <div class="imgBoxs">
                                <!-- :style="'background: url('+frontUrl+')'" -->
                                <img :src="frontUrl" alt="" v-if="frontUrl==''?false:true">
                                <img src="../../assets/img/sfz@3x.png" alt="" v-if="frontUrl==''?true:false">
                                <input v-if="isios" type="file" name="img" accept="image/*" id="upload_file1" mutiple="mutiple" class="add" @change="chooseImageFront">
                                <input v-if="!isios" type="file" name="img" accept="image/*" id="upload_file1" capture="camera" mutiple="mutiple" class="add" @change="chooseImageFront">

                    </div>

                                <p class="text">身份证正面</p>

                            </div>

                            <div class="eachBox" @click.stop="backImg">

                                <div class="imgBoxs">
                                    <img :src="backUrl" alt="" v-if="backUrl==''?false:true">
                                    <img src="../../assets/img/sfz@3x.png" alt="" v-if="backUrl==''?true:false">
                                    <input v-if="isios" type="file" name="img" accept="image/*" id="upload_file2" mutiple="mutiple" class="add" @change="chooseImageBack">
                                    <input v-if="!isios" type="file" name="img" accept="image/*" id="upload_file2" capture="camera" mutiple="mutiple" class="add" @change="chooseImageBack">

                                 </div>

                                    <p class="text">身份证背面</p>

                                </div>

                            </div>

                        </div>

                        <button class="long_btn submit_btn" @click='submitMsg'>提交</button>

                        <!--<uploader></uploader>-->

                    </div>
</template>

<script>
import uploader from "@/components/uploader";
import axios from 'axios'
import {
    AlertModule
} from 'vux'
import common from "@/assets/js/common";
export default {

    components: {

        uploader

    },

    data() {
        return {
            firstName: "",
            secondName: "",
            idCard: "",
            isios: false,
            frontUrl: '',
            orifrontUrl:'',
            oribackUrl: '',
            backUrl: '',
            shortName: '',
            userData:{}
        };

    },
    components: {
        AlertModule
    },

    mounted() {
        var that = this;
        that.getNickname()
        //获取浏览器的userAgent,并转化为小写
        var ua = navigator.userAgent.toLowerCase();
        //判断是否是苹果手机，是则是true
        var isIos = ua.indexOf("iphone") != -1 || ua.indexOf("ipad") != -1;
        if (isIos) {
            that.isios = true;
        } else {
            that.isios = false;
        }
        // this.getWebUser(this.$store.state.uid)

    },

    methods: {
        ...common,
        
        // 获取nickname
        getNickname() {
            var that = this;
            var baseUrl = this.$store.state.baseUrl;
            var uid = that.$store.state.uid;
            that.$http('get', baseUrl + 'api/WebUser/' + uid).then(function (res) {
                that.shortName = res.data.data.nickname;
                if(res.data.data.realName.firstName){
                    that.firstName=res.data.data.realName.firstName
                }
                if(res.data.data.realName.secondName){
                    that.secondName=res.data.data.realName.secondName
                }
                if(res.data.data.realName.idCard){
                    that.idCard=res.data.data.realName.idCard
                }
                // console.log(that.shortName)
                // console.log(str1)
                // console.log(str2)
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
            }; //添加请求头
            axios.post(baseUrl + 'file/img', formdata1, config).then(function (res) {
                if (res.data.code != '00') {
                    AlertModule.show({
                        title: res.data.msg
                    })
                } else {
                    that.orifrontUrl=res.data.data;

                    var showUrl = that.$store.state.imgUrl + res.data.data
                    that.frontUrl = showUrl
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
                // console.log(res)
                if (res.data.code != '00') {
                    AlertModule.show({
                        title: res.data.msg
                    })
                } else {
                     that.oribackUrl=res.data.data;
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
                firstName: that.firstName,
                secondName: that.secondName,
                idCard: that.idCard,
                cardFront: that.orifrontUrl,
                cardReverse: that.oribackUrl
            }
            var flag = true;

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
                var baseUrl = this.$store.state.baseUrl;
                that.$http("post", baseUrl + "api/WebUser/Certificate/RealName", postData).then(function (res) {
                    if (res.data.code != '00') {
                        AlertModule.show({
                            title: res.data.msg
                        })
                    } else {
                        // 提交nickname
                        var str1 = that.shortName.slice(0, -2);
                        var str2 = that.shortName.slice(-2)
                        that.shortName = str1 + that.firstName + str2;
                        var url = that.$store.state.baseUrl + '/api/WebUser/' + that.$store.state.uid;
                        that.$http('put', url, {
                            nickname: that.shortName
                        }).then(function (res) {
                            if (res.data.code == "00") {
                                AlertModule.show({
                                    title: "保存成功！",
                                    onHide() {
                                        that.$router.push({
                                            path: '/mineIndex'
                                        })
                                    }
                                });
                                that.getWebUser()
                            } else {
                                AlertModule.show({
                                    title: res.data.msg
                                });
                            }
                        });

                    }

                })
            }

        }

    }

};
</script>

<style scoped>
html,

body {

    height: 100%;

    background: #fff !important;

}

#realNameAuthentication {

    padding: 56px 50px 60px 50px;

    height: 100%;

}

#realNameAuthentication .eachHang {

    padding: 0px 14px;

    border-bottom: 1px solid #dddddd;

}

#realNameAuthentication .eachHang .left {

    color: #858585;

    font-size: 13px;

}

#realNameAuthentication .eachHang input {

    height: 100%;

    padding: 19px 0px;

    border: none;

}

#realNameAuthentication .eachHang input::-webkit-input-placeholder {

    color: #c2c3c3;

    font-size: 13px;

}

#realNameAuthentication .eachHang input::-moz-placeholder {

    /* Mozilla Firefox 19+ */

    color: #c2c3c3;

    font-size: 13px;

}

#realNameAuthentication .eachHang input:-moz-placeholder {

    /* Mozilla Firefox 4 to 18 */

    color: #c2c3c3;

    font-size: 13px;

}

#realNameAuthentication .eachHang input:-ms-input-placeholder {

    /* Internet Explorer 10-11 */

    color: #c2c3c3;

    font-size: 13px;

}

#realNameAuthentication .eachHang.lastHang {

    border: none;

    margin-top: 20px;

}

#realNameAuthentication .eachHang.lastHang .imgBox {

    margin-top: 20px;

    text-align: center;

    color: #c2c3c3;

    font-size: 12px;

}

#realNameAuthentication .eachHang.lastHang .imgBoxs img {

    /* background: url("../../assets/img/sfz@3x.png"); */

    /* background-size: cover; */

    width: 92px;

    height: 63px;

}

#realNameAuthentication .eachHang.lastHang .imgBox input {

    display: none;

    margin-bottom: 12px;

}

#realNameAuthentication .submit_btn {

    margin-top: 128px;

}
</style>
