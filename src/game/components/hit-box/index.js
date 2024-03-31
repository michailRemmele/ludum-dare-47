import { Component } from 'remiz';

export class HitBox extends Component {
  clone() {
    return new HitBox();
  }
}

HitBox.componentName = 'HitBox';
