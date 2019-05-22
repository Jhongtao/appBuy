import dataApi from '../../utils/dataApi'

Page({
    data: {
        cate: []
    },
    onLoad: function(options) {
        dataApi.getCategoryPart().then(res => {
                console.log(res)
                if (res.data.Code != 0) return;
                var data = JSON.parse(res.data.Datas);
                this.setData({
                    cate: data
                });
            })
            // wx.request({
            //     url: "https://shoptest.jzyglxt.com/Category/GetCategoryPart",
            //     success: (res) => {
            //         console.log(res)
            //         if (res.data.Code != 0) return;
            //         var data = JSON.parse(res.data.Datas);
            //         this.setData({
            //             cate: data
            //         });
            //     }
            // });

    },
    onShow() {
        dataApi.getCategoryPart().then(res => {
            console.log(res)
            if (res.data.Code != 0) return;
            var data = JSON.parse(res.data.Datas);
            this.setData({
                cate: data
            });
        })
    }
})