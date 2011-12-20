(function() {

//  test rectangle
g_rec = {t:0, l:0, w:50, h:50};

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
h.addHandler("down", {kc:40}, function() {
    //  down function
    g_rec.t += 2;
    adjust_cover_rect(g_rec);
    return true;
});
h.addHandler("down", {kc:38}, function() {
    //  up function
    g_rec.t -= 2;
    adjust_cover_rect(g_rec);
    return true;
});
h.addHandler("down", {kc:37}, function() {
    //  left function
    g_rec.l -= 2;
    adjust_cover_rect(g_rec);
    return true;
});
h.addHandler("down", {kc:39}, function() {
    //  right function
    g_rec.l += 2;
    adjust_cover_rect(g_rec);
    return true;
});

})();
