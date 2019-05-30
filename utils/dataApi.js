import Request from './Request'
class DataApi extends Request {
    constructor() {
            super()
        }
        //首页轮播图
    homeSlideshow() {
            return this.getData('/Home/HomeSlideshow', {})
        }
        //首页商品列表(检测用二维码)10条记录
    getGoodsJcyewm() {
            return this.getData('/Seller/GetGoodsJcyewm', {})
        }
        //首页商品列表（办公设备）10条
    getGoodsBgsb() {
            return this.getData('/Seller/GetGoodsBgsb', {})
        }
        //首页商品列表（电子元器件）10条
    getGoodsDzyqj() {
            return this.getData('/Seller/GetGoodsDzyqj', {})
        }
        //商品分类
    getCategoryPart(params) {
            return this.postData('/Category/GetCategoryPart', params)
        }
        //图形验证码
    getPicVerify(params) {
            return this.getData('/ComApi/GetPicVerify', params)
        }
        //Token校验
    checkToken(head) {
            return this.getData('/User/CheckToken', {}, head)
        }
        //checkUser
    checkUser(params, head) {
            return this.postData('/User/CheckUser', params, head)
        }
        //密码修改->获取短信验证码
    sendSmsForPasswd(params, head) {
            return this.postData('/ComApi/SendSmsForPasswd', params, head)
        }
        //短信验证
    sendSms(params, head) {
            return this.postData('/ComApi/SendSms', params, head)
        }
        //注册
    registerUser(params, head) {
            return this.postData('/User/RegUserInfo', params, head)
        }
        //修改密码
    changePasswd(params, head) {
            return this.postData('/User/ChangePasswd', params, head)
        }
        //查询商品列表
    getGoodsByTitle(params, head) {
            return this.postData('/Seller/GetGoodsByTitle', params, head)
        }
        //获取商品详情
    getGoods(params, head) {
            return this.getData('/Seller/GetSellerGoods', params, head)
        }
        //获取商品详情
    getGoodsInfo(params, head) {
            return this.postData('/Seller/GetSellerGoodsInfo', params, head)
        }
        //获取用户购物车总数
    getUserGoodsNum(head) {
            return this.getData('/Buyer/GetUserCartNumber', {}, head)
        }
        //获取用户购物车列表
    getUserCart(head) {
            return this.getData('/Buyer/GetUserCart', {}, head)
        }
        //商品加入购物车
    upCardGoods(params, head) {
            return this.postData('/Buyer/UpCartGoods', params, head)
        }
        //根据类目查询商品列表
    getGoodsByCategory(params, head) {
            return this.postData('/Seller/GetGoodsByCategory', params, head)
        }
        //用户收货地址列表
    getAddressList(head) {
            return this.getData('/User/GetAddressList', {}, head)
        }
        //获取用户收货地址
    getAddressById(params, head) {
            return this.getData('/User/GetAddressById', params, head)
        }
        //删除用户收货地址
    delAddress(params, head) {
            return this.getData('/User/DelAddress', params, head)
        }
        //跟新用户收货地址
    upAddress(params, head) {
            return this.postData('/User/UpAddress', params, head)
        }
        //保存用户收货地址
    saveAddress(params, head) {
            return this.postData('/User/SaveAddress', params, head)
        }
        //获取用户发票列表
    getInvoiceList(head) {
            return this.getData('/User/GetInvoiceList', {}, head)
        }
        //发票编辑更新
    upInvoice(params, head) {
            return this.postData('/User/UpInvoice', params, head)
        }
        //删除发票
    delInvoice(params, head) {
        return this.getData('/User/DelInvoice', params, head)
    }

    //获取发票类型下拉框
    getInvoiceType(head) {
            return this.getData('/Helper/GetInvoiceType', {}, head)
        }
        //获取发票抬头类型下拉框
    getInvTitleType(head) {
            return this.getData('/Helper/GetInvTitleType', {}, head)
        }
        //获取发票内容类型下拉框
    getInvContentType(head) {
            return this.getData('/Helper/GetInvContentType', {}, head)
        }
        //保存用户发票信息
    saveInvoice(params, head) {
            return this.postData('/User/SaveInvoice', params, head)
        }
        //买家的发票列表（所有列表-GetAllUserInvoice/已开发票列表-GetUserInvoiceYk/未开发票列表-GetUserInvoiceWk）
    getAllUserInvoice(head) {
        return this.postData('/Order/GetAllUserInvoice', {}, head)
    }
    getUserInvoiceYk(head) {
        return this.postData('/Order/GetUserInvoiceYk', {}, head)
    }
    getUserInvoiceWk(head) {
            return this.postData('/Order/GetUserInvoiceWk', {}, head)
        }
        //购物车中数量直接覆盖更新
    upGoodsNumber(params, head) {
            return this.postData('/Buyer/UpGoodsNumber', params, head)
        }
        //删除购物车中的商品
    deleteGoods(params, head) {
            return this.postData('/Buyer/DeleteGoods', params, head)
        }
        //买家的订单列表（所有订单-GetBuyerOrderAll/用户未付款-GetBuyerOrderPxsp/用户取消订单-GetBuyerOrderQxdd/用户已付款-GetBuyerOrderMjfk/商品配货-GetBuyerOrderSpph/物流取件-GetBuyerOrderWlqj/卖家发货-GetBuyerOrderMjfh/已确认收货-GetBuyerOrderQrsh）
    getBuyerOrderPxsp(params, head) {
        return this.postData('/Buyer/GetBuyerOrderPxsp', params, head)
    }
    getBuyerOrderQxdd(params, head) {
        return this.postData('/Buyer/GetBuyerOrderQxdd', params, head)
    }
    getBuyerOrderMjfk(params, head) {
        return this.postData('/Buyer/GetBuyerOrderMjfk', params, head)
    }
    getBuyerOrderMjfh(params, head) {
        return this.postData('/Buyer/GetBuyerOrderMjfh', params, head)
    }
    getBuyerOrderQrsh(params, head) {
            return this.postData('/Buyer/GetBuyerOrderQrsh', params, head)
        }
        //用户取消订单
    cancelOrder(params, head) {
            return this.postData('/Buyer/CancelOrder', params, head)
        }
        //订单详情
    getOrderDetail(params, head) {
            return this.postData('/Order/GetOrderDetail', params, head)
        }
        //结算订单
    settleOrder(params, head) {
            return this.postData('/Buyer/SettleOrder', params, head)
        }
        //直接购买
    directSettleOrder(params, head) {
            return this.postData('/Buyer/DirectSettleOrder', params, head)
        }
        //订单付款
    getOrderById(params, head) {
            return this.postData('/Buyer/GetOrderById', params, head)
        }
        //获取快递费
    getExpressFee(params, head) {
            return this.postData('/User/GetExpressFee', params, head)
        }
        //查询余额
    checkBalance(head) {
            return this.postData('/Pay/CheckBalance', {}, head)
        }
        //获取用户支付账号信息
    getPayInfo(head) {
            return this.postData('/Pay/GetPayInfo', {}, head)
        }
        //获取付款验证码
    getPayOrderCode(params, head) {
            return this.postData('/Buyer/GetPayOrderCode', params, head)
        }
        //付款
    payOrder(params, head) {
            return this.postData('/Buyer/PayOrder', params, head)
        }
        //用户个人中心
    getUserInfo(head) {
            return this.getData('/User/GetUserInfo', {}, head)
        }
        //获取用户支付账号信息
    getPayInfo(head) {
            return this.postData('/Pay/GetPayInfo', {}, head)
        }
        //提现列表
    getWithdrawList(head) {
        return this.postData('/User/GetWithdrawList', {}, head)
    }
}
export default new DataApi()