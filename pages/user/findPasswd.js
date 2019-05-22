const md5 = require('../../utils/md5.js')
Page({
  data: {
    s:1,
    VerifyImg: '../img/code.svg',
    picId:'',
    picCode: '',
    phone:'',
    validphone:false,
    sessionid:'',
    verifyId:''
  },

  onLoad: function (options) {

  },
  getphone(e) {
    var phone = e.detail.value;
    this.setData({
      phone: phone,
      validphone: /^1\d{10}$/.test(phone)
    })
  },
  setpicCode(e) {
    var picCode = e.detail.value;
    this.setData({
      picCode: picCode
    })
  },
  verifyImg(e) {
    if (this.data.picId == '') {
      this.changeVerifyImg();
    }
  },
  changeVerifyImg(e) {
    wx.request({
      url: 'https://shoptest.jzyglxt.com/ComApi/GetPicVerify?_=' + Math.random(),
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": "ASP.NET_SessionId=" + this.data.sessionid,
        "Accept": "application/json, text/plain, */*"
      },
      "success": res => {
        var sessionid = res.header["Set-Cookie"];
        
        if (/^ASP\.NET_SessionId=/.test(sessionid)) {
          var i = sessionid.indexOf(';');
          if (i >= 0) sessionid = sessionid.substring(18, i);
          else sessionid = sessionid.substring(18);
          console.log(sessionid);
          this.setData({
            sessionid: sessionid
          });
        }
        if (res.data.Code == 0)
          this.setData({
            VerifyImg: res.data.Notes,
            picId: res.data.Datas,

          })
      }
    })
  },
  sendmsgcode(e) {
    console.log(e);
    if (!this.data.validphone) {
      wx.showToast({
        title: '手机号输入不正确',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    if (this.data.picCode.length < 6) {
      wx.showToast({
        title: '请输入6位数字图形验证码',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    wx.request({
      url: "https://shoptest.jzyglxt.com/ComApi/SendSmsForPasswd",
      method: "post",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": "ASP.NET_SessionId=" + this.data.sessionid,
      },
      data: {
        picId: this.data.picId,
        phone: this.data.phone,
        picCode: this.data.picCode
      },
      success: res => {
        console.log(res.data);
        if (res.data.Code != 30103) {
          this.setData({
            picCode: '',
            verifyImg: '../img/code.svg',
            picId: ''
          });
          wx.showToast({
            title: res.data.Msg,
            icon: 'none',
            duration: 1000
          })
          //this.changeVerifyImg();
        }
        else {
          var verifyId = res.data.Datas;
          this.setData({
            verifyId: verifyId
          });
          wx.showToast({
            title: '6位数字短信验证码已发送到你的手机，请注意查看',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  submit1:function(e){
    var obj=e.detail.value;
    console.log(obj);
    if(obj.phone==''||obj.phone.length<11){
      wx.showToast({
        title: '请填写手机号',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    if(obj.picCode==''||obj.picCode.length<6){
      wx.showToast({
        title: '请填写图形验证码',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    if(obj.code==''||obj.code.length<6){
      wx.showToast({
        title: '请填写短信验证码',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    this.setData({
      s:2,
      code: obj.code
    })
  },
  submit2:function(e){
    var obj=e.detail.value;
    if(obj.password==''||obj.password.length<8){
      wx.showToast({
        title: '请填写新密码，至少8位字符',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    if(obj.password2!=obj.password){
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    var password=md5(obj.password);
    wx.request({
      url: 'https://shoptest.jzyglxt.com/User/ChangePasswd',
      method: "post",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": "ASP.NET_SessionId=" + this.data.sessionid,
      },
      data: {
        passWord:password,
        code: this.data.code,
        verifyId: this.data.verifyId,
      },
      success:res=>{
        var data=res.data;
        if(data.Code==0){
          wx.showToast({
            title: '密码修改成功，请重新登录',
            icon: 'none',
            duration: 1000,
            success:function(e){
              wx.navigateBack({ delta: 1 });
            }
          });       
        }
      }
    })
  }
})