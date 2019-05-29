// pages/user/pay.js
import dataApi from '../../utils/dataApi'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        s: 1,
        ss: 3,
        payInfo: '',
        drawList: [],
        VerifyImg: '/img/code.svg',
        picCode: '',
        picId: '',
        phone: '',
        validphone: false,
        token: ''
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
                    this.loadData(this.data.s)
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
                //         this.loadData(this.data.s)
                //     }
                // });
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */

    switchs: function(e) {
        var s = 1;
        var offsetLeft = e.target.offsetLeft;
        if (offsetLeft == 92) s = 2;
        this.setData({ s: s, ss: 3 });
        this.loadData(s);
    },
    switchss: function(e) {
        console.log(e);
        var text = e._relatedInfo.anchorTargetText;
        var ss = 3;
        if (e.type == 'tap') {
            if (text == '暂未注册账号信息，点此注册支付账号') ss = 1;
            else if (text == '查看提现信息') ss = 2;
            //else if (text =='隐藏提现信息')ss=3;
            //else if (text =='注册支付账号'||text=='提现'||text=='充值步骤'||text=='')ss=3;
            else if (text == '已经注册支付帐号，点此提现') ss = 4;
            else if (text == '充值') ss = 5;
            this.setData({ ss: ss })
        }
    },
    loadData: function(s) {
        if (s == 1) {
            if (!this.data.payInfo)
                dataApi.getPayInfo({ "token": this.data.token }).then(res => {
                    var data = res.data;
                    if (data.Code == 0) {
                        console.log(data)
                        var payInfo = data.Datas;
                        payInfo.balance = '***';
                        var PapersCodeMask = payInfo.PapersCode;
                        PapersCodeMask = PapersCodeMask.replace(/^(\w{3})(\w+)(\w{3})$/, `$1${'*'.repeat(PapersCodeMask.length-6)}$3`);
                        payInfo.PapersCodeMask = PapersCodeMask;
                        var PhoneMask = payInfo.Phone;
                        PhoneMask = PhoneMask.replace(/^(\w{3})(\w+)(\w{3})$/, `$1${'*'.repeat(PhoneMask.length-6)}$3`);
                        payInfo.PhoneMask = PhoneMask;
                        var OthBankPayeeSubAcMask = payInfo.OthBankPayeeSubAcc;
                        OthBankPayeeSubAcMask = OthBankPayeeSubAcMask.replace(/^(\w{3})(\w+)(\w{3})$/, `$1${'*'.repeat(OthBankPayeeSubAcMask.length-6)}$3`);
                        payInfo.OthBankPayeeSubAccMask = OthBankPayeeSubAcMask;
                        if (payInfo.SettleAccount) {
                            var SettleAccountMask = payInfo.SettleAccount;
                            SettleAccountMask = SettleAccountMask.replace(/^(\w{3})(\w+)(\w{3})$/, `$1${'*'.repeat(SettleAccountMask.length-6)}$3`);
                            payInfo.SettleAccountMask = SettleAccountMask;
                        }
                        this.setData({
                            payInfo: payInfo
                        });
                    }
                })
            dataApi.checkBalance({ "token": this.data.token }).then(res => {
                    var data = res.data;
                    if (data.Code == 0) {
                        var balance = data.Datas;
                        this.setData({
                            balance: balance
                        })
                    }
                })
                // w
                // wx.request({
                //     url: 'https://shoptest.jzyglxt.com/Pay/GetPayInfo',
                //     method: 'post',
                //     header: {
                //         "Content-Type": "application/x-www-form-urlencoded",
                //         "token": this.data.token
                //     },
                //     success: res => {
                //         var data = res.data;
                //         if (data.Code == 0) {
                //             var payInfo = data.Datas;
                //             payInfo.balance = '***';
                //             var PapersCodeMask = payInfo.PapersCode;
                //             PapersCodeMask = PapersCodeMask.replace(/^(\w{3})(\w+)(\w{3})$/, '$1***$3');
                //             payInfo.PapersCodeMask = PapersCodeMask;
                //             var PhoneMask = payInfo.Phone;
                //             PhoneMask = PhoneMask.replace(/^(\w{3})(\w+)(\w{3})$/, '$1***$3');
                //             payInfo.PhoneMask = PhoneMask;
                //             var OthBankPayeeSubAcMask = payInfo.OthBankPayeeSubAcc;
                //             OthBankPayeeSubAcMask = OthBankPayeeSubAcMask.replace(/^(\w{3})(\w+)(\w{3})$/, '$1***$3');
                //             payInfo.OthBankPayeeSubAccMask = OthBankPayeeSubAcMask;
                //             var SettleAccountMask = payInfo.SettleAccount;
                //             SettleAccountMask = SettleAccountMask.replace(/^(\w{3})(\w+)(\w{3})$/, '$1***$3');
                //             payInfo.SettleAccountMask = SettleAccountMask;
                //             this.setData({
                //                 payInfo: payInfo
                //             });
                //         }
                //     }
                // })
        } else {
            if (this.data.drawList.length == 0)
                dataApi.getWithdrawList({ "token": this.data.token }).then(res => {
                    var data = res.data;
                    console.log(res)
                    if (data.Code == 0) {
                        var drawList = data.Datas;
                        drawList.forEach(function(item, index) {
                            var str;
                            switch (item.Status) {
                                case "0":
                                    str = '未操作';
                                    break;
                                case "1":
                                    str = '提现处理中';
                                    break;
                                case "2":
                                    str = '提现成功';
                                    color = "#92D050";
                                    break;
                                case "3":
                                    str = '提现失败';
                                    break;
                                default:
                                    break;
                            }
                            drawList[index].Status = str;
                        })
                        this.setData({
                            drawList: drawList
                        })
                    }
                })
                // wx.request({
                //     url: 'https://shoptest.jzyglxt.com/User/GetWithdrawList',
                //     method: 'post',
                //     header: {
                //         "Content-Type": "application/x-www-form-urlencoded",
                //         "token": this.data.token
                //     },
                //     success: res => {
                //         var data = res.data;
                //         console.log(res)
                //         if (data.Code == 0) {
                //             var drawList = data.Datas;
                //             drawList.forEach(function(item, index) {
                //                 var str;
                //                 switch (item.Status) {
                //                     case "0":
                //                         str = '未操作';
                //                         break;
                //                     case "1":
                //                         str = '提现处理中';
                //                         break;
                //                     case "2":
                //                         str = '提现成功';
                //                         color = "#92D050";
                //                         break;
                //                     case "3":
                //                         str = '提现失败';
                //                         break;
                //                     default:
                //                         break;
                //                 }
                //                 drawList[index].Status = str;
                //             })
                //             this.setData({
                //                 drawList: drawList
                //             })
                //         }
                //     }
                // })
        }
    },
    verifyImg(e) {
        // console.log(11)
        if (!this.data.picId) {
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
            //     "url": 'https://shoptest.jzyglxt.com/ComApi/GetPicVerify?_=' + Math.random(),
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
                        verifyImg: '../img/code.svg',
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
    radioChange: function(e) {
        console.log(e.detail);
        this.setData({ ss: e.detail.value });
    },
    switchmask: function(e) {
        var field = e.target.dataset.field;
        var payInfo = this.data.payInfo;
        console.log(payInfo[field + 'Mask']);
        if (payInfo[field + 'Mask']) {
            delete payInfo[field + 'Mask'];
        } else {
            var str = payInfo[field];
            str = str.replace(/^(\w{3})(\w+)(\w{3})$/, `$1${'*'.repeat(str.length-6)}$3`);
            payInfo[field + 'Mask'] = str;
        }
        this.setData({
            payInfo: payInfo
        });
    },
    checkbalance: function(e) {
        dataApi.checkBalance({ "token": this.data.token }).then(res => {
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
    }
})