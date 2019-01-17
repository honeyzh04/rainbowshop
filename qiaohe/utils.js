var e = {
    scene_decode: function(e) {
        var r = (e + "").split(","), t = {};
        for (var n in r) {
            var l = r[n].split(":");
            l.length > 0 && l[0] && (t[l[0]] = l[1] || null);
        }
        return t;
    }
};

module.exports = e;