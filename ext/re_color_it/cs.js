(function() {

// TODO: read current color theme from background-page

var styleProp2check = [
    // background
    "backgroundColor",
    // border/outline
    "borderBottomColor",
    "borderLeftColor",
    "borderRightColor",
    "borderTopColor",
    "outlineColor",
    // text
    "color",
];

var clrIO = [
    {
        re: new RegExp("rgb\((\d+),\s*(\d+),\s*(\d+)\)", "i"),
        inf: function(m) {
            c = [];
            c.push(parseInt(m[1]);
            c.push(parseInt(m[2]);
            c.push(parseInt(m[3]);
            return c;
        }
        outf: function (c) {
            return "rgb(" + c[1] + "," + c[2] + "," + c[3] + ")";
        }
    },
    {
        re: new RegExp("rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)", "i"),
        inf: function(m) {
            c = [];
            c.push(parseInt(m[1]);
            c.push(parseInt(m[2]);
            c.push(parseInt(m[3]);
            c.push(parseFloat(m[4]);
            return c;
        }
        outf: function (c) {
            return "rgba(" + c[1] + "," + c[2] + "," + c[3] + "," + c[4] + ")";
        }
    }
];


var qElm = [document.body];
while (qElm.length) {
    // pop the front one as current element
    curElm = qElm.shift();

    // check if there is style information in current element
    s = window.getComputedStyle(curElm, null);
    if (s) {
        for (ip in styleProp2check) {
            if (styleProp2check[ip] in s) {
                // revert it color
                ss = s[styleProp2check[ip]];

                for (ci in clrIO) {
                    m = ss.match(clrIO[ci].re);
                    if (m) {
                        c = clrIO.inf(m);
                        c[0] = 255 - c[0];
                        c[1] = 255 - c[1];
                        c[2] = 255 - c[2];
                        curElm.style[styleProp2check[ip] = clrIO.outf(c);
                        break;
                    }
                }
            }
        }
    }

    for (i in curElm.childNodes) {
        qElm.push(curElm.childNodes[i]);
    }
}

})();
