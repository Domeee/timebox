export default class ScrollInteractionHelper {
  public static readonly ScrollDirectionDown = -1;
  public static readonly ScrollDirectionUp = 1;

  static calcPushLength(
    touchArray: number[],
    pushInteractionThreshold: number,
    touchPushSpeedFactor: number
  ) {
    let pushlength = 0;
    for (let index = touchArray.length - 1; index > -1; index--) {
      const a = touchArray[index];
      const b = touchArray[index - 1];
      const diff = a >= b ? a - b : b - a;
      const isPush = diff > pushInteractionThreshold;
      if (!isPush) break;

      pushlength += diff;
    }
    return pushlength * touchPushSpeedFactor;
  }

  // Returns -1 for scroll down and 1 for scroll up
  static calcScrollDirection(touchArray: number[]) {
    if (touchArray.length <= 1) return this.ScrollDirectionDown;

    const a = touchArray[touchArray.length - 1];
    const b = touchArray[touchArray.length - 2];

    return a <= b ? this.ScrollDirectionDown : this.ScrollDirectionUp;
  }

  static calcPush(
    touchArray: number[],
    pushInteractionThreshold: number,
    touchPushSpeedFactor: number
  ) {
    const length = this.calcPushLength(
      touchArray,
      pushInteractionThreshold,
      touchPushSpeedFactor
    );
    const direction = this.calcScrollDirection(touchArray);
    return length * direction;
  }
}
