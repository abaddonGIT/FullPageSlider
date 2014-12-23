/**
 * Created by abaddon on 21.12.2014.
 */
/*global window, document, console*/
var FullPageSlider = null;
(function (w, d, n) {
    "use strict";
    var config = {}, that = null;
    FullPageSlider = function (options) {
        config = this.ext({
            sliderSelector: null,
            startSlide: 0,
            next: '.next',
            prev: '.prev',
            itemClass: '.item'
        }, options);

        this.ext(this, {
            config: config,
            goodSlides: [],
            index: 0,
            handlers: {},
            active: "active"
        });
        if (/MSIE 9/i.test(n.userAgent)) {
            this.active = "badie";
        }
        //Построение слайдера
        this.buildSlider = function () {
            this.slider = d.querySelector(config.sliderSelector);
            if (this.slider) {
                this.addClass(this.slider, "full-slider");
                //Вперед
                d.querySelector(this.config.next).addEventListener("click", this.nextSlide, false);
                //Назад
                d.querySelector(this.config.prev).addEventListener("click", this.prevSlide, false);
                this.getAllSlides();
            } else {
                this.throwError("error", "Указан неправильный селектор контенера!!!");
                return;
            }
        };
        //Находим все слайды
        this.getAllSlides = function () {
            var slides = this.slides = this.slider.querySelectorAll(config.itemClass), ln = slides.length;
            if (ln) {
                this.imgLoad(0, function () {
                    delete this.slides;
                    this.index = config.startSlide;
                    //Стартуем
                    this.emit("load");
                    this.addClass(this.goodSlides[this.index], this.active);
                    //Вешаем прослушку на окончание анимации
                    this.addAnimationEndEvent();
                }.bind(this));
            } else {
                this.throwError("error", "Блок не содержит не одного слайда!!!");
                return;
            }
        };
        this.addAnimationEndEvent = function () {
            var ln = this.goodSlides.length;
            while (ln--) {
                var slide = this.goodSlides[ln];
                this.prefixedEvent(slide, "AnimationEnd", function () {
                    var next = this.goodSlides[this.index + 1];
                    this.removeClass(this.goodSlides[this.index], this.active);
                    if (!next) {
                        this.index = 0;
                    } else {
                        this.index++;
                    }
                    this.addClass(this.goodSlides[this.index], this.active);
                }.bind(this));
            }
        };
        this.nextSlide = function (e) {
            that.paginationAction("next");
            e.preventDefault();
        };
        this.prevSlide = function (e) {
            that.paginationAction("prev");
            e.preventDefault();
        };
        this.paginationAction = function (type) {
            that.removeClass(that.goodSlides[that.index], that.active);
            var phase;
            switch (type) {
                case "next":
                    phase = that.goodSlides[that.index + 1];
                    phase ? that.index++ : that.index = 0;
                    break;
                case "prev":
                    phase = that.goodSlides[that.index - 1];
                    phase ? that.index-- : that.index = that.goodSlides.length - 1;
                    break;
            }
            that.emit(type, that.index);
            that.addClass(that.goodSlides[that.index], that.active);
        };
        //строим слайдер
        this.buildSlider();
        that = this;
    };

    FullPageSlider.prototype = {
        imgLoad: function (i, back) {
            if (this.slides[i]) {
                var href = this.slides[i].getAttribute("data-image"), img;
                if (href) {
                    img = new Image();
                    img.src = href;
                    img.onload = function () {
                        this.slides[i].style.cssText += "background-image: url(" + href + ");";//Добавляем фон
                        this.goodSlides.push(this.slides[i]);
                        i++;
                        that.imgLoad(i, back);
                        img = null;
                    }.bind(this);
                    img.onerror = function () {
                        delete this.slides[i];
                        i++;
                        this.throwError("warn", "изображение не жожет быть загруженно!!!");
                        this.imgLoad(i, back);
                        img = null;
                    }.bind(this);
                }
            } else {
                back();
            }
        },
        ext: function (one, two) {
            for (var i in two) {
                if (two.hasOwnProperty(i)) {
                    one[i] = two[i];
                }
            }
            return one;
        },
        removeClass: function (element, className) {
            if (element.classList) {
                element.classList.remove(className);
            } else {
                var re = new RegExp("(^|\\s)" + className + "(\\s|$)", "g");
                element.className = element.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "")
            }
        },
        addClass: function (element, className) {
            if (element.classList) {
                element.classList.add(className);
            } else {
                element.className += " " + className;
            }
        },
        throwError: function (type, text) {
            switch (type) {
                case "error":
                    console.error(text);
                    break;
                case "warn":
                    console.warn(text);
                    break;
                case "log":
                    console.log(text);
                    break;
            }
        },
        prefixedEvent: function (elem, type, callback) {
            var pfx = ["webkit", ""];
            for (var p = 0; p < pfx.length; p++) {
                if (!pfx[p]) {
                    type = type.toLowerCase();
                }
                elem.addEventListener(pfx[p] + type, callback, false);
            }
        },
        on: function (name, handler) {
            this.handlers[name] = handler;
        },
        emit: function () {
            var fn = this.handlers[arguments[0]];
            if (fn) {
                this.handlers[arguments[0]].apply(this, arguments);
            }
        }
    };
}(window, document, navigator));