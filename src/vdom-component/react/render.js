import createElement from './createElement';
import RootComponent from './RootComponent';
import Updater from './Updater';
import mount from './mount';

export default function render(component, container) {
  mount(
    createElement(RootComponent, null, component),
    container,
    new Updater()
  );
}