
<template>
    <div id="cashWithdrawalSuccess" class="bgW">
        <div class="main flexBox">
            <i class="iconfont icon-gouxuan"></i>
            <p>支付成功</p>
            <!-- <router-link tag="button" :to="{path:'/myWallet'}" class="back">返回</router-link> -->
        </div>
    </div>
</template>

<script>
export default {
     data() {
        return {}
     },
     mounted(){
         var timer;
         timer=setTimeout(() => {
             this.$router.push({
                 path:'/mineIndex'
             })
         }, 2000);
     },
     methods:{

    }
}
</script>

<style scoped>
#cashWithdrawalSuccess{
    height: 100%;
}
#cashWithdrawalSuccess .main{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
#cashWithdrawalSuccess i.iconfont{
font-size: 36px;
text-align: center;
display: inline-block;
margin-top: 80px;
margin-bottom: 30px;
}
#cashWithdrawalSuccess p{
    color: #403F3F;
    font-size: 16px;
    margin-bottom: 48px;
}
#cashWithdrawalSuccess button{
    background: #3374C4;
    font-size: 16px;
    color: #fff;
    border-radius: 4px;
    width: 235px;
    height: 40px;
    border: none;
}
</style>
