<template>
<div id="myWallet">
    <div class="topBox bgW">
        <p>账户余额</p>
        <p class="money">
            ￥{{userData.amount}}
            <span>元</span>
        </p>
        <div class="btnBox flexCenter">
            <p class="" @click="toRecharge">
                <img src="../../assets/img/cz@2x.png" alt>
                <span>充值</span>
            </p>
            <p class="line"></p>
            <p class="" @click="cashWithdrawal">
                <img src="../../assets/img/tx@2x.png" alt>
                <span>提现</span>
            </p>
        </div>
    </div>
    <!-- 提现充值记录 -->
    <div class="content bgW">
        <div :class="!item.income?'each flexSpace tx':'each flexSpace cz' " v-for="item,index in feeRecordList">
            <div class="left">
                <p class="title tx">{{item.title}}</p>
                <p class="date">{{item.createTime}}</p>
            </div>
            <p class="right">
                {{item.income?'+'+item.amount:'-'+item.amount}}
            </p>
        </div>
    </div>
</div>
</template>

<script>
import common from "@/assets/js/common"

import {AlertModule} from 'vux'
export default {
    data() {
        return {
            uid: this.$store.state.uid,
            userData: {},
            feeRecordList: []
        }
    },
    components:{
        AlertModule
    },
    mounted() {
        this.getWebUser(this.uid);
        this.getFeeRecore();
       
        
    },
    methods: {
        ...common,
       
        // 获取余额明细GET /api/FeeRecord/List:feeRecordList
        getFeeRecore() {
            var that = this;
            var baseUrl = this.$store.state.baseUrl;
            that.$http('get', baseUrl + 'api/FeeRecord/List?uid=' + that.uid).then(function (res) {
                if (res.data.code != '00') {
                    AlertModule.show({
                        title: res.data.msg
                    })
                } else {
                    that.feeRecordList = res.data.data;
                }

            })
        },
        // 充值
        toRecharge() {
            this.$router.push({
                path: '/recharge'
            })
        },
        // // 提现
        cashWithdrawal() {
             this.$router.push({
                path: '/cashWithdrawal'
            })
        }
    }
};
</script>

<style>
#myWallet .topBox {
    text-align: center;
    padding-top: 30px;
    color: #666666;
    font-size: 12px;
    margin-bottom: 10px;

}

#myWallet .topBox .money {
    margin-top: 7px;
    color: #333;
    font-size: 18px;
    font-weight: 900;
    margin-bottom: 30px;
}

#myWallet .topBox .money span {
    font-size: 12px;
}

#myWallet .topBox .btnBox {
    border-top: 1px solid #f5f5f5;
    padding-top: 8px;
    padding-bottom: 8px;
    color: #333333;
    font-size: 15px;
    font-weight: bolder;
    flex-direction: row;
}

#myWallet .topBox .btnBox .line {
    width: 1px;
    height: 44px;
    background: #DEDEDE;
    margin: 0 55px;
}

#myWallet .topBox .btnBox img {
    width: 19px;
    height: 22px;

}

#myWallet .topBox .btnBox span {
    color: #333333;
    font-size: 15px;
    margin-left: 9px;
}

#myWallet .content {
    padding-left: 17px;
}

#myWallet .content .each {
    border-bottom: 1px solid #DEDEDE;
    padding: 16px;
    padding-left: 0;
}

#myWallet .content .each .title {
    color: #666666;
    font-size: 16px;
    margin-bottom: 4px;
}

#myWallet .content .each .date {
    color: #C2C2C2;
    font-size: 11px;
}

#myWallet .content .each.tx .right {
    font-size: 16px;
    color: #379AFF;
}

#myWallet .content .each.cz .right {
    font-size: 16px;
    color: #F83244;
}
</style>
