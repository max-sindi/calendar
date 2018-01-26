class Calendar {
  constructor(props) {
    let idSelector = '#' + props.id;
    this.props = props;
    this.target = $(idSelector);

    this.calendarPaper = $(`<div class="calendar-paper"></div>`);

    if(props.customStyles) {

      let width = '760';
      let calendarPaperStyles = {
        width: width,
        height: '380',
        background: 'url(../img/forebruary-body.jpg) no-repeat center center / cover content-box',
        padding: '20px 15px',
        position: 'relative'
      };

      this.calendarPaper.css(calendarPaperStyles);
      this.columnWidth = Math.floor( +width / 13 );
    } else {
      let width = $(idSelector).css('width');
      this.columnWidth = Math.floor( +width / 13 )
    }
    // debugger

    this.target.prepend(this.calendarPaper);

    // create slider
    let sliderParams = {
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
  }
}
