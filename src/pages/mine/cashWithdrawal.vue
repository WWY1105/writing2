<template>
<div id="cashWithdrawal">
    <div class="topBox bgW  flexSpace">
        <span class="title">提现金额</span>
        <input type="tel" :placeholder="'可提￥'+userData.amount" v-model="money">
        <i class="iconfont icon-jiantou"></i>
    </div>
    <p class="allCash" @click="tackAll">全部提现</p>
    <div class="topBox bgW  bottomBox ">
        <span class="title">提现渠道</span>
        <span>微信</span>
    </div>
    <div class="topBox bgW   bottomBox  ">
        <span class="title">微信账号</span>
        <span>已绑定</span>
    </div>
    <button class="long_btn" @click="cashWithdrawal">提交</button>
</div>
</template>

<script>
import wx from 'weixin-js-sdk';
import common from "@/assets/js/common"
import {
    AlertModule
} from 'vux'
export default {
    data() {
        return {
            uid: this.$store.state.uid,
            userData: {},
            money: ''
        }
    },
    mounted() {
        this.getWebUser(this.uid);
        //微信初始化
        this.wxConfig()
    },
    components: {
        AlertModule
    },
    methods: {
        ...common,
        // 点击全部提现
        tackAll() {
            this.money = this.userData.amount
        },
        //提交提现 因微信相关规则，需要扣除0.4%的手续费
        cashWithdrawal() {
            var that = this;
            var baseUrl = that.$store.state.baseUrl;
            AlertModule.show({
                title: '因微信相关规则，需要扣除1%的手续费',
                onHide: () => {
                    if (that.money && that.money > 0) {
                        that.$http('post', baseUrl + 'api/FeeRecord/Withdraw', {
                            uid: that.uid,
                            amount: that.money
                        }).then(function (res) {
                            if (res.data.code != '00') {
                                AlertModule.show({
                                    title: res.data.msg
                                })
                            } else {
                                AlertModule.show({
                                    title: "提现成功",
                                    onHide() {
                                        that.$router.push({
                                            path: '/cashWithdrawalSuccess'
                                        })
                                    }
                                })
                               var  result=JSON.parse(res.data.data)
                                console.log('提现了')
                                wx.ready(function () {
                                    wx.chooseWXPay({
                                        timestamp: result.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                                        nonceStr: result.nonceStr, // 支付签名随机串，不长于 32 位
                                        package: result.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                                        signType: result.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                                        paySign: result.paySign, // 支付签名
                                        success: function (res) {
                                            console.log('提现了' + res)
                                            // 支付成功后的回调函数
                                            that.$router.push({
                                                path: '/cashWithdrawalSuccess'
                                            })
                                        },
                                        fail: (res) => {
                                            AlertModule.show({
                                                title: "提现失败"
                                            })
                                        }
                                    });
                                })

                            }

                        })
                    } else {
                        AlertModule.show({
                            title: "请填写提现金额"
                        })
                    }

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
    }

}
</script>

<style scoped>
#cashWithdrawal .topBox {
    color: #333333;
    font-size: 13px;
    padding: 0 15px;
    border-bottom: 1px solid #EBEBEB;
}

#cashWithdrawal .topBox input {
    height: 100%;
    padding: 15px;
    line-height: 50px;
    border: none;
}

#cashWithdrawal .allCash {
    color: #3375C5;
    font-size: 13px;
    text-decoration: underline;
    margin: 15px 0 26px 11px;
}

#cashWithdrawal .bottomBox {
    height: 50px;
    justify-content: flex-start;
    line-height: 50px;
}

#cashWithdrawal .bottomBox .title {
    margin-right: 59px;
}

#cashWithdrawal .long_btn {
    margin-top: 20px;
    width: 90%;
}
</style>
