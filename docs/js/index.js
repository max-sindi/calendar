'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DateController = function DateController(props) {
  _classCallCheck(this, DateController);

  var calendar = props.controlledCalendar;

  this.controlledCalendar = calendar;
  this.controlledSlider = calendar.slider;

  this.dateControllerDom = $('<div class="date-controll></div>');
  // this.yearSelector = $('<select></select>');
  // this.controlledCalendar.prepend
};

var Slider = function () {
  function Slider(props) {
    _classCallCheck(this, Slider);

    this.dom = $('<div id="calendar-slider"></div>').css({
      width: props.dayWidth * 7 + 30,
      height: '100%',
      border: '5px solid olive',
      position: 'absolute',
      top: '0',
      left: '0'
    });

    this.calendar = props.calendar;
    this.calendarDom = $(this.calendar.calendarPaper);
    this.domParams = null;

    this.dom.mousedown(this.startGrab.bind(this));
    // prevent browser's drag'n'drop
    this.dom[0].ondragstart = function () {
      return false;
    };
  }

  _createClass(Slider, [{
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
    key: 'movingToPosition',
    value: function movingToPosition(leftPosition) {
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

  this.target = $(props.target);
  this.targetDom = props.target[0];

  var width = '760';

  this.calendarPaper = $('<div class="calendar-paper"></div>').css({
    width: width,
    height: '380',
    background: 'url(../img/forebruary-body.jpg) center center / cover',
    padding: '20',
    position: 'relative'
  });
  this.target.prepend(this.calendarPaper);

  var sliderParams = {
    dayWidth: Math.floor(+width / 13),
    calendar: this
  };

  this.slider = new Slider(sliderParams);
  this.calendarPaper.prepend(this.slider.dom);

  this.dateController = new DateController({
    controlledCalendar: this
  });
  this.target.prepend(this.dateController.dateControllerDom);
};

var b = new Calendar({
  target: $('#calendar-test')
});

var date = new Date();
console.log(date.getDay());