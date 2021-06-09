import { isChanged } from './utils';

export default class Component {
  static isComponent = true;

  constructor(props = {}) {
    this.props = props;
    this.state = {};
  }

  setState(newState) {
    if (isChanged(this.state, newState)) {
      Object.assign(this.state, newState);
      this.__$updater && this.__$updater.update();
    }
  }

  render() {
    return null;
  }
}