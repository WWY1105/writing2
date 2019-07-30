<template>
<div id="myFallow">
    <!-- <div ><router-link :to="{path:'/addFellow'}"><button class="long_btn topBtn" >+加关注</button></router-link></div> -->
    <router-link :to="{path:'/writerDetail',query:{'writerId':item.id}}" v-for="item,index in writerList">
        <!-- <writers :gender="gender" :soleCost="soleCost" :school="userData.eduCertificate?userData.eduCertificate.school:''" :org="userData.tag?userData.tag.tag:''" :hang2IsShow='hang2IsShow' :selfCon="userData.authorInfo?userData.authorInfo.selfCon:''" :tag="userData.tag" :serviceHours="userData.serviceHours" :serviceOrderCount="userData.serviceOrderCount" :serviceUserCount="userData.serviceUserCount" :authorAuth="userData.authorAuth" :type="userData.type" :isMissionDetail="isMissionDetail" :missionNum="userData.taskCount" :userTags="userTags" :realAuth="userData.realAuth" :eduAuth="userData.eduAuth" :userCount="userData.userCount" :avaTaskCount="userData.avaTaskCount " :cost="userData.cost" :workAge="workAge" :workHours="userData.workHours" :imgurl="userImg" :shortName="userData.nickname"></writers> -->
    
       <writers :serviceHours="item.serviceHours" :gender="item.authorInfo.gender" :school="item.eduCertificate?item.eduCertificate.school:''" :org="item.tag?item.tag.tag:''" :serviceOrderCount="item.serviceOrderCount" :serviceUserCount="item.serviceUserCount" :imgurl="item.imgurl" :type="item.type" :uid="item.id"  :isMissionDetail="isMissionDetail" :userTags="item.authorInfo.userTags" :selfCon="item.authorInfo?item.authorInfo.selfCon:''" :realAuth="item.realAuth" :eduAuth="item.eduAuth" :userCount="item.userCount" :workAge="item.authorAuthInfo.workAge" :soleCost="item.authorInfo.soleCost" :shortName="item.nickname"></writers>
    </router-link>
</div>
</template>

<script>
import writers from '@/components/writer/writer'
export default {
    components: {
        writers
    },
    data() {
        return {
            currentPage: '1',
            writerList: [],
             isMissionDetail:true
        }
    },
    mounted() {
        this.getFellowList()
    },
    methods: {
        // 跳转加关注
        
        // 我的关注列表
        getFellowList() {
            var that = this;
            var baseUrl = that.$store.state.baseUrl;
            that
                .$http("get", baseUrl + "api/UserFollowing/List", {
                    uid: that.$store.state.uid
                })
                .then(function (res) {
                    if (res.data.code == '00') {
                        var result = res.data.data;
                        var resultArr = [];
                        for (var i in result) {
                            if(result[i].followingUser){
                                resultArr.push(result[i].followingUser)
                            }
                            
                        }
                         console.log('hahahahhahahahah')
                        console.log(resultArr)
                        that.writerList = resultArr;
                       
                    } else {
                        AlertModule.show({
                            title: res.data.msg
                        });
                    }
                });
        }
    }
}
</script>

<style scoped>
#myFallow .reacResult {
    margin-top: 0;
}
.topBtnBox{

}
.topBtn{
    margin: 0;
    background: #fff;
    color: #3375C5;
    margin-bottom: 10px;
    width: 100%;
    font-weight: 700;
}
#myFallow .priceDesc {
    color: #707070;
    font-size: 12px;
}
</style>
