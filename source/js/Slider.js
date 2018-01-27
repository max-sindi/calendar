class Slider {
  constructor(props) {
    this.controlledCalendar = props.controlledCalendar;
    this.calendarDom = $(this.controlledCalendar.calendarPaper);

    this.dom = this.createDom();

    this.domParams = null;

    this.daysGrid = this.createDaysGrid();

    this.listenToGrabbing();
  }

  createDaysGrid() {
    let daysGrid = [],
        columnWidth = this.controlledCalendar.columnWidth;

    for(let i = 0; i < 7; i++) {
      daysGrid.push(columnWidth * i);
    }

    return daysGrid;
  }

  moveToColumn(columnNumber) {
    let columnInGrid = this.daysGrid[columnNumber];
    this.moveToPosition(columnInGrid);
  }

  listenToGrabbing() {
    this.dom.mousedown( this.startGrab.bind(this) );

    /* prevent browser's drag'n'drop */
    this.dom[0].ondragstart = () => {
      return false;
    };
  }

  createDom() {
    let sliderDom = $(`<div id="calendar-slider__wrapper"></div>`);
    sliderDom.innerFrame = $('<div id="calendar-slider__inner"></div>');
    sliderDom.daysPointer = createDaysPointer();

    sliderDom.prepend( sliderDom.innerFrame );
    sliderDom.prepend( sliderDom.daysPointer );

    return sliderDom;

    function createDaysPointer() {
      const daysDom = $(`<div class="days-pointer"></div>`),
            days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

      for(let i = 6; i >= 0; i--) {
        let day = $(`<div class="days-pointer__day">${days[i]}</div>`);
        daysDom.prepend(day);
      }

      return daysDom;
    }
  }

  validateMovingCoordinate(coordinate) {
    let left = coordinate,
        { sliderWidth, calendarOuterWidth } = this.domParams;

    if( left <= 0) {
      left = 0;
    } else if ( (left + sliderWidth) >= calendarOuterWidth) {
      left = calendarOuterWidth - sliderWidth;
    }

    return left;
  }

  moveToPosition(leftPosition) {
    this.defineDomParams();

    let slider = this.dom,
        left = this.validateMovingCoordinate( leftPosition );

    let currentLeft = slider.position().left,
        requireDistance = currentLeft - left,
        fluency = 50,
        frequency = 1, // the lower the faster
        step = requireDistance / fluency,
        i = 0;

    // each iteration  will be move slider at one step
    let timer = setInterval( () => {
      if( i-1 === fluency) {
        clearInterval(timer);
        return;
      }

      slider.css('left', currentLeft - (step * i) );
      i++;

    }, frequency);
  }

  defineDomParams() {
    this.domParams = {
      calendarOuterWidth: this.calendarDom.outerWidth(),
      calendarPageToLeft: this.calendarDom.offset().left,
      sliderWidth: this.dom.outerWidth(),
    }
  }

  grabbing(e) {
    let slider = this.dom,
        { sliderPageToLeft } = this.domParams,
        nextCoordinate = this.validateMovingCoordinate( e.pageX - sliderPageToLeft );

    // moving
    slider.css("left", nextCoordinate);
  }

  startGrab(e) {
    let slider = this.dom;

    this.defineDomParams();
    this.domParams.sliderPageToLeft = e.pageX - slider.offset().left;

    slider.mousemove( this.grabbing.bind(this) );

    $('body').mouseup( () => {
      slider.off( 'mousemove' );
    });
  }
}
