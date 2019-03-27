
let pub = {};
let priv = {};

pub.StringBuilder = function(str, strend) {

    if (strend) {
        priv.pre = str;
        priv.end = strend;
        priv.buffer = [];
        priv.length = priv.buffer.length + str.length + strend.length;
    } else {
        priv.buffer = str ? [str] : [];
        priv.pre = "";
        priv.end = "";
        priv.length = priv.buffer.length;
    }
    priv.hold = false;

    priv.holdBuffer = [];

    this.recycle = function (action) { //alias
        this.release(action,true);
    };

    this.release = function(action, recycle){
        if(!priv.hold) return this; //do nada
        if(action[0].toLowerCase() === 'p'){//prepend
            if(priv.postHold) priv.buffer.unshift(priv.postHold);
            for(var i = priv.holdBuffer.length; i--;){
                priv.buffer.unshift(priv.holdBuffer[i]);
            }
            if(priv.postHold) priv.buffer.unshift(priv.preHold);
        } else {
            if(priv.postHold) priv.buffer.push(priv.preHold);
            let len = priv.holdBuffer.length;
            for(let i = 0; i < len; i++)
                priv.buffer.push(priv.holdBuffer[i]);

            if(priv.postHold) priv.buffer.push(priv.postHold);
        }


        priv.length = priv.buffer.length + priv.preHold.length + priv.postHold.length;
        priv.holdBuffer = [];
        if(!recycle) {
            priv.preHold = '';
            priv.postHold = '';
            priv.hold = false;
        }
    };

    this.flush = function(){ //reset holdBuffer to start over
        if(!priv.hold) return this; //do nada
        else{
            if(priv.postHold) priv.postHold = ''; priv.preHold = '';
            priv.length -= priv.holdBuffer.join('').length;
            priv.holdBuffer = [];
        }
    };

    this.hold = function(str,strend){
        priv.hold = true;
        if(strend){
            priv.preHold = str;
            priv.postHold = strend;
        }else {
            this.append(str);
        }
    };

    this.append = function(str) {
        if(priv.hold){
            priv.length += str.length;
            priv.holdBuffer.push(str);
        }else{
            priv.length += str.length;
            priv.buffer.push(str);
        }

        return this;
    };

    this.prepend = function(str) {
        if(priv.hold){
            priv.length += str.length;
            priv.holdBuffer.unshift(str);
        }else {
            priv.length += str.length;
            priv.buffer.unshift(str);
        }
        return this;
    };

    this.toString = function(opt, clear, keepPreEnd) {
        var rval,
            pre = "",
            post = "",
            clear = false;

        if (priv.end) {
            pre = priv.pre;
            post = priv.end;
        }
        if (opt === true || clear) {
            if (opt !== true) {
                rval = priv.buffer.join(opt);
                clear = true;
            } else {
                rval = priv.buffer.join("");
                clear = true;
            }
        } else if (opt) {
            rval = priv.buffer.join(opt);
        } else {
            rval = priv.buffer.join("");
        }

        rval = pre + rval + post;

        if (clear) priv.clear(keepPreEnd);
        else priv.length = rval.length;

        //remove contents of hold buffer
        priv.holdBuffer = [];
        priv.hold = false;

        return rval;
    };

    priv.clear = function(keepPreEnd) {

        priv.buffer = [];
        priv.holdBuffer = [];
        pub.hold = false;

        if (keepPreEnd === true) {
            priv.length = priv.pre.length + priv.end.length;
        } else {
            priv.pre = "";
            priv.end = "";
            priv.length = 0;
        }
    };

};

module.exports = pub.StringBuilder;