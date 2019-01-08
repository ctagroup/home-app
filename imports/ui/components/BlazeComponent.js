import React from 'react';
import ReactDOM from 'react-dom';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

export default
class BlazeTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  componentDidMount() {
    const container = ReactDOM.findDOMNode(this.refs[this.myRef]);
    const { name, data } = this.props;

    this.reactiveData = new ReactiveVar(data);
    this.componentWillReceiveProps(this.props);
    this.blazeView = Blaze.renderWithData(
        Template[name],
        () => this.reactiveData.get(),
        container
    );
  }

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;
    this.reactiveData.set(data);
  }

  shouldComponentUpdate() { return false; }

  componentWillUnmount() {
    Blaze.remove(this.blazeView);
  }

  render() { return <div ref={this.myRef} />; }
}
