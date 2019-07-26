<template>
    <div class="cellVav">
        <cell is-link  :class="noBorder" @click.native="gotoSeePage" >
                    <i slot="icon" :class="'iconfont '+icon"></i>
                    <span  slot="title" style="vertical-align:middle;">{{leftTitle}}</span>
                <badge slot='value' style="float:right" :text="num" v-if="num==0?false:true"></badge>    
                <div slot='value' style="float:right" v-if="leftTitle=='我的推荐人'||leftTitle=='TA的推荐人'">
                    <div class="flexSpace">
                        <!-- 推荐人 -->
                    <img  v-if="recommenderId"  :recommenderId="recommenderId" :src="recommenderSrc" alt="" class="recommender"  @click.stop.self="gotoWriterDetail">
                    <!-- 发信息 -->
                    <p v-if="isMsg" class="msg flexCenter" @click.stop="gotoSendMsg">
                        <i class="iconfont icon-feiji"></i>
                    </p>
                    </div>
                </div> 
        </cell>
    </div>
</template>

<script>
import { Cell, Badge } from 'vux'

export default {
    props: ['leftTitle', 'num', 'icon','noBorder','link','writerId','uid','isMsg','recommenderSrc','recommenderId'],
    components: {
        Cell,
        Badge
    },
    mounted(){
        console.log(this.recommenderSrc)
    
    },
    methods:{
        // 推荐人主页
        gotoWriterDetail(){

            this.$router.push({path:'/writerDetail',query:{'writerId':this.recommenderId}})
        },
        // 私信
        gotoSendMsg() {
            var that = this;
            that.$router.push({
                path: '/privateMsg',
                query: {
                    writerId: that.recommenderId
                }
            })
        },
        gotoSeePage(){
           if(this.leftTitle=='关注公众号'){
               this.$emit('tofellow','https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU4NTczOTE4NQ==#wechat_redirect')
           }else{
                  this.$router.push({
                path:this.link,
                query:{
                    'writerId':this.writerId,
                    'uid':this.uid
                },
                meta:{
                    keepActive:false
                }
            })
           }
         
        }
    }
}

</script>

<style scoped>
 .vux-label {
    width: 100%!important;
    align-items: center;
}
#mineIndex   .vux-label{
    width: 100%!important;
}
.cellVav .weui-cell {
    border-bottom: 1px solid #D9D9D9;
    padding-left: 0;
    color: #333333;
    font-size: 15px;
}
 .cellVav  .noBorder{
      border-bottom: none!important;
  }

.cellVav .weui-cell .iconfont {
    color: #7f7f7f;
    font-size: 15px;
    margin-right: 16px;
}

.cellVav .left {
    flex-direction: row;
}

.cellVav .vux-cell-primary {
    position: relative;
}

.cellVav .vux-badge-single {
    /* position: absolute;
    right: 10%; */
}
.recommender{
     border: 1px solid #E9E9E9;
}
.recommender,.msg{
    width: 25px;
    height: 25px;
    border-radius: 50%;
    margin: 0 10px;
    line-height: 25px;
    text-align: center;
    display: inline-block;
}
.msg{
    background: #44C447;
    color: #fff;
   
}
.msg i{
    margin: 0!important;
    color: #fff!important;
}
</style>
