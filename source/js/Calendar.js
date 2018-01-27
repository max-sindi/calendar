class Calendar {
  constructor(props) {
    if(!props.id) {
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

    if(props.customStyles) {
      this.applyCustomStyles();
    }
  }

  applyCustomStyles() {
    appllyCalendarCss(this);
    applySliderCss(this);

    function appllyCalendarCss(that) {
      const width = 760;
      const css = {
        width: width,
        height: '380',
        background: 'url(../img/forebruary-body.jpg) no-repeat center center / cover content-box',
        padding: '20px 15px',
        position: 'relative'
      }

      that.calendarPaper.css(css);
      that.columnWidth = width / 13;
    }

    function applySliderCss(that) {
      const cssOuter = {
          width: that.columnWidth * 7 + 40,
          height: '100%',
          position: 'absolute',
          top: '0',
          // left: '0',
          boxSizing: 'border-box',
          boxShadow: '0 0 10px 0 #e6e7e9',
          border: '20px solid #fafafa',
          cursor: "col-resize",
        },
        cssInnerFrame = {
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          boxShadow: 'inset 0 0 10px 0 #afb0b2',
        },
        cssDaysPointer = {
          display: 'flex',
          justifyContent: 'space-between',
          textAlign: 'center',
        },
        cssDaysPointer__Day = {
          flexGrow: '1',
        },
        sliderDom = that.slider.dom;

      applyCss(
        [{
          obj: sliderDom,
          css: cssOuter,
        },{
          obj: sliderDom.innerFrame,
          css: cssInnerFrame,
        },{
          obj: sliderDom.daysPointer,
          css: cssDaysPointer,
        },{
          obj: sliderDom.daysPointer.children(),
          css: cssDaysPointer__Day,
        }]
      );

      function applyCss(arr) {
        arr.forEach( (item, index) => {
          item.obj.css(item.css);
        });
      }
    }
  }

  createSelectorsStore() {
    const commonId = this.props.id;

    const
      classes = {
        calendarOuter: `calendar-paper ${commonId}-calendar-paper`,
      },
      ids = {
        calendarOuter: `${commonId}-calendar-paper`,
      };

    return { classes, ids, };
  }

  calcColumnWidth() {
    const width = this.calendarPaper.width();
    return Math.floor( +width / 13 );
  }

  createCalendarDom() {
    let selectors = this.htmlSelectors;

    return $(`<div class=${selectors.classes.calendarOuter}
                      id=${selectors.ids.calendarOuter}></div>`);
  }

  createSlider() {
    const slider = new Slider({
      controlledCalendar: this
    });
    this.calendarPaper.prepend(slider.dom);
    return slider;
  }

  createDateController() {
    const dateController = new DateController({
      controlledCalendar: this
    });
    this.target.prepend(dateController.dateControllerDom);
    return dateController;
  }
}
