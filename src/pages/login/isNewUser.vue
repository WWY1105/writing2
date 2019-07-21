<template>

</template>

<script>
import {
    AlertModule
} from 'vux'
export default {
    data() {
        return {
            code: ''
        }
    },
    components: {
        AlertModule,
    },
    mounted() {
        this.code = this.GetQueryString('code');
        if (this.code != null) {
            // alert(this.code)
            this.$store.commit('setCode', this.code)
        }
        this.isNewUser()
    },
    methods: {
        isNewUser() {
            var that = this;
            var baseUrl = that.$store.state.baseUrl;
            that.code = that.$store.state.code
            if (that.code != null) {
                that.$http('get', baseUrl + 'api/WebUser/WeixinUser', {
                    code: that.code
                }).then(function (res) {
                    if (res.data.code != '00') {
                        AlertModule.show({
                            title: res.data.msg
                        })
                    } else {
                        // 先把recommadd存下来
                        if (that.GetQueryString('recommadd')) {
                            if (that.GetQueryString('recommadd').split('_')[0]) {
                                localStorage.setItem('recomm', that.GetQueryString('recommadd').split('_')[0])
                            }
                            if (that.GetQueryString('recommadd').split('_')[1] != 'A') {
                                localStorage.setItem('adduid', that.GetQueryString('recommadd').split('_')[1])
                            }
                        }

                        if (res.data.data.newUser) {
                            // 新用户
                            localStorage.setItem("openid", res.data.data.openid);
                            localStorage.setItem("imgurl", res.data.data.headimgurl);
                            that.$router.push({
                                path: "/bindTel",
                                query: {
                                    imgurl: res.data.data.headimgurl,
                                    openid: res.data.data.openid
                                }
                            })
                        } else {
                            // 老用户
                            that.$store.commit('setuid', res.data.data.webUser.id)
                            that.$store.commit('setUserType',res.data.data.webUser.type)
                            localStorage.setItem('userType', res.data.data.webUser.type);
                            that.$store.commit('setOpenid', res.data.data.openid)
                            that.$store.commit('setUserImg', res.data.data.headimgurl)
                            if (that.GetQueryString('recommadd')) {
                                that.$http('post', that.$store.state.baseUrl + 'api/Mediator/add', {
                                    uid: that.$store.state.uid,
                                    mediator: that.GetQueryString('recommadd').split('_')[0]
                                }).then(function (res) {
                                    //  alert(res)
                                    if (res.data.code != '00') {
                                        AlertModule.show({
                                            title: res.data.msg
                                        })
                                    } else {
                                        if (that.GetQueryString('recommadd').split('_')[1] != 'A') {

                                            that.$router.push({
                                                path: "/writerDetail",
                                                query: {
                                                    writerId: that.GetQueryString('recommadd').split('_')[1]
                                                }
                                            })
                                        } else {
                                            that.$router.push({
                                                path: "/index",
                                                query: {
                                                    imgurl: res.data.data.headimgurl,
                                                    openid: res.data.data.openid
                                                }
                                            })
                                        }
                                    }

                                })

                            } else {
                                that.$router.push({
                                    path: "/index",
                                    query: {
                                        imgurl: res.data.data.headimgurl,
                                        openid: res.data.data.openid
                                    }
                                })
                            }

                        }

                    }

                })
            }
        },
        GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
    }
}
</script>

<style>

</style>
