import axios from "axios";
//请求拦截器
axios.defaults.baseURL = 'https://buaamapforum.cn:8443'//这是项目的base地址
axios.defaults.timeout = 10000//超时时间
axios.interceptors.request.use((config) => {
//这里不添加请求头是因为我们发送的数据不一定都是json格式
//     console.log("----------------", config.data)//在发送请求前可以添加token之类或者其他操作
//     console.log(config)
    config.headers["Content-type"] = "application/json;charset=UTF-8";
    //在这里可以添加token
    // config.headers.Authorization = global.global_token
    return config//一定要返回，否则请求发不出去
}, (error) => {
    return error
})
//暴露出去
export default axios
