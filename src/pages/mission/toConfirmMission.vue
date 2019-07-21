<template>
<div id="toConfirmMission">
    <div class="main" v-if="mainShow">
        <div class="mainContent" v-if="!canTalk">
            <!--顶部提示信息-->
            <div class="topTips flexSpace">
                <x-icon type="ios-information-outline" size="40" class="icon"></x-icon>
                <span>有效交流的小推荐：先和对方直接电话交流一致的计划，可修改部份 已发布的任务信息和缺省付款方式，再执行本操作书面确认</span>
            </div>

            <!--简要信息-->
            <div class="bgW brifMsg flexSpace">
                <div class="lelft">
                    <p>
                        发布者：
                         <router-link tag="span" :to="{path:'/writerDetail',query:{'writerId':postUser.id}}"   class="mainText">{{postUser.nickname}}</router-link>
                   
                    </p>
                    <p>
                        服务提供者：
                       <router-link tag="span" :to="{path:'/writerDetail',query:{'writerId':serviceProvider.id}}"    class="mainText">{{serviceProvider.nickname}}</router-link>
                     
                    </p>
                    <!-- 出钱的人 -->
                    <p>服务接收者：
                        <span class="mainText" @click="mainShow=!mainShow;serviceRecipientShow=!serviceRecipientShow">{{!nicknameArr?'':"查看详细名单共"+bussArr.length+"人"}}</span>
                        <!-- <span class="mainText">{{postUser.nickname}}</span> -->
                    </p>
                </div>
                <div class="right">
                    <p>{{taskObj.classNo}} / {{taskObj.category}}</p>
                    <p>{{taskObj.priceType=='1'?'1对1':'1对多'}} / {{taskObj.coordination=='online'?'线上沟通':taskObj.coordination=='author'?'家教上课':'家长拜访'}}</p>
                    <p>{{taskObj.area}}</p>
                </div>
            </div>

            <!--详细简介-->
            <div class="bgDetail">
                <p class="firstP">简述：{{taskObj.introduction}}</p>
                <p>详述：{{taskObj.content}}</p>
            </div>
            <!--发送确认==================begin====================页面才会显示-->

            <!--发送确认==================end====================页面才会显示-->

            <!-- 每个部分 -->
            <div class="eachBox bgW">
                <div class="titleBox flexSpace">
                    <span>费用明细与细节</span>
                </div>
                <div class="content">
                    <div class="hang flexSpace">
                        <p class="left"><span class="title">总费用：</span><span class="mainText">{{infoObj.price}}</span></p>
                        <p class="right "><span class="title">开始日期：</span><span class="mainText">{{infoObj.beginDate}}</span></p>

                    </div>
                    <div class="hang flexSpace">
                        <p class="left "><span class="title">阶段次数:</span><span class="mainText">{{infoObj.stage}}次</span></p>
                        <p class="right "><span class="title">结束日期：</span><span class="mainText">{{infoObj.endDate}}</span></p>

                    </div>
                    <div class="hang flexSpace">
                        <p class="left"><span class="title">每次时长：</span><span class="mainText">{{infoObj.timeStage}}</span></p>
                        <p class="right"><span class="title">支付方式：</span><span class="mainText">分阶段在线支付</span></p>
                    </div>
                    <div class="hang flexSpace">
                        <p class="left"><span class="title">总共时长:</span><span class="mainText">{{infoObj.totalTime}}</span></p>
                        <p class="right"><span class="title">手续费({{serviceRate*100}}%)：</span><span class="mainText redText">{{infoObj.handlingFee}}</span></p>
                    </div>
                    <div class="hang flexSpace">
                        <p class="left "><span class="title">费用单价：</span><span class="mainText">￥ {{Math.floor((infoObj.price-infoObj.handlingFee-infoObj.adjustmentFee)/infoObj.totalTime*100)/100}}/人时</span></p>
                        <p class="right"><span class="title">调解费({{adjustmentRate*100}}%)：</span><span class="mainText redText">{{infoObj.adjustmentFee}}</span></p>

                    </div>
                    <div class="lastHang flexStart">
                        <div class="bigTitle">人均支付：<span>
                    <span class="mainText">￥{{taskObj.taskType=='3'?Math.floor(infoObj.price/(taskObj.busniessCount+1)*100)/100:Math.floor(infoObj.price/OrderObj.busniessCount*100)/100}}/人（服务接收者）</span>
                            </span> </div>
                    </div>
                   

                </div>
            </div>

            <!--发送确认==================begin====================页面才会显示-->
            <!--中间提示信息-->
            <div class="topTips flexSpace">
                <x-icon type="ios-information-outline" size="30" class="icon"></x-icon>
                <div>
                    <p>调解费为可能出现的纠纷，而带来的费用</p>
                    <p>1.即使没有出现纠纷，该费用也会转给调解人</p>
                    <p>2.初始调解人是您“我的网络”中的分享人，您可以去掉或替换 分享人从而改变调解人</p>
                    <p>3.建议您选择调解人，可以提高本次合作的对方的信心度</p>
                 <p>4.调解费说明：调解费支付给任务双方的调解人，在任务每阶段完成时发放给调解人；当您没有调解人的时候，需您自己处理任务的纠纷事宜，调解费也会在任务每阶段完成时发放至您的余额</p>
                </div>
            </div>
            <!--发送确认==================end====================页面才会显示-->
            <!--  2-->
            <div class="eachBox eachBox2 bgW">
                <div class="titleBox mainText">服务执行方每阶段实际到账（参考）</div>
                <div class="content">
                    <div class="eachHang flexSpace" v-for="item,index in infoObj.infos">
                        <p class="left">第{{index+1}}次</p>
                        <p class="center">{{item.date.substring(0,11)}}</p>
                        <p class="right mainText">￥{{item.amount}}</p>
                    </div>
                </div>
            </div>
            <!--3-->
            <div class="eachBox eachBox3 bgW">
                <div class="titleBox flexSpace">
                    <span>留言交流</span>
                    <span class="mainText" @click="goToTalk">留言</span>
                </div>
                <div class="content">
                    <div class="eachItem flexSpace" v-for="item,index in talkList">
                        <div class="leftBox" id="resultPeoples">
                            <img :src="$store.state.imgUrl+item.imgurl" alt class="userImg">
            </div>
                            <div class="rightTime flexSpace">
                                <div>
                                    <p class="name">{{item.nickname}}</p>
                                    <p class="massage">{{item.content}}</p>
                                </div>
                                <p>{{item.createTime}}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 第一次填写并确认 -->
                <div class="btnBox flexSpace bgw" v-if="notControl">
                    <button  class="long_btn" @click="sendConfirm">确认同意</button>
                    <button  class="long_btn refuseBtn" @click="sendRefuse">拒绝</button>
                </div>
                <div class="btnBox flexSpace bgw" v-if="hasConfirm">
                    <button  class="long_btn disabled">已同意，等待支付</button>
                </div>
                <div class="btnBox flexSpace bgw" v-if="hasRefuse">
                    <button  class="long_btn disabled">已拒绝</button>
                </div>

            </div>
            <!-- 留言页面 -->
            <div class="talkBox" v-if="canTalk">
                <textarea name id placeholder="请输入留言内容，200字以内" v-model="talkContent"></textarea>
                <div class="long_btn" @click="sendTalkMsg">发送留言</div>
            </div>
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
                <div class="eachList flexSpace" v-for="item,index in bussArr" @click="toSeeWriter(index)">
                     <router-link tag="span" :to="{path:'/writerDetail',query:{'writerId':item.user.id}}"   class="mainText">{{item.user.nickname}}</router-link>
                    <span class="mainText">{{item.payText}}</span>
                </div>
                <!-- <div class="eachList flexSpace">
                <span class="mainText">小初高数学贾家长</span><span class="mainText">已支付</span>
            </div> -->
            </div>
        </div>
    </div>
</template>

<script>
import common from "@/assets/js/common";
import axios from "axios";
import qs from "qs";
import datetimePicker from "@/components/datetimePicker";
import {
    XButton,
    Group,
    PopupPicker,
    Datetime,
    AlertModule
} from "vux";

export default {
    components: {
        XButton,
        Group,
        PopupPicker,
        Datetime,
        datetimePicker,
        AlertModule
    },
    data() {
        return {
            mainShow: true,
            serviceRecipientShow: false,
            finalPrice: 0,
            beginDate: "",
            endDate: "",
            leftText2: "每次时长",
            time: [],
            timeArr: [],
            times: [],
            timesArr: [],
            leftText1: "阶段次数",
            // 被选择的家教
            chooseWriterId: this.$route.query.chooseWriterId,
            // 是否填写过阶段信息
            canTalk: false,
            // 任务id
            taskId: this.$route.query.taskId,
            taskObj: {},
            stage: 0,
            sendSuccess: false,
            hasRefuse: false,
            hasConfirm: false,
            notControl: true,
            gapDay: 1,
            eachPrice: 0,
            timesList: [],
            serviceRate: 0,
            adjustmentRate: 0,
            postUser: {},
            confirmList: [],
            nicknameArr: [],
            talkContent: '',
            talkList: [],
            infoObj: {},
            writerArr: [],
            bussArr: [],
            // 服务接受者
            serviceReceiver: "",
            // 服务提供者
            serviceProvider: "",
            missionType: '',
            authorId: '',
            amount: 0,
            isPay: false,
            bussNotPay: [],
            bussRefuse: [],
            bussHasPay: []
        };
    },

    mounted() {
        var arr = [];
        for (var i = 1; i <= 12; i++) {
            arr.push(i);
        }
        this.timesArr.push(arr);
        var arr2 = [];
        for (var i = 1; i <= 24; i++) {
            arr2.push(i);
        }
        this.timeArr.push(arr);

        this.getMissiondetail(this.taskId);
        // 调解费
        this.getBaseRate();

        // console.log("当前任务对象");

        this.getTalkList();
        this.getStageMsg(this.taskId)
    },
    methods: {
        ...common,
        
        // 点击留言按钮吧
        goToTalk() {
            this.canTalk = true;
        },
        // 发送私信
        sendTalkMsg() {
            var that = this;
            var baseUrl = that.$store.state.baseUrl;
            that
                .$http("post", baseUrl + "api/OrderTalk", {
                    uid: that.$store.state.uid,
                    taskId: that.taskId,
                    content: that.talkContent
                })
                .then(function (res) {
                    that.getTalkList()
                    that.canTalk = false;
                    //   that.talkList=res.data.dta;
                });

        },
        // 获取留言列表
        getTalkList() {
            var that = this;
            var baseUrl = that.$store.state.baseUrl;
            that
                .$http("get", baseUrl + "api/OrderTalk/List", {
                    taskId: that.taskId
                })
                .then(function (res) {
                    that.talkList = res.data.data;
                    console.log("留言列表");
                    console.log(that.talkList)
                });
        },

        // 根据用户id获取用户信息
        getUser(who, uid) {
            var that = this;
            var baseUrl = that.$store.state.baseUrl;
            var user;
            that.$http("get", baseUrl + "api/WebUser/" + uid).then(function (res) {
                if (who == "postUser") {
                    that.postUser = res.data.data;
                } else if (who == 'serviceProvider') {
                    that.serviceProvider = res.data.data;
                }
                console.log("获取的用户对象");
                console.log(that.postUser);
            });
            // return user;
        },
        // 获取已经确认得用户信息
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
                            if (result[i].uid == that.taskObj.authorId) {
                                result.splice(i, 1)
                            }
                        }
                        // console.log(result)
                        // 判断任务类型,如果是1,3.就把发布者也算到家长列表中
                        if (that.taskObj.taskType == 1 || that.taskObj.taskType == 3) {
                            var obj = {}
                            obj.user = {}
                            obj.user.id=that.taskObj.webUser.id;
                            obj.user.nickname = that.taskObj.webUser.nickname
                            if (!that.taskObj.payTime) {
                                obj.pay = 2
                            } else {
                                obj.pay = 3
                            }
                            result.push(obj)
                        }
                        
                        // 支付状态(1-不需要支付,2-待支付,3-已支付,4-已拒绝)
                        for (var j in result) {
                            if (result[j].pay == '2') {
                                result[j].payText="待支付"
                                that.bussNotPay.push(result[j])
                            } else if (result[j].pay == '4') {
                                result[j].payText='已拒绝'
                                that.bussRefuse.push(result[j])
                            } else if (result[j].pay == '3') {
                                 result[j].payText='已支付'
                                that.bussHasPay.push(result[j])
                            }
                        }
                        var nicknameArr = [];
                        that.bussArr = result;
                        that.nicknameArr = nicknameArr;
                        console.log("弹窗需要支付的家长");
                        console.log(that.bussArr);
                       
                    }
                });
           
        },

        // 获取任务详情
        getMissiondetail(id) {
            var that = this;
            that
                .$http(
                    "get",
                    that.$store.state.baseUrl +
                    "api/Order/" +
                    id
                    //  +
                    // "?uid=" +
                    // this.$store.state.uid
                )
                .then(function (res) {
                    if (res.data.code != "00") {
                        AlertModule.show({
                            title: res.data.msg
                        });
                    } else {
                        that.taskObj = res.data.data;
                        that.missionType = that.taskObj.taskType;
                        that.authorId = res.data.data.authorId;
                        that.getUser("postUser", that.taskObj.uid);
                        that.getUser("serviceProvider", that.taskObj.authorId);
                        // 被选择的家教
                        that.getConfirmWriter(that.taskId);
                    }
                });
        },
        //获取阶段信息
        getStageMsg(id) {
            var that = this;
            that
                .$http(
                    "get",
                    that.$store.state.baseUrl +
                    "api/Order/Stage/" +
                    id
                    //  +
                    // "?uid=" +
                    // this.$store.state.uid
                )
                .then(function (res) {
                    if (res.data.code != "00") {
                        AlertModule.show({
                            title: res.data.msg
                        });
                    } else {
                        // alert(res.data.data)
                        if (Boolean(res.data.data)) {
                            var result = res.data.data
                            result.beginDate = result.beginDate.substr(0, 10);
                            result.endDate = result.endDate.substr(0, 10);
                            that.infoObj = result;
                            console.log('阶段信息')
                            //  that.timesList=res.data.data.infos
                            console.log(res.data.data)
                        }

                    }
                });
        },
        // 发送拒绝
        sendRefuse() {
            var that = this;
            var postData = {
                taskId: that.taskId,
                status: "3",
                uid: that.$store.state.uid
            };
            that
                .$http(
                    "post",
                    that.$store.state.baseUrl +
                    "api/Order/Stage/Confirm",
                    postData
                ).then(function (res) {
                    if (res.data.code != "00") {
                        AlertModule.show({
                            title: res.data.msg
                        });
                    } else {
                        AlertModule.show({
                            title: "拒绝成功",
                             onHide() {
                                    that.sendSuccess = true;
                                    that.$router.push({
                                        path: "/mission",
                                    });
                                }
                        });
                        that.notControl = false;
                        that.hasRefuse = true;
                        that.hasConfirm = false;

                    }
                });

        },
        // 发送确认
        sendConfirm() {
            var that = this;
            var postData = {
                taskId: that.taskId,
                status: "2",
                uid: that.$store.state.uid
            };
            that
                .$http(
                    "post",
                    that.$store.state.baseUrl +
                    "api/Order/Stage/Confirm",
                    postData
                ).then(function (res) {
                    if (res.data.code != "00") {
                        AlertModule.show({
                            title: res.data.msg
                        });
                    } else {
                        AlertModule.show({
                            title: "确认成功",
                            onHide() {
                               
                                    that.sendSuccess = true;
                                    that.$router.push({
                                        path: "/mission",
                                    });
                                
                            }
                        });
                        that.notControl = false;
                        that.hasRefuse = false;
                        that.hasConfirm = true;

                    }
                });

        },

        // 获取阶段次数
        timesChange(val) {
            // console.log(val)
            this.stage = val.join("");
        },
        // 获取每次时长
        timeChange(val) {},
        // 开始时间
        beginDateChange(val) {
            this.beginDate = val;
        },
        // 结束日期
        endDateChange(val) {
            this.endDate = val;
        }
    }
};
</script>

<style scoped>
body {
    background: #f5f5f5 !important;
}

#toConfirmMission {
    /* padding-bottom: 60px; */
}

#toConfirmMission .refuseBtn {
    background: #fff;
    color: #EA4A5C;
    border: 1px solid #EA4A5C;
    margin-left: 10px;
}

.smallBtn {
    border: 1px solid #3375c5;
    border-radius: 5px;
    padding: 3px 5px;
    color: #999999;
}

#toConfirmMission .topTips {
    padding: 10px;
    align-items: flex-start;
    vertical-align: top;
    color: #8a8a8a;
    font-size: 11px;
}

#toConfirmMission .icon {
    height: auto;
    margin-right: 7px;
    display: inline-block;
    fill: #f83345;
}

#toConfirmMission .brifMsg {
    padding: 12px 10px;
    color: #999;
    line-height: 20px;
}

#toConfirmMission .brifMsg .mainText {
    text-decoration: underline;
}

#toConfirmMission .bgDetail {
    padding: 13px 11px;
    color: #999999;
    font-size: 12px;
    background: #f5f5f5;
    border-bottom: 16px solid #fff;
    margin-bottom: 10px;
}

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

#toConfirmMission .bgDetail .firstP {
    margin-bottom: 10px;
}

#toConfirmMission .eachBox {
    margin-bottom: 10px;
}

#toConfirmMission .eachBox .titleBox {
    padding: 14px 19px;
    color: #999999;
    font-size: 12px;
    border-bottom: 1px solid #b2b2b2;
}

#toConfirmMission .eachBox .content {
    padding: 21px 18px 0px 18px;
    line-height: 25px;
    color: #999999;
    font-size: 12px;
}

#toConfirmMission .eachBox .content p {
    width: auto;
    /* padding-left: 44px; */
}

#toConfirmMission .eachBox .strongText {
    font-size: 14px;
    margin-top: 13px;
    color: #999999;
    padding-left: 18px;
    padding-bottom: 24px;
    font-weight: bold;
}

#toConfirmMission .eachBox .content .eachHang {
    font-size: 14px;
    margin-bottom: 10px;
}

#toConfirmMission .eachBox .content .eachHang .center {
    color: #242424;
    padding: 4px 15px;
    border-radius: 5px;
    background: #f5f5f5;
    border: 1px solid #cecece;
    min-width: 120px;
}

#toConfirmMission .eachBox2 {
    padding-bottom: 16px;
}

#toConfirmMission .eachBox2 .content .right {
    padding-left: 0;
    font-weight: bold;
}

#toConfirmMission .eachBox3 .content .eachItem {
    margin-bottom: 10px;
}

#toConfirmMission .eachBox3 .content .eachItem .rightTime {
    width: 100%;
    align-items: flex-start;
    border-bottom: 1px solid #b2b2b2;
    padding-bottom: 10px;
}

#toConfirmMission .eachBox3 .content .eachItem .rightTime div {
    color: #333333;
}

#toConfirmMission .eachBox3 {
    margin-bottom: 129px;
}

#toConfirmMission .bottomBtnBox {
    padding: 7px 10px;
    font-size: 14px;
}

#toConfirmMission .btnBox {
    position: fixed;
    bottom: 0;
    padding: 8px 10px;
    width: 100%;
    background: #fff;
    border-top: 1px solid #c3c3c3;
}

#toConfirmMission .long_btn {
    width: 100%;
    margin-top: 0px !important;
}

#toConfirmMission .long_btn.disable {
    background: #c3c3c3;
}

#toConfirmMission .bottomBtnBox button.refuce {
    background: #fff !important;
    color: #ea4a5c !important;
    border-color: #ea4a5c !important;
}

#toConfirmMission .bottomBtnBox button.refuce.weui-btn:after {
    border-color: #ea4a5c !important;
}

#toConfirmMission .sendConfirm .content {
    padding-right: 0;
    padding-top: 0;
}

#toConfirmMission .sendConfirm .eachLink {
    color: #333333;
    font-size: 15px;
    border-bottom: 1px solid #d9d9d9;
    padding-top: 8px;
    padding-bottom: 14px;
    padding-right: 8px;
}

#toConfirmMission .sendConfirm .eachLink.slide {
    padding: 0;
}

#toConfirmMission .sendConfirm .eachLink>div {
    width: 100%;
}

#toConfirmMission .sendConfirm .eachLink.finalPriceLink>div {
    width: auto;
}

#toConfirmMission .weui-cells:before,
#toConfirmMission .weui-cells:after {
    border: none;
}

#toConfirmMission .weui-cell {
    padding-left: 0;
    width: 100%;
}

#toConfirmMission .sendConfirm .eachLink .vux-x-icon.vux-x-icon-ios-arrow-right.arrow {
    fill: #7f7f7f;
}

.finalPrice {
    height: 100%;
    border: none;
    text-align: left;

    width: auto;
    max-width: 70px;
}

/* ====================== */
.talkBox {
    background: #f5f5f5;
    padding: 20px 18px;
    min-height: 670px;
}

.talkBox textarea {
    padding: 16px;
    width: 100%;
    height: 207px;
    border-radius: 4px;
    border-color: rgba(178, 178, 178, 0.4);
    margin-bottom: 20px;
}

.talkBox .long_btn {
    width: 100%;
    line-height: 40px;
    text-align: center;
    font-size: 16px;
    margin-top: 45px;
}

.long_btn.disabled {
    background: #ccc !important;
    pointer-events: none;
    color: #fff !important;
    border-color: #333 !important;
}
</style>
