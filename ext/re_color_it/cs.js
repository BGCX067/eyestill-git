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

function gen_unique_id_for_element(elm, prefix) {
    if (id in elm && elm.id != "")
        return elm.id;
    }

    if (typeof prefix == "string") {
        id = prefix;
    }

    // generate our id with some meaningful part
    if (prefix == undefined || prefix == null || prefix == "") {
        // traverse back to parent node
        qElm = [];
        curElm = elm;
        while (curElm != null && curElm.nodeType == 1) {
            qElm.push(curElm);
            curElm = curElm.parentNode;
        }
        qElm.reverse();

        // concate id/tag-name as part of the new id
        for(i in qElm) {
            curS = "";
            if (qElm[i].id != undefined && qElm[i].id != "") {
                curS = qElm[i].id;
            } else {
                curS = qElm[i].tagName;
            }

            if (curS != "") {
                if (id.length != 0) id += ".";
                id += curS;
            }
        }
    }

    //  handle for multiple elements with the same tagName and same parent-node
    randV = Math.random() * 0xFFFFFF;
    return id += randV;
}

var cacheStyle = {};
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

                sChanged = {};
                for (ci in clrIO) {
                    m = ss.match(clrIO[ci].re);
                    if (m) {
                        // before we modify it, we need to cache it original value
                        // for caching, we need an id and assign one if this element doesn't have one.
                        sChanged[styleProp2check[ip]] = ss;

                        c = clrIO[ci].inf(m);
                        c[0] = 255 - c[0];
                        c[1] = 255 - c[1];
                        c[2] = 255 - c[2];
                        // TODO: we can keep the original/modified style in another style-sheet and
                        // TODO: replace them via class property of element.
                        // TODO: we also need to remove original style string in element
                        curElm.style[styleProp2check[ip]] = clrIO[ci].outf(c);

                        break;
                    }
                }

                if (object.keys(sChanged).length == 0) {
                    console.log("not match: " + ss);
                } else {
                    // TODO: cache the modified value
                }
            }
        }
    }

    for (i in curElm.childNodes) {
        // we are only interested in nodeType==1, which means Element
        if (curElm.childNodes[i].nodeType == 1) {
            qElm.push(curElm.childNodes[i]);
        }
    }
}

// TODO: modify stylesheet

})();
