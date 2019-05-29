// pages/user/cart2.js
import dataApi from '../../utils/dataApi'
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var OrderId = options.orderid;
        var token = wx.getStorageSync('token');
        if (token == '') {
            wx.navigateBack({ delta: 1 });
        }
        dataApi.checkToken({ token }).then(res => {
                if (res.data.Code != 0) {
                    wx.navigateBack({ delta: 1 });
                    return;
                }
                this.setData({ token: token });
                dataApi.getOrderById({
                    OrderId
                }, {
                    token
                }).then(res => {
                    if (res.data.Code != 0) {
                        wx.showToast({
                            title: res.data.Msg,
                            icon: 'none',
                            duration: 1000
                        });
                        return;
                    }
                    var data = res.data.Datas.reverse();
                    //var totalPrice = data.ExpressFee;
                    //data.Goods.forEach(function (item) { totalPrice = totalPrice + item.PrefPrice * item.Number});
                    //data.totalPrice=totalPrice;
                    var totalPrice = 0;
                    data.forEach((item, index) => { totalPrice += item.RealPrice });
                    var OrderId = data.map((item, index) => { return item.OrderId }).join(',');
                    this.setData({ 'goods': data, 'totalPrice': totalPrice, 'OrderId': OrderId });
                })
                dataApi.checkBalance({ token }).then(res => {
                    if (res.data.Code == 0) this.setData({ 'balance': res.data.Datas });
                })
                dataApi.getPayInfo({ token }).then(res => {
                    if (res.data.Code == 0) {
                        var data = res.data.Datas;
                        var OthBankPayeeSubAcc = data.OthBankPayeeSubAcc;
                        //console.log(OthBankPayeeSubAcc);
                        data.OthBankPayeeSubAccMask = OthBankPayeeSubAcc.replace(/^(\w{3})(\w+)(\w{3})$/, '$1***$3');
                        this.setData({ payInfo: data });
                    }
                })
            })
            // wx.request({
            //     url: 'https://shoptest.jzyglxt.com/User/CheckToken',
            //     method: 'post',
            //     header: {
            //         "Content-Type": "application/x-www-form-urlencoded",
            //         "token": token,
            //     },
            //     success: res => {
            //         if (res.data.Code != 0) {
            //             wx.navigateBack({ delta: 1 });
            //             return;
            //         }
            //         this.setData({ token: token });
            //         wx.request({
            //             url: "https://shoptest.jzyglxt.com/Buyer/GetOrderById",
            //             method: 'post',
            //             header: {
            //                 "Content-Type": "application/x-www-form-urlencoded",
            //                 "token": token,
            //             },
            //             data: { 'OrderId': OrderId },
            //             success: res => {
            //                 if (res.data.Code != 0) {
            //                     wx.showToast({
            //                         title: res.data.Msg,
            //                         icon: 'none',
            //                         duration: 1000
            //                     });
            //                     return;
            //                 }
            //                 var data = res.data.Datas.reverse();
            //                 //var totalPrice = data.ExpressFee;
            //                 //data.Goods.forEach(function (item) { totalPrice = totalPrice + item.PrefPrice * item.Number});
            //                 //data.totalPrice=totalPrice;
            //                 var totalPrice = 0;
            //                 data.forEach(function(item, index) { totalPrice += item.RealPrice });
            //                 var OrderId = data.map(function(item, index) { return item.OrderId }).join(',');
            //                 this.setData({ 'goods': data, 'totalPrice': totalPrice, 'OrderId': OrderId });
            //             }
            //         })
            //         wx.request({
            //             url: "https://shoptest.jzyglxt.com/Pay/CheckBalance",
            //             method: 'post',
            //             header: {
            //                 "Content-Type": "application/x-www-form-urlencoded",
            //                 "token": token,
            //             },
            //             success: res => {
            //                 if (res.data.Code == 0) this.setData({ 'balance': res.data.Datas });
            //             }
            //         });
            //         wx.request({
            //             url: "https://shoptest.jzyglxt.com/Pay/GetPayInfo",
            //             method: 'post',
            //             header: {
            //                 "Content-Type": "application/x-www-form-urlencoded",
            //                 "token": token,
            //             },
            //             success: res => {
            //                 if (res.data.Code == 0) {
            //                     var data = res.data.Datas;
            //                     var OthBankPayeeSubAcc = data.OthBankPayeeSubAcc;
            //                     //console.log(OthBankPayeeSubAcc);
            //                     data.OthBankPayeeSubAccMask = OthBankPayeeSubAcc.replace(/^(\w{3})(\w+)(\w{3})$/, '$1***$3');
            //                     this.setData({ payInfo: data });
            //                 }
            //             }
            //         })
            //     }
            // })
    },
    SettleOrder: function(e) {
        dataApi.getPayOrderCode({ 'orderId': this.data.OrderId }, { token: this.data.token }).then(res => {
                if (res.data.Code != 0) {
                    wx.showToast({
                        title: res.data.Msg,
                        icon: 'none',
                        duration: 1000
                    });
                    if (res.data.Msg == '金额不足') {
                        this.setData({ 'ss': 4 });
                    }
                    return
                }
                var s = res.data.Datas.split(',');
                var payOrderId = s[1],
                    codeId = s[0];
                this.setData({ 'ss': 5, 'payOrderId': payOrderId, 'codeId': codeId });
            })
            // wx.request({
            //     url: 'https://shoptest.jzyglxt.com/Buyer/GetPayOrderCode',
            //     method: 'post',
            //     header: {
            //         "Content-Type": "application/x-www-form-urlencoded",
            //         "token": this.data.token,
            //     },
            //     data: { 'orderId': this.data.OrderId },
            //     success: res => {
            //         if (res.data.Code != 0) {
            //             wx.showToast({
            //                 title: res.data.Msg,
            //                 icon: 'none',
            //                 duration: 1000
            //             });
            //             if (res.data.Msg == '金额不足') {
            //                 this.setData({ 'ss': 4 });
            //             }
            //             return
            //         }
            //         var s = res.data.Datas.split(',');
            //         var payOrderId = s[1],
            //             codeId = s[0];
            //         this.setData({ 'ss': 5, 'payOrderId': payOrderId, 'codeId': codeId });
            //     }
            // })
    },
    SettleOrder2: function(e) {
        console.log(e);

        var verifyCode = e.detail.value.verifyCode;
        var obj = { 'goodsOrderId': this.data.OrderId, 'payOrderId': this.data.payOrderId, 'codeId': this.data.codeId, 'verifyCode': verifyCode };
        dataApi.payOrder(obj, { token: this.data.token }).then(res => {
                if (res.data.Code != 0) {
                    wx.showToast({
                        title: res.data.Msg,
                        icon: 'none',
                        duration: 1000
                    });
                    return;
                }
                wx.showToast({
                    title: '支付成功',
                    icon: 'none',
                    duration: 1000
                });
                setTimeout(function() {
                    wx.navigateTo({
                        url: '/pages/order/order?s=2',
                    })
                }, 1000);
            })
            // wx.request({
            //     'url': 'https://shoptest.jzyglxt.com/Buyer/PayOrder',
            //     method: 'post',
            //     header: {
            //         "Content-Type": "application/x-www-form-urlencoded",
            //         "token": this.data.token,
            //     },
            //     data: obj,
            //     success: res => {
            //         if (res.data.Code != 0) {
            //             wx.showToast({
            //                 title: res.data.Msg,
            //                 icon: 'none',
            //                 duration: 1000
            //             });
            //             return;
            //         }
            //         wx.showToast({
            //             title: '支付成功',
            //             icon: 'none',
            //             duration: 1000
            //         });
            //         setTimeout(function() {
            //             wx.navigateTo({
            //                 url: 'order?s=2',
            //             })
            //         }, 1000);
            //     }
            // })
    },
    checkbalance: function(e) {
        dataApi.checkBalance({ token: this.data.token }).then(res => {
                var data = res.data;
                if (data.Code == 0) {
                    var balance = data.Datas;
                    this.setData({
                        balance: balance
                    })
                }
            })
            // wx.request({
            //     url: 'https://shoptest.jzyglxt.com/Pay/CheckBalance',
            //     method: 'post',
            //     header: {
            //         "Content-Type": "application/x-www-form-urlencoded",
            //         "token": this.data.token
            //     },
            //     success: res => {
            //         var data = res.data;
            //         if (data.Code == 0) {
            //             var balance = data.Datas;
            //             this.setData({
            //                 balance: balance
            //             })
            //         }
            //     }
            // })
    },
    switchss: function(e) {
        var text = e._relatedInfo.anchorTargetText;
        console.log(text);
        switch (text) {
            case "adfadfadf":
                break;
            default:
                this.setData({ "ss": 0 });
                break;
        }
    }
})