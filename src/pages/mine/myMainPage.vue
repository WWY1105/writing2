<template>
<div id="myMainPage" class="bgW">
    <div class="main bgW" v-if="mainShow">
        <!-- 头像 -->
        <div class="imgBox">

            <img :src="$store.state.imgUrl+myImage" class="myPic" alt @click.stop="chooseImg">
            <input v-if="isios" type="file" name="img" accept="image/*" id="upload_file" mutiple="mutiple" class="add" @change="chooseImage" />
            <input v-if="!isios" type="file" name="img" accept="image/*" id="upload_file" mutiple="mutiple" class="add" @change="chooseImage" />
            <!-- capture="camera" -->
            <p class="editTips">修改头像</p>

        </div>

        <!--不能更改的部分-->
        <div class="disPart flexSpace">
            <p class="left">昵称</p>
            <!--@change="shortNamePut" -->
            <p class="right"><input type="text" v-model="shortName" class="shortName"></p>
        </div>
        <!--选项-->
        <div class="content bgW">
            <div class="eachArea">
                <!--性别-->
                <radioPicker class="bgG" :radiosArr="radiosArr" :title="publish_title" v-on:getRadioValue="getGender"></radioPicker>
            </div>
            <!--选项内容-->
            <div class="eachArea">
                <!--年级选择-->
                <cell title="年级" is-link :value="rightText1" @click.native="gotoMultiPicker('class')"></cell>
                <!--科目选择器-->
                <cell title="科目" v-if="$store.state.userType=='author'"  is-link :value="rightText2" @click.native="gotoMultiPicker('category')"></cell>
            </div>
            <div class="eachArea" v-if="$store.state.userType=='author'">
                <!--每小时参考费用 （具体费用，双方再交流）-->
                <sliderPopupPicker class="bgG" :gradesArr="slidePriceArr2" :leftText="leftText3" :rightText="rightText4" v-on:changeResult="changeResultSoleCost"></sliderPopupPicker>
                <!-- <sliderPopupPicker class="bgG" :gradesArr="slidePriceArr2" :leftText="leftText7" :rightText="rightText5" v-on:changeResult="changeResultJointCost"></sliderPopupPicker> -->
            </div>
            <div class="eachArea" v-if="$store.state.userType=='author'">
                <cell class="xzfs" title="上课方式" is-link :value="rightText3" @click.native="gotoMultiPicker('coordination')"></cell>
                <!--上课区域-->
                <x-address :gradesArr="addressData" :title="leftText5" :list="addressData" class="areaBox" v-model="address" @on-hide="onAddressChange"></x-address>
            </div>
            <!--报名截至日期-->
            <div class="eachArea" v-if="$store.state.userType=='author'">
                <group title="简述（200字内）">
                    <x-textarea style="background:#f5f5f5" :show-counter="false" :rows="3" :max="200" autosize v-model="introductionContent"></x-textarea>
                </group>
            </div>
            <div class="eachArea" v-if="$store.state.userType=='author'">
                <!-- <span class="titleBox leftText">家教经历</span> -->
                <group title="家教经历">
                    <x-textarea style="background: #F5F5F5" v-model="value2"></x-textarea>
                </group>
            </div>
            <!--选项内容ENDbtnSave-->
            <div class="btn_box">
                <button class="long_btn " @click="savuAllContent">保存</button>
            </div>
        </div>

    </div>

    <div id="multiPicker" class="component" v-if="!mainShow">
        <!-- 年级 -->
        <div class="gradeContent" v-if="classShow">
            <p class="title bgW">{{leftText1}}（选择后保存）</p>
            <div class="content flexSpace bgW">
                <p :class="item.active==true?'item active':'item'" v-for="item,index in gradesArr" @click="addActive(index)">{{item.className}}</p>
            </div>

            <div class="btn_box"><button class="long_btn" @click="getResult">确认</button></div>

        </div>
        <!-- 科目 -->
        <div class="categoryContent" v-if="categoryShow">
            <p class="title bgW">{{leftText2}}（选择后保存）</p>
            <div class="content flexSpace bgW">
                <p :class="item.active==true?'item active':'item'" v-for="item,index in subjectArr" @click="addActive2(index)">{{item.categroy}}</p>
            </div>
            <div class="btn_box"> <button class="long_btn" @click="getResult2">确认</button></div>
        </div>
        <!-- 上课方式 -->
        <div class="categoryContent" v-if="coordinationShow">
            <p class="title bgW">{{leftText5}}（选择后保存）</p>
            <div class="content flexSpace bgW">
                <p :class="item.active==true?'item active':'item'" v-for="item,index in coordination" @click="addActive3(index)">{{item.name}}</p>
            </div>
            <div class="btn_box"> <button class="long_btn" @click="getResult3">确认</button></div>
        </div>
    </div>
</div>
</template>

<script>
import sliderPopupPicker from "@/components/sliderPopupPicker";
import radioPicker from "@/components/radioPicker";
import datetimePicker from "@/components/datetimePicker";
import multiPicker from "@/components/multiPicker";
import common from "@/assets/js/common";
import axios from 'axios'
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
    AlertModule,
    Alert,
    Value2nameFilter as value2name
} from "vux";

export default {
    name: "myMainPage",
    components: {
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
        AlertModule,
        Alert,
        multiPicker
    },
    data() {
        return {
            // data--start
            myImage: '',
            classNo: [],
            subject: [],
            soleCost: "",
            jointCost: "",
            category: "",
            taskType: "", //组班方式
            priceType: "",
            coordinations: [], //上课方式
            area: "",
            introductionContent: "",
            content: "",
            priceMin: "",
            priceMax: "",
            isios: false,
            // 多选结果
            multiResult: {},
            gradesArr: [],
            leftText1: "年级",
            rightText1: "不限",
            rightText2: "不限",
            rightText3: "不限",
            nickName1: "className",
            nickName2: "categroy",
            classShow: false,
            categoryShow: false,
            coordinationShow: false,
            mainShow: true,
            gender: "1",
            subjectArr: [],
            priceArr: [],
            slidePriceArr2: [],
            slidePriceArr:[],
            coordination: [{
                    name: "家教拜访",
                    active: false
                },
                {
                    name: "家长拜访",
                    active: false
                },
                {
                    name: "远程协作",
                    active: false
                }
            ],
            userData: {},
            booksellerArr: [
                [1, 2, 3, 4, 5]
            ],
            leftText2: "科目",
            leftText3: "参考费用",
            leftText4: "上课方式",
            leftText5: "上课区域",
            leftText6: "招标家长人数",
            leftText7: "1对多参考费用",
            introduction: "",
            content: "",
            // rightText2: '不限',
            // 传入radio的值
            radioTitle: "选择性别",
            publish_title: "性别",
            radiosArr: [{
                    value: 1,
                    text: "男",
                    selected: true
                },
                {
                    value: 2,
                    text: "女",
                    selected: false
                }
            ],
            // data--end
            addressData: [{
                "name": "上海市",
                "value": "310000"
            }, {
                "name": "市辖区",
                "value": "310100",
                "parent": "310000"
            }, {
                "name": "黄浦区",
                "value": "310101",
                "parent": "310100"
            }, {
                "name": "徐汇区",
                "value": "310104",
                "parent": "310100"
            }, {
                "name": "长宁区",
                "value": "310105",
                "parent": "310100"
            }, {
                "name": "静安区",
                "value": "310106",
                "parent": "310100"
            }, {
                "name": "普陀区",
                "value": "310107",
                "parent": "310100"
            }, {
                "name": "虹口区",
                "value": "310109",
                "parent": "310100"
            }, {
                "name": "杨浦区",
                "value": "310110",
                "parent": "310100"
            }, {
                "name": "闵行区",
                "value": "310112",
                "parent": "310100"
            }, {
                "name": "宝山区",
                "value": "310113",
                "parent": "310100"
            }, {
                "name": "嘉定区",
                "value": "310114",
                "parent": "310100"
            }, {
                "name": "浦东新区",
                "value": "310115",
                "parent": "310100"
            }, {
                "name": "金山区",
                "value": "310116",
                "parent": "310100"
            }, {
                "name": "松江区",
                "value": "310117",
                "parent": "310100"
            }, {
                "name": "青浦区",
                "value": "310118",
                "parent": "310100"
            }, {
                "name": "奉贤区",
                "value": "310120",
                "parent": "310100"
            }, {
                "name": "崇明区",
                "value": "310151",
                "parent": "310100"
            }],
            date: "",
            postData: {},
            uid: this.$store.state.uid,
            rightText4: "不限",
            rightText5: "不限",
            address: [],
            editFlag: false,
            notEditshortName: '',
            shortName: '',
            myImage: '',
            value2: ''
        };
    },
    mounted() {
        this.getCategory();
        this.getGrade();
        this.getWebUser();
        this.getPriceArr();

        //获取浏览器的userAgent,并转化为小写
        var ua = navigator.userAgent.toLowerCase();
        //判断是否是苹果手机，是则是true
        var isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1);
        //  alert(isIos)
        if (isIos) {
            this.isios = true;
        } else {
            this.isios = false
        }
    },

    methods: {
        ...common,
        // 保存家教经历
        submitData() {
            var that = this;
           
            // if(that.$store.state.userType != 'author'){
            //      that.savuAllContent()
            // }else  if (that.value2.trim() == '' && that.$store.state.userType == 'author') {
            //     AlertModule.show({
            //         title: "请填写家教经历"
            //     })
            //     return false
            // }
            // var data = {
            //     experience: that.value2
            // }
            // data.uid = that.$store.state.uid
            // var baseUrl = this.$store.state.baseUrl;
            // that.$http('post', baseUrl + 'api/WebUser/Certificate/Author', data).then(function (res) {
            //     if (res.data.code == '00') {
            //         that.savuAllContent()
            //     } else {
            //         AlertModule.show({
            //             title: res.data.msg
            //         })
            //     }
            // })

        },
        chooseImg() {
            var file1 = document.getElementById("upload_file");
            file1.click()
        },
        //   选择头像
        chooseImage() {
            var that = this;
            var baseUrl = that.$store.state.baseUrl
            var file = document.getElementById("upload_file").files[0];
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
                    // that.orgfrontUrl=res.data.data;
                    var showUrl = res.data.data
                    that.myImage = showUrl;

                    console.log('我的头像')
                    console.log(that.myImage)
                }
            })
        },
        // 获取用户信息
        getWebUser() {
            var that = this;
            var baseUrl = this.$store.state.baseUrl;
            that
                .$http("get", baseUrl + "api/WebUser/" + this.uid)
                .then(function (res) {
                    that.userData = res.data.data;
                    that.myImage = res.data.data.imgurl
                    // 短名字
                    var grade = res.data.data.authorInfo.classParent.split(",");
                    var gradeArr = [];
                    var subject = res.data.data.authorInfo.subject.split(",");
                    var subjectArr = [];
                    var firstName = res.data.data.realName.firstName;
                    var type = res.data.data.type == "author" ? "家教" : "家长";
                    for (var i in grade) {
                        gradeArr.push(grade[i].substr(0, 2));
                    }
                    grade = gradeArr.join("");
                    for (var i in subject) {
                        subjectArr.push(subject[i].substr(0, 2));
                    }
                    subject = subjectArr.join("");

                    //    that.notEditshortName  = grade + subject + firstName + type;
                    that.shortName = res.data.data.nickname;
                    that.notEditshortName = grade + subject + firstName + type;

                    // 获取用户信息做默认展示res.data.data.authorInfo.gender=='1'
                    // 性别authorInfo.gender
                    // ?that.radiosArr[0].selected=true;that.radiosArr[1].selected=false:that.radiosArr[1].selected=true;

                    // alert(res.data.data.authorInfo.gender=='1')
                    if (res.data.data.authorInfo.gender == '1') {
                        that.radiosArr[0].selected = true;
                        that.radiosArr[1].selected = false;
                        that.gender = '1'
                    } else {
                        that.radiosArr[1].selected = true;
                        that.radiosArr[0].selected = false;
                        that.gender = '2'
                    }

                    // 年级authorInfo.classNo
                    that.rightText1 = res.data.data.authorInfo.classNo;
                    // -------------------
                    var clsNoArr = []
                    for (var i in res.data.data.authorInfo.classList) {
                        clsNoArr.push(res.data.data.authorInfo.classList[i].classId)
                    }
                    that.classNo = clsNoArr
                    // -------------------
                    var cateNoArr = []
                    for (var i in res.data.data.authorInfo.categories) {
                        cateNoArr.push(res.data.data.authorInfo.categories[i].categoryId)
                    }
                    that.subject = cateNoArr
                    // -------------------
                    // 科目authorInfo.subject
                    that.rightText2 = res.data.data.authorInfo.subject;

                    // 1对1参考费用authorInfo.soleCost
                    that.rightText4=''
                    that.rightText4 = res.data.data.authorInfo.soleCost + "元";
                    // alert(that.rightText4)
                    that.soleCost = res.data.data.authorInfo.soleCost
                        .split("元")[0]
                        .split("~")
                        .join("-");
                    // 1对多参考费用authorInfo.jointCost
                    // that.rightText5 = res.data.data.authorInfo.jointCost + "元";
                    // // alert(that.rightText5)
                    // that.jointCost = res.data.data.authorInfo.jointCost
                    //     .split("元")[0]
                    //     .split("~")
                    //     .join("-");
                    // 上课方式authorInfo.coordination
                    that.coordinations = res.data.data.authorInfo.coordination;
                    that.rightText3 = res.data.data.authorInfo.coordination;
                    var coorditaArr = that.rightText3.split(',');
                    // coordination
                    for (var i in coorditaArr) {
                        for (var j in that.coordination) {
                            if (coorditaArr[i] == that.coordination[j].name) {
                                that.coordination[j].active = true;
                            }
                        }

                    }
                    // 上课区域authorInfo.area
                    that.address = res.data.data.authorInfo.area.split(",");
                    that.area = res.data.data.authorInfo.area.split(",");
                    // 简述
                    that.introductionContent = res.data.data.authorInfo.selfCon;
                });
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
        // 提交点击得到的结果
        getResult() {
            this.classNo = []
            // 年级
            var arr = [];
            console.log(this.gradesArr)
            console.log(this.gradesArr)
            for (let i in this.gradesArr) {
                if (this.gradesArr[i].active == true) {
                    arr.push(this.gradesArr[i].className);
                    this.classNo.push(this.gradesArr[i].id);
                }
            }
            this.mainShow = true;
            this.classShow = false;
            this.rightText1 = arr.join(",");
            console.log('新获取的年级')
            console.log(this.classNo)
        },
        getResult2() {
            this.subject = []
            // 科目
            var arr = [];
            for (let i in this.subjectArr) {
                if (this.subjectArr[i].active == true) {
                    arr.push(this.subjectArr[i].categroy);
                    this.subject.push(this.subjectArr[i].id);
                }
            }
            this.mainShow = true;
            this.categoryShow = false;
            this.rightText2 = arr.join(",");
        },
        getResult3() {
            // 上课方式
            var arr = [];
            for (let i in this.coordination) {
                if (this.coordination[i].active == true) {
                    arr.push(this.coordination[i].name);
                }
            }
            this.coordinations = arr;
            this.mainShow = true;
            this.coordinationShow = false;
            this.rightText3 = arr.join(",");

        },
        // 性别
        getGender(val) {
            this.gender = val;
        },
        // 区域
        onAddressChange() {
            // this.addressData = ChinaAddressV4Data
            this.area = value2name(this.address, ChinaAddressV4Data).split(' ').join(",");
            console.log(this.area)
        },
        gotoMultiPicker(val) {
            if (val == "class") {
                //   console.log(1)
                this.classShow = true;
                (this.categoryShow = false),
                (this.coordinationShow = false),
                (this.mainShow = false);
            } else if (val == "coordination") {
                this.coordinationShow = true;
                (this.classShow = false),
                (this.categoryShow = false),
                (this.mainShow = false);
            } else {
                (this.classShow = false),
                (this.coordinationShow = false),
                (this.categoryShow = true);
                this.mainShow = false;
            }
        },
        dateChange(value) {
            console.log(value);
            this.postData.deadline = value;
        },
        changeResultGrade(val) {
            // 年级
            this.postData.classNo = val.join(',');
            console.log('年纪' + val)
        },
        changeResultKM(val) {
            // 科目
            this.postData.category = val;
        },
        changeResultSoleCost(val) {

            this.rightText4 = val.name
            this.soleCost = val.name
                .split("元")[0]
                .split("~")
                .join("-");
            console.log("1对1参考费用");
            console.log(this.rightText4)
        },
        changeResultJointCost(val) {
            this.rightText5 = val.name
            this.jointCost = val.name
                .split("元")[0]
                .split("~")
                .join("-");
        },
        shortNamePut() {
            this.editFlag = true;
            console.log(this.editFlag)
        },
        // 点击底部提交按钮
        savuAllContent() {
            var that = this;
            console.log(typeof that.coordinations)
            if (that.coordinations instanceof Array) {
                that.coordinations = that.coordinations.join(",")
            }
            // that.editFlag ? that.shortName : that.notEditshortName
            var postData ;
            if(that.$store.state.userType=='author'){
                postData.experience=that.value2;
                postData = {
                    uid: that.uid,
                    gender: that.gender,
                    classNo: that.classNo.length > 0 ? that.classNo.join(",") : that.classNo,
                    subject: that.subject.length > 0 ? that.subject.join(",") : that.subject,
                    soleCost: that.soleCost, //1对1参考费用
                    coordination: that.coordinations,
                    area: that.area,
                    selfCon: that.introductionContent,
                    nickname: that.shortName,
                
                 };
            }else{
                postData = {
                    uid: that.uid,
                    gender: that.gender,
                    classNo: that.classNo.length > 0 ? that.classNo.join(",") : that.classNo,
                    nickname: that.shortName
                 };
            }
            var flag = false;
            for (var i in postData) {
                if (postData[i] == '') {
                    flag = false;
                    AlertModule.show({
                        title: "请填写全部信息"
                    });
                    break;
                } else {
                    flag = true;
                    continue
                }
            }
            console.log(postData)
            //   提交保存
            if (flag) {
                that
                    .$http(
                        "post",
                        that.$store.state.baseUrl + "api/WebUser/Author",
                        postData
                    )
                    .then(function (res) {
                        var id = that.$store.state.uid;
                        var data = {
                            imgurl: that.myImage,
                            id: id
                        }
                        var url = that.$store.state.baseUrl + '/api/WebUser/' + id;
                        // console.log(url)
                        that.$http('put', url, data).then(function (res) {
                            // console.log(res)
                            if (res.data.code == '00') {

                                if (res.data.code == "00") {
                                    AlertModule.show({
                                        title: "保存成功！",
                                        onHide() {
                                            that.$router.push({
                                                path: '/mineIndex'
                                            })
                                        }
                                    });
                                    that.getWebUser()
                                } else {
                                    AlertModule.show({
                                        title: res.data.msg
                                    });
                                }
                            }
                        })

                    });
            }
        }
    }
};
</script>

<style scoped>
body,
html {}

.bgG {
    background: #cdcdcd;
}

.xzfs.weui-cell {
    border-bottom: 1px solid #d9d9d9;
}

#myMainPage .weui-cells:after {
    border: none !important;
    border-bottom: none !important;
}

#myMainPage .vux-popup-picker-placeholder {
    font-size: 12px;
}

#myMainPage .main .btn_box {
    bottom: 0;
    width: 100%;
    display: flex;
    padding-bottom: 10px;
    justify-content: center;
    left: 0;
    height: 60px;
    background: #fff;
    padding-top: 10px;
    z-index: 9999999;
    border-top: 1px solid #ddd;
    margin-top: 20px;
    position: fixed;
}

#myMainPage {
    /* padding-top: 50px; */
    /* height: 100%; */
    background: #fff;
}

#myMainPage .main {
    padding-left: 10px;
    padding-right: 10px;
}

#myMainPage .myPic {
    border-radius: 50%;
    width: 80px;
    height: 80px;
    /* margin: 0 auto;
    display: table;
    margin-bottom: 50px; */
    border: 2px solid #ccc;
}

#myMainPage .disPart {
    padding: 0px 15px;
    border-radius: 5px;
    background: #f5f5f5;
    margin-bottom: 8px;
    border: 1px solid #cecece;
}

#myMainPage .disPart .left,
#myMainPage .disPart .right {
    font-size: 14px;
    color: #242424;
}

#myMainPage .disPart .right {
    font-weight: bold;
}

#myMainPage .vux-cell-box:not(:first-child):before {
    border: none;
}

#myMainPage .content {
    padding: 10px 0px;
    padding-bottom: 80px
}

#myMainPage .priceBox {
    padding: 10px 16px;
    background: #f5f5f5;
}

#myMainPage .areaBox .weui-cell {
    padding: 12px 15px;
    background: #f5f5f5;
}

#myMainPage .priceBox span.title {
    font-size: 14px;
    color: #242424;
}

#myMainPage .weui-cell__bd textarea {
    background: #f5f5f5;
    font-size: 14px;
}

.shortName {
    text-align: right;
    height: 100%;
    padding: 11px 5px;
    border: none;
}

#myMainPage .vux-x-textarea.weui-cell {
    background: #f5f5f5;
    padding: 0 15px;
    font-size: 14px;
    color: #242424;
}

#myMainPage .vux-x-textarea.weui-cell * {
    background: #f5f5f5;
}

#myMainPage .weui-cells {
    background: #f5f5f5 !important;
}

#myMainPage .priceBox input {
    width: 80px;
    height: 30px;
    border: 1px solid #eee;
    border-radius: 5px;
    background: #fff;
    padding: 5px;
}

#myMainPage .content .eachArea {
    border: 1px solid #cecece;
    border-radius: 5px;
    margin-bottom: 8px;
    background: #f5f5f5;
}

#myMainPage .content .weui-cells,
#myMainPage .content .sexBox {
    background: #f5f5f5 !important;
}

#myMainPage .content .datetimePicker {
    background: #f5f5f5;
    height: 44px;
    color: #242424;
    font-size: 14px;
}

#myMainPage .weui-cells:before {
    display: none;
}

#myMainPage .vux-picker {
    position: fixed;
    bottom: 0;
    width: 100%;
}

#myMainPage .eachArea .weui-cells__title {
    background: #f5f5f5;
    height: 44px;
    color: #242424;
    font-size: 14px;
    margin: 0;
    line-height: 44px;
}

#myMainPage .weui-textarea {
    background: #f5f5f5;
}

#myMainPage .long_btn {
    width: 90%;
    margin-left: 0;
    margin: 0;
    display: block;
    z-index: 9999999999999999999999999999;

}

#myMainPage .booksellerBox {
    border-top: 1px solid #d9d9d9;
}

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
    font-size: 14px;
}

#multiPicker .content .item {
    width: 95px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    border: 1px solid #848484;
    color: #868686;
    background: #fff;
    margin-bottom: 10px;
}

#multiPicker .long_btn {
    margin-top: 60px;
    display: block;
}

.imgBox {
    position: relative;
    height: 160px;
}

.imgBox img {
    position: absolute;
    top: 50%;
    margin-top: -40px;
    left: 50%;
    margin-left: -40px;
}

.imgBox input {
    visibility: hidden;
    position: absolute;
    /* width: 100%;
    height: 100%; */
    top: 0;
    left: 0;
    /* z-index: 999; */
}

#myMainPage #multiPicker.component .btn_box {
    display: flex;
    justify-content: center;
}

#myMainPage #multiPicker.component .long_btn {
    margin-top: 10px;
}

#myMainPage .btnSave {
    position: fixed;
    left: 5%;
    bottom: 10px;
    z-index: 99999;
}
#myMainPage .editTips{
        position: absolute;
    bottom: 10%;
    left: 0;
    right: 0;
    width: 100%;
    text-align: center;
    font-size: 14px;
    color:  #3375c5;
    text-decoration: underline;

  }

.vux-cell-box:not(:first-child):before {

    left: 0;
}
</style>
