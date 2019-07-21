<template>
<div id="postMission">
    <!--顶部tab栏-->
    <!-- <div class="flexSpace topTab bgW">
        <p class="tabItem" v-for="item in tabItem" :class="item.isActive?'active':''" @click="chooseTab(item.id)" :key="item.id">{{item.text}}</p>
    </div> -->
    <!--顶部tab栏END-->
    <div class="content bgW">
        <!--选项内容-->
        <div class="eachArea">
            <!--年级选择-->
            <!-- <input type="text" :placeholder="$refs.picker1&&$refs.picker1.getNameValues()"> -->
            <sliderPopupPicker :gradesArr="sliderClassArr" :leftText="leftText1" :rightText="rightTextnj" v-on:changeResult="changeResultGrade"></sliderPopupPicker>
            <!--科目选择器-->
            <sliderPopupPicker :gradesArr="sliderSubjectArr" :leftText="leftText2" :rightText="rightTextkm" v-on:changeResult="changeResultKM"></sliderPopupPicker>
        </div>
        <div class="eachArea">
           
            <!--费用预算（每小时）-->
            <sliderPopupPicker :rightText="rightJg" :gradesArr="slidePriceArr" :leftText="leftText3" v-on:changeResult="changeResultPrice1"></sliderPopupPicker>

            <!--找家长找家教（招标家长人数）-->
            <group v-if="postData.taskType=='1'?false:true">
                <!--年级选择器start-->
                <popup-picker :title="leftText6" @on-change='booksellerGrade' v-model="bookseller" :data="booksellerArr" class="gradePicker"></popup-picker>
                <!--年级选择器end-->
            </group>
        </div>
        <div class="eachArea">
            <!--上课方式-->
            <slidePicker :sliderArr="coordination" :leftText="leftText4" v-on:changeResult="changeResultWay"></slidePicker>
            <!--上课区域-->
            <x-address :disabled="isAreaChoose" :gradesArr="addressData" :title="leftText5" v-model="myarea" :list="addressData" class="areaBox" @on-hide="onAddressChange"></x-address>
        </div>
        <!--报名截至日期-->
        <div class="eachArea">
            <datetimePicker title="报名截至日期" v-model="date" class="datetimePicker" v-on:dateChange='dateChange'></datetimePicker>
        </div>
        <div class="eachArea">
            <group title="描述（20字内，必填）">
                <x-textarea :show-counter="false" :rows="3" :max="20" autosize v-model="content"></x-textarea>
            </group>
        </div>
        <!-- <div class="eachArea">
            <group title="详述（200字内，选填）">
                <x-textarea :show-counter="false" :rows="8" :max="200" autosize v-model="content"></x-textarea>
            </group>
        </div> -->
        <!--选项内容END-->
    </div>
    <div class="btnBox  bgW">
        <button class="long_btn" @click="postMission">发布任务</button>
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
            seeZZ: true,
            seeSS: true,
            seezzss: false,
            isAreaChoose: false,
            // data--start
            classNo: '',
            category: '',
            taskType: '', //组班方式
            area: '',
            content: '',
            content: '',
            priceMin: '',
            rightTextnj: '全年级',
            rightTextkm: "全科",
            priceMax: '',
            // data--end
            myarea: [],
            addressData: [{"name":"上海市","value":"310000"},{"name":"市辖区","value":"310100","parent":"310000"},{"name":"黄浦区","value":"310101","parent":"310100"},{"name":"徐汇区","value":"310104","parent":"310100"},{"name":"长宁区","value":"310105","parent":"310100"},{"name":"静安区","value":"310106","parent":"310100"},{"name":"普陀区","value":"310107","parent":"310100"},{"name":"虹口区","value":"310109","parent":"310100"},{"name":"杨浦区","value":"310110","parent":"310100"},{"name":"闵行区","value":"310112","parent":"310100"},{"name":"宝山区","value":"310113","parent":"310100"},{"name":"嘉定区","value":"310114","parent":"310100"},{"name":"浦东新区","value":"310115","parent":"310100"},{"name":"金山区","value":"310116","parent":"310100"},{"name":"松江区","value":"310117","parent":"310100"},{"name":"青浦区","value":"310118","parent":"310100"},{"name":"奉贤区","value":"310120","parent":"310100"},{"name":"崇明区","value":"310151","parent":"310100"}],
            date: '',
            sliderSubjectArr: [],
            sliderClassArr: [],
            // 顶部tab
            tabItem: [{
                    id: 0,
                    isActive: true,
                    text: '找家教'
                },
                {
                    id: 1,
                    isActive: false,
                    text: '找家长'
                }, {
                    id: 2,
                    isActive: false,
                    text: '团家长找家教'
                }
            ],
            // 顶部tab--end
            // 组件传入
            // 传入slidePicker的数据
            gradesArr: [],
            leftText1: '年级',
            rightText1: '不限',
            subjectArr: [],
            priceArr: [],
            slidePriceArr: [],
            slidePriceArr2: [],
            coordination: [
                ['不限', '家教拜访', '家长拜访', '远程协作']
            ],

            leftText2: '科目',
            leftText3: '费用预算（每小时）',
            leftText4: '上课方式',
            leftText5: '上课区域',
            leftText6: '招标家长人数',

            booksellerArr: [
                // ['1','2','3','4','5']
            ],
            // rightText2: '不限',
            // 传入radio的值
            radioTitle: '选择性别',
          
            rightway: '',
            rightJg: '',
            rightTextnj: '',
            rightTextkm: "",
            postData: {
                classNo: '',
                subject: '',
                fee: '',
                deadline: '',
                coordination: '',
                area: '',
                content: ''
            },
            userData: {},
            postUserType: ''
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

        this.getUser(this.$store.state.uid);
        this.postData.taskType = '1';

    },
    methods: {

        ...common,
        changeResultPrice1(val) {
            // 价格

            this.postData.fee = val.name.split('元')[0].split('~').join('-');
            this.rightJg = this.postData.fee;

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
                that.postUserType = res.data.data.type;
            })
        },
      
        // 上课方式
        changeResultWay(val) {
            console.log(val)
            if (val[0] == '远程协作') {

                this.isAreaChoose = true;
                this.postData.coordination = '远程协作'
            } else {
                this.isAreaChoose = false;
                this.postData.coordination = val[0];
            }

        },

        // 年级
        changeResultGrade(value) {
            var that = this;
            that.postData.classNo = value.name;
            that.rightTextnj = value.name;

        },
        // 科目
        changeResultKM(value) {
            this.postData.subject = value.name;
            console.log(this.postData.subject)
            this.rightTextkm = value.name;
        },
        dateChange(value) {
            console.log(value)
            this.postData.deadline = value
        },
     
        // 发布任务
        postMission() {
            var that = this;
           
            if (!that.postData.classNo) {
                that.postData.classNo = '';
            }
            if (!that.postData.subject) {
                that.postData.subject = '';
            }
           
            if (!that.postData.fee) {
                that.postData.fee = '';
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
            if (!that.postData.content) {
                that.postData.content = '';
            }

            that.postData.content = that.content;
            that.postData.content = that.content;
            that.postData.uid = this.$store.state.uid;
            for (var i in that.postData) {
                that.postData[i] = that.postData[i].toString()
            }

            console.log(that.postData)

                if (that.postData.coordination == '远程协作') {
                    that.postData.area = '远程协作'
                    var dataArr = [that.postData.classNo, that.postData.subject, that.postData.fee,  that.postData.deadline, that.postData.coordination, that.postData.content];
                    var nameArr = ['年级', "科目", '出资方式', '费用预算（每小时）', '截止日期', '上课方式', '描述']
                } else {
                    var dataArr = [that.postData.classNo, that.postData.subject, that.postData.taskType,  that.postData.fee, that.postData.deadline, that.postData.coordination, that.postData.area, that.postData.content];
                    var nameArr = ['年级', "科目", '出资方式', '费用预算（每小时）',  '截止日期', '上课方式', '上课区域', '描述']
                }

            
            if (that.isEmpty(dataArr, nameArr).length != 0) {
                AlertModule.show({
                    title: "请填写：" + that.isEmpty(dataArr, nameArr).join(',')
                })
            } else {
              
                    /***
                     * postUserType;author;business
                     */
                    if (that.taskType == '2') {
                        that.postData.authorId = that.$store.state.uid;
                    }
                    // that.postData.deadline
                    var yourtime = that.postData.deadline;

                    // yourtime = yourtime.replace(/-/g, "/"); //替换字符，变成标准格式  
                    // var d2 = new Date(); //取今天的日期  
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
                    var startDate = new Date().Format("yyyy-MM-dd")
                    // var d1 = new Date(Date.parse(yourtime));
                    // console.log(d2 +"----------"+d1) 
                    function dateCompare(startDate, endDate) {
                        var aStart = startDate.split('-'); //转成成数组，分别为年，月，日，下同
                        var aEnd = endDate.split('-');
                        var startDateTemp = aStart[0] + "/" + aStart[1] + "/" + aStart[2];
                        var endDateTemp = aEnd[0] + "/" + aEnd[1] + "/" + aEnd[2];
                        if (startDateTemp <= endDateTemp)
                            return true;
                        else
                            return false;
                    }
                    console.log(dateCompare(startDate, yourtime))
                    that.postData.deadline = that.postData.deadline + " 24:00:00"

                    if (!dateCompare(startDate, yourtime)) {
                        AlertModule.show({
                            title: "截止时间不能是今天之前"
                        })
                    } else {
                        that.$http('post', that.$store.state.baseUrl + 'api/Order', that.postData).then(function (res) {
                            console.log(res.data)
                            if (res.data.code == '00') {
                                AlertModule.show({
                                    title: '操作成功！',
                                    onHide() {
                                        that.$router.go(-1)
                                    }
                                })
                            } else {
                                AlertModule.show({
                                    title: res.data.msg
                                })
                                that.$router.push({
                                    path: '/mission'
                                })
                            }
                        })
                    }

                }
            }

        
    }
}
</script>

<style>
body,
html,
#postMission {
    background: #fff;
    height: 100%;
    position: fixed;
    overflow: scroll;
    width: 100%;
}

#postMission .topTab .tabItem.active {
    color: #3375C5;
    border-bottom: 3px solid #3375C5;
}

#postMission .topTab .tabItem {
    padding: 0 5px;
}

#postMission .topTab {
    height: 40px;
    line-height: 40px;
    padding: 0 30px;
    border-bottom: 1px solid #CECECE;
    font-size: 15px;
    color: #636363;
}

#postMission .content {
    padding: 15px 11px;
}

#postMission .priceBox {
    padding: 10px 16px;
    background: #f5f5f5;
}

#postMission .areaBox .weui-cell {
    padding: 12px 15px;
    background: #f5f5f5;
}

#postMission .priceBox span.title {
    font-size: 14px;
    color: #242424
}

#postMission .vux-x-textarea.weui-cell {

    padding: 0 15px;
    font-size: 14px;
    color: #242424;
}

#postMission .priceBox input {
    width: 80px;
    height: 30px;
    border: 1px solid #eee;
    border-radius: 5px;
    background: #fff;
    padding: 5px;
}

#postMission .content .eachArea {
    border: 1px solid #CECECE;
    border-radius: 5px;
    margin-bottom: 8px;
}

#postMission .content .weui-cells,
#postMission .content .sexBox {
    background: #F5F5F5 !important;
}

#postMission .content .datetimePicker {
    background: #F5F5F5;
    height: 44px;
    color: #242424;
    font-size: 14px;
}

#postMission .weui-cells:before {
    display: none;
}

#postMission .vux-picker {
    position: fixed;
    bottom: 0;
    width: 100%;
}

#postMission .eachArea .weui-cells__title {
    background: #F5F5F5;
    height: 44px;
    color: #242424;
    font-size: 14px;
    margin: 0;
    line-height: 44px;
}

#postMission .weui-textarea {
    background: #F5F5F5;
}

#postMission .long_btn {
    width: 90%;
    margin-top: 10px;
    margin-bottom: 35px;
}

#postMission .booksellerBox {
    border-top: 1px solid #D9D9D9;
}
</style>
