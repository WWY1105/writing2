<template>
<div id="mailDetail">
    <div class="content" id="content">
        <!-- 信箱详情 -->
        <!-- <div class="eachMail flexSpace bgW">
            <div class="imgBox">
                <img :src="mailDetail.user?$store.state.imgUrl+mailDetail.user.imgurl:''" class="userImg" alt="">
            </div>
            <div class="text">
                <p class="flexSpace">

                    <span class="name">{{mailDetail.user.nickname}}</span>
                    <span class="date">{{mailDetail.msgTime}}</span>
                </p>

                <p class="detailText">{{mailDetail.content}}</p>

            </div>
        </div> -->

        <!-- 回复详情 -->
        <div class="eachMail replayBox flexSpace bgW" v-for="i,j in mailList" @click="replayMsgId(i.msgId)">
            <div class="imgBox">
                 <router-link tag="img" :to="{path:'/writerDetail',query:{'writerId':i.user.id}}"  :src="i.user?$store.state.imgUrl+i.user.imgurl:''" class="userImg" alt=""></router-link>
            </div>
            <div class="text">
                <p class="flexSpace">
                    <span class="name">{{i.user.nickname}}</span>
                    <span class="date">{{i.commentTime}}</span>
                </p>

                <p class="detailText">{{i.content}}</p>

            </div>
        </div>
        <div class="btnBox" style="min-height:90px"></div>
    </div>
    <div class="replay bgW flexSpace" v-if="inputShow">
        <input type="text" placeholder="回复私信" v-model="content" autofocus v-focus @focus="handleFocus($event)" @blur="handleblur" id="input" ref='input'>
        <button class="long_btn" @click.stop="sendMsg">发送</button>
    </div>
</div>
</template>

<script>
import {
    AlertModule
} from 'vux'
import { setPriority } from 'os';
import { setTimeout } from 'timers';
export default {
    data() {
        return {
            isSaw: false,
            mailId: this.$route.query.mailId,
            toUid: this.$route.query.toUid,
            mailDetail: {},
            comments: [],
            msgId: '',
            content: '',
            inputShow:false,
            timer:'',
            mailList:[]
        }
    },
    components: {
        AlertModule
    },
    directives: {
        focus: {
            // 指令的定义
            inserted: function (el) {
                 el.focus()
            }
        }
},
    mounted() {
        this.getDetail();
    },
    methods: {
        handleFocus(event) {
            clearTimeout(this.timer);
        },
        handleblur() {
            this.timer = setTimeout(() => {
                document.body.scrollTop = 0;
                window.pageXOffset = 0;
                document.documentElement.scrollTop = 0;
            }, 100);
        },
        getDetail() {
            var that = this;
            var baseUrl = this.$store.state.baseUrl;
            that.$http('get', baseUrl + 'api/PrivateMsg/get-record',{
                'uid': that.$store.state.uid,
                'toUid' :that.toUid
            }).then(function (res) {
                if (res.data.code != '00') {
                    AlertModule.show({
                        title: res.data.msg
                    })
                } else {
                    that.mailList = res.data.data;
                    // that.comments = res.data.data.comments;

                    // 设置已读
                    that.$http('put', baseUrl + 'api/PrivateMsg/read/' + that.mailId).then(function (res) {
                        if (res.data.code != '00') {
                            AlertModule.show({
                                title: res.data.msg
                            })
                        } else {
                            that.inputShow=true
                            var ele = document.getElementById('content');
                            ele.scrollTop = ele.scrollHeight;
                            // setTimeout(function(){
                            //     ele.scrollTop = ele.scrollHeight
                            // },200)
                            that.$router.replace({
                            path: "/mailDetail",
                            query: {
                                mailId: that.mailId
                            }
                        })
                        }
                    })

                }
            })
        },
        // 选中要回复的信息
        replayMsgId(id) {
            this.msgId = id;
        },
        sendMsg() {
            var that = this;
            var baseUrl = this.$store.state.baseUrl;
            if(that.content.trim()==''){
                 AlertModule.show({
                        title: "不能发送空消息哦"
                    })
                    return false;
            }
            // that.$http('post', baseUrl + 'api/PrivateMsg/comment', {
            //     privateMsgId: that.mailDetail.id,
            //     uid: that.$store.state.uid,
            //     content: that.content
            // }).then(function (res) {
            //     if (res.data.code != '00') {
            //         AlertModule.show({
            //             title: res.data.msg
            //         })
            //     } else {
            //          that.content = '';
            //         that.inputShow=false;
            //         that.getDetail();
                   
            //     }
            // })
            var postData = {
                content: that.content,
                uid: that.$store.state.uid,
                toUid :that.toUid
            };
            that.$http("post", baseUrl + "api/PrivateMsg", postData).then(function (res) {
                if (res.data.code != "00") {
                    AlertModule.show({
                        title: res.data.msg
                    });
                } else {
                    // AlertModule.show({
                    //     title: "发送成功",
                    //     onHide() {
                    //          that.$router.go(-1)
                    //     }
                    // });
                     that.content = '';
                    that.getDetail();

                }
            });

        }
    }
}
</script>

<style scoped>
#mailDetail {
    position: relative;
    height: 100%;
    width: 100%;
    /*  */
}

#mailDetail .eachMail {
    padding: 13px 23px 16px 11px;
    align-items: flex-start;
}

#mailDetail .eachMail .text {
    width: 100%;
}

#mailDetail .eachMail.replayBox {
    margin-top: 10px;
}

#mailDetail .eachMail .name {
    color: #333333;
    font-size: 15px;
    margin-bottom: 10px;
    padding-top: 9px;

}

#mailDetail .eachMail .imgBox {
    position: relative;

}

#mailDetail .eachMail .detailText {
    font-size: 15px;
    color: #333;
    /* margin-bottom: 10px; */
}

#mailDetail .eachMail .date {
    font-size: 10px;
    color: #686868;
}

#mailDetail .eachMail .money {
    font-size: 12px;
    color: #EA4A5C;
}

#mailDetail .userImg {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
    display: inline-block;
    border: 1px solid #e9e9e9;

}
#mailDetail  .content{
    position:absolute;
    width:100%;
    top:0;
    left:0;
    max-height: 100%;
    height: 100%;
    overflow: scroll;
   z-index:9;
   padding-bottom:80px;
}
#mailDetail .replay {
    padding: 9px 16px;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 9999;

}

#mailDetail .replay .long_btn {
    margin: 0;
    max-width: 80px;
    margin-left: 10px;
    height: 36px;
      z-index: 999999;
}

#mailDetail .replay input {
    width: 100%;
    height: 36px;
    border: 1px solid #E2E2E2;
    border-radius: 5px;
    background: #f2f2f2;
    padding-left: 15px;
    font-size: 15px;
        padding: 0;
    margin: 0;
     z-index: 99999;
}

#mailDetail .replay input::placeholder {
    color: #A2A2A2;

}
</style>
