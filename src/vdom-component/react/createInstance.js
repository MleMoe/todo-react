import Dispatcher from './dispatcher';

export default function createInstance(type, props, updater) {
  if (type.isComponent) {
    return new type(props);
  } else {
    const instance = {
      props,
      updater,
      render() {
        Dispatcher.current = this.dispatcher;
        const ret = type(this.props);
        Dispatcher.current.reset();
        Dispatcher.current = null;
        return ret;
      }
    };
    instance.dispatcher = new Dispatcher(() => {
      instance.updater.update();
    });
    return instance;
  }
}