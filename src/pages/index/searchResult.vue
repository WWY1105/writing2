<template>
    <div id="searchResult">
    
        <div class="main" v-if="mainShow">
    
            <!--顶部过滤-->
    
            <div class="topBox wbg">
    
                <p class="item item1" v-model="pxIsShow" @click="pxIsShow=!pxIsShow">
    
                    <span slot="text">排序</span>
    
                    <i slot="icon" class="iconfont icon-paixu"></i>
    
                </p>
    
                <p class="item" v-model="sxIsShow" @click="sxIsShow=!sxIsShow;pxIsShow=false">
    
                    <span slot="text">筛选</span>
    
                    <i slot="icon" class="iconfont icon-shaixuan"></i>
    
                </p>
    
            </div>
            <!--排序-->
    
            <div v-transfer-dom id="myPop">
    
                <sortPopup :pxIsShow="pxIsShow" :sortOptions="sortOptions" @getPxIsShow="getPxIsShow" @getMissionOrderType="getMissionOrderType"></sortPopup>
    
            </div>
    
            <!--顶部过滤-->
    
            <div id="myPop">
    
                <popup class="sxPop" v-model="sxIsShow" :should-rerender-on-show="false">
    
                    <group>
    
                        <x-switch title="需要身份认证" v-model="stringValue1"></x-switch>
    
                    </group>
    
                    <group>
    
                        <x-switch title="需要学历认证" v-model="stringValue2"></x-switch>
    
                    </group>
    
                    <group>
    
                        <x-switch title="需要家教资质" v-model="stringValue3"></x-switch>
    
                    </group>
    
                    <!--单选组件-->
    
                    <radioPicker :radiosArr="radios_sex_Arr" :title="radioTitle" @getRadioValue="getRadioValue"></radioPicker>
    
                    <!--rang-->
    
                    <group>
    
                        <p class="smalltitle">
    
                            家教年限范围
    
                            <span>0年 ----- 80年</span>
    
                        </p>
    
                        <div class="workAgeBox flexCenter">
    
    
    
                            <input type="number" v-model="minWorkAge">-
    
                            <input v-model="maxWorkAge" type="number">
    
                        </div>
    
                    </group>
    
                    <!--rang-->
    
                    <div style="padding:0px 10px;" class="popBtnBox">
    
                        <x-button @click.native="showSSResult" class="seeResultBtn">显示筛选结果</x-button>
    
                    </div>
    
                    <!--</div>-->
    
                </popup>
    
            </div>
    
            <!--顶部过滤 end-->
    
            <!--结果小结-->
    
            <scroller use-pullup :pullup-config="pullupDefaultConfig" @on-pullup-loading="loadMore" use-pulldown :pulldown-config="pulldownDefaultConfig" @on-pulldown-loading="refresh" lock-x ref="scrollerBottom" height="-48">
    
                <div>
    
                    <div class="brifResult wbg">
    
                        <p class="title">
    
                            符合条件的家教：
    
                            <span class="bigLightHeight">{{allPeople}}</span>名
    
                        </p>
    
                        <div class="smallResult">
    
                            <div class="flexBox">
    
                                <p class="item">
    
                                    年级:
    
                                    <span class="smallLightLight">{{!postData.classNo?'全年级':postData.classNo}}</span>
    
                                </p>
    
                                <p class="item">科目:
    
                                    <span class="smallLightLight">{{!postData.subject?'全科':postData.subject}}</span>
    
                                </p>
    
                                <p class="item">
    
                                    组班方式:
    
                                    <span class="smallLightLight">{{!postData.priceType?'不限':postData.priceType=='1'?'1对1':'1对多'}}</span>
    
                                </p>
    
                                <p class="item">
    
                                    收费:
    
                                    <span class="smallLightLight">￥{{!postData.fee?'不限':postData.fee}}</span>
    
                                </p>
    
                                <!-- </div> -->
    
                                <!-- <div class="flexBox"> -->
    
                                <p class="item">
    
                                    <span>上课方式：</span>
    
                                    <span class="smallLightLight">{{!postData.coordination?'不限':postData.coordination}}</span>
    
                                </p>
    
                                <p class="item">
    
                                    上课区域：
    
                                    <span class="smallLightLight">{{!postData.area?'不限':postData.area}}</span>
    
                                </p>
    
                            </div>
    
                        </div>
    
                    </div>
    
                    <!--结果小结  end-->
    
                    <!--示例数据-->
    
                    <!--示例数据  end-->
    
                    <!--搜索结果列表-->
    
    
                    <!-- 循环 -->
    
                    <div v-for="item,index in writerList">
    
                        <!-- :soleCost="item.authorInfo.soleCost" -->
    
                        <router-link :to="{path:'/writerDetail',query:{'writerId':item.id}}" v-if="item.flag=='writer'">
    
                            <writers :serviceHours="item.serviceHours" :serviceOrderCount="item.serviceOrderCount" :serviceUserCount="item.serviceUserCount"   :imgurl="item.imgurl" :authorAuth="item.authorAuth"  :type="item.type" :uid="item.id" :priceType="searchPriceType" :sole="item.authorInfo?item.authorInfo.soleCost:''" :joint="item.authorInfo?item.authorInfo.jointCost:''" :isMissionDetail="isMissionDetail" :isCanChoose="isCanChoose" :userTags="item.authorInfo?item.authorInfo.userTags:''"
    
                                :realAuth="item.realAuth" :eduAuth="item.eduAuth" :tag="item.tag" :userCount="item.userCount" :workAge="item.authorAuthInfo!=null?item.authorAuthInfo.workAge:''"  :shortName="item.nickname"></writers>
    
                        </router-link>
    
                        <div v-if="item.flag=='ad'">
    
                            <a :href="item.url" class="adImgA"><img :src="item.imgurl" alt="" class="adImg"></a>
    
                        </div>
    
                    </div>
    
                </div>
    
            </scroller>
    
        </div>
    
        <!-- </div> -->
    
        <!-- 000000000000000000000000000000000000000000 -->
    
        <div class="component">
    
            <div id="multiPicker">
    
                <!-- 年级 -->
    
                <div class="gradeContent" v-if="classShow">
    
                    <p class="title bgW">{{leftText1}}（选择后保存）</p>
    
                    <div class="content flexSpace bgW">
    
                        <p :class="item.active==true?'item active':'item'" v-for="item,index in sliderBigClassArr[0]" @click="addActive(index)">{{item.name}}</p>
    
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
    
            </div>
    
        </div>
    
        <appFooter :nowPath="nowPath"></appFooter>
    
    </div>
</template>

<script>
    import appFooter from "@/components/footer/appFooter";
    
    import common from "@/assets/js/common";
    
    import slidePicker from "@/components/slidePicker";
    
    import writers from "@/components/writer/writer";
    
    import radioPicker from "@/components/radioPicker";
    
    import sliderPopupPicker from "@/components/sliderPopupPicker";
    
    import sortPopup from "@/components/sortPopup/sortPopup";
    
    import {
    
        Range,
    
        Popup,
    
        XSwitch,
    
        Cell,
    
        XButton,
    
        Radio,
    
        Checker,
    
        CheckerItem,
    
        Flexbox,
    
        FlexboxItem,
    
        CheckIcon,
    
        Group,
    
        GroupTitle,
    
        TransferDom,
    
        Picker,
    
        PopupPicker,
    
        Scroller
    
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
    
        // name: "searchResule",
    
        components: {
    
            appFooter,
    
            sortPopup,
    
            Range,
    
            writers,
    
            Popup,
    
            XSwitch,
    
            Cell,
    
            XButton,
    
            Radio,
    
            Checker,
    
            CheckerItem,
    
            Flexbox,
    
            FlexboxItem,
    
            CheckIcon,
    
            GroupTitle,
    
            Group,
    
            Picker,
    
            sliderPopupPicker,
    
            radioPicker,
    
            PopupPicker,
    
            Scroller
    
        },
    
        mounted() {
    
            this.rangValue = 0;
    
            // 获取广告
    
            this.getAd()
    
            //  this.$refs.scroller.finishInfinite(true)
    
            this.getCategory();
    
            this.getGrade();
    
            this.postData = JSON.parse(this.$route.query.postData);
    
            // this.postData.currentPage=this.page;
    
            this.postData.pageSize = 10;
    
            console.log("搜索参数");
    
            console.log(this.postData);
    
            if (this.postData.priceType) {
    
                this.searchPriceType = this.postData.priceType;
    
            }
    
    
    
            // 胡获取家教列表
    
            // this.searchResultList(this.page);
    
            // 年纪
    
            this.getBigGrade();
    
    
    
            // 上拉刷新！---------------------------------
    
            this.$nextTick(() => {
    
                this.$refs.scrollerBottom.reset({
    
                    top: 0
    
                });
    
            });
    
            this.loadMore();
    
            // 上拉刷新！---------------------------------
    
        },
    
    
    
        data() {
    
            return {
    
                sortOptions: [{
                        value: "优先显示我已经加了关注的用户",
                        key: 'follow'
                    },
                    {
                        value: "优先显示相关家长数最多的用户",
                        key: 'userCount'
                    },
                    {
                        value: "优先显示家教小时数最多的用户",
                        key: 'workHours'
                    },
                    {
                        value: "优先显示每人小时费最少的用户",
                        key: 'price'
                    },
                    {
                        value: "优先显示累计家教值最多的用户",
                        key: 'work'
                    }
    
                ],
    
                searchPriceType: '',
    
                nowPath: '/index',
    
                classShow: false,
    
                mainShow: true,
    
                categoryShow: false,
    
                sliderClassArr: [],
    
                sliderSubjectArr: [],
    
                // 传入slidePicker的数据
    
                gradesArr: [],
    
                leftText1: "年级",
    
                leftText2: "科目",
    
    
    
                rightText1: "",
    
                subjectArr: [],
    
                leftText2: "科目",
    
                rightText2: "",
    
                isMissionDetail: true,
    
                isCanChoose: false,
    
                // 传入radio的值
    
                minWorkAge: "",
    
                maxWorkAge: "",
    
                radioTitle: "选择性别",
    
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
    
                chooseSex: "0",
    
                // 传入radio的值 end
    
                min: 0,
    
                max: 80,
    
                step: 1,
    
                pxIsShow: false,
    
                sxIsShow: false,
    
                stringValue1: false,
    
                stringValue2: false,
    
                stringValue3: false,
    
                rangValue: 0,
    
                // searchGrade:'',
    
                order: "",
    
                postData: {},
    
                writerList: [],
    
                sliderBigClassArr: [],
    
                noDataText: "没有数据了",
    
                page: 1,
    
                allPeople: 0,
    
                allWriter: "",
    
                isBottom: false,
    
                categoryName: "",
    
                list: [],
    
                adList: [], //广告列表
    
                pullupDefaultConfig: pullupDefaultConfig,
    
                pulldownDefaultConfig: pulldownDefaultConfig
    
            };
    
        },
    
        watch: {
    
            // order: {
    
            //     handler(newName, oldName) {
    
            //         // alert(newName)
    
            //         this.postData.order=newName
    
            //         this.page=1;
    
            //          this.searchResultList(this.page, newName);
    
            //         // this.loadMore()
    
            //     },
    
            //     deep: true,
    
            //     immediate: true
    
            // }
    
        },
    
        methods: {
    
            ...common,
    
            // 获取广告
    
            getAd() {
    
                var that = this;
    
                that
    
                    .$http(
    
                        "get",
    
                        that.$store.state.baseUrl + "api/Ad/List"
    
                    )
    
                    .then(function(res) {
    
                        if (res.data.code != "00") {
    
                            AlertModule.show({
    
                                title: res.data.msg
    
                            });
    
                        } else {
    
                            that.adList = res.data.data;
    
                            for (var i in that.adList) {
    
                                that.adList[i].imgurl = that.$store.state.imgUrl + that.adList[i].imgurl
    
                                that.adList[i].flag = 'ad'
    
                            }
    
    
    
                            console.log('广告')
    
                            console.log(res.data.data);
    
    
    
                        }
    
                    });
    
            },
    
            // 显示筛选结果
    
            showSSResult() {
    
                // 页码，排序，年级，科目，身份，学历，性别，年限
    
                console.log("筛选条件");
    
    
    
                var that = this;
    
                that.page = '1';
    
                //  classNo: that.rightText1,
    
                // subject: that.rightText2,
    
                that.postData = {
    
                    realAuth: that.stringValue1 ? '2' : '',
    
                    eduAuth: that.stringValue2 ? '2' : '',
    
                    authorAuth: that.stringValue3 ? '2' : '',
    
                    gender: that.chooseSex,
    
                    minWorkAge: that.minWorkAge,
    
                    maxWorkAge: that.maxWorkAge,
    
                    currentPage: that.page,
    
                    loginUid: that.$store.state.uid
    
                };
    
                // console.log(that.postData)
    
                for (var i in that.postData) {
    
                    // console.log(that.postData[i])
    
                    if (!that.postData[i]) {
    
                        delete that.postData[i]
    
                    }
    
                }
    
                that.sxIsShow = false;
    
                that
    
                    .$http(
    
                        "get",
    
                        that.$store.state.baseUrl + "api/WebUser/Query/Author",
    
                        that.postData
    
                    )
    
                    .then(function(res) {
    
                        if (res.data.code != "00") {
    
                            AlertModule.show({
    
                                title: res.data.msg
    
                            });
    
                        } else {
    
                            //  that.postData.classNo=that.rightText1;
    
                            that.writerList = [];
    
                            that.loadMore();
    
    
    
                        }
    
                    });
    
            },
    
    
    
            // 所有家教总数
    
            getTotalWriter() {
    
                // /WebUser/AuthorTotal
    
                var that = this;
    
                var baseUrl = this.$store.state.baseUrl;
    
                that
    
                    .$http("get", baseUrl + "api/WebUser/AuthorTotal")
    
                    .then(function(res) {
    
                        if (res.data.code != "00") {
    
                            AlertModule.show({
    
                                title: res.data.msg
    
                            });
    
                        } else {
    
                            that.allWriter = res.data.data;
    
                            // alert(res.data.data)
    
                        }
    
                    });
    
            },
    
            // 排序
    
            getMissionOrderType(val) {
    
                var that = this;
    
                that.writerList = [];
    
                console.log("排序" + val)
    
                if (val == '') {
    
                    delete that.postData.order
    
                } else {
    
                    that.postData.order = val;
    
                }
    
                that.page = 1;
    
                that.postData.currentPage = that.page;
    
                that.postData.pageSize = 10;
    
    
    
                that.loadMore()
    
                that.sortOptions = [{
    
                        value: "优先显示我已经加了关注的用户",
    
                        key: 'follow'
    
                    },
    
                    {
    
                        value: "优先显示相关家长数最多的用户",
    
                        key: 'userCount'
    
                    },
    
                    {
    
                        value: "优先显示家教小时数最多的用户",
    
                        key: 'workHours'
    
                    },
    
                    {
    
                        value: "优先显示每人小时费最少的用户",
    
                        key: 'price'
    
                    },
    
                    {
    
                        value: "优先显示累计家教值最多的用户",
    
                        key: 'work'
    
                    }
    
    
    
                ]
    
    
    
            },
    
            // ========================================
    
            refresh() {
    
                var that = this;
    
                that.searchResultList(data => {
    
                    // that.postList = data;
    
    
    
                    if (that.postData.currentPage == 1) {
    
                        //禁止上啦，已经没有数据
    
                        that.$refs.scrollerBottom.donePulldown();
    
                    }
    
                    that.writerList = data;
    
                    that.$refs.scrollerBottom.donePulldown();
    
                });
    
                if (that.postData.currentPage > 0) {
    
                    that.postData.currentPage--;
    
                }
    
    
    
                that.postData.pageSize = 10;
    
            },
    
            loadMore() {
    
                var that = this;
    
                console.log('执行了loadmore')
    
    
    
                that.searchResultList(data => {
    
                    if (data.length <= 4) {
    
                        that.$refs.scrollerBottom.disablePullup();
    
                    }
    
                    that.writerList = that.writerList.concat(data);
    
                    var index;
    
                    for (var i in that.adList) {
    
                        index = that.adList[i].adIndex;
    
                        that.writerList.splice(index, 1, that.adList[i])
    
                    }
    
                    console.log('000000000000000000000000000000000000000000')
    
                    console.log(that.writerList)
    
                    that.$refs.scrollerBottom.donePullup();
    
    
    
                });
    
                that.postData.currentPage = that.page;
    
                that.page++;
    
    
    
            },
    
            // ======================================
    
            // 家教列表
    
            // 页码，排序，年级，科目，身份，学历，资质，性别，年限/orderBy
    
            searchResultList(fn) {
    
                var that = this;
    
                that.postData.loginUid = that.$store.state.uid
    
                that.getNameById(that.postData.classNo, that.sliderBigClassArr);
    
                that
    
                    .$http(
                        "get",
                        that.$store.state.baseUrl + "api/WebUser/Query/Author",
                        that.postData
                    )
    
                    .then(function(res) {
                        if (res.data.code != "00") {
                            AlertModule.show({
                                title: res.data.msg
    
                            });
    
                        } else {
    
                            var result = res.data.data;
    
                            for (var i in result) {
    
                                result[i].flag = 'writer'
    
                            }
    
                            that.allPeople = res.data.pi.totalSize;
    
    
    
                            if (result.length != 0) {
    
                                // alert(result.length)
    
                                fn(result);
    
                            }
    
    
    
                        }
    
                    });
    
    
    
            },
    
            getResult() {
    
                // 年级
    
                var arr = "";
    
                for (let i in this.sliderBigClassArr[0]) {
    
                    if (this.sliderBigClassArr[0][i].active == true) {
    
                        arr = this.sliderBigClassArr[0][i].name;
    
                        // this.classNo = this.sliderBigClassArr[i].id;
    
                    }
    
                }
    
                // alert(arr)
    
                this.mainShow = true;
    
                this.classShow = false;
    
                this.rightText1 = arr;
    
            },
    
            getResult2() {
    
                // 科目
    
                var arr = "";
    
                for (let i in this.subjectArr) {
    
                    if (this.subjectArr[i].active == true) {
    
                        arr = this.subjectArr[i].categroy;
    
                        this.subject = this.subjectArr[i].id;
    
                    }
    
                }
    
                this.mainShow = true;
    
                this.categoryShow = false;
    
                this.rightText2 = arr;
    
            },
    
            gotoMultiPicker(val) {
    
                if (val == "class") {
    
                    //   console.log(1)
    
                    this.classShow = true;
    
                    (this.categoryShow = false),
    
                    (this.coordinationShow = false),
    
                    (this.mainShow = false);
    
                } else {
    
                    (this.classShow = false),
    
                    (this.coordinationShow = false),
    
                    (this.categoryShow = true);
    
                    this.mainShow = false;
    
                }
    
            },
    
            // 每个item的点击书简
    
            addActive(index) {
    
                for (var i in this.sliderBigClassArr[0]) {
    
                    this.sliderBigClassArr[0][i].active = false;
    
                }
    
                this.sliderBigClassArr[0][index].active = true;
    
            },
    
            addActive2(index) {
    
                // this.subjectArr[index].active = !this.subjectArr[index].active;
    
                for (var i in this.subjectArr) {
    
                    this.subjectArr[i].active = false;
    
                }
    
                this.subjectArr[index].active = true;
    
            },
    
            changeResult(val) {},
    
            changeResultGrade(val) {
    
                // 年级
    
                this.postData.classNo = val;
    
            },
    
            changeResultKM(val) {
    
                // 科目
    
                this.postData.subject = val;
    
                this.categoryName = val.name;
    
            }
    
        },
    
    
    
        directives: {
    
            TransferDom
    
        }
    
    };
</script>

<style scoped>
    /*----------*/
    
    
    
    .popBtnBox,
    
    .vux-popup-dialog {
    
        background: #fff;
    
        z-index: 9999999999999999999999;
    
    }
    
    
    
    .popBtnBox .weui-btn {
    
        width: 100% !important;
    
        margin-bottom: 13px;
    
    }
    
    
    
    .weui-cell {
    
        /*padding:10px 16px;   */
    
        height: 44px;
    
    }
    
    
    
    .smalltitle span {
    
        margin-left: 35px;
    
    }
    
    
    
    .smalltitle {
    
        color: #242424;
    
        font-size: 14px;
    
        padding: 10px 16px;
    
    }
    
    
    
    .vux-checker-item i {
    
        margin-right: 5px;
    
    }
    
    
    
    .reacResult {
    
        margin-top: 10px;
    
    }
    
    
    
    .reacResult>.flexBox {
    
        display: flex;
    
        justify-content: flex-start;
    
    }
    
    
    
    .reacResult .details .each {
    
        display: flex;
    
        flex-direction: column;
    
        align-items: center;
    
        display: inline;
    
    }
    
    
    
    .reacResult .details .each .text {
    
        color: #242424;
    
        font-size: 12px;
    
        margin-bottom: 8px;
    
    }
    
    
    
    .reacResult .details .each .smallBox {
    
        border: 1px solid #b1b1b1;
    
        padding: 3px 0px;
    
        color: #707070;
    
        font-size: 12px;
    
        width: 65px;
    
    }
    
    
    
    .mainColor {
    
        fill: #3375c5;
    
    }
    
    
    
    #exampleTitle.titleBox {
    
        color: #3375c5;
    
    }
    
    
    
    .reacResult>.flexBox .left {
    
        width: 15%;
    
    }
    
    
    
    .reacResult>.flexBox .right {
    
        width: 85%;
    
    }
    
    
    
    #searchResult {
    
        background: #f5f5f5;
    
    }
    
    
    
    .reacResult {
    
        margin-top: 10px;
    
        padding: 10px;
    
    }
    
    
    
    .adImgA {
    
        margin-top: 10px;
    
        display: block;
    
        width: 100%;
    
        height: 145px;
    
    }
    
    
    
    .adImg {
    
        height: 100%;
    
        width: 100%;
    
    }
    
    
    
    .brifResult {
    
        padding: 11px;
    
    }
    
    
    
    .brifResult .flexBox .item {
    
        min-width: 25%;
    
        margin-right: 20px;
    
        color: #242424;
    
        font-size: 12px;
    
    }
    
    
    
    .brifResult .flexBox .smallLightLight {
    
        color: #3375c5;
    
    }
    
    
    
    .brifResult .flexBox {
    
        display: flex;
    
        justify-content: flex-start;
    
        align-items: center;
    
        line-height: 16px;
    
        flex-direction: row;
    
        flex-wrap: wrap;
    
    }
    
    
    
    .brifResult .title {
    
        color: #242424;
    
        font-size: 15px;
    
        margin-bottom: 12px;
    
    }
    
    
    
    .brifResult .title .bigLightHeight {
    
        color: #3375c5;
    
    }
    
    
    
    .topBox {
    
        display: flex;
    
        justify-content: center;
    
        align-items: center;
    
        height: 40px;
    
        border-bottom: 1px solid #cecece;
    
        color: #636363;
    
        font-size: 15px;
    
    }
    
    
    
    .topBox .item {
    
        width: 50%;
    
        display: flex;
    
        align-items: center;
    
        justify-content: center;
    
        color: #636363;
    
        font-size: 15px;
    
    }
    
    
    
    .topBox .item1 {
    
        border-right: 1px solid #cecece;
    
    }
    
    
    
    .topBox .item .iconfont {
    
        color: #3375c5;
    
        margin-left: 5px;
    
    }
    
    
    
    .space {
    
        height: 10px;
    
        width: 100%;
    
        background: #f5f5f5;
    
    }
    
    
    
    
    
    /* 000000000000000000000000000000000000000000 */
    
    
    
    #multiPicker .title {
    
        padding: 11px;
    
        border-bottom: 1px solid #cecece;
    
        font-size: 12px;
    
        color: #3375c5;
    
    }
    
    
    
    #multiPicker .content {
    
        padding: 27px 11px 60px 11px;
    
        flex-wrap: wrap;
    
    }
    
    
    
    #multiPicker .content .item.active {
    
        border: 1px solid #3375c5;
    
        color: #fff;
    
        background: #3375c5;
    
        /*margin-right: 15px;*/
    
        font-size: 14px;
    
    }
    
    
    
    #multiPicker .content .item {
    
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
    
    
    
    #multiPicker .long_btn {
    
        margin-top: 60px;
    
    }
    
    
    
    #searchResult.workAgeBox .vux-label {
    
        color: #242424;
    
        font-size: 14px;
    
    }
    
    
    
    #searchResult .workAgeBox {
    
        padding: 15px;
    
        flex-direction: row;
    
    }
    
    
    
    #searchResult .workAgeBox input {
    
        /* max-width: 100px; */
    
        width: 45%;
    
        height: 30px;
    
        border: 1px solid #ccc;
    
        border-radius: 5px;
    
        padding: 0 5px;
    
        text-align: center;
    
    }
    
    
    
    .reacResult .details {
    
        display: flex;
    
    }
    
    
    
    #searchResult .reacResult .details {
    
        flex-direction: row;
    
    }
</style>
