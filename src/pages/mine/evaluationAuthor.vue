<template>
<div id="evaluationAuthor">
    <div class="topBox">
        <div class="areaBox bgW">
            <x-textarea :height="147" name="description" v-model="content" placeholder="请输入评价内容，100字以内"></x-textarea>
        </div>
    </div>
    <!-- 标签盒子 -->
    <div class="tagBox bgW">
        <p class="title">选择符合家教的特征</p>
        <div class="flexSpace tagBox">
            <div class="content flexCenter">
                 <div :class="item.active?'eachItem active':'eachItem '" v-for="item,index in goodtags" @click="chooseTagsG(index)">{{item.tagName}} </div>
            </div>
            <div class="content flexCenter">
                <div :class="item.active?'eachItem active':'eachItem '" v-for="item,index in badtags" @click="chooseTagsB(index)">{{item.tagName}} </div>
            </div>
        </div>
        <!-- 好评 -->
        <!-- <div class="content flexSpace goodTag">
            <div :class="item.active?'eachItem active':'eachItem '" v-for="item,index in goodtags" @click="chooseTags(index)">{{item.tagName}} </div>
        </div> -->
        <!-- 中评 -->
         <!-- <div class="content flexSpace goodTag">
            <div :class="item.active?'eachItem active':'eachItem '" v-for="item,index in midtags" @click="chooseTags(index)">{{item.tagName}} </div>
        </div> -->
        <!-- 差评 -->
         <!-- <div class="content flexSpace ">
            <div :class="item.active?'eachItem active':'eachItem '" v-for="item,index in badtags" @click="chooseTags(index)">{{item.tagName}} </div>
        </div> -->
    </div>
    <div class="btnBox">
        <button class="long_btn" @click="saveMyTags">保存</button>
    </div>
</div>
</template>

<script>
import common from "@/assets/js/common"
import {
    XTextarea,
    AlertModule
} from 'vux'
export default {
    data() {
        return {
            content: '',
            tags:[],
            goodtags: [],
            midtags: [],
            badtags: [],
            // chooseTags:''
        }
    },
    components: {
        XTextarea,
        AlertModule
    },
    mounted() {
        this.getTasgs()
        this.sortingTags()
    },
    methods: {
        ...common,
        sortingTags(){
            // var that=this;
            // alert(that.tags.length)
            // for(var i in that.tags){
                
            //     if(that.tags[i].type=='1'){
                    
            //         that.goodtags.push(that.tags[i])
            //     }else if(that.tags[i].type=='2'){
            //          that.midtags.push(that.tags[i])
            //     }else{
            //         that.badtags.push(that.tags[i])
            //     }
            // }
            // console.log(that.goodtags.length)
            // console.log(that.midtags.length)
            // console.log(that.badtags.length)
        },
        // 选择标签
        chooseTagsG(i) {
            this.goodtags[i].active = true;
        },
        chooseTagsB(i) {
            this.badtags[i].active = true;
        },
        saveMyTags() {
            // 提交评价
            var that = this;
            var baseUrl = this.$store.state.baseUrl;
            var arr = []
            for (var i in this.goodtags) {
                if (this.goodtags[i].active == true) {
                    arr.push(this.goodtags[i].tagName)
                }
            }
            for (var i in this.badtags) {
                if (this.badtags[i].active == true) {
                    arr.push(this.badtags[i].tagName)
                }
            }
            var postData = {
                uid: this.$store.state.uid,
                taskId: this.$route.query.taskId,
                content: this.content,
                commentTags: arr.join(',')
            }
            that.$http('post', baseUrl + 'api/TaskComment', postData).then(function (res) {
                if (res.data.code == '00') {
                    AlertModule.show({
                        title: '提交成功',
                        onHide(){
                            that.$router.push({
                                path:'/missionDetail',
                                query:{
                                    keepActive:true,
                                     id: that.$route.query.taskId
                                }
                            })
                        }
                    })
                } else {
                    AlertModule.show({
                        title: res.data.msg
                    })
                }
            })
        }
    }
}
</script>

<style scoped>
#evaluationAuthor .topBox {
    padding: 20px 16px;
}
#evaluationAuthor .tagBox{
    align-items: flex-start;
}
#evaluationAuthor .areaBox {
    border: 1px solid #B2B2B2;
    border-radius: 5px;
}

#evaluationAuthor .tagBox {
    padding-left: 10px;
}

#evaluationAuthor .title {
    border-bottom: 1px solid #CECECE;
    height: 40px;
    line-height: 40px;
    color: #3375C5;
    font-size: 12px;
}

#evaluationAuthor .content {
    padding-top: 14px;
    padding-right: 10px;
   width: 50%;
    flex-wrap: wrap;
}
.goodTag{
    border-bottom: 10px solid #f5f5f5;
}
#evaluationAuthor .content .eachItem {
    width:108px;
    height: 37px;
    line-height: 37px;
    text-align: center;
    border: 1px solid #848484;
    margin-bottom: 7px;
    color: #868686;
    font-size: 12px;
}

#evaluationAuthor .content .eachItem.active {
    color: #fff;
    background: #3375C5;
    border: 1px solid #3375c5;
}

#evaluationAuthor .content .eachItem span {
    color: #3375C5;
    margin-left: 5px;
}

#evaluationAuthor .btnBox {
      width: 100%;
    /* padding-left: 10px; */
    /* padding-right: 10px; */
    padding: 10px;
    background: #fff;
    border-top: 10px solid #f5f5f5;
}

#evaluationAuthor .btnBox button.long_btn {
    width: 100%;
    margin-top: 0px;
}
</style>
