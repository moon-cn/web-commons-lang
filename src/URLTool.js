import qs from "qs";
import StringTool from "./StringTool.js";

export default class URLTool {

    static params(url) {
        url = url || window.location.search;
        if (!StringTool.contains(url, '?')) {
            return {};
        }

        url = StringTool.substringAfter(url, '?')

        let params = qs.parse(url);

        return params || {};

    }

    /**
     * 去掉参数的基础url
     * @param url
     */
    static baseUrl(url) {
        return new URL(url).origin
    }

    static removeParams(url) {
        url = url || window.location.search;
        if(StringTool.contains(url, '?')){
            return StringTool.substringBefore(url, '?')
        }
        return url;

    }

    static replaceParam(url, key, value) {
        const params = this.params(url)
        params[key] = value;
        const search = qs.stringify(params);

        url = this.removeParams(url)
        url += '?' + search;
        return url;
    }

}