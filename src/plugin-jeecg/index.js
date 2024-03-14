import qs from 'qs'

// 路径类似     /flowable/index.html?token_jeecg=TOKENXXX

const QUERY_KEY = "token_jeecg"

let isJeecg = null;

export function appendJeecgHeader(headers) {
  if(isJeecg === false){
    return
  }

  let url = window.location.search;
  if(url.length > 0){
    url = url.substring(1)
  }

  let params = qs.parse(url);
  let token = params[QUERY_KEY];

  isJeecg = token != null;
  if(isJeecg) {
    headers['X-Access-Token'] = token
  }

}
