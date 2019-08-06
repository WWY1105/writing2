const common = {

  // 根据ID获取用户信息、
  getWebUser(uid) {
    // alert(uid)
    var that = this;
    var baseUrl = this.$store.state.baseUrl;
    that.$http('get', baseUrl + 'api/WebUser/' + uid, {
      loginUid: that.$store.state.uid
    }).then(function (res) {
      that.userData = {...res.data.data};
      that.userType=res.data.data.type;
      that.userImg=res.data.data.imgurl;
      that.classNo = res.data.data.authorInfo.classNo;
      that.subject = res.data.data.authorInfo.subject;
      that.selfCon = res.data.data.authorInfo.selfCon;
      that.soleCost = res.data.data.authorInfo.soleCost;
      that.jointCost = res.data.data.authorInfo.jointCost;
      that.coordination = res.data.data.authorInfo.coordination;
      that.experience = res.data.data.authorAuthInfo.experience
      that.org = res.data.data.authorAuthInfo.org
      that.area = res.data.data.authorInfo.area;
      that.gender = res.data.data.authorInfo.gender;
      that.achievement = res.data.data.authorAuthInfo.achievement
      that.books = res.data.data.authorAuthInfo.books
      that.userTags = res.data.data.authorInfo.userTags

      // that.userType = res.data.data.type;
      // 拼接名字
      that.workAge = res.data.data.authorAuthInfo.workAge;
      that.networkCount = res.data.data.networkCount
      console.log("用户信息")
      console.log(that.classNo)
      console.log(res.data.data.networkCount);


      // 标签分类
      var arr = [];
      var arr1 = [];
      for (var i in res.data.data.authorInfo.userTags) {
        if (res.data.data.authorInfo.userTags[i].type == '1') {
          arr.push(res.data.data.authorInfo.userTags[i])
        } else {
          arr1.push(res.data.data.authorInfo.userTags[i])
        }
      }
      that.selfTag = arr;
      that.otherTags = arr1;
    })

  },
  // 点击头像，查看用户详情
  seeUserDetail(id) {
    var that = this;
    that.$router.push({
      path: '/writerDetail',
      query: {
        writerId: id
      }
    })
  },
  // 获取标签列表
  getTasgs(uid) {
    var that = this;
    var baseUrl = this.$store.state.baseUrl;

    that.$http('get', baseUrl + 'api/Tag/List', {
      uid: uid
    }).then(function (res) {
      for (let i in res.data.data) {
        res.data.data[i].active = false;
      }
      that.tags = res.data.data;
      for(var i in that.tags){
        if(that.tags[i].type=='1'){
            that.goodtags.push(that.tags[i])
        }else if(that.tags[i].type=='2'){
             that.midtags.push(that.tags[i])
        }else{
            that.badtags.push(that.tags[i])
        }
         
    }
  //   alert(that.goodtags.length)
  //   console.log(that.midtags.length)
  //  console.log(that.badtags.length)
    })
  },
  // 获取科目
  getCategory() {
    var that = this;
    var baseUrl = this.$store.state.baseUrl;
    that.$http('get', baseUrl + 'api/CategoryConfig/Category/List', {
      type: 'login'
    }).then(function (res) {
      var slideArr = [];
      for (var i in res.data.data) {
        var obj = {};
        obj.name = res.data.data[i].categroy;
        obj.value = res.data.data[i].id + "";
        res.data.data[i].active = false;
        slideArr.push(obj)
      }
      that.subjectArr = res.data.data;

      that.sliderSubjectArr.push(slideArr)
      // console.log("科目")
      // console.log(res.data.data)
    })

  },
  // 获取年纪大类
  getBigGrade() {
    var that = this;
    var baseUrl = this.$store.state.baseUrl;
    that.$http('get', baseUrl + 'api/CategoryConfig/ClassParent/List').then(function (res) {
      var slideArr = [];
      for (var i in res.data.data) {
        var obj = {};
        obj.name = res.data.data[i].name;
        obj.value = res.data.data[i].id + "";
        obj.active = false;
        res.data.data[i].active = false;
        slideArr.push(obj)
      }
      that.sliderBigClassArr.push(slideArr)

      console.log('大年级')
      console.log(that.sliderBigClassArr)
    })
  },
  // 获取年级
  getGrade() {
    var that = this;
    var baseUrl = this.$store.state.baseUrl;
    that.$http('get', baseUrl + 'api/CategoryConfig/Class/List', {
      type: 'login'
    }).then(function (res) {
      var slideArr = [];
      for (var i in res.data.data) {
        var obj = {};
        obj.name = res.data.data[i].className;
        obj.value = res.data.data[i].id + "";
        res.data.data[i].active = false;

        slideArr.push(obj)
      }
      that.gradesArr = res.data.data;
      that.sliderClassArr.push(slideArr)

      console.log('年级')
      console.log(that.sliderClassArr)
    })
  },
  // 获取费用预算（每小时）
  getPriceArr() {
    var that = this;
    var baseUrl = this.$store.state.baseUrl;
    that.$http('get', baseUrl + 'api/CategoryConfig/Charge/List', ).then(function (res) {
      var arr = [];
      var slideArr = [];

      for (var i in res.data.data) {
        var obj = {};
        obj.name = res.data.data[i].name;
        obj.value = res.data.data[i].id + "";
        slideArr.push(obj)
        arr.push(res.data.data[i].name)
      }
      console.log('价格!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
      console.log(slideArr)
      that.slidePriceArr2.push(slideArr);
      that.priceArr.push(arr);

      that.slidePriceArr.push(slideArr);


      console.log(that.slidePriceArr)
      // slidePriceArr
    })
  },
  //''
  getNameById(id, arr) {
    // console.log(id)
    // console.log(arr[0])


  },

  // 跳转所选页面
  // gotoMultiPicker(title,params,nickName) {
  //     // console.log('ss')
  //     var params={
  //             dataArr:params,
  //             title:title,
  //             nickName:nickName
  //         }
  //     sessionStorage.setItem('params',JSON.stringify(params))
  //     this.$router.push({
  //         name:'multiPicker'
  //     })
  // },

  // 截取科目和年纪
  shortName(str) {
    if (str != '' && str != null) {
      // console.log(str)
      var arr = str.split(',');
      for (let i in arr) {
        arr[i] = arr[i].substr(0,2)
      }
      arr = arr.join('')
    }

    return arr

  },



  changeResultGrade(val) {
    // alert(val)
    // 年级
    this.postData.classNo = val;
  },
  changeResultKM(val) {

    // 科目
    this.postData.category = val;
    // alert(val)
    if (val) {
      this.postData.subject = val.name;
    }


  },
  // 性别
  getRadioValue(val) {
    this.chooseSex = val
  },
  changeResultPrice(val) {
    // 价格
    console.log('价格')
    console.log(val)
    // console.log(this.slidePriceArr[0])
    // for (var i in this.slidePriceArr[0]) {
    //   if (val == this.slidePriceArr[0][i].value) {
    //     this.postData.fee = this.slidePriceArr[0][i].name.split('元')[0].split('~').join('-')
    //   }
    // }
    // console.log(this.postData.fee)
    // 发布任务页面
    this.postData.fee = val.name.split('元')[0].split('~').join('-');


  },
  changeResultWay(val) {
    // 上门方式
    // '家教拜访','家长拜访','远程协作'
    console.log('啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊')
    console.log(val)
    this.postData.coordination=val.join(',')
    //     switch (val.join(',')) {
    //   case '家教拜访':
    //     this.postData.coordination = 'author';
    //     break;
    //   case '家长拜访':
    //     this.postData.coordination = 'busniess';
    //     break;
    //   case '远程协作':
    //     this.postData.coordination = 'online';
    //     break;

    // }
    console.log(this.postData.coordination)

  },
  getPublicWay(val) {
    //  alert(val)
    // 出资方式
    this.postData.priceType = val;
  },
  onAddressChange(ids, names) {
    // 上门区域
    //  console.log(ids, names)
    this.postData.area = names.join(',');

  },
  // 招标家长人数
  booksellerGrade(val) {
    val = val[0];
    this.postData.busniessCount = val;
    // console.log(val)
  },
  // 排序
  getOrderType(val) {
    // alert(val)
    this.order = val;

  },
  // 排序消失
  getPxIsShow(val) {
    this.pxIsShow = val
  },
  // 为空判断
  isEmpty(dataArr, nameArr) {
    var emptyArr = []
    for (var i in dataArr) {
      if (dataArr[i] == '') {
        console.log(nameArr[i])
        emptyArr.push(nameArr[i])
      }
    }
    return emptyArr
  },
  // 没有做选择的时候，设默认值
  setDefaultVal(val, defaultVal) {
    if (!val) {
      // alert(val)
      val = defaultVal
    }
  },
  // 服务,调节费 : 服务,调节费
  getBaseRate() {
    var that = this;
    var baseUrl = this.$store.state.baseUrl;
    that.$http('get', baseUrl + 'api/BaseRate').then(function (res) {
      console.log(res.data.data);
      that.adjustmentRate = res.data.data.adjustmentRate;
      that.serviceRate = res.data.data.serviceRate;
      // adjustmentRate (number): 调节费百分比 ,serviceRate (number): 服务费百分比
    })
  },
  // 微信支付相关
  callback(key, url) {
    if (typeof WeixinJSBridge == "undefined") {
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady(key), false);
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', onBridgeReady(key));
        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady(key));
      }
    } else {
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        key,
        function (res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            // openHref('myOrder.html')
            window.location.href = "http://www.shuimujiajia.net/app/index.html#" + url
          } // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
        }
      );
    }
  }

}
export default common;
