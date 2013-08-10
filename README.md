Flapper
=======

A jQuery number display

Flapper is a jQuery plugin that replicates the split-flap (or "Solari") displays that used to be common
in train stations and airports.

To use, just attach Flapper to any input on your page. Whenever the input's `change` event is fired,
Flapper will update the display.

  <input id="display" />
  
  <script type="text/javascript">
    $('#display').flapper().val('1234').change();
  </script>

For best results, you should load <a href="https://github.com/heygrady/transform">`jquery.transform`</a>
and <a href="https://code.google.com/p/jquery-numberformatter/">`jquery.numberformatter`</a>.

Options
=======

Flapper accepts a hash of options:

    var options = {
      width: 6,             // number of digits
      format: null,         // options for jquery.numberformatter, if loaded
      align: 'right',       // aligns values to the left or right of display
      padding: '&nbsp;',    // value to use for padding
      chars: null,          // array of characters that Flapper can display
      chars_preset: 'num',  // 'num', 'hexnum', 'alpha' or 'alphanum'
      timing: 250,          // the maximum timing for digit animation
      min_timing: 10,       // the minimum timing for digit animation
      threshhold: 100,      // the point at which Flapper will switch from
                            // simple to detailed animations
      transform: true       // Flapper automatically detects the jquery.transform
                            // plugin. Set this to false if you want to force
                            // transform to off
    }

Generally, the only options you will care about are `width` and `chars_preset`. If you want to use a custom
set of characters, specify `chars` instead of `chars_preset`. Flapper will use the first character in your array
as the default glyph, so you'll usually want this to be either `&nbsp;` or `0`.

The timing params `timing`, `min_timing` and `threshhold` control how fast the glyphs flash by as the display
changes. You can set `timing` to a higher number if you'd like a slower, more obvious transform effect. You
can set `min_timing` higher if you'd like the glyphs to flash by more slowly. You generally don't need to set
`threshhold`.

If you'd like to add commas to numbers, use money symbols, control the number of decimal points, and other
fun things, you can load `jquery.numberformatter` and pass its options in `format`. You can also set `padding`
to `0` if you'd like to zero-pad numbers, and you're not using `jquery.numberformatter`.
