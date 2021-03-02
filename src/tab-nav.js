export const TabNavigatorKey = {
  previousButtons: 'previousButtons',
}

class TabNavigatorClass {
  constructor(options) {
    this.queue = [];

    // options
    this.setOptions(options)

    // tab press.
    document.addEventListener('keyup', (key) => this.onKeyPress(key))
  }

  static getDefaultOptions() {
    const defaultOptions = {};
    defaultOptions[TabNavigatorKey.previousButtons] = ['ArrowLeft'];
    return defaultOptions;
  }

  onKeyPress(key) {
    if (key.code === 'Tab') {
      this.onTabPress();
    } else if (this.option(TabNavigatorKey.previousButtons).includes(key.code)) {
      this.goBackward();
    }
  }

  onTabPress() {
    // Focused element.
    const focusElement = this.getCurrentFocusedElement()
    if (focusElement) {
      if (this.queue.includes(focusElement)) {
        this.cleanQueue(focusElement)
      } else {
        this.queue.push(focusElement)
      }
    }
  }

  /**
   * Return current focused element.
   * @return {Element}
   */
  getCurrentFocusedElement() {
    return document.querySelector(':focus')
  }

  /**
   * Go backward.
   */
  goBackward() {
    const focusElement = this.getCurrentFocusedElement();

    if (focusElement) {
      this.cleanQueue(focusElement)
    }
  }

  /**
   * Clean queue.
   * @param focusElement
   * @return {Generator<*, void, *>}
   */
  cleanQueue(focusElement) {
    const index = this.queue.indexOf(focusElement)
    if (index > 0) {
      this.queue[index - 1].focus();
      this.queue = this.queue.slice(0, index);
    }
  }

  /**
   * Return option value. ALl options if no key is passed.
   *
   * @param key
   * @return {*|(*&{"wrapper-value-close": string, "wrapper-attribute": string, "wrapper-value-open": string})}
   */
  option(key) {
    if (key) {
      return this.options[key];
    }
    return this.options;
  }

  /**
   * Set options.
   *
   * @param options
   */
  setOptions(options){
    this.options = {...TabNavigatorClass.getDefaultOptions(), ...options}
  }
}

export const tabNavigator = new TabNavigatorClass();
