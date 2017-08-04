Flapper
=======

![Flapper Example](/img/flapper.gif?raw=true "Flapper in Action")


A jQuery number display

Flapper is a jQuery plugin that replicates the split-flap (or "Solari") displays that used to be common
in train stations and airports, and your dad's alarm clock in the 70s.

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
      on_anim_start: null   // Callback for start of animation
      on_anim_end: null     // Callback for end of animation
    }

Generally, the only options you will care about are `width` and `chars_preset`. If you want to use a custom
set of characters, specify `chars` instead of `chars_preset`. Flapper will use the first character in your array
as the default glyph, so you'll usually want this to be either `&nbsp;` or `0`.

Character presets are:
* `num`: `&nbsp;`, 1-9, 0, dollar sign, decimal point, comma, colon
* `hexnum`: `&nbsp;`, 1-9, A-F, 0
* `alpha`: `&nbsp;`, A-Z
* `alphanum`: All of `alpha` and `num`

The timing params `timing`, `min_timing` and `threshhold` control how fast the glyphs flash by as the display
changes. You can set `timing` to a higher number if you'd like a slower, more obvious transform effect. You
can set `min_timing` higher if you'd like the glyphs to flash by more slowly. You generally don't need to set
`threshhold`.

If you'd like to add commas to numbers, use money symbols, control the number of decimal points, and other
fun things, you can load `jquery.numberformatter` and pass its options in `format`. You can also set `padding`
to `0` if you'd like to zero-pad numbers, and you're not using `jquery.numberformatter`.

Theming
=======

You can control Flapper's built-in themes by adding classes to your inputs.

The classes `XS`, `S`, `M`, `L`, `XL` and `XXL` choose Flapper's six size presets. The default is `M`.

The classes `light` and `dark` choose Flapper's two color themes. The default is `dark`.

If you'd like to change Flapper's look, you can define your own theme in CSS. Just give your inputs a class `mytheme`
and define two extra CSS selectors. Each Flapper digit consists of an outer div with four inner divs. The inner
divs are positioned in two layers, a back layer with upper and lower halves, and a front layer with upper and lower
halves.

Define `.flapper.mytheme .digit` to change the outer divs. In the default themes, this controls the
border color and the stripe running horizontally through each digit (the background of this div shows through
the space between the inner divs.)

Define `.flapper.light .digit div` to change the inner divs. In the default themes, this controls the background color
of the digits.

The different size presets have font sizes and line heights that are specific to the font I've chosen as the default
(Roboto Condensed.) If you're using your own font, you'll need to set your own metrics for the size(s). So, for
example:

Define `.flapper.mytheme` to change the font that Flapper uses.

Define `.flapper.mytheme.S` to set `font-size` and `line-height` so that your digits are nicely centered in
Flapper's display (in this case, for the small size.)

To change the border radius of Flapper's digits, change `.flapper.mytheme.S .digit` and `.flapper.mytheme.S .digit div`.

Flapper's size presets work like this:

`.flapper.S` sets the height of each digit.

`.flapper.S .digit div` sets the height (again!) and width of each digit.

`.flapper.S .digit div.top` clips the top half of each digit.

`.flapper.S .digit div.bottom` clips the bottom half of each digit, minus one pixel at the top (the horizontal stripe.)

Defining new sizes is a little tricky, but if you look a the src code you'll get the hang of it.

Demo
====

You can see Flapper in action at: http://www.jaykayess.com/flapper/
