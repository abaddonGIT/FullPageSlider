/**
 * Created by abaddon on 21.12.2014.
 */
/*global window, document, console, FullPageSlider*/
(function (w, d, Slider) {
    w.onload = function () {
        var slider = new Slider({
            sliderSelector: "#slider"
        });

        slider.run();

        slider.on("load", function () {
            console.log("i am loaded!!!");
        });
    }
}(window, document, FullPageSlider));