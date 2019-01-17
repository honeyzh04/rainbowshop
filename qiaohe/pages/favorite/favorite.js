var a = require("../../api.js"), o = getApp();

Page({
    data: {
        swiper_current: 0,
        goods: {
            list: null,
            is_more: !0,
            is_loading: !1,
            page: 1
        },
        topic: {
            list: null,
            is_more: !0,
            is_loading: !1,
            page: 1
        }
    },
    onLoad: function(a) {
        o.pageOnLoad(this), this.loadGoodsList({
            reload: !0,
            page: 1
        }), this.loadTopicList({
            reload: !0,
            page: 1
        });
    },
    tabSwitch: function(a) {
        var o = this, t = a.currentTarget.dataset.index;
        o.setData({
            swiper_current: t
        });
    },
    swiperChange: function(a) {
        console.log(a), this.setData({
            swiper_current: a.detail.current
        });
    },
    loadGoodsList: function(t) {
        var i = this;
        i.data.goods.is_loading || t.loadmore && !i.data.goods.is_more || (i.data.goods.is_loading = !0, 
        i.setData({
            goods: i.data.goods
        }), o.request({
            url: a.user.favorite_list,
            data: {
                page: t.page
            },
            success: function(a) {
                0 == a.code && (t.reload && (i.data.goods.list = a.data.list), t.loadmore && (i.data.goods.list = i.data.goods.list.concat(a.data.list)), 
                i.data.goods.page = t.page, i.data.goods.is_more = a.data.list.length > 0, i.setData({
                    goods: i.data.goods
                }));
            },
            complete: function() {
                i.data.goods.is_loading = !1, i.setData({
                    goods: i.data.goods
                });
            }
        }));
    },
    goodsScrollBottom: function() {
        var a = this;
        a.loadGoodsList({
            loadmore: !0,
            page: a.data.goods.page + 1
        });
    },
    loadTopicList: function(t) {
        var i = this;
        i.data.topic.is_loading || t.loadmore && !i.data.topic.is_more || (i.data.topic.is_loading = !0, 
        i.setData({
            topic: i.data.topic
        }), o.request({
            url: a.user.topic_favorite_list,
            data: {
                page: t.page
            },
            success: function(a) {
                0 == a.code && (t.reload && (i.data.topic.list = a.data.list), t.loadmore && (i.data.topic.list = i.data.topic.list.concat(a.data.list)), 
                i.data.topic.page = t.page, i.data.topic.is_more = a.data.list.length > 0, i.setData({
                    topic: i.data.topic
                }));
            },
            complete: function() {
                i.data.topic.is_loading = !1, i.setData({
                    topic: i.data.topic
                });
            }
        }));
    },
    topicScrollBottom: function() {
        var a = this;
        a.loadTopicList({
            loadmore: !0,
            page: a.data.topic.page + 1
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onReachBottom: function() {
        this.loadMoreGoodsList();
    }
});