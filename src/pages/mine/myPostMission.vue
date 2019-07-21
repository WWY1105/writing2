<template>
<div id="myPostMission">
    <!-- 顶部TAB -->
    <div class="topTab flexSpace bgW" v-if="!showAllMsg">
        <div :class="item.active==true?'item active':'item'" v-for="item,index in tabList" @click="chooseTab(index)">{{item.name}}</div>
    </div>
    <!-- 任务列表 -->
    <div class="reacResult" id="resultPeoples">
        <div :class="'eachPeople bgW '+item.borderColor" v-for="item,index of postList" @click="toSeemyPostMissionDetail(index)">
            <div class="titleBox flexSpace padding11">
                <div class="left flexStart">
                    <img :src="item.webUser?$store.state.imgUrl+item.webUser.imgurl:''" class="userImg" alt>
                    <div>
                        <p class="name">{{item.webUser?item.webUser.nickname:''}}</p>
                        <p class="options flexStart">
                            <span class="option flexStart">
                  实名
                  <i class="iconfont icon-wenhao" v-if="item.webUser?item.webUser.realAuth!=2?true:false:''"></i>
                  <i class="iconfont icon-gouxuan" v-if="item.webUser?item.webUser.realAuth!=2?false:true:''"></i>
                </span>
                            <span class="option">
                  学历
                  <i class="iconfont icon-wenhao" v-if="item.eduAuth!=2?true:false"></i>
                  <i class="iconfont icon-gouxuan" v-if="item.eduAuth!=2?false:true"></i>
                </span>
                        </p>
                    </div>
                </div>
                <div class="right flexEnd">
                    <p class="button searchSS" v-if="item.taskType=='2'?true:false">找家长</p>
                    <p class="button searchZZ" v-if="item.taskType=='1'?true:false">找家教</p>
                    <p class="button searchSZ" v-if="item.taskType=='3'?true:false">团家长找家教</p>
                    <!-- <p class="price">￥ {{item.priceMin}} - ￥{{item.priceMax}}</p>
                     -->
                     <p class="price">{{item.supplement?'￥'+item.amount:'￥'+item.priceMin+'-￥'+item.priceMax}}</p>
                     
                </div>
            </div>
            <div class="details padding11">
                <p class="hang flexSpace mainText">
                    <span class="eachItem">状态：{{item.supplement?"补充登记":item.status}}</span>
                    <span class="eachItem textAright">截止报名：{{item.deadline?item.deadline.substr(0,10):''}}</span>
                </p>
                <p class="hang flexSpace">
                    <span
              class="eachItem"
            >{{item.classNo?item.classNo:''}}/{{item.category?item.category:''}}/{{item.priceType=='1'?'1对1':'1对多'}}</span>
                    <span class="eachItem textAright">已报名：{{item.applicationCount}}</span>
                    <!-- <span class="eachItem">组班方式：{{item.taskType}}</span> -->
                </p>
                <p class="hang flexStart">
                    <span class="eachItem">{{item.coordination}}/{{item.area}}</span>
                    <span class="eachItem add textAright">发布日期：{{item.createTime?item.createTime.substr(0,10):''}}</span>
                </p>
            </div>
            <div class="otherMsg flexSpace padding11">
                <!-- <p class="left">
                    <span>截至报名：{{item.deadline.substr(0,10)}}</span>
                    <span>已报名：{{item.apply=='false'?"否":"是"}}</span>
                </p>
                <p class="right">
                    <button class="submitBtn">报名</button>
          </p>-->
                <p class="hang">
                    <span>简述：{{item.introduction}}</span>
                </p>
            </div>
        </div>
    </div>
    <!-- 任务列表 end-->
</div>
</template>

<script>
export default {
    data() {
        return {
            //任务列表
            postList: [],
            postData: {},
            tabList: [{
                    name: "全部",
                    active: true,
                    id: ''
                },
                {
                    name: "待确认",
                    active: false,
                    id: 7
                },
                {
                    name: "执行中",
                    active: false,
                    id: 8
                },
                {
                    name: "已结束",
                    active: false,
                    id: 4
                }
            ],
            uid: this.$route.query.uid,
            isCancel: false,
            userData: {},
            showAllMsg: false
        };
    },
    mounted() {

        this.getUser(this.$store.state.uid);
        //  alert(this.$route.query.showAllMsg)
        if (this.$route.query.showAllMsg) {
            this.showAllMsg = this.$route.query.showAllMsg;
        }
        this.getMIssionlist();
    },
    methods: {
        getUser(uid) {
            var that = this;
            var baseUrl = that.$store.state.baseUrl;
            that.$http('get', baseUrl + 'api/WebUser/' + uid).then(function (res) {
                that.userData = res.data.data;
            })

        },
        // 查看任务详情
        toSeemyPostMissionDetail(i) {
            // alert(this.showAllMsg)

            var id = this.postList[i].id;
            var taskStatus = this.postList[i].status;
            var type = this.userData.type;
            var status = this.postList[i].status;

            var autherId = this.postList[i].authorId;
            var isAuthor = false;;
            if (autherId == this.$store.state.uid) {
                isAuthor = true;
            }
            if (this.showAllMsg) {
                // missionInAfterEvaluteBuss
                this.$router.push({
                    path: '/missionInAfterEvaluteBuss',
                    query: {
                        keepActive: true,
                        id: id,
                        showAllMsg:this.showAllMsg
                    }
                })
                return false;
            }
            // alert(status)
            // alert(isAuthor)
            // 如果是执行中的任务
            if (status == '发布中') {
                this.$router.push({
                    path: "/missionDetail",
                    query: {
                        id: id
                    }
                });
            } else if (status == '执行中' || status == '取消中') {
                if (isAuthor) {
                    // 我执行的任务，所以我是家教
                    // 家教版正在执行的任务
                    this.$router.push({
                        path: "/missionInExecutionAuth",
                        query: {
                            id: id
                        }
                    });
                } else {
                    // 我是家长
                    if (this.postList[i].payTime == null) {
                        this.$router.push({
                            path: "/missionDetail",
                            query: {
                                id: id,
                                isMyTask: true
                            }
                        });
                    } else {
                        this.$router.push({
                            path: "/missionInExecutionBuss",
                            query: {
                                id: id
                            }
                        });
                    }

                }

            } else if (status == '双方已确认代付款') {
                // 我是家教
                if (isAuthor) {
                    this.$router.push({
                        path: "/missionInExecutionAuth",
                        query: {
                            id: id,
                            isCancel: true
                        }
                    });
                } else {
                    this.$router.push({
                        path: '/replyDetailsToPay',
                        query: {
                            taskId: id
                        }
                    })
                }
            } else if (status == "待确认") {
                this.$router.push({
                    path: "/toConfirmMission",
                    query: {
                        taskId: id,
                        isMyTask: true
                        // doing: true
                    }
                });
            } else if (status == '已选定服务人' || status == '已有人报名') {
                this.$router.push({
                    path: "/missionDetail",
                    query: {
                        id: id,
                        isMyTask: false
                    }
                });
            } else {
                this.$router.push({
                    path: "/missionInExecutionBuss",
                    query: {
                        id: id,
                        isCancel: true
                    }
                });
            }

        },
        // 点击tab
        chooseTab(index) {
            for (let i in this.tabList) {
                this.tabList[i].active = false;
            }
            this.tabList[index].active = true;
            var status = this.tabList[index].id;
            this.getMIssionlist(status);
        },
        // 获取任务列表
        getMIssionlist(status) {
            var that = this;
            var postUrl = '';
            // alert(that.showAllMsg)
            if (that.showAllMsg) {
                // 用户主页过来的所有任务
                postUrl = "api/Order/correlation-task"
                that.postData.uid = that.uid;
                // that.postData.supplement = true;
                that.postData.aduitStatus='2'
            } else {
                postUrl = "api/Order/List"
                that.postData.uid = that.uid;
                that.postData.status = status;
                that.postData.supplement = false;
            }

            console.log(that.postData);
            that
                .$http(
                    "get",
                    that.$store.state.baseUrl + postUrl,
                    that.postData
                )
                .then(function (res) {
                    that.postList = res.data.data;
                    if (res.data.code == "00") {
                        var result = res.data.data;
                        // console.log(result.webUser.type)
                        for (var i in result) {
                            var arr = result[i].fee.split("-");
                            result[i].priceMin = arr[0];
                            result[i].priceMax = arr[1];

                            if (result[i].taskType == 1) {
                                result[i].borderColor = "zz";
                            } else if (result[i].taskType == 2) {
                                result[i].borderColor = "ss";
                            } else {
                                result[i].borderColor = "sz";
                            }
                            // =====================
                            switch (result[i].status) {
                                case 1:
                                    result[i].status = '发布中'
                                    break;
                                case 2:
                                    result[i].status = '已选定服务人'
                                    break;
                                case 3:
                                    result[i].status = '双方已确认代付款'
                                    break;
                                case 4:
                                    that.isCancel = true;
                                    result[i].status = '已结束'
                                    break;
                                case 6:
                                    result[i].status = '已取消'
                                    break;
                                case 7:
                                    result[i].status = '已有人报名'
                                    break;
                                case 8:
                                    result[i].status = '执行中'
                                    break;
                                case 88:
                                    result[i].status = '取消中'
                                    break;
                                case 99:
                                    result[i].status = '已失败'
                                    break;
                            }
                        }

                        that.postList = res.data.data;
                    } else {
                        // AlertModule.show({
                        //   title: res.data.msg
                        // })
                    }
                });
        }
    }
};
</script>

<style scoped>
#myPostMission {
    background: #f5f5f5;
    padding-bottom: 60px;
}

#myPostMission .topTab {
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    padding-right: 20px;
    margin-bottom: 10px;
}

#myPostMission .topTab .item {
    font-size: 15px;
    color: #636363;
    padding-left: 10px;
    padding-right: 10px;
}

#myPostMission .topTab .item.active {
    color: #3375c5;
    border-bottom: 2px solid #3375c5;
}

.topBox {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #cecece;
    background: #fff;
}

.line {
    width: 1px;
    height: 28px;
    background: #cecece;
    display: inline-block;
}

.topBox .eachBtn {
    display: flex;
    padding-left: 6px;
    padding-right: 6px;
}

.topBox .eachBtn i {
    padding-left: 6px;
    color: #3375c5;
}

.topBox .eachBtn.shortOne {
    padding-left: 28px;
    padding-right: 22px;
}

.topBox .eachBtn.lastItem {
    background: #3375c5;
    color: #fff;
    font-weight: bold;
    height: 40px;
}

.topBox .eachBtn.lastItem i {
    color: #fff;
}

#resultPeoples {
    background: #f5f5f5;
}

.eachPeople {
    /* padding: 11px; */
    /*padding-bottom: 0;*/
    /*margin-top: 10px;*/
    margin-bottom: 10px;
}

.eachPeople.ss {
    border-bottom: 4px solid #2ea200;
}

.eachPeople.zz {
    border-bottom: 4px solid #3375c5;
}

.eachPeople.sz {
    border-bottom: 4px solid #feab29;
}

.reacResult .right .button {
    font-size: 14px;
    padding: 1px 7px 1px 12px;
    border-radius: 5px;
    margin-bottom: 8px;
}

.reacResult .right .button.searchSS {
    color: #2ea200;
    border: 1px solid #2ea200;
}

.reacResult .right .button.searchZZ {
    color: #3375c5;
    border: 1px solid #3375c5;
}

.reacResult .right .button.searchSZ {
    color: #feab29;
    border: 1px solid #feab29;
    word-break: keep-all;
}

.eachPeople .otherMsg {
    padding: 11px 11px 14px 11px;
    color: #999999;
    font-size: 12px;
    background: #f5f5f5;
}

.padding11 {
    padding: 11px;
}

.eachPeople .submitBtn {
    width: 60px;
    height: 21px;
    background: #3375c5;
    color: #fff;
    border-radius: 5px;
    font-weight: bold;
    border: none;
}

#resultPeoples.reacResult .details {
    display: block;
    color: #707070;
    background: #fff;
    padding: 14px 17px;
}

#resultPeoples.reacResult .titleBox {
    margin-bottom: 0;
    border-bottom: 1px solid #cecece;
}

#resultPeoples.reacResult .hang {
    width: 100%;
    text-align: left;
    margin-bottom: 7px;
}

#resultPeoples.reacResult span.eachItem {
    width: 50%;
    display: inline-block;
}

#resultPeoples.reacResult span.eachItem.add {
    width: 66%;
}

.smalltitle {
    color: #242424;
    font-size: 14px;
    padding: 10px 16px;
}

.weui-cell {
    /* padding: 10px 16px; */
    height: 44px;
}

.popBtnBox,
.vux-popup-dialog {
    background: #fff;
    z-index: 9999999999999999999999;
}

.popBtnBox .weui-btn {
    width: 100% !important;
    margin-bottom: 13px;
}

#myPostMission .priceBox {
    padding: 10px 16px;
    /*background: #f5f5f5;*/
    border-bottom: 1px solid #d9d9d9;
}

#myPostMission .priceBox span.title {
    font-size: 14px;
    color: #242424;
}

#myPostMission .vux-x-textarea.weui-cell {
    padding: 0 15px;
    font-size: 14px;
    color: #242424;
}

#myPostMission .priceBox input {
    width: 80px;
    height: 30px;
    border: 1px solid #eee;
    border-radius: 5px;
    background: #fff;
    padding: 5px;
}

#myPostMission .vux-cell-box.areaBox {
    padding: 5px 0px;
    border-bottom: 1px solid #d9d9d9;
}

.reacResult p.name {
    /* max-width: 30%; */
    text-overflow: ellipsis;
}
</style>
