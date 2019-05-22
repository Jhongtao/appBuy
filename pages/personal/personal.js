// pages/user/index.js
import dataApi from '../../utils/dataApi'
const app = getApp()
Page({
    data: {
        userInfo: null,
        realname: '',
        token: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // console.log(getApp().globalData.userInfo)
        wx.login({
            success: (res) => {
                // console.log(res);
                var code = res.code;

                // wx.request({
                //     url: 'https://api.weixin.qq.com/sns/jscode2session',
                //     data: {
                //         appid: 'wxaa159c2be81d3fb7',
                //         secret: '',
                //         js_code: code,
                //         grant_type: 'authorization_code'
                //     },
                //     succes: (res) => {
                //         console.log(res);
                //     }
                // })
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        console.log('onReady');
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        var realname = wx.getStorageSync("realname");
        var token = wx.getStorageSync("token");
        if (token) {
            //
            dataApi.checkToken({
                    token
                }).then(res => {
                    if (res.data.Code == 0)
                        this.setData({ realname: realname, token: token });
                })
                // wx.request({
                //     url: 'https://shoptest.jzyglxt.com/User/CheckToken',
                //     method: 'post',
                //     header: {
                //         "Content-Type": "application/x-www-form-urlencoded",
                //         "token": token,
                //     },
                //     success: res => {
                //         if (res.data.Code == 0)
                //             this.setData({ realname: realname, token: token });
                //     }
                // })
        } else this.setData({ realname: '', token: '' });
        if (getApp().globalData.userInfo) this.setData({ userInfo: getApp().globalData.userInfo });
    },

    /**
     * 生命周期函数--监听页面隐藏
     */

    getUserInfo: function(e) {
        var _this = this;
        // console.log(e)
        // console.log(app.globalData)
        // if (app.globalData.userInfo) return;
        if (e.detail.userInfo) {
            app.globalData.userInfo = e.detail.userInfo
            this.setData({
                userInfo: e.detail.userInfo
            })
        }
        // console.log(app.globalData.userInfo)
        // wx.openSetting({
        //     success(res) {
        //         if (res.authSetting["scope.userInfo"]) {
        //             wx.getUserInfo({
        //                 success: res => {
        //                     app.globalData.userInfo = res.userInfo;
        //                     console.log(res.signature);
        //                     _this.setData({
        //                         userInfo: res.userInfo
        //                     })
        //                 }
        //             })
        //         }
        //     }
        // })
    }
})