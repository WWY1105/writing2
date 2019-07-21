import axios from 'axios'
import 'es6-promise/auto'
import Vuex from 'vuex'

// 校验电话、
function checkTel(tel) {
    var flag;
    var reg = /^1[3456789]\d{9}$/;
    if (tel.trim() == '') {
        // 电话号为空
        flag = 1;
    } else if (!reg.test(tel)) {
        // 电话号格式不正确
        flag = 2;
    } else {
        // 电话号正确
        flag = 3;
    }
    return flag;
}



// 封装axios方法
function http(method, url, param,json) {
    param = param && typeof param === 'object' ? param : {};
    const config = {
        url: url,
        method: method,
        transformRequest: [function (param) {
            let ret = ''
            for (let it in param) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(param[it]) + '&'
            }
            return ret
        }],
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    };

    // post请求时需要设定Content-Type
    if(!json){
        if (method === 'post'||method === 'put') {
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
            config.data = param;
        } else if (method === 'get') {
            config.params = param;
        }
        
    }else{
        if (method === 'post'||method === 'put') {
            config.headers['Content-Type'] = 'application/json;charset=UTF-8';
            config.data = param;
        }
    }

    return axios(config);
}




export {
    http,
    checkTel
};
