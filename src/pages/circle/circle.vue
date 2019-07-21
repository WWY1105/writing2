<template>
<div id="circle">
    <!-- 顶部的tab -->
    <div class="topBox flexSpace bgW">
        <router-link tag="div" to="/activeMessage" class="each">动态
            <badge v-if="dynamicData==0?false:true" :text="dynamicData"></badge>
        </router-link>
        <span class="line"></span>
        <div class="each" @click="toSeeMyCollection">我的收藏</div>
        <span class="line"></span>
        <router-link tag="div" :to="{path:'/myMineCircle',query:{uid:$store.state.uid}}" class="each">我的圈子</router-link>
        <router-link tag="div" to="/postCircle" class="each last">发表圈子</router-link>
    </div>
    <!-- 顶部的tab -->
    <scroller use-pullup :pullup-config="pullupDefaultConfig" @on-pullup-loading="loadMore" use-pulldown :pulldown-config="pulldownDefaultConfig" @on-pulldown-loading="refresh" lock-x ref="scrollerBottom" height="-48">
        <!-- 每一个朋友圈 -->
        <div>
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
                    <img :src="i.src" alt="" class="previewer-demo-img uploadImg" v-for="i,j in item.imgurls" @click.stop.self="show(index,j)">
                    <div v-transfer-dom>
                        <previewer :list="item.imgurls" ref="previewer" :options="options"></previewer>
                    </div>
                </div>

                <div class="btnBox flexSpace">
                    <div :aaa="item.collection"  :class="item.collection?'eachBtn flexCenter SCactive':'eachBtn flexCenter'" @click.stop="toCollection(item.id)"><i class="iconfont icon-tubiaozhizuomoban"></i> {{item.collectionCount==0?'':item.collectionCount}}收藏</div>
                    <div :class="item.like?'eachBtn flexCenter DZactive':'eachBtn flexCenter '" @click.stop="toLike(index)"><i class="iconfont icon-aixin"></i> {{item.likeCount==0?'':item.likeCount}}点赞</div>
                    <div class="eachBtn flexCenter " @click.stop="toComment(item.id)"><i class="iconfont icon-tubiaopinglunshu"></i> {{item.commentCount==0?'':item.commentCount}}评论</div>
                </div>
            </div>
        </div>
    </scroller>
    <appFooter :nowPath="nowPath"></appFooter>
</div>
</template>

<script>
import common from "@/assets/js/common";
import appFooter from '@/components/footer/appFooter'
import {
    Flexbox,
    FlexboxItem,
    AlertModule,
    Badge,
    Previewer,
    TransferDom,
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
        Badge,
        Previewer,
        TransferDom,
        appFooter,
        Scroller
    },
    directives: {
        TransferDom
    },
    data() {
        return {
            nowPage: 1,
            pullupDefaultConfig: pullupDefaultConfig,
            pulldownDefaultConfig: pulldownDefaultConfig,
            postData: {
                loginUid:this.$store.state.uid,
                pageSize:10,
                currentPage:1
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
            circleList: [],
            dynamicData: '',
            nowPath: '/circle',
            uid: this.$store.state.uid
        }
    },
    mounted() {
        var that = this;
        that.circleList=[]
        // 上拉刷新！---------------------------------
        that.$nextTick(() => {
            that.$refs.scrollerBottom.reset({
                top: 0
            });
        });
        that.loadMore();
        // 圈子列表
        // this.getCircleList()
        // 圈子动态
        that.getCircleDynamic()
    },
    methods: {
        ...common,
        // ========================================
        refresh() {
            var that = this;
             var that = this;
              that.getCircleList(data => {
                // that.postList = data;

                if ( that.postData.currentPage == 1) {
                    //禁止上啦，已经没有数据
                    that.$refs.scrollerBottom.disablePulldown();
                }
                that.circleList =data;
                that.$refs.scrollerBottom.donePulldown();
            });
            if(that.postData.currentPage>0){
                that.postData.currentPage--;
            }
            
            that.postData.pageSize =10;
        },
        loadMore() {
            var that = this;
            that.getCircleList(data => {
                
                if (data.length <= 4) {
                    that.$refs.scrollerBottom.disablePullup();
                }
                 that.circleList = that.circleList.concat(data);
                that.$refs.scrollerBottom.donePullup();
              
            });
           
            that.postData.currentPage = that.nowPage;
            that.nowPage++;
           
        },
        // ======================================
        // 动态
        getCircleDynamic() {
            var that = this;
            var baseUrl = this.$store.state.baseUrl;
            that.$http('get', baseUrl + 'api/Circle/Dynamic/Count', {
                uid: that.uid
            }).then(function (res) {

                if (res.data.code != '00') {
                    AlertModule.show({
                        title: res.data.msg
                    })
                } else {
                    that.dynamicData = res.data.data
                    // alert(res.data.data)
                }

            })
        },
        // 收藏
        toCollection(id) {
            var that = this;
            var postData = {
                uid: this.uid,
                circleId: id
            }
            that.$http('post', that.$store.state.baseUrl + 'api/Circle/Collection', postData).then(function (res) {
                if (res.data.code != '00') {
                    AlertModule.show({
                        title: res.data.msg
                    })
                } else {
                    that.circleList=[];
                    that.nowPage=1;
                    that.postData.currentPage=that.nowPage;
                    that.loadMore()
                    // that.getCircleList()
                }
            })
        },
        // 点赞
        toLike(index) {
            var that = this;
            var postData = {
                uid: this.uid,
                circleId: that.circleList[index].id
            }
            that.$http('post', that.$store.state.baseUrl + 'api/Circle/Like', postData).then(function (res) {
                if (res.data.code != '00') {
                    AlertModule.show({
                        title: res.data.msg
                    })
                } else {
                    // that.circleList[index].like=true;
                     that.circleList=[];
                    that.nowPage=1;
                    that.postData.currentPage=that.nowPage;
                    that.loadMore()
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
        // 查看我的收藏
        toSeeMyCollection(fn) {
           this.$router.push({
                path: '/myCollectionCircle',
                // query: {
                //     circleId: id
                // }
            })
        },
        // 获取圈子列表
        getCircleList(fn) {
            var that = this;
            var baseUrl = this.$store.state.baseUrl;
            // that.postData.currentPage = that.nowPage;
            // that.postData.loginUid = that.uid

            that.$http('get', baseUrl + 'api/Circle/Page', that.postData).then(function (res) {
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
                    fn(res.data.data)
                }
                console.log('圈子列表')
                console.log(result)
                //  that.circleList = result;
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
                      that.circleList=[];
                    that.nowPage=1;
                    that.postData.currentPage=that.nowPage;
                    that.loadMore()
                }
            })
            this.circleList[i].follow = !this.circleList[i].follow;
        },

        show(index,j) {
            console.log(j+'---'+index)
            console.log(this.$refs.previewer)
            this.$refs.previewer[index].show(j)
        },
    }
}
</script>

<style scoped>
#circle {
    padding-bottom: 55px;
    background: #f5f5f5;
}

#circle .topBox {
    height: 40px;
    line-height: 40px;
    padding-left: 28px;
    margin-bottom: 10px;
    border-bottom:1px solid #cecece;
}

#circle .topBox .each {
    text-align: center;

}

#circle .topBox .each.last {
    color: #fff;
    background: #3375C5;
    padding: 0 18px;
}

#circle .topBox .line {
    width: 1px;
    height: 28px;
    background: #cecece;
    display: inline-block;
}

#circle .eachCircle {
    margin-bottom: 10px;
    padding-bottom: 18px;
}

#circle .eachCircle .top {
    padding: 13px 19px 18px 11px;
    align-items: flex-start;
}

#circle .eachCircle .top .left {
    align-items: flex-start;
}

#circle .eachCircle .top .left .name {
    color: #333333;
    font-size: 15px;
    margin-bottom: 10px;
}

#circle .eachCircle .top .left .date {
    color: #686868;
    font-size: 10px;
}

#circle .eachCircle .top .right .fellowBtn {
    color: #989898;
    font-size: 12px;
    padding: 4px 7px;
    border: 1px solid #B2B2B2;
    border-radius: 2px;
}

#circle .eachCircle .top .right .fellowBtn.active {
    color: #3375C5;
    font-size: 12px;
    padding: 4px 7px;
    border: 1px solid #3375C5;
    border-radius: 2px;
}

#circle .eachCircle .textContent {
    padding-left: 64px;
    color: #333333;
    font-size: 12px;
    margin-bottom: 15px;
    padding-right: 64px;
    word-wrap: break-word;
}

#circle .eachCircle .picBox {
    padding-left: 64px;
    padding-right: 64px;
    flex-wrap: wrap;
}

#circle .eachCircle .picBox .uploadImg {
    height: 79px;
    width: 79px;
    margin-left: 5px;
}

#circle .eachCircle .btnBox {
    padding-left: 64px;
    padding-right: 17px;
    margin-top: 20px;
}

#circle .eachCircle .btnBox .eachBtn {
    flex-direction: row;
}

#circle .eachCircle .btnBox .eachBtn.SCactive {
    fill: #3375C5;
    color: #3375C5;
}

#circle .eachCircle .btnBox .eachBtn.DZactive {
    fill: #EA4A5C;
    color: #EA4A5C;
}

#circle .eachCircle .btnBox .eachBtn i {
    margin-right: 3px;
}
</style>
