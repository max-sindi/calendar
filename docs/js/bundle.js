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

var DateController = function () {
  function DateController(props) {
    _classCallCheck(this, DateController);

    var calendar = props.controlledCalendar;

    this.controlledCalendar = calendar;
    this.controlledSlider = calendar.slider;

    this.createDateControllerDom();

    this.currentDate = new Date();
    this.selectedDate = {
      year: this.currentDate.getFullYear(),
      month: this.currentDate.getMonth()
    };

    this.createYearSelect();
    this.createMonthSelect();

    this.initedSelectedDate = this.initDate(this.selectedDate);
    this.setSlider();
  }

  _createClass(DateController, [{
    key: 'createDateControllerDom',
    value: function createDateControllerDom() {
      this.dateControllerDom = $('<div class="date-controll"></div>');
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

      this.yearSelector = new DateSelector(selectParams);
      this.dateControllerDom.prepend(this.yearSelector.selectorDom);
    }
  }, {
    key: 'createMonthSelect',
    value: function createMonthSelect() {
      var selectParams = {
        dateController: this,
        type: 'month'
      };

      this.monthSelector = new DateSelector(selectParams);
      this.dateControllerDom.prepend(this.monthSelector.selectorDom);
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

var Slider = function () {
  function Slider(props) {
    _classCallCheck(this, Slider);

    this.controlledCalendar = props.controlledCalendar;
    this.calendarDom = $(this.controlledCalendar.calendarPaper);

    this.createDom();

    this.domParams = null;

    this.listenToGrabbing();

    this.daysGrid = this.createDaysGrid();
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

      createOuterDom(this);
      createrInnerFrame(this);
      createDaysPointer(this);

      function createOuterDom(that) {
        var borderWidth = 20,
            columnWidth = that.controlledCalendar.columnWidth,
            fullWidth = columnWidth * 7 + borderWidth * 2;

        var dom = $('<div id="calendar-slider__wrapper"></div>').css({
          width: fullWidth,
          height: '100%',
          position: 'absolute',
          top: '0',
          left: '0',
          boxSizing: 'border-box',
          boxShadow: '0 0 10px 0 #e6e7e9',
          border: borderWidth + 'px solid #fafafa'
        });

        that.dom = dom;
        that.dom.borderWidth = borderWidth;
      }

      function createrInnerFrame(that) {
        var domInsideFrame = $('<div id="calendar-slider__inner"></div>').css({
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          boxShadow: 'inset 0 0 10px 0 #aFb0b2'
        });

        that.dom.prepend(domInsideFrame);
      }

      function createDaysPointer(that) {
        var daysPointer = $('<div class="days-pointer"></div>').css({
          display: 'flex',
          justifyContent: 'space-between',
          textAlign: 'center'
        });

        var days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

        for (var i = 6; i >= 0; i--) {
          var day = $('<div class="days-pointer__day"> ' + days[i] + ' </div>').css({
            flexGrow: '1'
          });

          daysPointer.prepend(day);
        }

        that.dom.prepend(daysPointer);
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
          frequency = 5,
          // the lower the faster
      i = 0,
          step = requireDistance / fluency;

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

var Calendar = function Calendar(props) {
  _classCallCheck(this, Calendar);

  var idSelector = '#' + props.id;
  this.props = props;
  this.target = $(idSelector);

  this.calendarPaper = $('<div class="calendar-paper"></div>');

  if (props.customStyles) {

    var width = '760';
    var calendarPaperStyles = {
      width: width,
      height: '380',
      background: 'url(../img/forebruary-body.jpg) no-repeat center center / cover content-box',
      padding: '20px 15px',
      position: 'relative'
    };

    this.calendarPaper.css(calendarPaperStyles);
    this.columnWidth = Math.floor(+width / 13);
  } else {
    var _width = $(idSelector).css('width');
    this.columnWidth = Math.floor(+_width / 13);
  }
  // debugger

  this.target.prepend(this.calendarPaper);

  // create slider
  var sliderParams = {
    columnWidth: this.columnWidth,
    calendar: this
  };
  this.slider = new Slider({
    controlledCalendar: this
  });
  this.calendarPaper.prepend(this.slider.dom);

  // create date cotrollers
  this.dateController = new DateController({
    controlledCalendar: this
  });
  this.target.prepend(this.dateController.dateControllerDom);
};

'use strict';

var b = new Calendar({
  id: 'calendar-test',
  customStyles: true,
  year: {
    start: 2000,
    finish: 2022
  }
});