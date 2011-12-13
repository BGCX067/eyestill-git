
var com;
if (!com) com = {};
else if (typeof com != "object") {
    throw new Error("com already exists and is not an object");
}

if (!com.zuki) com.zuki = {};
else if (typeof com.zuki != "object") {
    throw new Error("com.zuki already exist and is not an object");
}

if (!com.zuki.common) com.zuki.common = {};
else if (typeof com.zuki.common != "object") {
    throw new Error("com.zuki.common already exist and is not an object");
}

if (!com.zuki.common.shortcutHandler) com.zuki.common.shortcutHandler = function() {
    this._fnMap = {"press": [], "up": [], "down":[]};

    this._bPressAttached = false;
    this._bDownAttached = false;
    this._bUpAttached = false;
}

com.zuki.common.shortcutHandler.prototype.addHandler = function(et, matchObj, func) {
    if (et in this._fnMap) { 
        this._fnMap[et] = this._fnMap[et].concat({m: matchObj, f:func});
        switch(et) {
            case "press":
                if (this._bPressAttached == false) {
                    document.addEventListener("keypress", this.onkeypress);
                    this._bPressAttached = true;
                }
                break;
            case "down":
                if (this._bDownAttached == false) {
                    document.addEventListener("keydown", this.onkeydown);
                    this._bDownAttached = true;
                }
                breakl
            case "up":
                if (this._bUpAttached == false) {
                    document.addEventListener("keyup", this.onkeyup);
                    this._bUpAttached = true;
                }
                break;
            default:
                throw "com.zuki.common.shortcutHandler.prototype.addHandler: unknown event_type: " + et;
        }
        return true;
    }
    return false;
}

com.zuki.common.shortcutHandler.prototype._isMatched = function(m, e) {
    var bMatched  = true;
    if ("special_key" in m) {
        t = m.special_key.split(";");
        for (var i in t) {
            if (t[i].length > 1) {
                switch (t[i]) {
                    case "shift":
                        bMatched = (e.shiftKey == false);
                        break;
                    case "ctrl":
                        bMatched = (e.ctrlKey == false);
                        break;
                    case "alt":
                        bMatched = (e.altKey == false);
                        break;
                    case "meta":
                        bMatched = (e.metaKey == false);
                        break;
                    default:
                        throw "com.zuki.common.shortcutHandler._isMatched: Unknown special key";
                }
            }
        }
    }
    if (bMatched == false) return bMatched;

    if ("kc" in m) {
        if (typeof m.kc == "number") {
            bMatched = (e.keycode == m.kc);
        } else if (typeof m.kc == "string") {
            if (m.kc.length > 1) throw "com.zuki.common.shortcutHandler._isMatched: keycode's length shouldn't be longer than 1."
            bMatched = (m.kc == String.fromCharCode(e.keycode));
        } else {
            throw "com.zuki.common.shortcutHandler._isMatched: keycode should contain number or char.";
        }
    }

    // TODO: no support on char-code and which now.

    return bMatched;
}   

com.zuki.common.shortcutHandler.prototype.onkeypress = function(e) {
    for (i in this._fnMap.press) {
    }
}

com.zuki.common.shortcutHandler.prototype.onkeydown = function(e) {
    for (i in this._fnMap.down) {
    }
}

com.zuki.common.shortcutHandler.prototype.onkeyup = function(e) {
    for (i in this._fnMap.up) {
    }
}

