// pages/index/product.js
const Base64 = require('../../utils/base64.js')
const app = getApp();
import dataApi from '../../utils/dataApi'
Page({
    data: {
        pid: '',
        viewhistory: false,
        viewcart: false,
        vieworder: false,
        productinfo: {},
        ppindex: -1,
        toView: 'v1',
        immediatebuy: false,
        ordercount: 0,
        realname: '',
        token: '',
        CartNumber: 0,
        CartGoods: [],
        history: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var pid = options.pid;
        dataApi.getGoods({ id: pid }).then(res => {
                console.log(res)
                if (res.data.Code != 0) return;
                var data = res.data.Datas;
                var Contents = Base64.decode(data.Contents);
                var imgs = []
                imgs.push(data.TopPic)
                imgs.push(data.Imgs)
                data.Imgs = imgs;
                var ContentPics;

                if (!Contents.match(/(http:\/\/120\.27\.218\.55:8002\/\?id=\w+)/g)) ContentPics = Contents.match(/\/\/[\w|\W]+.jpg/g).map(item => 'https:' + item)
                else {
                    ContentPics = Contents.match(/(http:\/\/120\.27\.218\.55:8002\/\?id=\w+)/g).map(function(item, index) { return item + '&t=' });
                }
                data.ContentPics = ContentPics
                    // data.ContentPics = ContentPics[0];
                var contains = Contents.match(/[\d|\D]+<img/g)
                    // var contain = contains[0].replace(/<[\w|\W]*>|<\/[\w|\W]*>|<img/g, '')

                var contain = contains[0].replace(/<[^>]+>|(<img)/g, "")
                data.contain = contain
                    // var imgs = [data.TopPic];
                    // imgs = imgs.concat(data.Classify.map(function(item, index) { return item.ClassifyPic }));
                    // imgs = imgs.concat(data.Imgs.split(','));
                    // imgs = imgs.map((item, index) => { return 'http://120.27.218.55:8002/?id=' + item + '&t='; });

                // console.log(data.Imgs)
                if (data.CategoryValue) {
                    var CategoryValue = '|' + data.CategoryValue + '|';
                    CategoryValue = CategoryValue.match(/\|(.*?),(.*?)(?=\|)/g).map(function(item, index) { return item.substring(1).split(','); });
                    data.CategoryValue = CategoryValue;
                } else data.CategoryValue = [
                    ['--', '--']
                ];
                this.setData({
                    pid: pid,
                    productinfo: data
                });
                // console.log(this.data.productinfo)
                // console.log(this.data.productinfo)
                var productHistory = app.globalData.history || [];
                if (productHistory.map(function(item) { return item.Pid }).indexOf(data.Id) == -1) {
                    productHistory.push({
                        Pid: data.Id,
                        TopPic: data.TopPic,
                        Title: data.Title,
                        RealName: data.RealName
                    });
                }
                this.setData({ history: productHistory });
                app.globalData.history = productHistory;
                this.findcate()
            })
            // wx.request({
            //     url: 'https://shoptest.jzyglxt.com/Seller/GetSellerGoods',
            //     data: { "id": pid },
            //     success: (res) => {
            //         if (res.data.Code != 0) return;
            //         var data = res.data.Datas;
            //         var Contents = Base64.decode(data.Contents);
            //         var ContentPics = Contents.match(/(http:\/\/120\.27\.218\.55:8002\/\?id=\w+)/g).map(function(item, index) { return item + '&t=' });
            //         data.ContentPics = ContentPics[0];
            //         var contains = Contents.match(/[\d|\D]+<img/g)
            //         var contain = contains[0].replace(/<\w+>|<\/\w+>|<img/g, '')
            //             // console.log(contains)
            //         data.contain = contain
            //         var imgs = [data.TopPic];
            //         imgs = imgs.concat(data.Classify.map(function(item, index) { return item.ClassifyPic }));
            //         imgs = imgs.concat(data.Imgs.split(','));
            //         imgs = imgs.map((item, index) => { return 'http://120.27.218.55:8002/?id=' + item + '&t='; });
            //         data.Imgs = imgs;

        //         if (data.CategoryValue) {
        //             var CategoryValue = '|' + data.CategoryValue + '|';
        //             CategoryValue = CategoryValue.match(/\|(.*?),(.*?)(?=\|)/g).map(function(item, index) { return item.substring(1).split(','); });
        //             data.CategoryValue = CategoryValue;
        //         } else data.CategoryValue = [
        //             ['--', '--']
        //         ];
        //         this.setData({
        //             pid: pid,
        //             productinfo: data
        //         });
        //         console.log(this.data.productinfo)
        //         var productHistory = app.globalData.history || [];
        //         if (productHistory.map(function(item) { return item.Pid }).indexOf(data.Id) == -1) {
        //             productHistory.push({
        //                 Pid: data.Id,
        //                 TopPic: data.TopPic,
        //                 Title: data.Title,
        //                 RealName: data.RealName
        //             });
        //         }
        //         this.setData({ history: productHistory });
        //         app.globalData.history = productHistory;
        //         this.findcate()
        //     }
        // })
    },
    changeproduct: function(e) {
        var pid = e.currentTarget.dataset.pid;
        if (pid == this.data.pid) return;
        dataApi.getGoods({ id: pid }).then(res => {
                if (res.data.Code != 0) return;
                var data = res.data.Datas;
                var Contents = Base64.decode(data.Contents);
                var ContentPics = Contents.match(/(http:\/\/120\.27\.218\.55:8002\/\?id=\w+)/g).map(function(item, index) { return item + '&t=' });
                data.ContentPics = ContentPics;
                //console.log(ContentPics);
                var imgs = [data.TopPic];
                imgs = imgs.concat(data.Classify.map(function(item, index) { return item.ClassifyPic }));
                imgs = imgs.concat(data.Imgs.split(','));
                imgs = imgs.map((item, index) => { return 'http://120.27.218.55:8002/?id=' + item + '&t='; });
                data.Imgs = imgs;
                if (data.CategoryValue) {
                    var CategoryValue = '|' + data.CategoryValue + '|';
                    CategoryValue = CategoryValue.match(/\|(.*?),(.*?)(?=\|)/g).map(function(item, index) { return item.substring(1).split(','); });
                    data.CategoryValue = CategoryValue;
                } else data.CategoryValue = [
                    ['--', '--']
                ];
                this.setData({
                    pid: pid,
                    productinfo: data,
                    viewhistory: false
                });
                this.findcate();
            })
            // wx.request({
            //     url: 'https://shoptest.jzyglxt.com/Seller/GetSellerGoods',
            //     data: { "id": pid },
            //     success: (res) => {
            // if (res.data.Code != 0) return;
            // var data = res.data.Datas;
            // var Contents = Base64.decode(data.Contents);
            // var ContentPics = Contents.match(/(http:\/\/120\.27\.218\.55:8002\/\?id=\w+)/g).map(function(item, index) { return item + '&t=' });
            // data.ContentPics = ContentPics;
            // //console.log(ContentPics);
            // var imgs = [data.TopPic];
            // imgs = imgs.concat(data.Classify.map(function(item, index) { return item.ClassifyPic }));
            // imgs = imgs.concat(data.Imgs.split(','));
            // imgs = imgs.map((item, index) => { return 'http://120.27.218.55:8002/?id=' + item + '&t='; });
            // data.Imgs = imgs;
            // if (data.CategoryValue) {
            //     var CategoryValue = '|' + data.CategoryValue + '|';
            //     CategoryValue = CategoryValue.match(/\|(.*?),(.*?)(?=\|)/g).map(function(item, index) { return item.substring(1).split(','); });
            //     data.CategoryValue = CategoryValue;
            // } else data.CategoryValue = [
            //     ['--', '--']
            // ];
            // this.setData({
            //     pid: pid,
            //     productinfo: data,
            //     viewhistory: false
            // });
            // this.findcate();
            //     }
            // })
    },
    onShow: function() {
        var realname = wx.getStorageSync("realname");
        var token = wx.getStorageSync("token");
        if (realname) {
            //
            dataApi.checkToken({ token }).then(res => {
                    if (res.data.Code == 0)
                        this.setData({ realname: realname, token: token });
                    dataApi.getUserGoodsNum({ token }).then(res => {
                            // console.log(res)
                            if (res.data.Code == 0 && res.data.Row)
                                this.setData({
                                    CartNumber: res.data.Row
                                });
                            else this.setData({
                                CartNumber: 0
                            });
                        })
                        // wx.request({
                        //     url: 'https://shoptest.jzyglxt.com/Buyer/GetUserCartNumber',
                        //     method: 'post',
                        //     header: {
                        //         "Content-Type": "application/x-www-form-urlencoded",
                        //         "token": token,
                        //     },
                        //     success: res => {
                        //         if (res.data.Code == 0 && res.data.Row)
                        //             this.setData({
                        //                 CartNumber: res.data.Row
                        //             });
                        //         else this.setData({
                        //             CartNumber: 0
                        //         });
                        //     }
                        // })
                })
                // wx.request({
                //     url: 'https://shoptest.jzyglxt.com/User/CheckToken',
                //     method: 'post',
                //     header: {
                //         "Content-Type": "application/x-www-form-urlencoded",
                //         "token": token,
                //     },
                //     success: res => {
                // if (res.data.Code == 0)
                //     this.setData({ realname: realname, token: token });
                // wx.request({
                //     url: 'https://shoptest.jzyglxt.com/Buyer/GetUserCartNumber',
                //     method: 'post',
                //     header: {
                //         "Content-Type": "application/x-www-form-urlencoded",
                //         "token": token,
                //     },
                //     success: res => {
                //         if (res.data.Code == 0 && res.data.Row)
                //             this.setData({
                //                 CartNumber: res.data.Row
                //             });
                //         else this.setData({
                //             CartNumber: 0
                //         });
                //     }
                // })
                //     }
                // })
        } else this.setData({ realname: '', token: '' });
    },
    findcate() {
        dataApi.getCategoryPart({}).then(res => {
                var datas = JSON.parse(res.data.Datas);
                datas = flatarr(datas);

                function flatarr(arr) {
                    for (var i = 0; i < arr.length; i++) {
                        var item = arr[i];
                        if (item.children) {
                            arr = arr.concat(item.children);
                            delete arr[i].children;
                        }
                    }
                    return arr;
                }
                var productinfo = this.data.productinfo;
                var CategoryOne = '',
                    CategoryTwo = '',
                    Category = '';
                for (var i = 0; i < datas.length; i++) {
                    if (datas[i].Id == productinfo.CategoryOne) {
                        CategoryOne = datas[i].CategoryName;
                    }
                    if (datas[i].Id == productinfo.CategoryTwo) {
                        CategoryTwo = datas[i].CategoryName
                    }
                    if (datas[i].Id == productinfo.CategoryId) {
                        Category = datas[i].CategoryName;
                    }
                }
                productinfo = Object.assign(productinfo, { CategoryOneName: CategoryOne, CategoryTwoName: CategoryTwo, CategoryName: Category });
                this.setData({
                    productinfo: productinfo
                });
            })
            // wx.request({
            //     url: "https://shoptest.jzyglxt.com/Category/GetCategoryPart",
            //     success: (res) => {
            //         var datas = JSON.parse(res.data.Datas);
            //         datas = flatarr(datas);
            //         console.log(datas)

        //         function flatarr(arr) {
        //             for (var i = 0; i < arr.length; i++) {
        //                 var item = arr[i];
        //                 if (item.children) {
        //                     arr = arr.concat(item.children);
        //                     delete arr[i].children;
        //                 }
        //             }
        //             return arr;
        //         }
        //         var productinfo = this.data.productinfo;
        //         var CategoryOne = '',
        //             CategoryTwo = '',
        //             Category = '';
        //         for (var i = 0; i < datas.length; i++) {
        //             if (datas[i].Id == productinfo.CategoryOne) {
        //                 CategoryOne = datas[i].CategoryName;
        //             }
        //             if (datas[i].Id == productinfo.CategoryTwo) {
        //                 CategoryTwo = datas[i].CategoryName
        //             }
        //             if (datas[i].Id == productinfo.CategoryId) {
        //                 Category = datas[i].CategoryName;
        //             }
        //         }
        //         productinfo = Object.assign(productinfo, { CategoryOneName: CategoryOne, CategoryTwoName: CategoryTwo, CategoryName: Category });
        //         this.setData({
        //             productinfo: productinfo
        //         });
        //     }
        // })
    },

    // getGoodInfo(seGoodsId, goodsCode) {
    //     wx.request({
    //         url: "https://shoptest.jzyglxt.com/Seller/GetSellerGoodsInfo",
    //         method: "post",
    //         header: {
    //             "Content-Type": "application/x-www-form-urlencoded"
    //         },
    //         data: {
    //             seGoodsId: seGoodsId,
    //             goodsCode: goodsCode
    //         },
    //         success: (res) => {
    //             console.log(res.data.Datas);
    //         }
    //     })
    // },

    changeppindex: function(e) {
        var ppindex = e.currentTarget.dataset.ppindex;
        this.setData({
            ppindex: ppindex
        })
    },
    tov1: function(e) {
        this.setData({
            toView: 'v1'
        })
    },
    tov2: function(e) {
        this.setData({
            toView: 'v2'
        })
    },
    tov3: function(e) {
        this.setData({
            toView: 'v3'
        })
    },
    swiperchange: function(e) {
        var current = e.detail.current;
        if (current == this.data.ppindex + 1) return;
        var productinfo = this.data.productinfo;
        if (current >= 1 && current <= productinfo.Classify.length) {
            this.setData({
                ppindex: current - 1
            })
        }
    },
    addcart: function() {
        if (this.data.token == '') {
            wx.showToast({
                title: '您还未登入请先登入',
                icon: 'none',
                duration: 800
            })
            setTimeout(() => {
                wx.navigateTo({
                    url: '/pages/login/login'
                })
            }, 800)
            return;
        }
        var pid = this.data.pid;
        if (pid == '') return;
        var ss = this.data.vieworder;
        ss = !ss;
        var ppindex = this.data.ppindex;
        if (ppindex <= 0) ppindex = 0;
        this.setData({
            // toView: 'v0',
            ppindex: ppindex,
            vieworder: ss,
            immediatebuy: false,
            ordercount: 1,
            viewcart: false,
            viewhistory: false
        })
    },
    buy: function() {
        if (this.data.token == '') {
            wx.showToast({
                title: '您还未登入请先登入',
                icon: 'none',
                duration: 800
            })
            setTimeout(() => {
                wx.navigateTo({
                    url: '/pages/login/login'
                })
            }, 800)
            return;
        }
        var pid = this.data.pid;
        if (pid == '') return;
        var ss = this.data.vieworder;
        ss = !ss;
        var ppindex = this.data.ppindex;
        if (ppindex <= 0) ppindex = 0;
        this.setData({
            // toView: 'v0',
            ppindex: ppindex,
            vieworder: ss,
            immediatebuy: true,
            ordercount: 1,
            viewcart: false,
            viewhistory: false
        })
    },
    viewhistory: function() {
        var ss = this.data.viewhistory;
        ss = !ss;
        this.setData({
            viewhistory: ss,
            viewcart: false
        });
    },
    viewcart: function() {
        if (this.data.token == '') {
            wx.showToast({
                title: '您还未登入请先登入',
                icon: 'none',
                duration: 800
            })
            setTimeout(() => {
                wx.navigateTo({
                    url: '/pages/login/login'
                })
            }, 800)
            return;
        }
        var ss = this.data.viewcart;
        ss = !ss;
        console.log(ss);
        this.setData({
            viewhistory: false,
            viewcart: ss
        });
        var token = this.data.token;
        dataApi.getUserCart({ token }).then(res => {
                if (res.data.Code != 0) return
                    // console.log(res.data);
                this.setData({ CartGoods: res.data.Datas });
            })
            // wx.request({
            //     url: 'https://shoptest.jzyglxt.com/Buyer/GetUserCart',
            //     method: 'post',
            //     header: {
            //         "Content-Type": "application/x-www-form-urlencoded",
            //         "token": token,
            //     },
            //     success: res => {
            //         console.log(res.data);
            //         this.setData({ CartGoods: res.data.Datas });
            //     }
            // })
    },
    addpronum(e) {
        this.setData({
            ordercount: parseInt(e.detail.value)
        })
    },
    minusordercount() {
        var ordercount = this.data.ordercount;
        if (ordercount <= 1) return;
        ordercount--;
        this.setData({
            ordercount: ordercount
        })
    },
    addordercount() {
        var ordercount = this.data.ordercount;
        var ppindex = this.data.ppindex;
        var max = this.data.productinfo.Classify[ppindex].Total;
        if (ordercount >= max) return;
        ordercount++;
        this.setData({
            ordercount: ordercount
        })
    },
    changenextppindex() {
        var ppindex = this.data.ppindex;
        ppindex++;
        if (ppindex >= this.data.productinfo.Classify.length) ppindex = 0;
        var ordercount = this.data.ordercount;
        if (ordercount > this.data.productinfo.Classify[ppindex].Total) ordercount = this.data.productinfo.Classify[ppindex].Total;
        this.setData({ ppindex: ppindex, ordercount: ordercount });
    },
    previewImage() {
        var urls = this.data.productinfo.Imgs;
        var current = urls[this.data.ppindex + 1];
        wx.previewImage({
            urls: urls,
            current: current
        });
    },
    UpCartGoods: function(e) {
        var ppindex = this.data.ppindex;
        var productinfo = this.data.productinfo;
        // console.log(this.data.immediatebuy)
        if (this.data.immediatebuy) {
            var url = '/pages/cart5/cart5?count=' + this.data.ordercount + '&SeGoodsId=' + productinfo.Classify[ppindex].SeGoodsId + '&GoodsCode=' + productinfo.Classify[ppindex].GoodsCode;
            wx.navigateTo({ url: url });
            return;
        }
        var obj = {
            SeGoodsId: productinfo.Classify[ppindex].SeGoodsId,
            GoodsCode: productinfo.Classify[ppindex].GoodsCode,
            SeRealName: productinfo.RealName,
            SellerId: productinfo.UserId,
            number: this.data.ordercount
        }
        dataApi.upCardGoods(obj, { token: this.data.token }).then(res => {
                if (res.data.Code == 0) {
                    var CartNumber = this.data.CartNumber + this.data.ordercount;
                    this.setData({
                        vieworder: false,
                        CartNumber: CartNumber,
                        ordercount: 1
                    });
                    wx.showToast({
                        title: '已成功加入购物车！',
                        icon: 'none',
                        duration: 1000
                    })
                }
            })
            // wx.request({
            //     url: 'https://shoptest.jzyglxt.com/Buyer/UpCartGoods',
            //     method: 'post',
            //     header: {
            //         "Content-Type": "application/x-www-form-urlencoded",
            //         "token": this.data.token,
            //     },
            //     data: obj,
            //     success: res => {
            //         console.log(res)
            //         if (res.data.Code == 0) {
            //             var CartNumber = this.data.CartNumber + this.data.ordercount;
            //             this.setData({
            //                 vieworder: false,
            //                 CartNumber: CartNumber,
            //                 ordercount: 1
            //             });
            //             wx.showToast({
            //                 title: '已成功加入购物车！',
            //                 icon: 'none',
            //                 duration: 1000
            //             })
            //         }
            //     },
            //     fail: err => console.log(err)
            // });
    },
    tocart: function(e) {
        wx.switchTab({ "url": '/pages/cart/cart' })
    }
})