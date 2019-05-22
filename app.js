//app.js
App({
        onLaunch: function() {
            wx.getSetting({
                success: res => {
                    if (res.authSetting['scope.userInfo']) {
                        wx.getUserInfo({
                            success: res => {
                                // console.log(this)
                                this.globalData.userInfo = res.userInfo;
                            }
                        })
                    }
                }
            })
        },
        globalData: {
            userInfo: null
        }
    })
    // {
    //     "pagePath": "pages/cate/cate",
    //     "text": "商品分类",
    //     "iconPath": "pages/img/cate.png",
    //     "selectedIconPath": "pages/img/cate2.png"
    // },