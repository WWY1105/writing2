<template>
<div id="index" class="bgW">
    <!--轮播图 -->
    <swiper auto class="swiper" @click.native="seeBannerUrl" height="120px" :list="swipperList" v-model="demo01_index" @on-index-change="demo01_onIndexChange"></swiper>
    <!--轮播图 end-->

    <!--第一部分-->
    <div class=" container">
        <group class="eachPart bgG">
            <!--年级选择-->
            <sliderPopupPicker :gradesArr="sliderBigClassArr" :leftText="leftText1" v-on:changeResult="changeResultGrade" :rightText="rightTextnj"></sliderPopupPicker>
            <!--科目选择器-->
            <sliderPopupPicker :rightText="rightTextkm" :gradesArr="sliderSubjectArr" :leftText="leftText2" v-on:changeResult="changeResultKM1"></sliderPopupPicker>

            <!-- <popup-picker class="" :title="title1" :data="list1" v-model="value1" placeholder="请选择" :display-format="format1"></popup-picker>
        <popup-picker class="" :title="title2" :data="list2" :value="value2" placeholder="请选择" @on-change="changeGrade" @on-hide="hide"></popup-picker> -->
        </group>
        <!--第一部分end-->
        <!--第二部分-->
        <group class="eachPart bgG">
            <!--组班方式-->
            <radioPicker :radiosArr="radiosArr" :title="publish_title" v-on:getRadioValue="getPublicWay"></radioPicker>
            <!--每小时参考费用 （具体费用，双方再交流）-->
            <sliderPopupPicker :gradesArr="slidePriceArr2" :leftText="leftText3" :rightText="rightJg" v-on:changeResult="changeResultPrice1"></sliderPopupPicker>

        </group>
        <!--第二部分end-->
        <!--第三部分-->
        <group class="eachPart bgG">
            <!--上课方式-->
            <slidePicker :sliderArr="coordination" :rightText="rightway" :leftText="leftText4" v-on:changeResult="changeResultWay"></slidePicker>
            <!--上课区域-->
            <x-address :gradesArr="addressData" v-model="myarea" :title="leftText5" :list="addressData" class="areaBox" @on-hide="onAddressChange" :placeholder="rightAddress"></x-address>

        </group>

        <!--3 end-->
        <button class="long_btn" @click="gotoSeeResult">搜索</button>

    </div>
    <appFooter :nowPath="nowPath"></appFooter>
</div>
</template>

<script>
import appFooter from '@/components/footer/appFooter'
import sliderPopupPicker from '@/components/sliderPopupPicker'
import radioPicker from '@/components/radioPicker'
import slidePicker from '@/components/slidePicker'
import common from '@/assets/js/common'
import {
    Swiper,
    GroupTitle,
    Group,
    SwiperItem,
    XButton,
    Divider,
    Checker,
    CheckerItem,
    Flexbox,
    FlexboxItem,
    XAddress,
    CheckIcon,
    ChinaAddressV4Data,
    Value2nameFilter as value2name
} from 'vux'
// import { CheckIcon } from 'vux'

// 轮播图数据  -end
export default {
    components: {
        radioPicker,
        slidePicker,
        Swiper,
        SwiperItem,
        GroupTitle,
        XButton,
        Divider,
        Checker,
        CheckerItem,
        Flexbox,
        FlexboxItem,
        CheckIcon,
        Group,
        appFooter,
        sliderPopupPicker,
        XAddress
    },
    mounted() {
        this.myarea = [];
        this.getCategory();
        this.getBigGrade();
        this.getPriceArr();
        // 获取lunbotu
        this.getSwipper();
        console.log('用户' + this.$store.state.uid)
        // this.addMediator()
    },
    methods: {
        ...common,
        changeResultPrice1(val) {
            // 价格

            this.postData.fee = val.name.split('元')[0].split('~').join('-');
            this.rightJg = this.postData.fee;

        },
        // 点击轮播图
        seeBannerUrl() {
            var url = this.swipperList[this.demo01_index].bannerContent;
            window.location.href = url
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
                    console.log('轮播图数组')
                    console.log(result)
                }
            });
        },
        changeResultGrade(val) {
            console.log('首页年纪' + val)
            this.postData.classNo = val.name;
            this.rightTextnj = val.name;
        },
        changeResultKM1(val) {
            this.postData.subject = val.name;
            this.rightTextkm = val.name;

        },
        // 区域
        onAddressChange(val) {
            var arr = [];
            console.log(value2name(this.myarea, ChinaAddressV4Data))
            this.postData.area = value2name(this.myarea, ChinaAddressV4Data).split(' ').join(",");
        },
        gotoSeeResult() {
            // alert(this.postData.priceType)
            if (this.postData.priceType == undefined) {
                this.postData.priceType = 0;
            }
            //"online"="远程协作";"author"="家教上课";"学生拜访"
            switch (this.postData.coordination) {
                case undefined:
                    this.postData.coordination = '';
                    break;
                case 'author':
                    this.postData.coordination = '家教拜访';
                    break;
                case 'online':
                    this.postData.coordination = '远程协作';
                    break;
                case 'busniess':
                    this.postData.coordination = '学生拜访';
                    break;
            }

            delete this.postData.category;

            for (var i in this.postData) {
                // console.log(i+"***********"+this.postData[i])
                if (!i || !this.postData[i]) {
                    delete this.postData[i]
                }
            }
            console.log('"***********"')
            console.log(this.postData)
            this.$router.push({
                path: '/searchResult',
                query: {
                    postData: JSON.stringify(this.postData)
                },
                meta: {
                    keepAlive: false
                }
            })
        },
        onSwiperItemIndexChange(index) {
            console.log('demo item change', index)
        },
        demo01_onIndexChange(index) {
            this.demo01_index = index
        },
        // 选则相关
        changeGrade(val) {
            this.tempVla = val[0] + '/';
        },

        hide: function () {
            this.tempvalue = this.tempvalue.concat(this.tempVla);
            // console.log(this.tempvalue)
            this.value2 = this.tempvalue;
        },
        format1: function (value, name) {
            return `${value[0]}/${value[1]}/${value[2]}`
        },
        toCheck(val) {
            console.log(val)
            if (val == 1) {
                this.checkFlag1 = true;
                this.checkFlag2 = false;
            } else {
                this.checkFlag2 = true;
                this.checkFlag1 = false;
            }
        }
    },
    data() {
        return {
            rightTextnj: '全年级',
            rightTextkm: "全科",
            rightway: '不限',
            rightJg: '不限',
            nowPath: '/index',
            demo01_index: 0,
            classNo: '',
            postData: {},
            category: '',

            rightAddress: '不限',
            subject: '',
            area: '',
            myarea: [],
            priceArr: [],
            // 左边标题
            title1: '年级',
            title2: '科目',
            title3: '每小时参考费用',
            title4: '上课方式',
            title5: '上课区域',
            addressData: [{"name":"上海市","value":"310000"},{"name":"市辖区","value":"310100","parent":"310000"},{"name":"黄浦区","value":"310101","parent":"310100"},{"name":"徐汇区","value":"310104","parent":"310100"},{"name":"长宁区","value":"310105","parent":"310100"},{"name":"静安区","value":"310106","parent":"310100"},{"name":"普陀区","value":"310107","parent":"310100"},{"name":"虹口区","value":"310109","parent":"310100"},{"name":"杨浦区","value":"310110","parent":"310100"},{"name":"闵行区","value":"310112","parent":"310100"},{"name":"宝山区","value":"310113","parent":"310100"},{"name":"嘉定区","value":"310114","parent":"310100"},{"name":"浦东新区","value":"310115","parent":"310100"},{"name":"金山区","value":"310116","parent":"310100"},{"name":"松江区","value":"310117","parent":"310100"},{"name":"青浦区","value":"310118","parent":"310100"},{"name":"奉贤区","value":"310120","parent":"310100"},{"name":"崇明区","value":"310151","parent":"310100"}],
            // 底部弹窗选项
            slidePriceArr: [],
            sliderSubjectArr: [],
            sliderBigClassArr: [],
            radioTitle: '选择性别',
            publish_title: '组班方式',
            slidePriceArr2: [],
            coordination: [
                ['不限', '家教拜访', '学生拜访', '远程协作']
            ],
            leftText2: '科目',
            leftText3: '每小时参考费用',
            leftText4: '上课方式',
            leftText5: '上课区域',
            leftText1: '年级',
            1: '不限',
            radiosArr: [{
                    value: 0,
                    text: '不限',
                    selected: true
                }, {
                    value: 1,
                    text: '1对1',
                    selected: false
                },
                {
                    value: 2,
                    text: '1对多',
                    selected: false
                },
            ],
            // 组班方式选中的值
            checkType: '',
            checkFlag1: false,
            checkFlag2: false,
            swipperList: []

        }
    }
}
</script>

<style scoped>
#index {
    height: 100%;
}

.long_btn {
    width: 100%;
    margin-top: 20px;
}

.checkerBox {
    display: flex;
    justify-content: space-between;
}

.copyright {
    font-size: 12px;
    color: #ccc;
    text-align: center;
}

.text-scroll {
    border: 1px solid #ddd;
    border-left: none;
    border-right: none;
}

.text-scroll p {
    font-size: 12px;
    text-align: center;
    line-height: 30px;
}

.black {
    background-color: #000;
}

.title {
    line-height: 100px;
    text-align: center;
    color: #fff;
}

.animated {
    animation-duration: 1s;
    animation-fill-mode: both;
}

.vux-indicator.custom-bottom {
    bottom: 30px;
}

@-webkit-keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translate3d(0, 100%, 0);
    }

    100% {
        opacity: 1;
        transform: none;
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translate3d(0, 100%, 0);
    }

    100% {
        opacity: 1;
        transform: none;
    }
}

.swiper {
    margin-bottom: 20px;
}

.fadeInUp {
    animation-name: fadeInUp;
}

.swiper-demo-img img {
    width: 100%;
}

.container {
    padding: 0 10px;
}
#mineIndex  .vux-label{
    width: 100%!important;
}
.eachPart {
    border: 1px solid #CECECE;
    margin-bottom: 8px;
    border-radius: 5px;
}

.vux-flex-row {
    padding: 10px 15px;
}

.vux-cell-box,
.vux-flex-row {
    background: #F5F5F5;
}
</style>
