<template>
<div id="myPostMission">
    <!-- 顶部TAB -->
    <div class="topTab flexSpace bgW">
        <div :class="item.active==true?'item active':'item'" v-for="item,index in tabList" @click="chooseTab(index)">{{item.name}}</div>
    </div>
    <!-- 任务列表 -->
    <div class="reacResult" id="resultPeoples">
        <router-link tag="div" :class="'eachPeople bgW '+item.borderColor" v-for="item,index of postList" :to="{path:'/missionDetail',query:{id:item.id,isMyTask:true}}">
            <div class="titleBox flexSpace padding11">
                <div class="left flexStart">
                    <img :src="imgurl==null?'':item.webUser.imgurl" class="userImg" alt>
                    <div>
                        <p class="name">{{item.webUser.nickname}}</p>
                        <p class="options flexSpace">
                            <span class="option flexStart">
                  实名
                  <i class="iconfont icon-gouxuan"></i>
                </span>
                            <span class="option">
                  实名
                  <i class="iconfont icon-gouxuan"></i>
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
                    <span class="eachItem textAright">截止报名：{{item.deadline.substr(0,10)}}</span>
                </p>
                <p class="hang flexSpace">
                    <span
              class="eachItem"
            >{{item.classNo}}/{{item.category}}/{{item.priceType=='1'?'1对1':'1对多'}}</span>
                    <span class="eachItem textAright">已报名：{{item.category}}</span>
                    <span class="eachItem">组班方式：{{item.taskType}}</span>
                </p>
                <p class="hang flexStart">
                    <span class="eachItem">{{item.coordination}}/{{item.area}}</span>
                    <span class="eachItem add textAright">发布日期：{{item.createTime.substr(0,10)}}</span>
                </p>
            </div>
            <div class="otherMsg flexSpace padding11">
                <p class="left">
                    <span>截至报名：{{item.deadline.substr(0,10)}}</span>
                    <span>已报名：{{item.apply=='false'?"否":"是"}}</span>
                </p>
                <p class="right">
                    <button class="submitBtn">报名</button>
                </p>
                <p class="hang">
                    <span>简述：{{item.introduction}}</span>
                </p>
            </div>
        </router-link>
    </div>
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
                    id: 0
                },
                {
                    name: "待确认",
                    active: false,
                    id: 7
                },
                {
                    name: "执行中",
                    active: false,
                    id: 3
                },
                {
                    name: "已结束",
                    active: false,
                    id: 4
                }
            ]
        };
    },
    mounted() {
        this.getMIssionlist();
    },
    methods: {
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
            that.postData.status = status;

            that
                .$http(
                    "get",
                    that.$store.state.baseUrl + "api/Order/List",
                    that.postData
                )
                .then(function (res) {
                    // that.postList = res.data.data;
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
                             console.log("+=="+!result[i].webUser)
                         
                        }
                   
                    } else {
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
