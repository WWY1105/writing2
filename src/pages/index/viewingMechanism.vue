<template>
    <div>
        <div class="content flexStart">
            <span class="mainText eachTag" v-for="item in taglist">{{item.school}}</span>
        </div>
    </div>
</template>
<script>
export default {
    name: 'writer',
    data() {
        return {
            id:this.$route.query.tagid,
            taglist:[]
        }
    },
    mounted(){
        this.getTags()
       
    },
    methods:{
        getTags(){
            var that = this;
            var postData = {
                tagId:that.id
            }
            that.$http('get', that.$store.state.baseUrl + 'api/TagSchool/List', postData).then(function (res) {
                if (res.data.code != '00') {
                    AlertModule.show({
                        title: res.data.msg
                    })
                } else {
                    console.log(res.data.data)
                    that.taglist=res.data.data
                }
            })
        }
    }
}
</script>
<style>
.content{
    flex-wrap: wrap;
}
    .eachTag{
        display: inline-block;
    padding: 5px 10px;
    width: 30%;
    text-align: center;
    }
</style>