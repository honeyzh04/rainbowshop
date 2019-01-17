var e, t = require("./utils/utils.js");

App({
    is_on_launch: !0,
    onLaunch: function() {
        this.setApi(), e = this.api, this.getNavigationBarColor(), console.log(wx.getSystemInfoSync()), 
        this.getStoreData(), this.getCatList();
    },
    getStoreData: function() {
        var t = this;
        this.request({
            url: e.default.store,
            success: function(e) {
                0 == e.code && (wx.setStorageSync("store", e.data.store), wx.setStorageSync("store_name", e.data.store_name), 
                wx.setStorageSync("show_customer_service", e.data.show_customer_service), wx.setStorageSync("contact_tel", e.data.contact_tel), 
                wx.setStorageSync("share_setting", e.data.share_setting));
            },
            complete: function() {
                t.login();
            }
        });
    },
    getCatList: function() {
        this.request({
            url: e.default.cat_list,
            success: function(e) {
                if (0 == e.code) {
                    var t = e.data.list || [];
                    wx.setStorageSync("cat_list", t);
                }
            }
        });
    },
    login: function() {
        var o = getCurrentPages(), a = o[o.length - 1];
        wx.showLoading({
            title: "正在登录",
            mask: !0
        }), wx.login({
            success: function(o) {
                if (o.code) {
                    var n = o.code;
                    wx.getUserInfo({
                        success: function(o) {
                            getApp().request({
                                url: e.passport.login,
                                method: "post",
                                data: {
                                    code: n,
                                    user_info: o.rawData,
                                    encrypted_data: o.encryptedData,
                                    iv: o.iv,
                                    signature: o.signature
                                },
                                success: function(e) {
                                    if (wx.hideLoading(), 0 == e.code) {
                                        wx.setStorageSync("access_token", e.data.access_token), wx.setStorageSync("user_info", e.data);
                                        var o = getCurrentPages(), n = 0;
                                        if (void 0 != o[0].options.user_id) n = o[0].options.user_id; else if (void 0 != o[0].options.scene) n = o[0].options.scene;
                                        if (getApp().bindParent({
                                            parent_id: n || 0
                                        }), void 0 == a) return;
                                        var s = getApp().loginNoRefreshPage;
                                        for (var i in s) if (s[i] === a.route) return;
                                        wx.redirectTo({
                                            url: "/" + a.route + "?" + t.objectToUrlParams(a.options),
                                            fail: function() {
                                                wx.switchTab({
                                                    url: "/" + a.route
                                                });
                                            }
                                        });
                                    } else wx.showToast({
                                        title: e.msg
                                    });
                                }
                            });
                        },
                        fail: function(e) {
                            wx.hideLoading(), getApp().getauth({
                                content: "需要获取您的用户信息授权，请到小程序设置中打开授权",
                                cancel: !0,
                                success: function(e) {
                                    e && getApp().login();
                                }
                            });
                        }
                    });
                }
            }
        });
    },
    request: function(e) {
        e.data || (e.data = {});
        var t = wx.getStorageSync("access_token");
        t && (e.data.access_token = t), e.data._uniacid = this.siteInfo.uniacid, e.data._acid = this.siteInfo.acid, 
        wx.request({
            url: e.url,
            header: e.header || {
                "content-type": "application/x-www-form-urlencoded"
            },
            data: e.data || {},
            method: e.method || "GET",
            dataType: e.dataType || "json",
            success: function(t) {
                -1 == t.data.code ? getApp().login() : e.success && e.success(t.data);
            },
            fail: function(t) {
                console.warn("--- request fail >>>"), console.warn(t), console.warn("<<< request fail ---");
                var o = getApp();
                o.is_on_launch ? (o.is_on_launch = !1, wx.showModal({
                    title: "网络请求出错",
                    content: t.errMsg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && e.fail && e.fail(t);
                    }
                })) : (wx.showToast({
                    title: t.errMsg,
                    image: "/images/icon-warning.png"
                }), e.fail && e.fail(t));
            },
            complete: function(t) {
                200 != t.statusCode && (console.log("--- request http error >>>"), console.log(t.statusCode), 
                console.log(t.data), console.log("<<< request http error ---")), e.complete && e.complete(t);
            }
        });
    },
    saveFormId: function(t) {
        this.request({
            url: e.user.save_form_id,
            data: {
                form_id: t
            }
        });
    },
    loginBindParent: function(e) {
        if ("" == wx.getStorageSync("access_token")) return !0;
        getApp().bindParent(e);
    },
    bindParent: function(t) {
        if ("undefined" != t.parent_id && 0 != t.parent_id) {
            console.log("Try To Bind Parent With User Id:" + t.parent_id);
            var o = wx.getStorageSync("user_info");
            wx.getStorageSync("share_setting").level > 0 && 0 != t.parent_id && getApp().request({
                url: e.share.bind_parent,
                data: {
                    parent_id: t.parent_id
                },
                success: function(e) {
                    0 == e.code && (o.parent = e.data, wx.setStorageSync("user_info", o));
                }
            });
        }
    },
    shareSendCoupon: function(t) {
        wx.showLoading({
            mask: !0
        }), t.hideGetCoupon || (t.hideGetCoupon = function(e) {
            var o = e.currentTarget.dataset.url || !1;
            t.setData({
                get_coupon_list: null
            }), o && wx.navigateTo({
                url: o
            });
        }), this.request({
            url: e.coupon.share_send,
            success: function(e) {
                0 == e.code && t.setData({
                    get_coupon_list: e.data.list
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    getauth: function(e) {
        wx.showModal({
            title: "是否打开设置页面重新授权",
            content: e.content,
            confirmText: "去设置",
            success: function(t) {
                t.confirm ? wx.openSetting({
                    success: function(t) {
                        e.success && e.success(t);
                    },
                    fail: function(t) {
                        e.fail && e.fail(t);
                    },
                    complete: function(t) {
                        e.complete && e.complete(t);
                    }
                }) : e.cancel && getApp().getauth(e);
            }
        });
    },
    api: require("api.js"),
    setApi: function() {
        function e(o) {
            for (var a in o) "string" == typeof o[a] ? o[a] = o[a].replace("{$_api_root}", t) : o[a] = e(o[a]);
            return o;
        }
        var t = this.siteInfo.siteroot;
        t = t.replace("app/index.php", ""), t += "addons/zjhj_mall/core/web/index.php?store_id=-1&r=api/", 
        this.api = e(this.api);
        var o = this.api.default.index, a = o.substr(0, o.indexOf("/index.php"));
        this.webRoot = a;
    },
    webRoot: null,
    siteInfo: require("siteinfo.js"),
    currentPage: null,
    pageOnLoad: function(e) {
        this.currentPage = e, console.log("--------pageOnLoad----------"), void 0 === e.openWxapp && (e.openWxapp = this.openWxapp), 
        void 0 === e.showToast && (e.showToast = this.pageShowToast), this.setNavigationBarColor(), 
        this.setPageNavbar(e);
    },
    pageOnReady: function(e) {
        console.log("--------pageOnReady----------");
    },
    pageOnShow: function(e) {
        console.log("--------pageOnShow----------");
    },
    pageOnHide: function(e) {
        console.log("--------pageOnHide----------");
    },
    pageOnUnload: function(e) {
        console.log("--------pageOnUnload----------");
    },
    setPageNavbar: function(t) {
        function o(e) {
            var o = !1, a = t.route || t.__route__ || null;
            for (var n in e.navs) e.navs[n].url === "/" + a ? (e.navs[n].active = !0, o = !0) : e.navs[n].active = !1;
            o && t.setData({
                _navbar: e
            });
        }
        console.log("----setPageNavbar----"), console.log(t);
        var a = wx.getStorageSync("_navbar");
        a && o(a), this.request({
            url: e.default.navbar,
            success: function(e) {
                0 == e.code && (o(e.data), wx.setStorageSync("_navbar", e.data));
            }
        });
    },
    getNavigationBarColor: function() {
        var t = this;
        t.request({
            url: e.default.navigation_bar_color,
            success: function(e) {
                0 == e.code && (wx.setStorageSync("_navigation_bar_color", e.data), t.setNavigationBarColor());
            }
        });
    },
    setNavigationBarColor: function() {
        var e = wx.getStorageSync("_navigation_bar_color");
        e && wx.setNavigationBarColor(e);
    },
    loginNoRefreshPage: [ "pages/index/index" ],
    openWxapp: function(e) {
        if (console.log("--openWxapp---"), e.currentTarget.dataset.url) {
            var t = e.currentTarget.dataset.url;
            (t = function(e) {
                var t = /([^&=]+)=([\w\W]*?)(&|$|#)/g, o = /^[^\?]+\?([\w\W]+)$/.exec(e), a = {};
                if (o && o[1]) for (var n, s = o[1]; null != (n = t.exec(s)); ) a[n[1]] = n[2];
                return a;
            }(t)).path = t.path ? decodeURIComponent(t.path) : "", console.log("Open New App"), 
            console.log(t), wx.navigateToMiniProgram({
                appId: t.appId,
                path: t.path,
                complete: function(e) {
                    console.log(e);
                }
            });
        }
    },
    pageShowToast: function(e) {
        console.log("--- pageToast ---");
        var t = this.currentPage, o = e.duration || 2500, a = e.title || "", n = (e.success, 
        e.fail, e.complete || null);
        t._toast_timer && clearTimeout(t._toast_timer), t.setData({
            _toast: {
                title: a
            }
        }), t._toast_timer = setTimeout(function() {
            var e = t.data._toast;
            e.hide = !0, t.setData({
                _toast: e
            }), "function" == typeof n && n();
        }, o);
    }
});