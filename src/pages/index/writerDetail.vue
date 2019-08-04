<template>
<div id="writerDetail">
    <button class="fixBtn" @click="goToIndex">
        <span>回主页</span>
    </button>
    <!--顶部简介-->
    <div class="topBox" :type="userData.type" :type1="$store.state.userType">
        <writers :gender="gender" :soleCost="soleCost" :school="userData.eduCertificate?userData.eduCertificate.school:''" :org="userData.tag?userData.tag.tag:''" :hang2IsShow='hang2IsShow' :selfCon="userData.authorInfo?userData.authorInfo.selfCon:''" :tag="userData.tag" :serviceHours="userData.serviceHours" :serviceOrderCount="userData.serviceOrderCount" :serviceUserCount="userData.serviceUserCount" :authorAuth="userData.authorAuth" :type="userData.type" :isMissionDetail="isMissionDetail" :missionNum="userData.taskCount" :userTags="userTags" :realAuth="userData.realAuth" :eduAuth="userData.eduAuth" :userCount="userData.userCount" :avaTaskCount="userData.avaTaskCount " :cost="userData.cost" :workAge="workAge" :workHours="userData.workHours" :imgurl="userImg" :shortName="userData.nickname"></writers>
        <!--三个按钮-->
        <div class="btnBox bgW" v-if="userData.type=='author'&&$store.state.userType=='business'" :isLocalUser="isLocalUser">
            <x-button v-if="!isLocalUser" @click.native="fellowThisWriter" :class="userData.follow?'hasFellow':''">
                <i class="iconfont icon-aixin"></i>{{userData.follow?'取消关注':"关注"}}</x-button>
            <x-button @click.native="gotoSendMsg" v-if="!isLocalUser">
                <i class="iconfont icon-feiji"></i>私信</x-button>
            <!-- <x-button v-if="!isLocalUser" @click.native="gotoSendOrientationTask">
                <i class="iconfont icon-xie"></i>发起任务</x-button> -->
            <a class="weui-btn" :href="'tel://'+userData.mobile" v-if="!isLocalUser">
                <x-button   @click.native="goTel">
                    <i class="iconfont icon-dianhua"></i>电话</x-button>
            </a>
        </div>
        <!-- 家长主页的按钮 -->
        <div class="btnBox businessBtn bgW" v-if="!(userData.type=='author'&&$store.state.userType=='business')">
            <x-button v-if="!isLocalUser" @click.native="fellowThisWriter" :class="userData.follow?'hasFellow':''">
                <i class="iconfont icon-aixin"></i>{{userData.follow?'取消关注':"关注"}}</x-button>
        </div>

    </div>
    <!-- 推荐人 -->
    <div class="bgW recommenderBox">
        <group>
            <cellNav :recommenderId="recommenderId" :link="recommenderLink" :leftTitle="leftTitle" :icon="recommenderIcon" :recommenderSrc="$store.state.imgUrl+recommenderSrc" :num="recommenderNum" :isMsg="isMsg"></cellNav>
        </group>
    </div>
    <!--工作方式-->
    <div class="eachBox">
        <p class="title">工作方式</p>
        <div class="content">
            <div class="eachHang">
                <p class="leftText">书本年级：</p>
                <p class="rightText">{{classNo}}</p>
            </div>
            <div class="eachHang">
                <p class="leftText">书本科目：</p>
                <p class="rightText">{{subject}}</p>
            </div>
            <div class="eachHang">
                <p class="leftText">参考费用：</p>
                <p class="rightText">
                    {{soleCost?soleCost+'/人时':''}}
                </p>
            </div>
            <div class="eachHang">
                <p class="leftText">上课方式：</p>
                <p class="rightText">{{coordination}}</p>
            </div>
            <div class="eachHang">
                <p class="leftText">上课区域：</p>
                <p class="rightText">{{area}}</p>
            </div>
        </div>
    </div>

    <!--他的任务-->
    <div class="eachBox">
        <p class="title flexTitle">
            <span>TA的任务（2018-7-1起的最近10次）</span>
            <router-link tag="span" class="right" :to="{path:'/myPostMission',query:{uid:writerId,showAllMsg:true}}">更多
                <x-icon type="ios-arrow-right" size="13"></x-icon>
            </router-link>
        </p>
        <div class="content" v-if="taskList.length==0?false:true" @click="toseeMissionDetail">
            <div class="peple flexSpace">
                <div class="left flexStart">
                    <img :src="$store.state.imgUrl+taskObj.user.imgurl" alt="">
                    <div class="desc">
                        <p class="name">{{taskObj.user==null?'':taskObj.user.nickname}}</p>
                        <!-- <p class="tag">
                            <span>实名
                                    <i class="iconfont icon-wenhao" v-if="taskObj.user.realAuth==2?false:true"></i>
                <i class="iconfont icon-gouxuan" v-if="taskObj.user.realAuth==2?true:false"></i><span>{{taskObj.user.realAuth==2?'已':"未"}}认证</span>
                            </span>
                            <span >学历
                                   <i class="iconfont icon-wenhao" v-if="taskObj.user.eduAuth==2?false:true"></i>
                <i class="iconfont icon-gouxuan" v-if="taskObj.user.eduAuth==2?true:false"></i><span>{{taskObj.user.eduAuth==2?'已':"未"}}认证</span>
                            </span>
                        </p> -->
                    </div>
                </div>
                <div class="right">
                    <!-- <p class="smallBtn">找家长</p>
                    <p class="button searchSS" v-if="taskObj.taskType=='2'?true:false">找家长</p>
                    <p class="button searchZZ" v-if="taskObj.taskType=='1'?true:false">找家教</p>
                    <p class="button searchSZ" v-if="taskObj.taskType=='3'?true:false">团家长找家教</p> -->
                    <p class="priceDesc">费用预算</p>
                    <p class="price">￥{{taskObj.fee}}/人时</p>
                </div>
            </div>
            <div class="otherDesc">
                <p class="flexSpace light">
                    <span>状态：{{taskObj.statusText}}</span>
                    <span>截止报名：{{taskObj.deadline.slice(0,11)}}</span>
                </p>
                <p class="flexSpace">
                    <span>{{taskObj.classNo}} / {{taskObj.subject}}</span>
                    <span>已报名：{{taskObj.applicationCount}} </span>
                </p>
                <p class="flexSpace">
                    <span>{{taskObj.coordination=='online'?'远程协作':taskObj.coordination=='busniess'?'家长拜访':'家教拜访'}}/ {{taskObj.area}}</span>
                    <span>发布日期：{{taskObj.createTime.slice(0,11)}}</span>
                </p>
            </div>

        </div>
        <p class="shifDesc" v-if="taskList.length==0?false:true">
            简述：{{taskObj.introduction}}
        </p>
    </div>

    <!--评价标签-->
    <div class="eachBox" v-if="userData.type=='author'">
        <p class="title">家长评价标签（2018-7-1起）</p>
        <div class="content">
            <p class="evaluateTag" v-for="item,index in otherTags">
                <span>{{item.tag}}</span>
            </p>
        </div>
    </div>
    <!--自我简介-->
    <div class="eachBox" v-if="userData.type=='author'">
        <p class="title">自我简述</p>
        <div class="content flexSpace">
            <p class="selfDesc">
                {{selfCon}}
            </p>
        </div>
    </div>
    <!--自我标签-->
    <div class="eachBox" v-if="userData.type=='author'">
        <p class="title">自我标签</p>
        <div class="content">
            <p class="evaluateTag" v-for="item,index in selfTag">
                <span>{{item.tag}}</span>
            </p>
        </div>
    </div>
    <!--家教经历-->
    <div class="eachBox" v-if="userData.type=='author'">
        <p class="title">家教经历</p>
        <div class="content">
            <p>{{experience}}</p>
        </div>
    </div>

    <!--背景信息-->
    <div class="eachBox" v-if="userData.type=='author'">
        <p class="title">背景信息</p>
        <div class="content">
            <p class="eachBgMsg flexStart">
                <span>实名认证</span>
                <i class="iconfont icon-wenhao" v-if="userData.realAuth==2?false:true"></i>
                <i class="iconfont icon-gouxuan" v-if="userData.realAuth==2?true:false"></i>
                <!-- <span>{{userData.realAuth==2?'已':"未"}}认证</span> -->
            </p>
            <p class="eachBgMsg flexStart" v-if="userData.type=='author'">
                <span>学历认证</span>
                <i class="iconfont icon-wenhao" v-if="userData.eduAuth==2?false:true"></i>
                <i class="iconfont icon-gouxuan" v-if="userData.eduAuth==2?true:false"></i>
                <!-- <span>{{userData.eduAuth==2?'已':"未"}}认证</span> -->
                <span v-if="userData.eduAuth==2?true:false">{{userData.eduCertificate.school}},{{userData.eduCertificate.degree}}</span>
            </p>
            <p class="eachBgMsg flexStart" v-if="userData.type=='author'">
                <span>家教资历</span><i class="iconfont icon-wenhao" v-if="userData.authorAuth==2?false:true"></i>
                <i class="iconfont icon-gouxuan" v-if="userData.authorAuth==2?true:false"></i>
                <!-- <span>{{userData.authorAuth==2?'已':"未"}}认证</span> -->
            </p>
        </div>
    </div>
</div>
</template>

<script>
import writers from '@/components/writer/writer'
import common from '@/assets/js/common'
import cellNav from '@/components/cellNav'
import {
    XButton,
    AlertModule,
    Group
} from 'vux'
export default {
    data() {
        return {
            isMsg: true,
            recommenderLink: '/writerDetail',
            recommenderNum: 0,
            hang2IsShow: true,
            authodShortName: '',
            workAge: '',
            userCount: '',
            leftTitle: 'TA的推荐人',
            userData: {},
            classNo: '',
            subject: '',
            selfCon: '',
            org: '',
            coordination: '',
            jointCost: '',
            area: '',
            classNo: '',
            writerId: this.$route.query.writerId,
            userType: '',
            uid: this.$store.state.uid,
            taskObj: {},
            taskList: [],
            circleObj: {},
            isFellow: false,
            soleCost: '',
            experience: '',
            achievement: "",
            gender: '',
            books: '',
            isLocalUser: false,
            userTags: [],
            selfTag: [],
            otherTags: [],
            circleList: [],
            isMissionDetail: true,
            userImg: '',
            recommenderIcon: 'icon-hezuo',
            recommenderId: '',
            recommenderSrc: ''

        }
    },
    // 监听路由参数改变，刷新页面
    watch: {
        '$route'(to, from) {
            if (to.query.writerId != from.query.writerId) {
                this.writerId = to.query.writerId;
                // 获取用户信息
                this.getWebUser(this.writerId);
                // 获取任务信息
                this.getMIssionlist()
                // 获取圈子信息
                // this.getCircleLoist();
                // alert(this.writerId)
                if (this.writerId == this.$store.state.uid) {
                    this.isLocalUser = true
                }
                // 获取标签列表
                // this.getTasgs(this.writerId)
                // 推荐人
                this.getMediator(this.writerId)
                // this.init()
            }
        }
    },

    created() {
        if (this.$route.query) {
            this.writerId = this.$route.query.writerId;
            // this.init();
        }
    },
    components: {
        writers,
        XButton,
        AlertModule,
        cellNav,
        Group
    },
    mounted() {
        // 获取用户信息
        this.getWebUser(this.writerId);
        // 获取任务信息
        this.getMIssionlist()
        // 获取圈子信息
        // this.getCircleLoist();
        // alert(this.writerId)
        if (this.writerId == this.$store.state.uid) {
            this.isLocalUser = true
        }
        // 获取标签列表
        // this.getTasgs(this.writerId)
        // 推荐人
        this.getMediator(this.writerId)

    },
    methods: {
        ...common,
        // 获取我的推荐人
        getMediator(uid) {
            var that = this;
            var baseUrl = this.$store.state.baseUrl;
            that
                .$http("get", baseUrl + "api/Mediator/List", {
                    uid: uid
                })
                .then(function (res) {
                    if (res.data.code != "00") {
                        AlertModule.show({
                            title: res.data.msg
                        });
                    } else {
                        if (res.data.data.myMediator.length > 0) {
                            //   that.myMediator = res.data.data.myMediator[0];
                            that.recommenderSrc = res.data.data.myMediator[0].imgurl;
                            that.recommenderId = res.data.data.myMediator[0].id;
                        }

                        // that.needMediator = res.data.data.needMediator;
                    }
                });
        },

        // 回主页
        goToIndex() {
            this.$router.push({
                path: '/index'
            })
        },
        // 发起定向任务
        gotoSendOrientationTask() {
            var that = this;
            that.$router.push({
                path: "/OrderOrientation",
                query: {
                    writerId: that.writerId
                }
            })
        },
        // 点击查看任务详情
        toseeMissionDetail() {
            var that = this;
            console.log(that.taskObj)
            that.$router.push({
                path: '/missionInAfterEvaluteBuss',
                query: {
                    id: that.taskObj.id,
                    showAllMsg: true
                }
            })
        },
        // 关注
        fellowThisWriter() {
            var that = this;
            var postData = {
                uid: that.uid, //当前用户id
                followingUid: that.writerId //被关注人的id
            }
            that.$http('post', that.$store.state.baseUrl + 'api/UserFollowing', postData).then(function (res) {
                if (res.data.code != '00') {
                    AlertModule.show({
                        title: res.data.msg
                    })
                } else {
                    AlertModule.show({
                        title: "操作成功！",
                        onHide() {
                            that.getWebUser(that.writerId);
                        }
                    })
                    that.isFellow = true
                }
            })
        },
        // 私信
        gotoSendMsg() {
            var that = this;
            that.$router.push({
                path: '/privateMsg',
                query: {
                    writerId: that.writerId
                }
            })
        },
        // 获取圈子列表
        getCircleLoist() {
            var that = this;
            var baseUrl = this.$store.state.baseUrl;
            that.$http('get', baseUrl + 'api/Circle/List', {
                loginUid: that.uid,
                uid: that.writerId
            }).then(function (res) {
                var result = res.data.data;
                that.circleList = res.data.data;
                if (result.length != 0) {
                    for (var i in result) {
                        if (result[i].imgurls != '') {
                            if (result[i].imgurls.indexOf(',') == -1) {
                                // 没有逗号，只有一条数据
                                var Arr = []
                                var obj = {
                                    src: that.$store.state.imgUrl + result[i].imgurls
                                }
                                Arr.push(obj)
                                result[i].imgurls = Arr;
                            } else {
                                result[i].imgurls = result[i].imgurls.split(',')
                                var arr2 = []
                                for (var k in result[i].imgurls) {
                                    var obj = {};
                                    obj.src = that.$store.state.imgUrl + result[i].imgurls[k];
                                    arr2.push(obj)
                                }
                                result[i].imgurls = arr2;
                            }
                        }
                    }
                    that.circleObj = result[0]
                }
                console.log('圈子')
                console.log(result)
                // for (var i in result) {
                //     if (result[i].imgurls != '') {
                //         //什么都没有
                //         if (result[i].imgurls.indexOf(',') == -1) {
                //             // 没有逗号，只有一条数据
                //             var Arr = []
                //             var obj = {
                //                 src: that.$store.state.imgUrl + result[i].imgurls
                //             }
                //             Arr.push(obj)
                //             result[i].imgurls = Arr;
                //         } else {
                //             result[i].imgurls = result[i].imgurls.split(',')
                //             var arr2 = []
                //             for (var k in result[i].imgurls) {
                //                 var obj = {};
                //                 obj.src = that.$store.state.imgUrl + result[i].imgurls[k];
                //                 arr2.push(obj)
                //             }
                //             result[i].imgurls = arr2;
                //         }
                //     }
                // }

            })
        },
        // 获取任务列表
        getMIssionlist(status) {
            var that = this;
            // 对家长状态(1-报名中,2-已选择,3-已评价,4-已失效,5-已取消),, 对家教状态(1-已报名,2-未选中,3-待评价,4-已完成)) ,
            if (that.$store.state.userType == 'author') {
                // 家教获取订单列表
                that.$http('get', that.$store.state.baseUrl + 'api/Order/apply?uid=' + that.$route.query.writerId).then(function (res) {
                    res.data.data.forEach((item, index) => {
                        switch (item.status) {
                            case 1:
                                item.statusText = '已报名'
                                break;
                            case 2:
                                item.statusText = '未选中'
                                break;
                            case 3:
                                item.statusText = '待评价'
                                break;
                            case 4:
                                item.statusText = '已结束'
                                break;
                        }
                    })
                    if (res.data.data.length > 0) {
                        that.taskList = res.data.data
                        that.taskObj = res.data.data[0];
                    }

                })
            } else {
                // 家长获取发布的订单
                that.$http('get', that.$store.state.baseUrl + 'api/Order/List?uid=' + that.$route.query.writerId).then(function (res) {
                    res.data.data.forEach((item, index) => {
                        switch (item.status) {
                            case 1:
                                item.statusText = '报名中'
                                break;
                            case 2:
                                item.statusText = '待评价'
                                break;
                            case 3:
                                item.statusText = '可追评'
                                break;
                            case 4:
                                item.statusText = '已失效'
                                break;
                            case 5:
                                item.statusText = '已失效'
                                break;
                        }
                    })
                    if (res.data.data.length > 0) {
                        that.taskList = res.data.data
                        that.taskObj = res.data.data[0];
                    }

                })
            }

            //  that.postData = {
            //         uid: that.writerId
            // }

            // that.postData.status = status;
            // console.log(that.postData)
            // that.$http('get', that.$store.state.baseUrl + 'api/Order/correlation-task', that.postData).then(function (res) {
            //     // that.postList = res.data.data;
            //     if (res.data.code == '00') {
            //         var result = res.data.data;
            //         // console.log(result.webUser.type)
            //         for (var i in result) {
            //             var arr = result[i].fee.split('-')
            //             result[i].priceMin = arr[0];
            //             result[i].priceMax = arr[1];

            //             if (result[i].taskType == 1) {
            //                 result[i].borderColor = 'zz'
            //             } else if (result[i].taskType == 2) {
            //                 result[i].borderColor = 'ss'
            //             } else {
            //                 result[i].borderColor = 'sz'
            //             }
            //         }
            //         // console.log('我的任务')
            //         // console.log(res.data.data)
            //         that.taskList = res.data.data
            //         // that.postList = res.data.data;
            //         if( res.data.data.length>0){
            //              that.taskObj = res.data.data[0];
            //         }

            //         switch (that.taskObj.status) {
            //             case 1:
            //                 that.taskObj.status = '发布中'
            //                 break;
            //             case 2:
            //                 that.taskObj.status = '已选定服务人'
            //                 break;
            //             case 3:
            //                 that.taskObj.status = '双方已确认代付款'
            //                 break;
            //             case 4:
            //                 that.taskObj.status = '已结束'
            //                 break;
            //             case 6:
            //                 that.taskObj.status = '已取消'
            //                 break;
            //             case 7:
            //                 that.taskObj.status = '已有人报名'
            //                 break;
            //             case 8:
            //                 that.taskObj.status = '执行中'
            //                 break;
            //             case 88:
            //                 that.taskObj.status = '取消中'
            //                 break;
            //             case 99:
            //                 that.taskObj.status = '已失败'
            //                 break;
            //         }
            //     } else {}
            // })
        },
    }
}
</script>

<style>
#writerDetail{
    padding-bottom: 100px;
}
#writerDetail .reacResult {
    margin-top: 0;
}

#writerDetail .priceDesc {
    color: #707070;
    font-size: 12px;
}

#writerDetail .topBox {
    border-bottom: 10px solid #f5f5f5;
    padding-bottom: 15px;
}

#writerDetail .btnBox {
    padding-bottom: 10px;
    display: flex;
    justify-content: space-between;
    padding-left: 7px;
    padding-right: 7px;
    align-items: center;
}

#writerDetail .btnBox .weui-btn {
    width: 100px !important;
    height: 35px !important;
    font-size: 14px;
}

#writerDetail .btnBox .weui-btn i {
    margin-right: 7px;
}

#writerDetail .eachBox {
    border-bottom: 10px solid #f5f5f5;
    background: #fff;
}

#writerDetail .eachBox p.title {
    padding: 11px 14px;
    font-size: 12px;
    color: #3375C5;
    border-bottom: 1px solid #CECECE;
}

#writerDetail .content {
    padding: 13px 11px;
    color: #242424;
    font-size: 12px;
}

#writerDetail .content .eachHang {
    display: flex;
    justify-content: flex-start;
}

#writerDetail .content .eachHang .leftText {
    min-width: 70px;
}

#writerDetail .content .eachHang {
    margin-bottom: 8px;
}

#writerDetail .eachBox.circle2 .content {
    display: flex;
    /* justify-content: flex-start; */
    align-items: center;
    color: #242424;
}

#writerDetail .eachBox.circle2 .content img {
    width: 79px;
    height: 79px;
    margin-right: 5px;

}

#writerDetail .eachBox .content .peple img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 11px;
    border: 1px solid #ccc;
    margin-bottom: 10px;
}

#writerDetail .eachBox .content .peple .name {
    font-weight: bold;
    color: #646464;
    font-size: 14px;
    margin-bottom: 10px;
}

#writerDetail .eachBox .content .peple .tag {
    color: #999;
}

#writerDetail .eachBox .content .peple .tag i {
    color: #3375C5;
    margin-left: 4px;
}

#writerDetail .eachBox .content .peple {
    /* padding-bottom: 12px; */
    border-bottom: 1px solid #cecece;
}

.recommenderBox {
    margin-bottom: 10px;
    padding: 0 10px;
}

#writerDetail .eachBox .content .peple .right .button {
    font-size: 14px;
    padding: 1px 7px 1px 12px;
    border-radius: 5px;
    margin-bottom: 8px;
}

#writerDetail .eachBox .content .peple .right .button.searchSS {
    color: #2EA200;
    border: 1px solid #2EA200;
}

#writerDetail .eachBox .content .peple .right .button.searchZZ {
    color: #3375C5;
    border: 1px solid #3375C5;
}

#writerDetail .eachBox .content .peple .right .button.searchSZ {
    color: #FEAB29;
    border: 1px solid #FEAB29;
}

#writerDetail .eachBox .content .peple .right .price {
    color: #FF3636;
    font-weight: bold;
}

#writerDetail .eachBox .flexTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

#writerDetail .eachBox .flexTitle span.right {
    color: #242424;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

#writerDetail .eachBox .otherDesc {
    color: #999;
    font-size: 12px;
    padding-top: 13px;
}

#writerDetail .eachBox .otherDesc p {
    line-height: 21px;
}

#writerDetail .eachBox .otherDesc .light {
    color: #3375C5;
}

#writerDetail .eachBox .shifDesc {
    color: #999;
    font-size: 12px;
    padding: 11px 14px;
    background: #f5f5f5;
    border-bottom: 4px solid #2EA200;
    width: 100%;
}

#writerDetail .eachBox .evaluateTag {
    /*padding: 9px 13px;*/
    display: inline-block;
    margin-right: 5px;
    margin-bottom: 14px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    width: 108px;
    color: #868686;
    font-size: 14px;
    border: 1px solid #848484;
}

#writerDetail .eachBox .evaluateTag .num {
    color: #3375C5;
    margin-left: 10px;
}

#writerDetail .eachBox .content .selfDesc {
    color: #242424;
}

#writerDetail .eachBgMsg {
    margin-bottom: 15px;
}

#writerDetail .eachBgMsg .iconfont {
    color: #3375C5;
    margin-left: 7px;
    margin-right: 10px;
}

#writerDetail .btnBox .weui-btn.hasFellow {
    background: #ccc !important;
    border-color: #ccc !important;
}

#writerDetail .btnBox .hasFellow.weui-btn:after {
    display: none;
}

#writerDetail .btnBox.businessBtn .weui-btn {
    width: 95% !important;
}

#writerDetail .fixBtn span {
    font-size: 16px !important;
}
</style>
