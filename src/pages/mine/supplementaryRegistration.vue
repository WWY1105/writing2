<template>
<div id="supplementaryRegistration">
    <div class="myFallow" v-if="myFallowShow">
        <!-- 家教列表 -->
        <div class="reacResult wbg" v-for="item,index in writerList" @click="chooseMyFelloUser(index)" v-if="item.followingUser">
            <div class="flexBox">
                <div class="left flexSpace">
                    <img :src="item.followingUser?$store.state.imgUrl+item.followingUser.imgurl:''" class="userImg" alt>
                </div>
                    <div class="right">
                        <p class="titleBox">
                            <span class="title">{{item.followingUser?item.followingUser.nickname:""}}</span>
                            <span class="radios"><i class="iconfont icon-dagouyouquan" v-if="item.isChoosen"></i><i class="circle" v-if="!item.isChoosen"></i></span>
                        </p>
                        <p class="options">
                            <span class="option">实名
                                <i class="iconfont icon-wenhao" v-if="item.followingUser?item.followingUser.realAuth!=2?true:false:''"></i>
                                <i class="iconfont icon-gouxuan" v-if="item.followingUser?item.followingUser.realAuth==2?true:false:''"></i>
                            </span>
                            <span class="option">学历
                                <i class="iconfont icon-wenhao" v-if="item.followingUser?item.followingUser.eduAuth!=2?true:false:''"></i>
                                <i class="iconfont icon-gouxuan" v-if="item.followingUser?item.followingUser.eduAuth==2?true:false:''"></i>
                            </span>
                            <span class="option">资历：{{item.followingUser?item.followingUser.authorAuthInfo.workAge:''}}年</span>
                        </p>
                        <div class="details">
                            <div class="hang flexSpace">
                                <p class="text">家教小时:<span class="mainText">3123</span>
                                </p>
                                <p class="text">家教值:<span class="mainText">3123</span>
                                </p>
                                <p class="text"> 相关家长: <span class="mainText">{{item.followingUser?item.followingUser.networkCount:''}}</span>
                                </p>
                            </div>
                            <div class="hang flexSpace">
                                <p v-if="item.length==0?false:true" class="box" v-for="item,index in item.userTags">
                                    <span class="smallBox">{{item.tag}}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="btnBox bgw">
                <button  class="long_btn disable" @click="myFallowShow=false">取消</button>
                <button  class="long_btn" @click="confirmWriter">确定</button>
            </div>
        </div>
        <!-- 选择 内容-->

        <div class="chooseContent" v-if="!myFallowShow">
            <!--顶部tab栏-->
            <div class="flexSpace topTab bgW">
                <p class="tabItem" v-for="item,index in tabItem" :class="item.isActive?'active':''" @click="chooseTab(item.id)" :key="item.id"><i v-if="index==1" class="iconfont  icon-jia"></i> {{item.text}}</p>
            </div>

            <!--顶部tab栏END-->
            <!-- 登记列表 -->
            <div v-if="showPart==0">
                <!-- scroller -->
                <scroller use-pullup :pullup-config="pullupDefaultConfig" @on-pullup-loading="loadMore" use-pulldown :pulldown-config="pulldownDefaultConfig" @on-pulldown-loading="refresh" lock-x ref="scrollerBottom" height="-48">
                    <div>

                        <!--任务list-->
                        <div class="reacResult" id="resultPeoples">
                            <div :class="'eachPeople bgW '+item.borderColor" v-for="item,index of postList" @click.stop="toSeeMissionDetail(index)">
                                <div class="titleBox flexSpace">
                                    <div class="left flexStart">
                                        <img
                      :src="item.webUser.imgurl?$store.state.imgUrl+item.webUser.imgurl:''"
                      @click="seeUserDetail(item.uid)"
                      class="userImg"
                      alt
                    >
                                        <div>
                                            <!-- {{item.webUser.type=='author'?"家教":"家长"}} -->
                                            <p class="name">{{item.nickname==null?'':item.nickname}}</p>
                                            <p class="options flexSpace">
                                                <span class="option flexStart">
                          实名
                          <i class="iconfont icon-gouxuan" v-if="item.webUser.realAuth=='2'?true:false"></i>
                          <i class="iconfont icon-wenhao" v-if="item.webUser.realAuth=='2'?false:true"></i>
                        </span>
                                                <span class="option">
                          学历
                          <i class="iconfont icon-gouxuan" v-if="item.eduAuth=='2'?true:false"></i>
                          <i class="iconfont icon-wenhao" v-if="item.eduAuth=='2'?false:true"></i>
                        </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="right flexEnd">
                                        <p class="button searchSS" v-if="item.taskType=='2'?true:false">找家长</p>
                                        <p class="button searchZZ" v-if="item.taskType=='1'?true:false">找家教</p>
                                        <p class="button searchSZ" v-if="item.taskType=='3'?true:false">团家长找家教</p>
                                        <p :class="item.aduitStatus==3?'aduitStatus redText':'aduitStatus mainText'">{{item.aduitStatus==1?'待审核':item.aduitStatus==2?'通过':'拒绝'}}</p>
                                        <p class="price">￥ {{item.amount}}</p>
                                    </div>
                                </div>
                                <div class="details">
                                    <p class="hang flexSpace">
                                        <span class="eachItem">年级：{{item.classNo}}</span>
                                        <span class="eachItem">科目：{{item.category}}</span>
                                        <span class="eachItem">组班方式：{{item.taskType=='1'?'1对1':"1对多"}}</span>
                                    </p>
                                    <p class="hang flexStart">
                                        <span class="eachItem">协作：{{item.coordination}}</span>
                                        <span class="eachItem add">区域：{{item.area}}</span>
                                    </p>
                                    <p class="hang">
                                        <span>简述：{{item.introduction}}</span>
                                    </p>
                                </div>
                                <div class="otherMsg flexSpace">
                                    <p class="left">
                                        <span>截至报名：{{!item.deadline?"":item.deadline.substr(0,10)}}</span>
                                        <span>已报名：{{item.applicationCount}}</span>
                                    </p>
                                    <!-- <p class="right">
                                         <button class="submitBtn" @click.stop="toEnroll(index)">报名</button>
                                    </p> -->
                                </div>
                            </div>
                        </div>
                    </div>
                </scroller>
            </div>
            <!-- 添加登记 -->
            <div v-if="showPart==1" class="content  addContent bgW">
                <!--选项内容-->
                <div class="eachArea">
                    <!-- <slidePicker :sliderArr="serverList" :leftText="leftText7" :rightText="rightText7" v-on:changeResult="changeResultWayServer1"></slidePicker>
                    v-model="chooseResult"
v-model="chooseResult"
                    <slidePicker :sliderArr="serverList" :leftText="leftText8" :rightText="rightText8" v-on:changeResult="changeResultWayServer2"></slidePicker> -->
                    <group>
                        <popup-picker :title="leftText7" @on-change='changeResultWayServer1' :placeholder="rightText7" :data="serverList" class="gradePicker"></popup-picker>
                        <popup-picker :title="leftText8" @on-change='changeResultWayServer2' :placeholder="rightText8" :data="serverList" class="gradePicker"></popup-picker>
                    </group>
                </div>
                <div class="eachArea">
                    <!--年级选择-->
                    <!-- <input type="text" :placeholder="$refs.picker1&&$refs.picker1.getNameValues()"> -->
                    <sliderPopupPicker :rightText="rightTextnj" :gradesArr="sliderClassArr" :leftText="leftText1" v-on:changeResult="changeResultGrade"></sliderPopupPicker>
                    <!--科目选择器-->
                    <sliderPopupPicker :gradesArr="sliderSubjectArr" :rightText="rightTextkm" :leftText="leftText2" v-on:changeResult="changeResultKM"></sliderPopupPicker>
                    <!--组班方式-->
                    <radioPicker :radiosArr="radiosArr" :title="publish_title" v-on:getRadioValue="getPublicWay"></radioPicker>
                    <!-- 上课方式 -->
                    <slidePicker :sliderArr="coordination" :leftText="leftText4" v-on:changeResult="changeResultWay"></slidePicker>
                    <!--上课区域-->
                    <x-address :gradesArr="addressData" :disabled="isAreaChoose" :title="leftText5" v-model="myarea" :list="addressData" class="areaBox" @on-hide="onAddressChange"></x-address>
                </div>
                <!-- 阶段列表 start-->
                <div class="eachArea">

                    <div class="eachLink slide flexSpace">
                        <group>
                            <!--阶段次数选择器start-->
                            <popup-picker :title="leftText9" @on-change="timesChange" v-model="times" :data="timesArr" class="gradePicker"></popup-picker>
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
                            <popup-picker :title="leftText10" @on-change="timeChange" v-model="time" :data="timeArr" class="gradePicker"></popup-picker>
                            <!--每次时长选择器end-->
                        </group>
                    </div>
                    <div class="eachLink slide flexSpace">
                        <datetimePicker title="开始日期" v-model="beginDate" class="datetimePicker" v-on:dateChange="beginDateChange"></datetimePicker>
                        <!-- <span class="left">开始日期</span>
                <span class="right flexSpace mainText">2018-09-31
                        <x-icon class="arrow" type="ios-arrow-right" size="20"></x-icon>
              </span>-->
                    </div>
                    <div class="eachLink slide flexSpace">
                        <datetimePicker title="结束日期" v-model="endDate" class="datetimePicker" v-on:dateChange="endDateChange"></datetimePicker>
                        <!-- <span class="left">结束日期</span>
                <span class="right flexSpace mainText">2018-12-31
                        <x-icon class="arrow" type="ios-arrow-right" size="20"></x-icon>
              </span>-->
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
                <!-- 阶段列表 end-->
                <div class="eachArea">
                    <group title="简述（20字内，必填）">
                        <x-textarea :show-counter="false" :rows="3" :max="20" autosize v-model="introduction"></x-textarea>
                    </group>
                </div>
                <div class="eachArea">
                    <group title="详述（200字内，选填）">
                        <x-textarea :show-counter="false" :rows="8" :max="200" autosize v-model="content"></x-textarea>
                    </group>
                </div>
                <!-- 上传 -->
                <div class="imgArea">
                    <span class="titleBox leftText">证明资料（最多上传三张）</span>
                    <div class="imgBox flexSpace">
                        <div class="eachBox" @click.stop="frontImg(1)">
                            <img :src="showUrl1" alt="" v-if="showUrl1==''?false:true">
                            <img src="../../assets/img/sfz@3x.png" alt="" v-if="showUrl1==''?true:false">
                            <input v-if="isios" type="file" name="img" accept="image/*" id="upload_file1" mutiple="mutiple" class="add" @change="chooseImageFront(1)">
                            <input v-if="!isios" type="file" name="img" accept="image/*" id="upload_file1" capture="camera" mutiple="mutiple" class="add" @change="chooseImageFront(1)">

                            <!-- <img src="../../assets/img/sfz@3x.png" alt=""> -->
                            <p class="text">资料一</p>
                        </div>
                        <div class="eachBox" @click.stop="frontImg(2)">
                            <img :src="showUrl2" alt="" v-if="showUrl2==''?false:true">
                            <img src="../../assets/img/sfz@3x.png" alt="" v-if="showUrl2==''?true:false">
                            <input v-if="isios" type="file" name="img" accept="image/*" id="upload_file2" mutiple="mutiple" class="add" @change="chooseImageFront(2)">
                            <input v-if="!isios" type="file" name="img" accept="image/*" id="upload_file2" capture="camera" mutiple="mutiple" class="add" @change="chooseImageFront(2)">

                            <!-- <img src="../../assets/img/sfz@3x.png" alt=""> -->
                            <p class="text">资料二</p>
                        </div>
                        <div class="eachBox" @click.stop="frontImg(3)">
                            <img :src="showUrl3" alt="" v-if="showUrl3==''?false:true">
                            <img src="../../assets/img/sfz@3x.png" alt="" v-if="showUrl3==''?true:false">
                            <input v-if="isios" type="file" name="img" accept="image/*" id="upload_file3" mutiple="mutiple" class="add" @change="chooseImageFront(3)">
                            <input v-if="!isios" type="file" name="img" accept="image/*" id="upload_file3" capture="camera" mutiple="mutiple" class="add" @change="chooseImageFront(3)">

                            <!-- <img src="../../assets/img/sfz@3x.png" alt=""> -->
                            <p class="text">资料三</p>
                        </div>
                    </div>
                </div>
                <!--选项内容END-->
            </div>
            <!-- 帮助说明 -->
            <div v-if="showPart==2" class="help">
                <div class="content">
                    <p> 您可以补充登记任务</p>
                    <p class="line"></p>
                    <p> 目的：建立您家教活动的信思,提高被搜索或被信任的程度</p>
                    <p class="line"></p>
                    <p>条件：</p>
                    <p> 1.必须是2018年7月1日后到补充登记日前己完成的家教活动</p>
                    <p> 2必须上传证明资料（资料不会公开）</p>
                    <p>3. 如是1对1，对方必须也是平台注册者，可以咨询
                        <p>4. 如是1对多，至少有1位参与者必须是平台注册者，而且愿意证明您的家教任务详悄</p>
                        <p>5. 如家教任务是2018年7月1日到2020年7月1日，您可
                            以补充登记2018年7月1日后到补充登记日前完成的写
                            作活动；以后的活动可以在平合上走标准流程，这样
                            的好处是您可以有过程记录，家教家长互动，和其他
                            注册者之间的互动.</p>
                        <p class="line"></p>
                        <p>费用：免费</p>
                </div>
            </div>
            <div class="btnBox  bgW" v-if="showPart==1">
                <button class="long_btn" @click="supplementaryRegistration">提交审核</button>
            </div>
        </div>

    </div>
</template>

<script>
import axios from "axios";
import slidePicker from '@/components/slidePicker'
import sliderPopupPicker from '@/components/sliderPopupPicker'
import radioPicker from '@/components/radioPicker'
import datetimePicker from '@/components/datetimePicker'
import common from '@/assets/js/common'
import {
    Range,
    Popup,
    XSwitch,
    Cell,
    XButton,
    Group,
    Picker,
    Datetime,
    XTextarea,
    ChinaAddressV4Data,
    XAddress,
    Scroller,
    AlertModule,
    Alert,
    PopupPicker,
    Value2nameFilter as value2name
} from 'vux'
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
import writers from '@/components/writer/writer'
export default {
    data() {
        return {
            myFallowShow: false,

            pullupDefaultConfig: pullupDefaultConfig,
            pulldownDefaultConfig: pulldownDefaultConfig,
            // 根据顶部tab某些部件不显示
            seeZZ: true,
            seeSS: true,
            seezzss: false,
            // data--start
            classNo: '',
            category: '',
            taskType: '', //组班方式
            isAreaChoose:false,
            priceType: '',
            area: '',
            introduction: '',
            content: '',
            priceMin: '',
            priceMax: '',
               rightTextnj: '',
            rightTextkm: "",
            // data--end
            myarea: [],
            addressData: [{"name":"上海市","value":"310000"},{"name":"市辖区","value":"310100","parent":"310000"},{"name":"黄浦区","value":"310101","parent":"310100"},{"name":"徐汇区","value":"310104","parent":"310100"},{"name":"长宁区","value":"310105","parent":"310100"},{"name":"静安区","value":"310106","parent":"310100"},{"name":"普陀区","value":"310107","parent":"310100"},{"name":"虹口区","value":"310109","parent":"310100"},{"name":"杨浦区","value":"310110","parent":"310100"},{"name":"闵行区","value":"310112","parent":"310100"},{"name":"宝山区","value":"310113","parent":"310100"},{"name":"嘉定区","value":"310114","parent":"310100"},{"name":"浦东新区","value":"310115","parent":"310100"},{"name":"金山区","value":"310116","parent":"310100"},{"name":"松江区","value":"310117","parent":"310100"},{"name":"青浦区","value":"310118","parent":"310100"},{"name":"奉贤区","value":"310120","parent":"310100"},{"name":"崇明区","value":"310151","parent":"310100"}],
            sliderSubjectArr: [],
            sliderClassArr: [],
            stage: 0,
            // 顶部tab
            tabItem: [{
                    id: 0,
                    isActive: true,
                    text: '已登记'
                },
                {
                    id: 1,
                    isActive: false,
                    text: '添加登记'
                }, {
                    id: 2,
                    isActive: false,
                    text: '帮助说明'
                }
            ],
            finalPrice: 0,
            // 顶部tab--end
            // 组件传入
            // 传入slidePicker的数据
            gradesArr: [],
            leftText1: '年级',
            rightText1: '不限',
            subjectArr: [],
            priceArr: [],
            timesArr: [],
            slidePriceArr2: [],
            coordination: [
                ['不限', '家教拜访', '家长拜访', '远程协作']
            ],

            leftText2: '科目',
            leftText4: '上课方式',
            leftText5: '上课区域',
            leftText7: '服务提供方',
            leftText8: '服务接收方',
            rightText7: '',
            rightText8: '',
            leftText9: "阶段次数",
            beginDate: "",
            endDate: "",
            leftText10: "每次时长",
            time: [],
            timeArr: [],
            times: [],
            timesArr: [],
            serverList: [
                ['我', '选择用户']
            ],
            authorId: '',
            // rightText2: '不限',
            // 传入radio的值
            radioTitle: '选择性别',
            publish_title: '组班方式',
            radiosArr: [{
                    value: 1,
                    text: '1对1',
                    selected: true
                },
                {
                    value: 2,
                    text: '1对多',
                    selected: false
                },
            ],
            postData: {
                priceType: '',
                classNo: '',
                category: '',
                priceType: '',
                fee: '',
                busniessCount: '',
                deadline: '',
                coordination: '',
                area: '',
                introduction: ''
            },
            postData1: {
                currentPage: 1,
                supplement: true,
                uid: this.$store.state.uid
            },
            userData: {},
            showPart: 0,
            writerList: [],
            chooseWriterList: [],
            serviceRate: 0,
            adjustmentRate: 0,
            taskId: '',
            isios: false,
            frontUrl1: '',
            frontUrl2: '',
            frontUrl3: '',
            showUrl1: '',
            showUrl2: '',
            showUrl3: '',
            isMulSelection: false,
            // 是否发布任务成功
            postSuccess: false,
            nowPage: 1,
            //任务列表
            postList: [],
            // 服务接收者列表
            selectList: [],
            followingUid:'',
            isFirst:true
        }
    },
    components: {
        writers,
        datetimePicker,
        XTextarea,
        Range,
        Popup,
        XSwitch,
        Cell,
        XButton,
        Group,
        Picker,
        sliderPopupPicker,
        radioPicker,
        ChinaAddressV4Data,
        XAddress,
        Alert,
        slidePicker,
        PopupPicker,
        AlertModule,
        Scroller,
    },
    mounted() {
        this.getCategory();
        this.getGrade();
        // this.getPriceArr()
        // 调解费
        this.getBaseRate();

        this.getUser(this.$store.state.uid);
        this.postData.taskType = '';

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

        this.getFellowList()
        // 列表
        this.postList = [];
        this.postData.currentPage = this.nowPage;
        this.postData.pageSize =10;
        this.loadMore();
    },
    methods: {

        ...common,
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
            that.postData1.currentPage = that.nowPage;
            that.nowPage++;

            that.postData.pageSize =10
        },
        refresh() {
            var that = this;
            that.getMIssionlist(data => {
                // that.postList = data;

                if (that.postData.currentPage == 1) {
                    console.log('11111111111111111111111111111111111')
                    //禁止上啦，已经没有数据
                    that.$refs.scrollerBottom.donePulldown();
                }
                that.postList = data;
                that.$refs.scrollerBottom.donePulldown();
            });
            if (that.postData.currentPage > 0) {
                that.postData.currentPage--;
            }

            that.postData.pageSize =10;
        },
        // 获取任务列表
        getMIssionlist(fn) {
            var that = this;
            console.log('传入的参数')
            console.log(that.postData)
            that.postData1.aduitStatuses='1,2,3'
            that
                .$http(
                    "get",
                    that.$store.state.baseUrl + "api/Order/Page",
                    that.postData1
                )
                .then(function (res) {
                    if (res.data.code == "00") {
                        //  alert(res.data.pi.totalSize)
                        that.totalWriter = res.data.pi.totalSize
                        var result = res.data.data;
                        for (var i in result) {
                            if (result[i].fee) {
                                var arr = result[i].fee.split("-");
                                result[i].priceMin = arr[0];
                                result[i].priceMax = arr[1];
                            }

                            result[i].nickname = result[i].webUser.nickname;
                            // console.log(result[i].webUser.nickname);
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
        // ======================================
        frontImg(id) {
            var file = document.getElementById("upload_file" + id);
            file.click()
        },
        changeResultEdu(val) {
            this.degree = val.value
            this.rightText = val.value
        },

        //   选择正面
        chooseImageFront(id) {
            var that = this;
            var baseUrl = that.$store.state.baseUrl
            var file = document.getElementById("upload_file" + id).files[0];
            var formdata1 = new FormData(); // 创建form对象
            formdata1.append('img', file); // 通过append向form对象添加数据,可以通过append继续添加数据
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            //添加请求头
            axios.post(baseUrl + 'file/img', formdata1, config).then(function (res) {
                // console.log(res)
                if (res.data.code != '00') {
                    AlertModule.show({
                        title: res.data.msg
                    })
                } else {
                    switch (id) {

                        case 1:
                            that.frontUrl1 = res.data.data;
                            that.showUrl1 = that.$store.state.imgUrl + res.data.data
                            break;
                        case 2:
                            that.frontUrl2 = res.data.data;
                            that.showUrl2 = that.$store.state.imgUrl + res.data.data
                            break;
                        case 3:
                            that.frontUrl3 = res.data.data;
                            that.showUrl3 = that.$store.state.imgUrl + res.data.data;

                            break;
                    }
                }
            })
        },
        // 我的关注列表
        getFellowList() {
            var that = this;
            var baseUrl = that.$store.state.baseUrl;
            that
                .$http("get", baseUrl + "api/UserFollowing/List", {
                    uid: that.$store.state.uid
                })
                .then(function (res) {
                    if (res.data.code == '00') {
                        var result = res.data.data;
                        var resultArr = [];
                        for (var i in result) {
                            result[i].isChoosen = false;
                        }
                        console.log('我关注的')
                        console.log(resultArr)
                        that.writerList = result;
                    } else {
                        AlertModule.show({
                            title: res.data.msg
                        });
                    }
                });
        },
        // 区域
        onAddressChange(val) {
            this.postData.area = value2name(this.myarea, ChinaAddressV4Data).split(' ').join(",");
        },

        getUser(uid) {
            var that = this;
            var baseUrl = this.$store.state.baseUrl;
            that.$http('get', baseUrl + 'api/WebUser/' + uid).then(function (res) {
                that.userData = res.data.data;
            })
        },
        //组班方式：1对11对多
        getPublicWay(val) {

            console.log(val)
            this.postData.priceType = val
           
        },
        // 上课方式
        changeResultWay(val) {
            console.log(val)
            this.postData.coordination = val[0];
             if (val[0] == '远程协作') {

                this.isAreaChoose = true;
                this.postData.coordination = '远程协作'
                  this.postData.area = '远程协作'
            } else {
                this.isAreaChoose = false;
                this.postData.coordination = val[0];
            }
        },
        chooseMyFelloUser(index) {
            var that = this;
            // isMulSelection=true;说明选择服务提供者
            if (that.isMulSelection) {
                // 单选
                for (var i in that.writerList) {
                    that.writerList[i].isChoosen = false
                }
                that.writerList[index].isChoosen = true;
                 that.authorId=that.writerList[index].uid;
            } else {
                that.writerList[index].isChoosen = !that.writerList[index].isChoosen
            }
        },
        // 服务提供方(单选)isMulSelection
        changeResultWayServer1(val) {
            var that = this;
            if (that.rightText8 == '我' && val[0] == '我' || that.rightText8 == '选择用户' && val[0] == '选择用户') {
                AlertModule.show({
                    title: "服务提供方和服务接收方只能/必须有一个选择“我”",
                    onHide() {
                        that.rightText7 = ''
                    }
                });

            } else {
                if (val[0] == '选择用户') {
                    that.isFirst=true;
                    for (var i in that.writerList) {
                        that.writerList[i].isChoosen = false
                    }
                    that.myFallowShow = true;
                    that.isMulSelection = true;
                    //  that.rightText7 = that.chooseWriterList[0].followingUser.nickname
                } else {
                    that.authorId = that.$store.state.uid;
                     that.rightText7 = val[0];
                }
               
            }
        },
        // 任务接收者（多选）
        changeResultWayServer2(val) {
            var that = this;
            console.log(val[0])
            // var that = this;
            if (that.rightText7 == '我' && val == '我' || that.rightText7 == '选择用户' && val == '选择用户') {
                AlertModule.show({
                    title: "服务提供方和服务接收方只能/必须有一个选择“我”",
                    onHide() {
                        that.rightText8 = ''
                    }
                });

            } else {
                if (val[0] == '选择用户') {
                    that.isFirst=false;
                    for (var i in that.writerList) {
                        that.writerList[i].isChoosen = false
                    }
                    that.myFallowShow = true;
                    that.isMulSelection = true;
                     
                } else {
                    // 当：服务接收者是“我”
                    that.selectList.push(that.$store.state.uid)
                    that.rightText8 = val[0];
                }
                
            }

        },
        // 年级
        changeResultGrade(value) {
            var that = this;
            that.postData.classNo = value.name;
              that.rightTextnj = value.name;

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
            this.beginDate = val;
        },
        // 结束日期
        endDateChange(val) {
            this.endDate = val;
        },
        // 科目
        changeResultKM(value) {
            this.postData.category = value.name;
            console.log(this.postData.category)
             this.rightTextkm = value.name;
        },
        // 选择家教,弹出窗口的确定按钮
        confirmWriter() {
            var that = this;
            for (var i in that.writerList) {
                if (that.writerList[i].isChoosen) {
                    that.chooseWriterList.push(that.writerList[i])
                }
            }
            console.log('选中')
            console.log(that.chooseWriterList)
            console.log(that.rightText7)
            console.log(that.chooseWriterList[0].followingUser.nickname)
            if(that.isFirst){
                that.rightText7=that.chooseWriterList[0].followingUser.nickname;
           }else{
                that.rightText8=that.chooseWriterList[0].followingUser.nickname;
            }
            that.myFallowShow = false;
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
          // 查看任务详情
        toSeeMissionDetail(i) {
            var that = this;
            // 任务的id
            var id = that.postList[i].id;
         
            // 如果要传递参数，一定要指定neme
            that.$router.push({
                // name: "missionDetail",
                path: "/supplementMissionDetail",
                query: {
                    id: id
                }
            });
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
        // 发送确认
        sendConfirm() {
         
            var that = this;
            var infos = [];
            for (var i in that.timesList) {
                var obj = {};
                obj.amount = that.timesList[i].money;
                obj.date = that.timesList[i].date.split("/").join("-") + " 00:00:00";
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
                    beginDate: that.beginDate + " 00:00:00",
                    endDate: that.endDate + " 00:00:00",
                    status: "2",
                    infos: infos,
                     workHours:that.time[0]
                };
                console.log('oooooooooooooooooooooooooooooooooooooooo')
                console.log(postData);
                var dataArr = [postData.price, postData.timeStage, postData.beginDate, postData.endDate, postData.stage]
                var nameArr = ['总价', '每次时长', '开始时间', '结束时间', '阶段次数']

                if (that.isEmpty(dataArr, nameArr).length != 0) {
                    AlertModule.show({
                        title: "请填写：" + that.isEmpty(dataArr, nameArr).join(',')
                    })
                } else {
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
                                // AlertModule.show({
                                //     title: "成功"
                                // });
                                // 确认啊啊啊啊
                                 that.sendConfirm1()
                            } else {
                                //  alert('走到这1')
                                AlertModule.show({
                                    title: res.data.msg
                                });
                            }
                        });
                }

            } else {
                AlertModule.show({
                    title: "请点击生成费用列表"
                });
            }
        },
        // 生成费用列表=============================
        chooseTab(id) {
            var that = this;
            // that.postData = {};
            for (var i in that.tabItem) {
                that.tabItem[i].isActive = false;
            }
            that.tabItem[id].isActive = true;
            that.showPart = id

        },

        // 发布任务
        posiMission() {
            var that = this;
            if (!that.postData.classNo) {
                that.postData.classNo = '';
            }
            if (!that.postData.category) {
                that.postData.category = '';
            }
            if (!that.postData.priceType) {
                that.postData.priceType = '1';
            }
            // this.postData.priceType
            if (!that.postData.fee) {
                that.postData.fee = '';
            }
            if (!that.postData.busniessCount) {
                that.postData.busniessCount = '';
            }

            if (!that.postData.deadline) {
                that.postData.deadline = '';
            }
            if (!that.postData.coordination) {
                that.postData.coordination = '';
            }
            if (!that.postData.area) {
                that.postData.area = '';
            }
            if (!that.postData.introduction) {
                that.postData.introduction = '';
            }

            that.postData.introduction = that.introduction;
            that.postData.content = that.content;
            that.postData.uid = that.$store.state.uid;
            that.postData.supplement = true;

            for (var i in that.postData) {
                that.postData[i] = that.postData[i].toString()
            }
            if (that.frontUrl1) {
                that.postData.ziliao = that.frontUrl1 + ","
            }
            if (that.frontUrl2) {
                that.postData.ziliao = that.postData.ziliao + that.frontUrl2 + ","
            }
            if (that.frontUrl3) {
                that.postData.ziliao = that.postData.ziliao + that.frontUrl3
            }
            that.postData.authorId = that.authorId;
            console.log(that.postData)
            // alert(that.authorId)
            // alert(that.chooseWriterList.length)
            // 判断是否填写相关家长
            if (that.authorId == '' || that.chooseWriterList.length == 0) {
                AlertModule.show({
                    title: '请选择服务提供者/服务接收者'
                })
                return false;
            } else {
                // 第一步：发布任务
               
                var dataArr = [that.postData.classNo, that.postData.category, that.postData.priceType, that.postData.area, that.postData.introduction];
                var nameArr = ['年级', "科目", '组班方式', '上课区域', '简述']
               
               
               if (that.isEmpty(dataArr, nameArr).length != 0) {
                    AlertModule.show({
                        title: "请填写：" + that.isEmpty(dataArr, nameArr).join(',')
                    })
                    return false;
                } else {
                    that.$http('post', that.$store.state.baseUrl + 'api/Order', that.postData).then(function (res) {
                        console.log(res.data)
                        if (res.data.code == '00') {
                            that.taskId = res.data.data.id;
                            // 任务发布成功之后，选择报名用户/api/Order/Apply/Select/uid
                            if (that.chooseWriterList.length == 0) {
                                AlertModule.show({
                                    title: '请选择服务提供者/服务接收者'
                                })
                            } else {
                                console.log('---------------')
                                console.log(that.authorId)
                                console.log(that.selectList)
                                // 第二步：  用户报名
                                for (var i in that.chooseWriterList) {
                                    // 分别调用报名接口
                                    that
                                        .$http("post", that.$store.state.baseUrl + "api/Order/Apply", {
                                            taskId: that.taskId,
                                            uid: that.chooseWriterList[i].followingUid
                                            
                                        })
                                        .then(function (res) {
                                            if (res.data.code != "00") {
                                                AlertModule.show({
                                                    title: res.data.msg
                                                });
                                            } else {
                                                // 第三步：报名成功，选择此家教
                                                var obj = {
                                                    uid: that.chooseWriterList[i].followingUid,
                                                    id: that.taskId,
                                                    status: '2'
                                                }
                                                that.$http('post', that.$store.state.baseUrl + 'api/Order/Apply/Select/uid', obj).then(function (res) {
                                                    if (res.data.code == '00') {
                                                       // alert('确定家教成功')
                                                         that.sendConfirm()
                                                    }
                                                })
                                            }
                                        });
                                    // 报名结束

                                }
                            }
                            that.postSuccess = true;
                           
                            AlertModule.show({
                                title: "补充成功",
                              
                            });
                            that.$router.push({
                                    path:'/mineIndex'
                                })
                        } else {
                            AlertModule.show({
                                title: res.data.msg
                            })
                        }
                    })
                }
            }

        },
        // 发送确认
        sendConfirm1() {
            var that = this;
             for (var i in that.chooseWriterList) {
                 var postData = {
                taskId: that.taskId,
                status: "2",
                uid:that.chooseWriterList[i].followingUid,
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
                       

                    }
                });
             }
            
        },
            // 提交审核
            supplementaryRegistration() {
                var that = this;
                that.posiMission()
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
                var yushuPrice = this.finalPrice % arr.length;
                // console.log('余下的'+yushuPrice)
                // this.finalPrice -= yushuPrice;
                // var finalPrice = this.finalPrice;
                var finalPrice = this.finalPrice - this.serviceRate * this.finalPrice - this.finalPrice * this.adjustmentRate;
                finalPrice -= yushuPrice;
                this.eachPrice = finalPrice / arr.length;
                for (var i in arr) {
                    arr[i].money = this.eachPrice;
                }
                // console.log("价格余数" + yushuPrice);
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
                // that.getTimesList();
                // if (that.postSuccess) {
                   
                // }

            }
        }
    }
</script>

<style >

#supplementaryRegistration {
    background: #fff;
    height: 100%;
}
p.aduitStatus{
        height: auto;
    margin: 0;
    padding: 0;
    line-height: 10px;
    padding-top: 15px;
}

#supplementaryRegistration .topTab .tabItem.active {
    color: #3375C5;
    border-bottom: 3px solid #3375C5;
}

#supplementaryRegistration .topTab .tabItem {
    padding: 0 5px;
}

#supplementaryRegistration .topTab {
    height: 40px;
    line-height: 40px;
    padding: 0 30px;
    border-bottom: 1px solid #CECECE;
    font-size: 15px;
    color: #636363;
}

.help {
    background: #f5f5f5;
    padding: 20px;
    height: 100%;
}

.eachLink.slide.flexSpace>div {
    width: 100%;
}

.help .line {
    height: 15px;
}

#supplementaryRegistration .chooseContent {
    /* padding-bottom: 50px; */
    height: 100%;
}

#supplementaryRegistration .imgArea {
    background: #fff;
}

#supplementaryRegistration .titleBox {
    height: 50px;
    line-height: 50px;
    /* border-bottom: 1px solid #DDDDDD; */

}

#supplementaryRegistration #resultPeoples.reacResult .titleBox p.name {
    height: 20px;
}

#supplementaryRegistration .content {
    padding: 15px 11px;
    background: #fff;
    padding-bottom: 0;
}

#supplementaryRegistration .titleBox input {
    height: 100%;
    border: none;
    text-align: right;
    color: #3375C5;
    font-size: 13px;
}

#supplementaryRegistration .eachArea .titleBox {
    border: none;
}

#supplementaryRegistration .vux-x-textarea.weui-cell {
    padding: 0;
    border-radius: 5px;
}

#supplementaryRegistration .imgBox {
    /* margin-top: 20px; */
    text-align: center;
    color: #C2C3C3;
    font-size: 12px;
}

#supplementaryRegistration .imgBox img {
    width: 92px;
    height: 63px;
    margin-bottom: 12px;
}

#supplementaryRegistration .submit_btn {
    margin-top: 45px;
}

#supplementaryRegistration .weui-cells:before {
    border: none
}

#supplementaryRegistration .imgBox input {
    display: none;
}

#supplementaryRegistration .priceBox {
    padding: 10px 16px;
    background: #f5f5f5;
}

#supplementaryRegistration .areaBox .weui-cell {
    padding: 12px 15px;
    background: #f5f5f5;
}

#supplementaryRegistration .priceBox span.title {
    font-size: 14px;
    color: #242424
}

#supplementaryRegistration .btnBox {
    position: fixed;
    bottom: 0;
    padding: 8px 10px;
    width: 100%;
    background: #fff;
    border-top: 1px solid #C3C3C3;
    display: flex;
}

#supplementaryRegistration .long_btn {
    width: 100%;
    margin-top: 0px !important;
}

#supplementaryRegistration .long_btn.disable {
    background: #C3C3C3;
    margin-right: 10px;
}

#supplementaryRegistration .vux-x-textarea.weui-cell {

    padding: 0 15px;
    font-size: 14px;
    color: #242424;
}

#supplementaryRegistration .priceBox input {
    width: 80px;
    height: 30px;
    border: 1px solid #eee;
    border-radius: 5px;
    background: #fff;
    padding: 5px;
}

#supplementaryRegistration .content .eachArea {
    border: 1px solid #CECECE;
    border-radius: 5px;
    margin-bottom: 8px;
}

#supplementaryRegistration .content .weui-cells,
#supplementaryRegistration .content .sexBox {
    background: #F5F5F5 !important;
}

.eachLink.flexSpace.finalPriceLink {
    height: 43px;
    line-height: 43px;
    padding-left: 15px;
    font-size: 14px;
    background: #f5f5f5;
}

input.finalPrice.mainText {
    height: 40px;
    border: none;
    width: 50px;
    text-align: left;
}

.vux-cell-value {
    color: #3375C5;
}

#supplementaryRegistration .content .datetimePicker {
    background: #F5F5F5;
    height: 44px;
    color: #242424;
    font-size: 14px;
    width: 100%;
    border-bottom: 1px solid #D9D9D9;
}

#supplementaryRegistration .weui-cells:before {
    display: none;
}

#supplementaryRegistration .vux-picker {
    position: fixed;
    bottom: 0;
    width: 100%;
}

#supplementaryRegistration .eachArea .weui-cells__title {
    background: #F5F5F5;
    height: 44px;
    color: #242424;
    font-size: 14px;
    margin: 0;
    line-height: 44px;
}

#supplementaryRegistration .weui-textarea {
    background: #F5F5F5;
}

#supplementaryRegistration .long_btn {
    /* width: 90%;
    margin-top: 10px;
    margin-bottom: 35px; */
}

#supplementaryRegistration .booksellerBox {
    border-top: 1px solid #D9D9D9;
}

#supplementaryRegistration .addContent {
    padding-bottom: 80px;
}

#supplementaryRegistration .help .content {
    background: #f5f5f5;
}

/* 00000000000000000000 */

.reacResult {
    margin-top: 10px;
}


.hang p {
    /* width: 33.33%; */
}

.hang p.text {
    text-align: left;
}

.reacResult .details {
    background: #efefef;
    padding: 6px 7px;
    padding-top: 1px;
        flex-direction: column;
}

.reacResult .details .each .text {
    color: #242424;
    font-size: 12px;
    margin-bottom: 8px;
}

.reacResult .details p.box {
    text-align: left;
}

.reacResult .details .smallBox {
    border: 1px solid #b1b1b1;
    padding: 3px 0px;
    color: #707070;
    font-size: 12px;
    width: 65px;
    display: inline-block;
    text-align: center;
}

.reacResult .titleBox {
    display: flex;
    justify-content: space-between;
    color: #242424;
    font-size: 14px;
    font-weight: bold;
    align-items: center;
    margin-bottom: 10px;
}

.reacResult .titleBox .radios .iconfont {
    font-size: 18px;
    color: #3375c5;
}

.reacResult .titleBox .radios .circle {
    width: 17px;
    height: 17px;
    border-radius: 50%;
    border: 1px solid #cccccc;
    display: inline-block;
}

.reacResult .options {
    color: #242424;
    font-size: 12px;
    margin-bottom: 8px;
    display: flex;
}

.reacResult .options .option {
    margin-right: 17px;
}

.reacResult .options .option i {
    color: #3375c5;
}
.myFallow{
    padding: 0 10px;
}

.reacResult .titleBox .price {
    color: #ff3939;
    font-size: 12px;
}

.flexBox{
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
}
.reacResult>.flexBox .left {
    width: 15%;
}

.reacResult>.flexBox .right {
    width: 85%;
}

.userImg {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
}

#searchResult {
    background: #f5f5f5;
}
#resultPeoples.reacResult .details{
    margin-bottom: 10px;
}
#resultPeoples.reacResult .details>p{
    display: flex;
    justify-content: space-between;
        margin-bottom: 7px;
}
#resultPeoples .eachPeople {
        margin-bottom: 10px;
    border-bottom: 3px solid #ddd;
    padding-bottom: 10px;
}
#resultPeoples{
    padding: 15px
}
.myFallow .titleBox{
    line-height: 0!important;
    height: 20px!important;
}
.myFallow .reacResult{
border-bottom: 2px solid #eee;
padding-top:10px;
padding-bottom: 10px;

}
</style>
