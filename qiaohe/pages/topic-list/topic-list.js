var a = require("../../api.js"), t = getApp();

Page({
    data: {},
    onLoad: function(a) {
        t.pageOnLoad(this), this.loadTopicList({
            page: 1,
            reload: !0
        });
    },
    loadTopicList: function(o) {
        var e = this;
        e.data.is_loading || o.loadmore && !e.data.is_more || (e.setData({
            is_loading: !0
        }), t.request({
            url: a.default.topic_list,
            data: {
                page: o.page
            },
            success: function(a) {
                0 == a.code && (o.reload && e.setData({
                    list: a.data.list,
                    page: o.page,
                    is_more: a.data.list.length > 0
                }), o.loadmore && e.setData({
                    list: e.data.list.concat(a.data.list),
                    page: o.page,
                    is_more: a.data.list.length > 0
                }));
            },
            complete: function() {
                e.setData({
                    is_loading: !1
                });
            }
        }));
    },
    onShow: function() {
        t.pageOnShow(this);
    },
    onPullDownRefresh: function() {
        this.loadTopicList({
            page: 1,
            reload: !0
        });
    },
    onReachBottom: function() {
        var a = this;
        a.loadTopicList({
            page: a.data.page + 1,
            loadmore: !0
        });
    }
});