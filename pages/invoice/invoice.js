import dataApi from '../../utils/dataApi'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        s: 1,
        token: '',
        List: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var token = wx.getStorageSync("token");
        if (!token) {
            wx.navigateBack({ delta: 1 });
            return;
        }
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
    },
    loadData: function(s) {
        var task = dataApi.getUserInvoiceWk({ "token": this.data.token })
        var url = 'https://shoptest.jzyglxt.com/Order/GetUserInvoiceWk';
        if (s == 2) task = dataApi.getUserInvoiceYk({ "token": this.data.token })
            // url = 'https://shoptest.jzyglxt.com/Order/GetUserInvoiceYk';
        else if (s == 3) task = dataApi.getAllUserInvoice()
            //  url = 'https://shoptest.jzyglxt.com/Order/GetAllUserInvoice';
            //else if (s == 4) url = 'https://shoptest.jzyglxt.com/User/GetInvoiceList';
        task.then(res => {
                if (res.data.Code == 0) {
                    var List = res.data.Datas;
                    List.forEach(function(item, index) {
                        let dd = new Date(item.OrderTime);
                        let OrderTime = dd.getFullYear() + '-0' + (1 + dd.getMonth()) + '-0' + dd.getDate() + ' 0' + dd.getHours() + ':0' + dd.getMinutes() + ':0' + dd.getSeconds();
                        OrderTime = OrderTime.replace(/\b0(\d\d)/g, '$1');
                        List[index].OrderTime = OrderTime;
                    });
                    this.setData({ List: List });
                }
            })
            // wx.request({
            //     url: url,
            //     method: 'post',
            //     header: {
            //         "Content-Type": "application/x-www-form-urlencoded",
            //         "token": this.data.token,
            //     },
            //     success: (res) => {
            //         if (res.data.Code == 0) {
            //             var List = res.data.Datas;
            //             List.forEach(function(item, index) {
            //                 let dd = new Date(item.OrderTime);
            //                 let OrderTime = dd.getFullYear() + '-0' + (1 + dd.getMonth()) + '-0' + dd.getDate() + ' 0' + dd.getHours() + ':0' + dd.getMinutes() + ':0' + dd.getSeconds();
            //                 OrderTime = OrderTime.replace(/\b0(\d\d)/g, '$1');
            //                 List[index].OrderTime = OrderTime;
            //             });
            //             this.setData({ List: List });
            //         }

        //     }
        // })
    },
    switchs: function(e) {
        var s = e.currentTarget.dataset.id;
        // var s = 1;
        // if (offsetLeft == 92) { s = 2; }
        // else if (offsetLeft == 164) { s = 3; }
        // else if (offsetLeft == 236) { s = 4; }
        this.setData({ s: s });
        this.loadData(s);
    }
})