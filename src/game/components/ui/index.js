import { Component } from 'remiz';

export class UI extends Component {
  constructor(config) {
    super(config);

    this.icon = config.icon;
    this.title = config.title;
  }

  clone() {
    return new UI({
      icon: this.icon,
      title: this.title,
    });
  }
}

UI.componentName = 'UI';
