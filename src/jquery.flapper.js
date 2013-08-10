(function($) {

    var Flapper = function($ele, options) {
        var _this = this;
        this.id = Math.floor(Math.random() * 1000) + 1;
        this.$ele = $ele;
        this.options = $.extend({}, this.defaults, options);
        
        this.$div = $('<div></div>');
        this.$div.attr('class', 'flapper ' + this.$ele.attr('class'));
        this.$ele.hide().after(this.$div);
        
        this.$ele.bind('change.flapper', function(){
            _this.update();
        });
        
        this.init();
    }
    
    Flapper.prototype = {
        defaults: {
            width: 6,
            format: null,
            align: 'right',
            padding: '&nbsp;',
            digits: {}
        },
        
        init: function() {
            this.digits = [];
            
            for (i=0; i<this.options.width; i++) {
                this.digits[i] = new FlapDigit(null, this.options.digits);
                this.$div.append(this.digits[i].$ele);
            }

            this.update();
        },
        
        update: function() {
            var value = this.$ele.val();
            var digits = this.getDigits(value);

            for (var i=0; i<this.digits.length; i++) {
                this.digits[i].goToChar(digits[i]);
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
    }

    FlapDigit = function($ele, opts) {
        this.options = $.extend({}, this.defaults, opts);

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

        defaults: {
            chars_preset: 'num',
            timing: 150,
            animation: 'slow'
        },

        presets: {
            num: ['&nbsp;', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', ',', ':', '$'],
            hexnum: ['&nbsp;', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', '0'],
            alpha: ['&nbsp;','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
            alphanum: ['&nbsp;','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
                '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', ',', ':', '$'],
        },

        initialize: function() {
            this.$prev.html(this.options.chars[0]);
            this.$next.hide().html(this.options.chars[0]);
        },

        htmlTemplate: '<div class="digit"><div class="back top">&nbsp;</div>' +
            '<div class="back bottom">&nbsp;</div>' +
            '<div class="front top">&nbsp;</div>' +
            '<div class="front bottom">&nbsp;</div></div>',

        increment: function() {
            var next = this.pos + 1;
            if (next >= this.options.chars.length) {
                next = 0;
            }

            this.$prev.show().html(this.options.chars[this.pos]);
            this.$next.hide().html(this.options.chars[next]);

            var speed1 = Math.floor(Math.random() * this.options.timing * .4 + this.options.timing * .3);
            var speed2 = Math.floor(Math.random() * this.options.timing * .1 + this.options.timing * .2);

            if (this.options.animation == 'fast') {
                this.animateFast(speed1, speed2);
            } else if (this.options.animation == 'medium') {
                this.animateMedium(speed1, speed2);
            } else {
                this.animateSlow(speed1, speed2);
            }

            this.pos = next;
        },

        animateSlow: function(speed1, speed2) {
            var _this = this;

            this.$back_top.show();
            this.$front_bottom.transform({ scaleY: 0.0 });
            this.$front_top.transform({ scaleY: 1.0 }).stop().show().animate({ scaleY: 0.0 }, speed1, 'swing', function(){
                _this.$front_bottom.stop().show().animate({ scaleY: 1.0 }, speed2, 'linear');
            });
        },

        animateMedium: function(speed1, speed2) {
            var _this = this;

            if (this.timeout) {
                clearTimeout(this.timeout);
            }

            this.$back_top.show();

            this.timeout = setTimeout(function(){
                _this.$front_top.transform({ scaleY: 0.5 });
                this.timeout = setTimeout(function(){
                    _this.$front_top.hide().transform({ scaleY: 1.0 });
                    this.timeout = setTimeout(function(){
                        _this.$front_bottom.transform({ scaleY: 0.5 }).show();

                        this.timeout = setTimeout(function(){
                            _this.$front_bottom.transform({ scaleY: 1.0 });
                        }, speed2/2);
                    }, speed2/2);
                }, speed1/2);
            }, speed1/2);
        },

        animateFast: function(speed1, speed2) {
            var _this = this;

            if (this.timeout) {
                clearTimeout(this.timeout);
            }

            this.timeout = setTimeout(function(){
                _this.$front_top.hide();
                _this.$back_top.show();

                this.timeout = setTimeout(function(){
                    _this.$back_bottom.hide();
                    _this.$front_bottom.show();
                }, speed2);
            }, speed1);
        },

        goToPosition: function(pos) {
            var _this = this;

            if (this.options.timing_timer) {
                clearInterval(this.options.timing_timer);
                this.options.timing_timer = null;
            }

            this.options.timing_timer = setInterval(function(){
                if (_this.pos == pos) {
                    clearInterval(_this.options.timing_timer);
                    _this.options.timing_timer = null;
                } else {
                    _this.increment();
                }
            }, this.options.timing);
        },

        goToChar: function(char) {
            var pos = this.options.chars.lastIndexOf(char);
            
            if (pos == -1) {
                pos = 0;
            }

            this.goToPosition(pos);
        }
    };

	$.fn.flapper = function(options) {
        this.each(function(){
            new Flapper($(this), options);
        });

        return this;
    }
    
})(jQuery);
