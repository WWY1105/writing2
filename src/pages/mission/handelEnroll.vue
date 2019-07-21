<template>
<div id="handelEnroll">
    <div class="enrollBox enrollBoxWriter bgW" v-if="mainShow">
        <div class="title flexSpace">
            <div class="left flexSpace">
                <p>
                    {{choosePopel}}报名名单
                    <span v-if="choosePopel=='家教'">（单选）</span>
                </p>
                <p v-model="pxIsShow" @click="pxIsShow=!pxIsShow">
                    排序
                    <i class="iconfont icon-paixu"></i>
                </p>
            </div>
            <div class="right" v-model="sxIsShow" @click="sxIsShow=!sxIsShow;pxIsShow=false">
                筛选
                <i class="iconfont icon-shaixuan"></i>
            </div>
        </div>
        <!--排序-->
        <div v-transfer-dom id="myPop">
            <sortPopup :pxIsShow="pxIsShow" :sortOptions="sortOptions" @getPxIsShow="getPxIsShow" @getOrderType="getOrderType"></sortPopup>
        </div>
        <!--顶部过滤-->
        <div id="myPop">
            <popup class="sxPop" v-model="sxIsShow" :should-rerender-on-show="false">
                <!-- <p class="bigtitle">
                    <span class="lightText">{{allWriter}}</span>个家教中有
                    <span class="lightText">{{allPeople}}</span>个可供查看
                </p> -->
                <!--年级选择-->
                <cell title="年级" is-link :value="rightText1" @click.native="gotoMultiPicker('class')"></cell>
                <!--科目选择器-->
                <cell title="科目" is-link :value="rightText2" @click.native="gotoMultiPicker('category')"></cell>
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
        <div class="writerBox" v-if="writerShow">
            <!-- 家教列表 -->
            <div class="reacResult wbg" v-for="item,index in enrollerWriterListA" @click="chooseWriter(index)">
                <div class="flexBox">
                    <div class="left">
                        <img :src="$store.state.imgUrl+item.user.imgurl" class="userImg" alt>
            </div>
                        <div class="right">
                            <p class="titleBox">
                                <span class="title">{{item.user.nickname}}</span>
                                <span class="radios">
                  <i class="iconfont icon-dagouyouquan" v-if="item.isChoosen"></i>
                  <i class="circle" v-if="!item.isChoosen"></i>
                </span>
                            </p>
                            <p class="options">
                                <span class="option">
                  实名
                  <i class="iconfont icon-wenhao" v-if="item.user.realAuth!=2?true:false"></i>
                  <i class="iconfont icon-gouxuan" v-if="item.user.realAuth==2?true:false"></i>
                </span>
                                <span class="option">
                  学历
                  <i class="iconfont icon-wenhao" v-if="item.user.eduAuth!=2?true:false"></i>
                  <i class="iconfont icon-gouxuan" v-if="item.user.eduAuth==2?true:false"></i>
                </span>
                                <span class="option">资历：{{item.user.authorAuthInfo.workAge}}年</span>
                            </p>
                            <div class="details">
                                <div class="hang">
                                    <p class="text">
                                        家教小时:
                                        <span class="mainText">{{item.user.workHours==null?0:item.user.workHours}}</span>
                                    </p>
                                    <p class="text">
                                        家教值:
                                        <span class="mainText">{{item.user.cost==null?0:item.user.cost}}</span>
                                    </p>
                                    <p class="text">
                                        相关家长:
                                        <span class="mainText">{{item.user.userCount}}</span>
                                    </p>
                                </div>
                                <div class="hang">
                                    <p v-if="item.length==0?false:true" class="box" v-for="item,index in item.userTags">
                                        <span class="smallBox">{{item.tag}}</span>
                                    </p>
                                    <!-- <p class="box">
                                        <span class="smallBox">????</span>
                                    </p> -->
                                </div>
                            </div>

                            <!--第二行详情（有的页面不显示）-->
                        </div>
                    </div>
                </div>
            </div>
            <!-- 家长的页面 -->
            <div class="BussBox" v-if="bussShow">
                <!-- 家教列表 -->
                <div class="reacResult wbg" v-for="item,index in enrollerWriterListB" @click="chooseBuss(index)">
                    <div class="flexBox">
                        <div class="left">
                            <img :src="$store.state.imgUrl+item.user.imgurl"  class="userImg" alt>
            </div>
                            <div class="right">
                                <p class="titleBox">
                                    <span class="title">{{item.user.nickname}}</span>
                                    <span class="radios">
                  <i class="iconfont icon-dagouyouquan" v-if="item.isChoosen"></i>
                  <i class="circle" v-if="!item.isChoosen"></i>
                </span>
                                </p>
                                <p class="options">
                                    <span class="option">
                  实名
                  <i class="iconfont icon-wenhao" v-if="item.user.realAuth!=2?true:false"></i>
                  <i class="iconfont icon-gouxuan" v-if="item.user.realAuth==2?true:false"></i>
                </span>
                                    <span class="option">
                  学历
                  <i class="iconfont icon-wenhao" v-if="item.user.eduAuth!=2?true:false"></i>
                  <i class="iconfont icon-gouxuan" v-if="item.user.eduAuth==2?true:false"></i>
                </span>
                                    <span class="option">资历：{{item.user.authorAuthInfo.workAge}}年</span>
                                </p>
                                <div class="details">
                                    <div class="hang">
                                        <p class="text">
                                            家教小时:
                                            <span class="mainText">{{item.user.workHours==null?0:item.user.workHours}}</span>
                                        </p>
                                        <p class="text">
                                            家教值: 
                                            <span class="mainText">{{item.user.cost==null?0:item.user.cost}}</span>
                                        </p>
                                        <p class="text">
                                            相关家长:
                                            <span class="mainText">{{item.user.userCount}}</span>
                                        </p>
                                    </div>
                                    <div class="hang">
                                        <p v-if="item.length==0?false:true" class="box" v-for="item,index in item.userTags">
                                             <span class="smallBox">{{item.tag}}</span>
                                        </p>
                                        <!-- <p class="box">
                                            <span class="smallBox">????</span>
                                        </p>
                                        <p class="box">
                                            <span class="smallBox">????</span>
                                        </p> -->
                                    </div>
                                </div>

                                <!--第二行详情（有的页面不显示）-->
                            </div>
                        </div>
                    </div>
                </div>

                <div class="btnBox bgw">
                    <button
        class="long_btn"
        @click="confirmWriter"
      >确认，下一步（{{bussShow?chooseBusNum:chooseNum}}/{{bussShow?enrollerWriterListB.length:enrollerWriterListA.length}}）</button>
                </div>
            </div>
            <!-- 000000000000000000000000000000000000000000 -->
            <div class="component">
                <div id="multiPicker">
                    <!-- 年级 -->
                    <div class="gradeContent" v-if="classShow">
                        <p class="title bgW">{{leftText1}}（选择后保存）</p>
                        <div class="content flexSpace bgW">
                            <p :class="item.active==true?'item active':'item'" v-for="item,index in sliderBigClassArr[0]" @click="addActive(index)">{{item.name}}</p>
                        </div>
                        <div class="btnBox"><button class="long_btn" @click="getResult">确认</button></div>
                    </div>
                    <!-- 科目 -->
                    <div class="categoryContent" v-if="categoryShow">
                        <p class="title bgW">{{leftText2}}（选择后保存）</p>
                        <div class="content flexSpace bgW">
                            <p :class="item.active==true?'item active':'item'" v-for="item,index in subjectArr" @click="addActive2(index)">{{item.categroy}}</p>
                        </div>
                        <div class="btnBox"> <button class="long_btn" @click="getResult2">确认</button></div>
                    </div>
                </div>
            </div>
        </div>
</template>

<script>
import common from "@/assets/js/common";
import slidePicker from "@/components/slidePicker";
import writers from "@/components/writer/writer";
import radioPicker from "@/components/radioPicker";
import sliderPopupPicker from "@/components/sliderPopupPicker";
import sortPopup from "@/components/sortPopup/sortPopup";
import {
    AlertModule,
    Popup,
    Cell,
    Group,
    XSwitch,
    XButton
} from "vux";
export default {
    data() {
        return {
            id: this.$route.query.taskId,
            isCanChoose: true,
            enrollerWriterListA: [],
            enrollerWriterListB: [],
            chooseNum: 0,
            chooseWriterId: "",
            pxIsShow: false,
            sxIsShow: false,
            allWriter: '',
            allPeople: '',
            rightText1: "",
            rightText2: "",
            stringValue1: false,
            stringValue2: false,
            stringValue3: false,
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
            minWorkAge: "",
            maxWorkAge: "",
            sortOptions: [{
                    value:"优先显示我已经加了关注的用户",
                    key: 'follow'
                },
                {
                    value:"优先显示相关家长数最多的用户",
                    key: 'userCount'
                },
                {
                    value:"优先显示家教小时数最多的用户",
                    key: 'workHours'
                },
                {
                    value:"优先显示每人小时费最少的用户",
                    key: 'price'
                },
                {
                    value:"优先显示累计家教值最多的用户",
                    key: 'work'
                }

            ],
            choosBussId: "",
            choosBuss: {},
            chooseBusNum: 0,
            chooseBussId: "",
            writerShow: true,
            bussShow: false,
            mainShow: true,
            //任务类型：1-找家教,2-找家长,3-团家长找家教
            taskType: this.$route.query.taskType,
            // 出资方式(1-1对1,2-1对多)
            priceType: this.$route.query.priceType,
            choosePopel: "家教",
            // 家长人数、
            busniessCount: this.$route.query.busniessCount,
            postData: {},
            order: "",
            sliderClassArr: [],
            sliderSubjectArr: [],
            sliderBigClassArr: [],
            subjectArr: [],
            classShow: false,
            categoryShow: false,
            gradesArr: [],
            leftText1: "年级",
            leftText2: "科目",

        };
    },
    watch: {
        order: {
            handler(newName, oldName) {
                this.getEnrollWriter(this.id, newName);
            },
            deep: true,
            immediate: true
        }
    },
    mounted() {
        this.getCategory();
        this.getGrade();
        this.getEnrollWriter(this.id);
        // 年纪
        this.getBigGrade();
        // 说明是找家长
        if (this.taskType == "2") {
            this.choosePopel = "家长";
            this.writerShow = false;
            this.bussShow = true;
        }
    },
    components: {
        Popup,
        sortPopup,
        writers,
        AlertModule,
        radioPicker,
        sliderPopupPicker,
        sortPopup,
        Cell,
        Group,
        XSwitch,
        XButton
    },
    methods: {
        ...common,
        // 抽出来的公共提交方法
        submitId(id) {
            var that = this;
            var result;
            var postData = {
                id: id,
                status: "2"
            };
            that.$http("post",
                    that.$store.state.baseUrl + "api/Order/Apply/Select",
                    postData
                )
                .then(function (res) {
                    if (res.data.code != "00") {
                    } else {}
                });
            return result;
        },
        getResult() {
            // 年级
            var arr = "";
            for (let i in this.sliderBigClassArr[0]) {
                if (this.sliderBigClassArr[0][i].active == true) {
                    arr = this.sliderBigClassArr[0][i].name;
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
        // 点击底部确认
        confirmWriter() {
            var that = this;
            if (that.taskType == "1") { // 找家教(只有1对1方式，所以只有一个家教)
                if (that.chooseWriterId == "") {
                    AlertModule.show({
                        title: "您还未选择家教"
                    });
                } else { // 选择了家教了
                    var chooseWriter = []
                    for (var k in that.enrollerWriterListA) {

                        if (that.enrollerWriterListA[k].isChoosen = true) {
                            chooseWriter.push(that.enrollerWriterListA[k].uid);
                        }
                        that.submitId(that.enrollerWriterListA[k].id)
                    }
                    that.$router.push({
                        path: "/replyDetails",
                        query: {
                            isNew: true,
                            taskId: that.id,
                            chooseWriterId: chooseWriter.join(','),
                            sendSuccess: false
                        }
                    })
                }
            } else if (that.taskType == "2") { // 找家长
                if (that.priceType == "1") { // 找家长1对1
                    if (that.chooseBusNum > 1 || that.chooseBusNum == 0) {
                        AlertModule.show({
                            title: "1对1任务，请选择一个家长"
                        });
                    } else {
                        var chooseWriter = []
                        for (var k in that.enrollerWriterListB) {
                            if (that.enrollerWriterListB[k].isChoosen = true) {
                                chooseWriter.push(that.enrollerWriterListB[k].uid);
                                that.submitId(that.enrollerWriterListB[k].id)
                            }
                            
                        }
                        that.$router.push({
                            path: "/replyDetails",
                            query: {
                                isNew: true,
                                taskId: that.id,
                                chooseWriterId: chooseWriter.join(','),
                                sendSuccess: false
                            }
                        })
                    }
                } else {
                    if (that.chooseBusNum == 0) { // 找家长1对多
                        AlertModule.show({
                            title: "请选择家长"
                        });
                    } else if (that.chooseBusNum != that.busniessCount) {
                        AlertModule.show({
                            title: "请选择" + that.busniessCount + "个家长"
                        });
                    } else if (that.chooseBusNum == that.busniessCount) {
                        var chooseWriter = []
                        for (var k in that.enrollerWriterListB) {
                            if (that.enrollerWriterListB[k].isChoosen == true) {
                                chooseWriter.push(that.enrollerWriterListB[k].uid);
                                 that.submitId(that.enrollerWriterListB[k].id)
                            }
                            
                        }
                        that.$router.push({
                            path: "/replyDetails",
                            query: {
                                isNew: true,
                                taskId: that.id,
                                chooseWriterId: chooseWriter.join(','),
                                sendSuccess: false
                            }
                        })
                    }
                }
            } else if (that.taskType == "3") {
                // 找家长找家教
                //  找家长找家教---
                if (that.chooseWriterId == "") {
                    AlertModule.show({
                        title: "您还未选择家教"
                    });
                } else {
                    this.choosePopel = "家长";
                    this.writerShow = false;
                    this.bussShow = true;
                    // =======
                    if (that.chooseBusNum == 0) {
                        AlertModule.show({
                            title: "请选择家长"
                        });
                    } else if (that.chooseBusNum != that.busniessCount) {
                        AlertModule.show({
                            title: "请选择" + that.busniessCount + "个家长"
                        });
                    } else if (that.chooseBusNum == that.busniessCount) {
                        // 循环发送家长家教
                        // var chooseWriter=[];
                        // var chooseBuss=[];
                        var allId = []; //报名的id
                        var allUid = []
                        for (var k in that.enrollerWriterListA) {
                            if ((that.enrollerWriterListA[k].isChoosen == true)) {
                                allId.push(that.enrollerWriterListA[k].id);
                                allUid.push(that.enrollerWriterListA[k].uid)
                            }
                        }
                        // alert(allId.length)
                        // console.log('家长------------------'+allId.length)
                        // console.log(  alert(allId.length))
                        for (var k in that.enrollerWriterListB) {
                            console.log(that.enrollerWriterListB[k].isChoosen)
                            if ((that.enrollerWriterListB[k].isChoosen == true)) {
                                allId.push(that.enrollerWriterListB[k].id);
                                allUid.push(that.enrollerWriterListB[k].uid)
                            }
                        }
                        //   alert(allId.length)
                        // allId = chooseWriter.concat(chooseBuss);




                        console.log('选择的人'+allId)
                        for (var i in allId) {
                            that.submitId(allId[i]);
                        }
                        that.$router.push({
                            path: "/replyDetails",
                            query: {
                                isNew: true,
                                taskId: that.id,
                                chooseWriterId: allUid.join(','),
                                sendSuccess: false
                            }
                        })
                        // ======
                    }
                }
            }

        },
        // 单选一个家教(家教永远是单选)
        chooseWriter(i) {
            var that = this;
            that.chooseNum = 1;
            for (var k in that.enrollerWriterListA) {
                that.enrollerWriterListA[k].isChoosen = false;
            }
            that.enrollerWriterListA[i].isChoosen = true;
            that.chooseWriterId = that.enrollerWriterListA[i].id;
        },
        // 选择家长
        chooseBuss(i) {
            var that = this;
            that.enrollerWriterListB[i].isChoosen = !that.enrollerWriterListB[i].isChoosen;
            var arr = [];
            for (var k in that.enrollerWriterListB) {
                if (that.enrollerWriterListB[k].isChoosen == true) {
                    arr.push(that.enrollerWriterListB[k].isChoosen);
                }
            }
            that.chooseBusNum = arr.length;
            //  alert(arr.length);
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
            this.postData.category = val;
            this.categoryName = val.name;
        },
        // 显示筛选结果==========================================
        showSSResult() {
            // 页码，排序，年级，科目，身份，学历，性别，年限
            console.log("筛选条件");

            var that = this;
            that.page = '1'
            that.postData = {
                order: that.order,
                taskId: that.id,
                status: that.$route.enrollStatus,
                // ===
                classNo: that.rightText1,
                subject: that.rightText2,
                realAuth: that.stringValue1 ? true : '',
                eduAuth: that.stringValue2 ? true : '',
                authorAuth: that.stringValue3 ? true : '',
                gender: that.chooseSex,
                minWorkAge: that.minWorkAge,
                maxWorkAge: that.maxWorkAge,
                currentPage: that.page,

            };

            that.sxIsShow = false;
            that
                .$http(
                    "get",
                    that.$store.state.baseUrl + "api/Order/Apply/List",
                    that.postData
                )
                .then(function (res) {
                    // console.log(res.data.data);
                    if (res.data.code != "00") {
                        AlertModule.show({
                            title: res.data.msg
                        });
                    } else {
                        var result = res.data.data;
                        var authorArr = [];
                        var bussArr = [];
                        for (var i in result) {
                            result[i].isChoosen = false;
                            result[i].userTags=result[i].user.authorInfo.userTags;
                            if (result[i].userType == "author") {
                                authorArr.push(result[i]);
                            } else {
                                bussArr.push(result[i]);
                            }
                        }
                        that.enrollerWriterListA = authorArr;
                        console.log("家长的列表");
                        console.log(bussArr);
                        that.enrollerWriterListB = bussArr;
                    }
                });

        },
        // ==========================================
        // 获取报名的家教列表
        getEnrollWriter(id, order) {
            var that = this;
            // var postData = {
            //     taskId: id,
            //     status: "1"
            // };
            that.postData.order = order;
            that.postData.taskId = id;
            that.postData.status = that.$route.enrollStatus;

            that
                .$http(
                    "get",
                    that.$store.state.baseUrl + "api/Order/Apply/List",
                    that.postData
                )
                .then(function (res) {
                    if (res.data.code != "00") {
                        AlertModule.show({
                            title: res.data.msg
                        });
                    } else {
                        var result = res.data.data;
                        that.allWriter = res.data.data.length;
                        var authorArr = [];
                        var bussArr = [];
                        for (var i in result) {
                            // alert(result[i].user.authorInfo.userTags.length)
                            if(result[i].user.authorInfo.userTags.length>3){
                                result[i].user.authorInfo.userTags=result[i].user.authorInfo.userTags.slice(0,3)
                            }
                            result[i].isChoosen = false;
                            if (result[i].userType == "author") {
                                authorArr.push(result[i]);
                            } else {
                                bussArr.push(result[i]);
                            }
                        }
                        that.enrollerWriterListA = authorArr;
                        console.log("家长的列表");
                        console.log(bussArr);
                        that.enrollerWriterListB = bussArr;
                    }
                });
        }
    }
};
</script>

<style scoped>
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

.btnBox {
    padding: 10px;
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

#handelEnroll {
    height: 100%;
}

#handelEnroll .btnBox {
    position: fixed;
    bottom: 0;
    padding: 8px 10px;
    width: 100%;
    background: #fff;
    border-top: 1px solid #c3c3c3;
}

#handelEnroll .long_btn {
    width: 100%;
    margin-top: 0px !important;
}

#handelEnroll .enrollBox>.title {
    /* height: 40px;
    line-height: 40px; */
    color: #636363;
    font-size: 15px;
    /* border-top: 10px solid #F5F5F5; */
    padding: 7px 15px;
    border-bottom: 1px solid #cecece;
    /*  margin-top: 10px;
    margin-bottom: 60px; */
}

#handelEnroll .enrollBox .title i.iconfont {
    color: #3374c4;
}

#handelEnroll .enrollBox .title .right {
    padding-left: 30px;
    border-left: 1px solid #cecece;
    min-width: 86px;
}

#handelEnroll .enrollBox .title .left {
    width: 100%;
    padding-right: 30px;
}

#handelEnroll .enrollBox .reacResult .titleBox {
    margin-bottom: 0;
}

#handelEnroll .enrollBox .reacResult .details {
    font-size: 12px;
}

#handelEnroll .reacResult {
    margin-top: 0;
}

/* 00000000000000000000 */

.reacResult {
    margin-top: 10px;
}

.reacResult>.flexBox,
.hang {
    display: flex;
    justify-content: space-between;
    text-align: center;
    margin-top: 7px;
}

.hang p {
    width: 33.33%;
}

.hang p.text {
    text-align: left;
}

.reacResult .details {
    background: #efefef;
    padding: 6px 7px;
    padding-top: 1px;
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

.reacResult .titleBox .price {
    color: #ff3939;
    font-size: 12px;
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

.reacResult {
    margin-top: 10px;
    padding: 10px;
}

.reacResult .options .option i.icon-wenhao {
    color: #ccc;
}

#handelEnroll.workAgeBox .vux-label {
    color: #242424;
    font-size: 14px;
}

#handelEnroll .workAgeBox {
    padding: 15px;
    flex-direction: row;
}

#handelEnroll .workAgeBox input {
    /* max-width: 100px; */
    width: 45%;
    height: 30px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 0 5px;
    text-align: center;
}
</style>
