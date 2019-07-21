<template>
<div id="replyDetail">
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
                    <p>发布者：
                        <router-link tag="span" :to="{path:'/writerDetail',query:{'writerId':postUser.id}}"   class="mainText">{{postUser.nickname}}</router-link>
                  
                    </p>
                    <p>服务提供者：
                        <router-link tag="span" :to="{path:'/writerDetail',query:{'writerId':serviceProvider.id}}"    class="mainText">{{serviceProvider.nickname}}</router-link>
                       <!-- <span class="mainText">{{nicknameArr.length==0?'':nicknameArr.join(',')}}</span> -->
                    </p>
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
                <p style="word-wrap: break-word">详述：{{taskObj.content}}</p>
            </div>
            <!--发送确认==================begin====================页面才会显示-->
            <div class="eachBox bgW sendConfirm" v-show="!sendSuccess">
                <div class="titleBox flexSpace">
                    <span>细节确认</span>
                    <!-- <button class="smallBtn" @click="getTimesList">生成费用列表</button> -->
                </div>
                <div class="content">
                    <div class="eachLink slide flexSpace">
                        <group>
                            <!--阶段次数选择器start-->
                            <popup-picker :title="leftText1" @on-change="timesChange" v-model="times" :data="timesArr" class="gradePicker"></popup-picker>
                            <!--阶段次数选择器end-->
                        </group>
                    </div>
                    <div class="eachLink slide flexSpace">
                        <!-- <span class="left">每次时长</span>
                <span class="right flexSpace mainText">1小时
                        <x-icon class="arrow" type="ios-arrow-right" size="20"></x-icon>
              </span>-->
                        <group>
                            <!--每次时长选择器start-->
                            <popup-picker :title="leftText2" @on-change="timeChange" v-model="time" :data="timeArr" class="gradePicker"></popup-picker>
                            <!--每次时长选择器end-->
                        </group>
                    </div>
                    <div class="eachLink slide flexSpace">
                        <datetime v-model="beginDate" :start-date="beginStartDate" format="YYYY-MM-DD" @on-change="beginDateChange" title="开始日期"></datetime>
                        <!-- <datetimePicker title="开始日期" v-model="beginDate" class="datetimePicker" v-on:dateChange="beginDateChange"></datetimePicker> -->
                    </div>
                    <div class="eachLink slide flexSpace">
                        <!-- <datetimePicker title="结束日期" v-model="endDate" class="datetimePicker" v-on:dateChange="endDateChange"></datetimePicker> -->

                        <datetime v-model="endDate" :start-date="endStartDate" format="YYYY-MM-DD" @on-change="endDateChange" title="结束日期"></datetime>

                    </div>
                    <div class="eachLink flexSpace finalPriceLink">
                        <span class="left">最终总价</span>
                        <div class="right flexSpace mainText">
                            <p class="finalPriceBox">
                                <span>￥</span>
                                <input
                    type="number"
                    v-model="finalPrice"
                    placeholder="0"
                    class="finalPrice mainText"
                  >
                </p>
                                <x-icon class="arrow" type="ios-arrow-right" size="20"></x-icon>
                        </div>
                    </div>
                </div>
                <div class="titleBox flexSpace">
                    <span></span>

                    <toast v-model="showPositionValue" type="text" :time="800" is-show-mask text="操作成功" position="middle"></toast>
                    <button class="smallBtn" @click="getTimesList">生成费用列表</button>
                </div>
            </div>
            <!--发送确认==================end====================页面才会显示-->
            <!--每个盒子-1-->
            <div class="eachBox bgW">
                <div class="titleBox flexSpace">
                    <span>费用明细与细节</span>
                    <span class="mainText" v-if="sendSuccess&&isMyTask" @click="reEditInfo">修改</span>
                </div>
                <div class="content flexSpace">
                    <div class="left">
                        <p>
                            总费用：
                            <span class="mainText">￥{{finalPrice}}<span class="redText"></span></span>
                        </p>
                        <p>
                            阶段次数：
                            <span class="mainText">{{times.join('')}}</span>
                        </p>
                        <p>
                            每次时长：
                            <span class="mainText">{{time.join('')}}</span>
                        </p>
                        <p>
                            总共时长：
                            <span class="mainText">{{time.join('')*times.join('')}}</span>
                        </p>
                        <p>
                            费用单价：
                            <!-- {{Math.floor((finalPrice-serviceRate*finalPrice-finalPrice*adjustmentRate)/(time.join('')*times.join(''))*100)/100}} -->
                            <span
                  class="mainText"
                >￥{{Math.floor((finalPrice-serviceRate*finalPrice-finalPrice*adjustmentRate)/(time.join('')*times.join(''))*100)/100}} /小时</span>
                        </p>
                    </div>

                    <div class="right">
                        <p>
                            开始日期：
                            <span class="mainText">{{beginDate}}</span>
                        </p>
                        <p>
                            结束日期：
                            <span class="mainText">{{endDate}}</span>
                        </p>
                        <p>
                            支付方式：
                            <span class="mainText">分阶段在线支付</span>
                        </p>
                        <p>
                            手续费({{serviceRate*100}}%)：
                            <span class="mainText">￥{{Math.floor((serviceRate*finalPrice)*100)/100  }}</span>
                        </p>
                        <p>
                            调解费({{ adjustmentRate*100}}%)：
                            <span class="mainText">￥{{Math.floor((finalPrice*adjustmentRate)*100)/100}}</span>
                        </p>
                    </div>
                </div>
                <p class="strongText">
                    人均支付：
                    <span
              class="mainText"
            >￥
            {{taskObj.taskType=='3'?Math.floor(finalPrice/(taskObj.busniessCount+1)*100)/100:Math.floor(finalPrice/OrderObj.busniessCount*100)/100}}
            /人（服务接收者）
                </span>
                </p>
            </div>
            <!--发送确认==================begin====================页面才会显示-->
            <!--中间提示信息-->
            <div class="topTips flexSpace">
                <x-icon type="ios-information-outline" size="50" class="icon"></x-icon>
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
                    <div class="eachHang flexSpace" v-for="item,index in timesList">
                        <p class="left">第{{item.index}}次</p>
                        <p class="center" v-if="sendSuccess">{{item.date}}</p>
                        <!-- <datetime v-if="!sendSuccess" :placeholder="item.date" v-model="item.date" class="center"></datetime> -->
                        <datetime v-if="!sendSuccess" :start-date="endStartDate" :end-date="timesListEndDate" :placeholder="item.date" v-model="item.date" class="center"></datetime>
                        <p class="right mainText">￥{{Math.floor(item.money*100)/100}}</p>
                    </div>
                    <!-- <div class="eachHang flexSpace">
                <p class="left">第1次</p>
                <p class="center">2018-9-31</p>
                <p class="right mainText">￥396</p>
            </div>-->
                </div>
            </div>
            <!--3-->
            <div class="eachBox eachBox3 bgW" v-if="sendSuccess">
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
                                   <router-link tag="span" :to="{path:'/writerDetail',query:{'writerId':item.user.id}}"   class="mainText">{{item.user.nickname}}</router-link>
                   
                                    <p class="massage">{{item.content}}</p>
                                </div>
                                <p>{{item.createTime}}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 第一次填写并确认 -->
                <div class="btnBox bgw flexSpace" v-if="sendSuccess">
                    <div v-transfer-dom>
                        <confirm v-model="show" @on-cancel="onCancel" @on-confirm="deleteTeskonConfirm">
                            <p style="text-align:center;">确定取消任务吗</p>
                        </confirm>
                    </div>
                    <!-- 是我的任务？（费用明细不等于已拒绝/不是找家长） -->
                    <button    v-if="isMyTask?(sendSuccess&&infoStatus!=4&&taskObj.status!=2):(taskObj.status==3||taskObj.status==2)" :class="taskObj.status!=3&&taskObj.taskType==3?'disabled long_btn':'long_btn'" @click.stop="toPay">{{taskObj.status!=3&&taskObj.taskType==3?'等待家教确认':'确定同意并支付'}}</button>
                    <button v-if="isMyTask?(sendSuccess&&!isMyTask&&infoStatus!=4&&taskObj.status!=2):(taskObj.status==3||taskObj.status==2)" class="long_btn red" @click="sendRefuse">拒绝</button>
                    <button  v-if="sendSuccess&&isMyTask&&infoStatus!=4&&taskObj.status!=2" class="long_btn red" @click.stop="deleteTesk">取消发布</button>
                    <router-link v-if="infoStatus==4&&taskObj.status!=2" tag="button" class="long_btn clbm" :to="{path:'/handelEnroll',query:{taskId:taskId,priceType:taskObj.priceType,enrollStatus:enrollStatus,taskType:taskObj.taskType,busniessCount:taskObj.busniessCount}}">家教拒绝,重新处理
                        <badge text="1"></badge>
                    </router-link>
                    <button class="long_btn disabled" v-if="isMyTask&&taskObj.status==2">已报价,等待确认</button>
                </div>
                <div class="btnBox bgw flexSpace" v-if="!sendSuccess">
                    <button v-if="!sendSuccess" class="long_btn" @click.stop="sendConfirm1">发送确认</button>
                    <!-- 发送成功以后的禁用按钮 -->
                    <button v-if="sendSuccess" class="long_btn disable">已发送确认，等待对方回复</button>
                </div>
            </div>
            <!-- 留言页面 -->
            <div class="talkBox" v-if="canTalk">
                <textarea name id placeholder="请输入留言内容，200字以内" v-model="talkContent"></textarea>
                <div class="long_btn" @click.stop="sendTalkMsg">发送留言</div>
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
                <div class="eachList flexSpace" v-for="item,index in bussArr">
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
    AlertModule,
    Badge,
    Alert,
    Confirm,
    Toast
} from "vux";

export default {
    components: {
        XButton,
        Group,
        PopupPicker,
        Datetime,
        datetimePicker,
        Badge,
        AlertModule,
        Alert,
        Confirm,
        Toast
    },
    data() {
        return {
            limitHourValue: '',
            beginStartDate: '2019-01-01',
            endStartDate: '2019-01-01',
            timesListEndDate: '2019-01-01',
            amount: 0,
            show: false,
            mainShow: true,
            serviceRecipientShow: false,
            showPositionValue: false,
            //  mainShow:false,
            //  serviceRecipientShow:true,
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
            chooseWriterId: "",
            // 是否填写过阶段信息
            isNew: false,
            canTalk: false,
            // 任务id
            taskId: this.$route.query.taskId,
            taskObj: {},
            stage: 0,
            sendSuccess: true,
            gapDay: 1,
            eachPrice: 0,
            actualEachStage: 0,
            timesList: [],
            serviceRate: 0,
            adjustmentRate: 0,
            postUser: {},
            confirmList: [],
            nicknameArr: [],
            talkContent: "",
            talkList: [],
            writerArr: [],
            bussArr: [],
            bussNotPay: [],
            bussRefuse: [],
            bussHasPay: [],
            infoStatus: '',
            canPay: false,
            isMyTask: false,
            nextStageTime: '',
            missionType: "",
            // 服务接受者
            serviceReceiver: "",
            // 服务提供者
            serviceProvider: ""
        };
    },

    mounted() {

        if (this.$route.query.chooseWriterId instanceof Array) {
            this.chooseWriterId = this.$route.query.chooseWriterId.split(",");
        } else {
            this.chooseWriterId = this.$route.query.chooseWriterId;
        }
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

        this.getAvgMoney(this.taskId)
        // 调解费
        this.getBaseRate();

        console.log("当前任务对象");

        this.getUser("postUser", this.$store.state.uid);
        this.getTalkList();
        // 循环被选择的人物与
        // for (var i in this.chooseWriterId) {
        //     this.getUser('recipient', this.chooseWriterId[i])
        // }
        this.getConfirmWriter(this.taskId);
        this.getTalkList();
        if (this.sendSuccess) {
            this.getStageDetail()
        }
        // =================================
        Date.prototype.Format = function (fmt) { //author: meizz 
            var o = {
                "M+": this.getMonth() + 1, //月份 
                "d+": this.getDate(), //日 
                "h+": this.getHours(), //小时 
                "m+": this.getMinutes(), //分 
                "s+": this.getSeconds(), //秒 
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
                "S": this.getMilliseconds() //毫秒 
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }

        this.beginStartDate = new Date().Format("yyyy-MM-dd")

        // ==============================
    },
    methods: {
        ...common,
        // 支付
        toPay() {
            var that = this;
            if (!that.isMyTask) {
                that.sendConfirm()
            }
            // !that.canPay
            if (true) {
                // alert(that.taskId)
                that.$router.push({
                    path: '/OrderPay',
                    query: {
                        amount: that.amount,
                        taskId: that.taskId
                    }
                })
            } else {
                AlertModule.show({
                    title: "抱歉，支付有限期已过"
                })
            }

        },

        // 取消发布
        deleteTesk() {
            this.show = !this.show;
        },
        onCancel() {
            this.show = false;
        },
        deleteTeskonConfirm() {
            var that = this;
            that.$http('delete', that.$store.state.baseUrl + 'api/Order/' + that.taskId).then(function (res) {
                if (res.data.code != '00') {
                    AlertModule.show({
                        title: res.data.msg
                    })
                } else {
                    AlertModule.show({
                        title: "取消成功"
                    });
                    that.$router.go(-1)
                }
            })
        },
        // 获取验家长平均支付金额
        getAvgMoney(id) {
            var that = this;
            that.$http('get', that.$store.state.baseUrl + 'api/Order/avg-amount?taskId=' + id).then(function (res) {
                // console.log(res.data.data);
                if (res.data.code != '00') {
                    AlertModule.show({
                        title: res.data.msg
                    })
                } else {
                    that.amount = res.data.data;

                    // alert(res.data.data)
                }
            })
        },
        // 发送确认
        sendConfirm1() {
            var that = this;
            var infos = [];
            for (var i in that.timesList) {
                var obj = {};
                obj.amount = that.timesList[i].money;
                obj.date = that.timesList[i].date.replace(/\//g, '-') + " 00:00:00";
                // obj.taskId=that.taskId;
                (obj.taskId = that.taskId),
                // obj.taskId ='16'
                (obj.workHours = that.time.join(""));
                infos.push(obj);
            }
            // console.log(qs.stringify(infos));
            if (infos.length) {
                var postData = {
                    adjustmentFee: that.finalPrice * that.adjustmentRate,
                    handlingFee: that.serviceRate * that.finalPrice,
                    price: that.finalPrice,
                    timeStage: that.time[0],
                    totalTime: that.stage * that.time[0],
                    taskId: that.taskId,
                    stage: that.stage,
                    beginDate: that.beginDate.replace(/\//g, '-') + " 00:00:00",
                    endDate: that.endDate.replace(/\//g, '-') + " 00:00:00",
                    status: "2",
                    infos: infos,
                    uid: that.$store.state.uid,
                    workHours:that.time.join('')
                };
                //  postData = qs.stringify(postData)
                console.log(postData);

                axios
                    .post(that.$store.state.baseUrl + "api/Order/Stage", postData, {
                        headers: {
                            "Content-Type": "application/json;charset=UTF-8"
                        }
                    })
                    .then(function (res) {
                        //  alert(res.data.code)
                        if (res.data.code == "00") {
                            // alert('走到这')
                            AlertModule.show({
                                title: "确认成功",
                                onHide() {
                                    that.sendSuccess = true;
                                }
                            });

                        } else {
                            //  alert('走到这1')
                            AlertModule.show({
                                title: res.data.msg
                            });
                        }
                    });
            } else {
                AlertModule.show({
                    title: "请点击生成费用列表"
                });
            }
        },
        // 获取已经确认得用户信息
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
                        if (that.taskObj.authorId) {
                            for (var i in result) {
                                if (result[i].uid == that.taskObj.authorId) {
                                    result.splice(i, 1)
                                }
                            }
                        }

                        console.log(result);
                      
                        // // 判断任务类型,如果是1,3.就把发布者也算到家长列表中
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
                            result.push(obj);
                            that.bussArr = result;

                        }
                        that.bussArr = result;
                        // alert(that.bussArr.length)
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
                        
                        that.nicknameArr = nicknameArr;
                        console.log("弹窗需要支付的家长");
                        console.log(that.bussArr);
                    }
                });
        },
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
                    if (res.data.code == "00") {
                        AlertModule.show({
                            title: "发送成功",
                            onHide() {
                                that.canTalk = false;
                                that.getTalkList();

                            }
                        });
                    } else {
                        AlertModule.show({
                            title: res.data.msg
                        });
                    }
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
                    console.log("留言列表");
                    console.log(res.data.data)
                    that.talkList = res.data.data;
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

        // 点击修改费用明细
        reEditInfo() {
            this.sendSuccess = false;
        },
        // 获取下面的渲染列表
        getTimesList() {
            this.timesList = []
            var step = this.times.join("");
            var s1 = this.beginDate.replace(/-/g, "/");
            var s2 = this.endDate.replace(/-/g, "/");
            var originPrice = this.finalPrice;

            if (s1 != "" && s2 != "") {
                var totalDay = Number(this.DateDiff(s1, s2));
                // alert("总天数" + totalDay);
                var yushu = Number(totalDay) % Number(step);
                //  alert("余数" + yushu);
                totalDay -= Number(yushu);
                //  alert("总天数" + totalDay);
                var gapDay = parseInt(totalDay / step);
            }
            // alert("总金额" + this.finalPrice);

            var arr = [{
                index: 1,
                date: s1
            }];
            for (var i = 1; i <= step; i++) {
                var obj = {};
                obj.index = i;
                obj.date = "";
                obj.money = 0;
                arr.push(obj);
                arr[i].date = this.getNextDate(arr[i - 1].date, gapDay);
            }
            arr = arr.slice(1, arr.length);
            var yushuPrice
            if (this.finalPrice < arr.length) {
                yushuPrice = 0;
            } else {
                yushuPrice = this.finalPrice % arr.length;
            }
            // console.log('余下的'+yushuPrice)
            // this.finalPrice -= yushuPrice;
            // var finalPrice = this.finalPrice;
            var finalPrice = this.finalPrice - this.serviceRate * this.finalPrice - this.finalPrice * this.adjustmentRate;
            console.log(this.finalPrice + "--" + this.serviceRate * this.finalPrice + "--" + this.finalPrice * this.adjustmentRate)
            // alert(finalPrice)
            // alert(yushuPrice)
            finalPrice -= yushuPrice;
            // alert(finalPrice)
            this.eachPrice = finalPrice / arr.length;
            console.log('eachPrice' + finalPrice / arr.length)
            for (var i in arr) {
                arr[i].money = this.eachPrice;
            }
            console.log("finalPrice" + finalPrice);
            console.log("价格余数" + yushuPrice);
            if (yushu != 0) {
                arr[arr.length - 1].date = this.getNextDate(
                    arr[arr.length - 1].date,
                    yushu
                );
                this.finalPrice = originPrice;
            }
            if (yushuPrice != 0) {
                arr[arr.length - 1].money += yushuPrice;
            }
            this.timesList = arr;

            this.actualEachStage =
                Math.floor(
                    this.finalPrice -
                    this.serviceRate * this.finalPrice -
                    this.finalPrice * this.adjustmentRate
                ) / this.timesList.length;
            this.showPositionValue = true;
        },
        getNextDate(beginDate, day) {
            var that = this;
            beginDate = that.convertDateFromString(beginDate);

            var time1 =
                beginDate.getFullYear() +
                "/" +
                (beginDate.getMonth() + 1) +
                "/" +
                beginDate.getDate(); //time1表示当前时间
            var date2 = new Date(beginDate);

            date2.setDate(beginDate.getDate() + day);

            var time2 =
                date2.getFullYear() +
                "/" +
                (date2.getMonth() + 1) +
                "/" +
                date2.getDate();

            return time2;
        },
        // 字符串转date对象
        convertDateFromString(dateString) {
            if (dateString) {
                var date = new Date(dateString.replace(/-/, "/"));

                return date;
            }
        },

        // 求两个日期之间差多少天
        DateDiff(sDate1, sDate2) {
            //sDate1和sDate2是2002-12-18格式
            var aDate, oDate1, oDate2, iDays;
            aDate = sDate1.split("/");
            oDate1 = new Date(aDate[1] + "/" + aDate[2] + "/" + aDate[0]); //转换为12-18-2002格式
            aDate = sDate2.split("/");
            oDate2 = new Date(aDate[1] + "/" + aDate[2] + "/" + aDate[0]);
            iDays = parseInt(
                Math.abs(Date.parse(oDate1) - Date.parse(oDate2)) / 1000 / 60 / 60 / 24
            ); //把相差的毫秒数转换为天数

            return iDays;
        },
        // 获取任务费用明细
        getStageDetail() {
            var that = this;
            that.$http('get', that.$store.state.baseUrl + 'api/Order/Stage/' + that.taskId).then(function (res) {
                if (res.data.code == '00') {
                    var result = res.data.data.infos;
                    // status (integer, optional): 状态(1-待确认,2-已确认待支付,3-已支付,4-已拒绝待修改后重新确认) ,
                    that.infoStatus = res.data.data.status;
                    for (var i in result) {
                        if (result[i].success) {
                            continue;
                        } else {
                            that.nextStageTime = result[i].date;
                            break;
                        }
                    }
                    // that.stageDetail = res.data.data;
                    var arr = [];
                    var arr1 = [];

                    that.finalPrice = res.data.data.price;
                    arr[0] = res.data.data.stage
                    arr1[0] = res.data.data.timeStage
                    that.times = arr;
                    that.time = arr1;
                    that.beginDate = res.data.data.beginDate.substr(0, 10);
                    that.endDate = res.data.data.endDate.substr(0, 10);

                    for (var i in res.data.data.infos) {
                        res.data.data.infos[i].money = Number(res.data.data.infos[i].amount);
                        res.data.data.infos[i].date = res.data.data.infos[i].date.substr(0, 10);
                        res.data.data.infos[i].index = ++i;
                    }
                    that.timesList = res.data.data.infos;

                }
            })

        },
        addDate(date, days) {
            Date.prototype.Format = function (fmt) { //author: meizz 
                var o = {
                    "M+": this.getMonth() + 1, //月份 
                    "d+": this.getDate(), //日 
                    "h+": this.getHours(), //小时 
                    "m+": this.getMinutes(), //分 
                    "s+": this.getSeconds(), //秒 
                    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
                    "S": this.getMilliseconds() //毫秒 
                };
                if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            }
            var date = new Date(date);
            var milliseconds = date.getTime() + 1000 * 60 * 60 * 24 * days;
            var time = new Date(milliseconds).Format("yyyy-MM-dd hh:mm:ss");
            return time;
        },
        // 获取任务详情
        getMissiondetail(id) {
            var that = this;
            that
                .$http(
                    "get",
                    that.$store.state.baseUrl +
                    "api/Order/" +
                    id +
                    "?uid=" +
                    this.$store.state.uid
                )
                .then(function (res) {
                    if (res.data.code != "00") {
                        AlertModule.show({
                            title: res.data.msg
                        });
                    } else {
                        that.taskObj = res.data.data;
                        // alert(that.taskObj.status)
                        if (that.taskObj.uid == that.$store.state.uid) {
                            that.isMyTask = true
                        } else {
                            that.isMyTask = false;
                        }
                        if (that.taskObj.amount == 0) {
                            that.isNew = true
                        } else {
                            that.isNew = false
                        }

                        var type = res.data.data.taskType;
                        that.missionType = res.data.data.taskType;
                        // 判断任务类型,如果是1,3.就把发布者也算到家长列表中
                        if (that.taskObj.taskType == 1 || that.taskObj.taskType == 3) {
                            var obj = {}
                            obj.user = {}
                            obj.user.nickname = that.taskObj.webUser.nickname
                            if (!that.taskObj.payTime) {
                                obj.pay = 2
                            } else {
                                obj.pay = 3
                            }
                            that.bussArr.push(obj)
                        }

                        // alert(res.data.data.amount)
                        that.getUser("postUser", that.taskObj.uid);
                        that.getUser("serviceProvider", that.taskObj.authorId);
                        var payBeginTime = new Date(that.taskObj.payBeginTime)
                        console.log("支付截至日期" + that.addDate(that.taskObj.payBeginTime, 0.01))

                        function dateCompare(startDate, endDate) {
                            var aStart = startDate.split('-'); //转成成数组，分别为年，月，日，下同
                            var aEnd = endDate.split('-');
                            var startDateTemp = aStart[0] + "/" + aStart[1] + "/" + aStart[2];
                            var endDateTemp = aEnd[0] + "/" + aEnd[1] + "/" + aEnd[2];
                            if (startDateTemp > endDateTemp)
                                return true;
                            else
                                return false;
                        }
                        var month = new Date().getMonth() + 1
                        var startDate = new Date().getFullYear() + "-" + month + "-" + new Date().getDate()
                        Date.prototype.Format = function (fmt) { //author: meizz 
                            var o = {
                                "M+": this.getMonth() + 1, //月份 
                                "d+": this.getDate(), //日 
                                "h+": this.getHours(), //小时 
                                "m+": this.getMinutes(), //分 
                                "s+": this.getSeconds(), //秒 
                                "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
                                "S": this.getMilliseconds() //毫秒 
                            };
                            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                            for (var k in o)
                                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                            return fmt;
                        }
                        startDate = new Date(startDate).Format("yyyy-MM-dd hh:mm:ss")
                        console.log("今天" + startDate)
                        console.log(that.addDate(that.taskObj.payBeginTime, 3))
                        console.log(dateCompare(startDate, that.addDate(that.taskObj.payBeginTime, 3)))
                        that.canPay = dateCompare(startDate, that.addDate(that.taskObj.payBeginTime, 3))
                        // alert(that.canPay)
                    }
                });
            // 被选择的家教
            that.getConfirmWriter(that.taskId);

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
                            title: "拒绝成功"
                        });
                        that.$router.push({
                            path:'/mission'
                        })
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
                                // !that.canPay
                                if (true) {
                                    that.$router.push({
                                        path: '/OrderPay',
                                        query: {
                                            amount: that.amount,
                                            taskId: that.taskId
                                        }
                                    })
                                } else {
                                    AlertModule.show({
                                        title: "抱歉，支付有限期已过"
                                    })
                                }

                            }
                        });

                    }
                });
        },
        // 获取阶段次数
        timesChange(val) {
            // console.log(val)
            this.stage = val.join("");
        },
        // 获取每次时长
        timeChange(val) {
            console.log(val);
            console.log(this.time);
        },
        // 开始时间
        beginDateChange(val) {
            var origintime = val;
            var that = this;
            that.beginDate = val.replace(/-/g, '/');
            that.endStartDate = origintime

        },
        // 结束日期
        endDateChange(val) {
            this.timesListEndDate = val;
            this.endDate = val.replace(/-/g, '/');
        }
    }
};
</script>

<style scoped>
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

body {
    background: #f5f5f5 !important;
}

#replyDetail {
    padding-bottom: 95px;
    position: relative;
}

.smallBtn {
    border: 1px solid #3375c5;
    border-radius: 5px;
    padding: 3px 5px;
    color: #999999;
}

#replyDetail .topTips {
    padding: 10px;
    align-items: flex-start;
    vertical-align: top;
    color: #8a8a8a;
    font-size: 11px;
}

#replyDetail .icon {
    height: auto;
    margin-right: 7px;
    display: inline-block;
    fill: #f83345;
}

#replyDetail .brifMsg {
    padding: 12px 10px;
    color: #999;
    line-height: 20px;
}

#replyDetail .brifMsg .mainText {
    text-decoration: underline;
}

#replyDetail .bgDetail {
    padding: 13px 11px;
    color: #999999;
    font-size: 12px;
    background: #f5f5f5;
    border-bottom: 16px solid #fff;
    margin-bottom: 10px;
}

#replyDetail .bgDetail .firstP {
    margin-bottom: 10px;
}

#replyDetail .eachBox {
    margin-bottom: 10px;
}

#replyDetail .eachBox .titleBox {
    padding: 14px 19px;
    color: #999999;
    font-size: 12px;
    border-bottom: 1px solid #b2b2b2;
}

#replyDetail .eachBox .content {
    padding: 21px 10px 0px 10px;
    line-height: 25px;
    color: #999999;
    font-size: 12px;
}

#replyDetail .eachBox .content .right {
    /* padding-left: 44px; */
}

#replyDetail .eachBox .strongText {
    font-size: 14px;
    margin-top: 13px;
    color: #999999;
    padding-left: 18px;
    padding-bottom: 24px;
    font-weight: bold;
}

#replyDetail .vux-cell-value {
    color: #3375C5 !important
}

#replyDetail .eachBox .content .eachHang {
    font-size: 14px;
    margin-bottom: 10px;
}

#replyDetail .eachBox .content .eachHang .center {
    color: #242424;
    padding: 4px 15px;
    border-radius: 5px;
    background: #f5f5f5;
    border: 1px solid #cecece;
    min-width: 105px;
    width: 120px;
}

#replyDetail .eachBox2 {
    padding-bottom: 16px;
}

#replyDetail .eachBox2 .content .right {
    padding-left: 0;
    font-weight: bold;
}

#replyDetail .eachBox3 .content .eachItem {
    margin-bottom: 10px;
    align-items: end
}

#replyDetail .eachBox3 .content .eachItem .rightTime {
    width: 100%;
    align-items: flex-start;
    border-bottom: 1px solid #b2b2b2;
    padding-bottom: 10px;
}

#replyDetail .eachBox3 .content .eachItem .rightTime div {
    color: #333333;
}

#replyDetail .eachBox3 {
    margin-bottom: 129px;
}

#replyDetail .bottomBtnBox {
    padding: 7px 10px;
    font-size: 14px;
}

#replyDetail .btnBox {
    position: fixed;
    bottom: 0;
    padding: 16px 10px;
    width: 100%;
    background: #fff;
    border-top: 1px solid #c3c3c3;
}

#replyDetail .long_btn {
    width: 100%;
    margin-top: 0px !important;
}

#replyDetail .long_btn.disable {
    background: #c3c3c3;
}

#replyDetail .bottomBtnBox button.refuce {
    background: #fff !important;
    color: #ea4a5c !important;
    border-color: #ea4a5c !important;
}

#replyDetail .bottomBtnBox button.refuce.weui-btn:after {
    border-color: #ea4a5c !important;
}

#replyDetail .sendConfirm .content {
    padding-right: 0;
    padding-top: 0;
}

#replyDetail .sendConfirm .eachLink {
    color: #333333;
    font-size: 15px;
    border-bottom: 1px solid #d9d9d9;
    padding-top: 8px;
    padding-bottom: 14px;
    padding-right: 8px;
}

#replyDetail .sendConfirm .eachLink.slide {
    padding: 0;
}

#replyDetail .sendConfirm .eachLink>div {
    width: 100%;
}

#replyDetail .sendConfirm .eachLink.finalPriceLink>div {
    width: auto;
}

#replyDetail .weui-cells:before,
#replyDetail .weui-cells:after {
    border: none;
}

.long_btn.red {
    background: #fff;
    color: #EA4A5C;
    border: 1px solid #EA4A5C;
    margin-left: 10px;
}

#replyDetail .weui-cell {
    padding-left: 0;
    width: 100%;
}

#replyDetail .weui-cell .center {
    width: auto;
}

#replyDetail .sendConfirm .eachLink .vux-x-icon.vux-x-icon-ios-arrow-right.arrow {
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
    position: fixed;
    width: 100%;
    top: 0;
    bottom: 0;
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
