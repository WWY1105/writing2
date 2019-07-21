<template>
<div id="postCircle">
    <div class="postContent bgW">
        <x-textarea v-model="content" placeholder="说点什么.." :height="145"></x-textarea>
        <div class="addpic flexStart">
            <img :src="$store.state.imgUrl+item"  type="file" class="chooseImg" v-for="item,index in showImgArr">

            <input v-if="isios"  type="file" name="img" accept="image/*" id="upload_file"   mutiple="mutiple"   class="add" @change="chooseImage"/>
            <input v-if="!isios" type="file" name="img" accept="image/*" id="upload_file"   mutiple="mutiple"   class="add" @change="chooseImage"/>
           <!-- capture="camera" -->
            <button class="add" @click="clickChoose">
                 <i class="iconfont icon-jia"></i>
            </button>
        </div>
    </div>
    <div class="btnBox">

        <button class="long_btn" @click="toPostCircle">发表</button>
    </div>
</div>
</template>

<script>
// import wx from 'weixin-js-sdk';
import common from "@/assets/js/common";
import axios from 'axios'
import {
    XTextarea,
    AlertModule
} from "vux";
export default {
    components: {
        XTextarea,
        AlertModule
    },
    data() {
        return {
            content: "",
            uid: this.$store.state.uid,
            content: "",
            chooseSrc: [],
            imgVal: '',
            imgArr: [],
            showImgArr: [],
            isios: false
        };
    },
    mounted() {
        //获取浏览器的userAgent,并转化为小写
        var ua = navigator.userAgent.toLowerCase();
        //判断是否是苹果手机，是则是true
        var isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1);
        //  alert(isIos)
        if (isIos) {
            this.isios = true;
        } else {
            this.isios = false
        }
    },
    methods: {
        ...common,
        clickChoose() {
            var file = document.getElementById("upload_file");
            file.click()
        },
        // 选择图片
        chooseImage() {
             console.log(this.imgArr.length)
            var that = this;
            if (that.imgArr.length <= 8) {
                var file = document.getElementById("upload_file").files[0];

                //    ===============  ===============
                // lrz(file, {
                //     width: 480
                // }).then(function (rst) {
                    var formdata1 = new FormData(); // 创建form对象
                    formdata1.append('img', file); // 通过append向form对象添加数据,可以通过append继续添加数据
                    //    ===============  ===============
                    let config = {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }; //添加请求头
                    axios.post(that.$store.state.baseUrl + 'file/img', formdata1, config).then(function (res) {
                        // console.log(res)
                        if (res.data.code != '00') {
                            AlertModule.show({
                                title: res.data.msg
                            })
                        } else {
                            that.imgArr.push(res.data.data)
                            that.showImgArr.push(res.data.data)
                            console.log(that.showImgArr)
                        }
                    })
                    // return rst;
                // }).always(function (e) {
                //     // 清空文件上传控件的值
                //     e.target.value = null;
                // })
            } else {
                AlertModule.show({
                    title: "抱歉，最多只能选择9张图片"
                })
            }
        },
        // 发布圈子
        toPostCircle() {
            var that = this;
            var baseUrl = this.$store.state.baseUrl;
            var postData = {
                content: that.content,
                uid: that.uid,
                imgurls: that.imgArr.join(',')
            };
            console.log(JSON.stringify(that.imgArr.join(',')))
            that
                .$http("post", baseUrl + "api/Circle", postData)
                .then(function (res) {
                    if (res.data.code != '00') {
                        AlertModule.show({
                            title: res.data.msg
                        })
                    } else {
                        AlertModule.show({
                            title: "发表成功！",
                            onHide: function () {
                                that.$router.push({
                                    name: 'circle'
                                })
                            }
                        })

                    }
                });
        }
    }
};
</script>

<style scoped>
#postCircle {
    padding-top: 10px;
}

#upload_file {
    opacity: 0;
    display: none;
}

#postCircle .postContent .addpic button.add {
    width: 79px;
    height: 79px;
    border: 1px dotted #505050;
    margin-left: 10px;
    margin-bottom: 16px;
    color: #bbbbbb;
    line-height: 79px;
    text-align: center;
}

#postCircle .postContent .addpic button.add i {
    font-size: 43px;
}

#postCircle .btnBox {
    padding: 0 10px;
}

#postCircle .long_btn {
    width: 100%;
    margin-top: 60%;
}

#postCircle .chooseImg {
    width: 79px;
    height: 79px;
    border: 1px solid #ccc;
    margin-left: 10px;
    margin-bottom: 16px;
}

#postCircle .addpic {
    flex-wrap: wrap;
}
</style>
