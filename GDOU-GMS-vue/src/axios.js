import axios from "axios";
import router from "./router";
import Element from "element-ui"

// 设置默认请求地址
axios.defaults.baseURL = "http://localhost:8082"

// 创建axios，设置超时时间和请求头
const request = axios.create({
	timeout: 5000,
	headers: {
		'Content-Type': "application/json; charset=utf-8"
	}
})

// 请求拦截器，设置请求头
request.interceptors.request.use(config => {
	config.headers['Authorization'] = localStorage.getItem("token")
	
	return config
})

// 响应拦截器，处理响应数据，统一处理错误
request.interceptors.response.use(
	// 请求成功
	response => {

		console.log("response ->" + response)

		let res = response.data

		if (res.code === 200) {
			return response
		} else {
			Element.Message.error(!res.msg ? '系统异常' : res.msg)
			return Promise.reject(response.data.msg)
		}
	},
	// 请求失败
	error => {

		console.log(error)

		if (error.response.data) {
			error.massage = error.response.data.msg
		}

		if (error.response.status === 401) {
			router.push("/login")
		}

		Element.Message.error(error.massage, {duration: 3000})
		return Promise.reject(error)
	}
)

export default request