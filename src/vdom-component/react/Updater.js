import diff from './diff';

export default class Updater {
  bind(root) {
    this.root = this.root || root;
  }

  update() {
    const vdom = this.root.instance.render();
    diff(this.root.vdom, vdom);
    this.root.vdom = vdom;
  }
}