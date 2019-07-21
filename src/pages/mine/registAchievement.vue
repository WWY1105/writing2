<template>
<div id="registAchievement">
    <!-- 登记阶段性成果 -->
    <p class="title">第{{Number(times)+1}}次登记</p>
    <p class="time">{{date}}之后登记</p>
    <textarea name="" v-model="content" id="" cols="30" rows="10" placeholder="请输入执行结果，100字以内"></textarea>
    <button class="long_btn" @click="submitRefister">提交</button>
</div>
</template>

<script>
import {
    Swiper,
    GroupTitle,
    Group,
    SwiperItem,
    XButton,
    Divider,
    Checker,
    CheckerItem,
    AlertModule

} from 'vux'
export default {
    data() {
        return {
            missionId: this.$route.query.missionId,
            stageDetail: JSON.parse(this.$route.query.stageDetail),
            times: 0,
            date: '',
            id:'',
            content:''
        }
    },
    mounted() {
        var that = this;
        console.log(that.stageDetail)
        for (var i in that.stageDetail.infos) {
            if (!that.stageDetail.infos[i].success) {
                that.times = i;
                that.date = that.stageDetail.infos[i].date;
                that.id=that.stageDetail.infos[i].id
                break;
            } else {
                continue;
            }
        }
    },
    methods: {
        // 提交
        submitRefister() {
            var that=this;
            that.$http('put', that.$store.state.baseUrl + 'api/Order/RegisterContent/' + that.id, {
                registerContent:that.content
            }).then(function (res) {
                if (res.data.code != '00') {
                    AlertModule.show({
                        title: res.data.msg,
                     })
                   
                } else {
                      AlertModule.show({
                        title: '提交成功',
                        onHide() {
                            that.$router.push({
                                path: '/missionInExecutionAuth',
                                query: {
                                    id: that.missionId
                                }
                            })
                        }
                    })
                }

            })
        }
    }
}
</script>

<style scoped>
#registAchievement {
    padding: 0 16px;
}

#registAchievement .title {
    text-align: center;
    color: #353535;
    font-size: 14px;
    margin: 25px 0 13px 0;
    font-weight: bolder;
}

#registAchievement .time {
    text-align: center;
    color: #929292;
    font-size: 11px;
    margin-bottom: 34px;
}

#registAchievement textarea {
    border: 1px solid #b2b2b2;
    border-radius: 5px;
    width: 100%;
    padding: 16px 21px;
}

#registAchievement .long_btn {
    width: 90%;
    margin-top: 200px;
}
</style>
