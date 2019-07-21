<template>
<div id="stagPlan">
    <div class="content">
        <div class="topBox  bgW">
            <group class="eachPart flexSpace bgW" style="width:100%">
                <radioPicker :radiosArr="radiosArr" :title="title" v-on:getRadioValue="getRadioValue"></radioPicker>
            </group>
        </div>
        <div class="tipsBox flexCenter">
            <i class="iconfont icon-warming"></i>公开后其他用户可以看到任务中的每阶段完成计划与成果
        </div>
        <div class="eachBox" v-for="item,index in mainData">
            <p class="flexSpace">
                <span class="times">第{{index+1}}次</span><span class="date">{{item.date.substr(0,10)}}</span>
            </p>
            <textarea name="content" v-model="item.content" :class="!item.disabled?'disabled':''" id="" cols="30" rows="5" max="100" placeholder="请输入执行计划，100字以内，选填">
        </textarea>
        </div>
    </div>
    <div class="btnBox">
        <button class="long_btn" @click="savePlan">保存
        </button>
    </div>
</div>
</template>

<script>
import axios from 'axios'
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
import radioPicker from '@/components/radioPicker'
export default {
    data() {
        return {
            missionId: this.$route.query.missionId,
            stageDetail: JSON.parse(this.$route.query.stageDetail),
            title: '是否公开？',
            radiosArr: [{
                    value: 1,
                    text: '是',
                    selected: true
                },
                {
                    value: 2,
                    text: '否',
                    selected: false

                }
            ],
            mainData: []

        }
    },
    mounted() {
        var that = this;

        for (var i in that.stageDetail.infos) {
            var obj = {};
            obj.content = that.stageDetail.infos[i].content;
            if(that.stageDetail.infos[i].content.trim()!=''){
                obj.disabled=false;
            }else{
                obj.disabled=true;
            }
            obj.date = that.stageDetail.infos[i].date;
            obj.publ = that.stageDetail.publ;
            obj.id = that.stageDetail.infos[i].id
            that.mainData.push(obj)
        }
    },
    components: {
        Swiper,
        GroupTitle,
        Group,
        SwiperItem,
        XButton,
        Divider,
        Checker,
        CheckerItem,
        radioPicker,
        AlertModule
    },
    methods: {
        // 获取是否公开
        getRadioValue(val) {
            if (val == 1) {
                this.stageDetail.publ = true
            } else {
                this.stageDetail.publ = false
            }
        },
        // 保存计划
        savePlan() {
            var that = this;
            var flag = false;
            for (var i in that.mainData) {
                 delete that.mainData[i].date;
                 delete that.mainData[i].disabled;
                that.mainData[i].publ = that.stageDetail.publ;
                // 循环发送请求
                that.$http('put', that.$store.state.baseUrl + 'api/Order/Content/' + that.mainData[i].id, that.mainData[i]).then(function (res) {
                    if (res.data.code != '00') {
                        flag = false;
                        // break;
                    } else {
                        flag = true;
                        // continue;
                    }

                })
            }
            that.$router.push({
                path: '/missionInExecutionAuth',
                query: {
                    id: that.missionId
                }
            })

        }
    }
}
</script>

<style scoped>
#stagPlan .content {
    padding: 12px 16px;
    padding-bottom: 50px;
}

#stagPlan .tipsBox {
    flex-direction: row;
    color: #8A8A8A;
    font-size: 11px;
    margin-top: 13px;
    margin-bottom: 22px;
}

#stagPlan .tipsBox i {
    color: #F83345;
    margin-right: 5px;
}

#stagPlan .eachBox {
    margin-bottom: 20px;
}

#stagPlan .eachBox .times {
    color: #999999;
    font-size: 14px;
}

#stagPlan .eachBox .date {
    color: #999999;
    font-size: 11px;
}

#stagPlan .eachBox textarea {
    margin-top: 12px;
    width: 100%;
    border: 1px solid #B2B2B2;
    border-radius: 5px;
    padding: 12px 20px;
}
#stagPlan .eachBox textarea.disabled{
background: #B2B2B2;
pointer-events: none;
  }

#stagPlan .btnBox {
    position: fixed;
    bottom: 0;
    width: 100%;
    margin-bottom: 12px;

}

#stagPlan .btnBox button {
    margin-top: 0;
    width: 90%;
}
</style>
