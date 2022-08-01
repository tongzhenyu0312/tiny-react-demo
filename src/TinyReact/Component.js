import diff from "./diff";
import render from "./render";

export default class {
  constructor(props) {
    this.props = props;
  }

  setState(state) {
    this.state = Object.assign({}, this.state, state);
    // 获取最新的，要渲染的virtualDom对象
    const virtualDom = this.render();
    const oldDom = this.getDom();

    diff(virtualDom, oldDom.parentNode, oldDom)
  }

  setDom(dom) {
    this._dom = dom;
  }

  getDom() {
    return this._dom;
  }

  updateProps(props) {
    this.props = props;
  }

    // 生命周期函数
    componentWillMount() {}
    componentDidMount() {
      console.log('componentDidMount');
    }
    componentWillReceiveProps(nextProps) {
      console.log('componentWillReceiveProps', nextProps);
    }
    shouldComponentUpdate(nextProps, nextState) {
      return nextProps != this.props || nextState != this.state
    }
    componentWillUpdate(nextProps, nextState) {
      console.log('componentWillUpdate', nextProps);
    }
    componentDidUpdate(prevProps, preState) {
      console.log('componentDidUpdate', prevProps);
    }
    componentWillUnmount() {}
}
