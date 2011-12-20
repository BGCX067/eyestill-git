
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
    // check input type
    if ("kc" in matchObj) {
        if (typeof matchObj.kc == "string") {
            matchObj.kc = matchObj.kc.toLowerCase();
        } else if (typeof matchObj.kc != "number") {
            throw "com.zuki.common.shortcutHandler.prototype.addHandler: unknown match-object, type of m is wrong.";
        }
    }
    if (typeof func != "function") {
        throw "com.zuki.common.shortcutHandler.prototype.addHandler: func is not a function.";
    }

    if (et in this._fnMap) { 
        this._fnMap[et] = this._fnMap[et].concat({m: matchObj, f:func});
        switch(et) {
            case "press":
                if (this._bPressAttached == false) {
                    document.addEventListener("keypress", this._onkeypress.bind(this));
                    this._bPressAttached = true;
                }
                break;
            case "down":
                if (this._bDownAttached == false) {
                    document.addEventListener("keydown", this._onkeydown.bind(this));
                    this._bDownAttached = true;
                }
                break;
            case "up":
                if (this._bUpAttached == false) {
                    document.addEventListener("keyup", this._onkeyup.bind(this));
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
            switch (t[i]) {
                case "shift":
                    bMatched = (e.shiftKey == true);
                    break;
                case "ctrl":
                    bMatched = (e.ctrlKey == true);
                    break;
                case "alt":
                    bMatched = (e.altKey == true);
                    break;
                case "meta":
                    bMatched = (e.metaKey == true);
                    break;
                default:
                    throw "com.zuki.common.shortcutHandler._isMatched: Unknown special key";
            }
        }
    }
    if (bMatched == false) return bMatched;

    if ("kc" in m) {
        if (typeof m.kc == "number") {
            bMatched = (e.keyCode == m.kc);
        } else if (typeof m.kc == "string") {
            if (m.kc.length > 1) throw "com.zuki.common.shortcutHandler._isMatched: keycode's length shouldn't be longer than 1."
            bMatched = (m.kc == String.fromCharCode(e.keyCode).toLowerCase());
        } else {
            throw "com.zuki.common.shortcutHandler._isMatched: keycode should contain number or char.";
        }
    }

    // TODO: no support on char-code and which now.

    return bMatched;
}   

com.zuki.common.shortcutHandler.prototype._onkeypress = function(e) {
    console.log('press [' + e.keyCode + '][' + e.charCode + '][' + String.fromCharCode(e.keyCode) + '][' + String.fromCharCode(e.charCode) + ']');
    var bHandled = false;
    for (i in this._fnMap.press) {
        if (this._isMatched(this._fnMap.press[i].m, e) == true) {
            bHandled = this._fnMap.press[i].f();
            if (bHandled == true) {
                break;
            }
        }
    }

    return bHandled;
}

com.zuki.common.shortcutHandler.prototype._onkeydown = function(e) {
    console.log('down [' + e.keyCode + '][' + e.charCode + '][' + String.fromCharCode(e.keyCode) + '][' + String.fromCharCode(e.charCode) + ']');
    var bHandled = false;
    for (i in this._fnMap.down) {
        if (this._isMatched(this._fnMap.down[i].m, e) == true) {
            bHandled = this._fnMap.down[i].f();
            if (bHandled == true) {
                break;
            }
        }
    }

    return bHandled;
}

com.zuki.common.shortcutHandler.prototype._onkeyup = function(e) {
    console.log('up [' + e.keyCode + '][' + e.charCode + '][' + String.fromCharCode(e.keyCode) + '][' + String.fromCharCode(e.charCode) + ']');
    var bHandled = false;
    for (i in this._fnMap.up) {
        if (this._isMatched(this._fnMap.up[i].m, e) == true) {
            bHandled = this._fnMap.up[i].f();
            if (bHandled == true) {
                break;
            }
        }
    }

    return bHandled;
}

