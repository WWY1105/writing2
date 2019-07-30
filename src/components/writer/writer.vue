<template>
<!--搜索结果列表-->
<div class="reacResult wbg">
    <div class="flexBox">
        <div class="left">
            <!-- ?$store.state.imgUrl+imgurl:'' -->
            <img :src="$store.state.imgUrl+imgurl" class="userImg" alt="" @click.stop="seeUserDetail(uid)">
            </div>
            <div class="right">
                <div class=" titleBox flexSpace">
                    <span class="title ">{{shortName}}</span>
                    <div>
                        <p class='priceDesc' v-if="type=='author'">预算费用</p>
                        <p class="price">{{!soleCost?'￥暂无':'￥'+soleCost+'/小时'}}</p>
                     </div>
                </div>
                 <!-- <div class="titleBox flexSpace">
                        <span></span>
                        
                    </div> -->
                <!-- 作者详情 -->
                <div class="details" v-if="type=='author'">
                    <!-- 1 -->
                    <div class="hang">
                        <p class="text tagText">
                            <span class="mainText "> {{org?org:'机构：暂无'}}<i class="iconfont icon-gouxuan" v-if="org?true:false"></i></span>
                        </p>
                         <p class="option">实名
                            <i class="iconfont icon-wenhao" v-if="realAuth!=2?true:false"></i>
                            <i class="iconfont mainText icon-gouxuan" v-if="realAuth==2?true:false"></i>
                         </p>
                        <p class="option" >学历
                            <i class="iconfont icon-wenhao" v-if="eduAuth!=2?true:false"></i>
                            <i class="iconfont mainText icon-gouxuan" v-if="eduAuth==2?true:false"></i>
                         </p>
                    </div>
                    <!-- 2 -->
                    <div class="hang">
                        <p class="text schoolText">
                            {{school?school:'学校：暂无'}}
                        </p>
                          <p class="text">
                            {{gender=='1'?'男':'女'}}
                        </p>
                         <p class="text">
                            {{'资历：'+workAge+'年'?'资历：'+workAge+'年':'资历：0年'}}
                        </p>
                    </div>
                     <div class="hang shifDesc"><p>{{selfCon==''?'未填写简述':selfCon}}</p></div>
                </div>
                <!-- 家长详情 -->
                <div class="details businessDetail"  v-if="type=='business'">
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
    props: ['org','school','cost','type','soleCost','serviceHours','selfCon','imgurl', 'serviceOrderCount','gender','serviceUserCount','authorAuth','feeConfirm', 'uid','sole','joint', 'priceType','avaTaskCount','workHours', 'missionNum', 'hang2IsShow', 'isMissionDetail', 'isChoosen','shortName', 'workAge', 'realAuth', 'eduAuth', 'userCount', 'isCanChoose']

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
.shifDesc p{
    width: 100%!important;
    text-overflow: -o-ellipsis-lastline;
overflow: hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
}
#missionInAfterEvaluteBuss .hang p .left,.hang p {
    text-align: left;
    color:#242424;
}
.hang p {
    width:26%;
    color:#242424;

}
.hang  .tagText,.hang p.schoolText{
    width: 44%;
    display: inline-block
}
.hang p.text {
    text-align: left;
    color:#242424;
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
.titleBox .title{
    max-width: 170px;
}

.reacResult .options .option i.icon-wenhao {
    color: #ccc;
}
#missionInAfterEvaluteBuss .hang p{
    width: auto;
    color:#242424;
}
#missionInAfterEvaluteBuss .hang p.left{
text-align: left;
}
#missionInAfterEvaluteBuss .hang p.right{
text-align: right;
}
.priceDesc {
    color: #707070;
    font-size: 12px;
}
</style>
