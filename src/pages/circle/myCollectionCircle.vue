<template>
<div id="myCollectionCircle">
    <div class="noDataBox" v-if="circleList.length==0"><span> 暂无内容</span></div>
    <div class="eachCircle bgW" v-for="item,index in circleList" @click="toComment(item.id)">
                <div class="top flexSpace">
                    <div class="left flexStart">
                        <img :src="$store.state.imgUrl+item.imgurl" class="userImg" alt="" @click.stop="seeUserDetail(item.uid)">
                        <div class="text">
                            <p class="name">{{item.nickname==''?'暂无':item.nickname}}</p>
                            <p class="date">{{item.createTime}}</p>
                        </div>
                    </div>
                    <div class="right">
                        <div class="fellowBtn active" v-if="!item.follow" @click.stop="toFellow(index)">+关注</div>
                        <div class="fellowBtn" v-if="item.follow" @click.stop="toFellow(index)">已关注</div>
                    </div>
                </div>
                <p class="textContent">{{item.content}}</p>
                <div class="picBox flexStart" v-if="item.imgurls.length==0?false:true">
                    <img :src="i.src" alt="" class="previewer-demo-img uploadImg" v-for="i,j in item.imgurls" @click.stop="show(j)">
                    <div v-transfer-dom>
                        <previewer :list="item.imgurls" ref="previewer" :options="options"></previewer>
                    </div>
                </div>

                <div class="btnBox flexSpace">
                    <div :class="item.collection?'eachBtn flexCenter SCactive':'eachBtn flexCenter'" @click.stop="toCollection(item.id)"><i class="iconfont icon-tubiaozhizuomoban"></i> {{item.collectionCount==0?'':item.collectionCount}}收藏</div>
                    <div :class="item.like?'eachBtn flexCenter DZactive':'eachBtn flexCenter '" @click.stop="toLike(item.id)"><i class="iconfont icon-aixin"></i> {{item.likeCount==0?'':item.likeCount}}点赞</div>
                    <div class="eachBtn flexCenter " @click.stop="toComment(item.id)"><i class="iconfont icon-tubiaopinglunshu"></i> {{item.commentCount==0?'':item.commentCount}}评论</div>
                </div>
            </div>
    </div>
    
</template>

<script>
import {
    Flexbox,
    FlexboxItem,
    AlertModule
} from 'vux'

export default {
    components: {
        Flexbox,
        FlexboxItem,
        AlertModule
    },
    data() {
        return {
            circleList: [],
            uid:this.$route.query.uid,
            loginUid: this.$store.state.uid
        }
    },
    mounted() {
        this.toSeeMyCollection()
    },
    methods: {

        // 收藏
        toCollection(id) {
            var that = this;
            var postData = {
                uid: this.loginUid,
                circleId: id
            }
            that.$http('post', that.$store.state.baseUrl + 'api/Circle/Collection', postData).then(function (res) {
                if (res.data.code != '00') {
                    AlertModule.show({
                        title: res.data.msg
                    })
                } else {
                    that.toSeeMyCollection()
                }
            })
        },
        // 点赞
        toLike(id) {
            var that = this;
            var postData = {
                uid: this.loginUid,
                circleId: id
            }
            that.$http('post', that.$store.state.baseUrl + 'api/Circle/Like', postData).then(function (res) {
                if (res.data.code != '00') {
                    AlertModule.show({
                        title: res.data.msg
                    })
                } else {
                    that.toSeeMyCollection()
                }
            })
        },
        // 评论
        toComment(id) {
            this.$router.push({
                path:'/circleDetail',
                query:{
                    circleId:id
                }
            })
        },
         // 查看我的收藏
        toSeeMyCollection() {
            var that = this;
            var postData = {
                uid: this.loginUid,
                currentPage: 1
            }
            that.$http('get', that.$store.state.baseUrl + 'api/Circle/Collection/Page', postData).then(function (res) {
                if (res.data.code != '00') {
                    AlertModule.show({
                        title: res.data.msg
                    })
                } else {
                    var result = res.data.data;
                    for (var i in result) {
                        if (result[i].imgurls != '') {
                            //什么都没有
                            if (result[i].imgurls.indexOf(',') == -1) {
                                // 没有逗号，只有一条数据
                                var Arr = []
                                var obj = {
                                    src: that.$store.state.imgUrl + result[i].imgurls
                                }
                                Arr.push(obj)
                                result[i].imgurls = Arr;
                            } else {
                                result[i].imgurls = result[i].imgurls.split(',')
                                var arr2 = []
                                for (var k in result[i].imgurls) {
                                    var obj = {};
                                    obj.src = that.$store.state.imgUrl + result[i].imgurls[k];
                                    arr2.push(obj)
                                }
                                result[i].imgurls = arr2;
                            }
                        }
                    }
                     that.circleList = result;

                }
            })
        },
      
        // 关注
        toFellow(i) {
            var that = this;
            var postData = {
                uid: this.uid,
                followingUid: this.circleList[i].uid
            }
            that.$http('post', that.$store.state.baseUrl + 'api/UserFollowing', postData).then(function (res) {
                if (res.data.code != '00') {
                    AlertModule.show({
                        title: res.data.msg
                    })
                } else {
                    that.toSeeMyCollection()
                }
            })
            this.circleList[i].follow = !this.circleList[i].follow;
        }
    }
}
</script>

<style scoped>
#myCollectionCircle{
    height: 100%;
}
.noDataBox{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
 
#myCollectionCircle .eachCircle {
    margin-bottom: 10px;
    padding-bottom: 18px;
}

#myCollectionCircle .eachCircle .top {
    padding: 13px 19px 18px 11px;
    align-items: flex-start;
}

#myCollectionCircle .eachCircle .top .left {
    align-items: flex-start;
}

#myCollectionCircle .eachCircle .top .left .name {
    color: #333333;
    font-size: 15px;
    margin-bottom: 10px;
}

#myCollectionCircle .eachCircle .top .left .date {
    color: #686868;
    font-size: 10px;
}

#myCollectionCircle .eachCircle .top .right .fellowBtn {
    color: #989898;
    font-size: 12px;
    padding: 4px 7px;
    border: 1px solid #B2B2B2;
    border-radius: 2px;
}

#myCollectionCircle .eachCircle .top .right .fellowBtn.active {
    color: #3375C5;
    font-size: 12px;
    padding: 4px 7px;
    border: 1px solid #3375C5;
    border-radius: 2px;
}

#myCollectionCircle .eachCircle .textContent {
    padding-left: 64px;
    color: #333333;
    font-size: 12px;
    margin-bottom: 15px;
    padding-right: 64px;
    word-wrap: break-word;
}

#myCollectionCircle .eachCircle .picBox {
    padding-left: 64px;
    padding-right: 64px;
}

#myCollectionCircle .eachCircle .picBox .uploadImg {
    height: 79px;
    width: 79px;
    margin-left: 5px;
}

#myCollectionCircle .eachCircle .btnBox {
    padding-left: 64px;
    padding-right: 17px;
    margin-top: 20px;
}

#myCollectionCircle .eachCircle .btnBox .eachBtn {
    flex-direction: row;
}

#myCollectionCircle .eachCircle .btnBox .eachBtn.SCactive {
    fill: #3375C5;
    color: #3375C5;
}

#myCollectionCircle .eachCircle .btnBox .eachBtn.DZactive {
    fill: #EA4A5C;
    color: #EA4A5C;
}

#myCollectionCircle .eachCircle .btnBox .eachBtn i {
    margin-right: 3px;
}
</style>
