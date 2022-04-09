import { Component } from 'remiz';

export class UI extends Component {
  constructor(componentName, config) {
    super(componentName, config);

    this._icon = config.icon;
    this._title = config.title;
  }

  set icon(icon) {
    this._icon = icon;
  }

  get icon() {
    return this._icon;
  }

  set title(title) {
    this._title = title;
  }

  get title() {
    return this._title;
  }

  clone() {
    return new UI(this.componentName, {
      icon: this.icon,
      title: this.title,
    });
  }
}
