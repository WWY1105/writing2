<template>
<div id="circleDetail">
    <!-- 每一个朋友圈 -->
    <div class="eachCircle bgW">
        <div class="top flexSpace">
            <div class="left flexStart">
                <router-link tag="img" :to="{path:'/writerDetail',query:{'writerId':circleDetail.uid}}"   :src="$store.state.imgUrl+circleDetail.imgurl" class="userImg" alt @click="seeUserDetail(item.uid)"></router-link>
                <div class="text">
                    <p class="name">{{circleDetail.nickname==''?'暂无':circleDetail.nickname}}</p>
                    <p class="date">{{circleDetail.createTime}}</p>
                </div>
            </div>
            <div class="right">
                <div class="fellowBtn active" v-if="!circleDetail.follow" @click="toFellow(index)">+关注</div>
                <div class="fellowBtn" v-if="circleDetail.follow" @click="toFellow(index)">已关注</div>
            </div>
        </div>
        <p class="textContent">{{circleDetail.content}}</p>
        <div class="picBox flexStart" v-if="circleDetail.imgurls.length==0?false:true">
            <img class="previewer-demo-img uploadImg" v-for="(item, index) in circleDetail.imgurls" :src="item.src"  @click="show(index)">
            <div v-transfer-dom>
                <previewer :list="circleDetail.imgurls" ref="previewer" :options="options"></previewer>
            </div>
        </div>

        <div class="btnBox flexSpace">
            <div :class="circleDetail.collection?'eachBtn flexCenter SCactive':'eachBtn flexCenter'" @click="toCollection(circleDetail.id)">
                <i class="iconfont icon-tubiaozhizuomoban"></i>
                {{circleDetail.collectionCount==0?'':circleDetail.collectionCount}}收藏
            </div>
            <div :class="circleDetail.like?'eachBtn flexCenter DZactive':'eachBtn flexCenter '" @click="toLike(circleDetail.id)">
                <i class="iconfont icon-aixin"></i>
                {{circleDetail.likeCount==0?'':circleDetail.likeCount}}点赞
            </div>
            <div class="eachBtn flexCenter" @click="toComment(circleDetail.id)">
                <i class="iconfont icon-tubiaopinglunshu"></i>
                {{circleDetail.commentCount==0?'':circleDetail.commentCount}}评论
            </div>
        </div>
    </div>

    <!-- 点赞 -->
    <div class="likes flexStart">
        <div class="icon">
            <i class="iconfont icon-aixin"></i>
        </div>
        <div class="likesImg">
             <router-link tag="img" :to="{path:'/writerDetail',query:{'writerId':item.uid}}"  :src="$store.state.imgUrl+item.imgurl" alt class="smallImg" v-for="item,index in circleDetail.likes"></router-link>
           <!-- <router-link :to="{path:'/writerDetail',query:{'writerId':item.id}}" 
               
           </router-link> -->
            </div>
        </div>
        <!-- 评论 -->
        <div class="comment flexStart">
            <div class="icon">
                <i class="iconfont icon-tubiaopinglunshu"></i>
            </div>
            <div class="eachComment flexStart" v-for="item,index in circleDetail.comments" @click.stop.prevent="toReply(item.uid)">
               <router-link tag="img" :to="{path:'/writerDetail',query:{'writerId':item.uid}}"   :src="$store.state.imgUrl+item.imgurl" alt class="smallImg">></router-link>
                <div class="text">
                    <div class="name">{{item.nickname}}
                        <span v-if="item.commentNickname==null?false:true" class="replyText">回复</span>
                        <span >{{item.commentNickname}}</span>
                    </div>
                    <p class="textDetail">{{item.content}}</p>
                </div>
            </div>
            <!-- <div class="eachComment flexStart">
                <img src="../../assets/logo.png" alt class="smallImg">
                <div class="text">
                    <p class="name">小初高数李家教</p>
                    <p class="textDetail">老师还收学生吗，发了私信给您，业余时间还请指 导一下，谢谢！</p>
                </div>
      </div>-->
        </div>
        <!-- 底部添加评论 -->
        <div class="replay bgW flexBox">
            <input 
        type="serch"
        ref="sendMsgInput"
        v-model="content"
        placeholder="添加评论"
      >
      <button class="addPl" @click="sendMsg">发送</button>
    </div>
        </div>
</template>

<script>
import common from "@/assets/js/common";
import {
    Flexbox,
    FlexboxItem,
    AlertModule,
    Previewer,
    TransferDom
} from "vux";

export default {
    components: {
        Flexbox,
        FlexboxItem,
        AlertModule,
        Previewer,
        TransferDom
    },
    data() {
        return {
            circleId: '',
            circleDetail: {},
            content: "",
            isFocus: false,
            isCommentOther: false,
            commentUid: "",
            uid: this.$store.state.uid,
            options: {
                getThumbBoundsFn(index) {
                    // find thumbnail element
                    let thumbnail = document.querySelectorAll('.previewer-demo-img')[index]
                    // get window scroll Y
                    let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
                    // optionally get horizontal scroll
                    // get position of element relative to viewport
                    let rect = thumbnail.getBoundingClientRect()
                    // w = width
                    return {
                        x: rect.left,
                        y: rect.top + pageYScroll,
                        w: rect.width
                    }
                    // Good guide on how to get element coordinates:
                    // http://javascript.info/tutorial/coordinates
                }
            }
        };
    },
    mounted() {
        this.circleId = this.$route.query.circleId;
        // this.circleId = 2;
        // 获取圈子详情
        this.getCircleDetail();

    },
    methods: {
        ...common,
        // 获取圈子详情
        getCircleDetail() {
            var that = this;
            var post={
                loginUid:that.uid
            }
            that
                .$http("get", that.$store.state.baseUrl + "api/Circle/" + that.circleId,post)
                .then(function (res) {
                    if (res.data.code != "00") {
                        AlertModule.show({
                            title: res.data.msg
                        });
                    } else {
                        var result = res.data.data;
                        if (result.imgurls != '') {
                            //什么都没有
                            if (result.imgurls.indexOf(',') == -1) {
                                // 没有逗号，只有一条数据
                                var Arr = []
                                var obj = {
                                    src: that.$store.state.imgUrl+result.imgurls
                                }
                                Arr.push(obj)
                                result.imgurls = Arr;
                            } else {
                                result.imgurls = result.imgurls.split(',')
                                var arr2 = []
                                for (var k in result.imgurls) {
                                    var obj = {};
                                    obj.src = that.$store.state.imgUrl+result.imgurls[k];
                                    arr2.push(obj)
                                }
                                result.imgurls = arr2;
                            }
                        }
                        that.circleDetail = result;
                        console.log("圈子详情");
                        console.log(that.circleDetail);
                    }
                });
        },
        show(index) {
            console.log(index)
             console.log(this.$refs.previewer)
            this.$refs.previewer.show(index)
        },
        // 发送评论
        sendMsg(event) {
            console.log(this.isCommentOther);
            if (this.isCommentOther) {
                // 回复别人的评论
               
                    //如果按的是enter键 13是enter
                    event.preventDefault(); //禁止默认事件（默认是换行）
                    var that = this;
                    var postData = {
                        uid: this.uid,
                        circleId: that.circleDetail.id,
                        content: that.content,
                        commentId: that.commentUid
                    };
                    that
                        .$http(
                            "post",
                            that.$store.state.baseUrl + "api/Circle/comment",
                            postData
                        )
                        .then(function (res) {
                            if (res.data.code != "00") {
                                that.isCommentOther = false;
                                AlertModule.show({
                                    title: res.data.msg
                                });
                            } else {
                                that.getCircleDetail();
                                that.content = "";
                            }
                        });
                
            } else {
                
                    //如果按的是enter键 13是enter
                    event.preventDefault(); //禁止默认事件（默认是换行）
                    var that = this;
                    var postData = {
                        uid: this.uid,
                        circleId: that.circleDetail.id,
                        content: that.content
                    };
                    that
                        .$http(
                            "post",
                            that.$store.state.baseUrl + "api/Circle/comment",
                            postData
                        )
                        .then(function (res) {
                            if (res.data.code != "00") {
                                AlertModule.show({
                                    title: res.data.msg
                                });
                            } else {
                                that.getCircleDetail();
                                that.content = "";
                            }
                        });
                
            }
        },
        // 评论
        toComment(uid) {
            this.$refs["sendMsgInput"].focus();
        },
        // 收藏
        toCollection(id) {
            var that = this;
            var postData = {
                uid: this.uid,
                circleId: id
            };
            that
                .$http(
                    "post",
                    that.$store.state.baseUrl + "api/Circle/Collection",
                    postData
                )
                .then(function (res) {
                    if (res.data.code != "00") {
                        AlertModule.show({
                            title: res.data.msg
                        });
                    } else {
                        that.getCircleDetail();
                    }
                });
        },
        // 点赞
        toLike(id) {
            var that = this;
            var postData = {
                uid: this.uid,
                circleId: id
            };
            that
                .$http("post", that.$store.state.baseUrl + "api/Circle/Like", postData)
                .then(function (res) {
                    if (res.data.code != "00") {
                        AlertModule.show({
                            title: res.data.msg
                        });
                    } else {
                        that.getCircleDetail();
                    }
                });
        },
        // 关注
        toFellow(i) {
            var that = this;
            var postData = {
                uid: that.uid,
                followingUid: that.circleDetail.uid
            };
            that
                .$http(
                    "post",
                    that.$store.state.baseUrl + "api/UserFollowing",
                    postData
                )
                .then(function (res) {
                    if (res.data.code != "00") {
                        AlertModule.show({
                            title: res.data.msg
                        });
                    } else {
                        that.getCircleDetail();
                    }
                });
            this.circleList[i].follow = !this.circleList[i].follow;
        },
        // 回复评论
        toReply(uid) {
            this.commentUid = uid;
            this.$refs["sendMsgInput"].focus();
            this.isCommentOther = true;
        }
    }
};
</script>

<style scoped>
#circleDetail {
    position: relative;
    padding-bottom: 60px;
    height: 100%;
}

#circleDetail .eachCircle {
    margin-bottom: 10px;
    padding-bottom: 18px;
}

#circleDetail .eachCircle .top {
    padding: 13px 19px 18px 11px;
    align-items: flex-start;
}

#circleDetail .eachCircle .top .left {
    align-items: flex-start;
}

#circleDetail .eachCircle .top .left .name {
    color: #333333;
    font-size: 15px;
    margin-bottom: 10px;
}

#circleDetail .eachCircle .top .left .date {
    color: #686868;
    font-size: 10px;
}
#circleDetail .eachCircle .top .right .fellowBtn{
    color: #989898;
    font-size: 12px;
    padding: 4px 7px;
    border: 1px solid #B2B2B2;
    border-radius: 2px;
}
#circleDetail .eachCircle .top .right .fellowBtn.active {
    color: #3375c5;
    font-size: 12px;
    padding: 4px 7px;
    border: 1px solid #3375c5;
    border-radius: 2px;
}

#circleDetail .eachCircle .textContent {
    padding-left: 64px;
    color: #333333;
    font-size: 12px;
    margin-bottom: 15px;
    word-break: break-word;
    padding-right: 19px;
}

#circleDetail .eachCircle .picBox {
    padding-left: 64px;
    padding-right: 64px;
}

#circleDetail .eachCircle .picBox .uploadImg {
    height: 79px;
    width: 79px;
    margin-left: 5px;
}

#circleDetail .eachCircle .btnBox {
    padding-left: 64px;
    padding-right: 17px;
    margin-top: 20px;
}

#circleDetail .eachCircle .btnBox .eachBtn {
    flex-direction: row;
    padding: 10px;
}

#circleDetail .eachCircle .btnBox .eachBtn i {
    margin-right: 3px;
}

#circleDetail .replay {
    padding: 9px 16px;
    display: flex;
     position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
}
#circleDetail .addPl{
        height: 36px;
    width: 60px;
    text-align: center;
    border: none;
    background: #3375c5;
    border-radius: 5px;
    color: #fff;
    margin-left: 5px;
}
#circleDetail .replay input {
    width: 100%;
    height: 36px;
    border: 1px solid #e2e2e2;
    border-radius: 5px;
    background: #f2f2f2;
    padding-left: 15px;
    font-size: 15px;
}

#circleDetail .replay input::placeholder {
    color: #a2a2a2;
}

#circleDetail .likes {
    align-items: flex-start;
    border-bottom: 1px solid #fff;
    min-height: 35px;
}

#circleDetail .likes .icon {
    margin-left: 10px;
    margin-right: 10px;
}

#circleDetail .likes .smallImg {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 7px;
    margin-bottom: 16px;
}

#circleDetail .likes .likesImg {
    padding-top: 10px;
}

/* 评论  common*/

#circleDetail .comment {
    align-items: flex-start;
    padding-top: 7px;
    flex-wrap: wrap;
    padding-bottom: 54px;
}

#circleDetail .comment .icon {
    margin-left: 10px;
    margin-right: 10px;
}

#circleDetail .comment .smallImg {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 7px;
    margin-bottom: 16px;
    margin-left: 27px;
}

#circleDetail .comment .eachComment {
    margin-top: 15px;
    align-items: flex-start;
    width: 100%;
}

#circleDetail .comment .eachComment .name {
    color: #3375c5;
    font-size: 13px;
    font-weight: bold;
    margin-bottom: 9px;
}

#circleDetail .comment .eachComment .name .replyText {
    color: #333333;
}

#circleDetail .comment .eachComment .text {
    border-bottom: 1px solid #bbbbbb;
    padding-bottom: 15px;
    width: 100%;
}

#circleDetail .comment .eachComment .textDetail {
    color: #333333;
    font-size: 13px;
    margin-right: 17px;
}

#circleDetail .eachCircle .btnBox .eachBtn {
    flex-direction: row;
}

#circleDetail .eachCircle .btnBox .eachBtn.SCactive {
    fill: #3375c5;
    color: #3375c5;
}

#circleDetail .eachCircle .btnBox .eachBtn.DZactive {
    fill: #ea4a5c;
    color: #ea4a5c;
}

#circleDetail .eachCircle .btnBox .eachBtn i {
    margin-right: 3px;
}
</style>
