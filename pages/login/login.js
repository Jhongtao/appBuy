const md5 = require('../../utils/md5.js')
const app = getApp();
import dataApi from '../../utils/dataApi'
Page({
    data: {
        picId: '',
        VerifyImg: '/img/code.svg',
        picCode: '',
        sessionid: '',
        header: ''
    },
    onLoad: function(options) {
        wx.removeStorageSync("realname");
        wx.removeStorageSync("token");
    },
    onReady: function() {

    },
    onShow: function() {

    },
    verifyImg(e) {

        if (this.data.picId == '') {
            this.changeVerifyImg();
        }
    },
    changeVerifyImg(e) {
        // var url = 'https://shoptest.jzyglxt.com/ComApi/GetPicVerify';
        // this.setData({ 'header': url });
        dataApi.getPicVerify({ _: Math.random() }).then(res => {
            // console.log(res)
            var sessionid = res.header["Set-Cookie"];
            if (/^ASP\.NET_SessionId=/.test(sessionid)) {
                var i = sessionid.indexOf(';');
                if (i >= 0) sessionid = sessionid.substring(18, i);
                else sessionid = sessionid.substring(18);
                this.setData({
                    sessionid: sessionid
                });
            }
            if (res.data.Code == 0)
                this.setData({
                    VerifyImg: res.data.Notes,
                    picId: res.data.Datas,
                })
        })

        // var url = 'https://shoptest.jzyglxt.com/ComApi/GetPicVerify';
        // this.setData({ 'header': url });
        // console.log(this.data.sessionid)
        // wx.request({
        //     url: url,
        //     data: {
        //         num: Math.random()
        //     },
        //     header: {
        //         // "Content-Type": "application/x-www-form-urlencoded",
        //         // "Cookie": "ASP.NET_SessionId=" + this.data.sessionid,
        //         // "Accept": "application/json, text/plain, */*"
        //     },
        //     "fail": (e) => {
        //         this.setData({
        //             'header': JSON.stringify(e),
        //         })
        //     },
        //     "success": res => {
        //         // console.log(res)
        //         //this.setData({ 'header': JSON.stringify(res.header)});
        //         var sessionid = res.header["Set-Cookie"];
        //         if (/^ASP\.NET_SessionId=/.test(sessionid)) {
        //             var i = sessionid.indexOf(';');
        //             if (i >= 0) sessionid = sessionid.substring(18, i);
        //             else sessionid = sessionid.substring(18);
        //             //console.log(sessionid);
        //             this.setData({
        //                 sessionid: sessionid
        //             });
        //         }
        //         if (res.data.Code == 0)
        //             this.setData({
        //                 VerifyImg: res.data.Notes,
        //                 picId: res.data.Datas,
        //             })
        //     }
        // })
    },
    CheckUser(e) {
        var obj = e.detail.value;
        if (obj.userName == '') {
            wx.showToast({
                title: '请输入用户名',
                icon: 'none',
                duration: 1000
            });
            return;
        }
        if (obj.passWord == '') {
            wx.showToast({
                title: '请输入密码',
                icon: 'none',
                duration: 1000
            });
            return;
        }
        if (obj.picCode.length < 6) {
            wx.showToast({
                title: '请输入6位数字验证码',
                icon: 'none',
                duration: 1000
            });
            return;
        }
        wx.showLoading({ title: '提交中' });
        var password = md5(obj.passWord);
        obj = Object.assign(obj, { passWord: password, picId: this.data.picId });
        // console.log(obj)
        dataApi.checkUser({
            ...obj
        }, {
            "Cookie": "ASP.NET_SessionId=" + this.data.sessionid
        }).then(res => {
            wx.hideLoading();
            var data = res.data;
            if (data.Code != '0') {
                console.log(res)
                this.setData({
                    picCode: '',
                    VerifyImg: '../img/code.svg',
                    picId: ''
                });
                wx.showToast({
                    title: data.Msg,
                    icon: 'none',
                    duration: 1000
                });
            } else {
                var datas = res.data.Datas;
                var i = datas.indexOf(',');
                var realname = datas.substring(i + 1);
                var token = datas.substring(0, i);
                wx.setStorageSync("realname", realname);
                wx.setStorageSync("token", token);
                wx.navigateBack({ delta: 1 });
            }
        })

        // wx.request({
        //     url: 'https://shoptest.jzyglxt.com/User/CheckUser',
        //     method: 'post',
        //     header: {
        //         "Content-Type": "application/x-www-form-urlencoded",
        //         "Cookie": "ASP.NET_SessionId=" + this.data.sessionid
        //     },
        //     data: obj,
        //     success: res => {
        //         //console.log(res.data);
        //         wx.hideLoading();
        //         var data = res.data;
        //         if (data.Code != '0') {
        //             // console.log(res)
        //             this.setData({
        //                 picCode: '',
        //                 VerifyImg: '../img/code.svg',
        //                 picId: ''
        //             });
        //             wx.showToast({
        //                 title: data.Msg,
        //                 icon: 'none',
        //                 duration: 1000
        //             });
        //         } else {
        //             var datas = res.data.Datas;
        //             var i = datas.indexOf(',');
        //             var realname = datas.substring(i + 1);
        //             var token = datas.substring(0, i);
        //             wx.setStorageSync("realname", realname);
        //             wx.setStorageSync("token", token);
        //             wx.navigateBack({ delta: 1 });
        //         }
        //     }
        // })
    }
})