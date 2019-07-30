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
                <p class="firstP">简述：{{showData.content}}</p>
                <!-- <div style="word-wrap: break-word;">详述：{{showData.content}}
                </div> -->
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
                <div :class="showData.status=='4'||showData.status>='4'?'active item flexCenter':''">
                    <p class="circle"></p>
                    <p class="text">结束</p>
                </div>
            </div>

        </div>
        <!-- -->
        <div class="enrollBox bgW" >
            <div class="title flexSpace">
                <div class="left flexSpace">
                    <p>处理报名</p>
                </div>
            </div>
            <!-- 循环报名者 satrt-->
            <div class="writerBox" >
                <!--显示的情况： 未被选中且不是登陆的用户|| 登陆用户是发布者 || 选中之后，不是未被选中的人-->
                <div class="eachWriter flexBox" v-for="item,index in enrollerWriterList" v-if="(item.status!='3'&& item.uid==$store.state.uid)||(showData.uid==$store.state.uid&&item.status!='3')" :q="item.uid" :a="$store.state.uid">
                    <div class="left">
                        <img  @click.stop="goToWriterDetail(item.uid)" :src="$store.state.imgUrl+item.user.imgurl" class="userImg" alt="">
                    </div>
                    <div class="right flexBox">
                        <div class="top flexBox">
                            <p class="nickname">{{item.user.nickname}}</p>
                            <div>
                                <p class="tel" v-if="$store.state.userType=='business'"><a  @click.stop=""  :href="'tel://'+item.user.mobile" > <i class="iconfont icon-dianhua"></i></a></p>
                                <p class="msg" v-if="$store.state.userType=='business'" @click="gotoSendMsg(item.uid)"><i class="iconfont icon-send"></i></p>
                                <button class="choose" @click.stop="chooseWriter(item.id,index)" v-if="(showData.status=='1'&&isSelectedWriter)||(showData.status=='1'&&showData.uid==$store.state.uid)">选择</button>
                                 <button class="choose"   v-if="showData.status=='1'&& !isSelectedWriter&&showData.uid!=$store.state.uid">已报名</button>
                                <!-- item.status=='2'是作者未被选中  isSelectedWriter为false的时候  说明进来的不是被选中的作者-->
                                <button :class="item.status=='3'?'choose chooseDis':isSelectedWriter?'choose':'choose chooseDis'" @click.stop="chooseWriter(item.id,index)" v-if="showData.status!='1'">{{item.status=='3'?'未选中':'已选择'}}</button>
                            </div>
                        </div>
                        <div class="content">
                            <div class="hang">
                                    <div class="item mainText tagText">
                                        <!-- 机构 -->
                                      <span style="word-break: keep-all">  {{item.user.tag&&item.user?item.user.tag.tag:'暂无'}}<i class="iconfont icon-gouxuan" v-if="item.user.tag?true:false"></i></span>

                                    </div>
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
                                 <div class="item schoolText">{{item.user.eduCertificate.school?item.user.eduCertificate.school:'暂无'}}</div>
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
            <!-- 任务评价 -->
               <div class="eachPart commentPart bgW" v-if="commentList.length>0">
            <div class="title flexSpace">
                <div class="left">评价</div>

            </div>
            <div class="content">
                <div class="eachComment flexStart" v-for="item,index in commentList">
                    <img  :src="$store.state.imgUrl+item.webUser.imgurl" alt="">
                    <div class="right">
                        <div class="flexSpace">
                            <p class="name">{{item.webUser.nickname}}</p>
                            <p class="date">{{item.commentTime}}</p>
                        </div>
                        <p class="content">{{item.content}}</p>
                        <p class="tags">
                            <span class="eachTags" v-for="item,index in item.commentTags">{{item}}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        </div>

        <!-- 不是我的任务 -->
        <div class="btnBox bgw" v-if="!isMyTask">
            <!-- 如果我书商 -->
            <button class="long_btn" @click="toEnroll" v-if="showData.status=='1'">{{'参加报名（截至'+showData.deadline+"）"}}</button>
            <!-- 如果我是作者  没有被选中-->
             <button class="long_btn notSelect" v-if="showData.status!='1'&&!isSelectedWriter">未选中，请再接再厉</button>
              <!-- 如果我是作者  我被选中了-->
            <button class="long_btn notSelect" v-if="isSelectedWriter&&showData.status>'2'">已完成</button>
             <button class="long_btn notSelect" v-if="isSelectedWriter&&showData.status=='2'">待评价（请家长给予评价有助于您的评分上升）</button>
        </div>
        <!-- 是我的任务 -->
        <div class="btnBox bgw" v-if="isMyTask">
            <button class="long_btn red" @click.stop="deleteTesk" v-if="showData.status<'2'">取消发布</button>
            <button class="long_btn" @click="toEvaluate" v-if="showData.status=='2'">评价</button>
             <button class="long_btn" @click="toEvaluate" v-if="showData.status>'2'">追评</button>
        </div>

    </div>
    <!-- 弹窗 -->
    <div v-transfer-dom>
      <confirm v-model="show"
       title='提示'
      @on-cancel="show=false"
      @on-confirm="onConfirm"
     >
        <p style="text-align:center;">确定选择TA吗</p>
      </confirm>
    </div>

</div>
</template>

<script>
import common from '@/assets/js/common'
// import enrollWriter from '@/components/writer/enrollWriter'
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
   
    Group
} from 'vux'
export default {
    components: {
        Badge,
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
        Confirm 
    },
    data() {
        return {
            enrollerWriterList: [],
            isMyTask: this.$route.query.isMyTask,
            showData: {},
            missionId: this.$route.query.id,
            authorInfo: {},
            show:false,
            chooseWriterId:'',
            commentList:[],
            isSelectedWriter:false
        }
    },
    created() {
        //  获取任务详情
        this.getMissiondetail(this.missionId)
        this.getCommentList(this.missionId)
    },
    mounted() {
        // status (integer, optional): 
        // 对家长状态(1-报名中,2-已选择,3-已评价,4-已失效,5-已取消),,
        // 对家教状态(1-已报名,2-未选中,3-待评价,4-已完成)) ,
        // alert(this.isMyTask)
    },
    methods: {
        ...common,
        // 查看作者详情
        goToWriterDetail(id){
             var that = this;
            that.$router.push({
                path: '/writerDetail',
                query: {
                    'writerId':id
                }
            })
        },
          // 私信
        gotoSendMsg(writerId) {
            var that = this;
            that.$router.push({
                path: '/privateMsg',
                query: {
                    writerId:writerId
                }
            })
        },
         //    获取任务评价列表
        getCommentList(id) {
            var that = this;
            that.$http('get', that.$store.state.baseUrl + "api/TaskComment/List?taskId=" + id).then(function (res) {
                if (res.data.code == '00') {
                   var  result=res.data.data
                    for(var i in result){
                        result[i].commentTags= result[i].commentTags.split(',')
                    }
                    that.commentList = res.data.data
                    console.log(that.commentList)
                }
            })
        },
        // 选择作者
        chooseWriter(id,index){
            // alert(id)
            // 判断是不是发布者】
            if(this.$store.state.uid!=this.showData.uid){
                 AlertModule.show({
                            title: '抱歉，您不是发布者',
                        })
                        return false;
            }
            if(this.enrollerWriterList[index].status=='2'){
                AlertModule.show({
                            title: '不能重复选择',
                        })
                        return false;
            }
            this.show=true;
            this.chooseWriterId=id
        },
        onConfirm(){
            var that = this;
            that.$http('post', that.$store.state.baseUrl + 'api/Order/confirm',{
                'applyId':that.chooseWriterId,
                'oid':that.showData.id
            }).then(function (res) {
                if (res.data.code != '00') {
                        AlertModule.show({
                            title: res.data.msg,
                            onHide: function () {
                                that.$router.push({
                                    name: 'index'
                                })
                            }
                        })
                    } else {
                        AlertModule.show({
                            title: '选择成功',
                            onHide: function () {
                                that.$router.push({
                                    name: 'chooseSuccess'
                                })
                            }

                        })

                    }

            })
        },
        // 获取任务详情
        getMissiondetail(id) {
            var that = this;
            let selectWriters=[]
            that.$http('get', that.$store.state.baseUrl + 'api/Order/' + id).then(function (res) {

                // 都是任务的信息
                that.authorInfo = res.data.data.author
                 switch (res.data.data.status) {
                            case 1:
                                res.data.data.statusText = '报名中'
                                break;
                            case 2:
                                res.data.data.statusText = '待评价'
                                break;
                            case 3:
                                res.data.data.statusText = '可追评'
                                break;
                            case 4:
                                res.data.data.statusText = '已失效'
                                break;
                            case 5:
                                res.data.data.statusText = '已失效'
                                break;
                        }
                that.showData = res.data.data;
                that.enrollerWriterList = res.data.data.applies;
                // 遍历报名者：isSelectedWriter为真的时候，说明进入页面的是被选择的作者
                selectWriters=res.data.data.applies.filter((item,index)=>{
                    if(item.status=='2'&&that.$store.state.uid==item.uid){
                        return true;
                    }
                })
                if(selectWriters.length>0){
                    // 进入页面的用户是被选中的人
                    that.isSelectedWriter=true
                }
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
        toEvaluate() {
            const that=this;
            that.$router.push({
                path:'/evaluationAuthor',
                query:{
                    taskId:that.missionId
                }
            })
        },

        // 取消发布
        deleteTesk() {
            // this.show = !this.show;
            const that=this;
              that.$http('delete', that.$store.state.baseUrl + 'api/Order/' + that.missionId).then(function (res) {
                  if (res.data.code != '00') {
                        AlertModule.show({
                            title: res.data.msg,
                            onHide: function () {
                                that.$router.push({
                                    name: 'index'
                                })
                            }
                        })
                    } else {
                        AlertModule.show({
                            title: '取消成功',
                            onHide: function () {
                                that.$router.push({
                                    name: 'index'
                                })
                            }

                        })
                    }
              })
        },

        // 报名
        toEnroll() {
            var that = this;

            //任务类型：1-找家教,2-找家长,3-团家长找家教
            // var missionType = that.showData.taskType;
            // 当前用户的身份
            var userType = that.$store.state.userType;
            // alert(userType)
            // alert(that.isMyTask)
            if (userType == 'business' && !that.isMyTask) {
                AlertModule.show({
                    title: "报名身份条件不满足",
                })
            } else {
                var postData = {
                    oid: that.showData.id,
                    uid: that.$store.state.uid
                }
                that.$http('post', that.$store.state.baseUrl + 'api/Order/apply', postData).then(function (res) {
                    // console.log(res.data.data);
                    if (res.data.code != '00') {
                        AlertModule.show({
                            title: res.data.msg,
                            onHide: function () {
                                that.$router.push({
                                    name: 'index'
                                })
                            }
                        })
                    } else {
                        AlertModule.show({
                            title: '报名成功',
                            onHide: function () {
                                that.$router.push({
                                    name: 'index'
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
    font-size: 14px;
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
     font-size: 14px;
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
.eachWriter .right .choose.chooseDis{
    background: #c3c3c3;
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
    width:28%;
    text-align: left
}
.eachWriter .right .content .item.tagText,.eachWriter .right .content .item.schoolText{
    width: 44%;
}

/* ======================================================= */
/* 评价 */

.commentPart .eachComment {
    align-items: flex-start;
    padding: 10px;
}


.commentPart .right {
    padding-top: 5px;
    color: #333;
    font-size: 12px;
    border-bottom: 1px solid #B2B2B2;
    width: 90%;
    padding-bottom: 16px;
}
.commentPart .eachComment:last-of-type .right{
    border:none;
}

.commentPart img {
    margin-right: 10px;
    border: 1px solid #ccc;
    width: 42px;
    height: 42px;
    border-radius: 50%
}

.commentPart .name {
    color: #333;
    font-size: 12px;
    margin-bottom: 14px;
}

.commentPart .date {
    color: #686868;
    font-size: 10px;
}

.tags .eachTags {
    color: #333333;
    font-size: 12px;
    width: 65px;
    height: 22px;
    line-height: 22px;
    text-align: center;
    border: 1px solid #C9C37B;
    display: inline-block;
    margin-right: 5px;
    margin-top: 10px;
    background: #FFF6C5;
}
.long_btn.notSelect{
    background: #c3c3c3;
}
</style>
