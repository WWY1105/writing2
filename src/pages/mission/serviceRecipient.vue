<template>
    <div id="serviceRecipient">
        <p class="title">
            共300人，213人
            <span class="mainText">已支付</span>
            ，1人待支付，1人
            <span class="redText">已拒绝</span>
        </p>
        <div class="content bgW">
            <div class="eachList flexSpace">
                <span class="mainText">小初高数学贾家长</span><span class="mainText">已支付</span>
            </div>
             <div class="eachList flexSpace">
                <span class="mainText">小初高数学贾家长</span><span class="mainText">已支付</span>
            </div>
        </div>
    </div>
</template>
 
<script>
export default {
name:'serviceRecipient'
}
</script>

<style scoped>
#serviceRecipient .title{
    background: #F5F5F5;
    padding: 18px 0px;
    text-align: center;
    font-size: 14px;
}
#serviceRecipient  .content{
    padding-left: 40PX;
    padding-top: 20px;
}

#serviceRecipient  .content .eachList{
    height:50px;
    line-height: 50px;
    border-bottom: 1px solid #CECECE;
    padding-right: 45px;
}
</style>
