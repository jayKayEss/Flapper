(function($) {

    var Flapper = function($ele, options) {
        var _this = this;
        this.id = Math.floor(Math.random() * 1000) + 1;
        this.$ele = $ele;
        this.options = $.extend({}, this.defaults, options);
        
        this.$div = $('<div class="flapper"></div>');
        this.$ele.hide().after(this.$div);
        
        this.$ele.change(function(){
            _this.update();
        });
        
        this.init();
    }
    
    Flapper.prototype = {
        defaults: {
            width: 6,
            framerate: 100,
            padding: '&nbsp;',
            commafy: false,
            prefix: null,
            comma: ',',
            digits: {}
        },
        
        init: function() {
            this.digits = [];
            
            for (i=0; i<this.options.width; i++) {
                this.digits[i] = new FlapDigit(null, this.options.digits);
                this.$div.prepend(this.digits[i].$ele);
            }

            this.update();
        },
        
        update: function() {
            var value = this.$ele.val();
            var digits = this.getDigits(value);

//            console.log('START', this.$ele, digits.length, digits);
            for (var i=0; i<this.digits.length; i++) {
//                console.log('LOOP', i, digits[i]);
                this.digits[i].goToChar(digits[i]);
            }
        },

        getDigits: function(val, length) {
            var strval = val + '';
            var digits = strval.split('');

//            console.log('GETDIGITS', val, length, strval, digits);

            // TODO: pad/truncate to correct width
            return digits;
        },
    }

    FlapDigit = function($ele, opts) {
        this.options = $.extend({}, this.defaults, opts);

        this.pos = 0;
        this.timeout;
        this.options.animate = true;

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
            chars: ['&nbsp;', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', ',', ':', '$'],
            framerate: 150,
            animate: true
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
            var _this = this;

            var next = this.pos + 1;
            if (next >= this.options.chars.length) {
                next = 0;
            }

            this.$prev.show().html(this.options.chars[this.pos]);
            this.$next.hide().html(this.options.chars[next]);

            var speed1 = Math.floor(Math.random() * this.options.framerate * .4 + this.options.framerate * .3);
            var speed2 = Math.floor(Math.random() * this.options.framerate * .1 + this.options.framerate * .2);

            if (this.options.animate) {
                this.$back_top.show();
                this.$front_bottom.transform({ scaleY: 0.0 });
                this.$front_top.transform({ scaleY: 1.0 }).stop().show().animate({ scaleY: 0.0 }, speed1, 'swing', function(){
                    _this.$front_bottom.stop().show().animate({ scaleY: 1.0 }, speed2, 'linear');
                });
            } else {
                this.$front_top.hide();
                this.$back_top.show();
                if (this.timeout) {
                    clearTimeout(this.timeout);
                }
                this.timeout = setTimeout(function(){
                    this.$back_bottom.hide();
                    this.$front_bottom.show();
                }, speed);
            }

            this.pos = next;
        },

        goToPosition: function(pos) {
            var _this = this;

            if (this.options.framerate_timer) {
                clearInterval(this.options.framerate_timer);
                this.options.framerate_timer = null;
            }

            this.options.framerate_timer = setInterval(function(){
                if (_this.pos == pos) {
                    clearInterval(_this.options.framerate_timer);
                    _this.options.framerate_timer = null;
                } else {
                    _this.increment();
                }
            }, this.options.framerate);
        },

        goToChar: function(char) {
//            if (char =~ /^\s+$/) {
//                char = '&nbsp;';
//            }

//            console.log(char, this.options.chars);
            var pos = this.options.chars.lastIndexOf(char);
            
            if (pos == -1) {
                pos = 0;
            }

//            console.log('GO TO CHAR', char, pos);
            this.goToPosition(pos);
        }
    };

	$.fn.flapper = function(options) {
        this.each(function(){
            new Flapper($(this), options);
        })
    }
    
})(jQuery);
