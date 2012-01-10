
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

com.zuki.common.domNav.prototype.init = function(elm) {
    this._trc = [];
    this._isOk = this._isVisible;
    this._idx = this._trc.length - 1;
}

com.zuki.common.domNav.prototype.next = function(op) {
}

com.zuki.common.domNav.prototype.prev = function(op) {
}

com.zuki.common.domNav.prototype.prevLevel = function() {
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
            var bias = this._mergeTrace(this._trc, ret.trace)
            this._trc = ret.elmQ;
            this._idx = xxxxxxxxxxxxxxx;
        }
    } else if (this._idx < this._trc.length) {
        this._idx++;
    } else {
        throw "Unknown case";
    }

    return this._trc[this._idx];
}

com.zuki.common.domNav._mergeTrace(src, target) {
    // TODO: give the caller how to re-mapping their original index
    var i, j, k;
    var elm;
    var rangeFrom = {b:[-1. -1], e:[-1, -1]};
    var stopLoop = false;

    // find range of overlap
    for (i == 0; i < src.length; i++) {
        elm = src[i];
        for (j = 0; j < target.length; j++) {
            if (target[j] === elm) {
                range.b[0] = range.e[0] = i;
                range.b[1] = range.e[1] = j;

                k = 1;
                while ((i + k) < src.length && (j + k) < target.length) {
                    if (src[i + k] === target[j + k]) {
                        range.e[0] = i + k;
                        range.e[1] = j + k;
                    } else {
                        break;
                    }
                    k++;
                }
                stopLoop = true;
                break;
            }
        }

        if (stopLoop == true) break;
    }

    if (range.b[0] == -1 && range.b[1] == -1 && range.e[0] == -1 && range.e[1] == -1) {
        // nothing in common
        target = src;
    } else if (range.b[0] == -1 || range.b[1] == -1 || range.e[0] == -1 || range.e[1] == -1) {
        throw "Unknown case";
    } else {
        // need to merge, favor target in array-begin(because they represent top of tree)
        // and favor src in other side.
        var tmp = (range.b[0] < range.b[1]) ? target.slice(0, range.b[1] - 1) : [];
        target = tmp.concat(src.slice(range.b[0]));
        return range.b[1] - range.b[0]; // return index bias 
    }

    return -1;
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
        // TODO: clear Q that below elm, they are not cleared during traversing
        return {e:elm, b:curBias, trace:Q};
    }
    return null;
}
