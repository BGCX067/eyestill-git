
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
        this._root = null;
        this._cacheElmList = [];
    } else {
        this._root = elm;
        this._stk = [elm];
        if (isOk) {
            this._isOk = isOk;
        } else {
            this._isOk = this._isVisible;
    }
    this._idx = this._stk.length - 1;
    return elm;
}

com.zuki.common.domNav.prototype.next = function(op) {
   if (!this._root) return null;

}

com.zuki.common.domNav.prototype.prev = function(op) {
   if (!this._root) return null;
}

com.zuki.common.domNav.prototype.prevLevel = function() {
   if (!this._root) return null;
   if (this._idx <= 0) {
        return this._root;
   }
}

com.zuki.common.domNav.prototype.nextLevel = function() {
   if (!this._root) return null;
   if (this._idx <= 0) {
        return this._root;
   }

   if (this._idx < (this._stk.length - 1)) [
        return this._stk[++this._idx];
   }
}

com.zuki.common.domNav.prototype._levelBias = function(Q, QIdx, bias, fCheckFirst, fGoNext) {
    if (typeof bias != "integer" || bias < 0) return null;
    if (typeof QIdx != "integer" || QIdx < 0 || QIdx >= Q.length) return null;
    if (typeof fCheckFirst != "function") throw "Not a function";
    if (typeof fGoNext != "function") throw "Not a function";

    // we need to find next visible child,
    // or child of the next sibling of current parent.
    var totalBias = bias + Q.length - QIdx - 1;
    var curBias = QIdx;
    var elm = stk[stkBIdx];
    var levelQ = new Array(totalBias + 1 - Q.length);
    levelQ = Q.concat(levelQ);
    var bLoop = true;

    do {
        if (curBias < totalBias) {
            while (curBias < totalBias) {
                // we need to go down the tree
                elm = fCheckFirst(levelQ[curBias]);
                // we can't find a child or this child is checked.
                if (elm == null || elm == levelQ[curBias + 1]) {
                    // there is no child on our way, need to go back, until we find next branch to seek
                    while (--curBias > 0) {
                        elm = fGoNext(levelQ[curBias]);
                        if (elm) {
                            levelQ[curBias] = elm;
                            break;
                        }
                    }

                    if (curBias == 0) {
                        // we've reached to root of DOM tree
                        bLoop = false;
                    }
                    break;
 
                } else {
                    levelQ[++curBias] = elm;
                }
            }
        } else {
            elm = fGoNext(elm);
            if (!elm) {
                // there is no sibling, go back to next branch to get more
                curBias--;
            }
        }

        if (curBias == totalBias) {
            if (this._isOk(elm)) {
                bLoop = false;
            } else {
                // there is no more valid child in this branch, go back one level to see if we can find more.
                curBias--;
            }
        }
    } while (bLoop);

    if (curBias == totalBias) {
        return {elmQ:levelQ, e:elm};
    }
    return null;
}
