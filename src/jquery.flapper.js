(function($) {

    var Flapper = function($ele, options) {
        var _this = this;
        this.id = Math.floor(Math.random() * 1000) + 1;
        this.$ele = $ele;
        this.options = $.extend({}, this.defaults, options);
        
        this.$div = $('<div class="flapper"><div class="stripe"></div></div>');
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
            comma: ','
        },
        
        init: function() {
            this.$digits = [];
            this.targets = [];
            this.positions = [];
            this.hidepadding = false;
            
            if (this.options.padding == null) {
                this.options.padding = '&nbsp;';
                this.hidepadding = true;
            }
            
            for (i=0; i<this.options.width; i++) {
                this.$digits[i] = $('<span class="digit"></span>').hide();
                this.$div.prepend(this.$digits[i]);
                this.setPadding(i);
            }

            this.update();
        },
        
        update: function() {
            var _this = this;
            
            if (this.timer) {
                clearInterval(this.timer);
            }

            this.setDisplayTargets();
            
            this.timer = setInterval(function(){
                var changed = false;
                
                for (var i=0; i<_this.options.width; i++) {
                    var current = _this.positions[i];
                    var target = _this.targets[i];
                    var atzero = current == 0 || isNaN(current);
                    
                    if (current != target) {
                        if (target == null && atzero) {
                            _this.setPadding(i);
                            
                        } else if (isNaN(target) && atzero) {
                            _this.setDigit(i, target);
                            
                        } else {
                            _this.incrementDigit(i);
                            changed = true;
                        }
                    }
                }

                if (_this.hidepadding) {
                    for (var i=_this.options.width-1; i>=0; i--) {
                        if (_this.positions[i] == null) {
                            _this.$digits[i].hide();
                        } else {
                            break;
                        }
                    }
                }
                
                if (!changed) {
                    clearInterval(_this.timer);
                }
                
            }, this.options.framerate);
            
        },

        setDisplayTargets: function() {
            var _this = this;
            var val = Math.floor(this.$ele.val());
            var dnew = this.getDigits(val);
            var padout = this.options.padding != '&nbsp;' && !this.hidepadding;
            var prefixed = false;
            var i = 0;
            var d = 0;

            do {
                if (d < dnew.length || padout) {
                    if (_this.options.commafy && (i % 4 == 3)) {
                        _this.targets[i] = _this.options.comma;
                        continue;
                    }
                }
                
                if (d < dnew.length) {
                    _this.targets[i] = dnew[d];
                    d++;
                    
                } else {

                    if (_this.options.prefix) {

                        if (!prefixed && !padout) {
                            _this.targets[i] = _this.options.prefix;
                            prefixed = true;
                            continue;
                        }
                        
                        if (!prefixed && i == _this.options.width - 1) {
                            _this.targets[i] = _this.options.prefix;
                            prefixed = true;
                            continue;
                        }
                        
                    }

                    if (_this.hidepadding) {
                        _this.targets[i] = null;
                    } else {
                        _this.targets[i] = _this.options.padding;
                    }
                }
                
            } while (++i < _this.options.width);
        },
        
        incrementDigit: function(i) {
            var n = parseInt(this.positions[i], 10);
            
            if (isNaN(n)) {
                n = 0;
            } else {
                n++;
                if (n > 9) {
                    n -= 10;
                }
            }
            
            this.$digits[i].html(n+'');
            this.$digits[i].show();
            this.positions[i] = n;
        },
        
        setDigit: function(i, v) {
            this.$digits[i].html(v);
            this.$digits[i].show();
            this.positions[i] = v;
        },
        
        setPadding: function(i) {
            this.$digits[i].html(this.options.padding);
            
            if (this.hidepadding) {
                this.positions[i] = null;
            } else {
                this.$digits[i].show();
                this.positions[i] = this.options.padding;
            }
        },
        
        getDigits: function(val, length) {
            var ret = [];
            var num = val;

            if (num == 0) {
                return [0];
            }

            while (num > 0) {
                ret.push(num % 10);
                num = Math.floor(num / 10);
            }
            
            return ret;
        },
    }

	$.fn.flapper = function(options) {
        this.each(function(){
            new Flapper($(this), options);
        })
    }
    
})(jQuery);
