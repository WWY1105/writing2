<template>
<div id="supplementMissionDetail">
    <!--任务详情（家长版）-->
    <div class="topBox bgW">
        <div class="hang flexSpace">
            <p class="left"><span class="title">发布者：</span><span v-id="nickname">{{nickname}}</span></p>
            <p class="right">{{showData.category}}/{{showData.classNo}}</p>
        </div>
        <div class="hang flexSpace">
            <p class="left"><span class="title">服务提供者：</span><span v-id="showData.authorId">{{nicknameArr.length==0?'':nicknameArr.join(',')}}</span></p>
            <p class="right">{{showData.priceType =='1'?'1对1':"1对多"}}/{{showData.coordination=="online"?"远程协作":showData.coordination=="author"?"家教上课":"家长拜访"}}</p>
        </div>
        <div class="hang flexSpace">
            <p class="left"><span class="title">服务接收者：</span><span>{{nickname}}</span></p>
            <p class="right">{{showData.area}}</p>
        </div>
    </div>
    <div class="contentText">
        <div class="each">
            <span class="title">简述：{{showData.introduction}}</span>
        </div>
        <div class="each">
            <span class="title">详述：{{showData.content}}</span>
        </div>
    </div>

    <!--进度条-->
    <div class="stepBox flexSpace bgW">
        <div class="line"></div>
        <div class=" item flexCenter">
            <p class="circle"></p>
            <p class="text">待确认</p>
        </div>
        <div class=" item flexCenter">
            <p class="circle"></p>
            <p class="text">执行</p>
        </div>
        <div class="item active flexCenter">
            <p class="circle"></p>
            <p class="text">结束</p>
        </div>
    </div>
    <div class="statusBox flexSpace bgW">
        <p class="left">状态：补充登记</p>
        <div class="right">
        </div>
    </div>
  

     <!-- 每个部分 -->
    <div class="eachPart bgW">
        <div class="title flexSpace">
            <div class="left">费用明细与细节</div>
        </div>
        <div class="content">
            <div class="hang flexSpace">
                <p class="left"><span class="title">总费用：</span><span class="mainText">{{stageDetail.price}}</span></p>
                <p class="right "><span class="title">开始日期：</span><span class="mainText">{{stageDetail.beginDate.substr(0,10)}}</span></p>

            </div>
            <div class="hang flexSpace">
                <p class="left "><span class="title">阶段次数:</span><span class="mainText">{{stageDetail.stage}}次</span></p>
                <p class="right "><span class="title">结束日期：</span><span class="mainText">{{stageDetail.endDate.substr(0,10)}}</span></p>

            </div>
            <div class="hang flexSpace">
                <p class="left"><span class="title">每次时长：</span><span class="mainText">{{stageDetail.timeStage}}</span></p>
                <p class="right"><span class="title">支付方式：</span><span class="mainText">分阶段在线支付</span></p>
            </div>
            <div  class="hang flexSpace">
                <p class="left"><span class="title">总共时长:</span><span class="mainText">{{stageDetail.totalTime}}</span></p>
                <p class="right"><span class="title">手续费({{serviceRate*100}}%)：</span><span class="mainText redText">{{stageDetail.handlingFee}}</span></p>
            </div>
            <div class="hang flexSpace">
                <p class="left "><span class="title">费用单价：</span><span class="mainText">￥{{Math.floor((stageDetail.price-stageDetail.handlingFee-stageDetail.adjustmentFee)/stageDetail.totalTime*100)/100}}/人时</span></p>
                <p class="right"><span class="title">推荐费({{adjustmentRate*100}}%)：</span><span class="mainText redText">{{stageDetail.adjustmentFee}}</span></p>

            </div>
            <div class="lastHang flexStart">
                <div class="bigTitle">每阶段实际到账：<span>
                    <span class="mainText">￥{{Math.floor(((stageDetail.price-stageDetail.handlingFee-stageDetail.adjustmentFee)/stageDetail.timeStage)*100)/100}}</span>
                    </span> </div>
            </div>
        </div>
    </div>









    <!-- 每个部分 -->
    <!-- <div class="eachPart bgW">
        <div class="title flexSpace">
            <div class="left">执行情况</div>
            <div class="">下一阶段：{{nextStageTime}}</div>
        </div>
        <div class="content">
            <div class="hang hangList" v-for="item,index in stageDetail.infos">
                <p class="times flexSpace">
                    <span>第{{index+1}}次</span><span>{{item.registerTime}}</span>
                </p>
                <p class="main">计划：{{item.content}}</p>
                <p class="bottom">结果：{{item.success?'按期完成':"待完成"}}</p>
            </div>
        </div>
    </div> -->
    <!-- <div class="eachPart commentPart bgW">
        <div class="title flexSpace">
            <div class="left">家长评价</div>
        </div>
        <div class="content">
            <div class="eachComment flexStart" v-for="item,index in commentList">
                <img  :src="$store.state.imgUrl+item.webUser.imgurl" alt="">
                <div class="right">
                    <div class="flexSpace">
                        <p class="name">{{item.webUser.nickname}}</p>
                        <p class="date">{{item.commentTime}}</p>
                    </div>
                    <p class="content">{{item.content}}</p>
                    <p class="tags">
                        <span class="eachTags" v-for="item,index in item.commentTags">{{item}}</span>
                    </p>
                </div>
            </div>
        </div>
    </div> -->
    <div class="btnBox bgW"><button class="long_btn" @click.stop="giveRed">赞赏家教红包</button></div>

</div>
</template>

<script>
import common from '@/assets/js/common'

import {
    XButton,
    Group,
    PopupPicker,
    Datetime,
    AlertModule
} from 'vux'

export default {
    components: {
        XButton,
        Group,
        PopupPicker,
        Datetime,
        AlertModule
    },
    data() {
        return {
            missionId: this.$route.query.id,
            showData: {},
            nickname: '',
            stageDetail: {},
            commentList: [],
            nicknameArr: [],
            missionCancelMsg: {},
            nextStageTime: '',
            userData:{},
            
              serviceRate: 0,
            adjustmentRate: 0,
        }
    },

    mounted() {
   // 推荐费
        this.getBaseRate();
        this.getMissiondetail(this.missionId);
        this.getCommentList(this.missionId);
        this.getStageDetail();
        this.getConfirmWriter(this.missionId)
        
    },
    methods: {
        ...common,
        // 获取任务详情
        getMissiondetail(id) {
            var that = this;
            that.$http('get', that.$store.state.baseUrl + 'api/Order/' + id + "?uid=" + that.$store.state.uid).then(function (res) {
                if (res.data.code == '00') {
                    // 1-发布中,2-已选定服务人,3-执行中,4-已结束,6-已经取消,99-已失败
                    switch (res.data.data.status) {
                        case 1:
                            res.data.data.status = '发布中'
                            break;
                        case 2:
                            res.data.data.status = '已选定服务人'
                            break;
                        case 3:
                            res.data.data.status = '双方已确认代付款'
                            break;
                        case 4:
                            res.data.data.status = '已结束'
                            break;
                        case 6:
                            res.data.data.status = '已取消'
                            break;
                        case 7:
                            res.data.data.status = '已有人报名'
                            break;
                        case 8:
                            res.data.data.status = '执行中'
                            break;
                        case 88:
                            res.data.data.status = '取消中'
                            break;
                        case 99:
                            res.data.data.status = '已失败'
                            break;
                    }
                    var result = res.data.data.infos;
                    for (var i in result) {
                        if (result[i].success) {
                            continue;
                        } else {
                            that.nextStageTime = result[i].date;
                            break;
                        }
                    }

                    that.nickname = res.data.data.webUser.nickname;
                    that.showData = res.data.data;
                    // alert(res.data.data.authorId)
                    that.getWebUser(res.data.data.authorId)
                } else {
                    AlertModule.show({
                        title: res.data.msg
                    })
                }

            })
        },
        // 获取已经确认得用户信息(服务接收者)
        getConfirmWriter(id) {
            var that = this;
            var postData = {
                taskId: id,
                status: "2"
            };
            that
                .$http(
                    "get",
                    that.$store.state.baseUrl + "api/Order/Apply/List",
                    postData
                )
                .then(function (res) {
                    // console.log(res.data.data);
                    if (res.data.code != "00") {
                        AlertModule.show({
                            title: res.data.msg
                        });
                    } else {
                        var result = res.data.data;
                        var nicknameArr = [];
                        for (var i in result) {
                            nicknameArr.push(result[i].user.nickname);
                        }
                        that.confirmList = result;
                        that.nicknameArr = nicknameArr;
                        console.log("已确认列表");
                        console.log(nicknameArr);
                    }
                });
        },

        // 获取任务费用明细
        getStageDetail() {
            var that = this;
            that.$http('get', that.$store.state.baseUrl + 'api/Order/Stage/' + that.missionId).then(function (res) {
                if (res.data.code == '00') {
                    that.stageDetail = res.data.data;

                }
            })

        },
        //    获取任务评价列表
        getCommentList(id) {
            var that = this;
            that.$http('get', that.$store.state.baseUrl + "api/OrderComment/List?taskId=" + id).then(function (res) {
                if (res.data.code == '00') {
                    var result = res.data.data
                    for (var i in result) {
                        result[i].commentTags = result[i].commentTags.split(',')
                    }
                    that.commentList = res.data.data
                    console.log(that.commentList)
                }
            })
        },
        // 赞赏红包
        giveRed() {
            var that = this;
            that.$router.push({
                path: "/giveRedEnvelopes",
                query: {
                    uid: that.showData.authorId,
                    taskId: that.missionId
                }
            })
        }
    }
}
</script>

<style scoped>
body {
    background: #F5F5F5 !important;
}

#supplementMissionDetail {
    padding-bottom: 50px;
     background: #F5F5F5 !important;

}

.topBox {
    margin-top: 13px;
    padding: 14px 10px;
}

.topBox .hang {
    margin-bottom: 5px;
    font-size: 12px;
}
.topBox .hang .left{
        display: flex;
    justify-content: flex-start;
    width: 50%;
}
.topBox .hang .left span {
    color: #3374C4;
    font-size: 12px;
}

.topBox .hang .left .title {
    color: #999;
    font-size: 12px;
}

.topBox .hang .right {
    color: #999;
    font-size: 12px
}

.contentText {
    padding: 11px;
    color: #999;
    font-size: 12px;
}

.contentText .each {
    margin-bottom: 10px;
}

.stepBox .line {
    z-index: 0;
}

.statusBox {
    padding: 19px;
    margin-bottom: 13px;
}

.statusBox .left {
    color: #3374C4;
    font-size: 14px;
}

.statusBox .right button {
    color: #EA4A5C;
    font-size: 14px;
    width: 85px;
    height: 30px;
    /* padding: 9 13px; */
    border: 1px solid #EA4A5C;
    border-radius: 5px;
}

.eachPart>.title {
    padding: 14px 19px;
    border-bottom: 1px solid #B2B2B2;
    color: #999;
    font-size: 12px;
}

.eachPart>.title .right {
    color: #3374C4;
    text-decoration: underline;

}

.eachPart {
    margin-bottom: 10px;
}

.eachPart>.content {
    padding: 20px 18px;
}

.eachPart>.content {
    color: #3374C4;
}

.eachPart>.content .left .title {
    color: #999;
}

.eachPart>.content .hangList {
    border-bottom: 1px solid #cecece;
    margin-bottom: 10px;
    text-align: left;
    display: flex;
    flex-direction: column;
}

.eachPart>.content .bigTitle {
    color: #999999;
    font-size: 14px;
    font-weight: bolder;
    margin-top: 26px;
}

.eachPart>.content .bigTitle span {
    color: #3374C4;
}

.eachPart>.content .hang p {
    color: #999;
    margin-bottom: 10px;

}
.eachPart>.content .hang .left{
     display: flex;
    justify-content: flex-start;
    width: 50%;
}

.eachPart>.content .hang .right{
     display: flex;
    justify-content: flex-end;
    width: 50%;
}
.eachPart>.content .hang p.main {
    color: #242424;
    font-size: 14px;
}

.eachPart>.content .hang p.bottom {
    color: #3375C5;
    font-size: 14px;
}

.btnBox {
    position: fixed;
    bottom: 0;
    width: 100%;
}

.btnBox button {
    margin-top: 7px;
    margin-bottom: 7px;
    width: 90%;
}

.commentPart {
    margin-bottom: 71px;

}

.commentPart .eachComment {
    align-items: flex-start;
    padding-top: 10px;
}

.commentPart .right {
    padding-top: 5px;
    color: #333;
    font-size: 12px;
    border-bottom: 1px solid #B2B2B2;
    width: 100%;
    padding-bottom: 16px;
}

.commentPart img {
    margin-right: 10px;
    border: 1px solid #ccc;
    width: 42px;
    height: 42px;
    border-radius: 50%
}

.commentPart .name {
    color: #333;
    font-size: 12px;
    margin-bottom: 14px;
}

.commentPart .date {
    color: #686868;
    font-size: 10px;
}

.tags .eachTags {
    color: #333333;
    font-size: 12px;
    width: 65px;
    height: 22px;
    line-height: 22px;
    text-align: center;
    border: 1px solid #C9C37B;
    display: inline-block;
    margin-right: 5px;
    margin-top: 10px;
    background: #FFF6C5;
}
</style>
