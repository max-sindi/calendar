'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DateSelector = function () {
  function DateSelector(props) {
    _classCallCheck(this, DateSelector);

    if (!props.dateController) {
      throw new Error("Selector must have dateController");
    }

    var type = this.type = props.type;
    this.props = props;
    this.dateController = props.dateController;

    var htmlClasses = 'calendar__select calendar__select--' + type;
    this.selectorDom = $('<select class=' + htmlClasses + '></select>').on('change', this.selectChangeHandler.bind(this));

    this.initFunction(type);
  }

  // initControls() {
  //   this.
  // }

  _createClass(DateSelector, [{
    key: 'initFunction',
    value: function initFunction(type) {
      if (!type) {
        throw new Error('function was invovled without argument: type');
      }

      var func = 'initOptions' + capitalizeString(type);
      this[func]();

      function capitalizeString(str) {
        return str[0].toUpperCase() + str.substr(1);
      }
    }
  }, {
    key: 'initOptionsYear',
    value: function initOptionsYear() {
      var years = this.props.years,
          selectedYear = this.dateController.selectedDate.year;

      var i = years.finish - years.start;
      // Fill select with options.
      for (i; i > 0; i--) {
        var value = years.finish - i,
            option = $('<option value="' + value + '">' + value + '</option>');
        // set in which year is selected
        if (value === selectedYear) {
          option[0].selected = true;
        }

        this.selectorDom.prepend(option);
      }
    }
  }, {
    key: 'initOptionsMonth',
    value: function initOptionsMonth() {
      var monthes = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
          selectedMonth = this.dateController.selectedDate.month;

      for (var i = 11; i >= 0; i--) {
        var option = $('<option value="' + i + '">' + monthes[i] + '</option>');
        // Setting selected month
        if (i === selectedMonth) {
          option[0].selected = true;
        }

        this.selectorDom.prepend(option);
      }
    }
  }, {
    key: 'selectChangeHandler',
    value: function selectChangeHandler(e) {
      var value = +e.target.value;
      this.dateController.changeSelectedDate(this.type, value);
    }
  }]);

  return DateSelector;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DateController = function () {
  function DateController(props) {
    _classCallCheck(this, DateController);

    var calendar = props.controlledCalendar;

    this.controlledCalendar = calendar;
    this.controlledSlider = calendar.slider;

    this.dateControllerDom = this.createDateControllerDom();

    this.currentDate = new Date();
    this.selectedDate = {
      year: this.currentDate.getFullYear(),
      month: this.currentDate.getMonth()
    };

    this.yearSelector = this.createYearSelect();
    this.monthSelector = this.createMonthSelect();
    this.dateHiddenInput = this.createHiddenInput();

    this.initedSelectedDate = this.initDate(this.selectedDate);

    this.daysGrid = this.controlledSlider.daysGrid;
  }

  _createClass(DateController, [{
    key: 'createDateControllerDom',
    value: function createDateControllerDom() {
      return $('<div class="date-controll"></div>');
    }
  }, {
    key: 'createHiddenInput',
    value: function createHiddenInput() {
      var localValue = window.localStorage.getItem('last-date');
      var value = void 0,
          hiddenInput = void 0;

      if (localValue) {
        value = localValue;
      } else {
        value = this.toNormalView(new Date());
      }

      hiddenInput = $('<input class="calendar__hidden-input"\n                                  type="text"\n                                  value=' + value + '>');

      this.dateControllerDom.prepend(hiddenInput);
      return hiddenInput;
    }
  }, {
    key: 'toNormalView',
    value: function toNormalView(date) {
      var monthNormalView = date.getMonth() + 1;

      if (monthNormalView < 10) {
        monthNormalView = '0' + monthNormalView;
      }

      return monthNormalView + '.' + date.getFullYear();
    }
  }, {
    key: 'createYearSelect',
    value: function createYearSelect() {
      var selectParams = {
        dateController: this,
        type: 'year',
        years: {
          start: 2000,
          finish: 2020
        }
      };

      var yearSelector = new DateSelector(selectParams);
      this.dateControllerDom.prepend(yearSelector.selectorDom);
      return yearSelector;
    }
  }, {
    key: 'createMonthSelect',
    value: function createMonthSelect() {
      var selectParams = {
        dateController: this,
        type: 'month'
      };

      var monthSelector = new DateSelector(selectParams);
      this.dateControllerDom.prepend(monthSelector.selectorDom);
      return monthSelector;
    }
  }, {
    key: 'changeSelectedDate',
    value: function changeSelectedDate(param, value) {
      this.selectedDate[param] = value;
      this.initedSelectedDate = this.initDate(this.selectedDate);
      this.setSlider();
    }
  }, {
    key: 'setSlider',
    value: function setSlider() {
      this.moveSliderToMonth(this.initedSelectedDate.monthInitedStartDay);
    }
  }, {
    key: 'initDate',
    value: function initDate(date) {
      var year = date.year,
          month = date.month;

      var initedDate = new Date(year, month);

      return {
        initedDate: initedDate,
        year: year,
        month: month,
        day: initedDate.getDay(),
        get monthInit() {
          return new Date(year, month, 1, 0);
        },
        get monthInitedStartDay() {
          return this.monthInit.getDay();
        }
      };
    }
  }, {
    key: 'moveSliderToMonth',
    value: function moveSliderToMonth(monthFirstDay) {
      var firstDayColumn = 7;

      if (monthFirstDay === 0) {
        monthFirstDay = firstDayColumn;
      }

      this.controlledSlider.moveToColumn(firstDayColumn - monthFirstDay);
    }
  }]);

  return DateController;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Slider = function () {
  function Slider(props) {
    _classCallCheck(this, Slider);

    this.controlledCalendar = props.controlledCalendar;
    this.calendarDom = $(this.controlledCalendar.calendarPaper);

    this.dom = this.createDom();

    this.domParams = null;

    this.daysGrid = this.createDaysGrid();

    this.listenToGrabbing();
  }

  _createClass(Slider, [{
    key: 'createDaysGrid',
    value: function createDaysGrid() {
      var daysGrid = [],
          columnWidth = this.controlledCalendar.columnWidth;

      for (var i = 0; i < 7; i++) {
        daysGrid.push(columnWidth * i);
      }

      return daysGrid;
    }
  }, {
    key: 'moveToColumn',
    value: function moveToColumn(columnNumber) {
      var columnInGrid = this.daysGrid[columnNumber];
      this.moveToPosition(columnInGrid);
    }
  }, {
    key: 'listenToGrabbing',
    value: function listenToGrabbing() {
      this.dom.mousedown(this.startGrab.bind(this));

      /* prevent browser's drag'n'drop */
      this.dom[0].ondragstart = function () {
        return false;
      };
    }
  }, {
    key: 'createDom',
    value: function createDom() {
      var sliderDom = $('<div id="calendar-slider__wrapper"></div>');
      sliderDom.innerFrame = $('<div id="calendar-slider__inner"></div>');
      sliderDom.daysPointer = createDaysPointer();

      sliderDom.prepend(sliderDom.innerFrame);
      sliderDom.prepend(sliderDom.daysPointer);

      return sliderDom;

      function createDaysPointer() {
        var daysDom = $('<div class="days-pointer"></div>'),
            days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

        for (var i = 6; i >= 0; i--) {
          var day = $('<div class="days-pointer__day">' + days[i] + '</div>');
          daysDom.prepend(day);
        }

        return daysDom;
      }
    }
  }, {
    key: 'validateMovingCoordinate',
    value: function validateMovingCoordinate(coordinate) {
      var left = coordinate,
          _domParams = this.domParams,
          sliderWidth = _domParams.sliderWidth,
          calendarOuterWidth = _domParams.calendarOuterWidth;


      if (left <= 0) {
        left = 0;
      } else if (left + sliderWidth >= calendarOuterWidth) {
        left = calendarOuterWidth - sliderWidth;
      }

      return left;
    }
  }, {
    key: 'moveToPosition',
    value: function moveToPosition(leftPosition) {
      this.defineDomParams();

      var slider = this.dom,
          left = this.validateMovingCoordinate(leftPosition);

      var currentLeft = slider.position().left,
          requireDistance = currentLeft - left,
          fluency = 50,
          frequency = 1,
          // the lower the faster
      step = requireDistance / fluency,
          i = 0;

      // each iteration  will be move slider at one step
      var timer = setInterval(function () {
        if (i - 1 === fluency) {
          clearInterval(timer);
          return;
        }

        slider.css('left', currentLeft - step * i);
        i++;
      }, frequency);
    }
  }, {
    key: 'defineDomParams',
    value: function defineDomParams() {
      this.domParams = {
        calendarOuterWidth: this.calendarDom.outerWidth(),
        calendarPageToLeft: this.calendarDom.offset().left,
        sliderWidth: this.dom.outerWidth()
      };
    }
  }, {
    key: 'grabbing',
    value: function grabbing(e) {
      var slider = this.dom,
          sliderPageToLeft = this.domParams.sliderPageToLeft,
          nextCoordinate = this.validateMovingCoordinate(e.pageX - sliderPageToLeft);

      // moving
      slider.css("left", nextCoordinate);
    }
  }, {
    key: 'startGrab',
    value: function startGrab(e) {
      var slider = this.dom;

      this.defineDomParams();
      this.domParams.sliderPageToLeft = e.pageX - slider.offset().left;

      slider.mousemove(this.grabbing.bind(this));

      $('body').mouseup(function () {
        slider.off('mousemove');
      });
    }
  }]);

  return Slider;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Calendar = function () {
  function Calendar(props) {
    _classCallCheck(this, Calendar);

    if (!props.id) {
      throw new Error('Calendar must have id parameter');
    }

    this.props = props;
    this.htmlSelectors = this.createSelectorsStore();

    this.idSelector = '#' + props.id;
    this.target = $(this.idSelector);

    this.calendarPaper = this.createCalendarDom();
    this.target.prepend(this.calendarPaper);

    this.columnWidth = this.calcColumnWidth();

    this.slider = this.createSlider();
    this.dateController = this.createDateController();

    if (props.customStyles) {
      this.applyCustomStyles();
    }
  }

  _createClass(Calendar, [{
    key: 'applyCustomStyles',
    value: function applyCustomStyles() {
      appllyCalendarCss(this);
      applySliderCss(this);

      function appllyCalendarCss(that) {
        var width = 760;
        var css = {
          width: width,
          height: '380',
          background: 'url(../img/forebruary-body.jpg) no-repeat center center / cover content-box',
          padding: '20px 15px',
          position: 'relative'
        };

        that.calendarPaper.css(css);
        that.columnWidth = width / 13;
      }

      function applySliderCss(that) {
        var cssOuter = {
          width: that.columnWidth * 7 + 40,
          height: '100%',
          position: 'absolute',
          top: '0',
          // left: '0',
          boxSizing: 'border-box',
          boxShadow: '0 0 10px 0 #e6e7e9',
          border: '20px solid #fafafa',
          cursor: "col-resize"
        },
            cssInnerFrame = {
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          boxShadow: 'inset 0 0 10px 0 #afb0b2'
        },
            cssDaysPointer = {
          display: 'flex',
          justifyContent: 'space-between',
          textAlign: 'center'
        },
            cssDaysPointer__Day = {
          flexGrow: '1'
        },
            sliderDom = that.slider.dom;

        applyCss([{
          obj: sliderDom,
          css: cssOuter
        }, {
          obj: sliderDom.innerFrame,
          css: cssInnerFrame
        }, {
          obj: sliderDom.daysPointer,
          css: cssDaysPointer
        }, {
          obj: sliderDom.daysPointer.children(),
          css: cssDaysPointer__Day
        }]);

        function applyCss(arr) {
          arr.forEach(function (item, index) {
            item.obj.css(item.css);
          });
        }
      }
    }
  }, {
    key: 'createSelectorsStore',
    value: function createSelectorsStore() {
      var commonId = this.props.id;

      var classes = {
        calendarOuter: 'calendar-paper ' + commonId + '-calendar-paper'
      },
          ids = {
        calendarOuter: commonId + '-calendar-paper'
      };

      return { classes: classes, ids: ids };
    }
  }, {
    key: 'calcColumnWidth',
    value: function calcColumnWidth() {
      var width = this.calendarPaper.width();
      return Math.floor(+width / 13);
    }
  }, {
    key: 'createCalendarDom',
    value: function createCalendarDom() {
      var selectors = this.htmlSelectors;

      return $('<div class=' + selectors.classes.calendarOuter + '\n                      id=' + selectors.ids.calendarOuter + '></div>');
    }
  }, {
    key: 'createSlider',
    value: function createSlider() {
      var slider = new Slider({
        controlledCalendar: this
      });
      this.calendarPaper.prepend(slider.dom);
      return slider;
    }
  }, {
    key: 'createDateController',
    value: function createDateController() {
      var dateController = new DateController({
        controlledCalendar: this
      });
      this.target.prepend(dateController.dateControllerDom);
      return dateController;
    }
  }]);

  return Calendar;
}();
'use strict';

var b = new Calendar({
  id: 'calendar-test',
  customStyles: true,
  year: {
    start: 2000,
    finish: 2022
  }
});