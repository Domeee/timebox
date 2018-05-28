class BrowserUtils {
  public hasTouch(): boolean {
    return 'ontouchstart' in window;
  }
}

export default new BrowserUtils();
