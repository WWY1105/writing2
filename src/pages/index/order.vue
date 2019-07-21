<template>
<div id="Order">
    <!-- 任务列表 -->
    <div class="reacResult" id="resultPeoples">
        <div :class="'eachPeople bgW '+item.borderColor" v-for="item,index of postList" @click="toSeeOrderDetail(index)">
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
                    
                     <p class="price">{{'￥'+item.priceMin+'-￥'+item.priceMax}}</p>
                     
                </div>
            </div>
            <div class="details padding11">
                <p class="hang flexSpace mainText">
                    <span class="eachItem">状态：{{item.status}}</span>
                    <span class="eachItem textAright">截止报名：{{item.deadline?item.deadline.substr(0,10):''}}</span>
                </p>
                <p class="hang flexSpace">
                    <span
              class="eachItem"
            >{{item.classNo?item.classNo:''}}/{{item.category?item.category:''}}</span>
                    <span class="eachItem textAright">已报名：{{item.applicationCount}}</span>
                    <!-- <span class="eachItem">组班方式：{{item.taskType}}</span> -->
                </p>
                <p class="hang flexStart">
                    <span class="eachItem">{{item.coordination}}/{{item.area}}</span>
                    <span class="eachItem add textAright">发布日期：{{item.createTime?item.createTime.substr(0,10):''}}</span>
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
export default {
    data() {
        return {
            //任务列表
            postList: [],
            postData: {},
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
        toSeeOrderDetail(i) {
            var id = this.postList[i].id;
            var taskStatus = this.postList[i].status;
            var type = this.userData.type;
            var status = this.postList[i].status;

            var autherId = this.postList[i].authorId;
            var isAuthor = false;;
            if (autherId == this.$store.state.uid) {
                isAuthor = true;
            }
           
        },
        // 获取任务列表
        getMIssionlist(){
            let that=this;
            that.$http('get', that.$store.state.baseUrl + 'api/Order/List?uid=' + that.$store.state.uid).then(function (res) {
                that.postList = res.data.data;
            })
        }
       
        
    }
};
</script>

<style scoped>
#Order {
    background: #f5f5f5;
    padding-bottom: 60px;
}

#Order .topTab {
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    padding-right: 20px;
    margin-bottom: 10px;
}

#Order .topTab .item {
    font-size: 15px;
    color: #636363;
    padding-left: 10px;
    padding-right: 10px;
}

#Order .topTab .item.active {
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

#Order .priceBox {
    padding: 10px 16px;
    /*background: #f5f5f5;*/
    border-bottom: 1px solid #d9d9d9;
}

#Order .priceBox span.title {
    font-size: 14px;
    color: #242424;
}

#Order .vux-x-textarea.weui-cell {
    padding: 0 15px;
    font-size: 14px;
    color: #242424;
}

#Order .priceBox input {
    width: 80px;
    height: 30px;
    border: 1px solid #eee;
    border-radius: 5px;
    background: #fff;
    padding: 5px;
}

#Order .vux-cell-box.areaBox {
    padding: 5px 0px;
    border-bottom: 1px solid #d9d9d9;
}

.reacResult p.name {
    /* max-width: 30%; */
    text-overflow: ellipsis;
}
</style>
