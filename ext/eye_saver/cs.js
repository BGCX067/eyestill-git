(function() {

//  test rectangle
var g_rec = {t:0, l:0, w:50, h:50};
var g_nav = new com.zuki.common.domNav();
g_nav.init(document.body);

function create_cover_rect(t, l, w, h, id, c) {
    // init 4 rectangles
    rec = document.createElement("div");
    rec.setAttribute("id", "eyesavercoverrect_" + id);
    rec.setAttribute("style", "width:" + w + ";height:" + h + ";top:" + t + ";left:" + l + ";position:fixed;background-color:rgb" + c + ";z-index:10000;opacity:0.8;pointer-events:none;");
    
    document.body.appendChild(rec);
}

create_cover_rect("0px", "0px", "30%", "100%", "left", "(0,0,0)");
create_cover_rect("0px", "70%", "30%", "100%", "right", "(0,255,0)");
create_cover_rect("0px", "30%", "40%", "20%", "top", "(255,0,0)");
create_cover_rect("80%", "30%", "40%", "20%", "down", "(0,0,255)");

rectName = {t:"top", d:"down", l:"left", r:"right"};

var gCurElm = document.body;

function getNextElm(elm, direction) {
    if (direction == "up") {
        return g_nav.prevLevel();
    } else if (direction == "down") {
        return g_nav.nextLevel();
    } else if (direction == "left") {
        return g_nav.prev();
    } else if (direction == "right") {
        return g_nav.next();
    }

    throw "unknown navigation-direction";
}

function convertRect2MyRect(rec) {
    var recMy = {};
    recMy.t = rec.top;
    recMy.l = rec.left;
    recMy.w = rec.right - rec.left;
    recMy.h = rec.bottom - rec.top;
    return recMy;
}

function adjust_cover_rect(curRec) {
    //  left
    elm = document.getElementById("eyesavercoverrect_" + rectName.l);
    if (!elm) return;
    elm.style.width = curRec.l + "px";

    //  right
    elm = document.getElementById("eyesavercoverrect_" + rectName.r);
    if (!elm) return;
    elm.style.left = (curRec.l + curRec.w) + "px";
    elm.style.width = (window.innerWidth - curRec.l - curRec.w) + "px";

    //  top
    elm = document.getElementById("eyesavercoverrect_" + rectName.t);
    if (!elm) return;
    elm.style.left = curRec.l + "px";
    elm.style.width = curRec.w + "px";
    elm.style.height = curRec.t + "px";

    //  down
    elm = document.getElementById("eyesavercoverrect_" + rectName.d);
    if (!elm) return;
    elm.style.top = (curRec.t + curRec.h) + "px";
    elm.style.left = curRec.l + "px";
    elm.style.width = curRec.w + "px";
    elm.style.height = (window.innerHeight - curRec.t - curRec.h) + "px";
}

h = new com.zuki.common.shortcutHandler();
h.addHandler("down", {special_key:"shift;ctrl", kc:40}, function() {
    //  down function
    gCurElm = getNextElm(gCurElm, "down");
    if (gCurElm) {
        g_rec = convertRect2MyRect(gCurElm.getBoundingClientRect());
    }
    adjust_cover_rect(g_rec);
    return true;
});
h.addHandler("down", {special_key:"shift;ctrl", kc:38}, function() {
    //  up function
    gCurElm = getNextElm(gCurElm, "up");
    if (gCurElm) {
        g_rec = convertRect2MyRect(gCurElm.getBoundingClientRect());
    }
    adjust_cover_rect(g_rec);
    return true;
});
h.addHandler("down", {special_key:"shift;ctrl", kc:37}, function() {
    //  left function
    gCurElm = getNextElm(gCurElm, "left");
    if (gCurElm) {
        g_rec = convertRect2MyRect(gCurElm.getBoundingClientRect());
    }
    adjust_cover_rect(g_rec);
    return true;
});
h.addHandler("down", {special_key:"shift;ctrl", kc:39}, function() {
    //  right function
    gCurElm = getNextElm(gCurElm, "right");
    if (gCurElm) {
        g_rec = convertRect2MyRect(gCurElm.getBoundingClientRect());
    }
    adjust_cover_rect(g_rec);
    return true;
});

})();

