import dataApi from '../../utils/dataApi'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        s: 1,
        token: '',
        List: [],
        page: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var s = options.s || 1;
        s = parseInt(s);
        var token = wx.getStorageSync('token');
        if (token == '') {
            wx.navigateBack({ delta: 1 });
        } else {
            dataApi.checkToken({ token }).then(res => {
                    console.log(res)
                    if (res.data.Code != 0) {
                        wx.removeStorageSync("token");
                        wx.navigateBack({ delta: 1 });
                        return;
                    }
                    this.setData({ token: token, s: s });
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
                //         this.setData({ token: token, s: s });
                //         this.loadData();
                //     }
                // });
                //this.loadData(1);
        };
    },
    switchs: function(e) {
        var s = 1;
        var offsetLeft = e.target.offsetLeft;
        if (offsetLeft == 280) s = 5;
        else if (offsetLeft == 208) s = 4;
        else if (offsetLeft == 136) s = 3;
        else if (offsetLeft == 78) s = 2;
        this.setData({ s: s });
        this.loadData(s);
    },
    loadData: function(s) {
        if (isNaN(s)) s = this.data.s
        else this.setData({ s: s, page: 0, List: [] });
        var page = this.data.page;
        page++;
        var task;
        switch (s) {
            case 1:
                task = dataApi.getBuyerOrderPxsp({
                        page,
                        rows: 20
                    }, { "token": this.data.token })
                    // 'GetBuyerOrderPxsp';
                break;
            case 5:
                task = dataApi.getBuyerOrderQxdd({
                        page,
                        rows: 20
                    }, { "token": this.data.token })
                    // url = 'GetBuyerOrderQxdd';
                break;
            case 2:
                task = dataApi.getBuyerOrderMjfk({
                        page,
                        rows: 20
                    }, { "token": this.data.token })
                    // url = 'GetBuyerOrderMjfk';
                break;
            case 3:
                task = dataApi.getBuyerOrderMjfh({
                        page,
                        rows: 20
                    }, { "token": this.data.token })
                    // url = 'GetBuyerOrderMjfh';
                break;
            case 4:
                task = dataApi.getBuyerOrderQrsh({
                        page,
                        rows: 20
                    }, { "token": this.data.token })
                    // url = 'GetBuyerOrderQrsh';
                break;
        }
        // url = 'https://shoptest.jzyglxt.com/Buyer/' + url;
        // var page = this.data.page;
        // page++;
        task.then(res => {
                var data = res.data;
                console.log(res)
                if (data.Code == 0) {
                    var List = data.Datas;
                    List.forEach(function(item, index) {
                        let dd = new Date(item.OrderTime);
                        let OrderTime = dd.getFullYear() + '-0' + (1 + dd.getMonth()) + '-0' + dd.getDate() + ' 0' + dd.getHours() + ':0' + dd.getMinutes() + ':0' + dd.getSeconds();
                        OrderTime = OrderTime.replace(/\b0(\d\d)/g, '$1');
                        List[index].OrderTime = OrderTime;
                    });
                    List = List.concat(this.data.List);
                    //console.log(List);
                    this.setData({
                        List: List,
                        page: page
                    })
                } else if (data.Code == 2 && page > 1) {
                    wx.showToast({
                        title: '没有更多数据了',
                        icon: 'none',
                        duration: 1000
                    })
                }
            })
            // wx.request({
            //     url: url,
            //     method: 'post',
            //     header: {
            //         "Content-Type": "application/x-www-form-urlencoded",
            //         "token": this.data.token
            //     },
            //     data: {
            //         page: page,
            //         rows: 20
            //     },
            //     success: res => {
            //         var data = res.data;
            //         if (data.Code == 0) {
            //             var List = data.Datas;
            //             List.forEach(function(item, index) {
            //                 let dd = new Date(item.OrderTime);
            //                 let OrderTime = dd.getFullYear() + '-0' + (1 + dd.getMonth()) + '-0' + dd.getDate() + ' 0' + dd.getHours() + ':0' + dd.getMinutes() + ':0' + dd.getSeconds();
            //                 OrderTime = OrderTime.replace(/\b0(\d\d)/g, '$1');
            //                 List[index].OrderTime = OrderTime;
            //             });
            //             List = List.concat(this.data.List, List);
            //             //console.log(List);
            //             this.setData({
            //                 List: List,
            //                 page: page
            //             })
            //         } else if (data.Code == 2 && page > 1) {
            //             wx.showToast({
            //                 title: '没有更多数据了',
            //                 icon: 'none',
            //                 duration: 1000
            //             })
            //         }
            //     }
            // })
    },
    cencalorder: function(e) {
        var OrderId = e.currentTarget.dataset.orderid;

        wx.showModal({
            title: '提示',
            content: '确实要取消订单吗？',
            success: (res) => {
                if (res.confirm) {
                    dataApi.cancelOrder({ 'orderid': OrderId }, { "token": this.data.token }).then(res => {
                            console.log(res.data);
                            wx.showToast({
                                title: res.data.Msg,
                                icon: 'none',
                                duration: 1000
                            });
                            if (res.data.Code != 0) return;
                            var List = this.data.List;
                            var i = List.findIndex(function(item, index) { return item.OrderId == OrderId });
                            List.splice(i, 1);
                            this.setData({ 'List': List });
                        })
                        // wx.request({
                        //     'url': 'https://shoptest.jzyglxt.com/Buyer/CancelOrder',
                        //     'method': 'post',
                        //     'header': {
                        //         "Content-Type": "application/x-www-form-urlencoded",
                        //         "token": this.data.token
                        //     },
                        //     data: { 'orderid': OrderId },
                        //     'success': res => {
                        //         console.log(res.data);
                        //         wx.showToast({
                        //             title: res.data.Msg,
                        //             icon: 'none',
                        //             duration: 1000
                        //         });
                        //         if (res.data.Code != 0) return;
                        //         var List = this.data.List;
                        //         var i = List.findIndex(function(item, index) { return item.OrderId == OrderId });
                        //         List.splice(i, 1);
                        //         this.setData({ 'List': List });
                        //     }
                        // })
                }
            }
        })
    }
})