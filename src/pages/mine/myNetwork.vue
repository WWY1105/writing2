<template>
<div id="myNetwork" class="flexCenter">
    <!-- 上半部分 -->
    <div class="topBox bgW">
        <!-- <div class="user flexCenter">
            <img :src="$store.state.imgUrl+userData.imgurl"  class="userImg" alt  >

            <div class="text">
                <p class="name">{{userData.nickname}}</p>
                <p class="id">ID：{{userData.id}}</p>
            </div>
        </div> -->
        <!-- 二维码 -->
        <!-- <img :src="myEwm" class="ewmPic" alt> -->
        <img :src="item.src" v-for="item,index in imgArr" class="ewmPic previewer-demo-img uploadImg"    @click.stop.self="show(index)"/>
      
        <p class="mainText">邀请您加入家教家长线上平台</p>
    </div>
    <!-- 上半部分 END-->
    <p class="midTitle">上图长按保存图片后分享好友或群</p>
    <div class="mymediator topMyMediator">
        <p class="smallTitle">我的调解人</p>
        <div v-if="myMediator.length==0?false:true" v-for="item,index in myMediator" class="mediator flexSpace bgW">
            <!-- 有数据的时候 -->
            <div class="left flexStart">
                <router-link :to="{path:'/writerDetail',query:{'writerId':item.id}}">
                    <img :src="$store.state.imgUrl+item.imgurl" class="userImg mediatorImg" alt>
          </router-link>
                    <p class="name">{{item.nickname}}</p>
            </div>
            <div class="right" @click="addMyMediator">
                <i class="iconfont icon-jiantou"></i>
            </div>
        </div>

        <div class="mediator flexSpace bgW" @click="addMyMediator" v-if="myMediator.length==0?true:false">
            <!-- 没有数据的时候 -->
            <div class="left flexStart">添加我的调解人</div>
            <div class="right">
                <i class="iconfont icon-jiantou"></i>
            </div>
        </div>
    </div>
    <!-- 最底部 -->
    <div class="mymediator bottomMediator">
        <p class="smallTitle">我要调解的人</p>
        <p class="tips">
            <i class="iconfont icon-warming"></i> 下方用户产生交易时，您将获得一定比例奖励
        </p>
        <router-link :to="{path:'/writerDetail',query:{'writerId':item.id}}" class="mediator flexSpace bgW" v-for="item,index in needMediator">
            <div class="left flexStart">
                <img :src="$store.state.imgUrl+item.imgurl" class="userImg mediatorImg" alt>
                <p class="name">{{item.nickname}}</p>
            </div>
            <div class="right">
                <i class="iconfont icon-jiantou"></i>
            </div>
        </router-link>
    </div>
      <div v-transfer-dom>
            <previewer :list="imgArr" ref="previewer" :options="options"></previewer>
        </div>
</div>
</template>

<script>
import {
    AlertModule,
    Badge,
    Previewer,
    TransferDom
} from 'vux';
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
import common from "@/assets/js/common";
export default {
    data() {
        return {
            uid: this.$store.state.uid,
            pullupDefaultConfig: pullupDefaultConfig,
            pulldownDefaultConfig: pulldownDefaultConfig,
            myEwm: "",
            userData: {},
            myMediator: [],
            needMediator: [],
            imgArr: [],
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
        };
    },
    mounted() {
        this.getEWM();
        this.getWebUser(this.uid);
        this.getMediator();
        // this.imgArr=[this.userData.imgurl]
        // alert(this.userData.imgurl)
        // var obj={
        //   src:this.userData.imgurl
        // }
        // this.imgArr.push(obj);
        // console.log(this.imgArr)
    },
    components: {
        Previewer,
        TransferDom,

    },
    methods: {
        ...common,
        // 获取我的二维码
        getEWM() {
            var that = this;
            var baseUrl = this.$store.state.baseUrl;
            that
                .$http("get", baseUrl + "api/WebUser/Qr/" + that.uid)
                .then(function (res) {
                    if (res.data.code != "00") {

                        AlertModule.show({
                            title: res.data.msg
                        });
                    } else {
                        that.myEwm = res.data.data;
                        var obj = {
                            src: res.data.data
                        }
                        that.imgArr.push(obj);
                        console.log(that.imgArr)
                    }
                });
        },
        // 获取我的调解人
        getMediator() {
            var that = this;
            var baseUrl = this.$store.state.baseUrl;
            that
                .$http("get", baseUrl + "api/Mediator/List", {
                    uid: that.uid
                })
                .then(function (res) {
                    if (res.data.code != "00") {
                        AlertModule.show({
                            title: res.data.msg
                        });
                    } else {
                        that.myMediator = res.data.data.myMediator;
                        that.needMediator = res.data.data.needMediator;
                    }
                });
        },
        // 添加我的调解人
        addMyMediator() {
            this.$router.push({
                path: "/myMediator"
            });
        },
        show(i) {
            this.$refs.previewer.show(i)
        },
    }
};
</script>

<style scoped>
#myNetwork {
    width: 100%;
}

#myNetwork .midTitle {
    color: #2a2a2a;
    font-size: 14px;
    margin-top: 18px;
    margin-bottom: 36px;
}

#myNetwork .mymediator {
    width: 100%;
}

#myNetwork .topMyMediator {
    margin-bottom: 29px;
}

#myNetwork .mediator {
    padding: 17px;
}

#myNetwork .mediator p.name {
    font-size: 16px;
    color: #4d4d4d;
}

#myNetwork .mymediator .tips {
    padding-left: 19px;
    margin-bottom: 14px;
}

#myNetwork .mymediator .tips .iconfont {
    color: #f83345;
    font-size: 15px;
}

#myNetwork .mediatorImg {
    width: 36px;
    height: 36px;
    border: 2px solid #b2b2b2;
}

#myNetwork .mymediator .smallTitle {
    color: #8a8a8a;
    font-size: 13px;
    margin-bottom: 10px;
    padding-left: 19px;
}

#myNetwork .topBox {
    width: 100%;
    padding: 10px 0;
}

#myNetwork .user {
    flex-direction: row;
    padding: 11px 0;
    text-align: center;
}

#myNetwork .user .text .name {
    color: #000000;
    font-size: 16px;
    margin-bottom: 8px;
}

#myNetwork .user .text .id {
    font-size: 12px;
    color: #242424;
}

#myNetwork .userImg {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
}

#myNetwork .ewmPic {
    width: auto;
    height: 400px;
    margin: 0 auto;
    display: table;
}

#myNetwork .mainText {
    text-align: center;
    margin: 10px 0;
    font-size: 16px;
}

#myNetwork .bottomMediator {
    padding-bottom:30px;
}
</style>
