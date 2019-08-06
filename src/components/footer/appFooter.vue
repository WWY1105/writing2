<template>
    <div id="footer">
        <!--<yd-tabbar fixed active-color="#3375C5">
                            <yd-tabbar-item  v-for='item,index in routers' :title="item.name" :link="item.link" :active="item.active" :key="index">
                                <p name="home" slot="icon" :class="item.iconfontName" size="0.54rem"></p>
                            </yd-tabbar-item>
                        </yd-tabbar>-->
        <!--@click.native="tabActive(index)"-->
        <tabbar>
            <tabbar-item :show-dot="msgList.length>0&&index==2?true:false" :selected="nowPath==item.link?true:false" v-for="item,index in routers" is-link :link="item.link" :key="index" >
                <img slot="icon" :src="item.activeSrc" v-if="nowPath==item.link?true:false" :class="item.i"/>
                <img slot="icon" :src="item.src" v-if="nowPath!=item.link?true:false" :class="item.i"/>
                <span slot="label">{{item.name}}</span>
            </tabbar-item>
        </tabbar>
    </div>
</template>

<script >
import Vue from 'vue'
import { Tabbar, TabbarItem, Group, Cell } from 'vux'
export default {
    name: 'appFooter',
    data() {
        return {
            isActive: true,
            routers: [
                {
                    name: '找家教',
                    activeSrc: './static/a.png',
                    src:'./static/a1.png',
                    link: '/index',
                    active: true,
                    i:'one'
                }, {
                    name: '订单',
                      activeSrc: './static/c.png',
                    src:'./static/c1.png',
                    link: '/order',
                    active: false,
                    i:'two'
                }, {
                    name: '消息',
                    i:'three',
                    activeSrc: './static/b.png',
                    src:'./static/b1.png',
                    link: '/myMailbox',
                    active: false
                }, {
                    name: '我的',
                    activeSrc: './static/d.png',
                    src:'./static/d1.png',
                    link: '/mineIndex',
                    active: false,
                    i:'four'
                },
            ],
            msgList:[]
        }
    },
    props:["nowPath"],
    components: {
        Tabbar,
        TabbarItem,
        Group,
        Cell
    },
    mounted() {
        console.log(this.nowPath)
        this.getMsgList()
    },
    // watch: {
    //     $route: {
    //         handler: function(val, oldVal) {
    //             alert('执行部')
    //             console.log(val,oldVal)
    //             for (var i in this.routers) {
    //                 if (this.routers[i].path == val.path) {
    //                     this.routers[i].active = !this.routers[i].active;
    //                 }
    //             }
    //         },
    //         deep: true
    //     }

    // },

    methods: {
        tabActive(index) {
            for (var i in this.routers) {
                this.routers[i].active = false;
            }
            this.routers[index].active = true;
        },
        // 获取私信列表/api/UserMsg/List
        getMsgList() {
            var that = this;
            var baseUrl = this.$store.state.baseUrl;
            // alert(that.uid)
            that
                .$http("get", baseUrl + "api/PrivateMsg/msg-user", {
                    toUid: that.$store.state.uid
                })
                .then(function (res) {
                    console.log(res.data.data);
                    var result = res.data.data;
                    // that.mailId = result.id;
                     if(result.length==0){
                         return false;
                     }
                    that.msgList = result.filter((item)=>{
                        if(!item.msg.read){
                            return true;
                        }
                    });
                    console.log('--------------')
                    console.log(that.msgList)
                });
        },
    }
}
</script>


<style scoped>
#footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 49px;
    display: flex;
    justify-content: center;
}
#footer .weui-tabbar .iconfont.icon-boshimao{
    /* font-size: 24px; */
}
.weui-tabbar__icon img.one{
    width: 29px;
    height: 17px;
}
.weui-tabbar__icon img.two{
    width: 17px;
    height: 19px;
}
.weui-tabbar__icon img.three{
    width: 20px;
    height: 20px;
}
.weui-tabbar__icon img.four{
    width: 17px;
    height: 21px;
}
</style>