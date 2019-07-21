<template>
<div id="myMineCircle">
    <div class="noDataBox" v-if="circleList.length==0"><span> 暂无内容</span></div>
    <scroller v-if="circleList.length!=0" use-pullup :pullup-config="pullupDefaultConfig" @on-pullup-loading="loadMore" use-pulldown :pulldown-config="pulldownDefaultConfig" @on-pulldown-loading="refresh" lock-x ref="scrollerBottom" height="-48">
        <!-- 每一个朋友圈 -->
        <div class="eachCircle bgW" v-for="item,index in circleList" @click="toComment(item.id)">
            <div class="top flexSpace">
                <div class="left flexStart">
                    <!-- <img :src="item.imgurl" class="userImg" alt=""> -->
                    <div class="text">
                        <!-- <p class="name">{{item.nickname==''?'暂无':item.nickname}}</p> -->
                        <p class="date">{{item.createTime}}</p>
                    </div>
                </div>
                <!-- <div class="right">
                <div class="fellowBtn active" v-if="!item.follow" @click="toFellow(index)">+关注</div>
                <div class="fellowBtn" v-if="item.follow" @click="toFellow(index)">已关注</div>
            </div> -->
            </div>

            <p class="textContent">{{item.content}}</p>
            <div class="picBox" v-if="item.imgurls.length==0?false:true">
                <img :src="i.src" alt="" class="previewer-demo-img uploadImg" v-for="i,j in item.imgurls"  @click.stop.self="show(index,j)">
                <div v-transfer-dom>
                    <previewer :list="item.imgurls" ref="previewer" :options="options"></previewer>
                </div>
            </div>

            <div class="btnBox flexSpace">
                <div :class="item.collection?'eachBtn flexCenter SCactive':'eachBtn flexCenter'" @click.stop="toCollection(item.id)"><i class="iconfont icon-tubiaozhizuomoban"></i> {{item.collectionCount==0?'':item.collectionCount}}收藏</div>
                <div :class="item.like?'eachBtn flexCenter DZactive':'eachBtn flexCenter '" @click.stop="toLike(item.id)"><i class="iconfont icon-aixin"></i> {{item.likeCount==0?'':item.likeCount}}点赞</div>
                <div class="eachBtn flexCenter " @click="toComment(item.id)"><i class="iconfont icon-tubiaopinglunshu"></i> {{item.commentCount==0?'':item.commentCount}}评论</div>
            </div>
        </div>
    </scroller>
</div>
</template>

<script>
import {
    Flexbox,
    FlexboxItem,
    AlertModule,
    Previewer,
    Scroller
} from 'vux'
const pulldownDefaultConfig = {
    content: "下拉刷新",
    height: 40,
    autoRefresh: false,
    downContent: "下拉刷新",
    upContent: "释放后刷新",
    loadingContent: "正在刷新...",
    clsPrefix: "xs-plugin-pulldown-"
};
const pullupDefaultConfig = {
    content: "上拉加载更多",
    pullUpHeight: 60,
    height: 40,
    autoRefresh: false,
    downContent: "释放后加载",
    upContent: "上拉加载更多",
    loadingContent: "加载中...",
    clsPrefix: "xs-plugin-pullup-"
};
export default {
    components: {
        Flexbox,
        FlexboxItem,
        AlertModule,
        Previewer,
        Scroller
    },
    data() {
        return {
            nowPage: 1,
            pullupDefaultConfig: pullupDefaultConfig,
            pulldownDefaultConfig: pulldownDefaultConfig,
            circleList: [],
            uid: this.$route.query.uid,
            loginUid: this.$store.state.uid,
            postData: {
                currentPage: 1
            },
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
            },
        }
    },
    mounted() {
        var that = this;
        that.postData.currentPage = that.nowPage;
        that.postData.pageSize = 10;
        that.circleList = []
        // this.getCircleLoist()
        // 上拉刷新！---------------------------------
        // that.$nextTick(() => {
        //     that.$refs.scrollerBottom.reset({
        //         top: 0
        //     });
        // });
        that.loadMore();
    },
    methods: {
        // ========================================
        refresh() {
            var that = this;
            that.getCircleLoist(data => {
                // that.postList = data;

                if (that.postData.currentPage == 1) {
                    //禁止上啦，已经没有数据
                    that.$refs.scrollerBottom.donePulldown();
                }
                that.circleList = data;
                that.$refs.scrollerBottom.donePulldown();
            });
            if (that.postData.currentPage > 0) {
                that.postData.currentPage--;
            }

            that.postData.pageSize = 10;

        },
        loadMore() {
            var that = this;
            that.getCircleLoist(data => {
                // alert(data.length)
                if (data.length <= 0) {
                    //禁止上啦，已经没有数据
                    that.$refs.scrollerBottom.disablePullup();
                    // return false;
                }
                that.circleList = that.circleList.concat(data);
                that.$refs.scrollerBottom.donePullup();
            });
            that.postData.currentPage = that.nowPage;
            that.nowPage++;

            that.postData.pageSize =10;

        },
        // ======================================
        // 查看图片
        show(index, j) {
            console.log('---' + index)
            console.log(this.$refs.previewer)
            this.$refs.previewer[index].show(j)
        },
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
                    that.circleList = []
                    that.nowPage = 1;
                    that.loadMore()
                }
            })
        },
        // 查看圈子详情
        toComment(id) {
            alert(id)
            this.$router.push({
                path: '/circleDetail',
                query: {
                    circleId: id
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
                    that.circleList = []
                    that.nowPage = 1;
                    that.loadMore()
                    // that.getCircleLoist()
                }
            })
        },
        // 评论
        toComment(id) {
            this.$router.push({
                path: '/circleDetail',
                query: {
                    circleId: id
                }
            })
        },

        // 获取圈子列表
        getCircleLoist(fn) {
            var that = this;
            var baseUrl = this.$store.state.baseUrl;
            that.postData.currentPage = that.nowPage;
            that.postData.loginUid = that.loginUid;
            that.postData.uid = that.uid
            that.$http('get', baseUrl + 'api/Circle/Page', that.postData).then(function (res) {
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

                // that.circleList = result;
                fn(result)
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
                    that.nowPage = 1;
                    that.loadMore()
                    // that.getCircleLoist()
                }
            })
            this.circleList[i].follow = !this.circleList[i].follow;
        }
    }
}
</script>

<style scoped>
#myMineCircle {
    height: 100%;
}

#myMineCircle .eachCircle {
    margin-bottom: 10px;
    padding-bottom: 18px;
}

.noDataBox {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

#myMineCircle .eachCircle .top {
    padding: 13px 19px 10px 30px;
    align-items: flex-end;
}

#myMineCircle .eachCircle .top .left {
    align-items: flex-start;
}

#myMineCircle .eachCircle .top .left .name {
    color: #333333;
    font-size: 15px;
    margin-bottom: 10px;
}

#myMineCircle .eachCircle .top .left .date {
    color: #686868;
    font-size: 10px;
}

#myMineCircle .eachCircle .top .right .fellowBtn {
    color: #989898;
    font-size: 12px;
    padding: 4px 7px;
    border: 1px solid #B2B2B2;
    border-radius: 2px;
}

#myMineCircle .eachCircle .top .right .fellowBtn.active {
    color: #3375C5;
    font-size: 12px;
    padding: 4px 7px;
    border: 1px solid #3375C5;
    border-radius: 2px;
}

#myMineCircle .eachCircle .textContent {
    padding-left: 30px;
    color: #333333;
    font-size: 12px;
    margin-bottom: 15px;
    padding-right: 64px;
    word-wrap: break-word;
}

#myMineCircle .eachCircle .picBox {
    padding-left: 30px;
    padding-right: 64px;
}

#myMineCircle .eachCircle .picBox .uploadImg {
    height: 79px;
    width: 79px;
}

#myMineCircle .eachCircle .btnBox {
    padding-left: 64px;
    padding-right: 17px;
    margin-top: 20px;
}

#myMineCircle .eachCircle .btnBox .eachBtn {
    flex-direction: row;
}

#myMineCircle .eachCircle .btnBox .eachBtn.SCactive {
    fill: #3375C5;
    color: #3375C5;
}

#myMineCircle .eachCircle .btnBox .eachBtn.DZactive {
    fill: #EA4A5C;
    color: #EA4A5C;
}

#myMineCircle .eachCircle .btnBox .eachBtn i {
    margin-right: 3px;
}
</style>
