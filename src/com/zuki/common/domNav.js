
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

if (!com.zuki.common.domNav) com.zuki.common.domNav = function() {
    this.init();
}

com.zuki.common.domNav.prototype.SIBLING = 1;
com.zuki.common.domNav.prototype.LEVEL = 2;

com.zuki.common.domNav.prototype._isVisible = function(elm) {
    if (!elm) return false;
    if (elm.nodeType != 1) return false; // element node only
    if (elm.offsetWidth == 0 || elm.offsetHeight == 0) return false;
    return true;
}

com.zuki.common.domNav.prototype.init = function(elm, isOk) {
    if (!elm || (isOk && typeof isOk != "function")) {
        this._rootElm = null;
        this._cacheElmList = [];
    } else {
        this._rootElm = elm;
        this._cacheElmList = [elm];
        if (isOk) {
            this._isOk = isOk;
        } else {
            this._isOk = this._isVisible;
    }
    this._idxCache = this._cacheElmList.length - 1;
    return elm;
}

com.zuki.common.domNav.prototype.next = function(op) {
   if (!this.rootElm) return this.rootElm;

}

com.zuki.common.domNav.prototype.prev = function(op) {
   if (!this.rootElm) return this.rootElm;
}

com.zuki.common.domNav.prototype.prevLevel = function() {
   if (!this.rootElm) return this.rootElm;
   if (this._idxCache <= 0) {
        return this._rootElm;
    }

    return this._cacheElmList[--this._idxCache];
}

com.zuki.common.domNav.prototype.nextLevel = function() {
    if (!this.rootElm) return this.rootElm;
    if (this._idxCache < (this._cacheElmList.length - 1)) [
        return this._cacheElmList[++this._idxCache];
    }

    // we need to find next visible child,
    // or child of the next sibling of current parent.
    var curElm = this._cacheElmList[this._idxCache].firstChildElement;
    while (curElm) {
        if (this._isOk(curElm)) {
            this._cacheElmList.push(curElm);
            this._idxCache++;
            return curElm;
        }

        curElm = curElm.nextSibling;
    }

    // we can't find one, return original one
    return this._cacheElmList[this._idxCache];
}
