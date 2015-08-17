(function($) {

    var prependToId = 'Flap', flappers = {};

    var Flapper = function($ele, options) {
        var _this = this;
        this.id = Math.floor(Math.random() * 1000) + 1;
        this.$ele = $ele;
        this.options = $.extend({}, this.defaults, options);
        
        // is transform loaded?
        this.options.transform = this.options.transform && $.transform;

        this.$div = $('<div></div>');
        this.$div.attr('class', 'flapper ' + this.$ele.attr('class'));
        this.$ele.hide().after(this.$div);
        
        this.$ele.bind('change.flapper', function(){
            _this.update();
        });
        
        var flapperId = this.$ele[0].id || prependToId + this.id;
        this.$ele.attr('id', flapperId);
        flappers[flapperId] = this;
        
        this.init();
    }
    
    Flapper.prototype = {
        defaults: {
            width: 6,
            format: null,
            align: 'right',
            padding: ' ',
            chars: null,
            chars_preset: 'num',
            timing: 250,
            min_timing: 10,
            threshhold: 100,
            transform: true,
            on_anim_start: null,
            on_anim_end: null
        },
        
        init: function() {
            var _this = this;
            this.digits = [];
            
            for (i=0; i<this.options.width; i++) {
                this.digits[i] = new FlapDigit(null, this.options);
                this.$div.append(this.digits[i].$ele);
            }

            this.$div.on('digitAnimEnd', function(e){
                _this.onDigitAnimEnd(e);
            });

            if (this.options.on_anim_start) {
                this.$div.on('animStart', this.options.on_anim_start);
            }

            if (this.options.on_anim_end) {
                this.$div.on('animEnd', this.options.on_anim_end);
            }

            this.update();
        },
        
        update: function() {
            var value = this.$ele.val().replace(/[\s|\u00a0]/g, ' ');
            var digits = this.getDigits(value);
            this.digitsFinished = 0;
            
            this.$div.trigger('animStart');

            for (var i=0; i<this.digits.length; i++) {
                this.digits[i].goToChar(digits[i]);
            }
        },

        onDigitAnimEnd: function(e) {
            this.digitsFinished++;

            if (this.digitsFinished == this.options.width) {
                this.$div.trigger('animEnd');
            }
        },

        getDigits: function(val, length) {
            var strval = val + '';

            if (this.options.format) {
                strval = $.formatNumber(val, this.options.format);
            }

            var digits = strval.split('');

            if (digits.length < this.options.width) {
                while (digits.length < this.options.width) {
                    if (this.options.align == 'left') {
                        digits.push(this.options.padding);
                    } else {
                        digits.unshift(this.options.padding);
                    }
                }
            } else if (digits.length > this.options.width) {
                var overage = digits.length - this.options.width;
                if (this.options.align == 'left') {
                    digits.splice(-1, overage);
                } else {
                    digits.splice(0, overage);
                }
            }

            return digits;
        },
        
        addDigit: function(){
            var flapDigit = new FlapDigit(null, this.options);
            if (this.options.align === 'left') {
                this.digits.push(flapDigit);
                this.$div.append(flapDigit.$ele);
            }
            else{
                this.digits.unshift(flapDigit);
                this.$div.prepend(flapDigit.$ele);
            }
            this.options.width = this.digits.length;
            return flapDigit;
        },
        
        removeDigit: function(){
            var flapDigit = (this.options.align === 'left') ? this.digits.pop() : this.digits.shift();
            flapDigit.$ele.remove();
            this.options.width = this.digits.length;
        },
        
        performAction: function(action){
            switch(action){
                case 'add-digit': this.addDigit(); break;
                case 'remove-digit': this.removeDigit(); break;
            }
        }
    }

    FlapDigit = function($ele, opts) {
        this.options = opts;

        if (!this.options.chars) {
            this.options.chars = this.presets[this.options.chars_preset];
        }

        this.pos = 0;
        this.timeout;

        if (!$ele) {
            this.$ele = $(this.htmlTemplate);
        } else {
            this.$ele = $ele;
        }

        this.$prev = this.$ele.find('.front.top, .back.bottom');
        this.$next = this.$ele.find('.back.top, .front.bottom'); 
        this.$back_top = this.$ele.find('.back.top');
        this.$back_bottom = this.$ele.find('.back.bottom');
        this.$front_top = this.$ele.find('.front.top');
        this.$front_bottom = this.$ele.find('.front.bottom');

        this.initialize();
    }

    FlapDigit.prototype = {

        presets: {
            num: [' ', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
            hexnum: [' ', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', '0'],
            alpha: [' ','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
            alphanum: [' ','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
                '1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
        },

        initialize: function() {
            this.$prev.html(this.options.chars[0]);
            this.$next.html(this.options.chars[0]);
        },

        htmlTemplate: '<div class="digit"><div class="back top">&nbsp;</div>' +
            '<div class="back bottom">&nbsp;</div>' +
            '<div class="front top">&nbsp;</div>' +
            '<div class="front bottom">&nbsp;</div></div>',

        increment: function(speed) {
            var next = this.pos + 1;
            if (next >= this.options.chars.length) {
                next = 0;
            }

            this.$prev.html(this.options.chars[this.pos]).show();

            this.$front_bottom.hide();
            this.$next.html(this.options.chars[next]);
            
            var speed1 = Math.floor(Math.random() * speed * .4 + speed * .3);
            var speed2 = Math.floor(Math.random() * speed * .1 + speed * .2);

            if (speed >= this.options.threshhold) {
                if (this.options.transform) {
                    this.animateSlow(speed1, speed2);
                } else {
                    this.animateFast(speed1, speed2);
                }
            }

            this.pos = next;
        },

        animateSlow: function(speed1, speed2) {
            var _this = this;

            this.$back_top.show();
            this.$front_bottom.transform({ scaleY: 0.0 });
            this.$front_top.transform({ scaleY: 1.0 }).stop().show().animate({ scaleY: 0.0 }, speed1, 'swing', function(){
                _this.$front_bottom.stop().show().animate({ scaleY: 1.0 }, speed2, 'linear');
                _this.$front_top.hide().transform({ scaleY: 1.0 });
            });
        },

        animateFast: function(speed1, speed2) {
            var _this = this;

            if (this.timeout) {
                clearTimeout(this.timeout);
            }

            this.timeout = setTimeout(function(){
                _this.$front_top.hide();

                _this.timeout = setTimeout(function(){
                    _this.$front_bottom.show();

                }, speed2);
            }, speed1);
        },

        goToPosition: function(pos) {
            var _this = this;

            var frameFunc = function() {
                if (_this.timing_timer) {
                    clearInterval(_this.timing_timer);
                    _this.timing_timer = null;
                }

                var distance = pos - _this.pos;
                if (distance <0) {
                    distance += _this.options.chars.length;
                }

                if (_this.pos == pos) {
                    clearInterval(_this.timing_timer);
                    _this.timing_timer = null;
                    _this.$ele.trigger("digitAnimEnd");
                } else {
                    var duration = Math.floor(
                            (_this.options.timing - _this.options.min_timing)
                            / distance + _this.options.min_timing
                    );
                    _this.increment(duration);
                    _this.timing_timer = setTimeout(frameFunc, duration);
                }

            }

            frameFunc();
        },

        goToChar: function(c) {
            var pos = $.inArray(c, this.options.chars);
            
            if (pos == -1) {
                this.options.chars.push(c);
                pos = this.options.chars.length - 1;
            }

            this.goToPosition(pos);
        }
    };

    $.fn.flapper = function(arg) {
        this.each(function(){
            if(!(typeof arg === 'string' || arg instanceof String)) return new Flapper($(this), arg);
            
            if(this.id && flappers.hasOwnProperty(this.id)){
                flappers[this.id].performAction(arg);
            }
        });

        return this;
    }
    
})(jQuery);
