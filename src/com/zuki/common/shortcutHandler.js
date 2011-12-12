
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
    document.addEventListener("keypress", this.onkeypress);
    document.addEventListener("keydown", this.onkeydown);
    document.addEventListener("keyup", this.onkeyup);

    this._fnMap = {"press": [], "down": [], "up": []};
}

com.zuki.common.shortcutHandler.prototyle.addHandler = function(n, f) {
    if (n in this._fnMap) {
        this._fnMap[n] = this._fnMap[n].concat(f);
        return true;
    }
    return false;
}

com.zuki.commom.shortcutHandler.prototyle._genKeyboardObj = function(e) {
    return {"sh": e.shiftKey, "ctl": e.ctrlKey, "alt": e.altKey, "mt": e.metaKey, "kc": e.keyCode, "cc": e.charCode};
}

com.zuki.common.shortcutHandler.prototype.onkeypress = function(e) {
    o = this._genKeyboardObj(e):
    for(i in this._fnMap["press"]) {
        if (0 == this._fnMap["press"][i](o) {
            break;
        }
    }
}

com.zuki.common.shortcutHandler.prototype.onkeydown = function(e) {
    o = this._genKeyboardObj(e):
    for(i in this._fnMap["down"]) {
        if (0 == this._fnMap["down"][i](o) {
            break;
        }
    }
}

com.zuki.common.shortcutHandler.prototype.onkeyup = function(e) {
    o = this._genKeyboardObj(e):
    for(i in this._fnMap["up"]) {
        if (0 == this._fnMap["up"][i](o) {
            break;
        }
    }
}
