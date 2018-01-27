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

    this.yearSelector = createYearSelect();
    this.monthSelector = createMonthSelect();
    this.createHiddenInput = createHiddenInput();

    this.initedSelectedDate = this.initDate(this.selectedDate);

    this.daysGrid = this.controlledSlider.daysGrid;

  }

  createDateControllerDom() {
    this.dateControllerDom = $('<div class="date-controll"></div>');
  }

  createHiddenInput() {
    const value,
          localValue = window.localStorage.getValue('last-date');

    if(localValue) {
      value = localValue;
    } else {
      value = ``
    }

    const hiddenInput = $(`<input class="calendar__hidden-input"
                                  type="input"
                                  value=""`)
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

    const yearSelector = new DateSelector(selectParams);
    this.dateControllerDom.prepend(yearSelector.selectorDom);
    return yearSelector;
  }

  createMonthSelect() {
    const selectParams = {
      dateController: this,
      type: 'month',
    }

    const monthSelector = new DateSelector(selectParams);
    this.dateControllerDom.prepend(monthSelector.selectorDom);
    return monthSelector;
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
