<template>
<div id="systemMessage">
    <div :class="!item.read?'activeMsg bgW':'oldMsg bgW'" v-for="item,index in msgList">
        <p class="title">{{item.title}}</p>
        <div class="content">{{item.content}}
        </div>
        <div class="date">{{item.msgTime}}</div>

    </div>
    <!-- 
        oldMsg
     -->
    <!-- <div class="oldMsg bgW">
        <p class="title">你的报名有新的动态</p>
        <div class="content">
            您好，您报名的任务有新的动态，请注意查看，关注更多
            信息请查看任务详情
        </div>
        <div class="date">2019-3-1 21:00</div>

    </div> -->
</div>
</template>

<script>
export default {
    mounted() {
        this.getSystemMsg()
    },
    data() {
        return {
            uid: this.$store.state.uid,
            msgList: []
        }
    },
    methods: {
        getSystemMsg() {
            // api/SystemMsg/List
            var that = this;
            var baseUrl = this.$store.state.baseUrl;
            that
                .$http("get", baseUrl + "api/SystemMsg/List", {
                    uid:that.uid
                })
                .then(function (res) {
                    console.log(res.data.data);
                    var result = res.data.data;
                    that.msgList = result;
                });

                // 把系统消息都设置已读
                 that
                .$http("post", baseUrl + "api/SystemMsg/all-read", {
                    uid:that.uid
                })
                .then(function (res) {
                   
                });
        }
    }
}
</script>

<style scoped>
#systemMessage {
    padding-top: 10px;
}

#systemMessage .activeMsg {
    padding: 13px;
    margin-bottom: 10px;
}

#systemMessage .activeMsg .title {
    color: #333333;
    font-size: 16px;
    margin-bottom: 10px;
    font-weight: bold;
}

#systemMessage .activeMsg .content {
    color: #333333;
    font-size: 14px;
    margin-bottom: 10px;
}

#systemMessage .activeMsg .date {
    color: #666666;
    font-size: 11px;
}

/* normal */
#systemMessage .oldMsg {
    padding: 13px;
    margin-bottom: 10px;
}

#systemMessage .oldMsg .title {
    color: #ABABAB;
    font-size: 16px;
    margin-bottom: 10px;
    font-weight: bold;
}

#systemMessage .oldMsg .content {
    color: #ABABAB;
    font-size: 14px;
    margin-bottom: 10px;
}

#systemMessage .oldMsg .date {
    color: #ABABAB;
    font-size: 11px;
}
</style>
