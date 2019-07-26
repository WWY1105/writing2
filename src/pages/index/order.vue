<template>
<div id="Order">
    <!-- 任务列表 -->
    <div class="reacResult" id="resultPeoples">
        <div :class="'eachPeople bgW '+item.borderColor" v-for="item,index of postList" @click="toSeeOrderDetail(index)">
            <div class="titleBox flexSpace padding11">
                <div class="left flexStart">
                    <img :src="item.user?$store.state.imgUrl+item.user.imgurl:''" class="userImg" alt>
                    <div>
                        <p class="name">{{item.user?item.user.nickname:''}}</p>
                    </div>
                </div>
                <div class="right flexEnd">
                    <span class="priceDesc">费用预算</span>
                    <p class="price">{{'￥'+item.fee.split('-')[0]+'-￥'+item.fee.split('-')[1]}}</p>

                </div>
            </div>
            <div class="content">
                <div class="details">
                    <p class="hang flexStart">
                        <span class="eachItem">年级：{{item.classNo}}</span>
                        <span class="eachItem">科目：{{item.subject}}</span>
                    </p>
                    <p class="hang flexStart">
                        <span class="eachItem">上课：{{item.coordination=='online'?'远程协作':item.coordination=='busniess'?'家长拜访':'家教拜访'}}</span>

                        <span class="eachItem add">区域：{{item.area}}</span>
                    </p>

                    <p class="hang">
                        <span>简述：{{item.introduction}}</span>
                    </p>
                </div>
            </div>
            <div class="otherMsg flexSpace">
                <p class="left">
                    <span>截至报名：{{!item.deadline?"":item.deadline.substr(0,10)}}</span>

                    <span>已报名：{{item.applicationCount}}</span>
                </p>

                <p class="right">
                    <!-- <button class="submitBtn" @click.stop="toEnroll(index)" v-if="$store.state.userType=='author'">报名</button> -->
                    <button :class="$store.state.userType == 'author'&&item.status=='3'||$store.state.userType == 'business'&&item.status=='2'?'submitBtn':'submitBtn submitBtnDis'">
                        {{item.statusText}}
                    </button>
                </p>
            </div>
        </div>
    </div>
    <!-- 任务列表 end-->
    <appFooter :nowPath="nowPath"></appFooter>
</div>
</template>

<script>
import appFooter from "@/components/footer/appFooter";
export default {
    data() {
        return {
            //任务列表
            postList: [],
            postData: {},
            uid: this.$route.query.uid,
            isCancel: false,
            userData: {},
            showAllMsg: false,
            nowPath: '/order'
        };
    },
    components: {
        appFooter
    },
    created() {
        this.getMIssionlist();
    },
    mounted() {

        this.getUser(this.$store.state.uid);
        //  alert(this.$route.query.showAllMsg)
        if (this.$route.query.showAllMsg) {
            this.showAllMsg = this.$route.query.showAllMsg;
        }

    },
    methods: {
        getUser(uid) {
            var that = this;
            var baseUrl = that.$store.state.baseUrl;
            that.$http('get', baseUrl + 'api/WebUser/' + uid).then(function (res) {
                that.userData = res.data.data;
            })

        },
        // 查看任务详情
        toSeeOrderDetail(i) {
            // var id = this.postList[i].id;
            // var taskStatus = this.postList[i].status;
            // var type = this.userData.type;
            // var status = this.postList[i].status;

            // var autherId = this.postList[i].authorId;
            // var isAuthor = false;;
            // if (autherId == this.$store.state.uid) {
            //     isAuthor = true;
            // }
            var that = this;
            // 任务的id
            var id = that.postList[i].id;
            // 任务发布人的id
            var postUid = that.postList[i].uid;
            var isMyTask = false;
            if (postUid == that.$store.state.uid) {
                isMyTask = true;
            }
            var isAuthor;

            if (that.postList[i].authorId == that.$store.state.uid) {
                isAuthor = true;
            }
            that.$router.push({
                path: "/missionDetail",

                query: {
                    id: id,

                    isMyTask: isMyTask
                }
            });

        },
        // 获取任务列表
        getMIssionlist() {
            const that = this;
            // 对家长状态(1-报名中,2-已选择,3-已评价,4-已失效,5-已取消),, 对家教状态(1-已报名,2-未选中,3-待评价,4-已完成)) ,
            if (that.$store.state.userType == 'author') {
                // 家教获取订单列表
                that.$http('get', that.$store.state.baseUrl + 'api/Order/apply?uid=' + that.$store.state.uid).then(function (res) {
                    res.data.data.forEach((item, index) => {
                        switch (item.status) {
                            case 1:
                                item.statusText = '已报名'
                                break;
                            case 2:
                                item.statusText = '未选中'
                                break;
                            case 3:
                                item.statusText = '待评价'
                                break;
                            case 4:
                                item.statusText = '已结束'
                                break;
                        }
                    })
                    that.postList = res.data.data;

                })
            } else {
                // 家长获取发布的订单
                that.$http('get', that.$store.state.baseUrl + 'api/Order/List?uid=' + that.$store.state.uid).then(function (res) {
                    res.data.data.forEach((item, index) => {
                        switch (item.status) {
                            case 1:
                                item.statusText = '报名中'
                                break;
                            case 2:
                                item.statusText = '待评价'
                                break;
                            case 3:
                                item.statusText = '可追评'
                                break;
                            case 4:
                                item.statusText = '已失效'
                                break;
                            case 5:
                                item.statusText = '已失效'
                                break;
                        }
                    })
                    that.postList = res.data.data;
                })
            }

        }

    }
};
</script>

<style scoped>
#Order {
    background: #f5f5f5;
    padding-bottom: 60px;
}

.priceDesc {
    color: #707070;
    font-size: 12px;
}

#Order .topTab {
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    padding-right: 20px;
    margin-bottom: 10px;
}

#order #resultPeoples .userImg {
    width: 40px;
    height: 40px;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 50%;
}

#Order .topTab .item {
    font-size: 15px;
    color: #636363;
    padding-left: 10px;
    padding-right: 10px;
}

#Order .topTab .item.active {
    color: #3375c5;
    border-bottom: 2px solid #3375c5;
}

.topBox {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #cecece;
    background: #fff;
}

.line {
    width: 1px;
    height: 28px;
    background: #cecece;
    display: inline-block;
}

.topBox .eachBtn {
    display: flex;
    padding-left: 6px;
    padding-right: 6px;
}

.topBox .eachBtn i {
    padding-left: 6px;
    color: #3375c5;
}

.topBox .eachBtn.shortOne {
    padding-left: 28px;
    padding-right: 22px;
}

.topBox .eachBtn.lastItem {
    background: #3375c5;
    color: #fff;
    font-weight: bold;
    height: 40px;
}

.topBox .eachBtn.lastItem i {
    color: #fff;
}

#resultPeoples {
    background: #f5f5f5;
}

.eachPeople {
    /* padding: 11px; */
    /*padding-bottom: 0;*/
    /*margin-top: 10px;*/
    margin-bottom: 10px;
}

.eachPeople.ss {
    border-bottom: 4px solid #2ea200;
}

.eachPeople.zz {
    border-bottom: 4px solid #3375c5;
}

.eachPeople.sz {
    border-bottom: 4px solid #feab29;
}
.reacResult{
    margin-top: 0!important;
}

.reacResult .right .button {
    font-size: 14px;
    padding: 1px 7px 1px 12px;
    border-radius: 5px;
    margin-bottom: 8px;
}

.reacResult .right .button.searchSS {
    color: #2ea200;
    border: 1px solid #2ea200;
}

.reacResult .right .button.searchZZ {
    color: #3375c5;
    border: 1px solid #3375c5;
}

.reacResult .right .button.searchSZ {
    color: #feab29;
    border: 1px solid #feab29;
    word-break: keep-all;
}

.eachPeople .otherMsg {
    padding: 11px 11px 14px 11px;
    color: #999999;
    font-size: 12px;
    /* background: #f5f5f5; */
}

.padding11 {
    padding: 11px;
}

.eachPeople .submitBtn {
    width: 60px;
    height: 21px;
    background: #3375c5;
    color: #fff;
    border-radius: 5px;
    font-weight: bold;
    border: none;
}

.eachPeople .submitBtn.submitBtnDis {
    background: #B2B2B2;
}

#resultPeoples.reacResult .content {
    padding: 5px 17px;
}

#resultPeoples.reacResult .details {
    display: block;
    color: #707070;
    /* background: #fff; */
    /* padding: 14px 17px; */
}

#resultPeoples.reacResult .titleBox {
    margin-bottom: 0;
    /* border-bottom: 1px solid #cecece; */
}

#resultPeoples.reacResult .hang {
    width: 100%;
    text-align: left;
    margin-bottom: 7px;
}

#resultPeoples.reacResult span.eachItem {
    width: 50%;
    display: inline-block;
}

#resultPeoples.reacResult span.eachItem.add {
    width: 66%;
}

.smalltitle {
    color: #242424;
    font-size: 14px;
    padding: 10px 16px;
}

.weui-cell {
    /* padding: 10px 16px; */
    height: 44px;
}

.popBtnBox,
.vux-popup-dialog {
    background: #fff;
    z-index: 9999999999999999999999;
}

.popBtnBox .weui-btn {
    width: 100% !important;
    margin-bottom: 13px;
}

#Order .priceBox {
    padding: 10px 16px;
    /*background: #f5f5f5;*/
    border-bottom: 1px solid #d9d9d9;
}

#Order .priceBox span.title {
    font-size: 14px;
    color: #242424;
}

#Order .vux-x-textarea.weui-cell {
    padding: 0 15px;
    font-size: 14px;
    color: #242424;
}

#Order .priceBox input {
    width: 80px;
    height: 30px;
    border: 1px solid #eee;
    border-radius: 5px;
    background: #fff;
    padding: 5px;
}

#Order .vux-cell-box.areaBox {
    padding: 5px 0px;
    border-bottom: 1px solid #d9d9d9;
}

.reacResult p.name {
    /* max-width: 30%; */
    text-overflow: ellipsis;
}

#resultPeoples.reacResult .details {
    display: block;
    color: #707070;
    /* background-clip: content-box; */
}

#resultPeoples.reacResult .hang {
    width: 100%;
    text-align: left;
    margin-bottom: 7px;
    /* padding: 5px 10px; */
}

#resultPeoples.reacResult span.eachItem {
    width: 50%;
    display: inline-block;
    max-width: 50%;
}

.smalltitle {
    color: #242424;
    font-size: 14px;
    padding: 10px 16px;
}

/* // ======================== */
</style>
