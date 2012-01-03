
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
   if (!this.rootElm) return null;

}

com.zuki.common.domNav.prototype.prev = function(op) {
   if (!this.rootElm) return null;
}

com.zuki.common.domNav.prototype.prevLevel = function() {
   if (!this.rootElm) return null;
   if (this._idxCache <= 0) {
        return this._rootElm;
    }

    return this._cacheElmList[--this._idxCache];
}

com.zuki.common.domNav.prototype.nextLevel = function() {
    if (!this.rootElm) return null;
    if (this._idxCache < (this._cacheElmList.length - 1)) [
        return this._cacheElmList[++this._idxCache];
    }

    // we need to find next visible child,
    // or child of the next sibling of current parent.
    var levelQ = [this._cacheElmList[this._idxCache]];
    var curElm = this._cacheElmList[this._idxCache];
    var tmpElm = curElm;
    var retElm = null;
    var levelBias = 1;
    var bLoop = true;

    do {
        if (levelBias > 0) {
            while (--levelBias > 0) {
                // we can find at least one child in this branch
                if (tmpElm.firstChildElement) {
                    tmpELm = tmpElm.firstChildElement;
                    if (levelBias != 0) {
                        levelQ[levelBias] = tmpElm;
                    }
                } else {
                    // there is no child on our way, need to go back, until we find next branch to seek
                    while (levelBias < levelQ.length && !levelQ[levelBias].nextSibling) {
                        levelBias++;
                    }

                    if (levelBias == levelQ.length) {
                        // we need to go back one more level
                        if (levelQ[levelBias - 1].parentElement) {
                            levelQ.push(levelQ[levelBias - 1].parentElement);
                        } else {
                            // we've reached to root of DOM tree
                            bLoop = false;
                        }
                    }

                    break;
                }
            }
        } else {
            if (tmpElm.nextSibling) {
                tmpElm = tmpElm.nextSibling;
            } else {
                // there is no sibling, go back to next branch to get more
                levelBias = 1;
            }
        }

        if (levelBias == 0) {
            if (this._isOk(tmpElm)) {
                bLoop = false;

                retElm = tmpElm;
                // copy levelQ to _cacheElmList
                this._cacheElmList = this._cacheElmList.slice(0, this._cacheElmList.length - levelQ.length - 1).concat(levelQ);
                this._cacheElmList.push(retElm);
            } else {
                // there is no more valid child in this branch, go back one level to see if we can find more.
                levelBias = 1;
            }
        }
    } while (bLoop);
}
