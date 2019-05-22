// pages/user/orderDtl.js
import dataApi from '../../utils/dataApi'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ss: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var token = wx.getStorageSync('token');
        if (token == '') {
            wx.navigateBack({ delta: 1 });
        } else {
            dataApi.checkToken({ token }).then(res => {
                    if (res.data.Code != 0) {
                        wx.removeStorageSync("token");
                        wx.navigateBack({ delta: 1 });
                        return;
                    }
                    this.setData({ token: token });
                    this.loadData(options.orderid);
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
                //             wx.removeStorageSync("token");
                //             wx.navigateBack({ delta: 1 });
                //             return;
                //         }
                //         this.setData({ token: token });
                //         this.loadData(options.orderid);
                //     }
                // });
                //this.loadData(1);
        };
    },
    loadData: function(orderid) {
        dataApi.getOrderDetail({ orderid }, { "token": this.data.token }).then(res => {
                if (res.data.Code != 0) return;
                var data = res.data.Datas;
                console.log(data);
                this.setData({
                    order: data
                })
            })
            // wx.request({
            //     url: "https://shoptest.jzyglxt.com/Order/GetOrderDetail",
            //     method: 'post',
            //     header: {
            //         "Content-Type": "application/x-www-form-urlencoded",
            //         "token": this.data.token
            //     },
            //     data: { "orderid": orderid },
            //     success: (res) => {
            //         if (res.data.Code != 0) return;
            //         var data = res.data.Datas;
            //         console.log(data);
            //         this.setData({
            //             order: data
            //         })
            //     }
            // })
    }
})