<template>
    <div class="chooseSuccess">
        <i class="iconfont icon-gouxuan"></i>
        <p class="mainText">选择成功</p>
        <p class="tips">别忘了给家教一个评价噢~</p>
        <button class="btn pj"  @click="toEvaluate">立即评价</button>
        <button class="btn main" @click="goBackToIndex">返回首页</button>
    </div>
</template>
<script>
export default {
    methods:{
        toEvaluate(){
            const that=this;
            this.$router.push({
                path:'/evaluationAuthor',
                query:{
                    taskId:that.$route.query.taskId
                }
            })
        },
        goBackToIndex(){
            this.$router.push({
                name:'index'
            })
        }
    }
}
</script>
<style scope>
    .chooseSuccess{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .chooseSuccess i.iconfont{
        margin: 79px 0 29px 0;
        font-size:36px;
    }
    .mainText{
        font-size: 16px;
        color: #403F3F;
        margin-bottom: 96px;
    }
    .tips{
        font-size: 16px;
        color: #403F3F;
        margin-bottom: 25px;
    }
    .btn{
        width: 235px;
        height: 40px;
        line-height: 40px;
        color: #fff;
        border: none;
        border-radius: 4px;
        font-size: 16px;
    }
    .btn.pj{
        background: #3374C4;
    }
    .btn.main{
        color: #3374C4;
        border:1px solid #3374C4;
        margin-top: 25px;
    }
</style>
