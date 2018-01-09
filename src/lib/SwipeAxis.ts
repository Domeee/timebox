// Enum cannot start at 0 because of JavaScript's
// null coalescing operator. See:
// https://stackoverflow.com/questions/476436/is-there-a-null-coalescing-operator-in-javascript
enum SwipeAxis {
  Horizontal = 1,
  Vertical = 2,
}

export default SwipeAxis;
