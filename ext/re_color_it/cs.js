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
        t: "rgb",
        re: /rgb\((\d+),\s*(\d+),\s*(\d+)\)/i,
        inf: function(m) {
            c = [];
            c.push(parseInt(m[1]));
            c.push(parseInt(m[2]));
            c.push(parseInt(m[3]));
            return c;
        },
        outf: function (c) {
            return "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")";
        }
    },
    {
        t: "rgba",
        re: /rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)/i,
        inf: function(m) {
            c = [];
            c.push(parseInt(m[1]));
            c.push(parseInt(m[2]));
            c.push(parseInt(m[3]));
            c.push(parseFloat(m[4]));
            return c;
        },
        outf: function (c) {
            return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + c[3] + ")";
        }
    }
];

// TODO: we can iterate through ul, li tags in these code

var qElm = [document.body];
while (qElm.length) {
    // pop the front one as current element
    curElm = qElm.shift();
    if (curElm.tagName == "li")
        console.log(curElm.innerText);

    // check if there is style information in current element
    s = window.getComputedStyle(curElm, null);
    if (s) {
        for (ip in styleProp2check) {
            if (styleProp2check[ip] in s) {
                // revert it color
                ss = s[styleProp2check[ip]];

                bMatch = false;
                for (ci in clrIO) {
                    m = ss.match(clrIO[ci].re);
                    if (m) {
                        c = clrIO[ci].inf(m);
                        c[0] = 255 - c[0];
                        c[1] = 255 - c[1];
                        c[2] = 255 - c[2];
                        curElm.style[styleProp2check[ip]] = clrIO[ci].outf(c);

                        if (styleProp2check[ip] == "color" && curElm.innerText == "The first summit of ") {
                            console.log(clrIO[ci].outf(c));
                        }

                        bMatch = true;
                        break;
                    }
                }

                if (!bMatch) {
                    console.log("not match: " + ss);
                }
            }
        }
    }

    for (i in curElm.childNodes) {
        qElm.push(curElm.childNodes[i]);
    }
}

})();
