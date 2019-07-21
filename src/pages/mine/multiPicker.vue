<template>
  <div id="multiPicker">
    <p class="title bgW">
      {{title}}（选择后保存）
    </p>
    <div class="content flexSpace bgW">
      <!--<input type="checkbox" v-for="item,index in arr">{{item.className}}-->
      <p :class="item.active==true?'item active':'item'" v-for="item,index in arr" @click="addActive(index)" :dd="item.active">{{item.name}}</p>
    </div>
    <button class="long_btn" @click="getResult">确认</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      arr: [],
      active: false,
      nickName:''

    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      var obj = JSON.parse(sessionStorage.getItem('params'))
      this.nickName = obj.nickName;
      this.title = obj.title;
      for (var i in obj.dataArr) {
        obj.dataArr[i].active = false;
        obj.dataArr[i].name = obj.dataArr[i][this.nickName]
      }
      this.arr = obj.dataArr;
      console.log(this.arr)
    },
    // 每个item的点击书简
    addActive(index) {
      this.arr[index].active = !this.arr[index].active;
    },
    // 提交点击得到的结果
    getResult(){
      var arr=[];
      for(let i in this.arr){
        if(this.arr[i].active==true){
            arr.push(this.arr[i])
        }
      }
      var multiResult={
        title:this.title,
        arr:arr,
        nickName:this.nickName
      }
      sessionStorage.setItem('multiResult',JSON.stringify(multiResult))

      this.$router.go(-1)
    },
    beforeRouteLeave(to, from, next) {
      if (to.path == "/myMainPage") {
        to.meta.keepAlive = true;
      } else {
        to.meta.keepAlive = false;
      }
      next();
    }


  }
}
</script>

<style scoped>
#multiPicker .title {
  padding: 11px;
  border-bottom: 1px solid #CECECE;
  font-size: 12px;
  color: #3375C5;
}

#multiPicker .content {
  padding: 27px 11px 60px 11px;
  flex-wrap: wrap;
}

#multiPicker .content .item.active {
  border: 1px solid #3375C5;
  color: #fff;
  background: #3375C5;
  /*margin-right: 15px;*/
  font-size: 14px;
}

#multiPicker .content .item {
  width: 95px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  border: 1px solid #848484;
  color: #868686;
  /*margin-right: 15px;*/
  background: #fff;
  margin-bottom: 10px;
}

#multiPicker .long_btn {
  margin-top: 60px;
}
</style>
