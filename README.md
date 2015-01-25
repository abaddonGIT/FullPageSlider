FullPageSlider
==============
Полноэкранный слайдер на чистом js с css3 анимацией. ([Демо](http://abaddongit.github.io/FullPageSlider/))



###Поддержка браузеров:
- **IE >= 10**
- **Chrome**
- **FireFox**
- **Opera**
- **Safary >= 5.1**

###Установка:
    <link href="dist/css/slider.min.css" rel="stylesheet" type="text/css" />
    <script src="dist/js/fullPageSlider.min.js"></script>
###Параметры:
- **sliderSelector** - селектор блока с содержимым для слайдера
- **startSlide** - индекс стартовой позиции
- **next** - селектор кнопки "Вперед"
- **prev** - селектор кнопки "Назад"
- **itemClass** - селектор слайда
- **effectName** - название эффекта используемого для показа слайдов

###Запуск
####html:
    <div id="slider">
        <div class="item" data-image="img/1.jpg"></div>
        <div class="item" data-image="img/2.jpg"></div>
        <div class="item" data-image="img/3.jpg"></div>
        <div class="item" data-image="img/4.jpg"></div>
        <div class="item" data-image="img/5.jpg"></div>
        <div class="item" data-image="img/6.jpg"></div>
        <div class="item" data-image="img/7.jpg"></div>
        <button class="nav prev">Назад</button>
        <button class="nav next">Вперед</button>
    </div>
####js:

    var slider = new FullPageSlider({
        sliderSelector: "#slider",
        itemClass: ".item"
    });
    slider.run();
    slider.on("load", function () {
        console.log("i am loaded!!!");
    });
    slider.on("tic", function () {
        console.log("slide changed!!!");
    });
###События
- **load** - слайдер готов к использованию
- **tic** - вызывается при каждой анимации
- **next** - переключение на следующий слайд
- **prev** - переключение на предыдущий сайт