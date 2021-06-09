import cloneElement from './cloneElement';
import Component from './Component';

export default class RootComponent extends Component {
  render() {
    return cloneElement(this.props.children[0]);
  }
}