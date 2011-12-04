
var com;
if (!com) com = {};
else if (typeof com != "object") {
    throw new Error("com already exists and is not an object");
}

if (!com.zuki) com.zuki = {};
else if (typeof com.zuki != "object") {
    throw new Error("com.zuki already exist and is not an object");
}

if (!com.zuki.chrome) com.zuki.chrome = {};
else if (typeof com.zuki.chrome != "object") {
    throw new Error("com.zuki.chrome already exist and is not an object");
}


function xml_escape(c) {
    if (c == "\"") return "&quot;";
    if (c == "\'") return "&apos;";
    if (c == "&") return "&amp;";
    if (c == "<") return "&lt;";
    if (c == ">") return "&gt;";
    return c;
}

// declare com.zuki.chrome.omniMatch
if (!com.zuki.chrome.omniMatch) com.zuki.chrome.omniMatch = function(t, s) {
    this._ms = "";
    this._score = 0;
    this._matchRegion = [];
    this._token = "";
    this._s = "";
    this._isMatch = false;

    // construct regular expression
    if (t.length == 0) {
        return;
    }
    this._token = t.toLowerCase();
    this._s = s;
                
    // remove non-char character, only support char, numeric now
    // Build regular express for this case
    var r = "";
    for (var c in t) {
        if (c != 0) r += ".*";
        r += t[c];
    }
    var reg = new RegExp(r, "gi");

    this._isMatch = (s.match(reg) != null);
    if (this._isMatch) {
        this.genMatchRegion();
    }
};

com.zuki.chrome.omniMatch.prototype.merge = function(m) {
    var sc = m._score > this._score ? m._score : this._score;
    var merges = this._isMatch ? this._ms : "";
    if (m._isMatch) {
        if (this._isMatch) {
            merges += "-";
        }
        merges += m._ms;
    }
    return {isMatch: this._isMatch || m._isMatch, score: sc, s: merges};
}

com.zuki.chrome.omniMatch.prototype.convert2suggest = function(surround) {
    var idx = 0;
    // make sure ms is reset 
    this._ms = "<" + surround + ">";;
    for (var i in this._matchRegion) {
        this._ms += this._s.substr(idx, this._matchRegion[i].b - idx).replace(/[&<>\"\']/g, xml_escape);
        this._ms += "<match>";
        this._ms += this._s.substr(this._matchRegion[i].b, this._matchRegion[i].e - this._matchRegion[i].b + 1);
        this._ms += "</match>";
        idx = this._matchRegion[i].e + 1;
    }
    this._ms += this._s.substr(idx).replace(/[&<>\"\']/g, xml_escape);
    this._ms += "</" + surround + ">";
    return this._ms;
}

com.zuki.chrome.omniMatch.prototype.genMatchRegion = function() {
    if (this._matchRegion.length != 0) {
        return {sc: this._score, me: this._matchRegion};
    }

    var lastIdx = 0;
    var allDist = 0;
    var sL = this._s.toLowerCase();
    var rb = 0, re = 0;
    for (var c in this._token) {
        // match chars in lower case by default
        curIdx = sL.indexOf(this._token[c], lastIdx);
        if (curIdx != -1) {
            curDist = curIdx - lastIdx;

            if (c != 0) {
                allDist += curDist;
                // accumulate region if possible
                if (curIdx == re + 1) {
                    re += 1;
                } else {
                    this._matchRegion = this._matchRegion.concat([{b: rb, e: re}]);
                    rb = curIdx;
                    re = curIdx;
                }
            } else {
                rb = curIdx;
                re = curIdx;
            }

            if (c == this._token.length - 1) {
                this._matchRegion = this._matchRegion.concat([{b: rb, e: re}]);
            }
        } else {
            // we expect this string can be totally matched by this token
            return null;
        }
        lastIdx = curIdx + 1;
    }
    this._score = (this._s.length - allDist) * 100 / this._s.length;

    return {sc: this._score, me: this._matchRegion};
}

function xml_escape(c) {
    if (c == "\"") return "&quot;";
    if (c == "\'") return "&apos;";
    if (c == "&") return "&amp;";
    if (c == "<") return "&lt;";
    if (c == ">") return "&gt;";
    return c;
}

