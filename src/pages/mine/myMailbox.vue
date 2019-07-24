<template>
<div id="myMailbox">
    <div class="eachMail flexSpace bgW" @click="toShowMailDetail(item.id)" v-for="item,index in msgList">
        <div class="imgBox">
            <img :src="item.user?$store.state.imgUrl+item.user.imgurl:''" class="userImg" alt>
            <span class="redDot" v-if="!item.read"></span>
        </div>
        <div class="text">
            <p class="flexSpace"><span class="name">{{item.user?item.user.nickname:''}}</span><span class="date">{{item.msgTime.substring(10,16)}}</span> </p>
            <p class="detailText">{{item.content}}</p>

            <!-- <span class="money" v-if="item.amount>0">红包：{{!item.amount?'0':item.amount}}元</span> -->

        </div>
    </div>
    <appFooter :nowPath="nowPath"></appFooter>
</div>
</template>

<script>
import common from "@/assets/js/common";
import appFooter from "@/components/footer/appFooter";
export default {
    data() {
        return {
            isSaw: false,
            uid: this.$store.state.uid,
            msgList: [],
            mailId: '',
            nowPath: '/myMailbox'
        };
    },
    components: {
        appFooter
    },
    mounted() {
        this.getMsgList();
    },
    methods: {
        ...common,
        // 获取私信列表/api/UserMsg/List
        getMsgList() {
            var that = this;
            var baseUrl = this.$store.state.baseUrl;
            // alert(that.uid)
            that
                .$http("get", baseUrl + "api/PrivateMsg/List", {
                    toUid: that.uid
                })
                .then(function (res) {
                    console.log(res.data.data);
                    var result = res.data.data;
                    that.mailId = result.id;
                    that.msgList = result;
                    console.log('000')
                    console.log(that.msgList)
                });
        },
        toShowMailDetail(id) {
            this.$router.push({
                path: "/mailDetail",
                query: {
                    mailId: id
                }
            })
        }
    }
};
</script>

<style scoped>
#myMailbox .eachMail {
    padding: 13px 23px 16px 11px;
    align-items: flex-start;
    /* margin-bottom: 10px; */
    padding-right: 0;
}

#myMailbox .eachMail .name {
    color: #333333;
    font-size: 15px;
    margin-bottom: 10px;
}

#myMailbox .eachMail .imgBox {
    position: relative;
}

#myMailbox .eachMail .text {
    width: 100%;
    border-bottom: 1px solid #DEDEDE;
    padding-right: 10px;
}

#myMailbox .eachMail .redDot {
    position: absolute;
    top: -5px;
    right: 5px;
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #ea4a5c;
}

#myMailbox .eachMail .detailText {
    font-size: 12px;
    color: #2D2D2D;
    margin-bottom: 10px;
}

#myMailbox .eachMail .date {
    font-size: 10px;
    color: #ACACAC;
}

#myMailbox .eachMail .money {
    font-size: 12px;
    color: #ea4a5c;
}

#myMailbox .userImg {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
    display: inline-block;
    border: 1px solid #e9e9e9;
}
</style>
