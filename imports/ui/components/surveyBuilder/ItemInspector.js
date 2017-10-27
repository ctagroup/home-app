import React from 'react';

export default class ItemInspector extends React.Component {
  constructor() {
    super();
    this.onInputChange = this.onInputChange.bind(this);
  }

  onInputChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    const item = Object.assign({}, this.props.item, {
      [name]: value,
    });
    this.props.onChange(item);
  }

  render() {
    const item = this.props.item;
    return (
      <form>
        <div>ID: {item.id}</div>
        <div>Type: {item.type}</div>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            placeholder="Title"
            value={item.title}
            onChange={this.onInputChange}
          />
        </div>
      </form>
    );
  }
}
