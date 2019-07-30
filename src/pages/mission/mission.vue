<template>
<div id="mission">
    <!-- ================================================================================================-->

    <div class="main">
        <div v-transfer-dom>
            <popup v-model="sxIsShow" :popup-style="{zIndex: 89999}">
                <div class="popup1">
                    <group>
                        <!--年级选择-->
                        <sliderPopupPicker :zindex="90000" :gradesArr="sliderClassArr" :leftText="leftText1" v-on:changeResult="changeResultGrade"></sliderPopupPicker>
                    </group>
                    <group>
                        <!--科目选择器-->
                        <sliderPopupPicker :zindex="90000" :gradesArr="sliderSubjectArr" :leftText="leftText2" v-on:changeResult="changeResultKM"></sliderPopupPicker>
                    </group>
                    <group>
                        <!--费用预算（每小时）-->
                        <sliderPopupPicker :zindex="90000" :rightText="rightText4" :gradesArr="slidePriceArr2" :leftText="leftText3" v-on:changeResult="changeResultPrice"></sliderPopupPicker>
                    </group>
                    <group>
                        <!--上课方式-->
                        <slidePicker :zindex="90000" :sliderArr="coordination2" :leftText="leftText4" v-on:changeResult="changeResultWay"></slidePicker>
                    </group>
                    <group>
                        <!--上课区域-->
                        <x-address :popup-style="{zIndex: 502}" @on-show="addressChange" v-model="myarea" :gradesArr="addressData" :title="leftText5" :list="addressData" class="areaBox" @on-hide="onAddressChange"></x-address>
                    </group>
                    <group>
                        <button class="long_btn seeResultBtn" @click="showSSdata">显示筛选结果</button>
                    </group>
                </div>
            </popup>
        </div>

        <div >
            <!--顶部按钮-->

            <div class="topBox flexSpace">
                <div class="eachBtn shortOne" @click="toSort">
                    排序
                    <i class="iconfont icon-paixu"></i>
                </div>
                <span class="line"></span>
                <div class="eachBtn shortOne" @click.stop="clickSS">
                    筛选
                    <i class="iconfont icon-shaixuan"></i>
                </div>
            </div>
            <div class="scrollerBox" v-if="scrollerShow">
                <scroller use-pullup :pullup-config="pullupDefaultConfig" @on-pullup-loading="loadMore" use-pulldown :pulldown-config="pulldownDefaultConfig" @on-pulldown-loading="refresh" lock-x ref="scrollerBottom" height="-80">
                    <div>
                        <!--轮播图 -->
                        <swiper auto class="swiper" @click.native="seeBannerUrl" height="120px" :list="swipperList" v-model="demo01_index" @on-index-change="demo01_onIndexChange"></swiper>

                        <!--任务list-->
                        <div class="reacResult" id="resultPeoples">
                            <div :class="'eachPeople bgW '+item.borderColor" v-for="item,index of postList" @click.stop="toSeeMissionDetail(index)">
                                <div class="titleBox flexSpace">
                                    <div class="left flexStart">
                                        <img :src="$store.state.imgUrl+item.author.imgurl" @click.stop="seeUserDetail(item.uid)" class="userImg" alt>

                                        <div>
                                            <p class="name">{{item.nickname==null?'':item.nickname}}</p>
                                        </div>
                                    </div>

                                    <div class="right flexEnd">
                                        <span class="priceDesc">费用预算</span>

                                        <p class="price">￥ {{item.fee.split('-')[0]}} - ￥{{item.fee.split('-')[1]}}/小时</p>
                                    </div>
                                </div>

                                <div class="details">
                                    <p class="hang flexSpace">
                                        <span class="eachItem">年级：{{item.classNo}}</span>
                                        <span class="eachItem">科目：{{item.subject}}</span>
                                    </p>
                                    <p class="hang flexStart">
                                        <span class="eachItem">上课：{{item.coordination=='online'?'远程协作':item.coordination=='busniess'?'家长拜访':'家教拜访'}}</span>

                                        <span class="eachItem add">区域：{{item.area}}</span>
                                    </p>

                                    <p class="hang">
                                        <span>简述：{{item.content}}</span>
                                    </p>
                                </div>

                                <div class="otherMsg flexSpace">
                                    <p class="left">
                                        <span>截至报名：{{!item.deadline?"":item.deadline.substr(0,10)}}</span>

                                        <span>已报名：{{item.applicationCount}}</span>
                                    </p>

                                    <p class="right">
                                        <button class="submitBtn" @click.stop="toEnroll(index)" v-if="$store.state.userType=='author'">报名</button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </scroller>

                <!--循环任务列表-->

                <!--任务list end-->

                <!-- <div v-transfer-dom id="myPop">
                    <popup class="aLLIsShow" height :should-rerender-on-show="false"></popup>
                </div> -->

                <!--排序-->

                <!-- <div v-transfer-dom id="myPop">
                    <sortPopup :pxIsShow="pxIsShow" :sortOptions="sortOptions" @getPxIsShow="getPxIsShow" @getMissionOrderType="getMissionOrderType"></sortPopup>
                </div> -->
                <!--排序条件弹窗-->
                <div v-transfer-dom class="bgW" id="sortPopup">
                    <popup  v-model="pxIsShow" style="background-color:#fff;" class="sortBox bgW">
                        <div style="background-color:#fff;height:auto;margin:0 auto;border-radius:5px;">
                            <group>
                                <radio :options="sortOptions" @on-change="choostItem"></radio>
                            </group>
                            <div style="padding:13px 10px;" class="popBtnBox">
                                <x-button @click.native="saveOrder" class="popBtn saveBtn">确认</x-button>
                                <x-button class="popBtn backBtn" @click.native="backSave">恢复默认排序</x-button>
                            </div>

                        </div>
                    </popup>
                </div>
            </div>
             <!--排序条件弹窗----------------end-->

            <div class="component">
                <div id="multiPicker">
                    <!-- 年级 -->
                    <div class="gradeContent" v-if="classShow">
                        <p class="title bgW">{{leftText1}}（选择后保存）</p>

                        <div class="content flexSpace bgW">
                            <p :class="item.active==true?'item active':'item'" v-for="item,index in gradesArr" @click="addActive(index)">{{item.className}}</p>
                        </div>

                        <button class="long_btn" @click="getResult">确认</button>
                    </div>

                    <!-- 科目 -->

                    <div class="categoryContent" v-if="categoryShow">
                        <p class="title bgW">{{leftText2}}（选择后保存）</p>

                        <div class="content flexSpace bgW">
                            <p :class="item.active==true?'item active':'item'" v-for="item,index in subjectArr" @click="addActive2(index)">{{item.categroy}}</p>
                        </div>

                        <button class="long_btn" @click="getResult2">确认</button>
                    </div>

                    <!-- 上课方式 -->

                    <div class="categoryContent" v-if="coordinationShow">
                        <p class="title bgW">{{leftText5}}（选择后保存）</p>

                        <div class="content flexSpace bgW">
                            <p :class="item.active==true?'item active':'item'" v-for="item,index in coordination" @click="addActive3(index)">{{item.name}}</p>
                        </div>

                        <button class="long_btn" @click="getResult3">确认</button>
                    </div>
                </div>
            </div>
            <!-- 固定按钮 -->
            <button class="fixBtn" @click="goToPost" v-if="$store.state.userType!='author'">
                <span>+</span>
                <span>发布</span>
            </button>
            <appFooter :nowPath="nowPath"></appFooter>
        </div>
    </div>
</div>
</template>

<script>
import common from "@/assets/js/common";

import slidePicker from "@/components/slidePicker";

import writers from "@/components/writer/writer";

import radioPicker from "@/components/radioPicker";

import sortPopup from "@/components/sortPopup/sortPopup";

import appFooter from "@/components/footer/appFooter";

import sliderPopupPicker from "@/components/sliderPopupPicker";

import {
    Range,
    Popup,
    XSwitch,
    Swiper,
    SwiperItem,
    Cell,
    XButton,
    Group,
    Picker,
    AlertModule,
    ChinaAddressV4Data,
    XAddress,
    Loading,
    Scroller,
       Radio,
    Value2nameFilter as value2name
} from "vux";

const pulldownDefaultConfig = {
    content: "下拉刷新",

    height: 40,

    autoRefresh: false,

    downContent: "下拉刷新",

    upContent: "释放后刷新",

    loadingContent: "正在刷新...",

    clsPrefix: "xs-plugin-pulldown-"
};

const pullupDefaultConfig = {
    content: "上拉加载更多",

    pullUpHeight: 60,

    height: 40,

    autoRefresh: false,

    downContent: "释放后加载",

    upContent: "上拉加载更多",

    loadingContent: "加载中...",

    clsPrefix: "xs-plugin-pullup-"
};

export default {
    data() {
        return {
            totalWriter: 0,

            scrollerShow: true,

            // follow-关注,userCount-用户数,workHours-家教小时,price-单价最低,work-家教值

            sortOptions: [{
                    value: "按发布时间由近到远（默认）",
                    key: "create_time-desc"
                },
                {
                    value: "预算价格从高到低",
                    key: "fee-desc"
                },
                {
                    value: "预算价格从低到高",
                    key: "fee-asc"
                }

            ],

            addressData: [{
                    name: "上海市",
                    value: "310000"
                },
                {
                    name: "市辖区",
                    value: "310100",
                    parent: "310000"
                },
                {
                    name: "黄浦区",
                    value: "310101",
                    parent: "310100"
                },
                {
                    name: "徐汇区",
                    value: "310104",
                    parent: "310100"
                },
                {
                    name: "长宁区",
                    value: "310105",
                    parent: "310100"
                },
                {
                    name: "静安区",
                    value: "310106",
                    parent: "310100"
                },
                {
                    name: "普陀区",
                    value: "310107",
                    parent: "310100"
                },
                {
                    name: "虹口区",
                    value: "310109",
                    parent: "310100"
                },
                {
                    name: "杨浦区",
                    value: "310110",
                    parent: "310100"
                },
                {
                    name: "闵行区",
                    value: "310112",
                    parent: "310100"
                },
                {
                    name: "宝山区",
                    value: "310113",
                    parent: "310100"
                },
                {
                    name: "嘉定区",
                    value: "310114",
                    parent: "310100"
                },
                {
                    name: "浦东新区",
                    value: "310115",
                    parent: "310100"
                },
                {
                    name: "金山区",
                    value: "310116",
                    parent: "310100"
                },
                {
                    name: "松江区",
                    value: "310117",
                    parent: "310100"
                },
                {
                    name: "青浦区",
                    value: "310118",
                    parent: "310100"
                },
                {
                    name: "奉贤区",
                    value: "310120",
                    parent: "310100"
                },
                {
                    name: "崇明区",
                    value: "310151",
                    parent: "310100"
                }
            ],

            nowPath: "/mission",

            borderColor: "",

            aLLIsShow: false,

            sxIsShow: false,

            typeShow: false,

            rangValue: 0,

            sliderSubjectArr: [],
            sliderClassArr: [],
            sliderBigClassArr: [],

            sliderClassArr: [],

            slidePriceArr: [],

            slidePriceArr2: [],

            // 传入slidePicker的数据

            subjectArr: [],

            gradesArr: [],

            leftText1: "年级",

            leftText2: "科目",

            rightText1: "不限",

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

            publish_Arr: [{
                    value: 0,

                    text: "1对1",

                    selected: true
                },

                {
                    value: 1,

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

            // 传入radio的值 end

            step: 1,

            pxIsShow: false,

            stringValue1: false,

            stringValue2: false,

            stringValue3: false,

            //任务列表

            postList: [],

            // 获取参数

            postData: {},

            priceMin: "",

            priceMax: "",

            publish_title: "组班方式",

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
            swipperList: [],
            demo01_index: 0,
            SSdata: {},

            nowPage: 1,

            isBottom: false,

            onFetching: false,

            classShow: false,

            categoryShow: false,

            coordinationShow: false,

            allWriter: "",

            list: [],

            userData: {},
            order:'',

            missionTypeText: "全部类型",

            pullupDefaultConfig: pullupDefaultConfig,

            pulldownDefaultConfig: pulldownDefaultConfig
        };

        // dataend
    },

    components: {
        Range,
        Swiper,
        SwiperItem,
        Popup,
          Radio,
        XSwitch,

        Cell,

        XButton,

        Group,

        Picker,

        slidePicker,

        radioPicker,

        sortPopup,

        AlertModule,

        appFooter,

        sliderPopupPicker,

        XAddress,

        Scroller,

        Loading
    },

    mounted() {
        var that = this;

        that.myarea = [];

        that.getPriceArr();

        that.getCategory();

        that.getGrade();
        that.getSwipper();
        // 获取当前登陆用户信息

        this.getWebUser(this.$store.state.uid);

        // 获取家教总数

        // that.getTotalWriter();

        // 上拉刷新！---------------------------------

        that.$nextTick(() => {
            that.$refs.scrollerBottom.reset({
                top: 0
            });
        });

        that.postList = [];

        that.postData.currentPage = that.nowPage;

        that.postData.pageSize = 10;

        that.loadMore();

        // 上拉刷新！---------------------------------

        // console.log("所有价格");

        // console.log(that.slidePriceArr2);
    },

    methods: {
        ...common,
        // 保存排序
        saveOrder() {
             this.pxIsShow=!this.pxIsShow;
            // if (this.order == '') {
            //     this.order = this.sortOptions[0].value
            // }
            // this.$emit('getPxIsShow', false)
            // this.$emit('getOrderType', this.order)
            // 任务中的排序监听
            // this.$emit('getMissionOrderType', this.order)
            // this.getOrderType()
            this.getMissionOrderType(this.order)
        },
        // 点击每一个排序
        choostItem(value, label) {
             this.order = value;

        },
        // 恢复默认
        backSave() {
            this.pxIsShow=!this.pxIsShow;
            this.order=''
        },
        // 去发布
        goToPost() {
            this.$router.push({
                path: "/postMission"
            });
        },
        demo01_onIndexChange(index) {
            this.demo01_index = index;
        },
        // 点击轮播图
        seeBannerUrl() {
            var url = this.swipperList[this.demo01_index].bannerContent;
            window.location.href = url;
        },
        // 轮播图
        getSwipper() {
            var that = this;
            var baseUrl = this.$store.state.baseUrl;
            that.$http("get", baseUrl + "api/Banner/List").then(function (res) {
                if (res.data.code == "00") {
                    var result = res.data.data;
                    for (var i in result) {
                        result[i].img = that.$store.state.imgUrl + result[i].bannerSrc;
                    }
                    that.swipperList = result;
                    console.log("轮播图数组");
                    console.log(result);
                }
            });
        },
        // 点击每个任务右下角报名，直接报名

        toEnroll(index) {
            var that = this;

            if (that.postList[index].uid == that.$store.state.uid) {
                AlertModule.show({
                    title: "抱歉您不能报名自己的任务"
                });

                return false;
            }

            //任务类型：1-找家教,2-找家长,3-团家长找家教

            var missionType = that.postList[index].taskType;

            // 当前用户的身份

            var userType = that.userData.type;

            var postData = {
                oid: that.postList[index].id,
                uid: that.$store.state.uid
            };

            that.$http("post", that.$store.state.baseUrl + "api/Order/apply", postData)
                .then(function (res) {
                    if (res.data.code != "00") {
                        AlertModule.show({
                            title: res.data.msg
                        });
                    } else {
                        AlertModule.show({
                            title: "报名成功",

                            onHide: function () {
                                that.nowPage = 1;

                                that.loadMore();
                            }
                        });
                    }
                });

        },

        // 任务类型筛选

        choostTypeItem(index) {
            // this.order = "";

            // this.nowPage = 1;

            // this.realAuth = "";

            // this.eduAuth = "";

            // this.authorAuth = "";

            // this.postData = {

            //     order: "",

            //     currentPage: this.nowPage,

            //     realAuth: this.realAuth,

            //     eduAuth: this.eduAuth,

            //     authorAuth: this.authorAuth,

            //     minWorkAge: "",

            //     maxWorkAge: "",

            //     classNo: "",

            //     category: "",

            //     fee: "",

            //     area: "",

            //     taskType: this.typeOptions[index].value,

            //     pageSize:5

            // };

            // this.getMIssionlist();

            // this.loadMore();

            var that = this;

            that.postData = {};

            that.postList = [];

            that.postData.taskType = that.typeOptions[index].value;

            that.nowPage = 1;

            that.postData.currentPage = that.nowPage;

            that.postData.pageSize = 10;

            that.loadMore();

            this.typeShow = false;

            this.missionTypeText = this.typeOptions[index].title;
        },

        // 点击筛选

        clickSS() {
            var that = this;
            that.sxIsShow = true;
            that.pxIsShow = false;
        },

        // 性别

        getRadioValue(val) {
            this.postData.gender = val;
        },

        // 所有家教总数

        // getTotalWriter() {
        //   // /author/AuthorTotal

        //   var that = this;

        //   var baseUrl = this.$store.state.baseUrl;

        //   that

        //     .$http("get", baseUrl + "api/author/AuthorTotal")

        //     .then(function(res) {
        //       if (res.data.code != "00") {
        //         AlertModule.show({
        //           title: res.data.msg
        //         });
        //       } else {
        //         that.allWriter = res.data.data;

        //         // alert(res.data.data)
        //       }
        //     });
        // },

        // 分页======================================

        // ==========================================

        // 排序

        getMissionOrderType(val) {
            var that = this;

            console.log(val);

            that.postList = [];

            that.postData.order = val ? val.split('-')[0] : '';
            that.postData.orderType = val ? val.split('-')[1] : '';
            that.nowPage = 1;

            that.postData.currentPage = that.nowPage;

            that.postData.pageSize = 10;

            that.loadMore();

            that.sortOptions = [{
                    value: "按发布时间由近到远（默认）",
                    key: "create_time-desc"
                },
                {
                    value: "预算价格从高到低",
                    key: "fee-desc"
                },
                {
                    value: "预算价格从低到高",
                    key: "fee-asc"
                }
            ];
        },

        getResult() {
            // 年级

            var arr = [];

            for (let i in this.gradesArr) {
                if (this.gradesArr[i].active == true) {
                    arr.push(this.gradesArr[i].className);

                    this.classNo.push(this.gradesArr[i].id);
                }
            }

            this.classShow = false;

            this.rightText1 = arr.join(",");
        },

        getResult2() {
            // 科目

            var arr = [];

            for (let i in this.subjectArr) {
                if (this.subjectArr[i].active == true) {
                    arr.push(this.subjectArr[i].categroy);

                    this.subject.push(this.subjectArr[i].id);
                }
            }


            this.categoryShow = false;

            this.rightText2 = arr.join(",");
        },

        // 每个item的点击书简

        addActive(index) {
            this.gradesArr[index].active = !this.gradesArr[index].active;
        },

        addActive2(index) {
            this.subjectArr[index].active = !this.subjectArr[index].active;
        },

        addActive3(index) {
            this.coordination[index].active = !this.coordination[index].active;
        },

        gotoMultiPicker(val) {
            if (val == "class") {
                //   console.log(1)

                this.classShow = true;

                (this.categoryShow = false)
                (this.coordinationShow = false)
              
            } else {
                (this.classShow = false)
                (this.coordinationShow = false)
                (this.categoryShow = true)
            }
        },
        toSort(){
            this.pxIsShow=true;
        },

        // 查看任务详情

        toSeeMissionDetail(i) {
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

            // alert(that.postList[i].status)

            // 如果是执行中的任务

            if (that.postList[i].status == "3" && isAuthor) {
                // 我执行的任务，所以我是家教

                // 家教版正在执行的任务

                this.$router.push({
                    path: "/missionInExecutionAuth",

                    query: {
                        id: id
                    }
                });
            } else {
                that.$router.push({
                    path: "/missionDetail",

                    query: {
                        id: id,

                        isMyTask: isMyTask
                    }
                });
            }
        },

        addressChange() {},

        // 提交筛选条件

        showSSdata() {
            var that = this;

            that.postData.realAuth = that.stringValue1 ? "2" : "";

            that.postData.eduAuth = that.stringValue2 ? "2" : "";

            that.postData.authorAuth = that.stringValue3 ? "2" : "";

            that.postData.minWorkAge = that.minWorkAge;

            that.postData.maxWorkAge = that.maxWorkAge;

            that.postData.pageSize = 10;

            that.postData.directional = false;

            that.postData.loginUid = that.$store.state.uid;

            // console.log(that.postData);

            if (that.postData.minWorkAge < 0 || that.postData.maxWorkAge > 80) {
                AlertModule.show({
                    title: "家教年限不在范围中"
                });
            } else {
                that

                    .$http(
                        "get",

                        that.$store.state.baseUrl + "api/Order/Page",

                        that.postData
                    )

                    .then(function (res) {
                        if (res.data.code == "00") {
                            // that.totalWriter=res.pi.totalSize;

                            var result = res.data.data;

                            for (var i in result) {
                                var arr = result[i].fee.split("-");

                                result[i].priceMin = arr[0];

                                result[i].priceMax = arr[1];

                                result[i].nickname = result[i].author.nickname;

                                // console.log(result[i].author.nickname);

                                if (result[i].taskType == 1) {
                                    result[i].borderColor = "zz";
                                } else if (result[i].taskType == 2) {
                                    result[i].borderColor = "ss";
                                } else {
                                    result[i].borderColor = "sz";
                                }
                            }

                            that.postList = result;
                        }

                        // console.log("任务列表");

                        // console.log(that.postList);
                    });

                that.sxIsShow = false;

                that.scrollerShow = true;
            }
        },

        // 取消筛选

        cancelSS() {
            // console.log('11')

            this.sxIsShow = false;

            this.scrollerShow = true;

            this.mainShow = true;
        },

        // ========================================

        refresh() {
            var that = this;

            that.getMIssionlist(data => {
                // that.postList = data;

                if (that.postData.currentPage == 1) {
                    //禁止上啦，已经没有数据

                    that.$refs.scrollerBottom.disablePulldown();
                }

                that.postList = data;

                that.$refs.scrollerBottom.donePulldown();
            });

            if (that.postData.currentPage > 0) {
                that.postData.currentPage--;
            }

            that.postData.pageSize = 10;
        },

        loadMore() {
            var that = this;

            console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@加载");

            // console.log(params)

            // params.currentPage=that.nowPage;

            // params.pageSize=5;

            that.getMIssionlist(data => {
                // that.postList = data;

                if (data.length <= 4) {
                    //禁止上啦，已经没有数据

                    that.$refs.scrollerBottom.disablePullup();
                }

                that.postList = that.postList.concat(data);

                //  console.log("长度"+that.postList.length)

                //  console.log(that.postList)

                that.$refs.scrollerBottom.donePullup();
            });

            that.postData.currentPage = that.nowPage;

            that.nowPage++;

            // that.postData.pageSize = 10;
        },

        // ======================================

        // 获取任务列表

        getMIssionlist(fn) {
            var that = this;
            that.postData.status = '1'
            that

                .$http(
                    "get",

                    that.$store.state.baseUrl + "api/Order/Page",

                    that.postData
                )

                .then(function (res) {
                    if (res.data.code == "00") {
                        //  alert(res.data.pi.totalSize)

                        that.totalWriter = res.data.pi.totalSize;

                        var result = res.data.data;

                        for (var i in result) {
                            var arr = result[i].fee.split("-");

                            result[i].priceMin = arr[0];

                            result[i].priceMax = arr[1];

                            result[i].nickname = result[i].author.nickname;

                            // console.log(result[i].author.nickname);

                            if (result[i].taskType == 1) {
                                result[i].borderColor = "zz";
                            } else if (result[i].taskType == 2) {
                                result[i].borderColor = "ss";
                            } else {
                                result[i].borderColor = "sz";
                            }
                        }

                        fn(result);
                    }
                });
        },

        changeResultGrade(val) {
            this.postData.classNo = val.name;
        },

        // 区域

        onAddressChange(val) {
            var arr = [];

            this.postData.area = value2name(this.myarea, ChinaAddressV4Data)
                .split(" ")

                .join(",");
        },

        changeResultKM(val) {
            // 科目

            this.postData.subject = val.name;
        },

        changeResult(val) {}
    }
};
</script>

<style scoped>
#mission {
    background: #f5f5f5;

    /* padding-bottom: 60px; */

    padding-bottom: 0;

    height: 100%;
}

#mission .main {
    padding-top: 40px;
}

.topBox {
    height: 40px;

    line-height: 40px;

    border-bottom: 1px solid #cecece;

    background: #fff;
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 9999;
}

.line {
    width: 1px;

    height: 28px;

    background: #cecece;

    display: inline-block;
}

.priceDesc {
    color: #707070;
    font-size: 12px;
}

.topBox .eachBtn {
    display: flex;
    padding-left: 6px;
    padding-right: 6px;
    flex-direction: row;
    height: 40px;
    text-align: center;
    width: 100%;
    justify-content: center;
}

.topBox .eachBtn i {
    /* padding-left: 6px; */

    color: #3375c5;
}

.topBox .eachBtn.shortOne {
    /* padding-left: 28px;

      padding-right: 22px; */
}

.topBox .eachBtn.lastItem {
    background: #3375c5;

    color: #fff;

    font-weight: bold;

    height: 40px;

    min-width: 75px;

    /* text-align: right; */

    justify-content: center;
}

.topBox .eachBtn.lastItem i {
    color: #fff;
}

#resultPeoples {
    background: #f5f5f5;
}

.eachPeople {
    padding: 11px;

    /*padding-bottom: 0;*/

    /*margin-top: 10px;*/

    margin-bottom: 10px;
}

/* .eachPeople.ss {
  border-bottom: 4px solid #2ea200;
}

.eachPeople.zz {
  border-bottom: 4px solid #3375c5;
}

.eachPeople.sz {
  border-bottom: 4px solid #feab29;
} */

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
}

.eachPeople .otherMsg {
    padding: 18px 0 16px 0;

    color: #999999;

    font-size: 12px;
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

#resultPeoples.reacResult .details {
    display: block;
    color: #707070;
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

    /* z-index: 9999999999999999999999; */
}

.popBtnBox .weui-btn {
    width: 100% !important;

    margin-bottom: 13px;
}

#mission .priceBox {
    padding: 10px 16px;

    /*background: #f5f5f5;*/

    border-bottom: 1px solid #d9d9d9;
}

#mission .priceBox span.title {
    font-size: 14px;

    color: #242424;
}

#mission .vux-x-textarea.weui-cell {
    padding: 0 15px;

    font-size: 14px;

    color: #242424;
}

#mission .priceBox input {
    width: 80px;

    height: 30px;

    border: 1px solid #eee;

    border-radius: 5px;

    background: #fff;

    padding: 5px;
}

#mission .vux-cell-box.areaBox {
    padding: 0px;

    border-bottom: 1px solid #d9d9d9;
}

/* 000000000000000000000000000000000000000000 */

#mission .title {
    padding: 11px;

    border-bottom: 1px solid #cecece;

    font-size: 12px;

    color: #3375c5;
}

#mission .content {
    padding: 27px 11px 60px 11px;

    flex-wrap: wrap;
}

#mission .content .item.active {
    border: 1px solid #3375c5;

    color: #fff;

    background: #3375c5;

    /*margin-right: 15px;*/

    font-size: 14px;
}

#mission .content .item {
    width: 95px;

    height: 35px;

    line-height: 35px;

    text-align: center;

    border: 1px solid #848484;

    color: #868686;

    /*margin-right: 15px;*/

    background: #fff;

    margin-bottom: 10px;
}
#sortPopup .sortBox {
    padding: 15px 0;
}

#sortPopup .weui-cells:before {
    height: 0 !important;
    border: none;
}

#sortPopup  .sortCell.active {
    color: #3375C5;
    font-weight: bolder;
}

#sortPopup .sortBox {
    z-index: 9999999999999999999;
}

#sortPopup  .backBtn {
    margin-left: 10px;
    border:1px solid  #3375c5;
}
.long_btn.seeResultBtn {
    margin-top: 10px;
    margin-bottom: 10px;
    width: 90%;
}

#mission.workAgeBox .vux-label {
    color: #242424;

    font-size: 14px;
}

#mission .workAgeBox {
    padding: 15px;

    flex-direction: row;
}

#mission .workAgeBox input {
    /* max-width: 100px;

       */

    width: 45%;

    height: 30px;

    border: 1px solid #ccc;

    border-radius: 5px;

    padding: 0 5px;

    text-align: center;
}

#mission .cancelResultBtn {
    background: #fff !important;

    border: 1px solid #999999;

    color: #707070 !important;

    margin-right: 10px;

    /* margin-top: 0; */
}

.weui-btn:after {
    border: none;
}

/* .shaixuanBox .bigtitle {
    background: #fff;

    text-align: center;

    padding: 20px 0;
} */

.reacResult p.name {
    word-break: keep-all;

    max-width: 140px;

    text-overflow: ellipsis;

    overflow: hidden;
}

.vux-slider {
    margin-bottom: 10px;
}
</style>
