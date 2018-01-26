class DateController {
  constructor(props) {
    let calendar = props.controlledCalendar;

    this.controlledCalendar = calendar;
    this.controlledSlider = calendar.slider;

    this.createDateControllerDom();

    this.currentDate = new Date();
    this.selectedDate = {
      year: this.currentDate.getFullYear(),
      month: this.currentDate.getMonth(),
    }

    this.createYearSelect();
    this.createMonthSelect();

    this.initedSelectedDate = this.initDate(this.selectedDate);
    this.setSlider();
  }

  createDateControllerDom() {
    this.dateControllerDom = $('<div class="date-controll"></div>');
  }

  createYearSelect() {
    const selectParams = {
      dateController: this,
      type: 'year',
      years: {
        start: 2000,
        finish: 2020,
      }
    };

    this.yearSelector = new DateSelector(selectParams);
    this.dateControllerDom.prepend(this.yearSelector.selectorDom);
  }

  createMonthSelect() {
    const selectParams = {
      dateController: this,
      type: 'month',
    }

    this.monthSelector = new DateSelector(selectParams);
    this.dateControllerDom.prepend(this.monthSelector.selectorDom);
  }

  changeSelectedDate(param, value) {
    this.selectedDate[param] = value;
    this.initedSelectedDate = this.initDate(this.selectedDate);
    this.setSlider();
  }

  setSlider() {
    this.moveSliderToMonth(this.initedSelectedDate.monthInitedStartDay);
  }

  initDate(date) {
    let { year, month } = date;
    let initedDate = new Date(year, month);

    return {
      initedDate,
      year,
      month,
      day: initedDate.getDay(),
      get monthInit() {
        return new Date(year, month, 1, 0);
      },
      get monthInitedStartDay() {
        return this.monthInit.getDay();
      }
    }
  }

  moveSliderToMonth(monthFirstDay) {
    const firstDayColumn = 7;

    if(monthFirstDay === 0) {
      monthFirstDay = firstDayColumn;
    }

    this.controlledSlider.moveToColumn(firstDayColumn - monthFirstDay);
  }
}
