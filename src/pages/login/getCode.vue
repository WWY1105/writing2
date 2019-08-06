<template>

</template>

<script>
export default {
    name:'getCode',
    data() {
        return {
            code: '',
        }
    },
    mounted() {
    

        
        //  localStorage.setItem(recommadd,this.GetQueryString('recommadd'))
  
        this.getBaseInfo()
        // this.GetQueryString('code');
        this.code = this.GetQueryString('code')
         
    },
    methods: {
        // http://nian.im/app/index.html#/getCode
        // http://www.shuimujiajia.net/app/index.html
        getBaseInfo() {
            var that = this;
           // var appid = "wx95a2bb5d427d8498";//正式
             var appid = 'wx086161b30df8e46d'//测试
            var recommadd=that.GetQueryString('recommadd');
            var seeUid=that.GetQueryString('uid');
            var redirect_uri ;
            
            if(recommadd){
                if(seeUid){
                    redirect_uri = encodeURI("http://nian.im/app/index.html?recommadd="+recommadd+"_"+seeUid);
                }else{
                    // 扫码我的海报，不用跳转用户主页
                    redirect_uri = encodeURI("http://nian.im/app/index.html?recommadd="+recommadd+"_"+"A");
                }
                 
            }else{
                 redirect_uri = encodeURI("http://nian.im/app/index.html");
            }
            // alert(redirect_uri)
            // redirect_uri=encodeURIComponent(redirect_uri)
            // var redirect_uri = encodeURI("http://nian.im/app/index.html#/getCode?recommadd="+recommadd+"_"+seeUid);
            var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid + "&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect"
            window.location.href = url;
        },
     
        //    GetQueryString(name) {
        //     alert(name)
        //     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        //      alert(reg)
        //     var r = window.location.search.substr(1).match(reg);
        //     alert( r)
        //     if (r != null) return unescape(r[2]);
        //     return null;
        // }
        GetQueryString(name){
                return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
            }
       
    }
}
</script>

<style>

</style>
