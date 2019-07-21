<template>
<div id="activeMessage">
    <div class="noDataBox" v-if="msgList.length==0"><span> 暂无内容</span></div>
    <div class="eachActiveMsg flexSpace bgW" v-for="item,index in msgList">
        <div class="left ">
            <img :src="$store.state.imgUrl+item.imgurl" class="userImg" alt @click="seeUserDetail(item.uid)">
      </div>
            <div class="right flexSpace">
                <div class="textBox">
                    <div>
                        <p class="name">{{item.nickname}}</p>
                        
                        <p class="content">
                            <i class="start iconfont icon-icon4"  v-if="item.type=='like'?true:false"></i>
                            <span v-if="item.type=='like'?false:true">{{item.content}}</span>
                         </p>
                    </div>
                    <p class="date">{{item.commentTime}}</p>
                </div>
                <!-- <img src="../../assets/logo.png" alt=""> -->
                <p class="text">{{item.circleContent}}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            msgList:[],
            postData:{}
        }
    },
    mounted(){
        this.getActiveMsg()
    },
    methods:{
        getActiveMsg(){
             var that = this;
            that.postData.uid = that.$store.state.uid;
           
            that.$http('get', that.$store.state.baseUrl + 'api/Circle/Dynamic', that.postData).then(function (res) {
                if (res.data.code == '00') {}
                    that.msgList=res.data.data;
                })
        }
    }
};
</script>

<style scoped>
#activeMessage {
    height: 100%;
}
#activeMessage .eachActiveMsg{
padding: 15px;
align-items: flex-start;
}
#activeMessage .eachActiveMsg .userImg{
    width: 30px;
    height: 30px;
    margin-right: 16px;
}
.noDataBox{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
#activeMessage .eachActiveMsg .right{
    width: 100%;
    align-items: flex-start;
        border-bottom: 1px solid #E2E2E2;
        padding-bottom: 15px;
}
#activeMessage .eachActiveMsg .name{
    color: #333333;
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 18px;
}
#activeMessage .eachActiveMsg .content{
    color: #333333;
    font-size: 15px;
    margin-bottom: 12px;
}
 #activeMessage .eachActiveMsg .content .start{
color: #EA4A5C
  }
#activeMessage .eachActiveMsg .date{
    color: #8C8C8C;
    font-size: 10px;
    /* margin-bottom: 12px; */
}
#activeMessage .eachActiveMsg .right img{
    width: 65px;
    height: 65px;
}
 #activeMessage .eachActiveMsg .right  .text{
    color: #333333;
    font-size: 15px;
    width: 65px;
       overflow: hidden;
    max-height: 59px;
    text-overflow: ellipsis;
   
  }
</style>
