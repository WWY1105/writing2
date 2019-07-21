<template>
    <div id="chooseIdentity">
        <div class="item item1" v-for="item,index in roleList" @click="chooseWriter(index)" :class="item.isActive?'item item1 active':'item item1'">
            <p class="circle">
                <i :class="'iconfont '+item.icon"></i>
            </p>
            <p class="text">{{item.text}}</p>
        </div>

        <!--<div class="item" @click="chooseWriter"  :class="isActive?'item':'item active'">
                  <p class="circle"><i class="iconfont icon-book1"></i></p>
                  <p class="text">家长</p>
              </div>-->
        <button class="long_btn" @click.prevent="gotoFillIn">下一步</button>
    </div>
    </div>
</template>


<script>
import axios from 'axios'
export default {
    name: "choose_identity",
    data() {
        return {
            role: 'author',
            roleList: [{
                id: 0,
                icon: 'icon-iconset0137',
                isActive: true,
                text: '家教'
            },
            {
                id: 0,
                icon: 'icon-book1',
                isActive: false,
                text: '家长'
            }]
        }
    },
    methods: {
        chooseWriter(index) {
            for (var i in this.roleList) {
                this.roleList[i].isActive = false;
            }
            this.roleList[index].isActive = true;
            index == 0 ? this.role = "author" : this.role = "business"
        },
        gotoFillIn() {
            var that=this;
            var id = that.$store.state.uid;
            var data = { type: that.role }
            var url = that.$store.state.baseUrl + '/api/WebUser/' + id;
            // console.log(url)
            that.$http('put', url, data).then(function(res) {
                // console.log(res)
                if (res.data.code == '00') {
                    that.$store.commit('setUserType',that.role)
                    localStorage.setItem('userType', that.role);
                    that.$router.push({
                        // name: 'fill_in_information',
                        path: '/fill_in_information',
                        query:{
                            role:that.role
                        }
                    })
                }
            })


        }
    }
}
</script>


<style scoped>
#chooseIdentity {
    padding-top: 90px;
}

#chooseIdentity .item.active .circle {
    background: #3375C5;
}

#chooseIdentity .item.active .text {
    color: #3375C5;
}

#chooseIdentity .item1 {
    margin-bottom: 87px;
}

#chooseIdentity .text {
    text-align: center;
    color: #686868;
    font-size: 12px;
    margin-top: 14px;
}

#chooseIdentity .circle {
    width: 67px;
    height: 67px;
    background: #B2B2B2;
    margin: 0 auto;
    color: #fff;
    border-radius: 50%;
    text-align: center;
    line-height: 67px;
}

.iconfont {
    font-size: 27px;
}

.long_btn {
    margin-top: 90px;
}
</style>


