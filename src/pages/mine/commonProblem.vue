<template>
<div id="commonProblem">
    <div class="eachProblem" v-for="item,index in problemList">
        <p class="title bgW">{{index+1}}、{{item.title}}?</p>
        <div class="content bgW">
            <p class="textContent" v-html="item.content"></p>

            <!-- 图片信息 -->
            <div class="picBox flexStart" v-if="item.imgurls.length==0?false:true">
                <img :src="i.src" alt="" class="previewer-demo-img uploadImg" v-for="i,j in item.imgurls" @click.stop.self="show(index,j)">
                <div v-transfer-dom>
                    <previewer :list="item.imgurls" ref="previewer" :options="options"></previewer>
                </div>
            </div>
        </div>

    </div>

</div>
</template>

<script>
import {
    Previewer
} from 'vux';

export default {
    data() {
        return {
            problemList: [],
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
    components: {
        Previewer
    },
    mounted() {
        this.getProblem()
    },
    methods: {
        show(index, j) {
            console.log('---' + index)
            console.log(this.$refs.previewer)
            this.$refs.previewer[index].show(j)
        },
        getProblem() {
            var that = this;
            var baseUrl = this.$store.state.baseUrl;
            that.$http('get', baseUrl + 'api/CommonProblem/List', {}).then(function (res) {
                console.log("系统消息")
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
                that.problemList = result
            })
        }
    }
}
</script>

<style scoped>
#commonProblem .eachProblem {
    margin-bottom: 5px;
}

#commonProblem .eachProblem .title {
    padding: 10px 13px;
    color: #000000;
    font-size: 14px;
}

#commonProblem .eachProblem .content {
    padding: 10px 13px;
    color: #999;
    font-size: 12px;
    padding-left: 31px;
}

#commonProblem .picBox {
    padding-left: 0px;
    padding-right: 64px;
    padding-top: 10px;
}

#commonProblem .picBox .uploadImg {
    height: 79px;
    width: 79px;
    margin-left: 5px;
}
</style>
