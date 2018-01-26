class Slider {
  constructor(props) {
    this.controlledCalendar = props.controlledCalendar;
    this.calendarDom = $(this.controlledCalendar.calendarPaper);

    this.createDom();

    this.domParams = null;

    this.listenToGrabbing();

    this.daysGrid = this.createDaysGrid();
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

    createOuterDom(this);
    createrInnerFrame(this);
    createDaysPointer(this);

    function createOuterDom(that) {
      const borderWidth = 20,
            columnWidth = that.controlledCalendar.columnWidth,
            fullWidth = columnWidth * 7 + borderWidth * 2;

      const dom = $(`<div id="calendar-slider__wrapper"></div>`).css({
        width: fullWidth,
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        boxShadow: '0 0 10px 0 #e6e7e9',
        border: borderWidth + 'px solid #fafafa',
      });

      that.dom = dom;
      that.dom.borderWidth = borderWidth;
    }

    function createrInnerFrame(that) {
      const domInsideFrame = $('<div id="calendar-slider__inner"></div>').css({
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        boxShadow: 'inset 0 0 10px 0 #aFb0b2',
      });

      that.dom.prepend(domInsideFrame);
    }

    function createDaysPointer(that) {
      const daysPointer = $(`<div class="days-pointer"></div>`).css({
        display: 'flex',
        justifyContent: 'space-between',
        textAlign: 'center',
      });

      const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

      for(let i = 6; i >= 0; i--) {
        let day = $(`<div class="days-pointer__day"> ${days[i]} </div>`).css({
          flexGrow: '1'
        })

        daysPointer.prepend(day);
      }

      that.dom.prepend(daysPointer);
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
        frequency = 5, // the lower the faster
        i = 0,
        step = requireDistance / fluency;

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
