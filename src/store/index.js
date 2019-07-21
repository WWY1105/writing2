import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// http://www.shuimujiajia.net/works/
export default new Vuex.Store({
    state: {
        //  imgUrl:"/storage/",
        //  baseUrl: "/works/",
        // imgUrl:"http://www.shuimujiajia.net/storage/",
        // baseUrl: "http://www.shuimujiajia.net/works/",
        imgUrl:'http://nian.im/storage/',
        baseUrl:'http://nian.im/works/',
        uid:'101'||localStorage.getItem('uid'),
        openid:'', 
        userImg:'',
        code:'',
        recommadd:''||localStorage.getItem('recommadd'),
        userType:"author"
    },
    mutations: {
        setCode(state, n) {
            state.code = n
        },
        setuid(state, n) {
            state.uid = n
        },
        setrole(state, n) {
            state.role = n
        },
        setOpenid(state, n) {
            state.openid = n
        },
        setUserImg(state,n){
            state.userImg=n
        },
        setRecommadd(state,n){
            state.recommadd=n
        },
        setUserType(state,n){
            state.userType=n
        }

    }
})

//34 ,80   business
//101,7  作者