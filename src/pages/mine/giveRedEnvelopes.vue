<template>
<div id="giveRedEnvelopes">
    <img src="../../assets/img/hongbao.png"  class="hongbao" alt="">
    <div class="hongbaoBox flexCenter">
        <div class="each" v-for="item,index in moneyList" @click="chooseItem(index)">
            <i v-if="!item.isChoose" class="iconCircle"></i>
            <i v-if="item.isChoose" class="active iconfont icon-dagouyouquan"></i> {{item.value}}元
        </div>
    </div>
    <div class="btnBox">
        <button class="long_btn" @click="giveMoney">塞红包</button>
    </div>
</div>
</template>

<script>
import {AlertModule} from 'vux'
import wx from 'weixin-js-sdk';
export default {
    data() {
        return {
            moneyList: [{
                id: 0,
                value: 1,
                isChoose: true
            }, {
                id: 1,
                value: 5,
                isChoose: false
            }, {
                id: 2,
                value: 10,
                isChoose: false
            }, {
                id: 3,
                value: 20,
                isChoose: false
            }, {
                id: 4,
                value: 50,
                isChoose: false
            }, {
                id: 5,
                value: 99,
                isChoose: false
            }],
            uid:this.$route.query.uid,
            amount:1
        }
    },
    components:{
        AlertModule
    },
    mounted(){
        this.wxConfig()
    },
    methods: {
        chooseItem(index) {
            for (var i in this.moneyList) {
                this.moneyList[i].isChoose = false;
            }
            this.moneyList[index].isChoose = true;
            this.amount=this.moneyList[index].value;
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
        giveMoney(){
            var that = this;
            var baseUrl = this.$store.state.baseUrl;
            that.$http('post', baseUrl + 'api/Order/Red',
            {
                uid:that.$store.state.uid,
                amount:this.amount,
                taskId:this.$route.query.taskId
            }).then(function (res) {
                if (res.data.code != '00') {
                    AlertModule.show({
                        title: res.data.msg
                    })
                } else {
                   var  result=JSON.parse(res.data.data)
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
                                    path:'/mineIndex'
                                })
                            }
                        });
                    })
                }

            })
        }
    }
}
</script>

<style scoped>
#giveRedEnvelopes {
    padding-top: 114px;
    height: 100%;
    background: #fff;
}

#giveRedEnvelopes .hongbao {
    width: 63px;
    height: 72px;
    display: table;
    margin: 0 auto;
}

#giveRedEnvelopes .hongbaoBox {
    flex-wrap: wrap;
    flex-direction: row;
    text-align: center;
    margin-top: 30px;
}

#giveRedEnvelopes .hongbaoBox .each {
    width: 33.333%;
    display: flex;
    justify-content: center;
    margin-bottom: 48px;
    color: #464646;
    font-size: 16px;
    align-items: center;
}

#giveRedEnvelopes .hongbaoBox .each i {
    font-size: 18px;
    margin-right: 12px;
}

#giveRedEnvelopes .hongbaoBox .iconCircle {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid #CCCCCC;
    display: inline-block;
}

#giveRedEnvelopes .hongbaoBox .each i.active {
    color: #3375C5;
}

#giveRedEnvelopes .long_btn {
    margin-top: 45px;
    width: 90%;
}
</style>
