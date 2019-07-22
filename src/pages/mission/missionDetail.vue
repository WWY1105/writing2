<template>
<div id="missionDetail" class="bgW">
  
    <div class="main" >
        <div class="content">
            <div class="peple flexSpace">
                <div class="left flexStart">
                    <img :src="$store.state.imgUrl+showData.author.imgurl" alt="" @click="seeUserDetail(showData.uid)">
                    <div class="desc">
                        <p class="name">{{showData.author.nickname}}</p>
                    </div>
                </div>
                <div class="right">
                    <p class="priceDesc">费用预算</p>
                    <p class="price">￥{{showData.fee}}/人时</p>
                </div>
            </div>
            <div class="detailShift">
                <p class="blueTitle flexSpace">
                    <span>状态：{{showData.statusText}}</span>
                    <span>截至报名：{{showData.deadline?showData.deadline.substr(0,10):''}}</span>
                </p>
                <p class="flexSpace">
                    <span>{{showData.classNo}} / {{showData.category}}</span>
                    <span>已报名：{{showData.applicationCount}}</span>
                </p>
                <p class="flexSpace">
                    <span>{{showData.coordination=='online'?'远程协作':showData.coordination=='author'?'家教拜访':showData.coordination=='busniess'?'家长拜访':'不限'}} / {{showData.area.split(',').join('')}}</span>
                    <span>发布日期：{{showData.createTime?showData.createTime.substr(0,10):''}}</span>
                </p>
            </div>
            <div class="bgDetail">
                <p class="firstP">简述：{{showData.introduction}}</p>
                <div style="word-wrap: break-word;">详述：{{showData.content}}
                </div>
            </div>

            <!--进度条-->
            <div class="stepBox flexSpace">
                <div class="line"></div>
                <div :class="showData.status=='2'?'active item flexCenter':''">
                    <p class="circle"></p>
                    <p class="text">待确认</p>
                </div>
                <div :class="showData.status=='8'?'active item flexCenter':''">
                    <p class="circle"></p>
                    <p class="text">执行</p>
                </div>
                <div :class="showData.status=='4'||showData.status=='88'?'active item flexCenter':''">
                    <p class="circle"></p>
                    <p class="text">结束</p>
                </div>
            </div>

        </div>
        <!-- -->
        <div class="enrollBox bgW"  v-if="isMyTask&&taskType!=2" >
            <div class="title flexSpace">
                <div class="left flexSpace">
                    <p>处理报名</p>
                </div>
            </div>
            <!-- 循环报名者 -->
            <div class="writerBox" v-if="isMyTask">
                <writers :selfCon="item.user.selfCon" :isMissionDetail='false' v-for="item,index in enrollerWriterList" :imgurl="item.user.imgurl" :shortName="item.user.nickname" ></writers>
                <!-- <writers :isMissionDetail='false' :serviceHours="item.user.serviceHours" :serviceOrderCount="item.user.serviceOrderCount" :serviceUserCount="item.user.serviceUserCount" :authorAuth="item.user.authorAuth" :type="item.user.type"  :isCanChoose="isCanChoose" @click.native="chooseWriter(index)"   v-if="enrollerWriterList.length==0?false:true" v-for="item,index in enrollerWriterList" :cost=" item.user.cost"   :workHours="item.user.workHours" :realAuth="item.user.realAuth" :eduAuth="item.user.eduAuth" :userCount="item.user.userCount" :workAge="item.user.authorAuthInfo.workAge" :soleCost="item.user.authorInfo.soleCost" :shortName="item.user.nickname" :uid="item.uid" :userTags="item.user.authorInfo.userTags"></writers> -->
            </div>
        </div>

        <!-- 不是我的任务 -->
        <div class="btnBox bgw" v-if="!isMyTask">
        </div>
        <!-- 是我的任务 -->
        <div class="btnBox bgw" v-if="isMyTask">
            <button  class="long_btn red" @click.stop="deleteTesk">取消发布</button>
        </div>

            <!-- 书上没有被选中为服务人 -->
            <!-- <button class="long_btn disable" v-show="bussCancelMission">已结束</button>

            <button v-show="hasReplyToConfirm" class="long_btn" @click="toConfirmTask" >发布者已回复，请确认</button>
            <button v-show="waitForConfirm" class="long_btn disable">已报名，请等待发布者确认</button>
            <button v-show="authorrefuse" class="long_btn disable">已拒绝</button>
            <button v-show="toApply" :class="showData.deadline=='2199-01-01 00:00:00'?'long_btn disabled':'long_btn '"    @click="toEnroll">{{showData.deadline=='2199-01-01 00:00:00'?'定向任务':'参加报名（截至'+showData.deadline+"）"}}</button> -->
            <!--我是家长(不是发布者)-->
            <!-- <flexbox v-show="toPayNotMine">
                <button  class="long_btn" @click="toPay" >发布者已回复，请确认</button>
            </flexbox>
        </div>
        <div class="btnBox bgw" v-show="isMyTask"> -->
            <!-- 已经结束的任务 -->
            <!-- <button class="long_btn disable" v-show="cancelMission">已结束</button> -->
            <!-- 我的任务，未确认 -->
            <!-- <flexbox v-show="toConfirmReplyer">
                <flexbox-item>
                    <router-link tag="button" :class="taskStatus==2&&!noInfos?'long_btn clbm disabled':'long_btn clbm'" :to="{path:'/handelEnroll',query:{taskId:id,priceType:showData.priceType,enrollStatus:enrollStatus,taskType:showData.taskType,busniessCount:showData.busniessCount}}">下一步
                        <badge v-show="enrollerWriterList.length+enrollerBussList.length==0?false:true" :text="enrollerWriterList.length+enrollerBussList.length"></badge>
                    </router-link>
                </flexbox-item>
                <flexbox-item><button  class="long_btn red" @click.stop="deleteTesk">取消发布</button></flexbox-item>
            </flexbox>

        </div>
        <div class="btnBox bgw" v-show="isMyTask&&toPayIsMine"> -->
            <!--我是家长-->
       
            <!-- 我的任务，已经发送费用明细，等待报名者确认 -->
            <!-- <flexbox>
                <flexbox-item>
                   <button  :class="taskStatus==1||taskStatus==8?'long_btn clbm disabled':'long_btn clbm'" @click="toPay">下一步
                    <badge v-show="feeConfirmList.length==0?false:true" :text="feeConfirmList.length"></badge>
                </button>
                </flexbox-item>
                <flexbox-item><button  :class="taskStatus==8?'long_btn red disabled':'long_btn red '" @click.stop="deleteTesk">取消发布</button></flexbox-item>
                <div v-transfer-dom>
                    <confirm v-model="show" @on-cancel="onCancel" @on-confirm="deleteTeskonConfirm">
                        <p style="text-align:center;">确定取消任务吗</p>
                    </confirm>
                </div>
            </flexbox>
        </div> -->
        <!--排序-->
        <!-- <div v-transfer-dom id="myPop"> -->
            <!-- 保存并推出getMissionOrderType -->
            <!-- <sortPopup :pxIsShow="pxIsShow" :sortOptions="sortOptions" @getPxIsShow="getPxIsShow" @getMissionOrderType="getMissionOrderType"></sortPopup> -->
        <!-- </div> -->
    </div>

</div>
</template>

<script>
import common from '@/assets/js/common'
import writers from '@/components/writer/writer'
import sortPopup from "@/components/sortPopup/sortPopup";
import sliderPopupPicker from "@/components/sliderPopupPicker";
import radioPicker from "@/components/radioPicker";
import slidePicker from "@/components/slidePicker";
import {
    Step,
    StepItem,
    XButton,
    XHr,
    AlertModule,
    Flexbox,
    FlexboxItem,
    Badge,
    Toast,
    Confirm,
    XAddress,
    XSwitch,
    ChinaAddressV4Data,
    Value2nameFilter as value2name,
    Group,
} from 'vux'
export default {
    components: {
        Badge,
        writers,
        Step,
        StepItem,
        XButton,
        XHr,
        AlertModule,
        Flexbox,
        FlexboxItem,
        Toast,
        Confirm,
        sortPopup,
        XAddress,
        XSwitch,
        sliderPopupPicker,
        ChinaAddressV4Data,
        radioPicker,
        slidePicker,
        Group,
    },
    data() {
        return {
            isCanChoose: true,
            // 剩余时间
            remainingTime: {},
            step1: 1,
            step2: 0,
            // 任务的id
            id: this.$route.query.id,
            showData: {},
            show: false,
            shortClass: '',
            shortSubject: '',
            // 是否已报名
            apply: false,
            enrollerWriterList: [],
            feeConfirmList: [],
            enrollerBussList: [],
            allEnroller: [],
            // 是不是我的任务
            isMyTask: false,
            authorInfo: {},
            userData: {},
            taskStatus: '',
            taskType: '1',
            enrollStatus: 0,
            // 是我报名的任务，并且我是家长得时候
            isPay: false,
            amount: 0,
            isConfirm: false,
            canPay: false,
            // 已报名，请等待发布者确认
            waitForConfirm: false,
            // 发布者已回复，请确认
            hasReplyToConfirm: false,
            // 下一步，确认报名者
            toConfirmReplyer: false,
            // 家长支付，不是我发布的
            toPayNotMine: false,
            toPayIsMine: false,
            // 参加报名
            toApply: false,
            // 已经结束的 任务
            cancelMission: false,
            // 我的任务，已经发送费用明细，等待报名者确认
            toConfirmReplyerHasPayList: false,
            // 已选中服务人,但是我没有被选中
            bussCancelMission: false,
            noInfos: true,
            // 我是曾经被选中的家教,但是把任务拒绝了
            authorrefuse: false,
            infoStatus: '',
            pxIsShow: false,
            sxIsShow: false,
            mainShow: true,
            // follow-关注,userCount-用户数,workHours-家教小时,price-单价最低,work-家教值
            sortOptions: [{
                    value:"优先显示我关注用户的任务",
                    key: "follow"
                },
                {
                    value:"优先显示相关家长数最多的用户的任务",
                    key: "userCount"
                },
                {
                    value:"优先显示家教小时数最多的用户的任务",
                    key: "workHours"
                },
                {
                    value:"优先显示每人小时费最少的任务",
                    key: "price"
                },
                {
                    value:"优先显示累计家教值最多的用户的任务",
                    key: "work"
                }
            ],
            enmrollWriterPostData: {},
            who: '',
            enmrollBussPostData: {},
            rangValue: 0,
            sliderSubjectArr: [],
            sliderBigClassArr: [],
            sliderClassArr: [],
            slidePriceArr: [],
            slidePriceArr2: [],
            // 传入slidePicker的数据
            subjectArr: [],
            gradesArr: [],
            leftText1: "年级",
            leftText2: "科目",
            rightText0: "",
            rightText00: "",
            rightText1: "",
            rightText4: "",
            rightText3: "",
            leftText3: "费用预算（每小时）",
            leftText4: "上课方式",
            leftText5: "上课区域",
            myarea: [],
            coordination: [
                ["不限", "家教拜访", "家长拜访", "远程协作"]
            ],
            coordination2: [
                ["不限", "家教拜访", "家长拜访", "远程协作"]
            ],
            rightText2: "不限",
            // 传入radio的值
            radioTitle: "选择性别",
            publish_title: "组班方式",
            addressData: [{"name":"上海市","value":"310000"},{"name":"市辖区","value":"310100","parent":"310000"},{"name":"黄浦区","value":"310101","parent":"310100"},{"name":"徐汇区","value":"310104","parent":"310100"},{"name":"长宁区","value":"310105","parent":"310100"},{"name":"静安区","value":"310106","parent":"310100"},{"name":"普陀区","value":"310107","parent":"310100"},{"name":"虹口区","value":"310109","parent":"310100"},{"name":"杨浦区","value":"310110","parent":"310100"},{"name":"闵行区","value":"310112","parent":"310100"},{"name":"宝山区","value":"310113","parent":"310100"},{"name":"嘉定区","value":"310114","parent":"310100"},{"name":"浦东新区","value":"310115","parent":"310100"},{"name":"金山区","value":"310116","parent":"310100"},{"name":"松江区","value":"310117","parent":"310100"},{"name":"青浦区","value":"310118","parent":"310100"},{"name":"奉贤区","value":"310120","parent":"310100"},{"name":"崇明区","value":"310151","parent":"310100"}],
            radiosArr: [{
                    value: 1,
                    text: "1对1",
                    selected: true
                },
                {
                    value: 2,
                    text: "1对多",
                    selected: false
                }
            ],
            radios_sex_Arr: [{
                    value: 0,
                    text: "不限",
                    selected: true
                },
                {
                    value: 1,
                    text: "男",
                    selected: false
                },
                {
                    value: 2,
                    text: "女",
                    selected: false
                }
            ],
            minWorkAge: "",
            maxWorkAge: "",
            stringValue1: false,
            stringValue2: false,
            stringValue3: false,
            // 传入radio的值 end
            postData: {}
        }
    },
    mounted() {
        this.myarea = [];
        this.getPriceArr();
        this.getCategory();
        this.getBigGrade();
        // console.log()
        this.getMissiondetail(this.id);

        // 获取当前登陆用户信息
        // this.getauthor(this.$store.state.uid)
        // 获取当前用户是否已确认
        // this.getIsConfirm(this.id)

    },
    methods: {
        ...common,
        addressChange() {},
        // ------------------------------------------------------------------------------------------
        // 排序
        sortMethod(who) {
            var that = this;
            that.pxIsShow = !that.pxIsShow;
            console.log('谁的排序' + who)
            that.who = who;

        },
        // 排序
        getMissionOrderType(val) {
            var that = this;
            console.log(val)
            if (that.who == 'author') {
                that.enmrollWriterPostData.order = val;
                that.getEnrollWriter()
            } else {
                that.enmrollBussPostData.order = val;
                that.getEnrollBuss()
            }

        },
        // 点击筛选
        clickSS(type) {
            var that = this;
            that.sxIsShow = true;
            // that.pxIsShow = false;
            // that.scrollerShow = false;
            that.mainShow = false;
            that.who = type;
        },
        // 提交筛选条件
        showSSdata() {
            var that = this;
            console.log(that.postData)
            that.postData.realAuth = that.stringValue1 ? '2' : "";
            that.postData.eduAuth = that.stringValue2 ? '2' : "";
            that.postData.authorAuth = that.stringValue3 ? '2' : "";
            that.postData.minWorkAge = that.minWorkAge;
            that.postData.maxWorkAge = that.maxWorkAge;
            that.postData.pageSize = 10;
            if (that.postData.minWorkAge < 0 || that.postData.maxWorkAge > 80) {
                AlertModule.show({
                    title: "家教年限不在范围中"
                })
            } else {
                if (that.who == 'author') {
                    Object.assign(that.enmrollWriterPostData, that.postData)
                } else {
                    Object.assign(that.enmrollBussPostData, that.postData)
                }
            }
            // that.getEnrollWriter()
            // that.getEnrollBuss()
            that.cancelSS()
        },
        // 取消筛选
        cancelSS() {
            // console.log('11')
            this.sxIsShow = false;
            // this.scrollerShow = true;
            this.mainShow = true;
        },
        changeResultGrade(val) {
            this.postData.classNo = val.name;
            this.rightText0 = val.name;
        },
        // 区域
        onAddressChange(val) {
            var arr = [];
            this.postData.area = value2name(this.myarea, ChinaAddressV4Data)
                .split(" ")
                .join(",");
        },
        changeResultKM1(val) {
            // 科目
            this.postData.category = val.name;
            this.rightText00 = val.name;
        },
        // 价格
        changeResultPrice1(val) {
            // 价格
            console.log('价格')
            console.log(val)
            // 发布任务页面
            this.postData.fee = val.name.split('元')[0].split('~').join('-');
            this.rightText4 = val.name
        },
        changeResult(val) {},
        // --------------------------------------------------------------------------------------------------------
        // 支付
        toPay() {
            var that = this;
            that.$router.push({
                path: 'replyDetailsToPay',
                query: {
                    taskId: that.id
                }
            })

        },
        // 获取当前用户是否已确认
        // getIsConfirm(id) {
        //     var that = this;
        //     that.$http('get', that.$store.state.baseUrl + 'api/Order/user-apply?taskId=' + id + "&uid=" + that.$store.state.uid).then(function (res) {
        //         // console.log(res.data.data);
        //         if (res.data.code != '00') {
        //             AlertModule.show({
        //                 title: res.data.msg
        //             })
        //         } else {
        //             if (res.data.data != null) {
        //                 //是否确认：：：：：1:待确认;2已确认;3已拒绝
        //                 if (res.data.data.feeConfirm) {
        //                     var feeConfirm = res.data.data.feeConfirm;
        //                     if (feeConfirm == '2') {
        //                         that.isConfirm = true;
        //                     }
        //                 }
        //                 // 是否支付
        //                 // pay (integer, optional): 支付状态(1-不需要支付,2-待支付,3-已支付,4-已拒绝) ,
        //                 if (res.data.data.pay == 2 && that.$store.state.uid != res.data.data.authorId) {
        //                     that.isPay = true
        //                 } else {
        //                     that.isPay = false
        //                 }
        //             }
        //         }
        //     })
        // },
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

        // var addTime = addDate(currentDateTime(), 3);//当前时间加3天

        // 家教已经回复，去确认任务信息
        toConfirmTask() {
            var that = this;
            if (that.isConfirm) {
                AlertModule.show({
                    title: "您已经确认过了"
                })
            } else {
                that.$router.push({
                    path: '/toConfirmMission',
                    query: {
                        // chooseWriterId: that.$store.state.uid,
                        // isNew: false,
                        taskId: that.id,
                        sendSuccess: true
                    }
                })
            }

        },
        // 单选一个家教
        chooseWriter(i) {
            // console.log('点击了')
            var that = this;
            for (var i in that.enrollerWriterList) {
                that.enrollerWriterList[i].isChoosen = false;
            }
            that.enrollerWriterList[i].isChoosen = !that.enrollerWriterList[i].isChoosen;
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
            that.$http('delete', that.$store.state.baseUrl + 'api/Order/' + that.id).then(function (res) {
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
        // getEnrollBuss() {
        //     var that = this;
        //     console.log(' that.enmrollBussPostData')
        //     console.log(that.enmrollBussPostData)
        //     that.$http('get', that.$store.state.baseUrl + 'api/Order/Apply/List', that.enmrollBussPostData).then(function (res) {
        //         // console.log(res.data.data);
        //         if (res.data.code != '00') {
        //             AlertModule.show({
        //                 title: res.data.msg
        //             })
        //         } else {
        //             var result = res.data.data;
        //             that.allEnroller = result;
        //             // 我报名了++++++++++++++++已选定服务人
        //             if (that.apply && that.taskStatus == 2) {
        //                 var uidList = [];

        //                 for (var i in that.allEnroller) {
        //                     uidList.push(that.allEnroller[i].uid)
        //                 }
        //                 var flag;
        //                 // 报名了,查看当前用户有没有被选中
        //                 if (uidList.indexOf(that.$store.state.uid) > -1) {
        //                     flag = true;
        //                 } else {
        //                     flag = false
        //                 }

        //                 if (!flag && that.taskStatus == 3) {
        //                     that.bussCancelMission = true;
        //                     that.hasReplyToConfirm = false
        //                 } else if (flag && that.taskStatus == 3) {
        //                     that.bussCancelMission = false;
        //                     that.hasReplyToConfirm = true
        //                 }
        //             }
        //             that.enrollerBussList = result
        //         }
        //     })
        // },
        // 获取报名的家教列表
        // getEnrollWriter() {
        //     var that = this;
        //     console.log(' that.enmrollWriterPostData')
        //     console.log(that.enmrollWriterPostData)
        //     that.$http('get', that.$store.state.baseUrl + 'api/Order/Apply/List', that.enmrollWriterPostData).then(function (res) {
        //         // console.log(res.data.data);
        //         if (res.data.code != '00') {
        //             AlertModule.show({
        //                 title: res.data.msg
        //             })
        //         } else {
        //             var result = res.data.data;
        //             that.allEnroller = result;
        //             // 我报名了++++++++++++++++已选定服务人
        //             if (that.apply && that.taskStatus == 2) {
        //                 var uidList = [];

        //                 for (var i in that.allEnroller) {
        //                     uidList.push(that.allEnroller[i].uid)
        //                 }
        //                 var flag;
        //                 // 报名了,查看当前用户有没有被选中
        //                 if (uidList.indexOf(that.$store.state.uid) > -1) {
        //                     flag = true;
        //                 } else {
        //                     flag = false
        //                 }

        //                 if (!flag && that.taskStatus == 3) {
        //                     that.bussCancelMission = true;
        //                     that.hasReplyToConfirm = false
        //                 } else if (flag && that.taskStatus == 3) {
        //                     that.bussCancelMission = false;
        //                     that.hasReplyToConfirm = true
        //                 }
        //             }
        //             that.enrollerWriterList = result;
        //         }
        //     })
        // },
        // 报名
        toEnroll() {
            var that = this;

            //任务类型：1-找家教,2-找家长,3-团家长找家教
            var missionType = that.showData.taskType;
            // 当前用户的身份
            var userType = that.userData.type;
            if (userType == 'author' && missionType == '2' || userType == 'business' && missionType == '1') {
                AlertModule.show({
                    title: "报名身份条件不满足",
                })
            } else {
                var postData = {
                    taskId: that.id,
                    uid: this.$store.state.uid
                }
                that.$http('post', that.$store.state.baseUrl + 'api/Order/Apply', postData).then(function (res) {
                    // console.log(res.data.data);
                    if (res.data.code != '00') {
                        AlertModule.show({
                            title: res.data.msg,
                            onHide: function () {
                                that.$router.push({
                                    name: 'mission'
                                })
                            }
                        })
                    } else {
                        AlertModule.show({
                            title: '报名成功',
                            onHide: function () {
                                that.$router.push({
                                    name: 'mission'
                                })
                            }

                        })

                    }
                })
            }
        },
        // 获取任务详情
        getMissiondetail(id) {
            var that = this;
            that.$http('get', that.$store.state.baseUrl + 'api/Order/' + id ).then(function (res) {
               
                // 都是任务的信息
                that.authorInfo = res.data.data.author.authorInfo;
                that.showData = res.data.data;
                that.enrollerWriterList= res.data.data.applies;
                console.log(';that.showData')
                console.log()

                if (that.showData.uid == that.$store.state.uid) {
                    that.isMyTask = true
                } else {
                    that.isMyTask = false;
                }

            })
        },

        nextStep() {
            this.step2++
        }
    }
}
</script>

<style scoped>
#missionDetail {
    /* min-height: 500px; */
    height: 100%;
    overflow: scroll;
    padding-bottom: 80px;
    /* position: relative; */
}

#missionDetail .btnBox {
    position: fixed;
    bottom: 0;
    padding: 8px 10px;
    width: 100%;
    background: #fff;
    border-top: 1px solid #C3C3C3;
    z-index: 99999999;
}

#sortPopup .sortBox {
    z-index: 9999999999999999999999;
}

.stepBox .line {
    z-index: 0;
}

body {
    background: #F5F5F5 !important;
}

#missionDetail .content .peple {
    padding: 11px;
}

#missionDetail .long_btn.disabled {
    background: #ccc !important;
    pointer-events: none;
    color: #fff !important;
    border-color: #333 !important;
}

#missionDetail .content .peple img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 11px;
    border:1px solid #ccc;
}

#missionDetail .content .peple .name {
    font-weight: bold;
    color: #646464;
    font-size: 14px;
    margin-bottom: 10px;
}

#missionDetail .content .peple .tag {
    color: #999;
}

#missionDetail .content .peple .tag i {
    color: #3375C5;
    margin-left: 4px;
}

#missionDetail .content .peple {
    padding-bottom: 12px;
    border-bottom: 1px solid #cecece;
}

#missionDetail .content .peple .right .smallBtn {
    color: #2EA200;
    border: 1px solid #2EA200;
    width: 60px;
    height: 20px;
    line-height: 20px;
    font-weight: bold;
    border-radius: 5px;
    text-align: center;
    margin-bottom: 8px;
}

#missionDetail .content .peple .right .price {
    color: #FF3636;
    font-weight: bold;
    font-size: 14px;
}

#missionDetail .detailShift {
    padding: 13px 11px;
    color: #999999;
    font-size: 12px;
}

#missionDetail .detailShift .flexSpace {
    margin-bottom: 3px;
}

#missionDetail .detailShift .flexSpace.blueTitle {
    color: #3374C4;
}

#missionDetail .bgDetail {
    padding: 13px 11px;
    color: #999999;
    font-size: 12px;
    background: #F5F5F5;
}

#missionDetail .bgDetail .firstP {
    margin-bottom: 10px;
}

#missionDetail .long_btn {
    width: 100%;
    margin-top: 0px !important;
}

#missionDetail .long_btn.disable {
    background: #C3C3C3;
}

.content .right .button {
    font-size: 14px;
    padding: 1px 7px 1px 12px;
    border-radius: 5px;
    margin-bottom: 8px;
    text-align: center;
}

.content .right .button.searchSS {
    color: #2EA200;
    border: 1px solid #2EA200;
}

.content .right .button.searchZZ {
    color: #3375C5;
    border: 1px solid #3375C5;
}

.content .right .button.searchSZ {
    color: #FEAB29;
    border: 1px solid #FEAB29;
}

#missionDetail .enrollBox .title {
    /* height: 40px;
    line-height: 40px; */
    color: #636363;
    font-size: 15px;
    border-top: 10px solid #F5F5F5;
    padding: 7px 15px;
    border-bottom: 1px solid #CECECE;
    /*  margin-top: 10px;
    margin-bottom: 60px; */
}

#missionDetail .enrollBox .title i.iconfont {
    color: #3374C4;
}

#missionDetail .enrollBox .title .right {
    padding-left: 30px;
    border-left: 1px solid #CECECE;
    min-width: 80px;
}

#missionDetail .enrollBox .title .left {
    width: 100%;
    padding-right: 30px;
}

#missionDetail .enrollBox .reacResult .titleBox {
    margin-bottom: 0;

}

#missionDetail .enrollBox .reacResult .details {
    font-size: 12px;
}

#missionDetail .reacResult {
    margin-top: 0;
}

#missionDetail .long_btn.red {
    background: #fff;
    color: #EA4A5C;
    border: 1px solid #EA4A5C;
}

#missionDetail .long_btn.clbm {
    position: relative;
}

#missionDetail .long_btn.clbm .vux-badge-single {
    position: absolute;
    top: 5px;
}

#missionDetail.workAgeBox .vux-label {
    color: #242424;
    font-size: 14px;
}

#missionDetail .workAgeBox {
    padding: 15px;
    flex-direction: row;
}

#missionDetail .workAgeBox input {
    /* max-width: 100px;
   */
    width: 45%;
    height: 30px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 0 5px;
    text-align: center;
}

.smalltitle {
    color: #242424;
    font-size: 14px;
    padding: 10px 16px;
}

#missionDetail .cancelResultBtn {
    background: #fff !important;
    border: 1px solid #999999;
    color: #707070 !important;
    margin-right: 10px;
    /* margin-top: 0; */
}
.priceDesc {
  color: #707070;
  font-size: 12px;
  text-align: end;
}
</style>
