<template>
<div id="addFellow">
    <p class="title">
        请输入对方ID
    </p>
    <div class="inputBox">
        <input type="number" class="bgW" v-model="fellowId" >
        </div>
        <div class="btnBox">
            <button class="long_btn" @click="toFellow">提交</button>
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
            fellowId: ''

        }
    },
    components: {
        AlertModule
    },
    methods: {
         // 关注
        toFellow() {
            var that = this;
            var postData = {
                uid: that.uid,
                followingUid: that.fellowId
            }
            if(that.fellowId>=1000000){
                 AlertModule.show({
                        title: '没有此用户，请注意输入正确用户ID'
                    })
                    return false ;
            }
            that.$http('post', that.$store.state.baseUrl + 'api/UserFollowing', postData).then(function (res) {
                if (res.data.code != '00') {
                    AlertModule.show({
                        title: res.data.msg
                    })
                } else {
                      AlertModule.show({
                        title: "添加成功",
                        onHide(){
                            that.goBack()
                        }
                    })
                }
            })
        },
        goBack() {
            this.$router.go(-1)
        }
    }
}
</script>

<style scoped>
#addFellow {
    padding: 29px 13px;
    height:100%;
}

#addFellow .title {
    font-size: 13px;
    color: #4F4F4F;
}

#addFellow .inputBox input {
    width: 100%;
    border-radius: 4px;
    border: 1px solid #C3C3C3;
    height: 40px;
    padding: 0 5px;
    line-height:40px;
    margin: 12px 0 22px 0;
}

#addFellow .btnBox .long_btn {
    margin-top: 0;
    width: 100%;
    margin-bottom: 10px;
}

#addFellow .btnBox .long_btn.clear_btn {
    color: #F83345;
    border: 1px solid #F83345;
    background: #f5f5f5;
}
</style>
