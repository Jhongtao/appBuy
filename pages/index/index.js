//index.js
//获取应用实例
const app = getApp()
import dataApi from '../../utils/dataApi'
// import Request from '../../utils/Request'
// const request = new Request()
Page({
    data: {
        slideshow: [],
        productsewm: [],
        productsBgsb: [],
        productsDzyqj: [],
        keywords: ''
    },

    onLoad: function() {
        const task1 = dataApi.homeSlideshow(),
            taks2 = dataApi.getGoodsJcyewm(),
            task3 = dataApi.getGoodsBgsb()
        task1.then(res => {
                // console.log(res)
                if (res.data.Code != 0) return;
                this.setData({
                    slideshow: res.data.Datas
                });
            })
            // wx.request({
            //     url: "https://shoptest.jzyglxt.com/Home/HomeSlideshow",
            //     success: (res) => {
            //         if (res.data.Code != 0) return;
            //         //console.log(res.data.Datas);

        //     }
        // });
        taks2.then(res => {
            console.log(res)
            if (res.data.Code != 0) return;
            var data = res.data.Datas;
            for (var i = 0; i < data.length; i++) {
                var MaxSold = 0;
                var MaxPrice = 0,
                    MinPrice = 10000000000;
                data[i].Classify.forEach(function(item, index) {
                    MaxSold += item.SoldCount;
                    if (item.PrefPrice > MaxPrice) MaxPrice = item.PrefPrice;
                    if (item.PrefPrice < MinPrice) MinPrice = item.PrefPrice;
                });
                if (MaxPrice != MinPrice) MinPrice = MinPrice + '~' + MaxPrice;
                data[i].MinPrice = MinPrice;
                data[i].MaxSold = MaxSold;
            }
            this.setData({
                productsewm: data
            });
        })


        // wx.request({
        //     url: "https://shoptest.jzyglxt.com/Seller/GetGoodsJcyewm",
        //     data: {},
        //     heder: {},
        //     success: (res) => {
        //         resolve(res)
        //         if (res.data.Code != 0) return;
        //         var data = res.data.Datas;
        //         for (var i = 0; i < data.length; i++) {
        //             var MaxSold = 0;
        //             var MaxPrice = 0,
        //                 MinPrice = 10000000000;
        //             data[i].Classify.forEach(function(item, index) {
        //                 MaxSold += item.SoldCount;
        //                 if (item.PrefPrice > MaxPrice) MaxPrice = item.PrefPrice;
        //                 if (item.PrefPrice < MinPrice) MinPrice = item.PrefPrice;
        //             });
        //             if (MaxPrice != MinPrice) MinPrice = MinPrice + '~' + MaxPrice;
        //             data[i].MinPrice = MinPrice;
        //             data[i].MaxSold = MaxSold;
        //         }
        //         this.setData({
        //             productsewm: data
        //         });
        //     }
        // });

        task3.then(res => {
                // console.log(res)
                if (res.data.Code != 0) return;

                var data = res.data.Datas;

                for (var i = 0; i < data.length; i++) {
                    var MaxSold = 0;
                    var MaxPrice = 0,
                        MinPrice = 10000000000;
                    data[i].Classify.forEach(function(item, index) {
                        MaxSold += item.SoldCount;
                        if (item.PrefPrice > MaxPrice) MaxPrice = item.PrefPrice;
                        if (item.PrefPrice < MinPrice) MinPrice = item.PrefPrice;
                    });
                    if (MaxPrice != MinPrice) MinPrice = MinPrice + '~' + MaxPrice;
                    data[i].MinPrice = MinPrice;
                    data[i].MaxSold = MaxSold;
                }
                this.setData({
                    productsBgsb: data
                })
            }).catch(err => console.log(err))
            // wx.request({
            //     url: "https://shoptest.jzyglxt.com/Seller/GetGoodsBgsb",
            //     success: (res) => {
            //         if (res.data.Code != 0) return;
            //         var data = res.data.Datas;

        //         for (var i = 0; i < data.length; i++) {
        //             var MaxSold = 0;
        //             var MaxPrice = 0,
        //                 MinPrice = 10000000000;
        //             data[i].Classify.forEach(function(item, index) {
        //                 MaxSold += item.SoldCount;
        //                 if (item.PrefPrice > MaxPrice) MaxPrice = item.PrefPrice;
        //                 if (item.PrefPrice < MinPrice) MinPrice = item.PrefPrice;
        //             });
        //             if (MaxPrice != MinPrice) MinPrice = MinPrice + '~' + MaxPrice;
        //             data[i].MinPrice = MinPrice;
        //             data[i].MaxSold = MaxSold;
        //         }
        //         this.setData({
        //             productsBgsb: data
        //         })
        //     }
        // });
        dataApi.getGoodsDzyqj().then(res => {
                // console.log(res)
                if (res.data.Code != 0) return;
                var data = res.data.Datas;
                for (var i = 0; i < data.length; i++) {
                    var MaxSold = 0;
                    var MaxPrice = 0,
                        MinPrice = 10000000000;
                    data[i].Classify.forEach(function(item, index) {
                        MaxSold += item.SoldCount;
                        if (item.PrefPrice > MaxPrice) MaxPrice = item.PrefPrice;
                        if (item.PrefPrice < MinPrice) MinPrice = item.PrefPrice;
                    });
                    if (MaxPrice != MinPrice) MinPrice = MinPrice + '~' + MaxPrice;
                    data[i].MinPrice = MinPrice;
                    data[i].MaxSold = MaxSold;
                }
                this.setData({
                    productsDzyqj: data
                });
            })
            // wx.request({
            //     url: "https://shoptest.jzyglxt.com/Seller/GetGoodsDzyqj",
            //     success: (res) => {
            //         // if (res.data.Code != 0) return;
            //         // var data = res.data.Datas;
            //         // for (var i = 0; i < data.length; i++) {
            //         //     var MaxSold = 0;
            //         //     var MaxPrice = 0,
            //         //         MinPrice = 10000000000;
            //         //     data[i].Classify.forEach(function(item, index) {
            //         //         MaxSold += item.SoldCount;
            //         //         if (item.PrefPrice > MaxPrice) MaxPrice = item.PrefPrice;
            //         //         if (item.PrefPrice < MinPrice) MinPrice = item.PrefPrice;
            //         //     });
            //         //     if (MaxPrice != MinPrice) MinPrice = MinPrice + '~' + MaxPrice;
            //         //     data[i].MinPrice = MinPrice;
            //         //     data[i].MaxSold = MaxSold;
            //         // }
            //         // this.setData({
            //         //     productsDzyqj: data
            //         // });
            //     }
            // });
    },
    updatekeyword(e) {
        this.setData({
            keywords: e.detail.value
        })
    },
    navSearch: function(e) {
        wx.navigateTo({
            url: '/pages/search/search?key=' + this.data.keywords
        })
    },
})