var t = require("../../api.js"), a = getApp(), e = !1, i = !1;

Page({
    data: {
        cat_id: "",
        page: 1,
        cat_list: [],
        goods_list: [],
        sort: 0,
        sort_type: -1
    },
    onLoad: function(t) {
        a.pageOnLoad(this), this.loadData(t);
    },
    loadData: function(t) {
        var a = this, e = wx.getStorageSync("cat_list"), i = "";
        if (t.cat_id) for (var s in e) {
            var o = !1;
            e[s].id == t.cat_id && (e[s].checked = !0, e[s].list.length > 0 && (i = "height-bar"));
            for (var r in e[s].list) e[s].list[r].id == t.cat_id && (e[s].list[r].checked = !0, 
            o = !0, i = "height-bar");
            o && (e[s].checked = !0);
        }
        a.setData({
            cat_list: e,
            cat_id: t.cat_id || "",
            height_bar: i
        }), a.reloadGoodsList();
    },
    catClick: function(t) {
        var a = this, e = "", i = t.currentTarget.dataset.index, s = a.data.cat_list;
        for (var o in s) {
            for (var r in s[o].list) s[o].list[r].checked = !1;
            o == i ? (s[o].checked = !0, e = s[o].id) : s[o].checked = !1;
        }
        var d = "";
        s[i].list.length > 0 && (d = "height-bar"), a.setData({
            cat_list: s,
            cat_id: e,
            height_bar: d
        }), a.reloadGoodsList();
    },
    subCatClick: function(t) {
        var a = this, e = "", i = t.currentTarget.dataset.index, s = t.currentTarget.dataset.parentIndex, o = a.data.cat_list;
        for (var r in o) for (var d in o[r].list) r == s && d == i ? (o[r].list[d].checked = !0, 
        e = o[r].list[d].id) : o[r].list[d].checked = !1;
        a.setData({
            cat_list: o,
            cat_id: e
        }), a.reloadGoodsList();
    },
    allClick: function() {
        var t = this, a = t.data.cat_list;
        for (var e in a) {
            for (var i in a[e].list) a[e].list[i].checked = !1;
            a[e].checked = !1;
        }
        t.setData({
            cat_list: a,
            cat_id: "",
            height_bar: ""
        }), t.reloadGoodsList();
    },
    reloadGoodsList: function() {
        var e = this;
        i = !1, e.setData({
            page: 1,
            goods_list: [],
            show_no_data_tip: !1
        });
        var s = e.data.cat_id || "", o = e.data.page || 1;
        a.request({
            url: t.default.goods_list,
            data: {
                cat_id: s,
                page: o,
                sort: e.data.sort,
                sort_type: e.data.sort_type
            },
            success: function(t) {
                0 == t.code && (0 == t.data.list.length && (i = !0), e.setData({
                    page: o + 1
                }), e.setData({
                    goods_list: t.data.list
                })), e.setData({
                    show_no_data_tip: 0 == e.data.goods_list.length
                });
            },
            complete: function() {}
        });
    },
    loadMoreGoodsList: function() {
        var s = this;
        if (!e) {
            s.setData({
                show_loading_bar: !0
            }), e = !0;
            var o = s.data.cat_id || "", r = s.data.page || 2;
            a.request({
                url: t.default.goods_list,
                data: {
                    page: r,
                    cat_id: o,
                    sort: s.data.sort,
                    sort_type: s.data.sort_type
                },
                success: function(t) {
                    0 == t.data.list.length && (i = !0);
                    var a = s.data.goods_list.concat(t.data.list);
                    s.setData({
                        goods_list: a,
                        page: r + 1
                    });
                },
                complete: function() {
                    e = !1, s.setData({
                        show_loading_bar: !1
                    });
                }
            });
        }
    },
    onReachBottom: function() {
        var t = this;
        i || t.loadMoreGoodsList();
    },
    onShow: function(t) {
        a.pageOnShow(this);
        var e = this;
        if (wx.getStorageSync("list_page_reload")) {
            var i = wx.getStorageSync("list_page_options");
            wx.removeStorageSync("list_page_options"), wx.removeStorageSync("list_page_reload");
            var s = i.cat_id || "";
            e.setData({
                cat_id: s
            });
            var o = e.data.cat_list;
            for (var r in o) {
                var d = !1;
                for (var c in o[r].list) o[r].list[c].id == s ? (o[r].list[c].checked = !0, d = !0) : o[r].list[c].checked = !1;
                d || s == o[r].id ? (o[r].checked = !0, o[r].list && o[r].list.length > 0 && e.setData({
                    height_bar: "height-bar"
                })) : o[r].checked = !1;
            }
            e.setData({
                cat_list: o
            }), e.reloadGoodsList();
        }
    },
    sortClick: function(t) {
        var a = this, e = t.currentTarget.dataset.sort, i = void 0 == t.currentTarget.dataset.default_sort_type ? -1 : t.currentTarget.dataset.default_sort_type, s = a.data.sort_type;
        if (a.data.sort == e) {
            if (-1 == i) return;
            s = -1 == a.data.sort_type ? i : 0 == s ? 1 : 0;
        } else s = i;
        a.setData({
            sort: e,
            sort_type: s
        }), a.reloadGoodsList();
    },
    onReady: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {}
});