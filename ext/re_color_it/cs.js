(function() {

// TODO: read current color theme from background-page

var styleProp2check = [
    // background
    "backgroundColor",
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

    // check if there is style information in current element
    if ("style" in curElm) {
        s = curElm.style;
        for (ip in styleProp2check) {
            if (styleProp2check[ip] in s) {
                // revert it color
                ss = s[styleProp2check[ip]];
                if (ss.length == 0) {
                    // this style property is defined but not assigned
                    continue;
                }

                bMatch = false;
                for (ci in clrIO) {
                    m = ss.match(clrIO[ci].re);
                    if (m) {
                        c = clrIO[ci].inf(m);
                        c[0] = 255 - c[0];
                        c[1] = 255 - c[1];
                        c[2] = 255 - c[2];
                        curElm.style[styleProp2check[ip]] = clrIO[ci].outf(c);

                        bMatch = true;
                        console.log('match');
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
        if (curElm.childNodes[i].nodeType == 1) {
            qElm.push(curElm.childNodes[i]);
        }
    }
}

})();
