import axios from "axios";
import {appendJeecgHeader} from "./plugin-jeecg/index.js";


const AUTH_STORE_KEYS = ['jwt', 'appToken', 'token', 'Authorization'];

const AXIOS = axios.create({
    withCredentials: true, // 带cookie
    baseURL: '/',
})

function getToken() {
    for (let key of AUTH_STORE_KEYS) {
        let v = localStorage.getItem(key);
        if (v) {
            return v;
        }
    }
}

AXIOS.interceptors.request.use(
    config => {
        let token = getToken();
        if (token) {
            config.headers['Authorization'] = token;
        }
        appendJeecgHeader()

        return config;
    }
);

AXIOS.interceptors.response.use(res => {
    return res.data;
})

/**
 *
 * @param msg
 * @param error 原始错误信息
 */
let showError = function (msg, error) {
    console.log('请求异常', msg, error)
    console.log('您可以使用 setShowError 设置提示方式')
    alert(msg)
}

addErrorInterceptor()


function addErrorInterceptor() {
    const STATUS_MESSAGE = {
        200: '服务器成功返回请求的数据',
        201: '新增或修改数据成功',
        202: '一个请求已经进入后台排队（异步任务）',
        204: '删除数据成功',
        400: '发出的请求有错误，服务器没有进行新增或修改数据的操作',
        401: '请求需要登录',
        403: '权限不足',
        404: '接口未定义',
        406: '请求的格式不可得',
        410: '请求的资源被永久删除，且不会再得到的',
        422: '当创建一个对象时，发生一个验证错误',
        500: '服务器发生错误，请检查服务器',
        502: '网关错误',
        503: '服务不可用，服务器暂时过载或维护',
        504: '网关超时',
    };


    /**
     * axios 的错误代码
     * 来源 AxiosError.ERR_NETWORK
     * 直接使用的chatgpt 转换为js对象并翻译
     */
    const AXIOS_CODE_MESSAGE = {
        ERR_FR_TOO_MANY_REDIRECTS: "错误：重定向过多",
        ERR_BAD_OPTION_VALUE: "错误：选项值无效",
        ERR_BAD_OPTION: "错误：无效选项",
        ERR_NETWORK: "错误：网络错误",
        ERR_DEPRECATED: "错误：已弃用",
        ERR_BAD_RESPONSE: "错误：响应错误",
        ERR_BAD_REQUEST: "错误：无效请求",
        ERR_NOT_SUPPORT: "错误：不支持",
        ERR_INVALID_URL: "错误：无效的URL",
        ERR_CANCELED: "错误：已取消",
        ECONNABORTED: "连接中止",
        ETIMEDOUT: "连接超时"
    }

    AXIOS.interceptors.response.use(response => {
        let {success, message} = response; // 这里默认服务器返回的包含 success 和message 字段， 通常框架都有

        // 如果框架没有返回 success ，则不处理错误信息，因为无法判断是否成功
        if (success === undefined) {
            return response;
        }


        if (success) {
            // 数据正常，进行的逻辑功能
            return response
        } else {
            // 如果返回的 success 是 false，表明业务出错，直接触发 reject
            showError(message || '服务器忙', response)
            // 抛出的错误，被 catch 捕获
            return Promise.reject(new Error(message))
        }
    }, error => {
        // 对响应错误做点什么

        let {message, code, response} = error;
        let msg = response ? STATUS_MESSAGE[response.status] : AXIOS_CODE_MESSAGE[code];

        showError(msg || message, error)

        return Promise.reject(error)
    })
}

/* ProTable 的请求， 处理 spring 分页
     https://procomponents.ant.design/components/table#request
     ProTable 的参数为 current,pageSize
     spring 的参数为 pageNo, pageSize 和 orderBy

     ProTable 的返回值为 data， success ，total

     */
function convertParams(params, sort) {
    const {current, pageSize, ...data} = params;
    const newParams = {
        pageNo: current,
        pageSize
    }
    if (sort) {
        let keys = Object.keys(sort);
        if (keys.length > 0) {
            let key = keys[0];
            let dir = sort[key] === 'ascend' ? 'asc' : 'desc';
            newParams.orderBy = key + ',' + dir;
        }
    }

    return {
        params: newParams,
        data
    };
}

function convertResult(result) {
    const page = result.data;

    // 按pro table 的格式修改数据结构
    let total = parseInt(page.totalElements);
    return {
        data: page.content,
        success: true,
        total,

        // 原始数据
        page
    };
}

export default class {

    static setShowError(fn) {
        showError = fn;
    }


    /**
     * 返回本工具类的axios实例，方便扩展
     * @returns {AxiosInstance}
     */
    static getAxiosInstance() {
        return AXIOS;
    }


    static get(url, params) {
        return AXIOS.get(url, {params})
    }

    static post(url, data, params) {
        return AXIOS.post(url, data, {
            params
        })
    }

    static postForm(url, data) {
        return AXIOS.postForm(url, data)
    }


    static getPageable(url, param, sort) {
        const {params, data} = convertParams(param, sort);
        return AXIOS.get(url, {params: {...params, ...data}}).then(result => {
            return convertResult(result)
        })
    }

    static postPageable(url, param, sort) {
        const {params, data} = convertParams(param, sort);
        return AXIOS.post(url, data, {params}).then(result => {
            return convertResult(result)
        })
    }
}






