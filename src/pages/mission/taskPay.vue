<template>
<div id="taskPay">
    <!-- 顶部输入金额的 -->
    <div class="topBox bgW">
        <div class="titleBox">
            <p class="title">
                支付金额
            </p>
        </div>
        <div class="content flexStart" style="text-align:center;">
            <div class="inputBox flexStart">
                <span>￥</span>
                <input type="number" :value="money">
            </div>
            </div>
        </div>
        <!-- 底部支付方式 -->
        <div class="bottomBox bgW">
            <div class="titleBox">
                <p class="title">
                    支付方式
                </p>
            </div>
            <div class="content">
                <!-- <div class="eachWay flexStart">
                <div class="leftIcon iconfont icon-qianbao"></div>
                <div class="text flexSpace">
                    <p>余额支付</p>
                    <p @click="isChoose=!isChoose">
                        <span :class="isChoose?'active':''">已选择</span>
                        <span v-if="!isChoose"> <i class="iconfont icon-gouxuan"></i></span>
                        <span v-if="isChoose" class="active"> <i class="iconfont icon-dagouyouquan"></i></span>
                    </p>
                </div>
            </div> -->
                <div class="eachWay flexStart" v-for="item,index in eachWay">
                    <div :class="'leftIcon iconfont '+item.icon"></div>
                    <div class="text flexSpace">
                        <p>{{item.text}} <span v-if="item.payType=='yue'"> <span v-if="money>userData.amount">（￥{{userData.amount}}，余额不足）</span></span></p>
                        <p @click="chooseWay(index)">
                            <span :class="item.isChoose?'active':''">{{item.isChoose?'已选择':"选择"}}</span>
                            <span v-if="!item.isChoose"> <i class="iconfont icon-gouxuan"></i></span>
                            <span v-if="item.isChoose" class="active"> <i class="iconfont icon-dagouyouquan"></i></span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <!-- 最底部按钮 -->
        <div class="btnBox flexSpace">
            <div class="left">
                实际支付<span> ￥</span><span class="num">{{money}}</span>
            </div>
            <div class="right">
                <button class="long_btn" @click="submit">
                确定支付
            </button>
            </div>
        </div>
    </div>
</template>

<script>
import wx from 'weixin-js-sdk';
import common from "@/assets/js/common"
import {
    InlineXNumber,
    AlertModule,
} from 'vux'
export default {
    data() {
        return {
            money: this.$route.query.amount,
            isChoose: false,
            uid: this.$store.state.uid,
            userData: {},
            eachWay: [{
                    text: '余额支付',
                    icon: 'icon-qianbao',
                    payType: 'yue',
                    isChoose: false
                },
                {
                    text: '微信支付',
                    icon: 'icon-weixin',
                    payType: 'weixinjs',
                    isChoose: false
                }
            ]
        }
    },
    components: {
        InlineXNumber,
        AlertModule,
    },
    mounted() {
        this.getWebUser(this.uid);
        //微信初始化
        this.wxConfig()
    },
    methods: {
        ...common,
        chooseWay(index) {
            var that = this;
            for (var i in that.eachWay) {
                that.eachWay[i].isChoose = false
            }
            that.eachWay[index].isChoose = true
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

        // 充值
        submit() {
            var that = this;
            var baseUrl = that.$store.state.baseUrl;
            var index;
            var payType = ''
            for (var i in that.eachWay) {
                if (that.eachWay[i].isChoose) {
                    index = i;
                    payType = that.eachWay[i].payType
                }
            }
            if (!index) {
                AlertModule.show({
                    title: "请选择支付方式"
                })
            } else if (that.money > that.userData.amount && index == 0) {
                AlertModule.show({
                    title: "余额不足，请选择微信支付"
                })
            } else {
                if (payType == 'yue') {
                    that.$http('post', baseUrl + 'api/Order/Pay/' + that.$route.query.taskId, {
                        payType: payType,
                        uid: that.$store.state.uid
                    }).then(function (res) {
                        if (res.data.code != '00') {
                            AlertModule.show({
                                title: res.data.msg
                            })
                        } else {
                            var result = JSON.parse(res.data.data)
                            // 支付成功后的回调函数
                            that.$router.push({
                                path: '/paySuccess'
                            })
                        }
                    })
                } else {
                    that.$http('post', baseUrl + 'api/Order/Pay/' + that.$route.query.taskId, {
                        payType: payType,
                        uid: that.$store.state.uid
                    }).then(function (res) {
                        if (res.data.code != '00') {
                            AlertModule.show({
                                title: res.data.msg
                            })
                        } else {
                            var result = JSON.parse(res.data.data)
                            wx.ready(function () {
                                wx.chooseWXPay({
                                    timestamp: result.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                                    nonceStr: result.nonceStr, // 支付签名随机串，不长于 32 位
                                    package: result.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                                    signType: result.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                                    paySign: result.paySign, // 支付签名
                                    success: function (res) {
                                        // 支付成功后的回调函数
                                        that.$router.push({
                                            path: '/paySuccess'
                                        })
                                    },
                                    fail: function (res) {
                                        // 支付成功后的回调函数
                                        that.$router.push({
                                            path: '/paySuccess'
                                        })
                                    }
                                });
                            })
                        }

                    })
                }

            }

        }
    }
}
</script>

<style scoped>
#taskPay {
    position: relative;
    height: 100%;
    background: #fff;
}

#taskPay .titleBox {

    border-top: 16px solid #f5f5f5;
}

#taskPay .titleBox .title,
#taskPay .bottomBox .title {
    padding: 19px 0;
    color: #858585;
    font-size: 13px;
    text-align: left;
    border-bottom: 1px solid #DEDEDE;
    padding-left: 15px;
}

#taskPay .bottomBox .title {
    text-align: left;
}

#taskPay .topBox .content {
    height: 70px;
    /* line-height: 170px; */
    color: #3375C5;
    font-size: 23px;
}

#taskPay .content .inputBox {
    flex-direction: row;
    padding-left: 15px;
}

#taskPay .content input {
    width: 100%;
    height: 100%;
    background: #fff;
    pointer-events: none;
    border: none;
    text-align: left;
    font-size: 23px;
    color: #3375C5;
}

#taskPay .content .circle {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid #DEDEDE;
}

#taskPay .bottomBox {
    /* margin-top:10px; */
    border-top: 10px solid #f5f5f5;
}

#taskPay .bottomBox .eachWay .leftIcon {
    font-size: 26px;
    color: #44C447;
    padding-left: 21px;
    padding-right: 17px;
}

#taskPay .bottomBox .eachWay .leftIcon.icon-qianbao {
    color: red;
}

#taskPay .bottomBox .eachWay .text {
    border-bottom: 1px solid #DEDEDE;
    padding: 21px 16px 21px 0;
    width: 100%;
}

#taskPay .bottomBox .eachWay .text .active {
    color: #3375C5;
}

#taskPay .btnBox {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 8px 15px;
}

#taskPay .btnBox .long_btn {
    width: 170px;
    margin-top: 0;
}

#taskPay .btnBox .left {
    color: #858585;
    font-size: 12px;

}

#taskPay .btnBox .left span {
    color: #3375C5;

}

#taskPay .btnBox .left span.num {
    color: #3375C5;
    font-size: 16px;
    font-weight: bolder;
}
</style>
