/**
 * Created by abaddon on 21.12.2014.
 */
/*global window, document, console, setTimeout, navigator, Object*/
var FullPageSlider = null;
(function (w, d, n, timeout, o) {
    "use strict";
    var config = {}, that = null;
    FullPageSlider = function (options) {
        config = this.ext({
            sliderSelector: null,
            startSlide: 0,
            next: '.next',
            prev: '.prev',
            itemClass: '.item',
            effectName: "vertical",
            delay: 3000
        }, options);

        this.ext(this, {
            config: config,
            goodSlides: [],
            index: 0,
            handlers: {},
            active: config.effectName,
            activeP: config.effectName + "-p",
            activeFirst: config.effectName + "-first",
            activeNext: config.effectName + "-next",
            activePrev: config.effectName + "-prev",
            css3: true,
            itemCount: 0,
            lock: false
        });

        o.defineProperty(this, "index", {
            set: function (value) {
                this.number = value;
                this.next = this.goodSlides[value + 1];
                this.nextIndex = value + 1;
                if (!this.next) {
                    this.next = this.goodSlides[0];
                    this.nextIndex = 0;
                }
            },
            get: function () {
                return this.number;
            }
        });

        if (/MSIE 9/i.test(n.userAgent)) {
            this.active = "badie";
            this.css3 = false;
        }
        this.run = function () {
            //строим слайдер
            return this.buildSlider();
        };
        //Построение слайдера
        this.buildSlider = function () {
            this.slider = d.querySelector(config.sliderSelector);
            if (this.slider) {
                this.addClass(this.slider, "full-slider");
                this.navigateButtons();
                this.getAllSlides();
            } else {
                this.throwError("error", "Указан неправильный селектор контенера!!!");
                return false;
            }
        };
        this.navigateButtons = function () {
            this.next = d.querySelector(this.config.next);
            this.prev = d.querySelector(this.config.prev);

            if (this.next) {
                this.next.addEventListener("click", this.nextSlide, false);
            }
            if (this.prev) {
                this.prev.addEventListener("click", this.prevSlide, false);
            }
        };
        //Находим все слайды
        this.getAllSlides = function () {
            this.slides = this.slider.querySelectorAll(config.itemClass);
            if (this.slides.length) {
                this.imgLoad(0, function () {
                    delete this.slides;
                    this.index = config.startSlide;
                    this.emit("load");
                    this.addAnimationEndEvent();
                }.bind(this));
            } else {
                this.throwError("error", "Блок не содержит не одного слайда!!!");
                return;
            }
        };
        this.addAnimationEndEvent = function () {
            this.firstSlide();
            var ln = this.itemCount;
            while (ln--) {
                var slide = this.goodSlides[ln];
                this.prefixedEvent(slide, "AnimationEnd", this.cssAnimationEnd);
                this.prefixedEvent(slide, "AnimationStart", this.cssAnimationStart);
            }
        };
        this.firstSlide = function () {
            this.addClass(this.goodSlides[this.index], this.activeFirst);
            this.lock = true;
            timeout(function () {
                this.removeClass(this.goodSlides[this.index], this.activeFirst).addClass(this.goodSlides[this.index], this.active).addClass(this.next, this.activeNext);
                this.lock = false;
            }.bind(this), config.delay);
        };
        this.cssAnimationStart = function (e) {
            if (e.animationName === config.effectName || e.animationName === that.activeP) {
                clearTimeout(that.iterationTime);
                that.lock = true;
            }
        };
        this.cssAnimationEnd = function (e) {
            that.lock = false;
            if (e.animationName === that.active || e.animationName === that.activeP) {
                that.iterationTime = timeout(function () {
                    var current = that.goodSlides[that.index];
                    that.clearAttribute();
                    that.removeClass(current, that.active);
                    that.index < that.itemCount - 1 ? that.index++ : that.index = 0;
                    that.addClass(that.next, that.activeNext)
                        .removeClass(that.next, that.active)
                        .addClass(that.goodSlides[that.index], that.active)
                        .removeClass(that.goodSlides[that.index], that.activeNext);

                    that.emit("tic");
                }, config.delay);
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
            if (that.lock) return false;
            that.removeClass(that.goodSlides[that.index], that.active);
            clearTimeout(that.iterationTime);
            that.clearAttribute();
            switch (type) {
                case "next":
                    that.index < that.itemCount - 1 ? that.index++ : that.index = 0;
                    that.removeClass(that.goodSlides[that.index], that.activeNext)
                        .addClass(that.goodSlides[that.index], that.active)
                        .removeClass(that.next, that.active)
                        .addClass(that.next, that.activeNext);
                    break;
                case "prev":
                    that.setAttribute();
                    that.removeClass(that.goodSlides[that.nextIndex + 1 < that.itemCount ? that.nextIndex + 1 : 0], that.active)
                        .removeClass(that.next, that.activeNext)
                        .addClass(that.next, that.active)
                        .addClass(that.goodSlides[that.index], that.activeNext);
                    that.index > 0 ? that.index-- : that.index = that.itemCount - 1;
                    that.removeClass(that.next, that.active);
                    break;
            }
        };
        that = this;
    };

    FullPageSlider.prototype = {
        clearAttribute: function () {
            that.goodSlides[that.index].removeAttribute("name");
            that.goodSlides[that.nextIndex + 1 < that.itemCount ? that.nextIndex + 1 : 0].removeAttribute("name");
            that.next.removeAttribute("name");
        },
        setAttribute: function () {
            that.next.setAttribute("name", "prev");
            that.goodSlides[that.index].setAttribute("name", "prev");
        },
        imgLoad: function (i, back) {
            if (this.slides[i]) {
                var href = this.slides[i].getAttribute("data-image"), img;
                if (href) {
                    img = new Image();
                    img.src = href;
                    img.onload = function () {
                        this.slides[i].style.cssText += "background-image: url(" + href + ");";//Добавляем фон
                        this.goodSlides.push(this.slides[i]);
                        this.itemCount++;
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
            if (element) {
                if (element.classList) {
                    element.classList.remove(className);
                } else {
                    var re = new RegExp("(^|\\s)" + className + "(\\s|$)", "g");
                    element.className = element.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "")
                }
            }
            return {
                removeClass: that.removeClass,
                addClass: that.addClass
            };
        },
        addClass: function (element, className) {
            if (element) {
                if (element.classList) {
                    element.classList.add(className);
                } else {
                    element.className += " " + className;
                }
            }
            return {
                removeClass: that.removeClass,
                addClass: that.addClass
            };
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
        prefixedEvent: function (elem, type, callback, remove) {
            var pfx = ["webkit", ""];
            for (var p = 0; p < pfx.length; p++) {
                if (!pfx[p]) {
                    type = type.toLowerCase();
                }
                if (remove) {
                    elem.removeEventListener(pfx[p] + type, callback, false);
                } else {
                    elem.addEventListener(pfx[p] + type, callback, false);
                }
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
}(window, document, navigator, setTimeout, Object));