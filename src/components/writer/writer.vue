<template>
<!--搜索结果列表-->
<div class="reacResult wbg">
    <div class="flexBox">
        <div class="left">
            <!-- ?$store.state.imgUrl+imgurl:'' -->
            <img :src="$store.state.imgUrl+imgurl" class="userImg" alt="" @click.stop="seeUserDetail(uid)">
            </div>
            <div class="right">
                <div class="titleBox">
                    <span class="title">{{shortName}}</span>
                    <!-- <input type="text"> -->
                    <p v-if="isMissionDetail">
                        <span class="price" v-if="!isCanChoose">
                        <!-- ￥1000-￥1200 -->
                        {{!priceType?!sole?'￥-':'￥'+sole:priceType==1?!sole?'￥-':'￥'+sole:priceType==2?!joint?'￥-':'￥'+joint:'￥-'}}
                    </span>
                        <span class="radios" v-if="isCanChoose">
                        <i class="iconfont icon-dagouyouquan" :s="isChoosen" v-show="isChoosen"></i>
                        <i class="circle" :s="isChoosen" v-show="!isChoosen"></i>
                    </span>
                    </p>
                     <p v-if="!isMissionDetail">
                       <span :class="feeConfirm==3||feeConfirm=='3'?'redText':'mainText'">  {{feeConfirm==1||feeConfirm=='1'?"待确认":feeConfirm==2||feeConfirm=='2'?'已确认':feeConfirm==3||feeConfirm=='3'?'已拒绝':''}}</span>
                     </p>
                </div>
                <!-- <p class="options" >
                    <span class="option">实名
                         <i class="iconfont icon-wenhao" v-if="realAuth!=2?true:false"></i>
                        <i class="iconfont icon-gouxuan" v-if="realAuth==2?true:false"></i>
                    </span>
                    <span class="option" >学历
                         <i class="iconfont icon-wenhao" v-if="eduAuth!=2?true:false"></i>
                        <i class="iconfont icon-gouxuan" v-if="eduAuth==2?true:false"></i>
                    </span>
                    <span class="option" >
                        <span v-if="authorAuth!=2?true:false">  家教认证  <i class="iconfont icon-wenhao" v-if="authorAuth!=2?true:false"></i></span>
                       <router-link tag="span" :to="{path:'/viewingMechanism',query:{'tagid':tag?tag.id:''}}" v-if="authorAuth==2?true:false"> <u class="mainText">{{tag?tag.tag:''}} </u><i class="iconfont icon-gouxuan" ></i></router-link>
                    </span>
                    <span class="option" >资历：{{workAge}}年</span>
                </p> -->
                <!-- 作者详情 -->
                <div class="details" >

                    <div class="hang">
                        <!-- <p class="text">服务用户:
                            <span class="mainText"> {{!serviceUserCount?'0':serviceUserCount}}</span>
                        </p>
                        <p class="text">服务订单:
                            <span class="mainText">{{!serviceOrderCount?'0':serviceOrderCount}}</span>
                        </p>
                        <p class="text">服务小时:
                            <span class="mainText"> {{!serviceHours?'0':serviceHours}}</span>
                        </p> -->
                    </div>
                    <!--第二行详情（有的页面不显示）-->
                    <div class="hang" v-if="hang2IsShow">
                        <!-- <p class="text">任务数:
                            <span class="mainText">{{!missionNum?'0':missionNum}}</span>
                        </p>
                        <p class="text">有效任务:
                            <span class="mainText">{{!avaTaskCount?'0':avaTaskCount}}</span>
                        </p>
                        <p class="text">取消任务:
                            <span class="mainText">{{!missionNum?'0':missionNum-avaTaskCount}}</span>
                        </p> -->
                    </div>
                    <div class="hang flexStart">
                        <p class="box" v-if="item.tag!=''" v-for="item,index in Tags"><span class="smallBox" >{{item.tag}}</span></p>
                        <!-- <p class="box"><span class="smallBox">{{userTags[1].tag}}</span></p> -->
                    </div>
                </div>
                <!-- 家长详情 -->
                <div class="details businessDetail" >
                    {{selfCon==''?'未填写简述':selfCon}}
                </div>
                <!--第二行详情（有的页面不显示）-->

            </div>

        </div>

    </div>
</template>

<script>
export default {
    name: 'writer',
    data() {
        return {}
    },
    computed: {
        Tags() {
            if (!this.userTags) {
                return []
            } else {
                return this.userTags.slice(0, 3);
            }

        }
    },
    methods: {
        seeUserDetail(uid) {
            // alert(uid)
            var that = this;
            that.$router.push({
                path: '/writerDetail',
                query: {
                    writerId: that.uid
                }
            })
        }
    },
    mounted() {
      
    },
    props: ['org','cost','serviceHours','selfCon','imgurl', 'serviceOrderCount','serviceUserCount','authorAuth','feeConfirm', 'uid','sole','joint', 'priceType','avaTaskCount','workHours', 'missionNum', 'hang2IsShow', 'isMissionDetail', 'isChoosen','shortName', 'workAge', 'realAuth', 'eduAuth', 'userCount', 'isCanChoose']

}
</script>

<style>
.reacResult {
    margin-top: 10px;
}

.reacResult>.flexBox,
.hang {
    display: flex;
    justify-content: space-between;
    text-align: center;
    margin-top: 7px;
}

.hang.flexStart {
    justify-content: flex-start;
}
#missionInAfterEvaluteBuss .hang p {
    width: 50%;
}
#missionInAfterEvaluteBuss .hang p .left{
    text-align: left;
}
.hang p {
    width: 33.33%;
}

.hang p.text {
    text-align: left;
}

.reacResult .details {
    background: #EFEFEF;
    padding: 6px 7px;
    padding-top: 1px;
}

.reacResult .details .each .text {
    color: #242424;
    font-size: 12px;
    margin-bottom: 8px;
}

.reacResult .details p.box {
    text-align: left;
}

.reacResult .details .smallBox {
    border: 1px solid #B1B1B1;
    padding: 3px 0px;
    color: #707070;
    font-size: 12px;
    width: 65px;
    display: inline-block;
    text-align: center;
}

.reacResult .titleBox {
    display: flex;
    justify-content: space-between;
    color: #242424;
    font-size: 14px;
    font-weight: bold;
    align-items: center;
    margin-bottom: 10px;
}

.reacResult .titleBox .radios .iconfont {
    font-size: 18px;
    color: #3375C5;
}

.reacResult .titleBox .radios .circle {
    width: 17px;
    height: 17px;
    border-radius: 50%;
    border: 1px solid #CCCCCC;
    display: inline-block;
}

.reacResult .options {
    color: #242424;
    font-size: 12px;
    margin-bottom: 8px;
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
}

.reacResult .options .option {
    margin-right: 5px;
}

.reacResult .options .option i {
    color: #3375C5;
}

.reacResult .titleBox .price {
    color: #FF3939;
    font-size: 12px;
}
.reacResult .details.businessDetail{
    min-height: 99px;
    text-align: left;
    padding: 9px 12px;
    color: #242424
}

.reacResult>.flexBox .left {
    width: 15%;
}

.reacResult>.flexBox .right {
    width: 85%;
}

.userImg {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
    display: inline-block;
    border: 1px solid #ddd;
}

#searchResult {
    background: #f5f5f5;
}

.reacResult {
    margin-top: 10px;
    padding: 10px;
}

.reacResult .options .option i.icon-wenhao {
    color: #ccc;
}
#missionInAfterEvaluteBuss .hang p{
    width: auto;
}
#missionInAfterEvaluteBuss .hang p.left{
text-align: left;
}
#missionInAfterEvaluteBuss .hang p.right{
text-align: right;
}
</style>
