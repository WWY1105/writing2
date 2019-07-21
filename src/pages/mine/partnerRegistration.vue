<template>
  <div id="partnerRegistration">
    <div class="topInput">
      <input type="text" class="bgW" v-model="nickname" placeholder="请输入您的称呼">
    </div>
    <div class="centerInput">
      <input type="tel" class="bgW" v-model="mobile" placeholder="请输入联系电话">
    </div>
    <div class="centerInput">
      <input type="text" class="bgW" v-model="email" placeholder="请输入邮箱地址">
    </div>
    <div class="bottomArea bgW">
      <x-textarea :height="147" v-model="content" name="description" placeholder="请输入您的合作阐述"></x-textarea>
    </div>
    <button class="long_btn" @click="submitParent">提交</button>
      <toast v-model="showToast" type="text" :time="800" is-show-mask text="操作成功" position="middle"></toast>
  </div>
</template>

<script>
import { XTextarea ,AlertModule,Toast} from "vux";

export default {
  data() {
    return {
      content: "",
      email: "",
      mobile: "",
      nickname: "",
      uid: this.$store.state.uid,
       showToast:false
    };
  },
  components: {
    XTextarea,
    AlertModule,
    Toast
  },
  methods: {
    submitParent() {
      var that = this;
      var baseUrl = this.$store.state.baseUrl;
      var postData = {
        content: that.content,
        email: that.email,
        mobile: that.mobile,
        nickname: that.nickname,
        uid: this.$store.state.uid
      };
      that
        .$http("post", baseUrl + "api/Partner", postData)
        .then(function(res) {
            // console.log(res.data.data)
             if (res.data.code != '00') {
                    AlertModule.show({
                        title: res.data.msg
                    })
                }else{
                  // AlertModule.show({
                  //       title: "提交成功",
                  //       onHide(){
                  //           that.$router.go(-1)
                  //       }
                  //   })
                  that.showToast=true;
                                // that.$router.go(-1)
                         setTimeout(()=>{
                             that.$router.go(-1)
                         },1000)
                }
        });
    }
  }
};
</script>

<style scoped>
#partnerRegistration {
  padding: 0 16px;
  height: 100%;
}

#partnerRegistration input {
  width: 100%;
  margin-top: 19px;
  border: 1px solid #b2b2b2;
  height: 44px;
  line-height: 44px;
  padding-left: 21px;
  border-radius: 4px;
  font-size: 14px;
}

#partnerRegistration input::placeholder,
#partnerRegistration textarea::placeholder {
  color: #b6b6b6;
}

#partnerRegistration .bottomArea {
  margin-top: 19px;
}

#partnerRegistration .bottomArea .weui-cell {
  padding: 0;
  padding: 16px 20px;
  border: 1px solid #b2b2b2;
  border-radius: 4px;
  font-size: 14px;
}

#partnerRegistration .bottomArea textarea.weui-textarea {
  padding: 16px 20px;
}

#partnerRegistration .long_btn {
  margin-top: 28px;
  width: 100%;
}
</style>
