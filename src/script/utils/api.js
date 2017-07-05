// promise.js
!function(e){function n(){}function t(e,n){return function(){e.apply(n,arguments)}}function o(e){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],s(e,this)}function i(e,n){for(;3===e._state;)e=e._value;return 0===e._state?void e._deferreds.push(n):(e._handled=!0,void o._immediateFn(function(){var t=1===e._state?n.onFulfilled:n.onRejected;if(null===t)return void(1===e._state?r:u)(n.promise,e._value);var o;try{o=t(e._value)}catch(i){return void u(n.promise,i)}r(n.promise,o)}))}function r(e,n){try{if(n===e)throw new TypeError("A promise cannot be resolved with itself.");if(n&&("object"==typeof n||"function"==typeof n)){var i=n.then;if(n instanceof o)return e._state=3,e._value=n,void f(e);if("function"==typeof i)return void s(t(i,n),e)}e._state=1,e._value=n,f(e)}catch(r){u(e,r)}}function u(e,n){e._state=2,e._value=n,f(e)}function f(e){2===e._state&&0===e._deferreds.length&&o._immediateFn(function(){e._handled||o._unhandledRejectionFn(e._value)});for(var n=0,t=e._deferreds.length;n<t;n++)i(e,e._deferreds[n]);e._deferreds=null}function c(e,n,t){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof n?n:null,this.promise=t}function s(e,n){var t=!1;try{e(function(e){t||(t=!0,r(n,e))},function(e){t||(t=!0,u(n,e))})}catch(o){if(t)return;t=!0,u(n,o)}}var a=setTimeout;o.prototype["catch"]=function(e){return this.then(null,e)},o.prototype.then=function(e,t){var o=new this.constructor(n);return i(this,new c(e,t,o)),o},o.all=function(e){var n=Array.prototype.slice.call(e);return new o(function(e,t){function o(r,u){try{if(u&&("object"==typeof u||"function"==typeof u)){var f=u.then;if("function"==typeof f)return void f.call(u,function(e){o(r,e)},t)}n[r]=u,0===--i&&e(n)}catch(c){t(c)}}if(0===n.length)return e([]);for(var i=n.length,r=0;r<n.length;r++)o(r,n[r])})},o.resolve=function(e){return e&&"object"==typeof e&&e.constructor===o?e:new o(function(n){n(e)})},o.reject=function(e){return new o(function(n,t){t(e)})},o.race=function(e){return new o(function(n,t){for(var o=0,i=e.length;o<i;o++)e[o].then(n,t)})},o._immediateFn="function"==typeof setImmediate&&function(e){setImmediate(e)}||function(e){a(e,0)},o._unhandledRejectionFn=function(e){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)},o._setImmediateFn=function(e){o._immediateFn=e},o._setUnhandledRejectionFn=function(e){o._unhandledRejectionFn=e},"undefined"!=typeof module&&module.exports?module.exports=o:e.Promise||(e.Promise=o)}(this);
// fetch.js
;(function(o){if(o.fetch){return}var l={searchParams:"URLSearchParams" in o,iterable:"Symbol" in o&&"iterator" in Symbol,blob:"FileReader" in o&&"Blob" in o&&(function(){try{new Blob();return true}catch(x){return false}})(),formData:"FormData" in o,arrayBuffer:"ArrayBuffer" in o};if(l.arrayBuffer){var m=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"];var s=function(x){return x&&DataView.prototype.isPrototypeOf(x)};var b=ArrayBuffer.isView||function(x){return x&&m.indexOf(Object.prototype.toString.call(x))>-1}}function i(x){if(typeof x!=="string"){x=String(x)}if(/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(x)){throw new TypeError("Invalid character in header field name")}return x.toLowerCase()}function j(x){if(typeof x!=="string"){x=String(x)}return x}function e(x){var y={next:function(){var z=x.shift();return{done:z===undefined,value:z}}};if(l.iterable){y[Symbol.iterator]=function(){return y}}return y}function p(x){this.map={};if(x instanceof p){x.forEach(function(z,y){this.append(y,z)},this)}else{if(Array.isArray(x)){x.forEach(function(y){this.append(y[0],y[1])},this)}else{if(x){Object.getOwnPropertyNames(x).forEach(function(y){this.append(y,x[y])},this)}}}}p.prototype.append=function(y,z){y=i(y);z=j(z);var x=this.map[y];this.map[y]=x?x+","+z:z};p.prototype["delete"]=function(x){delete this.map[i(x)]};p.prototype.get=function(x){x=i(x);return this.has(x)?this.map[x]:null};p.prototype.has=function(x){return this.map.hasOwnProperty(i(x))};p.prototype.set=function(x,y){this.map[i(x)]=j(y)};p.prototype.forEach=function(z,x){for(var y in this.map){if(this.map.hasOwnProperty(y)){z.call(x,this.map[y],y,this)}}};p.prototype.keys=function(){var x=[];this.forEach(function(z,y){x.push(y)});return e(x)};p.prototype.values=function(){var x=[];this.forEach(function(y){x.push(y)});return e(x)};p.prototype.entries=function(){var x=[];this.forEach(function(z,y){x.push([y,z])});return e(x)};if(l.iterable){p.prototype[Symbol.iterator]=p.prototype.entries}function f(x){if(x.bodyUsed){return Promise.reject(new TypeError("Already read"))}x.bodyUsed=true}function h(x){return new Promise(function(z,y){x.onload=function(){z(x.result)};x.onerror=function(){y(x.error)}})}function c(y){var x=new FileReader();var z=h(x);x.readAsArrayBuffer(y);return z}function d(y){var x=new FileReader();var z=h(x);x.readAsText(y);return z}function u(y){var x=new Uint8Array(y);var A=new Array(x.length);for(var z=0;z<x.length;z++){A[z]=String.fromCharCode(x[z])}return A.join("")}function k(y){if(y.slice){return y.slice(0)}else{var x=new Uint8Array(y.byteLength);x.set(new Uint8Array(y));return x.buffer}}function q(){this.bodyUsed=false;this._initBody=function(x){this._bodyInit=x;if(!x){this._bodyText=""}else{if(typeof x==="string"){this._bodyText=x}else{if(l.blob&&Blob.prototype.isPrototypeOf(x)){this._bodyBlob=x}else{if(l.formData&&FormData.prototype.isPrototypeOf(x)){this._bodyFormData=x}else{if(l.searchParams&&URLSearchParams.prototype.isPrototypeOf(x)){this._bodyText=x.toString()}else{if(l.arrayBuffer&&l.blob&&s(x)){this._bodyArrayBuffer=k(x.buffer);this._bodyInit=new Blob([this._bodyArrayBuffer])}else{if(l.arrayBuffer&&(ArrayBuffer.prototype.isPrototypeOf(x)||b(x))){this._bodyArrayBuffer=k(x)}else{throw new Error("unsupported BodyInit type")}}}}}}}if(!this.headers.get("content-type")){if(typeof x==="string"){this.headers.set("content-type","text/plain;charset=UTF-8")}else{if(this._bodyBlob&&this._bodyBlob.type){this.headers.set("content-type",this._bodyBlob.type)}else{if(l.searchParams&&URLSearchParams.prototype.isPrototypeOf(x)){this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8")}}}}};if(l.blob){this.blob=function(){var x=f(this);if(x){return x}if(this._bodyBlob){return Promise.resolve(this._bodyBlob)}else{if(this._bodyArrayBuffer){return Promise.resolve(new Blob([this._bodyArrayBuffer]))}else{if(this._bodyFormData){throw new Error("could not read FormData body as blob")}else{return Promise.resolve(new Blob([this._bodyText]))}}}};this.arrayBuffer=function(){if(this._bodyArrayBuffer){return f(this)||Promise.resolve(this._bodyArrayBuffer)}else{return this.blob().then(c)}}}this.text=function(){var x=f(this);if(x){return x}if(this._bodyBlob){return d(this._bodyBlob)}else{if(this._bodyArrayBuffer){return Promise.resolve(u(this._bodyArrayBuffer))}else{if(this._bodyFormData){throw new Error("could not read FormData body as text")}else{return Promise.resolve(this._bodyText)}}}};if(l.formData){this.formData=function(){return this.text().then(n)}}this.json=function(){return this.text().then(JSON.parse)};return this}var t=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];function v(y){var x=y.toUpperCase();return(t.indexOf(x)>-1)?x:y}function r(y,z){z=z||{};var x=z.body;if(y instanceof r){if(y.bodyUsed){throw new TypeError("Already read")}this.url=y.url;this.credentials=y.credentials;
if(!z.headers){this.headers=new p(y.headers)}this.method=y.method;this.mode=y.mode;if(!x&&y._bodyInit!=null){x=y._bodyInit;y.bodyUsed=true}}else{this.url=String(y)}this.credentials=z.credentials||this.credentials||"omit";if(z.headers||!this.headers){this.headers=new p(z.headers)}this.method=v(z.method||this.method||"GET");this.mode=z.mode||this.mode||null;this.referrer=null;if((this.method==="GET"||this.method==="HEAD")&&x){throw new TypeError("Body not allowed for GET or HEAD requests")}this._initBody(x)}r.prototype.clone=function(){return new r(this,{body:this._bodyInit})};function n(x){var y=new FormData();x.trim().split("&").forEach(function(z){if(z){var B=z.split("=");var A=B.shift().replace(/\+/g," ");var C=B.join("=").replace(/\+/g," ");y.append(decodeURIComponent(A),decodeURIComponent(C))}});return y}function w(z){var y=new p();var x=z.replace(/\r?\n[\t ]+/g," ");x.split(/\r?\n/).forEach(function(A){var D=A.split(":");var B=D.shift().trim();if(B){var C=D.join(":").trim();y.append(B,C)}});return y}q.call(r.prototype);function a(y,x){if(!x){x={}}this.type="default";this.status=x.status===undefined?200:x.status;this.ok=this.status>=200&&this.status<300;this.statusText="statusText" in x?x.statusText:"OK";this.headers=new p(x.headers);this.url=x.url||"";this._initBody(y)}q.call(a.prototype);a.prototype.clone=function(){return new a(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new p(this.headers),url:this.url})};a.error=function(){var x=new a(null,{status:0,statusText:""});x.type="error";return x};var g=[301,302,303,307,308];a.redirect=function(y,x){if(g.indexOf(x)===-1){throw new RangeError("Invalid status code")}return new a(null,{status:x,headers:{location:y}})};o.Headers=p;o.Request=r;o.Response=a;o.fetch=function(x,y){return new Promise(function(B,A){var z=new r(x,y);var C=new XMLHttpRequest();C.onload=function(){var E={status:C.status,statusText:C.statusText,headers:w(C.getAllResponseHeaders()||"")};E.url="responseURL" in C?C.responseURL:E.headers.get("X-Request-URL");var D="response" in C?C.response:C.responseText;B(new a(D,E))};C.onerror=function(){A(new TypeError("Network request failed"))};C.ontimeout=function(){A(new TypeError("Network request failed"))};C.open(z.method,z.url,true);if(z.credentials==="include"){C.withCredentials=true}else{if(z.credentials==="omit"){C.withCredentials=false}}if("responseType" in C&&l.blob){C.responseType="blob"}z.headers.forEach(function(E,D){C.setRequestHeader(D,E)});C.send(typeof z._bodyInit==="undefined"?null:z._bodyInit)})};o.fetch.polyfill=true})(typeof self!=="undefined"?self:this);
/*
 * APICloud JavaScript Library
 * Copyright (c) 2014 apicloud.com
 */
(function(window){
    var u = {};
    var isAndroid = (/android/gi).test(navigator.appVersion);
    var uzStorage = function(){
        var ls = window.localStorage;
        if(isAndroid && window.os){
           ls = os.localStorage();
        }
        return ls;
    };
    function parseArguments(url, data, fnSuc, dataType) {
        if (typeof(data) == 'function') {
            dataType = fnSuc;
            fnSuc = data;
            data = undefined;
        }
        if (typeof(fnSuc) != 'function') {
            dataType = fnSuc;
            fnSuc = undefined;
        }
        return {
            url: url,
            data: data,
            fnSuc: fnSuc,
            dataType: dataType
        };
    }
    u.isAndroid = isAndroid;
    u.trim = function(str){
        if(String.prototype.trim){
            return str == null ? "" : String.prototype.trim.call(str);
        }else{
            return str.replace(/(^\s*)|(\s*$)/g, "");
        }
    };
    u.trimAll = function(str){
        return str.replace(/\s*/g,'');
    };
    u.isElement = function(obj){
        return !!(obj && obj.nodeType == 1);
    };
    u.isArray = function(obj){
        if(Array.isArray){
            return Array.isArray(obj);
        }else{
            return obj instanceof Array;
        }
    };
    u.isEmptyObject = function(obj){
        if(JSON.stringify(obj) === '{}'){
            return true;
        }
        return false;
    };
    u.addEvt = function(el, name, fn, useCapture){
        if(!u.isElement(el)){
            console.warn('$api.addEvt Function need el param, el param must be DOM Element');
            return;
        }
        useCapture = useCapture || false;
        if(el.addEventListener) {
            el.addEventListener(name, fn, useCapture);
        }
    };
    u.rmEvt = function(el, name, fn, useCapture){
        if(!u.isElement(el)){
            console.warn('$api.rmEvt Function need el param, el param must be DOM Element');
            return;
        }
        useCapture = useCapture || false;
        if (el.removeEventListener) {
            el.removeEventListener(name, fn, useCapture);
        }
    };
    u.one = function(el, name, fn, useCapture){
        if(!u.isElement(el)){
            console.warn('$api.one Function need el param, el param must be DOM Element');
            return;
        }
        useCapture = useCapture || false;
        var that = this;
        var cb = function(){
            fn && fn();
            that.rmEvt(el, name, cb, useCapture);
        };
        that.addEvt(el, name, cb, useCapture);
    };
    u.dom = function(el, selector){
        if(arguments.length === 1 && typeof arguments[0] == 'string'){
            if(document.querySelector){
                return document.querySelector(arguments[0]);
            }
        }else if(arguments.length === 2){
            if(el.querySelector){
                return el.querySelector(selector);
            }
        }
    };
    u.domAll = function(el, selector){
        if(arguments.length === 1 && typeof arguments[0] == 'string'){
            if(document.querySelectorAll){
                return document.querySelectorAll(arguments[0]);
            }
        }else if(arguments.length === 2){
            if(el.querySelectorAll){
                return el.querySelectorAll(selector);
            }
        }
    };
    u.byId = function(id){
        return document.getElementById(id);
    };
    u.first = function(el, selector){
        if(arguments.length === 1){
            if(!u.isElement(el)){
                console.warn('$api.first Function need el param, el param must be DOM Element');
                return;
            }
            return el.children[0];
        }
        if(arguments.length === 2){
            return this.dom(el, selector+':first-child');
        }
    };
    u.last = function(el, selector){
        if(arguments.length === 1){
            if(!u.isElement(el)){
                console.warn('$api.last Function need el param, el param must be DOM Element');
                return;
            }
            var children = el.children;
            return children[children.length - 1];
        }
        if(arguments.length === 2){
            return this.dom(el, selector+':last-child');
        }
    };
    u.eq = function(el, index){
        return this.dom(el, ':nth-child('+ index +')');
    };
    u.not = function(el, selector){
        return this.domAll(el, ':not('+ selector +')');
    };
    u.prev = function(el){
        if(!u.isElement(el)){
            console.warn('$api.prev Function need el param, el param must be DOM Element');
            return;
        }
        var node = el.previousSibling;
        if(node.nodeType && node.nodeType === 3){
            node = node.previousSibling;
            return node;
        }
    };
    u.next = function(el){
        if(!u.isElement(el)){
            console.warn('$api.next Function need el param, el param must be DOM Element');
            return;
        }
        var node = el.nextSibling;
        if(node.nodeType && node.nodeType === 3){
            node = node.nextSibling;
            return node;
        }
    };
    u.closest = function(el, selector){
        if(!u.isElement(el)){
            console.warn('$api.closest Function need el param, el param must be DOM Element');
            return;
        }
        var doms, targetDom;
        var isSame = function(doms, el){
            var i = 0, len = doms.length;
            for(i; i<len; i++){
                if(doms[i].isEqualNode(el)){
                    return doms[i];
                }
            }
            return false;
        };
        var traversal = function(el, selector){
            doms = u.domAll(el.parentNode, selector);
            targetDom = isSame(doms, el);
            while(!targetDom){
                el = el.parentNode;
                if(el != null && el.nodeType == el.DOCUMENT_NODE){
                    return false;
                }
                traversal(el, selector);
            }

            return targetDom;
        };

        return traversal(el, selector);
    };
    u.contains = function(parent,el){
        var mark = false;
        if(el === parent){
            mark = true;
            return mark;
        }else{
            do{
                el = el.parentNode;
                if(el === parent){
                    mark = true;
                    return mark;
                }
            }while(el === document.body || el === document.documentElement);

            return mark;
        }

    };
    u.remove = function(el){
        if(el && el.parentNode){
            el.parentNode.removeChild(el);
        }
    };
    u.attr = function(el, name, value){
        if(!u.isElement(el)){
            console.warn('$api.attr Function need el param, el param must be DOM Element');
            return;
        }
        if(arguments.length == 2){
            return el.getAttribute(name);
        }else if(arguments.length == 3){
            el.setAttribute(name, value);
            return el;
        }
    };
    u.removeAttr = function(el, name){
        if(!u.isElement(el)){
            console.warn('$api.removeAttr Function need el param, el param must be DOM Element');
            return;
        }
        if(arguments.length === 2){
            el.removeAttribute(name);
        }
    };
    u.hasCls = function(el, cls){
        if(!u.isElement(el)){
            console.warn('$api.hasCls Function need el param, el param must be DOM Element');
            return;
        }
        if(el.className.indexOf(cls) > -1){
            return true;
        }else{
            return false;
        }
    };
    u.addCls = function(el, cls){
        if(!u.isElement(el)){
            console.warn('$api.addCls Function need el param, el param must be DOM Element');
            return;
        }
        if('classList' in el){
            el.classList.add(cls);
        }else{
            var preCls = el.className;
            var newCls = preCls +' '+ cls;
            el.className = newCls;
        }
        return el;
    };
    u.removeCls = function(el, cls){
        if(!u.isElement(el)){
            console.warn('$api.removeCls Function need el param, el param must be DOM Element');
            return;
        }
        if('classList' in el){
            el.classList.remove(cls);
        }else{
            var preCls = el.className;
            var newCls = preCls.replace(cls, '');
            el.className = newCls;
        }
        return el;
    };
    u.toggleCls = function(el, cls){
        if(!u.isElement(el)){
            console.warn('$api.toggleCls Function need el param, el param must be DOM Element');
            return;
        }
       if('classList' in el){
            el.classList.toggle(cls);
        }else{
            if(u.hasCls(el, cls)){
                u.removeCls(el, cls);
            }else{
                u.addCls(el, cls);
            }
        }
        return el;
    };
    u.val = function(el, val){
        if(!u.isElement(el)){
            console.warn('$api.val Function need el param, el param must be DOM Element');
            return;
        }
        if(arguments.length === 1){
            switch(el.tagName){
                case 'SELECT':
                    var value = el.options[el.selectedIndex].value;
                    return value;
                    break;
                case 'INPUT':
                    return el.value;
                    break;
                case 'TEXTAREA':
                    return el.value;
                    break;
            }
        }
        if(arguments.length === 2){
            switch(el.tagName){
                case 'SELECT':
                    el.options[el.selectedIndex].value = val;
                    return el;
                    break;
                case 'INPUT':
                    el.value = val;
                    return el;
                    break;
                case 'TEXTAREA':
                    el.value = val;
                    return el;
                    break;
            }
        }

    };
    u.prepend = function(el, html){
        if(!u.isElement(el)){
            console.warn('$api.prepend Function need el param, el param must be DOM Element');
            return;
        }
        el.insertAdjacentHTML('afterbegin', html);
        return el;
    };
    u.append = function(el, html){
        if(!u.isElement(el)){
            console.warn('$api.append Function need el param, el param must be DOM Element');
            return;
        }
        el.insertAdjacentHTML('beforeend', html);
        return el;
    };
    u.before = function(el, html){
        if(!u.isElement(el)){
            console.warn('$api.before Function need el param, el param must be DOM Element');
            return;
        }
        el.insertAdjacentHTML('beforebegin', html);
        return el;
    };
    u.after = function(el, html){
        if(!u.isElement(el)){
            console.warn('$api.after Function need el param, el param must be DOM Element');
            return;
        }
        el.insertAdjacentHTML('afterend', html);
        return el;
    };
    u.html = function(el, html){
        if(!u.isElement(el)){
            console.warn('$api.html Function need el param, el param must be DOM Element');
            return;
        }
        if(arguments.length === 1){
            return el.innerHTML;
        }else if(arguments.length === 2){
            el.innerHTML = html;
            return el;
        }
    };
    u.text = function(el, txt){
        if(!u.isElement(el)){
            console.warn('$api.text Function need el param, el param must be DOM Element');
            return;
        }
        if(arguments.length === 1){
            return el.textContent;
        }else if(arguments.length === 2){
            el.textContent = txt;
            return el;
        }
    };
    u.offset = function(el){
        if(!u.isElement(el)){
            console.warn('$api.offset Function need el param, el param must be DOM Element');
            return;
        }
        var sl = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
        var st = Math.max(document.documentElement.scrollTop, document.body.scrollTop);

        var rect = el.getBoundingClientRect();
        return {
            l: rect.left + sl,
            t: rect.top + st,
            w: el.offsetWidth,
            h: el.offsetHeight
        };
    };
    u.css = function(el, css){
        if(!u.isElement(el)){
            console.warn('$api.css Function need el param, el param must be DOM Element');
            return;
        }
        if(typeof css == 'string' && css.indexOf(':') > 0){
            el.style && (el.style.cssText += ';' + css);
        }
    };
    u.cssVal = function(el, prop){
        if(!u.isElement(el)){
            console.warn('$api.cssVal Function need el param, el param must be DOM Element');
            return;
        }
        if(arguments.length === 2){
            var computedStyle = window.getComputedStyle(el, null);
            return computedStyle.getPropertyValue(prop);
        }
    };
    u.jsonToStr = function(json){
        if(typeof json === 'object'){
            return JSON && JSON.stringify(json);
        }
    };
    u.strToJson = function(str){
        if(typeof str === 'string'){
            return JSON && JSON.parse(str);
        }
    };
    u.setStorage = function(key, value){
        if(arguments.length === 2){
            var v = value;
            if(typeof v == 'object'){
                v = JSON.stringify(v);
                v = 'obj-'+ v;
            }else{
                v = 'str-'+ v;
            }
            var ls = uzStorage();
            if(ls){
                ls.setItem(key, v);
            }
        }
    };
    u.getStorage = function(key){
        var ls = uzStorage();
        if(ls){
            var v = ls.getItem(key);
            if(!v){return;}
            if(v.indexOf('obj-') === 0){
                v = v.slice(4);
                return JSON.parse(v);
            }else if(v.indexOf('str-') === 0){
                return v.slice(4);
            }
        }
    };
    u.rmStorage = function(key){
        var ls = uzStorage();
        if(ls && key){
            ls.removeItem(key);
        }
    };
    u.clearStorage = function(){
        var ls = uzStorage();
        if(ls){
            ls.clear();
        }
    };


    /*by king*/
    u.fixIos7Bar = function(el){
        if(!u.isElement(el)){
            console.warn('$api.fixIos7Bar Function need el param, el param must be DOM Element');
            return;
        }
        var strDM = api.systemType;
        if (strDM == 'ios') {
            var strSV = api.systemVersion;
            var numSV = parseInt(strSV,10);
            var fullScreen = api.fullScreen;
            var iOS7StatusBarAppearance = api.iOS7StatusBarAppearance;
            if (numSV >= 7 && !fullScreen && iOS7StatusBarAppearance) {
                el.style.paddingTop = '20px';
            }
        }
    };
    u.fixStatusBar = function(el){
        if(!u.isElement(el)){
            console.warn('$api.fixStatusBar Function need el param, el param must be DOM Element');
            return;
        }
        var sysType = api.systemType;
        if(sysType == 'ios'){
            u.fixIos7Bar(el);
        }else if(sysType == 'android'){
            var ver = api.systemVersion;
            ver = parseFloat(ver);
            if(ver >= 4.4){
                el.style.paddingTop = '25px';
            }
        }
    };
    u.toast = function(title, text, time){
        var opts = {};
        var show = function(opts, time){
            api.showProgress(opts);
            setTimeout(function(){
                api.hideProgress();
            },time);
        };
        if(arguments.length === 1){
            var time = time || 500;
            if(typeof title === 'number'){
                time = title;
            }else{
                opts.title = title+'';
            }
            show(opts, time);
        }else if(arguments.length === 2){
            var time = time || 500;
            var text = text;
            if(typeof text === "number"){
                var tmp = text;
                time = tmp;
                text = null;
            }
            if(title){
                opts.title = title;
            }
            if(text){
                opts.text = text;
            }
            show(opts, time);
        }
        if(title){
            opts.title = title;
        }
        if(text){
            opts.text = text;
        }
        time = time || 500;
        show(opts, time);
    };
    u.post = function(/*url,data,fnSuc,dataType*/){
        var argsToJson = parseArguments.apply(null, arguments);
        var json = {};
        var fnSuc = argsToJson.fnSuc;
        argsToJson.url && (json.url = argsToJson.url);
        argsToJson.data && (json.data = argsToJson.data);
        if(argsToJson.dataType){
            var type = argsToJson.dataType.toLowerCase();
            if (type == 'text'||type == 'json') {
                json.dataType = type;
            }
        }else{
            json.dataType = 'json';
        }
        json.method = 'post';
        api.ajax(json,
            function(ret,err){
                if (ret) {
                    fnSuc && fnSuc(ret);
                }
            }
        );
    };
    u.get = function(/*url,fnSuc,dataType*/){
        var argsToJson = parseArguments.apply(null, arguments);
        var json = {};
        var fnSuc = argsToJson.fnSuc;
        argsToJson.url && (json.url = argsToJson.url);
        //argsToJson.data && (json.data = argsToJson.data);
        if(argsToJson.dataType){
            var type = argsToJson.dataType.toLowerCase();
            if (type == 'text'||type == 'json') {
                json.dataType = type;
            }
        }else{
            json.dataType = 'text';
        }
        json.method = 'get';
        api.ajax(json,
            function(ret,err){
                if (ret) {
                    fnSuc && fnSuc(ret);
                }
            }
        );
    };

/*end*/


/*ex*/
u.statusBarHeight = function(){
  if(!window.api) return 0;
  var sysType = api.systemType;
  if(sysType == 'ios'){
    var strSV = api.systemVersion;
    var numSV = parseInt(strSV,10);
    var fullScreen = api.fullScreen;
    var iOS7StatusBarAppearance = api.iOS7StatusBarAppearance;
    if (numSV >= 7 && !fullScreen && iOS7StatusBarAppearance) {
        return 20;
    }
  }else if(sysType == 'android'){
      var ver = api.systemVersion;
      ver = parseFloat(ver);
      if(ver >= 4.4){
          return 25;
      }
  }
  return 0;
};
u.headerHeight = function(){
  return u.rem2px(0.88)+u.statusBarHeight() + 1;
};
u.rem2px = function(rem){
    rem = rem || 0;
    var fontSize = u.dom("html").style.fontSize.replace("px","");
    return rem*fontSize;
},
u.px2rem = function(px){
    px = px || 0;
    var fontSize = u.dom("html").style.fontSize.replace("px","");
    return px/fontSize;
},
  u.init = function(module){
    var self = this;
    if(!module || typeof module != 'object') return;
    var dom = self.dom("[data-window]");
    if(dom){
      //window
      module.winMain && module.winMain.call(module);
      u.apicloud(module.winApicloud && module.winApicloud.bind(module),module.winWeb && module.winWeb.bind(module));
    }else{
      //frame
      module.frameMain && module.frameMain.call(module);
    }
  };
  window.apiready = function(){
    u._isReady = true;
    for(var i=0;i<u._readyCallback.length;i++){
      u._readyCallback[i]();
    }
  };
  u.isApiCloud = !/^https?:\/\//ig.test(window.location.href);
  u._readyCallback = [];
  u._isReady = false;
  u._resizeFrame = {};
  u._resizeFrameGroup = {};
  u.ready = function(callback){
      var self = this;
      if(!self.isApiCloud){
        u._isReady = true;
        return callback && callback();
      }
      if(self._isReady){
        return callback && callback();
      }
      self._readyCallback.push(callback);
  }
  u._init = function(){
    var self = this;
    window.onresize = function(){
        //当大小发生改变的时候
        var rootSize = document.querySelector("body").clientWidth / 7.5;
        document.querySelector("html").style.fontSize = rootSize+"px";

        window.resizeHiddenFrame = window.resizeHiddenFrame || {};
        //重新配置全屏的frame的高度
        for(var name in self._resizeFrame){
            if(window.api && api.setFrameAttr){
                var opts = self._resizeFrame[name];
                opts.rect.h = Math.ceil(window.innerHeight-opts.header-opts.footer);
                var hidden = window.resizeHiddenFrame[name] || false;
                api.setFrameAttr({
                    hidden:hidden,
                    name:name,
                    rect:opts.rect
                });
            }
        }

        for(var name in self._resizeFrameGroup){
            if(window.api && api.setFrameGroupAttr){
                var opts = self._resizeFrameGroup[name];
                opts.rect.h = Math.ceil(window.innerHeight-opts.header-opts.footer);
                api.setFrameGroupAttr({
                    hidden:false,
                    name:name,
                    rect:opts.rect
                });
            }
        }
    };
  };

  u.uuid = function() {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";

      var uuid = s.join("");
      return uuid;
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  // event bus
  /////////////////////////////////////////////////////////////////////////////////////////

  var event_callback = {};

  var event_list = [];

  var event_bus_listener = false;

  function onEvent(event,data){
    var callbackList = event_callback[event];
    if(!callbackList) return;
    callbackList.forEach(function(callback){
      callback && callback(event,data);
    });
  }

  function addEventBusListener(){
    if(u.isApiCloud){
      if(event_bus_listener) return true;
      u.ready(function(){
        api.addEventListener({
            name: 'EVENT_BUS'
        }, function(ret, err) {
            var event = ret.value.event,data = ret.value.data,target = ret.value.target;
            if(target){
              var winName = target.split(".")[0];
              var frameName = target.split(".")[1] || api.frameName;
              if(api.winName != winName || (api.frameName != frameName && frameName != "*")) return;
            }
            onEvent(event,data);
        });
      });
      return event_bus_listener=true;
    }
    return false;
  }

  u.off = function(event){
    var self = this;
    event_callback[event] = [];
  };

  u.on = function(event,callback){
      var self = this;
      event_callback[event] = event_callback[event] || [];
      event_callback[event].push(callback);
      if(addEventBusListener()) return;
      while(event_list.length > 0){
        var historyEvent = event_list.pop();
        onEvent(historyEvent.event,historyEvent.data);
      }
  };

  u.emit = function(event,data,target){
      var self = this;
      if(self.isApiCloud){
        target = target || "";
        self.ready(function(){
          api.sendEvent({
              name: 'EVENT_BUS',
              extra: {
                  event: event,
                  data:data,
                  target:target
              }
          });
        });
      }else{
        var callbackList = event_callback[event];
        if(!callbackList){
          return event_list.push({
            event:event,
            data:data
          });
        }
        onEvent(event,data);
      }
  };
  //////////////////////////////////////////////////////////////////////////////////////////////
  // window
  //////////////////////////////////////////////////////////////////////////////////////////////
  u.pageParam = function(name,apiCloud){
        if(typeof apiCloud == 'undefined'){
          apiCloud = true;
        }
        //兼容浏览器
        if(!name){
            var pageParam = {};
            if(this.isApiCloud){
                pageParam = api.pageParam || {};
                pageParam = JSON.parse(JSON.stringify(pageParam));
            }else{
                var search = window.location.search.replace(/^\?/,"");
                var params = search.split("&");
                params.forEach(function(item){
                  var param = item.split("=");
                  pageParam[param[0]] = param[1]?decodeURIComponent(param[1]):param[1];
                });
            }
            delete pageParam["entry"];
            delete pageParam["barHeight"];
            return pageParam;

        }
        if(this.isApiCloud && apiCloud){
            return api.pageParam[name];
        }else{
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURIComponent(r[2]); return null;
        }
    };
    u.formatURL = function(url,params){
      var p = this.formatParam(params);
      if(url.indexOf("?")>=0){
        return url+"&"+p;
      }
      return url+"?"+p;
    };
    u.formatParam = function(params){
        params = params || {};
        var arrParam = [];
        for(var name in params){
            arrParam.push(name+"="+encodeURIComponent(params[name]));
        }
        return arrParam.join("&");
    };
    u.openWin = function(opts,waitReady){
      var self = this;
      if(typeof opts == "string"){
        opts = {
          name:opts
        };
      }
      var entry = opts.name.replace(/-win$/,"");
      opts.url = opts.url || "win-layout.html?entry="+entry+"&barHeight="+this.statusBarHeight()+"&title="+encodeURIComponent(opts.title || "");
      if(!self.isApiCloud){
          var params = self.formatParam(opts.pageParam);
          params && (params = "&"+params);
          return window.location.href = opts.url + params;
      }else{
          if(waitReady){
              this.ready(function(){
                  api.openWin(opts);
              });
          }else{
              api.openWin(opts);
          }
      }

    };
    u._formatFrameOpts = function(opts){
      var self = this;
      opts = opts || {};
      if(!opts.name){
        opts.name = self.pageParam("entry",false) || "index";
        opts.name = opts.name + "-frame";
      }
      var entry = opts.name.replace(/-frame$/,"");
      opts.url = opts.url || "frame-layout.html?entry="+entry+"&title="+encodeURIComponent(opts.title || "");
      if(!self.isApiCloud){
          var params = self.formatParam(opts.pageParam);
          params && (params = "&"+params);
          window.location.href = opts.url + params;
          return false;
      }
      opts.rect = opts.rect || {
        x:0,y:0,h:"auto",w:"auto"
      };
      opts.header = opts.header || 0;
      opts.footer = opts.footer || 0;
      opts.bounces = opts.bounces || false;
      return true;
    };

    u.openFrame = function(opts,waitReady){
      var self = this;
      if(!self._formatFrameOpts(opts)) return false;
      opts.rect.y = opts.rect.y || opts.header;
      if(opts.footer){
          opts.rect.h = Math.ceil(api.winHeight-opts.header-opts.footer);
          self._resizeFrame[opts.name] = opts;
      }
      if(waitReady){
          this.ready(function(){
              api.openFrame(opts);
          });
      }else{
          api.openFrame(opts);
      }

    };
    u.openFrameGroup = function(opts,callback,waitReady){
      var self = this;
      for(var i=0;i<opts.frames.length;i++){
          if(!self._formatFrameOpts(opts.frames[i])){
              return false;
          }
      }
      opts.rect = opts.rect || {
        x:0,y:0,h:"auto",w:"auto"
      };
      opts.rect.y = opts.rect.y || opts.header;
      if(opts.footer){
          opts.rect.h = Math.ceil(window.innerHeight-opts.header-opts.footer);
          self._resizeFrameGroup[opts.name] = opts;
      }
      opts.preload = opts.preload || (opts.frames.length -1);
      if(waitReady){
          this.ready(function(){
              api.openFrameGroup(opts,callback);
          });
      }else{
          api.openFrameGroup(opts,callback);
      }
    };
    u.apicloud = function(c1,c2){
      if(u.isApiCloud){
        c1 && c1();
      }else{
        c2 && c2();
      }
    };
    u.web = function(c1){
      u.apicloud(null,c1);
    };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  u._init();
  module.exports = u;
})(window);
