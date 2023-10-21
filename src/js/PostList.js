export default class PostList {
  constructor() {
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  drawUi() {
    this.checkBinding();
  }

  checkBinding() {
    if (this.container === null) {
      throw new Error('PostList not bind to DOM');
    }
  }
}
