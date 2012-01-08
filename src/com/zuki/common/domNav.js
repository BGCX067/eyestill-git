
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

com.zuki.common.domNav.prototype._isVisible = function(elm) {
    if (!elm) return false;
    if (elm.nodeType != 1) return false; // element node only
    if (elm.offsetWidth == 0 || elm.offsetHeight == 0) return false;
    return true;
}

com.zuki.common.domNav.prototype.init = function(elm, isOk) {
    if (!elm || (isOk && typeof isOk != "function")) {
        this._root = null;
        this._stk = [];
    } else {
        this._root = elm;
        this._stk = [elm];
        if (isOk) {
            this._isOk = isOk;
        } else {
            this._isOk = this._isVisible;
        }
    }
    this._idx = this._stk.length - 1;
    return elm;
}

com.zuki.common.domNav.prototype.next = function(op) {
    if (!this._root) return null;

    ret = this._levelBias(this._stk, this._idx, 0,
        function(elm) { return elm.firstElementChild; },
        function(elm) { return elm.nextElementSibling; }
    );
    if (ret) {
        this._stk = ret.elmQ;
        this._idx = ret.idx;
    }

    return this._stk[this._idx];
}

com.zuki.common.domNav.prototype.prev = function(op) {
    if (!this._root) return null;

    ret = this._levelBias(this._stk, this._idx, 0,
        function(elm) { return elm.lastElementChild; },
        function(elm) { return elm.previousElementSibling; }
    );
    if (ret) {
        this._stk = ret.elmQ;
        this._idx = ret.idx;
    }

    return this._stk[this._idx];
}

com.zuki.common.domNav.prototype.prevLevel = function() {
    if (!this._root) return null;
    if (this._idx < 0) {
        return this._root;
    }

    if (this._idx > 0) {
        this._idx--;
    }
    return this._stk[this._idx];
}

com.zuki.common.domNav.prototype.nextLevel = function() {
    if (!this._root) return null;
    if (this._idx < 0) {
        return this._root;
    }

    if (this._idx == this._stk.length - 1) {
        // keep the size and position of current element for later comparison
        var rec = this._stk[this._idx].getBoundingClientRect();
        var s = {};
        s.w = Math.round(rec.width);
        s.h = Math.round(rec.height);

        ret = this._levelBias(this._stk[this._idx], true,
            function(e, b) {
                var rec = {nextBranch: false, found: false, stop: false};
                if (b >= 1) {
                    // check if we want it
                    var recIn = e.getBoundingClientRect();
                    if (s.w != Math.round(recIn.width) || s.h != Math.round(rectIn.height)) {
                        ret.found = true;
                    }
                }
                return ret;
            }
        );

        if (ret) {
            this._stk = ret.elmQ;
            this._idx = ret.idx;
        }
    } else if (this._idx < this._stk.length) {
        this._idx++;
    } else {
        throw "Unknown case";
    }

    return this._stk[this._idx];
}

com.zuki.common.domNav._navigate(e, bForward, f) {
    if (typeof f != "function") throw "Not a function";
    if (elm == null) throw "elm can't be null";

    var fFirst = null;
    var fNext = null;
    // create traversing function
    if (bForward == true) {
        fDown = function (elm) { return elm.firstElementChild; }
        fNext = function (elm) { return elm.nextElementSibling; }
    } else {
        fDown = function (elm) { return elm.lastElementChild; }
        fNext = function (elm) { return elm.previousElementChild; }
    }

    var Q = [];
    // build a queue for all parent
    var p = e;
    do {
        Q.unshift(p);
        p = p.parentNode;
    } while (p);

    // this variable represents the preferred index in queue
    var oriBias = Q.length - 1;
    var curBias = oriBias;
    var ret = null;

    var bLoop = false;
    var nextBranch = false;
    // Depth-first search
    do {
        // proceeding the navigation
        if (nextBranch == false) {
            elm = fDown(elm);

            if (elm == null || (Q.length > curBias + 1 && elm === Q[curBias]) {
                // make sure we won't put this elm in other condition
                elm = null;
                nextBranch = true;
                continue;
            } else {
                curBias++;
                // put this elm into Q
                if (curBias >= Q.length) {
                    Q.push_back(elm);
                } else {
                    Q[curBias] = elm;
                }
            }
        } else {
            // seek to next available branch
            elm = null;
            while (curBias > 1) {
                curBias--;
                elm = fNext(Q[curBias]);
                if (elm != null) {
                    Q[curBias] = elm;
                    break;
                }
            }
            nextBranch = false;

            // we can't find more branch to seek
            if (elm == null) {
                bLoop = false;
                break;
            }
        }

        // check this item
        ret = f(elm, curBias - oriBias);
        if (ret.found == true) {
            // found!
            bLoop = false;
            break;
        } else if (ret.stop == true) {
            bLoop = false;
        } else if (ret.next_branch == true) {
            // go to next branch
            nextBranch = true;
            continue;
        }
    } while (bLoop == true);

    // check if we found something
    if (ret.found == true) {
        return {e:elm, b:curBias};
    }
    return null;
}

com.zuki.common.domNav.prototype._ = function(bias, fCheckFirst, fGoNext) {
    if (typeof bias != "number" || bias < 0) throw "Not a correct integer";
    if (typeof QIdx != "number" || QIdx < 0 || QIdx >= Q.length) throw "Not a correct integer";
    if (typeof fCheckFirst != "function") throw "Not a function";
    if (typeof fGoNext != "function") throw "Not a function";

    // we need to find next visible child,
    // or child of the next sibling of current parent.
    var totalBias = bias + Q.length - 1;
    var curBias = QIdx;
    var elm = Q[QIdx];
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
                    while (curBias > 0) {
                        curBias--;
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
            } else {
                levelQ[curBias] = elm;
            }
        }

        if (curBias == totalBias) {
            if (this._isOk(elm)) {
                bLoop = false;
            }
        }
    } while (bLoop);

    if (curBias == totalBias) {
        return {elmQ:levelQ, e:elm, idx:curBias};
    }
    return null;
}
