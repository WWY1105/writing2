<template>
<div id="missionInAfterEvaluteBuss">
    <div class="main" v-if="mainShow">
        <!--任务详情（家长版）-->
        <div class="topBox bgW">
            <div class="hang flexSpace">
                <p class="left"><span class="title">发布者：</span>
                 <router-link tag="span" :to="{path:'/writerDetail',query:{'writerId':postUser.id}}"   class="mainText">{{postUser.nickname}}</router-link>
                 </p>
                <p class="right">{{showData.category}}/{{showData.classNo}}</p>
            </div>
            <div class="hang flexSpace">
                <p class="left"><span class="title">服务提供者：</span>
                 <router-link tag="span" :to="{path:'/writerDetail',query:{'writerId':serviceProvider.id}}"    class="mainText">{{serviceProvider.nickname}}</router-link>
                </p>
                <p class="right">{{showData.priceType =='1'?'1对1':"1对多"}}/{{showData.coordination=="online"?"远程协作":showData.coordination=="author"?"家教上课":"学生拜访"}}</p>
            </div>
            <div class="hang flexSpace">
                <p class="left" @click="mainShow=!mainShow;serviceRecipientShow=!serviceRecipientShow"><span class="title">服务接收者：</span>
                    <span >{{!nicknameArr?'':"查看详细名单共"+bussArr.length+"人"}}</span></p>

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
            <div :class="showData.status=='已选定服务人'?'active item flexCenter':''">
                <p class="circle"></p>
                <p class="text">待确认</p>
            </div>
            <div :class="showData.status=='执行中'?'active item flexCenter':''">
                <p class="circle"></p>
                <p class="text">执行</p>
            </div>
            <div :class="showData.status=='已结束'?'active item flexCenter':''">
                <p class="circle"></p>
                <p class="text">结束</p>
            </div>
        </div>
        <div class="statusBox flexSpace bgW">
            <p class="left">状态：{{showData.supplement?'补充登记':showData.status}}</p>
            <div class="right">
                <button class="cancelExecute" @click="cancelExecute" v-if="showData.status!=4&&showData.taskType!=3&&showData.priceType!=2&&!showAllMsg">取消执行</button>
            </div>
        </div>
        <!-- 每个部分 -->
        <!-- 每个部分 -->
        <div class="eachPart bgW">
            <div class="title flexSpace">
                <div class="left">费用明细与细节</div>
                <div class="right" @click="priceDetailShow=!priceDetailShow">查看每期</div>
            </div>
            <div class="content">
                <div class="hang flexSpace">
                    <p class="left"><span class="title">总费用：</span><span class="mainText">{{stageDetail.price}}</span></p>
                    <p class="right "><span class="title">开始日期：</span><span class="mainText">{{stageDetail.beginDate?stageDetail.beginDate.substr(0,10):''}}</span></p>
                </div>
                <div class="hang flexSpace">
                    <p class="left "><span class="title">阶段次数:</span><span class="mainText">{{stageDetail.stage}}次</span></p>
                    <p class="right "><span class="title">结束日期：</span><span class="mainText">{{stageDetail.endDate?stageDetail.endDate.substr(0,10):''}}</span></p>

                </div>
                <div class="hang flexSpace">
                    <p class="left"><span class="title">每次时长：</span><span class="mainText">{{stageDetail.timeStage}}</span></p>
                    <p class="right"><span class="title">支付方式：</span><span class="mainText">分阶段在线支付</span></p>
                </div>
                <div class="hang flexSpace">
                    <p class="left"><span class="title">总共时长:</span><span class="mainText">{{stageDetail.totalTime}}</span></p>
                    <p class="right"><span class="title">手续费({{serviceRate*100}}%)：</span><span class="mainText redText">{{stageDetail.handlingFee}}</span></p>
                </div>
                <div class="hang flexSpace">
                    <p class="left "><span class="title">费用单价：</span><span class="mainText">￥ {{Math.floor((stageDetail.price-stageDetail.handlingFee-stageDetail.adjustmentFee)/stageDetail.totalTime*100)/100}}/人时</span></p>
                    <p class="right"><span class="title">推荐费({{adjustmentRate*100}}%)：</span><span class="mainText redText">{{stageDetail.adjustmentFee}}</span></p>

                </div>
                <div class="lastHang flexStart">
                    <p class="strongText">
                        人均支付：
                        <span
              class="mainText"
            >￥
            {{showData.taskType=='3'?Math.floor(stageDetail.price/(showData.busniessCount+1)*100)/100:Math.floor(stageDetail.price/showData.busniessCount*100)/100}}
            /人（服务接收者）
                </span>
                    </p>
                </div>
            </div>
        </div>
        <!-- 每个部分   每阶段明细 -->
             <div class="eachPart eachBox2   bgW" v-if="priceDetailShow">
                <div class="title">
                   <div class="left mainText"> 服务执行方每阶段实际到账（参考）</div>
                   </div>
                <div class="content">
                    <div class="eachHang flexSpace" v-for="item,index in stageDetail.infos">
                        <p class="left">第{{index+1}}次</p>
                        <p class="center">{{item.date.substring(0,11)}}</p>
                        <p class="right mainText">￥{{item.amount}}</p>
                    </div>
                </div>
            </div>
        <!-- 每个部分 -->
        <div class="eachPart bgW">
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
                    <p class="bottom">结果：{{!item.registerContent?"待完成":item.registerContent}}</p>
                </div>
            </div>
        </div>
        <div class="eachPart commentPart bgW">
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
        </div>
        <div class="btnBox bgW"><button class="long_btn" @click.stop="giveRed">赞赏家教红包</button></div>

    </div>
    <!-- ==============查看接收者================ -->
    <div id="serviceRecipient" v-if="serviceRecipientShow">
        <p class="title">
            共{{bussArr.length}}人，{{bussHasPay.length}}人
            <span class="mainText">已支付</span>
            ，{{bussNotPay.length}}人待支付，{{bussRefuse.length}}人
            <span class="redText">已拒绝</span>
        </p>
        <div class="content bgW">
            <div class="eachList flexSpace" v-for="item,index in bussArr">
                 <router-link tag="span" :to="{path:'/writerDetail',query:{'writerId':item.user.id}}"   class="mainText">{{item.user.nickname}}</router-link>
                
                <span class="mainText">{{item.payText}}</span>
            </div>
        </div>
    </div>
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
              serviceRate: 0,
            adjustmentRate: 0,
            postUser: {},
            // 服务接受者
            serviceReceiver: "",
            // 服务提供者
            serviceProvider: "",
            bussArr: [],
            bussNotPay: [],
            bussRefuse: [],
            bussHasPay: [],
            mainShow: true,
            serviceRecipientShow: false,
            priceDetailShow:false,
            showAllMsg:this.$route.query.showAllMsg
        }
    },

    mounted() {
          // 推荐费
        this.getBaseRate();
        this.getMissiondetail(this.missionId);
        this.getCommentList(this.missionId);
        this.getStageDetail();

    },
    methods: {
          ...common,
        // 取消执行
        cancelExecute() {
            var that = this;
            if (that.showData.taskType == '3'||that.showData.priceType=='2') {
                AlertModule.show({
                    title: "抱歉，该类型任务不能取消"
                })
            } else {
                that.$http('post', that.$store.state.baseUrl + 'api/Order/Cancel', {
                    taskId: that.missionId,
                    uid: that.$store.state.uid
                }).then(function (res) {
                    if (res.data.code == '00') {
                        AlertModule.show({
                            title: "提交取消成功"
                        })
                    } else {
                        AlertModule.show({
                            title: res.data.msg
                        })
                    }
                })
            }
        },
        // 获取任务详情

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
                        for (var i in result) {
                            if (result[i].uid == that.showData.authorId) {
                                result.splice(i, 1)

                            }
                        }
                        // console.log(result)
                        // 判断任务类型,如果是1,3.就把发布者也算到家长列表中
                        if (that.showData.taskType == 1 || that.showData.taskType == 3) {

                            var obj = {}
                            obj.user = {}
                            obj.user.nickname = that.showData.webUser.nickname
                             obj.user.id=that.showData.webUser.id;
                            if (!that.showData.payTime) {
                                obj.pay = 2
                            } else {
                                obj.pay = 3
                            }
                            result.push(obj)
                        }

                        // 支付状态(1-不需要支付,2-待支付,3-已支付,4-已拒绝)
                        for (var j in result) {
                            if (result[j].pay == '2') {
                                result[j].payText = "待支付"
                                that.bussNotPay.push(result[j])
                            } else if (result[j].pay == '4') {
                                result[j].payText = '已拒绝'
                                that.bussRefuse.push(result[j])
                            } else if (result[j].pay == '3') {
                                result[j].payText = '已支付'
                                that.bussHasPay.push(result[j])
                            }
                        }
                        var nicknameArr = [];
                        that.bussArr = result;
                        that.nicknameArr = nicknameArr;
                        // aert(that.bussArr.length)
                        console.log('弹窗家长')
                        console.log(that.bussArr)
                    }
                });
        },
        // 获取任务详情
        getMissiondetail(id) {
            var that = this;
            that.$http('get', that.$store.state.baseUrl + 'api/Order/' + id + "?uid=" + this.$store.state.uid).then(function (res) {
                if (res.data.code == '00') {
                    that.postUser = res.data.data.webUser;

                    var obj = res.data.data.webUser
                    that.nickname = obj.nickname;
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
                    that.showData = res.data.data;
                    that.$http("get", that.$store.state.baseUrl + "api/WebUser/" + that.showData.authorId).then(function (res1) {
                        if (res1.data.code != "00") {
                            AlertModule.show({
                                title: res1.data.msg
                            });
                        } else {
                            that.serviceProvider = res1.data.data;

                            that.$http("get", that.$store.state.baseUrl + "api/WebUser/" + that.showData.uid).then(function (res2) {
                                if (res2.data.code != "00") {
                                    AlertModule.show({
                                        title: res.data.msg
                                    });
                                } else {
                                    that.postUser = res2.data.data;
                                    // 被选择的家教
                                    that.getConfirmWriter(that.missionId);
                                }
                            })
                        }

                    });

                } else {
                    AlertModule.show({
                        title: res.data.msg
                    })
                }

            })
        },
     
       

          // 获取任务费用明细
        getStageDetail() {
            var that = this;
            that.$http('get', that.$store.state.baseUrl + 'api/Order/Stage/' + that.missionId).then(function (res) {
                if (res.data.code == '00') {
                    // nextStageTime
                    // alert(res.data.data)
                    if(res.data.data){
                         var result = res.data.data.infos;
                    for (var i in result) {
                        if (result[i].success) {
                            continue;
                        } else {
                            if( result[i].date){
                                that.nextStageTime = result[i].date.substr(0,10)
                            }
                            
                            break;
                        }
                    }
                    if (new Date().getTime() >= new Date(that.nextStageTime).getTime()) {
                        that.isCanRegister = true;
                    }
                    that.stageDetail = res.data.data;
                    }
                   

                }
            })

        },
        //    获取任务评价列表
        getCommentList(id) {
            var that = this;
            that.$http('get', that.$store.state.baseUrl + "api/OrderComment/List?taskId=" + id).then(function (res) {
                if (res.data.code == '00') {
                   var  result=res.data.data
                    for(var i in result){
                        result[i].commentTags= result[i].commentTags.split(',')
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
/* // -------------------------------------- */
.eachPart .content .eachHang{
    font-size: 14px;
    margin-bottom: 10px;
}
.eachPart .content .eachHang .center{
    color: #242424;
    padding: 4px 15px;
    border-radius: 5px;
    background: #f5f5f5;
    border: 1px solid #cecece;
    min-width: 120px;
}
 .eachBox2 .content{
    padding: 21px 18px 0px 18px;
    line-height: 25px;
    color: #999999;
    font-size: 12px;
}
 .eachBox2 .content .left{
      color: #999999;
 }
 .eachBox2 {
    padding-bottom: 16px;
}

 .eachBox2 .content .right {
    padding-left: 0;
    font-weight: bold;
}
/* // -------------------------------------- */
#serviceRecipient .title {
    background: #F5F5F5;
    padding: 18px 0px;
    text-align: center;
    font-size: 14px;
}

#serviceRecipient .content {
    padding-left: 40PX;
    padding-top: 20px;
}

#serviceRecipient .content .eachList {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #CECECE;
    padding-right: 45px;
}

#missionInExecutionBuss {
    padding-bottom: 50px;

}

.topBox {
    margin-top: 13px;
    padding: 14px 10px;
}

.topBox .hang {
    margin-bottom: 5px;
    font-size: 12px;
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
    display: flex;
    flex-direction: column;
    text-align: left;
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
    margin-top: 50px;
}

.btnBox button {
    margin-top: 7px;
    margin-bottom: 7px;
    width: 90%;
}

.commentPart {
    margin-bottom: 140px;
    padding-bottom: 100px;
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
