<template>
<div id="contactUs" class="flexCenter bgW">
    <div class="pic ">
        <img src="../../assets/img/Telephone@2x.png" class="topPic" alt="">
        <p> 家长热线：<a  class="mainText"  href="tel://186 1619 3061">186 1619 3061</a> </p>
        <p> 家教热线：<a  class="mainText"  href="tel://186 1619 3261">186 1619 3261</a> </p>
        <p> 投诉热线：<a  class="mainText"  href="tel://186 1619 3061">186 1619 3061</a></p>
         <!-- <p> 微信客服：<a  class="mainText"  href="tel://186 1619 3261">186 1619 3261</a> </p> -->
    </div>
    <div class="pic">
        <img src="../../assets/img/wx@2x.png" class="bottomPic" alt="">
        <p>微信客服：186 1619 3261</p>
    </div>
</div>
</template>

<script>
export default {

}
</script>

<style>
#contactUs {
    padding-top: 56px;
    height: 100%;
    width: 100%;
    align-items: center;
    text-align: center;
}

#contactUs .pic img {
    width: 90px;
    height: 90px;
}
#contactUs .pic p{
    line-height: 33px;
}
#contactUs .pic input{
    border: none;
    text-align: right;
    width: 81px;
}
#contactUs .pic input::placeholder{
    color:#263A7A;

}
#contactUs .pic .topPic {
    margin-bottom: 23px;
}

#contactUs .pic .bottomPic {
    margin-bottom: 33px;
    margin-top: 50px;
}
</style>
