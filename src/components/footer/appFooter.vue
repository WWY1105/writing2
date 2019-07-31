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
                <img slot="icon" :src="item.activeSrc" v-if="nowPath==item.link?true:false"/>
                <img slot="icon" :src="item.src" v-if="nowPath!=item.link?true:false"/>
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
                    active: true
                }, {
                    name: '订单',
                      activeSrc: './static/c.png',
                    src:'./static/c1.png',
                    link: '/order',
                    active: false
                }, {
                    name: '消息',
                  
                    activeSrc: './static/b.png',
                    src:'./static/b1.png',
                    link: '/myMailbox',
                    active: false
                }, {
                    name: '我的',
                    activeSrc: './static/d.png',
                    src:'./static/d1.png',
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
    /* font-size: 24px; */
}
.weui-tabbar__icon img{
    transform: scale(0.7)
}
</style>