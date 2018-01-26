class DateSelector {
  constructor(props) {
    if(!props.dateController) {
      throw new Error("Selector must have dateController");
    }

    const type = this.type = props.type;
    this.props = props;
    this.dateController = props.dateController;

    var htmlClasses = `calendar__select calendar__select--${type}`;
    this.selectorDom = $(`<select class=${htmlClasses}></select>`)
                     .on('change', this.selectChangeHandler.bind(this));

    this.initFunction(type);
  }

  // initControls() {
  //   this.
  // }

  initFunction(type) {
    if(!type) {
      throw new Error('function was invovled without argument: type');
    }

    let func = 'initOptions' + capitalizeString(type);
    this[func]();

    function capitalizeString(str) {
      return str[0].toUpperCase() + str.substr(1);
    }
  }

  initOptionsYear() {
    const years = this.props.years,
          selectedYear = this.dateController.selectedDate.year;

    let i = years.finish - years.start;
    // Fill select with options.
    for(i; i > 0; i--) {
      let value = years.finish - i,
          option = $(`<option value="${value}">${value}</option>`);
      // set in which year is selected
      if(value === selectedYear) {
        option[0].selected = true;
      }

      this.selectorDom.prepend(option);
    }
  }

  initOptionsMonth() {
    const monthes = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль',
                     'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
          selectedMonth = this.dateController.selectedDate.month;

    for(let i = 11; i >= 0; i--) {
      let option = $(`<option value="${i}">${monthes[i]}</option>`);
      // Setting selected month
      if(i === selectedMonth) {
        option[0].selected = true;
      }

      this.selectorDom.prepend(option);
    }
  }

  selectChangeHandler(e) {
    let value = +(e.target.value);
    this.dateController.changeSelectedDate(this.type, value);
  }
}
