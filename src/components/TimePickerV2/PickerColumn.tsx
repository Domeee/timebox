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
  startScrollerTranslate: number;
  scrollerTranslate: number;
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
  private static readonly PushInteractionThreshold = 5;

  private static readonly ClickInteractionTransitionDuration = 200;

  private static readonly ClickInteractionTransitionTimingFucntion = "linear";

  private touchHistory: number[] = [];

  private ref: React.RefObject<HTMLDivElement>;

  constructor(props: PickerColumnProps) {
    super(props);

    this.ref = React.createRef();

    this.state = {
      isMoving: false,
      startTouchY: 0,
      startScrollerTranslate: 0,
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
    const translateString = `translate(0, ${this.state.scrollerTranslate}px)`;
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
          className="picker-scroller"
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
      scrollerTranslate:
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
      startScrollerTranslate: computedVerticalTransform,
      scrollerTranslate: computedVerticalTransform,
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
          scrollerTranslate: prevState.scrollerTranslate,
          startScrollerTranslate: prevState.startScrollerTranslate,
          startTouchY: prevState.startTouchY
        };
      }

      let nextScrollerTranslate =
        prevState.startScrollerTranslate + touchY - prevState.startTouchY;
      if (nextScrollerTranslate < prevState.minTranslate) {
        nextScrollerTranslate =
          prevState.minTranslate -
          Math.pow(prevState.minTranslate - nextScrollerTranslate, 0.8);
      } else if (nextScrollerTranslate > prevState.maxTranslate) {
        nextScrollerTranslate =
          prevState.maxTranslate +
          Math.pow(nextScrollerTranslate - prevState.maxTranslate, 0.8);
      }
      return {
        ...prevState,
        scrollerTranslate: nextScrollerTranslate
      };
    });
  };

  handleTouchEnd = (event: any) => {
    if (!this.state.isMoving) {
      return;
    }

    if (this.calcIsPushInteraction()) {
      // handleTouchEnd push interaction
      const push = ScrollInteractionHelper.calcPush(
        this.touchHistory,
        PickerColumn.PushInteractionThreshold,
        PickerColumn.TouchPushSpeedFactor
      );
      this.setState(
        prevState => {
          return {
            scrollerTranslate: prevState.scrollerTranslate + push,
            transitionDuration: 2000,
            transitionTimingFunction: "cubic-bezier(0, 0.5, 0, 1)",
            isMoving: false,
            startTouchY: 0,
            startScrollerTranslate: 0
          };
        },
        () => {
          const { options, itemHeight } = this.props;
          const { scrollerTranslate, minTranslate, maxTranslate } = this.state;
          const activeIndex = this.calcActiveIndex(
            scrollerTranslate + push,
            maxTranslate,
            minTranslate,
            options.length,
            itemHeight
          );
          this.touchHistory = [];
          this.onValueSelected(options[activeIndex]);
        }
      );
    } else if (this.touchHistory.length > 0) {
      // handleTouchEnd scroll interaction
      this.setState(
        prevState => {
          return {
            scrollerTranslate: prevState.scrollerTranslate,
            transitionDuration: 0,
            isMoving: false,
            startTouchY: 0,
            startScrollerTranslate: 0
          };
        },
        () => {
          const { options, itemHeight } = this.props;
          const { scrollerTranslate, minTranslate, maxTranslate } = this.state;
          const activeIndex = this.calcActiveIndex(
            scrollerTranslate,
            maxTranslate,
            minTranslate,
            options.length,
            itemHeight
          );
          this.touchHistory = [];
          this.onValueSelected(options[activeIndex]);
        }
      );
    } else {
      // Can be simplified by attaching onClick in PickerItem
      // handleTouchEnd click interaction
      this.setState(
        (prevState: PickerColumnState) => {
          let nextScrollerTranslate =
            prevState.startScrollerTranslate +
            window.innerHeight / 2 -
            prevState.startTouchY;
          return {
            scrollerTranslate: nextScrollerTranslate,
            isMoving: false,
            startTouchY: 0,
            startScrollerTranslate: 0,
            transitionDuration: PickerColumn.ClickInteractionTransitionDuration
          };
        },
        () => {
          const { options, itemHeight } = this.props;
          const { scrollerTranslate, minTranslate, maxTranslate } = this.state;
          const activeIndex = this.calcActiveIndex(
            scrollerTranslate,
            maxTranslate,
            minTranslate,
            options.length,
            itemHeight
          );
          this.touchHistory = [];
          this.onValueSelected(options[activeIndex]);
        }
      );
    }
  };

  handleTouchCancel = (event: any) => {
    if (!this.state.isMoving) {
      return;
    }
    this.setState(prevProps => ({
      isMoving: false,
      startTouchY: 0,
      startScrollerTranslate: 0,
      scrollerTranslate: prevProps.startScrollerTranslate,
      maxTranslate: prevProps.maxTranslate,
      minTranslate: prevProps.minTranslate
    }));
  };

  // handleItemClick = (option: any) => {
  //   console.log("handleItemClick");
  //   if (option !== this.props.value) {
  //     this.onValueSelected(option);
  //   } else {
  //     this.props.onClick(this.props.name, this.props.value);
  //   }
  // };

  calcIsPushInteraction() {
    let isPush = false;
    if (this.touchHistory.length > 1) {
      const a = this.touchHistory[this.touchHistory.length - 2];
      const b = this.touchHistory[this.touchHistory.length - 1];
      const diff = a >= b ? a - b : b - a;
      isPush = diff > PickerColumn.PushInteractionThreshold;
    }
    return isPush;
  }

  calcActiveIndex(
    scrollerTranslate: number,
    maxTranslate: number,
    minTranslate: number,
    optionsLength: number,
    itemHeight: number
  ) {
    let activeIndex;
    if (scrollerTranslate > maxTranslate) {
      activeIndex = 0;
    } else if (scrollerTranslate < minTranslate) {
      activeIndex = optionsLength - 1;
    } else {
      activeIndex = -Math.round(
        (scrollerTranslate - maxTranslate) / itemHeight
      );
    }
    return activeIndex;
  }
}

export default PickerColumn;
