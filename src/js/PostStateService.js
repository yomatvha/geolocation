export default class PostStateService {
  constructor(storage) {
    this.storage = storage;
  }

  save(state) {
    this.storage.setItem('posts', JSON.stringify(state));
  }

  load() {
    try {
      return JSON.parse(this.storage.getItem('posts'));
    } catch (e) {
      throw new Error('Invalid state');
    }
  }
}
