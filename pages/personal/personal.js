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
        var realname = wx.getStorageSync("realname");
        var token = wx.getStorageSync("token");
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
                    console.log(res)
                    if (res.data.Code == 0) {
                        this.setData({ realname: realname, token: token });
                    } else {
                        wx.showToast({
                            title: '登入账号过期，请重新登入',
                            icon: 'none',
                            duration: 1000
                        })
                        setTimeout(() => {
                            wx.navigateTo({
                                url: '/pages/login/login'
                            })
                        }, 1000)
                    }

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
        } else {
            wx.showToast({
                title: '您还未登入请先登入',
                icon: 'none',
                duration: 1000
            })
            setTimeout(() => {
                wx.navigateTo({
                    url: '/pages/login/login'
                })
            }, 1000)
        }
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
    },
    exit() {
        wx.showModal({
            title: '退出登入',
            content: '确定退出登入吗?',
            success: (res) => {
                console.log(res.confirm)
                if (res.confirm) {
                    wx.removeStorageSync('token')
                    wx.removeStorageSync('realname')
                    wx.switchTab({
                        url: "/pages/index/index"
                    })
                }
            }
        })
    }
})