// pages/user/cart5.js
const region = require('../../utils/region.js');
import dataApi from '../../utils/dataApi'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        IsExpress: true,
        IsInvoice: false,
        AddressList: [],
        CartGoods: [],
        InvoiceTypeList: [],
        InvoiceType: 0,
        InvTitleTypeList: [],
        InvTitleType: 0,
        InvContentTypeList: [],
        InvContentType: 0,
        IsInvoice: false,
        InvoiceList: [],
        ZtUser: '',
        ZtPhone: '',
        expressPrice: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var count = options.count,
            SeGoodsId = options.SeGoodsId,
            GoodsCode = options.GoodsCode;
        var token = wx.getStorageSync('token');
        if (token == '') {
            wx.navigateBack({ delta: 1 });
        }
        dataApi.checkToken({ token }).then(res => {
                if (res.data.Code != 0) {
                    wx.navigateBack({ delta: 1 });
                    return;
                }
                this.setData({
                    token: token,
                    SeGoodsId: SeGoodsId,
                    GoodsCode: GoodsCode
                });
                dataApi.getGoodsInfo({
                    SeGoodsId,
                    GoodsCode
                }, { token }).then(res => {
                    if (res.data.Code != 0) {
                        wx.showToast({
                            title: res.data.Msg,
                            icon: 'none',
                            duration: 1000
                        })
                        return;
                    }
                    var CartGood = { 'Title': res.data.Datas.Title };
                    var totalPrice = 0;
                    for (var i = 0; i < res.data.Datas.Classify.length; i++) {
                        if (res.data.Datas.Classify[i].GoodsCode == GoodsCode) {
                            CartGood = Object.assign(CartGood, res.data.Datas.Classify[i]);
                            totalPrice = res.data.Datas.Classify[i].PrefPrice * count;
                        }
                    };
                    CartGood.BuyCount = count;
                    this.setData({ CartGoods: [CartGood], totalPrice: totalPrice, DeliveryAddress: res.data.Datas.DeliveryAddress });

                    var expressList = []
                    expressList.push({
                        SellerId: CartGood.UserId,
                        SeGoodsId: CartGood.SeGoodsId,
                        GoodsCode: CartGood.GoodsCode,
                        Weight: CartGood.Weight,
                        BuyCount: CartGood.BuyCount
                    })
                    dataApi.getExpressFee({ data: JSON.stringify(expressList), isZt: 0 }, { token: this.data.token }).then(res => {
                        if (res.data.Datas) {
                            this.setData({
                                expressPrice: res.data.Datas
                            })
                        }
                    })
                })
                dataApi.getAddressList({ token }).then(res => {
                    if (res.data.Code != 0) return
                    var AddressList = res.data.Datas;
                    this.setData({ 'AddressList': AddressList });
                })
                dataApi.getInvoiceList({ token }).then(res => {
                    if (res.data.Code != 0) return
                    var InvoiceList = res.data.Datas;
                    this.setData({ 'InvoiceList': InvoiceList });
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
            //         this.setData({
            //             token: token,
            //             SeGoodsId: SeGoodsId,
            //             GoodsCode: GoodsCode
            //         });
            //         wx.request({
            //             'url': 'https://shoptest.jzyglxt.com/Seller/GetSellerGoodsInfo',
            //             method: 'post',
            //             header: {
            //                 "Content-Type": "application/x-www-form-urlencoded",
            //                 "token": token,
            //             },
            //             data: {
            //                 SeGoodsId: SeGoodsId,
            //                 GoodsCode: GoodsCode
            //             },
            //             success: res => {
            //                 if (res.data.Code != 0) {
            //                     wx.showToast({
            //                         title: res.data.Msg,
            //                         icon: 'none',
            //                         duration: 1000
            //                     })
            //                     return;
            //                 }
            //                 var CartGood = { 'Title': res.data.Datas.Title };
            //                 var totalPrice = 0;
            //                 for (var i = 0; i < res.data.Datas.Classify.length; i++) {
            //                     if (res.data.Datas.Classify[i].GoodsCode == GoodsCode) {
            //                         CartGood = Object.assign(CartGood, res.data.Datas.Classify[i]);
            //                         totalPrice = res.data.Datas.Classify[i].PrefPrice * count;
            //                     }
            //                 };
            //                 CartGood.BuyCount = count;
            //                 this.setData({ CartGoods: [CartGood], totalPrice: totalPrice, DeliveryAddress: res.data.Datas.DeliveryAddress });
            //             }
            //         });
            //         wx.request({
            //             url: 'https://shoptest.jzyglxt.com/User/GetAddressList',
            //             method: 'post',
            //             header: {
            //                 "Content-Type": "application/x-www-form-urlencoded",
            //                 "token": token,
            //             },
            //             success: res => {
            //                 var AddressList = res.data.Datas;
            //                 this.setData({ 'AddressList': AddressList });
            //             }
            //         });
            //         wx.request({
            //             url: 'https://shoptest.jzyglxt.com/User/GetInvoiceList',
            //             method: 'post',
            //             header: {
            //                 "Content-Type": "application/x-www-form-urlencoded",
            //                 "token": token,
            //             },
            //             success: res => {
            //                 var InvoiceList = res.data.Datas;
            //                 this.setData({ 'InvoiceList': InvoiceList });
            //             }
            //         })
            //     }
            // });
    },
    SettleOrder: function(e) {
        wx.navigateBack({ delta: 1 });
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
            region.IdToVal.call(this);
            return;
        }
        var AddressId = '';
        if (IsExpress) {
            DeliveryId = 12;
            var AddressList = this.data.AddressList;
            for (var i = 0; i < AddressList.length; i++)
                if (AddressList[i].IsDefault) AddressId = AddressList[i].Id;
        };
        var Data = this.data.CartGoods.map(function(item) { return { "SeGoodsId": item.SeGoodsId, "GoodsCode": item.GoodsCode, "BuyCount": item.BuyCount } });
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
        dataApi.directSettleOrder(obj, { token: this.data.token }).then(res => {
                wx.hideLoading();
                if (res.data.Code != 0) {
                    wx.showToast({
                        title: res.data.Msg,
                        icon: 'none',
                        duration: 1000
                    });
                } else wx.navigateTo({ "url": "/pages/cart2/cart2?orderid=" + res.data.Datas });
            })
            // wx.request({
            //     url: "https://shoptest.jzyglxt.com/Buyer/DirectSettleOrder",
            //     method: 'post',
            //     header: {
            //         "Content-Type": "application/x-www-form-urlencoded",
            //         "token": this.data.token,
            //     },
            //     data: obj,
            //     success: res => {
            //         wx.hideLoading();
            //         if (res.data.Code != 0) {
            //             wx.showToast({
            //                 title: res.data.Msg,
            //                 icon: 'none',
            //                 duration: 1000
            //             });
            //         } else wx.navigateTo({ "url": "cart2?orderid=" + res.data.Datas });
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
    switchss: function(e) {
        var text = e._relatedInfo.anchorTargetText;
        var ss = 0;
        console.log(text);
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
                    //         var InvoiceType = res.data.Datas;
                    //         this.setData({ 'InvoiceTypeList': InvoiceType })
                    //     }
                    // });
                if (this.data.InvTitleTypeList.length == 0) dataApi.getInvTitleType({ token: this.data.token }).then(res => {
                        var InvTitleType = res.data.Datas;
                        this.setData({ 'InvTitleTypeList': InvTitleType })
                    })
                    // wx.request({
                    //     "url": 'https://shoptest.jzyglxt.com/Helper/GetInvTitleType',
                    //     "method": 'post',
                    //     'header': {
                    //         "Content-Type": "application/x-www-form-urlencoded",
                    //         "token": this.data.token,
                    //     },
                    //     "success": res => {
                    //         var InvTitleType = res.data.Datas;
                    //         this.setData({ 'InvTitleTypeList': InvTitleType })
                    //     }
                    // });

                if (this.data.InvContentTypeList.length == 0) dataApi.getInvContentType({ token: this.data.token }).then(res => {
                        var InvContentType = res.data.Datas;
                        this.setData({ 'InvContentTypeList': InvContentType })
                    })
                    // wx.request({
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
                        } else {
                            wx.hideLoading();
                            wx.showToast({
                                title: res.data.Msg,
                                icon: 'none',
                                duration: 1000
                            })
                        }
                    })
                }
            })
            // wx.request({
            //     url: 'https://shoptest.jzyglxt.com/User/SaveAddress',
            //     method: 'post',
            //     header: { "Content-Type": "application/x-www-form-urlencoded", "token": this.data.token },
            //     data: obj,
            //     success: res => {
            //         if (res.data.Code == 0) {
            //             this.setData({ ss: 0 });
            //             wx.request({
            //                 url: 'https://shoptest.jzyglxt.com/User/GetAddressList',
            //                 method: 'post',
            //                 header: { "Content-Type": "application/x-www-form-urlencoded", "token": this.data.token },
            //                 success: res => {
            //                     if (res.data.Code == 0) {
            //                         var data = res.data.Datas;
            //                         data.forEach(function(item, index) {
            //                             data[index].regionName = item.ProvinceName + ' ' + item.CityName + ' ' + item.AreaName;
            //                         });
            //                         if (!data.some(function(item, index) { return item.IsDefault })) data[0].IsDefault = true;
            //                         this.setData({
            //                             AddressList: data
            //                         });
            //                         wx.hideLoading();
            //                     }
            //                 }
            //             })
            //         } else {
            //             wx.hideLoading();
            //             wx.showToast({
            //                 title: res.data.Msg,
            //                 icon: 'none',
            //                 duration: 1000
            //             })
            //         }
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