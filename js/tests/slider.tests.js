/**
 * Created by abaddon on 26.12.2014.
 */
describe("Test my slider", function () {
    var slider;
    beforeEach(function () {
        var sl = document.createElement('div');
        sl.id = "slider";
        sl.innerHTML = '<div class="item" data-image="img/1.jpg"></div>' +
            '<div class="item" data-image="img/2.jpg"></div>' +
            '<button class="nav prev">Назад</button>' +
            '<button class="nav next">Вперед</button>';
        document.body.appendChild(sl);

        slider = new FullPageSlider({
            sliderSelector: "#slider"
        });
    });
    //Test run slider form empty block
    it("Init slider", function () {
        expect(slider.run()).toBeUndefined();
        expect(slider.slider.classList).toContain("full-slider");
        var slider2 = new FullPageSlider();
        expect(slider2.run()).toBe(false);
        //slides
        expect(slider2.goodSlides.length).toBe(0);
        expect(slider2.slides).toBeUndefined();
    });
    //test addClass function
    it("Add class", function () {
        var testElement = document.querySelector("#slider"),
            testNames = ["testName", "testName2", "testName3"];
        testNames.forEach(function (name) {
            slider.addClass(testElement, name);
        });
        testNames.forEach(function (name) {
            expect(testElement.classList).toContain(name);
        });
    });
    //test removeClass function
    it("Remove class", function () {
        var testElement = document.querySelector("#slider"),
            testNames = ["testName", "testName2", "testName3"];
        testNames.forEach(function (name) {
            slider.addClass(testElement, name);
        });
        testNames.forEach(function (name) {
            slider.removeClass(testElement, name);
        });
        testNames.forEach(function (name) {
            expect(testElement.classList).not.toContain(name);
        });
    });
    //bind slider event
    it("Add handler for event", function () {
        var testHandler = function () {
            return true;
        }
        slider.on("load", testHandler);
        expect(slider.handlers['load']()).toBe(true);
    });
    //Emit slider event
    it("Emit event", function () {
        var flag = false;
        var testHandler = function () {
            flag = true;
            return true;
        }
        slider.on("load", testHandler);
        slider.emit("load");
        expect(flag).toBe(true);
    });
    //Object extension function
    it("Extension object", function () {
        var operand = {
            "name": "puh",
            "age": 12
        };

        var subject = {
            "soname": "hod"
        };
        slider.ext(subject, operand);
        expect(subject.name).toBe("puh");
        expect(subject.age).toBe(12);
    });
})
;