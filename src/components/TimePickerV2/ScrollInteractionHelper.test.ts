import ScrollInteractionHelper from "./ScrollInteractionHelper";

it("calcs push length for a random touch array", () => {
  const touchArray = [0, 2, 3, 4, 6];
  const pushInteractionThreshold = 1;
  const touchPushSpeedFactor = 3;

  const pushLength = ScrollInteractionHelper.calcPushLength(
    touchArray,
    pushInteractionThreshold,
    touchPushSpeedFactor
  );
  expect(pushLength).toBe(6);
});

it("calcs push length for a random touch array with negatives", () => {
  const touchArray = [0, -2, -3, -4, -6];
  const pushInteractionThreshold = 1;
  const touchPushSpeedFactor = 3;

  const pushLength = ScrollInteractionHelper.calcPushLength(
    touchArray,
    pushInteractionThreshold,
    touchPushSpeedFactor
  );
  expect(pushLength).toBe(6);
});

it("calcs push length for a random touch array", () => {
  const touchArray = [0, 2, 3, 5, 6];
  const pushInteractionThreshold = 1;
  const touchPushSpeedFactor = 3;

  const pushLength = ScrollInteractionHelper.calcPushLength(
    touchArray,
    pushInteractionThreshold,
    touchPushSpeedFactor
  );
  expect(pushLength).toBe(0);
});

it("calcs push length for a random touch array", () => {
  const touchArray = [0, 2, 4, 6, 8];
  const pushInteractionThreshold = 1;
  const touchPushSpeedFactor = 3;

  const pushLength = ScrollInteractionHelper.calcPushLength(
    touchArray,
    pushInteractionThreshold,
    touchPushSpeedFactor
  );
  expect(pushLength).toBe(24);
});

it("calcs push length for an empty touch array", () => {
  const touchArray: number[] = [];
  const pushInteractionThreshold = 1;
  const touchPushSpeedFactor = 3;

  const pushLength = ScrollInteractionHelper.calcPushLength(
    touchArray,
    pushInteractionThreshold,
    touchPushSpeedFactor
  );
  expect(pushLength).toBe(0);
});

it("calcs scroll direction for scroll down", () => {
  const touchArray: number[] = [10, 0];

  const direction = ScrollInteractionHelper.calcScrollDirection(touchArray);
  expect(direction).toBe(ScrollInteractionHelper.ScrollDirectionDown);
});

it("calcs scroll direction for scroll up", () => {
  const touchArray: number[] = [0, 10];

  const direction = ScrollInteractionHelper.calcScrollDirection(touchArray);
  expect(direction).toBe(ScrollInteractionHelper.ScrollDirectionUp);
});

it("calcs scroll direction for no movement", () => {
  const touchArray: number[] = [0, 0];

  const direction = ScrollInteractionHelper.calcScrollDirection(touchArray);
  expect(direction).toBe(ScrollInteractionHelper.ScrollDirectionDown);
});

it("calcs scroll direction for an empty array", () => {
  const touchArray: number[] = [];

  const direction = ScrollInteractionHelper.calcScrollDirection(touchArray);
  expect(direction).toBe(ScrollInteractionHelper.ScrollDirectionDown);
});
