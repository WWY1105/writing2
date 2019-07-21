<template>
<div id="myPostMission">
    <!-- 我报名的任务 -->
    <!-- 顶部TAB -->
    <div class="topTab flexSpace bgW">
        <div :class="item.active==true?'item active':'item'" v-for="item,index in tabList" @click="chooseTab(index)">{{item.name}}</div>
    </div>
    <!-- 任务列表 -->
    <div class="reacResult" id="resultPeoples">
        <div :class="'eachPeople bgW '+item.borderColor" v-for="item,index of postList" @click="toSeemyPostMissionDetail(index)">
            <div class="titleBox flexSpace padding11">
                <div class="left flexStart">
                    <img :src="item.webUser!=null?$store.state.imgUrl+item.webUser.imgurl:''" class="userImg" alt>
                    <div>
                        <p class="name">{{item.webUser.nickname}}</p>
                        <p class="options flexSpace">
                            <span class="option flexStart">
                                 实名
                  <i class="iconfont icon-wenhao" v-if="item.webUser?item.webUser.realAuth!=2?true:false:''"></i>
                  <i class="iconfont icon-gouxuan" v-if="item.webUser?item.webUser.realAuth!=2?false:true:''"></i>
                  <!-- 实名
                  <i class="iconfont icon-gouxuan"></i> -->
                </span>
                            <span class="option">
                  <!-- 实名
                  <i class="iconfont icon-gouxuan"></i> -->
                    学历
                  <i class="iconfont icon-wenhao" v-if="item.webUser?item.webUser.eduAuth!=2?true:false:''"></i>
                  <i class="iconfont icon-gouxuan" v-if="item.webUser?item.webUser.eduAuth!=2?false:true:''"></i>
                </span>
                        </p>
                    </div>
                </div>
                <div class="right flexEnd">
                    <p class="button searchSS" v-if="item.taskType=='2'?true:false">找家长</p>
                    <p class="button searchZZ" v-if="item.taskType=='1'?true:false">找家教</p>
                    <p class="button searchSZ" v-if="item.taskType=='3'?true:false">团家长找家教</p>
                    <p class="price">￥ {{item.priceMin}} - ￥{{item.priceMax}}</p>
                </div>
            </div>
            <div class="details padding11">
                <p class="hang flexSpace mainText">
                    <span class="eachItem">状态：{{item.status}}</span>
                    <span class="eachItem textAright">截止报名：{{!item.deadline?'':item.deadline.substr(0,10)}}</span>
                </p>
                <p class="hang flexSpace">
                    <span
              class="eachItem"
            >{{item.classNo}}/{{item.category}}/{{item.priceType=='1'?'1对1':'1对多'}}</span>
                    <span class="eachItem textAright">已报名：{{item.applicationCount}}</span>
                    <!-- <span class="eachItem">组班方式：{{item.taskType}}</span> -->
                </p>
                <p class="hang flexStart">
                    <span class="eachItem">{{item.coordination=='online'?'远程协作':item.coordination=='busniess'?'家长拜访':'家教拜访'}}/{{item.area}}</span>
                    <span class="eachItem add textAright">发布日期：{{!item.createTime?'':item.createTime.substr(0,10)}}</span>
                </p>
            </div>
            <div class="otherMsg flexSpace padding11">

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
import common from "@/assets/js/common";
import {
    AlertModule
} from 'vux';
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
                    id: 1
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
            isCancel: false
        };
    },
    components: {
        AlertModule
    },
    mounted() {
        // this.getMIssionlist(0);
        this.chooseTab(0)
    },
    methods: {
        ...common,
        // 查看任务详情
        toSeemyPostMissionDetail(i) {
            var that = this;
            var id = that.postList[i].id;
            var status = that.postList[i].status;
            var autherId = that.postList[i].authorId;
            var isAuthor = false;;
            if (autherId == that.$store.state.uid) {
                isAuthor = true;
            }
            //  alert(status);
            var tabId;
            for (var i in that.tabList) {
                if (that.tabList[i].active) {
                    tabId = that.tabList[i].id;
                }
            }
            //  alert(status)
            //  alert(isAuthor)
            // 如果是执行中的任务
            if (status == '执行中' || status == '双方已确认代付款') {
                if (isAuthor) {
                    // 我执行的任务，所以我是家教
                    // 家教版正在执行的任务
                    that.$router.push({
                        path: "/missionInExecutionAuth",
                        query: {
                            id: id
                        }
                    });
                } else {
                    that.$http('get', that.$store.state.baseUrl + 'api/Order/user-apply?taskId=' + id + "&uid=" + that.$store.state.uid).then(function (res) {
                        // console.log(res.data.data);
                        if (res.data.code != '00') {
                            AlertModule.show({
                                title: res.data.msg
                            })
                        } else {
                            // alert(res.data)
                            if (!res.data.data) {
                                AlertModule.show({
                                    title: "抱歉，任务已在执行中，而您未被选中"
                                })
                            } else {
                                if (res.data.data.pay == '2') {
                                    that.$router.push({
                                        path: "/replyDetailsToPay",
                                        query: {
                                            taskId: id
                                            // doing: true
                                        }
                                    });
                                } else {
                                    that.$router.push({
                                        path: "/missionInExecutionBuss",
                                        query: {
                                            id: id
                                        }
                                    });
                                }

                            }
                            //是否确认：：：：：1:待确认;2已确认;3已拒绝
                            // var feeConfirm = res.data.data.feeConfirm;
                            // if (feeConfirm == '2') {
                            //     that.isConfirm = true;
                            // }
                            // 是否支付
                            // pay (integer, optional): 支付状态(1-不需要支付,2-待支付,3-已支付,4-已拒绝) ,
                            // if (res.data.data.pay == 2) {
                            //     that.$router.push({
                            //         path: "/missionDetail",
                            //         query: {
                            //             id: id,
                            //             isMyTask: false
                            //         }
                            //     });
                            // } else if (res.data.data.pay == 3) {
                            //     that.$router.push({
                            //         path: "/missionInExecutionBuss",
                            //         query: {
                            //             id: id
                            //         }
                            //     });
                            // }
                        }
                    })

                }

            } else if (status == "待确认") {
                this.$router.push({
                    path: "/toConfirmMission",
                    query: {
                        taskId: id,
                        isMyTask: false
                        // doing: true
                    }
                });
            } else if (status == '已选定服务人' || status == '已有人报名') {
                that.$router.push({
                    path: "/missionDetail",
                    query: {
                        id: id,
                        isMyTask: false
                    }
                });
            } else if (status == '双方已确认代付款') {
                if (isAuthor) {
                    that.$router.push({
                        path: "/missionInExecutionAuth",
                        query: {
                            id: id
                        }
                    });
                } else {
                    this.$router.push({
                        path: "/replyDetailsToPay",
                        query: {
                            taskId: id
                            // doing: true
                        }
                    });
                }
            } else {
                if (isAuthor) {
                    that.$router.push({
                        path: "/missionInExecutionAuth",
                        query: {
                            id: id
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
            that.postData.uid = this.$store.state.uid;
            // if(that.status){
            that.postData.status = status;
            // }
            console.log(that.postData);
            that
                .$http(
                    "get",
                    that.$store.state.baseUrl + "api/Order/MyApply/Order",
                    that.postData
                )
                .then(function (res) {
                    // that.postList = res.data.data;
                    if (res.data.code == "00") {
                        var result = res.data.data;

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
                            if (result[i].webUser != null) {
                                let s = that.shortName(
                                    result[i].webUser.authorInfo.classParent
                                );
                                let c = that.shortName(result[i].webUser.authorInfo.subject);
                                result[i].shortClassName = s;
                                result[i].shortCategory = c;
                            }
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

                        that.postList = result;
                        console.log("我报名的任务");
                        console.log(res.data.data);
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
    padding: 1px 7px 1px 7px;
    border-radius: 5px;
    margin-bottom: 8px;
}

.reacResult p.name {
    word-break: keep-all;
    max-width: 140px;
    text-overflow: ellipsis;
    overflow: hidden;
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
</style>
