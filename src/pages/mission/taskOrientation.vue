<template>
<div id="taskOrientation">
    <!--顶部tab栏-->
    <!-- <div class="flexSpace topTab bgW">
        <p class="tabItem" v-for="item in tabItem" :class="item.isActive?'active':''" @click="chooseTab(item.id)" :key="item.id">{{item.text}}</p>
    </div>-->
    <!--顶部tab栏END-->
    <div class="content bgW">
        <!--选项内容-->
        <div class="eachArea">
            <!--年级选择-->
            <!-- <input type="text" :placeholder="$refs.picker1&&$refs.picker1.getNameValues()"> -->
            <sliderPopupPicker :gradesArr="sliderClassArr" :leftText="leftText1" :rightText="rightTextnj"  v-on:changeResult="changeResultGrade"></sliderPopupPicker>
            <!--科目选择器-->
            <sliderPopupPicker :gradesArr="sliderSubjectArr" :leftText="leftText2" :rightText="rightTextkm" v-on:changeResult="changeResultKM"></sliderPopupPicker>
        </div>
        <!-- <div class="eachArea"> -->
        <!--组班方式-->
        <!-- <radioPicker :radiosArr="radiosArr" :title="publish_title" v-on:getRadioValue="getPublicWay"></radioPicker> -->
        <!--每小时参考费用 （具体费用，双方再交流）-->
        <!-- <sliderPopupPicker :gradesArr="slidePriceArr" :leftText="leftText3" v-on:changeResult="changeResultPrice"></sliderPopupPicker> -->
        <!--找家长找家教（招标家长人数）-->
        <!-- <group v-if="postData.taskType=='1'?false:true">-->
        <!-- 年级选择器start -->
        <!-- <popup-picker :title="leftText6" @on-change='booksellerGrade' v-model="bookseller" :data="booksellerArr" class="gradePicker"></popup-picker> -->
        <!--年级选择器end-->
        <!-- </group> -->
        <!-- </div> -->
        <div class="eachArea">
            <!--上课方式-->
            <slidePicker :sliderArr="coordination" :leftText="leftText4" v-on:changeResult="changeResultWay"></slidePicker>
            <!--上课区域-->
            <x-address :disabled="isAreaChoose"  :gradesArr="addressData" :title="leftText5" v-model="myarea" :list="addressData" class="areaBox" @on-hide="onAddressChange"></x-address>
        </div>
        <!--报名截至日期-->
        <!-- <div class="eachArea">
            <datetimePicker title="报名截至日期" v-model="date" class="datetimePicker" v-on:dateChange='dateChange'></datetimePicker>
      </div>-->
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
        <!--选项内容END-->
    </div>
    <div class="btnBox bgW">
        <button class="long_btn" @click="taskOrientation">发布任务</button>
    </div>
</div>
</template>

<script>
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
    AlertModule,
    Alert,
    PopupPicker,
    Value2nameFilter as value2name
} from 'vux'

export default {
    data() {
        return {
            bookseller: [],
            // 根据顶部tab某些部件不显示
            isAreaChoose:false,
               rightTextnj:'',
            rightTextkm:"",
            // data--start
            classNo: '',
            category: '',
            taskType: '', //组班方式
            priceType: '',
            area: '',
            introduction: '',
            content: '',
            priceMin: '',
            priceMax: '',
            // data--end
            myarea: [],
            addressData: [{"name":"上海市","value":"310000"},{"name":"市辖区","value":"310100","parent":"310000"},{"name":"黄浦区","value":"310101","parent":"310100"},{"name":"徐汇区","value":"310104","parent":"310100"},{"name":"长宁区","value":"310105","parent":"310100"},{"name":"静安区","value":"310106","parent":"310100"},{"name":"普陀区","value":"310107","parent":"310100"},{"name":"虹口区","value":"310109","parent":"310100"},{"name":"杨浦区","value":"310110","parent":"310100"},{"name":"闵行区","value":"310112","parent":"310100"},{"name":"宝山区","value":"310113","parent":"310100"},{"name":"嘉定区","value":"310114","parent":"310100"},{"name":"浦东新区","value":"310115","parent":"310100"},{"name":"金山区","value":"310116","parent":"310100"},{"name":"松江区","value":"310117","parent":"310100"},{"name":"青浦区","value":"310118","parent":"310100"},{"name":"奉贤区","value":"310120","parent":"310100"},{"name":"崇明区","value":"310151","parent":"310100"}],
            date: '',
            sliderSubjectArr: [],
            sliderClassArr: [],
            // 顶部tab
            // tabItem: [{
            //         id: 0,
            //         isActive: true,
            //         text: '找家教'
            //     },
            //     {
            //         id: 1,
            //         isActive: false,
            //         text: '找家长'
            //     }, {
            //         id: 2,
            //         isActive: false,
            //         text: '找家长找家教'
            //     }
            // ],
            // 顶部tab--end
            // 组件传入
            // 传入slidePicker的数据
            gradesArr: [],
            leftText1: '年级',
            rightText1: '不限',
            subjectArr: [],
            priceArr: [],
            slidePriceArr: [],
            coordination: [
                ['不限', '家教拜访', '家长拜访', '远程协作']
            ],

            leftText2: '科目',
            leftText3: '每小时参考费用',
            leftText4: '上课方式',
            leftText5: '上课区域',
            leftText6: '招标家长人数',

            booksellerArr: [
                // ['1','2','3','4','5']
            ],
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
                fee: '-',
                busniessCount: '',
                deadline: '',
                coordination: '',
                area: '',
                introduction: ''
            },
            userData: {},
            writerId: this.$route.query.writerId
        }
    },
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
        Alert,
        slidePicker,
        PopupPicker,
        AlertModule
    },
    mounted() {
        this.getCategory();
        this.getGrade();
        this.getPriceArr()
        // 获取传入的家教id,获取被邀请人身份
        this.getUser(this.$route.query.writerId);
        this.postData.taskType = '1';
        // 招商人数
        var arr = [];
        for (var i = 2; i <= 1000; i++) {
            arr.push(i)
        };
        this.booksellerArr.push(arr)
    },
    methods: {

        ...common,
        // 区域
        onAddressChange(val) {
            this.postData.area = value2name(this.myarea, ChinaAddressV4Data).split(' ').join(",");
        },
        // 招标家长人数
        booksellerGrade(val) {
            // 如果选择了1对1，家长只能选一个
            if (this.radiosArr[0].selected == true && val[0] != 1) {
                AlertModule.show({
                    title: "抱歉，1对1方式只能选择一名家长"
                })
            } else {
                this.postData.busniessCount = val.join('')
            }

        },
        getUser(uid) {
            var that = this;
            var baseUrl = this.$store.state.baseUrl;
            that.$http('get', baseUrl + 'api/WebUser/' + uid).then(function (res) {
                that.userData = res.data.data;
                if (that.userData.type == 'author') {
                    // 被邀请人是家教
                    that.postData.taskType = '1'
                } else {
                    // 被邀请人是家长
                    that.postData.taskType = '2'
                }
            })
        },
        //组班方式：1对11对多
        // getPublicWay(val) {
        //     console.log(val)
        //     if (this.userData.type == 'author' && this.postData.taskType == '1') {
        //         AlertModule.show({
        //             title: "抱歉，家教找家教只能选择1对1方式"
        //         })
        //         for (var i in this.radiosArr) {
        //             this.radiosArr[i].selected = false
        //         }
        //         this.radiosArr[0].selected = true
        //     }else{
        //         this.postData.priceType=val
        //     }
        // },
        // 上课方式
        changeResultWay(val) {
            console.log(val)
            if( val[0]=='远程协作'){
                 this.isAreaChoose=true;
                 this.postData.coordination = '远程协作'
             }else{
                  this.isAreaChoose=false;
                 this.postData.coordination = val[0];
             }
        },

        // 年级
        changeResultGrade(value) {
            var that = this;
            that.postData.classNo = value.name;
                   this.rightTextnj = value.name;
        },
        // 科目
        changeResultKM(value) {
            this.postData.category = value.name;
            console.log(this.postData.category)
                   this.rightTextkm = value.name;
        },

        // 发布任务
        taskOrientation() {
            var that = this;
            // 1对1
            that.postData.priceType = 1;
            // 家长人数
            that.postData.busniessCount = 1;
            if (!that.postData.classNo) {
                that.postData.classNo = '';
            }
            if (!that.postData.category) {
                that.postData.category = '';
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
            // ========
            // that.postData.fee= '';
            that.postData.deadline = '2199-01-01';
            that.postData.directional =true;
            for (var i in that.postData) {
                that.postData[i] = that.postData[i].toString()
            }
            console.log(that.postData)
            // alert(that.postData.coordination)
            if(that.postData.coordination=='远程协作'){
                that.postData.area='远程协作'
                var dataArr = [that.postData.classNo, that.postData.category, that.postData.taskType, that.postData.priceType, that.postData.coordination,  that.postData.introduction];
                 var nameArr = ['年级', "科目", '组班方式', '出资方式', '上课方式', '简述']
            }else{
                var dataArr = [that.postData.classNo, that.postData.category, that.postData.taskType, that.postData.priceType, that.postData.coordination, that.postData.area, that.postData.introduction];
                 var nameArr = ['年级', "科目", '组班方式', '出资方式', '上课方式', '上课区域', '简述']
            }
            

            if (that.isEmpty(dataArr, nameArr).length != 0) {
                AlertModule.show({
                    title: "请填写：" + that.isEmpty(dataArr, nameArr).join(',')
                })
            } else {

                that.$http('post', that.$store.state.baseUrl + 'api/Order', that.postData).then(function (res) {
                    console.log(res.data)
                    var taskId = res.data.data.id
                    if (res.data.code == '00') {
                        //    任务发布成功，将此家教报名此任务
                        var postData = {
                            taskId: taskId,
                            uid: that.writerId
                        }
                        that.$http('post', that.$store.state.baseUrl + 'api/Order/Apply', postData).then(function (res) {
                            if (res.data.code != '00') {
                                AlertModule.show({
                                    title: res.data.msg,
                                })
                            } else {
                                // 选择此家教
                                var postData = {
                                    id: res.data.data.id,
                                    status: "2",
                                    authorId: that.writerId
                                };
                                that.$http("post",
                                        that.$store.state.baseUrl + "api/Order/Apply/Select",
                                        postData
                                    )
                                    .then(function (res) {
                                        if (res.data.code != "00") {
                                            AlertModule.show({
                                                title: res.data.msg
                                            })
                                        } else {
                                            var arr = []
                                            console.log(that.writerId)
                                            // 选择家教成功
                                            // that.$router.push({
                                            //     name: "/replyDetails",

                                            // })
                                            that.$router.push({
                                                path: "/replyDetails",
                                                query: {
                                                    isNew: true,
                                                    taskId: taskId,
                                                    chooseWriterId:  that.writerId,
                                                    sendSuccess: false
                                                }
                                            })
                                        }
                                    });
                            }

                        })
                    }
                })

            }

        }
    }
}
</script>

<style scoped>
body,
html,
#taskOrientation {
    background: #fff;
    height: 100%;
}

#taskOrientation .topTab .tabItem.active {
    color: #3375c5;
    border-bottom: 3px solid #3375c5;
}
.vux-cell-box:not(:first-child):before{
    border: none;
}
.weui-cells:after{
    border-bottom: 1px solid #d9d9d9;
}
#taskOrientation .topTab .tabItem {
    padding: 0 5px;
}
.weui-cells__title{
margin-top: 0.77em;
    padding-bottom: 0.77em;
    /* margin-bottom: 0.77em; */
    padding-left: 15px;
    padding-right: 15px;
    color: #999999;
    font-size: 14px;
    border-bottom: 1px solid #d9d9d9;
}
.weui-cells:before{
    border:none
}
#taskOrientation .topTab {
    height: 40px;
    line-height: 40px;
    padding: 0 30px;
    border-bottom: 1px solid #cecece;
    font-size: 15px;
    color: #636363;
}

#taskOrientation .content {
    padding: 15px 11px;
}

#taskOrientation .priceBox {
    padding: 10px 16px;
    background: #f5f5f5;
}

#taskOrientation .areaBox .weui-cell {
    padding: 12px 15px;
    background: #f5f5f5;
}

#taskOrientation .priceBox span.title {
    font-size: 14px;
    color: #242424;
}

#taskOrientation .vux-x-textarea.weui-cell {
    padding: 0 15px;
    font-size: 14px;
    color: #242424;
}

#taskOrientation .priceBox input {
    width: 80px;
    height: 30px;
    border: 1px solid #eee;
    border-radius: 5px;
    background: #fff;
    padding: 5px;
}

#taskOrientation .content .eachArea {
    border: 1px solid #cecece;
    border-radius: 5px;
    margin-bottom: 8px;
}

#taskOrientation .content .weui-cells,
#taskOrientation .content .sexBox {
    background: #f5f5f5 !important;
}

#taskOrientation .content .datetimePicker {
    background: #f5f5f5;
    height: 44px;
    color: #242424;
    font-size: 14px;
}

#taskOrientation .weui-cells:before {
    display: none;
}

#taskOrientation .vux-picker {
    position: fixed;
    bottom: 0;
    width: 100%;
}

#taskOrientation .eachArea .weui-cells__title {
    background: #f5f5f5;
    height: 44px;
    color: #242424;
    font-size: 14px;
    margin: 0;
    line-height: 44px;
}

#taskOrientation .weui-textarea {
    background: #f5f5f5;
}

#taskOrientation .long_btn {
    width: 90%;
    margin-top: 10px;
    margin-bottom: 35px;
}

#taskOrientation .booksellerBox {
    border-top: 1px solid #d9d9d9;
}
</style>
