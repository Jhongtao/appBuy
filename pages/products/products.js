// pages/index/products.js
//const app = getApp();
import dataApi from '../../utils/dataApi'
Page({
    data: {
        insearch: false,
        cateName: '',
        keyword: '',
        orderFiled: 'zh',
        isDesc: true,
        page: 0,
        cid: '',
        products: [],
        allkeyword: [],
        dataOver: false
    },

    onLoad: function(options) {
        var cid = options.cid
        var cateName = options.cname;
        this.setData({
            cateName: cateName,
            cid: cid,
            allkeyword: []
        });

        var token = wx.getStorageSync('token')
        dataApi.getGoodsByCategory({
                "categoryId": cid,
                "page": ++this.data.page,
                "rows": 20
            }, {
                token
            }).then(res => {
                if (res.data.Code != 0) return;
                this.setData({
                    "products": res.data.Datas,
                    "page": this.data.page
                })
            })
            // wx.request({
            //     "method": "post",
            //     "url": "https://shoptest.jzyglxt.com/Seller/GetGoodsByCategory",
            //     "data": {
            //         "categoryId": cid,
            //         "page": page,
            //         "rows": 20
            //     },
            //     header: {
            //         "Content-Type": "application/x-www-form-urlencoded"
            //     },
            //     "success": (res) => {
            //         // console.log(res)
            //         if (res.data.Code != 0) return;
            //         this.setData({
            //             "products": res.data.Datas,
            //             "page": page
            //         })
            //     }
            // })
    },
    onReachBottom: function() {
        if (this.dataOver) {
            wx.showToast({
                title: '没有更多数据了',
                icon: 'none',
                duration: 1500
            })
            return
        }
        var insearch = this.data.insearch;
        if (insearch) return;
        var orderFiled = this.data.orderFiled;
        var isDesc = this.data.isDesc;
        var cid = this.data.cid;
        var products = this.data.products;
        // var page = this.data.page++;
        var token = wx.getStorageSync('token')
        dataApi.getGoodsByCategory({
                "categoryId": cid,
                "page": ++this.data.page,
                "orderFiled": orderFiled,
                "isDesc": isDesc,
                "rows": 20
            }, {
                token
            }).then(res => {
                console.log(res.data)
                if (res.data.Code == 2) {
                    wx.showToast({
                        title: '没有更多数据了',
                        icon: 'none',
                        duration: 1000
                    });
                    return
                }
                if (res.data.Code != 0) return;
                products = products.concat(res.data.Datas);
                this.setData({
                    "orderFiled": orderFiled,
                    "isDesc": isDesc,
                    "products": products,
                    "page": page
                })
            })
            // wx.request({
            //     "method": "post",
            //     "url": "https://shoptest.jzyglxt.com/Seller/GetGoodsByCategory",
            //     "data": {
            //         "categoryId": cid,
            //         "page": page,
            //         "orderFiled": orderFiled,
            //         "isDesc": isDesc,
            //         "rows": 20
            //     },
            //     header: {
            //         "Content-Type": "application/x-www-form-urlencoded"
            //     },
            //     "success": (res) => {
            //         if (res.data.Code == 2) {
            //             wx.showToast({
            //                 title: '没有更多数据了',
            //                 icon: 'none',
            //                 duration: 1000
            //             });
            //             return
            //         }
            //         if (res.data.Code != 0) return;
            //         products = products.concat(res.data.Datas);
            //         this.setData({
            //             "orderFiled": orderFiled,
            //             "isDesc": isDesc,
            //             "products": products,
            //             "page": page
            //         })
            //     }
            // })
    },
    startsearch: function() {
        var allkeyword = wx.getStorageSync('allkeyword');
        this.setData({
            insearch: true,
            allkeyword: allkeyword.split(',')
        })
    },
    endsearch: function() {
        var allkeyword = this.data.allkeyword;
        wx.setStorage({
            key: 'allkeyword',
            data: allkeyword.join(',')
        })
        this.setData({
            insearch: false
        });
    },
    updatekeyword: function(e) {
        var keyword = e.detail.value;
        this.setData({
            keyword: keyword
        });
    },
    resetkeyword: function(e) {
        var allkeyword = this.data.allkeyword;
        var keyword = this.data.keyword;
        if (allkeyword.indexOf(keyword) >= 0) return;
        allkeyword.push(keyword);
        this.setData({
            allkeyword: allkeyword,
            keyword: ''
        });
    },
    searchkeyword: function(e) {
        var allkeyword = this.data.allkeyword;
        var keyword = this.data.keyword;
        if (allkeyword.indexOf(keyword) >= 0) return;
        allkeyword.push(keyword);
        this.setData({
            allkeyword: allkeyword
        });
        console.log(e)
        dataApi.getGoodsByTitle({
            page: 1,
            rows: 20,
            title: '贴'
        }, {
            token: this.data.token
        }).then(res => console.log(res))
    },
    ordersearch: function(e) {
        var orderFiled1 = this.data.orderFiled;
        var isDesc = this.data.isDesc;
        var cid = this.data.cid;
        var orderFiled2 = e.currentTarget.dataset.orderfiled;
        if (orderFiled1 == orderFiled2) isDesc = !isDesc;
        else {
            if (orderFiled2 == 'jg') isDesc = false;
            else isDesc = true
        }
        var page = 1;
        var token = wx.getStorageSync('token')
        dataApi.getGoodsByCategory({
                "categoryId": cid,
                "page": page,
                "orderFiled": orderFiled2,
                "isDesc": isDesc,
                "rows": 20
            }, { token }).then(res => {
                if (res.data.Code != 0) return;
                this.setData({
                    "orderFiled": orderFiled2,
                    "isDesc": isDesc,
                    "products": res.data.Datas,
                    "page": page
                })
            })
            // wx.request({
            //         "method": "post",
            //         "url": "https://shoptest.jzyglxt.com/Seller/GetGoodsByCategory",
            //         "data": {
            //             "categoryId": cid,
            //             "page": page,
            //             "orderFiled": orderFiled2,
            //             "isDesc": isDesc,
            //             "rows": 20
            //         },
            //         header: {
            //             "Content-Type": "application/x-www-form-urlencoded"
            //         },
            //         "success": (res) => {
            //             if (res.data.Code != 0) return;
            //             this.setData({
            //                 "orderFiled": orderFiled2,
            //                 "isDesc": isDesc,
            //                 "products": res.data.Datas,
            //                 "page": page
            //             })
            //         }
            //     })
            //this.setData({
            //  orderFiled:orderFiled
            //})
    }
})