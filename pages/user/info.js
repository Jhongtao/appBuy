// pages/user/info.js
import dataApi from '../../utils/dataApi'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        IsPhone: false,
        IsSecret: false,
        IsPwd: false,
        RealName: '',
        UserName: '',
        TelPhone: '',
        safelevel: 0,
        token: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var token = wx.getStorageSync("token");
        if (!token) {
            wx.navigateBack({ delta: 1 });
            return;
        }
        //this.setData({token:token});
        dataApi.checkToken({ token }).then(res => {
                if (res.data.Code != 0) {
                    wx.removeStorageSync("token");
                    wx.navigateBack({ delta: 1 });
                    return;
                }
                this.setData({ token: token });
                dataApi.getUserInfo({ token }).then(res => {
                    if (res.data.Code == 0) {
                        console.log(res.data.Datas);
                        var data = res.data.Datas;
                        var safelevel = 0;
                        if (data.IsPhone) safelevel += 33.3;
                        if (data.IsPwd) safelevel += 33.3;
                        if (data.IsSecret) safelevel += 33.3;
                        safelevel = safelevel.toFixed(0);
                        data.safelevel = safelevel;
                        this.setData(data);
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
            //             wx.removeStorageSync("token");
            //             wx.navigateBack({ delta: 1 });
            //             return;
            //         }
            //         this.setData({ token: token });
            //         wx.request({
            //             url: 'https://shoptest.jzyglxt.com/User/GetUserInfo',
            //             method: 'post',
            //             header: {
            //                 "Content-Type": "application/x-www-form-urlencoded",
            //                 "token": token,
            //             },
            //             success: res => {
            //                 if (res.data.Code == 0) {
            //                     console.log(res.data.Datas);
            //                     var data = res.data.Datas;
            //                     var safelevel = 0;
            //                     if (data.IsPhone) safelevel += 33.3;
            //                     if (data.IsPwd) safelevel += 33.3;
            //                     if (data.IsSecret) safelevel += 33.3;
            //                     safelevel = safelevel.toFixed(0);
            //                     data.safelevel = safelevel;
            //                     this.setData(data);
            //                 }
            //             }
            //         });
            //     }
            // })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})