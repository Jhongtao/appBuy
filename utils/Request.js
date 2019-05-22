//测试地址https://shoptest.jzyglxt.com
//上线地址https://shop.jzyglxt.com
const bastUrl = 'https://shoptest.jzyglxt.com'
class Request {
    constructor() {

    }
    getData(url, params, head = null) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: bastUrl + url,
                header: {
                    ...head
                },
                data: {
                    ...params
                },
                success: resolve,
                fail: reject
            })
        })
    }
    postData(url, params, head = null) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: bastUrl + url,
                header: {
                    "content-type": "application/x-www-form-urlencoded",
                    ...head
                },
                method: 'POST',
                data: {
                    ...params
                },
                success: resolve,
                fail: reject
            })
        })
    }
}
export default Request