// pages/user/register.js
const md5 = require('../../utils/md5.js');
const region = require('../../utils/region.js');
import dataApi from '../../utils/dataApi'
Page({
    data: {
        region: [],
        provinceCode: 0,
        cityCode: 0,
        areaCode: 0,
        VerifyImg: '/img/code.svg',
        picId: '',
        phone: '',
        validphone: false,
        picCode: '',
        sessionid: '',
        verifyId: 'e45c090ec275494dbc213f345020179c',
        hasread: false,
        showmodel: false,
        phoneShow: false,
        codeShow: false
    },
    onLoad: function(options) {
        region.IdToVal.call(this);
    },
    codeShow(e) {
        if (e.detail.value.length < 6) {
            this.setData({
                codeShow: true
            })
        } else {
            this.setData({
                codeShow: false
            })
        }
    },
    phoneShow(e) {
        if (e.detail.value.length < 11) {
            this.setData({
                phoneShow: true
            })
        } else {
            this.setData({
                phoneShow: false
            })
        }
    },
    verifyImg(e) {
        if (this.data.picId == '') {
            this.changeVerifyImg();
        }
    },
    changeVerifyImg(e) {
        dataApi.getPicVerify({ _: Math.random() }).then(res => {
                var sessionid = res.header["Set-Cookie"];
                if (/^ASP\.NET_SessionId=/.test(sessionid)) {
                    var i = sessionid.indexOf(';');
                    if (i >= 0) sessionid = sessionid.substring(18, i);
                    else sessionid = sessionid.substring(18);
                    console.log(sessionid);
                    this.setData({
                        sessionid: sessionid
                    });
                }
                if (res.data.Code == 0)
                    this.setData({
                        VerifyImg: res.data.Notes,
                        picId: res.data.Datas
                    })
            })
            // wx.request({
            //     url: 'https://shoptest.jzyglxt.com/ComApi/GetPicVerify?_=' + Math.random(),
            //     header: {
            //         "Content-Type": "application/x-www-form-urlencoded",
            //         "Cookie": "ASP.NET_SessionId=" + this.data.sessionid,
            //         "Accept": "application/json, text/plain, */*"
            //     },
            //     "success": res => {
            //         var sessionid = res.header["Set-Cookie"];
            //         if (/^ASP\.NET_SessionId=/.test(sessionid)) {
            //             var i = sessionid.indexOf(';');
            //             if (i >= 0) sessionid = sessionid.substring(18, i);
            //             else sessionid = sessionid.substring(18);
            //             console.log(sessionid);
            //             this.setData({
            //                 sessionid: sessionid
            //             });
            //         }
            //         if (res.data.Code == 0)
            //             this.setData({
            //                 VerifyImg: res.data.Notes,
            //                 picId: res.data.Datas
            //             })
            //     }
            // })
    },
    getphone(e) {
        var phone = e.detail.value;
        this.setData({
            phone: phone,
            validphone: /^1\d{10}$/.test(phone)
        })
    },
    setpicCode(e) {
        var picCode = e.detail.value;
        this.setData({
            picCode: picCode
        })
    },
    sendmsgcode(e) {
        if (!this.data.validphone) {
            wx.showToast({
                title: '手机号输入不正确',
                icon: 'none',
                duration: 1000
            });
            return;
        }
        if (this.data.picCode.length < 6) {
            wx.showToast({
                title: '请输入6位数字图形验证码',
                icon: 'none',
                duration: 1000
            })
            return;
        }
        dataApi.sendSms({
                picId: this.data.picId,
                phone: this.data.phone,
                picCode: this.data.picCode
            }, { "Cookie": "ASP.NET_SessionId=" + this.data.sessionid }).then(res => {
                console.log(res.data);
                if (res.data.Code != 30103) {
                    this.setData({
                        picCode: '',
                        verifyImg: '/img/code.svg',
                        picId: ''
                    });
                    wx.showToast({
                            title: res.data.Msg,
                            icon: 'none',
                            duration: 1000
                        })
                        //this.changeVerifyImg();
                } else {
                    var verifyId = res.data.Datas;
                    this.setData({
                        verifyId: verifyId
                    });
                    wx.showToast({
                        title: '6位数字短信验证码已发送到你的手机，请注意查看',
                        icon: 'none',
                        duration: 2000
                    })
                }
            })
            // wx.request({
            //     url: "https://shoptest.jzyglxt.com/ComApi/SendSms",
            //     method: "post",
            //     header: {
            //         "Content-Type": "application/x-www-form-urlencoded",
            //         "Cookie": "ASP.NET_SessionId=" + this.data.sessionid,
            //     },
            //     data: {
            //         picId: this.data.picId,
            //         phone: this.data.phone,
            //         picCode: this.data.picCode
            //     },
            //     success: res => {
            //         console.log(res.data);
            //         if (res.data.Code != 30103) {
            //             this.setData({
            //                 picCode: '',
            //                 verifyImg: '../img/code.svg',
            //                 picId: ''
            //             });
            //             wx.showToast({
            //                     title: res.data.Msg,
            //                     icon: 'none',
            //                     duration: 1000
            //                 })
            //                 //this.changeVerifyImg();
            //         } else {
            //             var verifyId = res.data.Datas;
            //             this.setData({
            //                 verifyId: verifyId
            //             });
            //             wx.showToast({
            //                 title: '6位数字短信验证码已发送到你的手机，请注意查看',
            //                 icon: 'none',
            //                 duration: 2000
            //             })
            //         }
            //     }
            // })
    },
    registeruser: function(e) {
        var obj = e.detail.value;
        console.log(obj);
        if (obj.realName == '') {
            wx.showToast({
                title: '请填写姓名/单位名称',
                icon: 'none',
                duration: 1000
            });
            return;
        }
        if (obj.region.lenth !== 3) {
            wx.showToast({
                title: '请选择省市区',
                icon: 'none',
                duration: 1000
            });
            return;
        }
        if (obj.userName == '') {
            wx.showToast({
                title: '请填写用户名',
                icon: 'none',
                duration: 1000
            });
            return;
        }
        if (obj.password == '' || obj.password.length < 8) {
            wx.showToast({
                title: '密码不能少于6个字符',
                icon: 'none',
                duration: 1000
            });
            return;
        }
        if (obj.password != obj.password2) {
            wx.showToast({
                title: '两次密码输入不一致',
                icon: 'none',
                duration: 1000
            });
            return;
        }
        if (obj.phone == '' || obj.phone.length < 11) {
            wx.showToast({
                title: '请填写手机号',
                icon: 'none',
                duration: 1000
            });
            return;
        }
        if (obj.picCode == '' || obj.picCode.length < 6) {
            wx.showToast({
                title: '请填写图形验证码',
                icon: 'none',
                duration: 1000
            });
            return;
        }
        if (obj.code == '' || obj.code.length < 6) {
            wx.showToast({
                title: '请填写短信验证码',
                icon: 'none',
                duration: 1000
            });
            return;
        }
        if (!obj.checkbox || obj.checkbox.length == 0) {
            this.showmodel();
            return;
        }
        var password = md5(obj.password);
        obj = Object.assign(obj, { verifyId: this.data.verifyId, province: this.data.regionId[0], city: this.data.regionId[1], area: this.data.regionId[2], password: password });
        delete obj.password2;
        delete obj.phone;
        delete obj.picCode;
        wx.showLoading({ title: '提交中' });
        dataApi.registerUser(obj, { "Cookie": "ASP.NET_SessionId=" + this.data.sessionid }).then(res => {
                var data = res.data;
                wx.hideLoading();
                if (data.Code != 0) {
                    wx.showToast({
                        title: data.Msg,
                        icon: 'none',
                        duration: 1000
                    });
                } else {
                    wx.showToast({
                        title: '恭喜，注册成功！请登录',
                        icon: 'none',
                        duration: 1000,
                        success: function() {
                            wx.navigateBack({ delta: 1 });
                        }
                    });
                }
            })
            // wx.request({
            //     url: 'https://shoptest.jzyglxt.com/User/RegisterUser',
            //     method: "post",
            //     header: {
            //         "Content-Type": "application/x-www-form-urlencoded",
            //         "Cookie": "ASP.NET_SessionId=" + this.data.sessionid,
            //     },
            //     data: obj,
            //     success: res => {
            //         var data = res.data;
            //         wx.hideLoading();
            //         if (data.Code != 0) {
            //             wx.showToast({
            //                 title: data.Msg,
            //                 icon: 'none',
            //                 duration: 1000
            //             });
            //         } else {
            //             wx.showToast({
            //                 title: '恭喜，注册成功！请登录',
            //                 icon: 'none',
            //                 duration: 1000,
            //                 success: function() {
            //                     wx.navigateBack({ delta: 1 });
            //                 }
            //             });
            //         }
            //     }
            // })
    },
    showmodel: function(e) {
        if (!this.data.hasread) {
            this.setData({
                showmodel: true
            })
        }
    },
    checkboxChange: function(e) {
        //console.log(e.detail.value);
        if (e.detail.value.length == 1)
            this.setData({
                hasread: true
            })
        else this.setData({
            hasread: false
        })
    },
    hidemodel: function(e) {
        this.setData({
            showmodel: false
        });
    },
    agree: function(e) {
        this.setData({
            showmodel: false,
            hasread: true
        })
    },
    changeRegion: function(e) {
        var column = e.detail.column;
        var value = e.detail.value;
        region.IndexToVal.call(this, column, value);
    },
    getRegion: function(e) {
        //var obj=region.IndexToVal()
        var value = e.detail.value;
        region.IndexToId.call(this, value);
    },
    resetRegion: function(e) {
        region.resetArr.call(this)
    }
})