//下面的代码是从mui.js里面拷贝出来的,有问题去找mui，解决移动端tap的问题
export default{
    _each(elements, callback, hasOwnProperty) {
		if (!elements) {
			return this;
		}
		if (typeof elements.length === 'number') {
			[].every.call(elements, function(el, idx) {
				return callback.call(el, idx, el) !== false;
			});
		} else {
			for (var key in elements) {
				if (hasOwnProperty) {
					if (elements.hasOwnProperty(key)) {
						if (callback.call(elements[key], key, elements[key]) === false) return elements;
					}
				} else {
					if (callback.call(elements[key], key, elements[key]) === false) return elements;
				}
			}
		}
		return this;
	},
    _trigger(element, eventType, eventData) {
        if (typeof window.CustomEvent === 'undefined') {
            function CustomEvent(event, params) {
                params = params || {
                    bubbles: false,
                    cancelable: false,
                    detail: undefined
                };
                var evt = document.createEvent('Events');
                var bubbles = true;
                for (var name in params) {
                    (name === 'bubbles') ? (bubbles = !!params[name]) : (evt[name] = params[name]);
                }
                evt.initEvent(event, bubbles, true);
                return evt;
            };
            CustomEvent.prototype = window.Event.prototype;
            window.CustomEvent = CustomEvent;
        }
		element.dispatchEvent(new CustomEvent(eventType, {
			detail: eventData,
			bubbles: true,
			cancelable: true
		}));
	},
    init(){
        var self = this;
        if ('ontouchstart' in window) {
            self.isTouchable = true;
            self.EVENT_START = 'touchstart';
            self.EVENT_MOVE = 'touchmove';
            self.EVENT_END = 'touchend';
        } else {
            self.isTouchable = false;
            self.EVENT_START = 'mousedown';
            self.EVENT_MOVE = 'mousemove';
            self.EVENT_END = 'mouseup';
        }
        self.EVENT_CANCEL = 'touchcancel';
        self.EVENT_CLICK = 'click';

        self.options = {
            gestureConfig: {
                tap: true,
                doubletap: false,
                longtap: false,
                hold: false,
                flick: true,
                swipe: true,
                drag: true,
                pinch: false
            }
        };

        var ua = navigator.userAgent;

        this.os = {};
		var funcs = [

			function() { //wechat
				var wechat = ua.match(/(MicroMessenger)\/([\d\.]+)/i);
				if (wechat) { //wechat
					this.os.wechat = {
						version: wechat[2].replace(/_/g, '.')
					};
				}
				return false;
			},
			function() { //android
				var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
				if (android) {
					this.os.android = true;
					this.os.version = android[2];

					this.os.isBadAndroid = !(/Chrome\/\d/.test(window.navigator.appVersion));
				}
				return this.os.android === true;
			},
			function() { //ios
				var iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/);
				if (iphone) { //iphone
					this.os.ios = this.os.iphone = true;
					this.os.version = iphone[2].replace(/_/g, '.');
				} else {
					var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
					if (ipad) { //ipad
						this.os.ios = this.os.ipad = true;
						this.os.version = ipad[2].replace(/_/g, '.');
					}
				}
				return this.os.ios === true;
			}
		];
		[].every.call(funcs, function(func) {
			return !func.call(self);
		});

        self._addEventListener();
        self._addEndEventListener();
        self._tap();

    },
    _addEventListener(){
        var self = this;

        /**
         * targets
         */
        self.targets = {};
        /**
         * target handles
         */
        self.targetHandles = [];
        /**
         * register target
         * @param {type} target
         * @returns {self.targets}
         */
        self.registerTarget = function(target) {
    
            target.index = target.index || 1000;
    
            self.targetHandles.push(target);
    
            self.targetHandles.sort(function(a, b) {
                return a.index - b.index;
            });
    
            return self.targetHandles;
        };
        window.addEventListener(self.EVENT_START, function(event) {
            var target = event.target;
            var founds = {};
            for (; target && target !== document; target = target.parentNode) {
                var isFound = false;
                self._each(self.targetHandles, function(index, targetHandle) {
                    var name = targetHandle.name;
                    if (!isFound && !founds[name] && targetHandle.hasOwnProperty('handle')) {
                        self.targets[name] = targetHandle.handle(event, target);
                        if (self.targets[name]) {
                            founds[name] = true;
                            if (targetHandle.isContinue !== true) {
                                isFound = true;
                            }
                        }
                    } else {
                        if (!founds[name]) {
                            if (targetHandle.isReset !== false)
                                self.targets[name] = false;
                        }
                    }
                });
                if (isFound) {
                    break;
                }
            }
        });
        window.addEventListener('click', function(event) { //解决touch与click的target不一致的问题(比如链接边缘点击时，touch的target为html，而click的target为A)
            var target = event.target;
            var isFound = false;
            for (; target && target !== document; target = target.parentNode) {
                if (target.tagName === 'A') {
                    self._each(self.targetHandles, function(index, targetHandle) {
                        var name = targetHandle.name;
                        if (targetHandle.hasOwnProperty('handle')) {
                            if (targetHandle.handle(event, target)) {
                                isFound = true;
                                event.preventDefault();
                                return false;
                            }
                        }
                    });
                    if (isFound) {
                        break;
                    }
                }
            }
        });
    },
    _addEndEventListener(){
        var self = this;
        self.gestures = {
            session: {}
        };
        /**
         * Gesture preventDefault
         * @param {type} e
         * @returns {undefined}
         */
        self.preventDefault = function(e) {
            e.preventDefault();
        };
        /**
         * Gesture stopPropagation
         * @param {type} e
         * @returns {undefined}
         */
        self.stopPropagation = function(e) {
            e.stopPropagation();
        };
    
        /**
         * register gesture
         * @param {type} gesture
         * @returns {self.gestures}
         */
        self.addGesture = function(gesture) {
            return self.addAction('gestures', gesture);
    
        };
    
        var round = Math.round;
        var abs = Math.abs;
        var sqrt = Math.sqrt;
        var atan = Math.atan;
        var atan2 = Math.atan2;
        /**
         * distance
         * @param {type} p1
         * @param {type} p2
         * @returns {Number}
         */
        var getDistance = function(p1, p2, props) {
            if(!props) {
                props = ['x', 'y'];
            }
            var x = p2[props[0]] - p1[props[0]];
            var y = p2[props[1]] - p1[props[1]];
            return sqrt((x * x) + (y * y));
        };
        /**
         * scale
         * @param {Object} starts
         * @param {Object} moves
         */
        var getScale = function(starts, moves) {
            if(starts.length >= 2 && moves.length >= 2) {
                var props = ['pageX', 'pageY'];
                return getDistance(moves[1], moves[0], props) / getDistance(starts[1], starts[0], props);
            }
            return 1;
        };
        /**
         * angle
         * @param {type} p1
         * @param {type} p2
         * @returns {Number}
         */
        var getAngle = function(p1, p2, props) {
            if(!props) {
                props = ['x', 'y'];
            }
            var x = p2[props[0]] - p1[props[0]];
            var y = p2[props[1]] - p1[props[1]];
            return atan2(y, x) * 180 / Math.PI;
        };
        /**
         * direction
         * @param {Object} x
         * @param {Object} y
         */
        var getDirection = function(x, y) {
            if(x === y) {
                return '';
            }
            if(abs(x) >= abs(y)) {
                return x > 0 ? 'left' : 'right';
            }
            return y > 0 ? 'up' : 'down';
        };
        /**
         * rotation
         * @param {Object} start
         * @param {Object} end
         */
        var getRotation = function(start, end) {
            var props = ['pageX', 'pageY'];
            return getAngle(end[1], end[0], props) - getAngle(start[1], start[0], props);
        };
        /**
         * px per ms
         * @param {Object} deltaTime
         * @param {Object} x
         * @param {Object} y
         */
        var getVelocity = function(deltaTime, x, y) {
            return {
                x: x / deltaTime || 0,
                y: y / deltaTime || 0
            };
        };
        /**
         * detect gestures
         * @param {type} event
         * @param {type} touch
         * @returns {undefined}
         */
        var detect = function(event, touch) {
            if(self.gestures.stoped) {
                return;
            }
            if(!self.gestures.stoped) {
                var gesture = {
                    name: 'tap',
                    index: 30,
                    handle: self._touchHandle,
                    options: {
                        fingers: 1,
                        tapMaxInterval: 300,
                        tapMaxDistance: 5,
                        tapMaxTime: 250
                    }
                };
                if(self.options.gestureConfig[gesture.name] !== false) {
                    gesture.handle(event, touch);
                }
            }
            // self.doAction('gestures', function(index, gesture) {
            //     if(!self.gestures.stoped) {
            //         if(self.options.gestureConfig[gesture.name] !== false) {
            //             gesture.handle(event, touch);
            //         }
            //     }
            // });
        };
        /**
         * 暂时无用
         * @param {Object} node
         * @param {Object} parent
         */
        var hasParent = function(node, parent) {
            while(node) {
                if(node == parent) {
                    return true;
                }
                node = node.parentNode;
            }
            return false;
        };
    
        var uniqueArray = function(src, key, sort) {
            var results = [];
            var values = [];
            var i = 0;
    
            while(i < src.length) {
                var val = key ? src[i][key] : src[i];
                if(values.indexOf(val) < 0) {
                    results.push(src[i]);
                }
                values[i] = val;
                i++;
            }
    
            if(sort) {
                if(!key) {
                    results = results.sort();
                } else {
                    results = results.sort(function sortUniqueArray(a, b) {
                        return a[key] > b[key];
                    });
                }
            }
    
            return results;
        };
        var getMultiCenter = function(touches) {
            var touchesLength = touches.length;
            if(touchesLength === 1) {
                return {
                    x: round(touches[0].pageX),
                    y: round(touches[0].pageY)
                };
            }
    
            var x = 0;
            var y = 0;
            var i = 0;
            while(i < touchesLength) {
                x += touches[i].pageX;
                y += touches[i].pageY;
                i++;
            }
    
            return {
                x: round(x / touchesLength),
                y: round(y / touchesLength)
            };
        };
        var multiTouch = function() {
            return self.options.gestureConfig.pinch;
        };
        var copySimpleTouchData = function(touch) {
            var touches = [];
            var i = 0;
            while(i < touch.touches.length) {
                touches[i] = {
                    pageX: round(touch.touches[i].pageX),
                    pageY: round(touch.touches[i].pageY)
                };
                i++;
            }
            return {
                timestamp: new Date().getTime(),
                gesture: touch.gesture,
                touches: touches,
                center: getMultiCenter(touch.touches),
                deltaX: touch.deltaX,
                deltaY: touch.deltaY
            };
        };
    
        var calDelta = function(touch) {
            var session = self.gestures.session;
            var center = touch.center;
            var offset = session.offsetDelta || {};
            var prevDelta = session.prevDelta || {};
            var prevTouch = session.prevTouch || {};
    
            if(touch.gesture.type === self.EVENT_START || touch.gesture.type === self.EVENT_END) {
                prevDelta = session.prevDelta = {
                    x: prevTouch.deltaX || 0,
                    y: prevTouch.deltaY || 0
                };
    
                offset = session.offsetDelta = {
                    x: center.x,
                    y: center.y
                };
            }
            touch.deltaX = prevDelta.x + (center.x - offset.x);
            touch.deltaY = prevDelta.y + (center.y - offset.y);
        };
        var calTouchData = function(touch) {
            var session = self.gestures.session;
            var touches = touch.touches;
            var touchesLength = touches.length;
    
            if(!session.firstTouch) {
                session.firstTouch = copySimpleTouchData(touch);
            }
    
            if(multiTouch() && touchesLength > 1 && !session.firstMultiTouch) {
                session.firstMultiTouch = copySimpleTouchData(touch);
            } else if(touchesLength === 1) {
                session.firstMultiTouch = false;
            }
    
            var firstTouch = session.firstTouch;
            var firstMultiTouch = session.firstMultiTouch;
            var offsetCenter = firstMultiTouch ? firstMultiTouch.center : firstTouch.center;
    
            var center = touch.center = getMultiCenter(touches);
            touch.timestamp = new Date().getTime();
            touch.deltaTime = touch.timestamp - firstTouch.timestamp;
    
            touch.angle = getAngle(offsetCenter, center);
            touch.distance = getDistance(offsetCenter, center);
    
            calDelta(touch);
    
            touch.offsetDirection = getDirection(touch.deltaX, touch.deltaY);
    
            touch.scale = firstMultiTouch ? getScale(firstMultiTouch.touches, touches) : 1;
            touch.rotation = firstMultiTouch ? getRotation(firstMultiTouch.touches, touches) : 0;
    
            calIntervalTouchData(touch);
    
        };
        var CAL_INTERVAL = 25;
        var calIntervalTouchData = function(touch) {
            var session = self.gestures.session;
            var last = session.lastInterval || touch;
            var deltaTime = touch.timestamp - last.timestamp;
            var velocity;
            var velocityX;
            var velocityY;
            var direction;
    
            if(touch.gesture.type != self.EVENT_CANCEL && (deltaTime > CAL_INTERVAL || last.velocity === undefined)) {
                var deltaX = last.deltaX - touch.deltaX;
                var deltaY = last.deltaY - touch.deltaY;
    
                var v = getVelocity(deltaTime, deltaX, deltaY);
                velocityX = v.x;
                velocityY = v.y;
                velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
                direction = getDirection(deltaX, deltaY) || last.direction;
    
                session.lastInterval = touch;
            } else {
                velocity = last.velocity;
                velocityX = last.velocityX;
                velocityY = last.velocityY;
                direction = last.direction;
            }
    
            touch.velocity = velocity;
            touch.velocityX = velocityX;
            touch.velocityY = velocityY;
            touch.direction = direction;
        };
        var targetIds = {};
        var convertTouches = function(touches) {
            for(var i = 0; i < touches.length; i++) {
                !touches['identifier'] && (touches['identifier'] = 0);
            }
            return touches;
        };
        var getTouches = function(event, touch) {
            var allTouches = convertTouches([].slice.call(event.touches || [event]));
    
            var type = event.type;
    
            var targetTouches = [];
            var changedTargetTouches = [];
    
            //当touchstart或touchmove且touches长度为1，直接获得all和changed
            if((type === self.EVENT_START || type === self.EVENT_MOVE) && allTouches.length === 1) {
                targetIds[allTouches[0].identifier] = true;
                targetTouches = allTouches;
                changedTargetTouches = allTouches;
                touch.target = event.target;
            } else {
                var i = 0;
                var targetTouches = [];
                var changedTargetTouches = [];
                var changedTouches = convertTouches([].slice.call(event.changedTouches || [event]));
    
                touch.target = event.target;
                var sessionTarget = self.gestures.session.target || event.target;
                targetTouches = allTouches.filter(function(touch) {
                    return hasParent(touch.target, sessionTarget);
                });
    
                if(type === self.EVENT_START) {
                    i = 0;
                    while(i < targetTouches.length) {
                        targetIds[targetTouches[i].identifier] = true;
                        i++;
                    }
                }
    
                i = 0;
                while(i < changedTouches.length) {
                    if(targetIds[changedTouches[i].identifier]) {
                        changedTargetTouches.push(changedTouches[i]);
                    }
                    if(type === self.EVENT_END || type === self.EVENT_CANCEL) {
                        delete targetIds[changedTouches[i].identifier];
                    }
                    i++;
                }
    
                if(!changedTargetTouches.length) {
                    return false;
                }
            }
            targetTouches = uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true);
            var touchesLength = targetTouches.length;
            var changedTouchesLength = changedTargetTouches.length;
            if(type === self.EVENT_START && touchesLength - changedTouchesLength === 0) { //first
                touch.isFirst = true;
                self.gestures.touch = self.gestures.session = {
                    target: event.target
                };
            }
            touch.isFinal = ((type === self.EVENT_END || type === self.EVENT_CANCEL) && (touchesLength - changedTouchesLength === 0));
    
            touch.touches = targetTouches;
            touch.changedTouches = changedTargetTouches;
            return true;
    
        };
        var handleTouchEvent = function(event) {
            
            var touch = {
                gesture: event
            };
            var touches = getTouches(event, touch);
            if(!touches) {
                return;
            }
            calTouchData(touch);
            detect(event, touch);
            self.gestures.session.prevTouch = touch;
            if(event.type === self.EVENT_END && !self.isTouchable) {
                self.gestures.touch = self.gestures.session = {};
            }
        };
        var supportsPassive = (function checkPassiveListener() {
            var supportsPassive = false;
            try {
                var opts = Object.defineProperty({}, 'passive', {
                    get: function get() {
                        supportsPassive = true;
                    },
                });
                window.addEventListener('testPassiveListener', null, opts);
            } catch(e) {
                // No support
            }
            return supportsPassive;
        }());
        window.addEventListener(self.EVENT_START, handleTouchEvent);
        window.addEventListener(self.EVENT_MOVE, handleTouchEvent, supportsPassive ? {
            passive: false,
            capture: false
        } : false);
        window.addEventListener(self.EVENT_END, handleTouchEvent);
        window.addEventListener(self.EVENT_CANCEL, handleTouchEvent);
        //fixed hashchange(android)
        window.addEventListener(self.EVENT_CLICK, function(e) {
            //TODO 应该判断当前target是不是在targets.popover内部，而不是非要相等
            if((self.os.android || self.os.ios) && ((self.targets.popover && e.target === self.targets.popover) || (self.targets.tab) || self.targets.offcanvas || self.targets.modal)) {
                e.preventDefault();
            }
        }, true);
    },
    _tap(){
        var self = this;
        var name = 'tap';
        var lastTarget;
        var lastTapTime;
        var handle = function(event, touch) {
            var session = self.gestures.session;
            var options = this.options;
            switch (event.type) {
                case self.EVENT_END:
                    if (!touch.isFinal) {
                        return;
                    }
                    var target = session.target;
                    if (!target || (target.disabled || (target.classList && target.classList.contains('mui-disabled')))) {
                        return;
                    }
                    if (touch.distance < options.tapMaxDistance && touch.deltaTime < options.tapMaxTime) {
                        if (self.options.gestureConfig.doubletap && lastTarget && (lastTarget === target)) { //same target
                            if (lastTapTime && (touch.timestamp - lastTapTime) < options.tapMaxInterval) {
                                self.trigger(target, 'doubletap', touch);
                                lastTapTime = new Date().getTime();
                                lastTarget = target;
                                return;
                            }
                        }
                        self._trigger(target, name, touch);
                        lastTapTime = new Date().getTime();
                        lastTarget = target;
                    }
                    break;
            }
        };
        self._touchHandle = handle;
    }
}