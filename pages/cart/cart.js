// pages/my/cart.js
const region = require('../../utils/region.js');
import dataApi from '../../utils/dataApi'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        CartGoods: [],
        AddressList: [],
        InvoiceList: [],
        InvoiceTypeList: [],
        InvoiceType: 0,
        InvTitleTypeList: [],
        InvTitleType: 0,
        InvContentTypeList: [],
        InvContentType: 0,
        IsInvoice: false,
        token: '',
        s: true,
        ss: 0,
        IsExpress: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        var token = wx.getStorageSync('token');
        dataApi.checkToken({ token }).then(res => {
            console.log(res)
            if (res.data.Code == 0) {
                this.setData({ token: token });
                dataApi.getUserCart({ token }).then(res => {
                    if (res.data.Code != 0) return;
                    var CartGoods = res.data.Datas;
                    var totalBuyCount = 0,
                        totalPrice = 0;
                    CartGoods.forEach((item, index) => {
                        CartGoods[index].checked = true;
                        CartGoods[index].checkedall = true;
                        totalBuyCount += item.BuyCount;
                        totalPrice += item.PrefPrice * item.BuyCount
                    });
                    if (res.data.Code == 0) this.setData({
                        totalBuyCount: totalBuyCount,
                        totalPrice: totalPrice,
                        CartGoods: CartGoods,
                        checkedall: true
                    });
                })
                dataApi.getAddressList({ token }).then(res => {
                    if (res.data.Code != 0) return;
                    var AddressList = res.data.Datas;
                    if (AddressList.length == 0) return;
                    if (!AddressList.some((item, index) => { return item.IsDefault })) {
                        AddressList[0].IsDefault = true;
                    }
                    this.setData({
                        AddressList: AddressList
                    })
                })
            }
            dataApi.getInvoiceList({ token }).then(res => {
                var InvoiceList = res.data.Datas;
                this.setData({ InvoiceList: InvoiceList })
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
        //         if (res.data.Code == 0) {
        //             this.setData({ token: token });
        //             wx.request({
        //                 url: 'https://shoptest.jzyglxt.com/Buyer/GetUserCart',
        //                 method: 'post',
        //                 header: {
        //                     "Content-Type": "application/x-www-form-urlencoded",
        //                     "token": token,
        //                 },
        //                 success: res => {
        //                     console.log(res)
        //                     if (res.data.Code != 0) return;
        //                     var CartGoods = res.data.Datas;
        //                     var totalBuyCount = 0,
        //                         totalPrice = 0;
        //                     CartGoods.forEach(function(item, index) {
        //                         CartGoods[index].checked = true;
        //                         CartGoods[index].checkedall = true;
        //                         totalBuyCount += item.BuyCount;
        //                         totalPrice += item.PrefPrice * item.BuyCount
        //                     });
        //                     if (res.data.Code == 0) this.setData({
        //                         totalBuyCount: totalBuyCount,
        //                         totalPrice: totalPrice,
        //                         CartGoods: CartGoods,
        //                         checkedall: true
        //                     });
        //                 }
        //             });
        //             wx.request({
        //                 url: 'https://shoptest.jzyglxt.com/User/GetAddressList',
        //                 method: 'post',
        //                 header: {
        //                     "Content-Type": "application/x-www-form-urlencoded",
        //                     "token": token,
        //                 },
        //                 success: res => {
        //                     if (res.data.Code != 0) return;
        //                     var AddressList = res.data.Datas;
        //                     if (AddressList.length == 0) return;
        //                     if (!AddressList.some(function(item, index) { return item.IsDefault })) {
        //                         AddressList[0].IsDefault = true;
        //                     }
        //                     this.setData({
        //                         AddressList: AddressList
        //                     })
        //                 }
        //             });
        //             wx.request({
        //                 url: 'https://shoptest.jzyglxt.com/User/GetInvoiceList?',
        //                 method: 'post',
        //                 header: {
        //                     "Content-Type": "application/x-www-form-urlencoded",
        //                     "token": token,
        //                 },
        //                 success: res => {
        //                     var InvoiceList = res.data.Datas;
        //                     this.setData({ InvoiceList: InvoiceList })
        //                 }
        //             })
        //         }
        //     }
        // })
    },
    switchss: function(e) {
        var text = e._relatedInfo.anchorTargetText;
        var ss = 0;
        console.log(text, this.data);
        switch (text) {
            case '添加收货地址':
                this.setData({ ss: 1 });
                region.IdToVal.call(this);
                break;
            case '更多地址':
                this.setData({ ss: 2 });
                break;
            case '添加发票信息':
                this.setData({ ss: 3 });
                if (this.data.InvoiceTypeList.length == 0) dataApi.getInvoiceType({ token: this.data.token }).then(res => {
                        var InvoiceType = res.data.Datas;
                        this.setData({ 'InvoiceTypeList': InvoiceType })
                    })
                    // wx.request({
                    //     "url": 'https://shoptest.jzyglxt.com/Helper/GetInvoiceType',
                    //     "method": 'post',
                    //     'header': {
                    //         "Content-Type": "application/x-www-form-urlencoded",
                    //         "token": this.data.token,
                    //     },
                    //     "success": res => {
                    //         console.log(this.data.InvoiceTypeList, res)
                    //         var InvoiceType = res.data.Datas;
                    //         this.setData({ 'InvoiceTypeList': InvoiceType })
                    //     }
                    // });
                if (this.data.InvTitleTypeList.length == 0) dataApi.getInvTitleType({ token: this.data.token }).then(res => {
                        var InvTitleType = res.data.Datas;
                        this.setData({ 'InvTitleTypeList': InvTitleType })
                    })
                    //  wx.request({
                    //     "url": 'https://shoptest.jzyglxt.com/Helper/GetInvTitleType',
                    //     "method": 'post',
                    //     'header': {
                    //         "Content-Type": "application/x-www-form-urlencoded",
                    //         "token": this.data.token,
                    //     },
                    //     "success": res => {
                    //         console.log(res)
                    //         var InvTitleType = res.data.Datas;
                    //         this.setData({ 'InvTitleTypeList': InvTitleType })
                    //     }
                    // });

                if (this.data.InvContentTypeList.length == 0) dataApi.getInvContentType({ token: this.data.token }).then(res => {
                        var InvContentType = res.data.Datas;
                        this.setData({ 'InvContentTypeList': InvContentType })
                    })
                    //  wx.request({
                    //     "url": 'https://shoptest.jzyglxt.com/Helper/GetInvContentType',
                    //     "method": 'post',
                    //     'header': {
                    //         "Content-Type": "application/x-www-form-urlencoded",
                    //         "token": this.data.token,
                    //     },
                    //     "success": res => {
                    //         var InvContentType = res.data.Datas;
                    //         this.setData({ 'InvContentTypeList': InvContentType })
                    //     }
                    // });
                break;
            default:
                this.setData({ ss: 0 });
        }
    },
    changegoodcount: function(e) {
        var offsetLeft = e.target.offsetLeft;
        var index = e.currentTarget.dataset.i;
        var CartGoods = this.data.CartGoods;
        var BuyCount = CartGoods[index].BuyCount;
        if (offsetLeft < 50) BuyCount--;
        else BuyCount++;
        //console.log(this.data.CartGoods[index].BuyCount);
        if (BuyCount <= 0 || BuyCount > CartGoods[index].Total - CartGoods[index].SoldCount) return;
        dataApi.upGoodsNumber({
                SeGoodsId: CartGoods[index].SeGoodsId,
                GoodsCode: CartGoods[index].GoodsCode,
                number: CartGoods[index].BuyCount
            }, { token: this.data.token }).then(res => {
                if (res.data.Code != 0) return;
                var totalBuyCount = 0,
                    totalPrice = 0;
                CartGoods[index].BuyCount = BuyCount;
                CartGoods.forEach((item, index) => {
                    if (!CartGoods[index].checked) return;
                    totalBuyCount += item.BuyCount;
                    totalPrice += item.PrefPrice * item.BuyCount;
                });
                this.setData({ totalBuyCount: totalBuyCount, totalPrice: totalPrice, CartGoods: CartGoods });
            })
            // wx.request({
            //     url: 'https://shoptest.jzyglxt.com/Buyer/UpGoodsNumber',
            //     method: 'post',
            //     header: {
            //         "Content-Type": "application/x-www-form-urlencoded",
            //         "token": this.data.token,
            //     },
            //     data: {
            //         SeGoodsId: CartGoods[index].SeGoodsId,
            //         GoodsCode: CartGoods[index].GoodsCode,
            //         number: CartGoods[index].BuyCount
            //     },
            //     success: res => {
            //         if (res.data.Code != 0) return;
            //         var totalBuyCount = 0,
            //             totalPrice = 0;
            //         CartGoods[index].BuyCount = BuyCount;
            //         CartGoods.forEach(function(item, index) {
            //             if (!CartGoods[index].checked) return;
            //             totalBuyCount += item.BuyCount;
            //             totalPrice += item.PrefPrice * item.BuyCount;
            //         });
            //         this.setData({ totalBuyCount: totalBuyCount, totalPrice: totalPrice, CartGoods: CartGoods });
            //     }
            // })
    },
    changeexpress: function(e) {
        var text = e._relatedInfo.anchorTargetText;
        if (text == '快递送货') {
            if (this.data.AddressList.length == 0)
                this.setData({ "IsExpress": true, ss: 1 });
            else
                this.setData({ "IsExpress": true });
        } else this.setData({ "IsExpress": false });
    },
    updateZtUser: function(e) {
        var ZtUser = e.detail.value;
        this.data.ZtUser = ZtUser;
    },
    uploadZtPhone: function(e) {
        var ZtPhone = e.detail.value;
        this.data.ZtPhone = ZtPhone;
    },
    changeInvoice: function(e) {
        var InvoiceId = e.currentTarget.dataset.id;
        if (InvoiceId)
            this.setData({ IsInvoice: true, InvoiceId: InvoiceId });
        else this.setData({ IsInvoice: false, InvoiceId: '' });
    },
    delgood: function(e) {
        var index = e.currentTarget.dataset.index;
        console.log(index);
        var CartGoods = this.data.CartGoods;
        dataApi.deleteGoods({
                SeGoodsId: CartGoods[index].SeGoodsId,
                GoodsCode: CartGoods[index].GoodsCode
            }, { token: this.data.token }).then(res => {
                if (res.data.Code != 0) return;
                CartGoods.splice(index, 1);
                var totalBuyCount = 0,
                    totalPrice = 0;
                CartGoods.forEach((item, index) => {
                    if (!CartGoods[index].checked) return;
                    totalBuyCount += item.BuyCount;
                    totalPrice += item.PrefPrice * item.BuyCount
                });
                this.setData({ totalBuyCount: totalBuyCount, totalPrice: totalPrice, CartGoods: CartGoods });
            })
            // wx.request({
            //     url: 'https://shoptest.jzyglxt.com/Buyer/DeleteGoods',
            //     method: 'post',
            //     header: {
            //         "Content-Type": "application/x-www-form-urlencoded",
            //         "token": this.data.token,
            //     },
            //     data: {
            //         SeGoodsId: CartGoods[index].SeGoodsId,
            //         GoodsCode: CartGoods[index].GoodsCode
            //     },
            //     success: res => {
            //         if (res.data.Code != 0) return;
            //         CartGoods.splice(index, 1);
            //         var totalBuyCount = 0,
            //             totalPrice = 0;
            //         CartGoods.forEach(function(item, index) {
            //             if (!CartGoods[index].checked) return;
            //             totalBuyCount += item.BuyCount;
            //             totalPrice += item.PrefPrice * item.BuyCount
            //         });
            //         this.setData({ totalBuyCount: totalBuyCount, totalPrice: totalPrice, CartGoods: CartGoods });
            //     }
            // });
    },
    checkall: function(e) {
        var dataset = e.currentTarget.dataset;
        var CartGoods = this.data.CartGoods;
        if (!isNaN(dataset.index)) {
            var index = dataset.index;
            var checked = !CartGoods[index].checkedall;
            var sellerid = CartGoods[index].SellerId;
            for (var i = 0; i < CartGoods.length; i++) {
                if (CartGoods[i].SellerId == sellerid) CartGoods[i].checked = checked;
            }
        } else {
            var checked = !this.data.checkedall;
            for (var i = 0; i < CartGoods.length; i++) CartGoods[i].checked = checked;
        }
        var totalBuyCount = 0,
            totalPrice = 0;
        CartGoods.forEach(function(item, index) {
            if (!CartGoods[index].checked) return;
            totalBuyCount += item.BuyCount;
            totalPrice += item.PrefPrice * item.BuyCount
        });
        var ss = true;
        var sss = true;
        for (var i = CartGoods.length - 1; i >= 0; i--) {
            var sellerid = CartGoods[i].SellerId;
            if (i < CartGoods.length - 1 && sellerid !== CartGoods[i + 1].SellerId) ss = true;
            if (!CartGoods[i].checked) ss = false;
            CartGoods[i].checkedall = ss;
            if (!CartGoods[i].checked) sss = false;
        }
        this.setData({ totalBuyCount: totalBuyCount, totalPrice: totalPrice, CartGoods: CartGoods, checkedall: sss });
    },
    check: function(e) {
        var index = e.currentTarget.dataset.index;
        var CartGoods = this.data.CartGoods;
        CartGoods[index].checked = !CartGoods[index].checked;
        var totalBuyCount = 0,
            totalPrice = 0;
        CartGoods.forEach(function(item, index) {
            if (!CartGoods[index].checked) return;
            totalBuyCount += item.BuyCount;
            totalPrice += item.PrefPrice * item.BuyCount
        });
        var ss = true;
        var sss = true;
        for (var i = CartGoods.length - 1; i >= 0; i--) {
            var sellerid = CartGoods[i].SellerId;
            if (i < CartGoods.length - 1 && sellerid !== CartGoods[i + 1].SellerId) ss = true;
            if (!CartGoods[i].checked) ss = false;
            CartGoods[i].checkedall = ss;
            if (!CartGoods[i].checked) sss = false;
        }
        this.setData({ totalBuyCount: totalBuyCount, totalPrice: totalPrice, CartGoods: CartGoods, checkedall: sss });
    },
    SettleOrder: function(e) {
        var s = this.data.s;

        if (!s) {
            this.setData({ s: true });
            return;
        }
        if (this.data.totalBuyCount == 0) return;
        var CartGoods = this.data.CartGoods;
        CartGoods = CartGoods.filter(function(item, index) { return item.checked });
        var AddressList = this.data.AddressList;
        if (AddressList.length == 0) this.setData({ s: false, ss: 1 });
        else this.setData({ s: false })
    },
    SettleOrder2: function(e) {
        var IsExpress = this.data.IsExpress,
            IsInvoice = this.data.IsInvoice;
        if (!IsExpress) {
            if (this.data.ZtUser == '' || this.data.ZtPhone == '') {
                wx.showToast({
                    title: '请填写自提人姓名、联系电话',
                    icon: 'none',
                    duration: 1000
                });
                return false;
            }
        }
        var DeliveryId = 32;
        if (IsExpress && this.data.AddressList.length == 0) {
            this.setData({ 'ss': 1 });
            return;
        }
        var AddressId = '';
        if (IsExpress) {
            DeliveryId = 12;
            var AddressList = this.data.AddressList;
            for (var i = 0; i < AddressList.length; i++)
                if (AddressList[i].IsDefault) AddressId = AddressList[i].Id;
        };
        var Data = this.data.CartGoods.filter(function(item) { return item.checked }).map(function(item) { return { "SeGoodsId": item.SeGoodsId, "GoodsCode": item.GoodsCode, "BuyCount": item.BuyCount } });
        var obj = {
            AddressId: AddressId,
            IsInvoice: IsInvoice,
            Data: JSON.stringify(Data),
            IsExpress: IsExpress,
            DeliveryId: DeliveryId
        };
        if (!IsExpress) obj = Object.assign(obj, { "ZtUser": this.data.ZtUser, "ZtPhone": this.data.ZtPhone });
        if (IsInvoice) {
            obj = Object.assign(obj, { "InvoiceId": this.data.InvoiceId });
            this.SettleOrder3(obj);
        } else {
            wx.showModal({
                title: '提示',
                content: '您当前没有选择开票，是否确认不开票？',
                success: (res) => {
                    if (res.confirm) this.SettleOrder3(obj);
                }
            })
        }
    },
    SettleOrder3: function(obj) {
        wx.showLoading({ title: '提交中' });
        dataApi.settleOrder(obj, { token: this.data.token }).then(res => {
                wx.hideLoading();
                if (res.data.Code != 0) {
                    wx.showToast({
                        title: res.data.Msg,
                        icon: 'none',
                        duration: 1000
                    });
                } else wx.navigateTo({ "url": "cart2?orderid=" + res.data.Datas });
            })
            // wx.request({
            //     url: "https://shoptest.jzyglxt.com/Buyer/SettleOrder",
            //     method: 'post',
            //     header: {
            //         "Content-Type": "application/x-www-form-urlencoded",
            //         "token": this.data.token,
            //     },
            //     data: obj,
            //     success: res => {
            // wx.hideLoading();
            // if (res.data.Code != 0) {
            //     wx.showToast({
            //         title: res.data.Msg,
            //         icon: 'none',
            //         duration: 1000
            //     });
            // } else wx.navigateTo({ "url": "cart2?orderid=" + res.data.Datas });
            //     }
            // })
    },
    changeaddress: function(e) {
        var index = e.currentTarget.dataset.index;
        index = parseInt(index);
        var AddressList = this.data.AddressList;
        for (var i = 0; i < AddressList.length; i++) {
            if (i == index) AddressList[i].IsDefault = true;
            else AddressList[i].IsDefault = false;
        }
        this.setData({ "AddressList": AddressList });
    },
    saveAddress: function(e) {
        var obj = e.detail.value;
        var regionId = this.data.regionId;
        obj = Object.assign({ id: 0, province: regionId[0], city: regionId[1], area: regionId[2] }, obj);
        wx.showLoading({ title: '提交中' });
        dataApi.saveAddress(obj, { token: this.data.token }).then(res => {
                if (res.data.Code == 0) {
                    this.setData({ ss: 0 });
                    dataApi.getAddressList({ token: this.data.token }).then(res => {
                            if (res.data.Code == 0) {
                                var data = res.data.Datas;
                                data.forEach(function(item, index) {
                                    data[index].regionName = item.ProvinceName + ' ' + item.CityName + ' ' + item.AreaName;
                                });
                                if (!data.some(function(item, index) { return item.IsDefault })) data[0].IsDefault = true;
                                this.setData({
                                    AddressList: data
                                });
                                wx.hideLoading();
                            }
                        })
                        // wx.request({
                        //     url: 'https://shoptest.jzyglxt.com/User/GetAddressList',
                        //     method: 'post',
                        //     header: { "Content-Type": "application/x-www-form-urlencoded", "token": this.data.token },
                        //     success: res => {
                        // if (res.data.Code == 0) {
                        //     var data = res.data.Datas;
                        //     data.forEach(function(item, index) {
                        //         data[index].regionName = item.ProvinceName + ' ' + item.CityName + ' ' + item.AreaName;
                        //     });
                        //     if (!data.some(function(item, index) { return item.IsDefault })) data[0].IsDefault = true;
                        //     this.setData({
                        //         AddressList: data
                        //     });
                        //     wx.hideLoading();
                        // }
                        //     }
                        // })
                } else {
                    wx.hideLoading();
                    wx.showToast({
                        title: res.data.Msg,
                        icon: 'none',
                        duration: 1000
                    })
                }
            })
            // wx.request({
            //     url: 'https://shoptest.jzyglxt.com/User/SaveAddress',
            //     method: 'post',
            //     header: { "Content-Type": "application/x-www-form-urlencoded", "token": this.data.token },
            //     data: obj,
            //     success: res => {
            // if (res.data.Code == 0) {
            //     this.setData({ ss: 0 });
            //     wx.request({
            //         url: 'https://shoptest.jzyglxt.com/User/GetAddressList',
            //         method: 'post',
            //         header: { "Content-Type": "application/x-www-form-urlencoded", "token": this.data.token },
            //         success: res => {
            //             if (res.data.Code == 0) {
            //                 var data = res.data.Datas;
            //                 data.forEach(function(item, index) {
            //                     data[index].regionName = item.ProvinceName + ' ' + item.CityName + ' ' + item.AreaName;
            //                 });
            //                 if (!data.some(function(item, index) { return item.IsDefault })) data[0].IsDefault = true;
            //                 this.setData({
            //                     AddressList: data
            //                 });
            //                 wx.hideLoading();
            //             }
            //         }
            //     })
            // } else {
            //     wx.hideLoading();
            //     wx.showToast({
            //         title: res.data.Msg,
            //         icon: 'none',
            //         duration: 1000
            //     })
            // }
            //     }
            // });
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
    },
    changeInvoiceType: function(e) {
        if (e.detail.value == 0) {
            this.setData({
                InvoiceType: e.detail.value,
                InvTitleType: 0
            })
        } else
            this.setData({
                InvoiceType: e.detail.value
            })
    },
    changeInvContentType: function(e) {
        this.setData({
            InvContentType: e.detail.value
        })
    },
    changeInvTitleType: function(e) {
        this.setData({
            InvTitleType: e.detail.value
        })
    },
    saveInvoice: function(e) {
        var obj = e.detail.value;
        if (this.data.InvoiceType == 0) {
            if (obj.InvoiceTitle == '') {
                wx.showToast({
                    title: '请填写发票抬头',
                    icon: 'none',
                    duration: 1000
                });
                return;
            }
            if (obj.DutyNumber == '') {
                wx.showToast({
                    title: '请填写税号',
                    icon: 'none',
                    duration: 1000
                });
                return;
            }
            if (obj.Address == '') {
                wx.showToast({
                    title: '请填写注册地址',
                    icon: 'none',
                    duration: 1000
                });
                return;
            }
            if (obj.Phone == '') {
                wx.showToast({
                    title: '请填写注册电话',
                    icon: 'none',
                    duration: 1000
                });
                return;
            }
            if (obj.BankName == '') {
                wx.showToast({
                    title: '请填写填写开户银行',
                    icon: 'none',
                    duration: 1000
                });
                return;
            }
            if (obj.BankAccount == '') {
                wx.showToast({
                    title: '请填写填写银行账号',
                    icon: 'none',
                    duration: 1000
                });
                return;
            }
        } else {
            if (obj.InvoiceTitle == '') {
                wx.showToast({
                    title: '请填写发票抬头',
                    icon: 'none',
                    duration: 1000
                });
                return;
            }
            if (obj.DutyNumber == '') {
                wx.showToast({
                    title: '请填写税号',
                    icon: 'none',
                    duration: 1000
                });
                return;
            }
        }

        obj = Object.assign(obj, { "InvoiceType": this.data.InvoiceTypeList[this.data.InvoiceType].Id, "InvTypeName": this.data.InvoiceTypeList[this.data.InvoiceType].Name });
        //if (this.data.InvoiceType == 1 || this.data.InvoiceType==2)
        obj = Object.assign(obj, { "InvTitleType": this.data.InvTitleTypeList[this.data.InvTitleType].Id, "InvTitleTypeName": this.data.InvTitleTypeList[this.data.InvTitleType].Name });
        obj = Object.assign(obj, { "InvContentType": this.data.InvContentTypeList[this.data.InvContentType].Id, "InvContentName": this.data.InvContentTypeList[this.data.InvContentType].Name });
        wx.showLoading({ title: '提交中' });
        dataApi.saveInvoice(obj, { token: this.data.token }).then(res => {
                if (res.data.Code != 0) {
                    wx.hideLoading();
                    wx.showToast({
                        title: res.data.Msg,
                        icon: 'none',
                        duration: 1000
                    });
                    return;
                }
                this.setData({ ss: 0 })
                dataApi.getInvoiceList({ token: this.data.token }).then(res => {
                    var InvoiceList = res.data.Datas;
                    this.setData({ InvoiceList: InvoiceList });
                    wx.hideLoading();
                })
            })
            // wx.request({
            //     url: 'https://shop.jzyglxt.com/User/SaveInvoice',
            //     method: 'post',
            //     header: { "Content-Type": "application/x-www-form-urlencoded", "token": this.data.token },
            //     data: obj,
            //     success: res => {
            //         if (res.data.Code != 0) {
            //             wx.hideLoading();
            //             wx.showToast({
            //                 title: res.data.Msg,
            //                 icon: 'none',
            //                 duration: 1000
            //             });
            //             return;
            //         }
            //         this.setData({ ss: 0 })
            //         wx.request({
            //             url: 'https://shoptest.jzyglxt.com/User/GetInvoiceList?',
            //             method: 'post',
            //             header: {
            //                 "Content-Type": "application/x-www-form-urlencoded",
            //                 "token": token,
            //             },
            //             success: res => {
            //                 var InvoiceList = res.data.Datas;
            //                 this.setData({ InvoiceList: InvoiceList });
            //                 wx.hideLoading();
            //             }
            //         })
            //     }
            // })
    }
})