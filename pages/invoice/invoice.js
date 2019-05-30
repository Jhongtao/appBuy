import dataApi from '../../utils/dataApi'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        s: 1,
        token: '',
        List: [],
        invoiceEdit: false,
        editInvoice: {},
        typeArray: [],
        typeValue: [],
        titleArray: [],
        titleValue: [],
        contentArray: [],
        contentValue: [],
        typeindex: 0,
        titleindex: 0,
        contentindex: 0,
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
    },
    loadData: function(s) {

        var task;
        if (s == 1) task = dataApi.getUserInvoiceWk({ "token": this.data.token })
            // var url = 'https://shoptest.jzyglxt.com/Order/GetUserInvoiceWk';
        if (s == 2) task = dataApi.getUserInvoiceYk({ "token": this.data.token })
            // url = 'https://shoptest.jzyglxt.com/Order/GetUserInvoiceYk';
        if (s == 3) task = dataApi.getAllUserInvoice({ "token": this.data.token })
            //  url = 'https://shoptest.jzyglxt.com/Order/GetAllUserInvoice';
            //else if (s == 4) url = 'https://shoptest.jzyglxt.com/User/GetInvoiceList';
        if (s == 4) task = dataApi.getInvoiceList({ "token": this.data.token })
        task.then(res => {
            console.log(res.data)
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
    },
    switchs: function(e) {
        var s = e.currentTarget.dataset.id;
        this.setData({ s: s });
        this.loadData(s);
    },
    invoiceEdit(e) {
        var task1 = dataApi.getInvContentType({ token: this.data.token }).then(res => {
            if (res.data.Code != 0) return
            var arr = [],
                value = []
            res.data.Datas.forEach(item => {
                arr.push(item.Name)
                value.push(item.Id)
            })
            this.setData({
                contentArray: arr,
                contentValue: value
            })
        })
        var task2 = dataApi.getInvTitleType({ token: this.data.token }).then(res => {
            if (res.data.Code != 0) return
            var arr = [],
                value = []
            res.data.Datas.forEach(item => {
                arr.push(item.Name)
                value.push(item.Id)
            })
            this.setData({
                titleArray: arr,
                titleValue: value
            })
        })
        var task3 = dataApi.getInvoiceType({ token: this.data.token }).then(res => {
            if (res.data.Code != 0) return
            var arr = [],
                value = []
            res.data.Datas.forEach(item => {
                arr.push(item.Name)
                value.push(item.Id)
            })
            this.setData({
                typeArray: arr,
                typeValue: value
            })
        })
        Promise.all([task1, task2, task3]).then(res => {
            console.log(res, task3)
            var index = e.currentTarget.dataset.index;
            var editInvoice = this.data.List[index]
            var typeindex = this.data.typeValue.findIndex(item => {
                return item == editInvoice.InvoiceType
            })
            var titleindex = this.data.titleValue.findIndex(item => {
                return item == editInvoice.InvTitleType
            })
            var contentindex = this.data.contentValue.findIndex(item => {
                return item == editInvoice.InvContentType
            })
            this.setData({
                invoiceEdit: true,
                editInvoice,
                typeindex,
                titleindex,
                contentindex
            })
        })

    },
    bindPickerChange1(e) {
        var index = e.detail.value
        var edit = this.data.editInvoice
        edit.InvTypeName = this.data.typeArray[index]
        edit.InvoiceType = this.data.typeValue[index]
        if (edit.InvoiceType == 23) {
            edit.InvTitleType = 26
            edit.InvTitleTypeName = '公司'
        }
        this.setData({
            typeindex: index,
            editInvoice: edit
        })
    },
    bindPickerChange2(e) {
        var index = e.detail.value
        var edit = this.data.editInvoice
        edit.InvTitleTypeName = this.data.titleArray[index]
        edit.InvTitleType = this.data.titleValue[index]
        this.setData({
            titleindex: index,
            editInvoice: edit
        })
    },
    bindPickerChange3(e) {
        var index = e.detail.value
        var edit = this.data.editInvoice
        edit.InvContentName = this.data.contentArray[index]
        edit.InvContentType = this.data.contentValue[index]
        this.setData({
            contentindex: index,
            editInvoice: edit
        })
    },
    closeEdit() {
        this.setData({
            invoiceEdit: false
        })
    },
    invoiceDel(e) {
        wx.showModal({
            title: '删除发票',
            content: '是否删除发票',
            success: res => {
                if (res.confirm) {
                    var index = e.currentTarget.dataset.index
                    var id = this.data.List[index].Id
                    dataApi.delInvoice({ id }, { token: this.data.token }).then(res => {
                        if (res.data.Code != 0) return
                        wx.showToast({
                            title: res.data.Msg,
                            icon: 'none',
                            duration: 1000
                        })
                        setTimeout(() => {
                            this.loadData(4)
                        }, 1000)
                    })
                } else if (res.cancel) {}
            }
        })

    },
    formReset() {},
    formSubmit(e) {
        var params = this.data.editInvoice
        var edit = e.detail.value
        delete edit.InvContentType
        delete edit.InvTitleType
        delete edit.InvoiceType
        params = Object.assign(params, edit)
        delete params.OrderTime
        delete params.RealName
        delete params.RealName
        delete params.UserId
        delete params.CreateTime
        dataApi.upInvoice(params, { token: this.data.token }).then(res => {
            if (res.data.Code != 0) return
            wx.showToast({
                title: res.data.Msg,
                icon: 'none',
                duration: 1000
            })
            setTimeout(() => {
                this.setData({
                    invoiceEdit: false
                })
                this.loadData(4)
            }, 1000)
        })
    },
    noexe() {}
})