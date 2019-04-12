import React from 'react';
import ReactDOM from 'react-dom';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

export default
class BlazeTemplate extends React.Component {
  constructor(props) {
    const uuidv4 = () =>
      ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
    super(props);
    this.myRef = props.ref || uuidv4();
    this.classes = props.classes || '';
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

  render() { return <div className={this.classes} ref={this.myRef} />; }
}
