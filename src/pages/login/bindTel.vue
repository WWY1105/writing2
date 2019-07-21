<template>
<div id="bindTel">
    <!--绑定手机-->
    <yd-cell-group>
        <yd-cell-item class="telHang">
            <span slot="left">电话号码</span>
            <yd-input slot="right" class="telInput" required type="number" v-model="telNum" max="20" placeholder=""></yd-input>
        </yd-cell-item>
        <yd-cell-item class="codeHang">
            <div slot="left" class="code">

                <span slot="left">短信验证码</span>
                <yd-input slot="right" type="number" class="yzm" v-model="msg" placeholder=""></yd-input>
            </div>
            <div slot="right" class="button">
                <!-- 获取按钮 -->
                <yd-button class="getCode" @click.native="regTel" :disable="btnDisable">{{count}}{{count=='获取'||count=='重新获取'?'':'秒'}}</yd-button>
            </div>
        </yd-cell-item>
    </yd-cell-group>
    <p class="tips">
        <i class="iconfont icon-warming"></i>
        <span>绑定手机后，平台能给您及时发送关键任务的短消息，避免任务失败</span>
    </p>
    <button class="long_btn" @click.prevent="gotoBind">绑定</button>
</div>
</template>

<script>
import Vue from 'vue'
import YDUI from 'vue-ydui' /* 相当于import YDUI from 'vue-ydui/ydui.rem.js' */
import 'vue-ydui/dist/ydui.rem.css'
import 'vue-ydui/dist/ydui.base.css'
import {
    AlertModule,
    Alert
} from 'vux'
import {
    mapState
} from 'vuex'
Vue.use(YDUI)
export default {
    name: 'bindTel',
    data() {
        return {
            telNum: '',
            msg: '',
            count: '获取',
            btnDisable: false,
            timer: null

        }
    },
    computed: {
        ...mapState(['baseUrl'])
    },
    mounted: function () {
        // alert(this.GetQueryString('openid'))
        // alert(this.GetQueryString('imgurl'))
    },
    components: {
        AlertModule,
        Alert
    },
    methods: {
        // 获取验证码
        getCode() {
            var that = this;
            if (that.regTel) {
                // 发送请求
                that.$http('get', this.baseUrl + 'api/WebUser/Sms', {
                    mobile: that.telNum,
                    type: 'login'
                }).then(function (res) {
                    if (res.data.code == '00') {
                        console.log('获取验证码成功了');
                        const TIME_COUNT = 60;
                        if (!that.timer) {
                            that.count = TIME_COUNT;
                            that.show = false;
                            that.timer = setInterval(() => {
                                if (that.count > 1 && that.count <= TIME_COUNT) {
                                    that.count--;
                                    that.btnDisable = true;
                                } else {
                                    that.show = true;
                                    clearInterval(that.timer);
                                    that.timer = null;
                                    that.count = '重新获取';
                                    that.btnDisable = false;
                                }
                            }, 1000)
                        }
                    } else {
                        AlertModule.show({
                            title: res.data.msg
                        })
                    }
                })
            }

        },

        // 校验电话号
        regTel() {
            console.log('点击了')
            var that = this;
            // 校验电话号码的合适
            var flag = this.checkTel(this.telNum);
            var flag2 = false;
            switch (flag) {
                case 1:
                    AlertModule.show({
                        title: '请输入电话号'
                    })
                    break;
                case 2:
                    AlertModule.show({
                        title: '您输入的电话号格式不正确'
                    })
                    break;
                case 3:
                    //  电话格式正确了
                    that.getCode()
                    flag2 = true;
                    break;
            }
            // 校验电话号码的合适END
            return flag2;

        },
        // 点击跳转
        gotoBind() {
            ///api/WebUser
            var that = this;
            var openid = localStorage.getItem('openid');
            var imgurl = localStorage.getItem('imgurl')

            var data = {
                openid: openid,
                // openid:3333,
                mobile: that.telNum,
                smsCode: that.msg,
                imgurl: imgurl,
            };
            // alert(data)
            that.$http('post', that.$store.state.baseUrl + 'api/WebUser', data).then(function (res) {
                if (res.data.code == '00') {
                    // 把uid存到store中
                    that.$store.commit('setuid', res.data.data.id)
                    that.$store.commit('setUserType',res.data.data.type)
                    localStorage.setItem('uid', res.data.data.id);
                    localStorage.setItem('userType', res.data.data.type);
                    // 添加新用户作为调解人
                     if (localStorage.getItem('newUser')) {
                        that.$http('post', that.$store.state.baseUrl + 'api/Mediator/add', {
                            uid: res.data.data.id,
                            mediator: that.GetQueryString('recommadd').split('_')[0] 
                        }).then(function (res) {
                            //  alert(res)
                            if (res.data.code != '00') {
                                AlertModule.show({
                                    title: res.data.msg
                                })
                            } else {
                                 AlertModule.show({
                                    title: "添加调解人成功"
                                })
                            }

                        })
                    }
                    console.log(that.$store.state.uid)
                    // 电话号和验证码都正确
                    that.$router.push({
                        path: '/choose_identity'
                    })
                } else {
                    AlertModule.show({
                        title: res.data.msg
                    })
                }
            })

        },
        // 获取url参数
        GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        }
    }
}
</script>

<style>
/*电话绑定*/

body {
    background: #fff;
}

#bindTel {
    padding: 0.2rem;
    padding-top: 38px;
    height: 100%;
}

#bindTel .yd-cell-item.telHang,
.code {
    background: #f5f5f5;
    border: 1px solid #CECECE;
    border-radius: 0.1rem;
    height: 0.9rem;
    line-height: 0.9rem;
}

#bindTel .yd-cell-item.codeHang {
    padding: 0;
}

#bindTel .yd-cell-item.codeHang .yd-cell-left {
    width: 100%;
}

#bindTel .yd-cell-item.codeHang .yd-cell-right {
    /* max-width: 30%; */
    margin-left: 5%;
    padding-right: 0;
}

#bindTel .yd-cell-item.codeHang .yd-cell-right .button {
    width: 105px;
    text-align: center;
}

#bindTel .yzm .yd-input-clear {
    display: none !important;
}

.code {
    width: 100%;
    padding-left: 0.24rem;
    display: flex;
}

#bindTel .telHang {
    margin-bottom: 0.16rem;
}

#bindTel .yd-cell-left {
    color: #242424;
    font-size: 0.28rem;
}

#bindTel .getCode {
    min-width: 100%;
    background: #3375C5;
    height: 0.9rem;
    line-height: 0.9rem;
    color: #fff;
    font-size: 0.28rem;
    border-radius: 0.1rem;
    padding: 0;
}

#bindTel .yd-cell:after {
    display: none;
}

#bindTel .telInput input,
.code input {
    padding-left: 20px;
    color: #3375C5;
    font-size: 14px;
}

.code input {
    padding-left: 10px;
}

.tips {
    color: #8a8a8a;
    font-size: 11px;
    margin-top: 26px;
}

.tips .iconfont {
    color: #F83345;
    font-size: 15px;
    margin-right: 7px;
}
</style>
