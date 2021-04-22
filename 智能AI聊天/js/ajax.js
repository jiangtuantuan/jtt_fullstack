/**
 * @param {Object} options 
 * @desc 封装一个ajax函数  使所有的网络请求都用该函数
 * 参数：   
    1. method: 请求方式
    2. url: 请求地址
    3. data: 请求参数（数据）
    4. isAsync: 是否异步
    5. success: 成功拿到数据之后做的功能
    6. error: 失败的回调函数 

    当前函数有局限性： data必须为字符串， method只能是GET和POST
 */
function ajax (options) {
    var method = options.method || 'GET';
    // http://localhost:3000/data?appkey=xxxxx
    // http://loaclhost:3333/data?
    var url = options.url || "";
    var data = options.data || "";
    var isAsync = options.isAsync !== undefined ? options.isAsync : true;
    var success = options.success || function () {};
    var error = options.error || function () {};

    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    } else {
        return alert('该浏览器不支持XMLHTTPReQUEST')
    }
    // 当readystate属性变化的时候才会触发
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                // 接收到数据之后的处理
                success(JSON.parse(xhr.responseText));
            }
        }
    }
    // 当前请求出现问题了  就会触发
    xhr.onerror = function (e) {
        error('error');
    }

    // 统一将用户传递过来的请求方式转换为大写   
    method = method.toUpperCase();
    if (method == 'GET') {
        // 代表地址里面可能含有数据
        if (url.indexOf('?') > -1) {
            // 判断?的位置是否在最后 如果是则直接拼接  否则证明有数据 接着拼接后面的数据就好
            if (url.indexOf('?') === url.length - 1) {
                url += data;
            } else {
                url += '&' + data;
            }
        } else {
            // 地址当中没有数据
            url += '?' + data;
        }
        console.log(method, url, isAsync)
        xhr.open(method, url, isAsync);
        xhr.send();
    } else {
        xhr.open(method, url, isAsync);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(data)
    }
  
}