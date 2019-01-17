function t(t) {
    return (t = t.toString())[1] ? t : "0" + t;
}

module.exports = {
    formatTime: function(e) {
        var r = e.getFullYear(), n = e.getMonth() + 1, o = e.getDate(), a = e.getHours(), u = e.getMinutes(), g = e.getSeconds();
        return [ r, n, o ].map(t).join("/") + " " + [ a, u, g ].map(t).join(":");
    },
    objectToUrlParams: function(t) {
        var e = "";
        for (var r in t) e += "&" + r + "=" + t[r];
        return e.substr(1);
    },
    formatData: function(e) {
        var r = e.getFullYear(), n = e.getMonth() + 1, o = e.getDate();
        e.getHours(), e.getMinutes(), e.getSeconds();
        return [ r, n, o ].map(t).join("-");
    }
};