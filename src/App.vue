<template>
<div id="app">
      <router-view ></router-view>
 <!-- true 要缓存 -->
    <!-- <keep-alive>
       
        <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive> -->
    <!-- false 不要缓存 -->
    <!-- <router-view v-if="!$route.meta.keepAlive"></router-view> -->
</div>
</template>

<script>
export default {
    name: 'App',
    methods: {

    }

}
</script>

<style>
#app {
    height: 100%;
}

body,
html {
    height: 100%;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    /*background: #fff;*/
}
</style>
