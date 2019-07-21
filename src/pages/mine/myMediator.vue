<template>
<div id="myMediator">
    <p class="title">
        请输入对方手机号
    </p>
    <div class="inputBox">
        <input type="number" class="bgW" v-model="mobile" >
        </div>
        <div class="btnBox">
            <button class="long_btn" @click="addMediator">提交</button>
            <button class="long_btn clear_btn" @click="goBack">清空并返回</button>
        </div>
    </div>
</template>

<script>
import {
    AlertModule
} from 'vux'
export default {
    data() {
        return {
            uid: this.$store.state.uid,
            mobile: ''

        }
    },
    components: {
        AlertModule
    },
    methods: {
        addMediator() {
            var that = this;
            var baseUrl = this.$store.state.baseUrl;
            that.$http('post', baseUrl + 'api/Mediator', {
                uid: that.uid,
                mobile: that.mobile
            }).then(function (res) {
                if (res.data.code != '00') {
                    AlertModule.show({
                        title: res.data.msg
                    })
                } else {
                    AlertModule.show({
                        title: "提交成功",
                        onHide() {
                            that.$router.go(-1)
                        }
                    })
                }

            })
        },
        goBack() {
            var that = this;
            var baseUrl = this.$store.state.baseUrl;
            that.$http('delete', baseUrl + 'api/Mediator/'+this.$store.state.uid, {
                
            }).then(function (res) {
                if (res.data.code != '00') {
                    AlertModule.show({
                        title: res.data.msg
                    })
                } else {
                    that.$router.go(-1)
                }

            })
            
        }
    }
}
</script>

<style scoped>
#myMediator {
    padding: 29px 13px;
}

#myMediator .title {
    font-size: 13px;
    color: #4F4F4F;
}

#myMediator .inputBox input {
    width: 100%;
    border-radius: 4px;
    border: 1px solid #C3C3C3;
    height: 40px;
    padding: 0 5px;
    /* line-height: 50px; */
    margin: 12px 0 22px 0;
}

#myMediator .btnBox .long_btn {
    margin-top: 0;
    width: 100%;
    margin-bottom: 10px;
}

#myMediator .btnBox .long_btn.clear_btn {
    color: #F83345;
    border: 1px solid #F83345;
    background: #f5f5f5;
}
</style>
