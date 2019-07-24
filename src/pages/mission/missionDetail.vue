<template>
<div id="missionDetail" class="bgW">

    <div class="main">
        <div class="content">
            <div class="peple flexSpace">
                <div class="left flexStart">
                    <img :src="$store.state.imgUrl+authorInfo.imgurl" alt="" @click="seeUserDetail(showData.uid)">
                    <div class="desc">
                        <p class="name">{{authorInfo.nickname}}</p>
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
                    <span>{{showData.classNo}} / {{showData.subject}}</span>
                    <span>已报名：{{showData.applicationCount}}</span>
                </p>
                <p class="flexSpace">
                    <!-- <span>{{showData.coordination=='online'?'远程协作':showData.coordination=='author'?'家教拜访':showData.coordination=='busniess'?'家长拜访':'不限'}} / {{showData.area.split(',').join('')}}</span> -->
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
                <div :class="showData.status=='1'?'active item flexCenter':''">
                    <p class="circle"></p>
                    <p class="text">待确认</p>
                </div>
                <div :class="showData.status=='2'||showData.status=='3'?'active item flexCenter':''">
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
        <div class="enrollBox bgW" v-if="isMyTask">
            <div class="title flexSpace">
                <div class="left flexSpace">
                    <p>处理报名</p>
                </div>
            </div>
            <!-- 循环报名者 satrt-->
            <div class="writerBox" v-if="isMyTask">
                <div class="eachWriter flexBox" v-for="item,index in enrollerWriterList">
                    <div class="left">
                        <img :src="$store.state.imgUrl+item.user.imgurl" class="userImg" alt="">
                    </div>
                    <div class="right flexBox">
                        <div class="top flexBox">
                            <p class="nickname">{{item.user.nickname}}</p>
                            <div>
                                <p class="tel"><i class="iconfont icon-dianhua"></i></p>
                                <p class="msg"><i class="iconfont icon-send"></i></p>
                                <button class="choose">选择</button>
                            </div>
                        </div>
                        <div class="content">
                            <div class="hang">
                                    <div class="item">{{item.user.org?item.user.org:'暂无'}}</div>
                                <p class="item">实名
                                    <i class="iconfont icon-wenhao" v-if="item.user.realAuth!=2?true:false"></i>
                                    <i class="iconfont icon-gouxuan" v-if="item.user.realAuth==2?true:false"></i>
                                </p>
                                <p class="item">学历
                                    <i class="iconfont icon-wenhao" v-if="item.user.eduAuth!=2?true:false"></i>
                                    <i class="iconfont icon-gouxuan" v-if="item.user.eduAuth==2?true:false"></i>
                                </p>
                            </div>
                            <div class="hang">
                                 <div class="item">{{item.user.eduCertificate.school?item.user.eduCertificate.school:'暂无'}}</div>
                            <div class="item">{{item.user.authorInfo?item.user.authorInfo.gender=='1'?'男':"女":'暂无'}}</div>
                            <div class="item">资历：{{item.user.authorAuthInfo?item.user.authorAuthInfo.workAge:0}}年</div>
                            </div>
                            <div class="hang">
                                {{item.user.authorInfo?item.user.authorInfo.selfCon:'暂无'}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 不是我的任务 -->
        <div class="btnBox bgw" v-if="!isMyTask">
            <!-- 如果我书商 -->
            <button class="long_btn" v-if="showData.status=='1'">{{'参加报名（截至'+showData.deadline+"）"}}</button>
            <!-- 如果我是作者 -->
        </div>
        <!-- 是我的任务 -->
        <div class="btnBox bgw" v-if="isMyTask">
            <button class="long_btn red" @click.stop="deleteTesk" v-if="showData.status=='1'">取消发布</button>
            <button class="long_btn" @click="toEvaluate" v-if="showData.status>='2'">评价</button>
        </div>

    </div>

</div>
</template>

<script>
import common from '@/assets/js/common'
import enrollWriter from '@/components/writer/enrollWriter'
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
        enrollWriter,
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
            enrollerWriterList: [],
            isMyTask: this.$route.query.isMyTask,
            showData: {},
            missionId: this.$route.query.id,
            authorInfo: {}
        }
    },
    created() {
        //  获取任务详情
        this.getMissiondetail(this.missionId)
    },
    mounted() {
        // status (integer, optional): 对家长状态(1-报名中,2-已选择,3-已评价,4-已失效,5-已取消),,\
        // 对家教状态(1-已报名,2-未选中,3-待评价,4-已完成)) ,
    },
    methods: {
        ...common,
        // 获取任务详情
        getMissiondetail(id) {
            var that = this;
            that.$http('get', that.$store.state.baseUrl + 'api/Order/' + id).then(function (res) {

                // 都是任务的信息
                that.authorInfo = res.data.data.author
                that.showData = res.data.data;
                that.enrollerWriterList = res.data.data.applies;
                // console.log('that.showData')
                // console.log(that.showData)

                if (that.showData.uid == that.$store.state.uid) {
                    that.isMyTask = true;
                    // 我是家长
                    
                } else {
                    that.isMyTask = false;
                    // 我是家教
                }

            })
        },
        // 去评价
        toEvaluate() {},

        // 取消发布
        deleteTesk() {
            this.show = !this.show;
        },

        // 报名
        toEnroll() {
            var that = this;

            //任务类型：1-找家教,2-找家长,3-团家长找家教
            // var missionType = that.showData.taskType;
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
    border: 1px solid #ccc;
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

/* ======================================================= */

.writerBox .flexBox {
    display: flex
}

.eachWriter {
    align-items: flex-start;
    justify-content: flex-start;
    padding: 10px;
    border-bottom: 10px solid #f5f5f5;
}

.eachWriter .userImg {
    width: 40px;
    height: 40px;
    border: 1px solid #ddd;
    border-radius: 50%;
    display: inline-block;
    margin-right: 10px;
}

.eachWriter .right,
.eachWriter .right .top {
    justify-content: space-between;
    width: 100%;
    flex-wrap: wrap;
}

.eachWriter .right .top {
    height: 40px;
    align-items: center;
}

.nickname {
    font-size: 14px;
    color: #242424;
    font-weight: bold;
}

.eachWriter .right .tel,
.eachWriter .right .msg {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    display: inline-block;
    margin: 0 10px;
    color: #fff;
    line-height: 25px;
    text-align: center;
    font-size: 12px;
}

.eachWriter .right .tel {
    background: #3375C5;
}

.eachWriter .right .msg {
    background: #44C447;
}

.eachWriter .right .tel i,
.eachWriter .right .msg i {
    font-size: 14px;
}

.eachWriter .right .choose {
    background: #3375C5;
    padding: 4px 10px;
    font-size: 14px;
    border-radius: 12px;
    border: none;
    color: #fff;
    margin-left: 15px;
}

.eachWriter .right .content {
    background: #f0f0f0;
    padding: 10px 13px;
   
    width: 100%;
    color: #242424;
    font-size:12px;
    line-height: 20px;
}
#missionDetail .content  .hang{
     display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
}
.eachWriter .right .content .item {
    width: 33.33%;
}

/* ======================================================= */
</style>
