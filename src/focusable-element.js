export const FocusKey = {
  wrapperAttribute: 'wrapperAttribute',
  wrapperValueOpen: 'wrapperValueOpen',
  wrapperValueClose: 'wrapperValueClose',
  keyOpen: 'keyOpen',
  keyClose: 'keyClose',
}

export class FocusableElement {

  constructor(element, options = {}) {
    // Element.
    this.element = element;

    // Initialisation des options.
    this.options = {...FocusableElement.getDefaultOptions(), ...options}

    // Init behaviors
    this.element.addEventListener('focus', evt => this.onFocus(evt))
    this.element.addEventListener('keydown', evt => this.onKeydown(evt))
  }

  static getDefaultOptions() {
    const defaultOptions = {};
    defaultOptions[FocusKey.wrapperAttribute] = 'data-focus-wrapper';
    defaultOptions[FocusKey.wrapperValueOpen] = 'open';
    defaultOptions[FocusKey.wrapperValueClose] = '0';
    defaultOptions[FocusKey.keyOpen] = ['ArrowDown'];
    defaultOptions[FocusKey.keyClose] = ['ArrowUp'];
    return defaultOptions;
  }

  /**
   * Event on focus.
   */
  onFocus() {
    const wrapper = this.getWrapper();
    if (wrapper) {
      // @todo dispatch has wrapper.
    }
  }

  /**
   * Init keydown behaviors.
   *
   * @param evt
   */
  onKeydown(evt) {
    const wrapper = this.getWrapper()

    if (wrapper) {
      if (this.option(FocusKey.keyOpen).includes(evt.key)) {
        this.enableFocus(wrapper);
      } else if (this.option(FocusKey.keyClose).includes(evt.key)) {
        this.disableFocus();
      }
    }
  }

  /**
   * Enable the focus
   * @param wrapper
   */
  enableFocus(wrapper) {
    wrapper = wrapper || this.getWrapper()
    wrapper.setAttribute(this.option(FocusKey.wrapperAttribute), this.option(FocusKey.wrapperValueOpen));
  }

  /**
   * Disable the focus of the element.
   *
   * If in an open wrapper, the focus will ne on the first focusable element of the wrapper
   */
  disableFocus() {
    const wrapper = this.getOpenedWrapper()
    if (wrapper) {
      wrapper.setAttribute(this.option(FocusKey.wrapperAttribute), this.option(FocusKey.wrapperValueClose));

      const firstFocusable = this.getFirstFocusable(wrapper);
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
  }

  /**
   * Return the first wrapper
   * @return {*}
   */
  getWrapper() {
    if ("undefined" === typeof this.wrapper) {
      this.wrapper = this.findAncestor(this.element, `[${this.option(FocusKey.wrapperAttribute)}]`);
    }
    return this.wrapper;
  }

  /**
   * REturn the first opened wrapper.
   * @return {*}
   */
  getOpenedWrapper() {
    return this.findAncestor(this.element, `[${this.option(FocusKey.wrapperAttribute)}="${this.option(FocusKey.wrapperValueOpen)}"]`)
  }

  /**
   * REturn the first closed wrapper of the element.
   * @return {*}
   */
  getClosedWrapper() {
    return this.findAncestor(this.element, `[${this.option(FocusKey.wrapperAttribute)}="${this.option(FocusKey.wrapperValueClose)}"]`)
  }

  /**
   * Find first ancestor.
   *
   * @param el
   * @param sel
   * @return {*}
   */
  findAncestor(el, sel) {
    while ((el = el.parentElement) && !((el.matches || el.matchesSelector).call(el, sel))) ;
    return el;
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
   * Returns the first focus element in a wrapper.
   * @param wrapper
   * @return {any}
   */
  getFirstFocusable(wrapper) {
    wrapper = wrapper || this.getWrapper()
    return wrapper.querySelector(`.focusable`);
  }
}

/**
 * Focus an element
 * @param item
 */
export function focusElement(item, options={}){
  if (typeof item.focusableElement === 'undefined') {
    item.focusableElement = new FocusableElement(item,options);
  }
}
