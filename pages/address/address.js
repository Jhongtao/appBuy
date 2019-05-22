// pages/user/address.js
const region = require('../../utils/region.js');
import dataApi from '../../utils/dataApi'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        addressList: [],
        region: [],
        s: false,
        address: {
            Id: 0,
            Address: '',
            PostCode: '',
            ReUser: '',
            RePhone: '',
            IsDefault: false
        }
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
                    this.loadData();
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
                //         this.loadData();
                //     }
                // })
        };
    },
    loadData: function() {
        dataApi.getAddressList({ token: this.data.token }).then(res => {
                if (res.data.Code == 0) {
                    var data = res.data.Datas;
                    // console.log(data);
                    data.forEach(function(item, index) {
                        data[index].regionName = item.ProvinceName + ' ' + item.CityName + ' ' + item.AreaName;
                    });
                    this.setData({
                        addressList: data
                    });
                }
            })
            // wx.request({
            //     url: 'https://shoptest.jzyglxt.com/User/GetAddressList',
            //     method: 'post',
            //     header: { "Content-Type": "application/x-www-form-urlencoded", "token": this.data.token },
            //     success: res => {
            //         if (res.data.Code == 0) {
            //             var data = res.data.Datas;
            //             // console.log(data);
            //             data.forEach(function(item, index) {
            //                 data[index].regionName = item.ProvinceName + ' ' + item.CityName + ' ' + item.AreaName;
            //             });
            //             this.setData({
            //                 addressList: data
            //             });
            //         }
            //     }
            // })
    },
    switchs: function(e) {
        var s = !this.data.s;
        var obj = { s: s }
        if (s) {
            obj = Object.assign(obj, { region: [], address: { Id: 0, Address: '', PostCode: '', ReUser: '', RePhone: '', IsDefault: false } });

            region.IdToVal.call(this);
        }
        this.setData(obj);
    },
    modiaddress: function(e) {
        var index = e.currentTarget.dataset.index;
        // var that = this;
        dataApi.getAddressById({ id: this.data.addressList[index].Id }, { token: this.data.token }).then(res => {
                if (res.data.Code == 0) {
                    var address = res.data.Datas;
                    this.setData({ s: true, address: address });
                    region.IdToVal.call(this, address.Province, address.City, address.Area);
                }
            })
            // wx.request({
            //     url: 'https://shoptest.jzyglxt.com/User/GetAddressById',
            //     method: 'post',
            //     header: { "Content-Type": "application/x-www-form-urlencoded", "token": that.data.token },
            //     data: { id: that.data.addressList[index].Id },
            //     success: (res) => {
            //         if (res.data.Code == 0) {
            //             var address = res.data.Datas;
            //             that.setData({ s: true, address: address });
            //             region.IdToVal.call(that, address.Province, address.City, address.Area);
            //         }
            //     }
            // })
    },
    deladdress: function(e) {
        var index = e.currentTarget.dataset.index;
        console.log(index);
        var id = this.data.addressList[index].Id;
        var token = this.data.token;
        // var that = this;
        console.log(id);
        wx.showModal({
            title: '提示',
            content: '确定要删除吗？',
            success: (sm) => {
                if (sm.confirm) {
                    dataApi.delAddress({ id }, { token }).then(res => {
                            wx.showToast({
                                title: '删除成功',
                                icon: 'none',
                                duration: 1000
                            });
                            var addressList = this.data.addressList;
                            addressList.splice(index, 1);
                            this.setData({ addressList: addressList });
                        })
                        // wx.request({
                        //     url: 'https://shoptest.jzyglxt.com/User/DelAddress?id=' + id,
                        //     method: 'get',
                        //     header: { "Content-Type": "application/x-www-form-urlencoded", "token": token },
                        //     success: res => {
                        //         wx.showToast({
                        //             title: '删除成功',
                        //             icon: 'none',
                        //             duration: 1000
                        //         });
                        //         var addressList = that.data.addressList;
                        //         addressList.splice(index, 1);
                        //         that.setData({ addressList: addressList });
                        //     }
                        // })
                }
            }
        })
    },
    saveAddress: function(e) {
        var obj = e.detail.value;
        var regionId = this.data.regionId;
        obj = Object.assign({ id: this.data.address.Id, province: regionId[0], city: regionId[1], area: regionId[2] }, obj);
        // var url = 'https://shoptest.jzyglxt.com/User/UpAddress';
        // if (obj.id == 0) url = 'https://shoptest.jzyglxt.com/User/SaveAddress';
        if (obj.id == 0) {
            dataApi.saveAddress(obj, { token: this.data.token }).then(res => {
                if (res.data.Code == 0) {
                    this.setData({ s: false });
                    this.loadData();
                } else {
                    wx.showToast({
                        title: res.data.Msg,
                        icon: 'none',
                        duration: 1000
                    })
                }
            })
        } else {
            dataApi.upAddress(obj, { token: this.data.token }).then(res => {
                if (res.data.Code == 0) {
                    this.setData({ s: false });
                    this.loadData();
                } else {
                    wx.showToast({
                        title: res.data.Msg,
                        icon: 'none',
                        duration: 1000
                    })
                }
            })
        }
        // wx.request({
        //     url: url,
        //     method: 'post',
        //     header: { "Content-Type": "application/x-www-form-urlencoded", "token": this.data.token },
        //     data: obj,
        //     success: res => {
        //         if (res.data.Code == 0) {
        //             this.setData({ s: false });
        //             this.loadData();
        //         } else {
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
    }
})