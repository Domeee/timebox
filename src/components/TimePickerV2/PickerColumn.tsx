import * as React from "react";
import PickerItem from "./PickerItem";
import "./PickerColumn.scss";
import ScrollInteractionHelper from "./ScrollInteractionHelper";

export interface PickerColumnProps {
  options: number[];
  name: string;
  value: number;
  itemHeight: number;
  columnHeight: number;
  onChange(option: string, value: number): void;
  onClick(option: string, value: number): void;
}

interface PickerColumnState {
  isMoving: boolean;
  startTouchY: number;
  startScrollTranslate: number;
  scrollTranslate: number;
  minTranslate: number;
  maxTranslate: number;
  transitionDuration: number;
  transitionTimingFunction: string;
}

class PickerColumn extends React.Component<
  PickerColumnProps,
  PickerColumnState
> {
  // Strength of a touch push in terms of distance distance traveled for a push
  private static readonly TouchPushSpeedFactor = 4;
  // Minimum scroll distance to be treated as push interaction
  private static readonly PushInteractionThreshold = 0;
  private static readonly ClickInteractionTransitionDuration = 200;
  private static readonly ClickInteractionTransitionTimingFucntion = "linear";
  private touchHistory: number[] = [];
  private ref: React.RefObject<HTMLDivElement>;
  private static readonly PushInteractionTransitionDuration = 2000;

  constructor(props: PickerColumnProps) {
    super(props);

    this.ref = React.createRef();

    this.state = {
      isMoving: false,
      startTouchY: 0,
      startScrollTranslate: 0,
      transitionDuration: 0,
      transitionTimingFunction:
        PickerColumn.ClickInteractionTransitionTimingFucntion,
      ...this.computeTranslate(props)
    };
  }

  public componentWillReceiveProps(nextProps: PickerColumnProps) {
    if (this.state.isMoving) {
      return;
    }
    this.setState(this.computeTranslate(nextProps));
  }

  public render() {
    const translateString = `translate(0, ${this.state.scrollTranslate}px)`;
    const style: React.CSSProperties = {
      OTransform: translateString,
      WebkitTransform: translateString,
      transform: translateString,
      transitionProperty: "transform",
      transitionDuration: `${this.state.transitionDuration}ms`,
      transitionTimingFunction: this.state.transitionTimingFunction
    };
    const items = this.props.options.map(option => {
      return (
        <PickerItem
          key={option}
          itemHeight={this.props.itemHeight}
          option={option}
          value={this.props.value}
        />
      );
    });
    return (
      <div className="picker-column">
        <div
          ref={this.ref}
          style={style}
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          onTouchEnd={this.handleTouchEnd}
          onTouchCancel={this.handleTouchCancel}
        >
          {items}
        </div>
      </div>
    );
  }

  private computeTranslate = (props: PickerColumnProps) => {
    const { options, value, itemHeight, columnHeight } = props;
    let selectedIndex = options.indexOf(value);
    if (selectedIndex < 0) {
      // throw new ReferenceError();
      console.warn(
        'Warning: "' +
          this.props.name +
          '" doesn\'t contain an option of "' +
          value +
          '".'
      );
      this.onValueSelected(options[0]);
      selectedIndex = 0;
    }

    return {
      scrollTranslate:
        columnHeight / 2 - itemHeight / 2 - selectedIndex * itemHeight,
      minTranslate:
        columnHeight / 2 - itemHeight * options.length + itemHeight / 2,
      maxTranslate: columnHeight / 2 - itemHeight / 2
    };
  };

  private onValueSelected = (newValue: number) => {
    this.props.onChange(this.props.name, newValue);
  };

  private handleTouchStart = (event: any) => {
    const startTouchY = event.targetTouches[0].pageY;

    const transformMatrix = window
      .getComputedStyle(this.ref.current!)
      .getPropertyValue("transform");
    const computedVerticalTransform = parseInt(
      transformMatrix
        .split(",")[5]
        .trim()
        .replace(")", ""),
      10
    );

    this.setState({
      startTouchY: startTouchY,
      startScrollTranslate: computedVerticalTransform,
      scrollTranslate: computedVerticalTransform,
      isMoving: true,
      transitionDuration: 0,
      transitionTimingFunction:
        PickerColumn.ClickInteractionTransitionTimingFucntion
    });
  };

  handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    e.preventDefault();

    const touchY = e.targetTouches[0].pageY;
    this.touchHistory.push(touchY);

    this.setState(prevState => {
      if (!prevState.isMoving) {
        return {
          isMoving: true,
          maxTranslate: prevState.maxTranslate,
          minTranslate: prevState.minTranslate,
          scrollTranslate: prevState.scrollTranslate,
          startScrollTranslate: prevState.startScrollTranslate,
          startTouchY: prevState.startTouchY
        };
      }

      let nextScrollTranslate =
        prevState.startScrollTranslate + touchY - prevState.startTouchY;
      if (nextScrollTranslate < prevState.minTranslate) {
        nextScrollTranslate =
          prevState.minTranslate -
          Math.pow(prevState.minTranslate - nextScrollTranslate, 0.8);
      } else if (nextScrollTranslate > prevState.maxTranslate) {
        nextScrollTranslate =
          prevState.maxTranslate +
          Math.pow(nextScrollTranslate - prevState.maxTranslate, 0.8);
      }
      return {
        ...prevState,
        scrollTranslate: nextScrollTranslate
      };
    });
  };

  handleTouchEnd = (event: any) => {
    if (!this.state.isMoving) {
      return;
    }

    if (this.calcIsPushInteraction()) {
      this.handleTouchPushInteraction();
    } else if (this.touchHistory.length > 0) {
      this.handleTouchScrollInteraction();
    } else {
      this.handleTouchClickInteraction();
    }

    this.touchHistory = [];
  };

  handleTouchCancel = (event: any) => {
    if (!this.state.isMoving) {
      return;
    }
    this.setState(prevProps => ({
      isMoving: false,
      startTouchY: 0,
      startScrollTranslate: 0,
      scrollTranslate: prevProps.startScrollTranslate,
      maxTranslate: prevProps.maxTranslate,
      minTranslate: prevProps.minTranslate
    }));
  };

  private handleTouchClickInteraction() {
    this.setState(
      (prevState: PickerColumnState) => {
        // 2.4 = 60% / 50% * 2 ======> highlight-line schnitt liegt bei 60%, siehe .clock-container { translateY(-60%); }
        let nextScrollTranslate =
          prevState.startScrollTranslate +
          window.innerHeight / 2.4 -
          prevState.startTouchY;
        return {
          scrollTranslate: nextScrollTranslate,
          isMoving: false,
          startTouchY: 0,
          startScrollTranslate: 0,
          transitionDuration: PickerColumn.ClickInteractionTransitionDuration
        };
      },
      () => {
        const { options, itemHeight } = this.props;
        const { scrollTranslate, minTranslate, maxTranslate } = this.state;
        const activeIndex = this.calcActiveIndex(
          scrollTranslate,
          maxTranslate,
          minTranslate,
          options.length,
          itemHeight
        );
        this.onValueSelected(options[activeIndex]);
      }
    );
  }

  private handleTouchScrollInteraction() {
    this.setState(
      prevState => {
        return {
          scrollTranslate: prevState.scrollTranslate,
          transitionDuration: 0,
          isMoving: false,
          startTouchY: 0,
          startScrollTranslate: 0
        };
      },
      () => {
        const { options, itemHeight } = this.props;
        const { scrollTranslate, minTranslate, maxTranslate } = this.state;
        const activeIndex = this.calcActiveIndex(
          scrollTranslate,
          maxTranslate,
          minTranslate,
          options.length,
          itemHeight
        );
        this.onValueSelected(options[activeIndex]);
      }
    );
  }

  private handleTouchPushInteraction() {
    const push = ScrollInteractionHelper.calcPush(
      this.touchHistory,
      PickerColumn.PushInteractionThreshold,
      PickerColumn.TouchPushSpeedFactor
    );
    this.setState(
      prevState => {
        return {
          scrollTranslate: prevState.scrollTranslate + push,
          transitionDuration: PickerColumn.PushInteractionTransitionDuration,
          transitionTimingFunction: "cubic-bezier(0, 0.5, 0, 1)",
          isMoving: false,
          startTouchY: 0,
          startScrollTranslate: 0
        };
      },
      () => {
        const { options, itemHeight } = this.props;
        const {
          scrollTranslate: scrollTranslate,
          minTranslate,
          maxTranslate
        } = this.state;
        const activeIndex = this.calcActiveIndex(
          scrollTranslate + push,
          maxTranslate,
          minTranslate,
          options.length,
          itemHeight
        );
        this.onValueSelected(options[activeIndex]);
      }
    );
  }

  calcIsPushInteraction() {
    let isPush = false;
    if (this.touchHistory.length > 1) {
      const a = this.touchHistory[this.touchHistory.length - 2];
      const b = this.touchHistory[this.touchHistory.length - 1];

      const distance = a >= b ? a - b : b - a;
      isPush = distance > PickerColumn.PushInteractionThreshold;
    }
    return isPush;
  }

  calcActiveIndex(
    scrollTranslate: number,
    maxTranslate: number,
    minTranslate: number,
    optionsLength: number,
    itemHeight: number
  ) {
    let activeIndex;
    if (scrollTranslate > maxTranslate) {
      activeIndex = 0;
    } else if (scrollTranslate < minTranslate) {
      activeIndex = optionsLength - 1;
    } else {
      activeIndex = -Math.round((scrollTranslate - maxTranslate) / itemHeight);
    }
    return activeIndex;
  }
}

export default PickerColumn;
