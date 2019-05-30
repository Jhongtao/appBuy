import dataApi from '../../utils/dataApi'
Page({
    data: {
        insearch: false,
        cateName: '',
        keyword: '',
        orderFiled: 'zh',
        isDesc: true,
        page: 0,
        products: [],
        dataOver: false
    },

    onLoad: function(options) {
        var keyword = options.key;
        var token = wx.getStorageSync('token')
        this.setData({
            keyword,
            token
        });
        dataApi.getGoodsByTitle({
            page: 1,
            rows: 20,
            title: this.data.keyword
        }, {
            token: this.data.token
        }).then(res => {
            if (res.data.Code != 0) {
                this.setData({
                    products: []
                })
                return
            };
            this.setData({
                products: res.data.Datas,
                issearched: keyword
            })
        })
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
        var products = this.data.products;
        var token = wx.getStorageSync('token')
        dataApi.getGoodsByTitle({
            "title": this.data.keywords,
            "page": ++this.data.page,
            "orderFiled": orderFiled,
            "isDesc": isDesc,
            "rows": 20
        }, {
            token
        }).then(res => {
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
        if (this.data.issearched == this.data.keyword) return
        var keyword = this.data.keyword
            // if (allkeyword.indexOf(keyword) >= 0) return;
            // allkeyword.push(keyword);
            // this.setData({
            //     allkeyword: allkeyword
            // });
        dataApi.getGoodsByTitle({
            page: 1,
            rows: 20,
            title: keyword
        }, {
            token: this.data.token
        }).then(res => {
            if (res.data.Code != 0) {
                this.setData({
                    products: []
                })
                return
            }
            this.setData({
                products: res.data.Datas,
                issearched: keyword
            })
        })
    },
    ordersearch: function(e) {

        var orderFiled1 = this.data.orderFiled;
        var isDesc = this.data.isDesc;
        var orderFiled2 = e.currentTarget.dataset.orderfiled;
        if (orderFiled1 == orderFiled2) return;
        else {
            if (orderFiled2 == 'jg') isDesc = false;
            else isDesc = true
        }
        var page = 1;
        var token = wx.getStorageSync('token')
        dataApi.getGoodsByTitle({
            "title": this.data.keyword,
            "page": page,
            "orderFiled": orderFiled2,
            "isDesc": isDesc,
            "rows": 20
        }, { token }).then(res => {
            if (res.data.Code != 0) {
                this.setData({
                    products: []
                })
                return
            };
            this.setData({
                "orderFiled": orderFiled2,
                "isDesc": isDesc,
                "products": res.data.Datas,
                "page": page
            })
        })
    }
})