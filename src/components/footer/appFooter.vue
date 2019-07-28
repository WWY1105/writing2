<template>
    <div id="footer">
        <!--<yd-tabbar fixed active-color="#3375C5">
                            <yd-tabbar-item  v-for='item,index in routers' :title="item.name" :link="item.link" :active="item.active" :key="index">
                                <p name="home" slot="icon" :class="item.iconfontName" size="0.54rem"></p>
                            </yd-tabbar-item>
                        </yd-tabbar>-->
        <!--@click.native="tabActive(index)"-->
        <tabbar>
            <tabbar-item :selected="nowPath==item.link?true:false" v-for="item,index in routers" is-link :link="item.link" :key="index" >
                <span slot="icon" :class="item.iconfontName"></span>
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
                    iconfontName: 'iconfont icon-boshimao',
                    link: '/index',
                    active: true
                }, {
                    name: '订单',
                    iconfontName: 'iconfont icon-dingdan1',
                    link: '/order',
                    active: false
                }, {
                    name: '消息',
                    iconfontName: 'iconfont icon-send',
                    link: '/myMailbox',
                    active: false
                }, {
                    name: '我的',
                    iconfontName: 'iconfont icon-wode',
                    link: '/mineIndex',
                    active: false
                },
            ]
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
        }
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
    font-size: 24px;
}
</style>