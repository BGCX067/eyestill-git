
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

com.zuki.common.domNav.prototype.init = function() {
    this._trc = [];
    this._isOk = this._isVisible;
    this._idx = this._trc.length - 1;
}

com.zuki.common.domNav.prototype.next = function() {
    if (this._idx < 0 || this._idx >= this._trc.length) {
        throw "Invalid this._idx";
    } else if (this._idx != 0 ) {
        // TODO: this code doesn't work, we didn't utilize existing trace during traverse.
        var ret = this._navigate_call_helper(
            this._trc[this._idx - 1],
            true,
            this._trc,
            {smaller_than:Number.MIN_VALUE, bigger_than:1}
        );
        if (ret) {
            this._trc = ret.trace;
            this._idx = ret.b;
        }
    } else {
        // root case
    }

    return this._trc[this._idx];
}

com.zuki.common.domNav.prototype.prev = function() {
    if (this._idx < 0 || this._idx >= this._trc.length) {
        throw "Invalid this._idx";
    } else if (this._idx != 0 ) {
        // TODO: this code doesn't work, we didn't utilize existing trace during traverse.
        var ret = this._navigate_call_helper(
            this._trc[this._idx - 1],
            false,
            this._trc,
            {smaller_than:Number.MIN_VALUE, bigger_than:1}
        );
        if (ret) {
            this._trc = ret.trace;
            this._idx = ret.b;
        }
    } else {
        // root case
    }

    return this._trc[this._idx];
}

com.zuki.common.domNav.prototype.prevLevel = function() {
    if (this._idx < 0) {
        throw "Invalid this._idx";
    } else if (this._idx >= 0 && this._idx < this._trc.length) {
        if (this._idx > 0) this._idx--;
    } else {
        throw "Invalid range of this._idx";
    }

    return this._trc[this._idx];
}

com.zuki.common.domNav.prototype.nextLevel = function() {
    if (this._idx < 0 || this._idx >= this._trc.length) {
        throw "Invalid this._idx";
    } else if (this._idx == this._trc.length - 1) {
        // keep the size and position of current element for later comparison
        var ret = this._navigate_call_helper(
            this._trc[this._idx],
            true,
            this._trc,
            {smaller_than:Number.MIN_VALUE, bigger_than:1}
        );
        if (ret) {
            this._trc = ret.trace;
            this._idx = ret.b;
        }
    } else if (this._idx < this._trc.length) {
        if (this._idx < this._trc.length -1) this._idx++;
    } else {
        throw "Unknown case";
    }

    return this._trc[this._idx];
}
com.zuki.common.domNav._navigate_call_helper(e, bForward, inQ, range_of_bias) {
    var rec = e.getBoundingClientRect();
    var s = {};
    s.w = Math.round(rec.width);
    s.h = Math.round(rec.height);

    ret = this._navigate(e, bForward,
        function(e, b) {
            var rec = {nextBranch: false, found: false, stop: false};
            if (range_of_bias.smaller_than == Number.MIN_VALUE || b <= range_of_bias.smaller_than) {
                if (range_of_bias.bigger_than == Number.MAX_VALUE || b >= range_of_bias.bigger_than) {
                    // check if we want it
                    var recIn = e.getBoundingClientRect();
                    if (s.w != Math.round(recIn.width) || s.h != Math.round(rectIn.height)) {
                        ret.found = true;
                    }
                }
            }
            return ret;
        },
        inQ 
    );

    return ret;
}

com.zuki.common.domNav._navigate(e, bForward, f, inQ) {
    if (typeof f != "function") throw "Not a function";
    if (e == null) throw "elm can't be null";

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

    // build initial element-queue
    var Q = [e];
    var oriBias = 0;
    if (inQ != null) {
        var bFound = false;
        //  check if e existin in inQ
        for (; oriBias < inQ.length; oriBias++) {
            if (inQ[oriBias] === e) {
                bFound = true;
                break;
            }
        }
        if (bFound) {
            Q = inQ;
        } else {
            return null;
        }
    }
    
    // build a queue for all parents
    var p = Q[0].parentNode;
    while (p) {
        oriBias++;
        Q.unshift(p);
        p = p.parentNode;
    }

    // this variable represents the preferred index in queue
    var curBias = oriBias;
    var ret = null;

    var bLoop = false;
    var nextBranch = false;
    var elm = e;
    // Depth-first search
    do {
        // proceeding the navigation
        if (nextBranch == false) {
            // we may need to utilize the existing trace
            if (curBias + 1 < Q.length && Q[curBias + 1].parentNode === elm) {
                elm = fNext(Q[curBias + 1]);
            } else {
                elm = fDown(Q[curBias]);
            }

            if (elm == null) {
                // make sure we won't put this elm in other condition
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
        // TODO: pass range of bias during this traverse to checking-function
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
        // clear Q that below elm, they are not cleared during traversing
        for (var i = curBias + 1; i < Q.length) {
            if (Q[i].parentNode !== Q[i - 1]) {
                Q = Q.slice(0, i);
                break;
            }
        }
        return {b:curBias, trace:Q};
    }
    return null;
}
