<template>
  <datetime :title="title" class="" @on-change="dateChange" :start-date='startDate' format="YYYY-MM-DD">
  </datetime>
</template>

<script>
import { Datetime } from 'vux'
export default {
  props: ['title'],
  data(){
    return {
      startDate: '2015-11-11',
    }
  },
  components: {
    Datetime
  },
  methods: {
    dateChange(val) {
      this.$emit('dateChange',val)
    }
  }
}
</script>

<style scoped>

</style>
