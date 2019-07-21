<template>
  <div id="mineIndex">
    <div class="mineInfo bgW">
      <!--上-->
      <div class="flexSpace mainInfoTop">
        <div class="imgBox flexStart">
          <img :src="$store.state.imgUrl+userData.imgurl" alt class="myImg">
          <div class="Info">
            <p class="name">{{userData.nickname}}</p>
            <p class="id">ID：{{userData.id}}</p>
            <p class="tel">电话：{{userData.mobile }}</p>
          </div>
        </div>
        <div class="right" v-if="$store.state.userType=='author'">
          <!-- tagBox active -->
          <!-- 实名认证 -->
          <router-link
            tag="p"
            to="/realNameAuthentication"
            :class="userData.realAuth =='2'?'tagBox active':'tagBox '"
          >
            <!-- 未认证 -->
            <i class="iconfont icon-wenhao" v-if="userData.realAuth!='2'"></i>
            <!-- 已认证 -->
            <i class="iconfont icon-dagouyouquan" v-if="userData.realAuth=='2'"></i>
            实名认证
          </router-link>
          <!-- 学历认证 -->
          <router-link
            v-if="userData.type=='author'"
            tag="p"
            to="/educationAuthentication"
            class="tagBox"
            :class="userData.eduAuth =='2'?'tagBox active':'tagBox '"
          >
            <!-- 未认证 -->
            <i class="iconfont icon-wenhao" v-if="userData.eduAuth!='2'"></i>
            <!-- 已认证 -->
            <i class="iconfont icon-dagouyouquan" v-if="userData.eduAuth=='2'"></i> 学历认证
          </router-link>
          <!-- 家教资历 -->
          <router-link
            tag="p"
            to="/authorAuthentication"
            class="tagBox"
            :class="userData.authorAuth =='2'?'tagBox active':'tagBox '"
            v-if="userData.type!='business'"
          >
            <!-- 未认证 -->
            <i class="iconfont icon-wenhao" v-if="userData.authorAuth!='2'"></i>
            <!-- 已认证 -->
            <i class="iconfont icon-dagouyouquan" v-if="userData.authorAuth=='2'"></i> 家教资历
          </router-link>
        </div>
      </div>
      <!--下-->
      <div class="flexSpace mainInfoBottom">
        <router-link tag="div" to="/myMainPage" class="each">
          <p class="num">{{persentNum}}%</p>
          <p class="other">基本资料</p>
        </router-link>
        <!-- <router-link tag="div" to="/myWallet" class="each">
                <p class="num">{{userData.amount}}元</p>
                <p class="other">钱包</p>
        </router-link>-->
        <router-link tag="div" to="/myNetwork" class="each">
          <p class="num">{{userData.networkCount}}人</p>
          <p class="other">我的网络</p>
        </router-link>
      </div>
    </div>
    <div class="eachNavBox bgW mrb">
      <group>
        <cellNav
          class="myCell"
          :isMsg="item.isMsg"
          :recommenderSrc="item.recommenderSrc"
          :recommenderId="item.recommenderId"
          v-for="item,index in navList.slice(0,2)"
          :noBorder="index==2?'noBorder':''"
          :link="item.link"
          :uid="item.uid"
          :leftTitle="item.title"
          :icon="item.icon"
          :num="item.rightNum"
        ></cellNav>
      </group>
    </div>
    <div class="eachNavBox bgW mrb">
      <group>
        <cellNav
          v-for="item,index in navList.slice(2)"
          :noBorder="index==5?'noBorder':''"
          :writerId="item.writerId"
          :link="item.link"
          :leftTitle="item.title"
          :icon="item.icon"
          :num="item.rightNum"
        ></cellNav>
      </group>
    </div>
    <!-- <div class="eachNavBox bgW mrb">
        <group>
            <cellNav @tofellow="tofellow" v-for="item,index in navList.slice(9)" :noBorder="index==4?'noBorder':''"  :link="item.link" :leftTitle="item.title"  :icon="item.icon" :num="item.rightNum" ></cellNav>
        </group>
    </div>-->

    <div>
      <appFooter :nowPath="nowPath"></appFooter>
    </div>
  </div>
</template>

<script>
import { Group, AlertModule } from "vux";
import common from "@/assets/js/common";
import appFooter from "@/components/footer/appFooter";
import cellNav from "@/components/cellNav";

export default {
  data() {
    return {
      nowPath: "/mineIndex",
      myMediator: {},
      navList: [
          //0
        {
          title: "我的推荐人",
          icon: "icon-hezuo",
          isLink: "true",
          rightNum: 0,
          recommenderSrc: "",
          recommenderId: "",
          isMsg: true,
          link: "myNetwork"
        },
         //1
        {
          title: "关注公众号",
          isLink: true,
          // link: 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU4NTczOTE4NQ==#wechat_redirect',
          rightNum: 0,
          icon: "icon-renzhenghuizhang"
        },
        //2
        {
          title: "预览我的主页",
          isLink: true,
          link: "writerDetail",
          writerId: this.$store.state.uid,

          rightNum: 0,
          icon: "icon-zhuye"
        },
        //3
        {
          title: "我的关注",
          isLink: true,
          link: "myFallow",
          rightNum: 0,
          icon: "icon-guanzhu"
        },
        //4
        {
          title: "系统消息",
          isLink: true,
          link: "systemMessage",
          rightNum: 0,
          icon: "icon-xiaoxi"
        },
        {
          title: "联系我们",
          isLink: true,
          link: "contactUs",
          rightNum: 0,
          icon: "icon-dianhua"
        },
        {
          title: "意见反馈",
          isLink: true,
          link: "feedback",
          rightNum: 0,
          icon: "icon-yijianfankui"
        }
      ],
      uid: "",
      userData: {},
      baseObj: {},
      persentNum: 0,
      systemMsgLength: 0
    };
  },
  components: {
    appFooter,
    cellNav,
    Group,
    AlertModule
  },

  mounted() {
    this.getWebUser();
    this.getSystemMsg();
    this.getNewMailMsg();
    this.getMediator(this.$store.state.uid);
  },

  methods: {
    ...common,
    tofellow(link) {
      window.open(link);
    },
    // 获取我的调解人
    getMediator(uid) {
      var that = this;
      var baseUrl = this.$store.state.baseUrl;
      that
        .$http("get", baseUrl + "api/Mediator/List", {
          uid: uid
        })
        .then(function(res) {
          if (res.data.code != "00") {
            AlertModule.show({
              title: res.data.msg
            });
          } else {
            if (res.data.data.myMediator.length > 0) {
              that.myMediator = res.data.data.myMediator[0];
              that.navList[0].recommenderSrc =
                that.$store.state.imgUrl + res.data.data.myMediator[0].imgurl;
              that.navList[0].recommenderId = res.data.data.myMediator[0].id;
            }

            // that.needMediator = res.data.data.needMediator;
          }
        });
    },
    // 系统消息
    getSystemMsg() {
      // api/SystemMsg/List
      var that = this;
      var baseUrl = this.$store.state.baseUrl;
      var arr = [];
      that
        .$http("get", baseUrl + "api/SystemMsg/List", {
          uid: that.$store.state.uid
        })
        .then(function(res) {
          console.log(res.data.data);
          var result = res.data.data;

          for (var i in result) {
            console.log(result[i].read == false);
            if (result[i].read == false) {
              arr.push(result[i]);
            }
          }
           that.navList[4].rightNum = arr.length;
        });
    },
    // 获取我的信箱新消息
    // getNewMailMsg() {
    //   var that = this;
    //   var baseUrl = this.$store.state.baseUrl;
    //   that
    //     .$http("get", baseUrl + "api/unread/" + that.$store.state.uid, {
    //       type: "msg"
    //     })
    //     .then(function(res) {
    //       that.navList[6].rightNum = res.data.data;
    //       that
    //         .$http("get", baseUrl + "api/unread/" + that.$store.state.uid, {
    //           type: "dxtask"
    //         })
    //         .then(function(res) {
    //           //   that.navList[1].rightNum = res.data.data
    //         });
    //     });
    // },
    // 获取
    getWebUser() {
      var that = this;
      var baseUrl = that.$store.state.baseUrl;
      var uid = that.$store.state.uid;
      that.$http("get", baseUrl + "api/WebUser/" + uid).then(function(res) {
        that.userData = res.data.data;
        console.log("用户信息");
        console.log(that.userData);
        // 任务
        //   that.navList[0].rightNum = res.data.data.taskCount;
        // 我报名的任务
        //    that.navList[1].rightNum = res.data.data.joinCount;
        // 关注
         that.navList[3].rightNum = res.data.data.attention
        // 基本资料百分比
        var num = 20;
        that.baseObj = {
          sex: Boolean(res.data.data.authorInfo.gender),
          categories:
            res.data.data.authorInfo.categories.length == 0 ? false : true,
          classList:
            res.data.data.authorInfo.classList.length == 0 ? false : true,
          jointCost: Boolean(res.data.data.authorInfo.jointCost),
          soleCost: Boolean(res.data.data.authorInfo.soleCost),
          coordination: Boolean(res.data.data.authorInfo.coordination),
          area: Boolean(res.data.data.authorInfo.area),
          selfCon: Boolean(res.data.data.authorInfo.selfCon)
        };

        for (var i in that.baseObj) {
          if (that.baseObj[i]) {
            num += 10;
          } else {
            num += 0;
          }
        }
        that.persentNum = num;
        console.log("基本资料%%%%%%%%%" + num);
        console.log(that.baseObj);
      });
    }
  }
};
</script>

<style scoped>
#mineIndex .eachNavBox {
  padding-left: 10px;
}

#mineIndex {
  padding-bottom: 71px;
}

#mineIndex .mineInfo {
  margin-bottom: 10px;
}

#mineIndex .mainInfoTop {
  padding: 11px 23px 16px 23px;
  border-bottom: 1px solid #dedede;
}

#mineIndex .mainInfoBottom {
  padding-top: 10px;
  padding-bottom: 10px;
}

#mineIndex .mainInfoBottom .each {
  width: 50%;
  text-align: center;
  padding-top: 13px;
  padding-bottom: 7px;
  border-right: 1px solid #dedede;
  color: #666;
  font-size: 12px;
}

#mineIndex .mainInfoBottom .each .num {
  color: #333333;
  font-size: 18px;
  font-weight: bolder;
  margin-bottom: 7px;
}

#mineIndex .mainInfoBottom .each:last-child {
  border: none;
}

#mineIndex .mineInfo .imgBox .myImg {
  width: 59px;
  height: 59px;
  border-radius: 50%;
  border: 6px solid #e9e9e9;
  margin-right: 13px;
}

#mineIndex .mineInfo .Info .name {
  font-size: 14px;
  color: #000;
  margin-bottom: 4px;
  font-weight: bolder;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
  word-break: keep-all;
}

#mineIndex .myCell .vux-label {
  width: 100% !important;
}

#mineIndex .mineInfo .Info .id,
#mineIndex .mineInfo .Info .tel {
  color: #242424;
  font-size: 12px;
  margin-bottom: 8px;
}

#mineIndex .mineInfo .right .tagBox {
  color: #b7b7b7;
  font-size: 12px;
  padding: 8px;
  border: 1px solid #b7b7b7;
  border-radius: 5px;
  margin-bottom: 8px;
}

#mineIndex .mineInfo .right .tagBox.active {
  color: #3375c5;
  font-size: 12px;
  padding: 8px;
  border: 1px solid #3375c5;
  border-radius: 5px;
  margin-bottom: 8px;
}
.mrb {
  margin-bottom: 0;
  border-bottom: 10px solid #f5f5f5;
}
</style>
