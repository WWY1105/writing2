<template>
<div id="privateMsgBox">
    <textarea name id placeholder="请输入私信内容，200字以内" v-model="content"></textarea>

    <!-- <div class="moneyBox" v-if="!toAuthod">
        <img class="icon" src="../../assets/img/hongbao.png" alt>
        <div class="hang flexSpace flexWrap">
            <div class="eachItem" @click="chooseItem(index)" v-for="item,index in hongBaoList" :key="index">
                <check-icon :value.sync="item.isChecked">{{item.yuan}}元</check-icon>
            </div>
        </div>
    </div> -->
    <!-- <div class="long_btn" v-if="!toAuthod" @click="sendMsgAndMoney">塞红包并发送</div> -->
    <div class="long_btn"  @click="sendPrivateMsg">发送私信</div>
</div>
</template>

<script>
import wx from 'weixin-js-sdk';
import {
    CheckIcon,
    AlertModule
} from "vux";
export default {
    name: "privateMsg",
    components: {
        CheckIcon,
        AlertModule
    },
    data() {
        return {
            yuan1: true,
            toAuthod: false,
            // hongBaoList: [{
            //         yuan: 1,
            //         isChecked: true
            //     },
            //     {
            //         yuan: 5,
            //         isChecked: false
            //     },
            //     {
            //         yuan: 10,
            //         isChecked: false
            //     },
            //     {
            //         yuan: 20,
            //         isChecked: false
            //     },
            //     {
            //         yuan: 50,
            //         isChecked: false
            //     },
            //     {
            //         yuan: 99,
            //         isChecked: false
            //     }
            // ],
            content: "",
            // 来自登陆用户
            fromUid: this.$store.state.uid,
            // 发送给上个页面带来的id
            uid: this.$route.query.writerId
        };
    },
    mounted() {
        this.wxConfig();
        this.getUser(this.uid)
    },
    methods: {
        chooseItem(index) {
            for (var i in this.hongBaoList) {
                this.hongBaoList[i].isChecked = false;
            }
            this.hongBaoList[index].isChecked = true;
        },
        getUser(uid) {
            var that = this;
            var baseUrl = that.$store.state.baseUrl;
            that.$http('get', baseUrl + 'api/WebUser/' + uid).then(function (res) {
                var type = res.data.data.type;
                // alert(type)
                if (type == 'business') {
                    that.toAuthod = false
                } else {
                    that.toAuthod = true;

                }
            })

        },
        // 微信Config
        wxConfig() {
            var that = this;
            var baseUrl = this.$store.state.baseUrl;
            var postData = {
                url: encodeURI("http://www.shuimujiajia.net/app/index.html")
            }
            that
                .$http("get", baseUrl + "WexinJsConfig", postData)
                .then(function (res) {
                    if (res.data.code != '00') {
                        AlertModule.show({
                            title: res.data.msg
                        })
                    } else {
                        var result = res.data.data;
                        wx.config({
                            debug: false, // 开启调试模式,
                            appId: result.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
                            timestamp: result.timestamp, // 必填，生成签名的时间戳
                            nonceStr: result.nonceStr, // 必填，生成签名的随机串
                            jsApiList: ["chooseWXPay"],
                            signature: result.signature, // 必填，签名，见附录1
                            jsToken: result.jsToken // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                        });
                    }
                })
        },
        //点击发送私信给家教
        sendPrivateMsg() {
            var that = this;
            var baseUrl = this.$store.state.baseUrl;

            var postData = {
                content: that.content,
                uid:that.fromUid,
                toUid: that.uid
            };
            that.$http("post", baseUrl + "api/PrivateMsg", postData).then(function (res) {
                if (res.data.code != "00") {
                    AlertModule.show({
                        title: res.data.msg
                    });
                } else {
                    AlertModule.show({
                        title: "发送成功",
                        onHide() {
                             that.$router.go(-1)
                        }
                    });

                }
            });

        },
        // 发送信息和红包给家长
        // sendMsgAndMoney() {
        //     var that = this;
        //     var yuan;
        //     for (var i in this.hongBaoList) {
        //         if (this.hongBaoList[i].isChecked) {
        //             yuan = this.hongBaoList[i].yuan;
        //         }
        //     }
        //     var baseUrl = this.$store.state.baseUrl;

        //     var postData = {
        //         content: that.content,
        //         uid: that.fromUid,
        //         toUid: that.uid,
        //         amount: yuan
        //     };
        //     that.$http("post", baseUrl + "api/PrivateMsg", postData).then(function (res) {
        //         if (res.data.code != "00") {
        //             AlertModule.show({
        //                 title: res.data.msg
        //             });
        //         } else {
        //             var result = JSON.parse(res.data.data)
        //             wx.ready(function () {
        //                 wx.chooseWXPay({
        //                     timestamp: result.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        //                     nonceStr: result.nonceStr, // 支付签名随机串，不长于 32 位
        //                     package: result.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
        //                     signType: result.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        //                     paySign: result.paySign, // 支付签名
        //                     success: function (res) {
        //                         // 支付成功后的回调函数
        //                         that.$router.push({
        //                             path: '/writerDetail',
        //                             query: {
        //                                 writerId: that.uid
        //                             }
        //                         })
        //                     }
        //                 });
        //             })

        //         }
        //     });
        // }
    }
};
</script>

<style scoped>
#privateMsgBox {
    background: #f5f5f5;
    padding: 20px 18px;
    /* min-height: 670px; */
}

textarea {
    padding: 16px;
    width: 100%;
    height: 207px;
    border-radius: 4px;
    border-color: rgba(178, 178, 178, 0.4);
    margin-bottom: 20px;
}

.moneyBox {
    background: #fff;
    width: 100%;
    height: 207px;
    border-radius: 4px;
    border: 1px solid rgba(178, 178, 178, 0.4);
    margin-bottom: 45px;
}

.moneyBox img.icon {
    margin: 18px auto 17px auto;
    display: table;
    width: 63px;
    height: 72px;
}

.eachItem {
    width: 33.333%;
    text-align: center;
    margin-bottom: 25px;
}

.vux-check-icon>span {
    color: #464646 !important;
    font-size: 16px;
}

.weui-icon-circle {
    font-size: 18px;
}

.long_btn {
    width: 100%;
    line-height: 40px;
    text-align: center;
    font-size: 16px;
    margin-top: 45px;
}
</style>
