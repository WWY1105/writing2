<template>
<div id="fillIn" class="bgW">
    <img :src="imgurl" class="myPic" alt="">
    <!--年级选择-->
    <sliderPopupPicker :gradesArr="sliderClassArr" :leftText="leftText1" v-on:changeResult="changeResultGrade"></sliderPopupPicker>
    <!--科目选择器-->
    <sliderPopupPicker :gradesArr="sliderSubjectArr" v-if="role=='author'?true:false" :leftText="leftText2" v-on:changeResult="changeResultKM"></sliderPopupPicker>

    <button class="long_btn" @click="submitMsg">提交</button>
</div>
</template>

<script>
import common from '@/assets/js/common'
import sliderPopupPicker from '@/components/sliderPopupPicker'
import {
    PopupPicker,
    Group,
    AlertModule
} from 'vux'
export default {
    name: "fill_in_information",
    components: {
        PopupPicker,
        Group,
        sliderPopupPicker
    },
    data() {
        return {
            title1: '年级',
            title2: "科目",
            // 传入slidePicker的数据
            sliderSubjectArr: [],
            sliderClassArr: [],
            leftText1: '年级',
            leftText2: '科目',
            rightText1: '不限',
            uid: this.$store.state.uid,
            value1: [],
            value2: [],
            tempVla: '',
            tempvalue: [],
            role: '',
            data: {},
            imgurl: localStorage.getItem('imgurl')
        }
    },
    mounted() {
        this.getCategory()
        this.getGrade()
        this.role = this.$route.query.role;
    },
    computed: {

    },
    methods: {
        ...common,
        changeGrade(val) {
            this.tempVla = val[val.length - 1];
            console.log(val)
        },
        submitMsg() {
            var that = this;
            if (!Boolean(that.data.classNo)) {
                AlertModule.show({
                    title: '请填写信息'
                })
            } else {
                that.$http('post', that.$store.state.baseUrl + 'api/WebUser/Author', {
                    uid: that.uid,
                    classNo: that.data.classNo,
                    subject: that.data.category == undefined ? 0 : that.data.category
                }).then(function (res) {
                    if (res.data.code == '00') {
                        that.$http('get', that.$store.state.baseUrl + 'api/WebUser/' + that.$store.state.uid).then(function (res) {
                            if (res.data.code == '00') {
                                console.log(res.data.data)
                                var result = res.data.data;
                                var type = result.type == "author" ? '家教' : '家长';
                                var clas = result.authorInfo.classParent == '' ? '' : result.authorInfo.classParent.substr(0, 2);
                                var category = result.authorInfo.subject == '' ? '' : result.authorInfo.subject.substr(0, 2);
                                var nickname = clas + category + type;
                                console.log(nickname);
                                var postData = {
                                    uid: result.id,
                                    nickname: nickname
                                }

                                var url = that.$store.state.baseUrl + 'api/WebUser/' + result.id;
                                // console.log(url)
                                that.$http('put', url, postData).then(function (res) {
                                    if (res.data.code == '00') {
                                        if(that.GetQueryString('recommadd')){
                                            //alert(that.GetQueryString('recommadd').split('_')[1])
                                            if (that.GetQueryString('recommadd').split('_')[1]!='A') {
                                            that.$router.push({
                                                path: "/writerDetail",
                                                query: {
                                                    writerId: that.GetQueryString('recommadd').split('_')[1]
                                                }
                                            })
                                        } else {
                                            that.$router.push({
                                                name: 'index',
                                                path: 'index',
                                            })
                                        }
                                        }
                                        

                                    }
                                })

                            }
                        })
                    }
                })
            }

        },
        changeResultGrade(val) {
            console.log(val)
            // 年级
            this.data.classNo = val.value;
        },
        changeResultKM(val) {
            console.log(val)
            // 科目
            this.data.category = val.value;
        },
        hide: function () {
            this.tempvalue = this.tempvalue.concat(this.tempVla);
            // console.log(this.tempvalue)
            this.value2 = this.tempvalue;
        },
        format1: function (value, name) {
            return `${value[0]}/${value[1]}/${value[2]}`
        },
          GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
    }
}
</script>

<style scoped>
html {
    background: #fff !important;
}

#fillIn .weui-cells:after {
    border: none !important;
    border-bottom: none !important;
}

#fillIn {
    padding-top: 50px;
    padding-left: 10px;
    padding-right: 10px;
    height: 100%;
    background: #fff;
}

.myPic {
    border-radius: 50%;
    width: 80px;
    height: 80px;
    margin: 0 auto;
    display: table;
    margin-bottom: 50px;
}

.item1 {
    margin-bottom: 8px;
    color: #242424;
    font-size: 14px;
}

.long_btn {
    margin-top: 150px;
}
</style>
