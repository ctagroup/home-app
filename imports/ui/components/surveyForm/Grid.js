import React from 'react';

export default class Grid extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.onChange(this.props.item.id, event.target.value);
  }

  renderHeader() {
    const { columns, id } = this.props.item;
    const items = columns.map(c => (<td key={c.id}>{c.title}</td>));
    return (
      <tr>
        <td key={`#${id}`}>#</td>{items}
      </tr>
    );
  }

  renderCell(r, c) {
    const values = this.props.formState.values;
    const { columns } = this.props.item;
    const item = columns[c];
    const cellId = `${item.id}.${r}`;
    return (<input
      type="text"
      id={cellId}
      name={cellId}
      value={values[cellId]}
      onChange={this.handleChange}
    />);
  }

  renderRows() {
    const variables = this.props.formState.variables;
    const { columns, id } = this.props.item;
    const numRows = variables[`${id}.rows`] || this.props.item.rows;
    const empty = new Array(numRows).fill(0);
    const rows = empty.map((_, i) => {
      const row = columns.map((c, j) => (
        <td key={`${id}-${i}-${j}`}>{this.renderCell(i, j)}</td>)
      );
      return (
        <tr key={`${id}-${i}`}>
          <td key={`#${i}`}>{i + 1}</td>
          {row}
        </tr>
      );
    });
    return rows;
  }

  render() {
    const { id, title, text } = this.props.item;
    const isHidden = this.props.formState.props[`${id}.hidden`];
    if (isHidden) {
      return null;
    }

    return (
      <div>
        <h6>{title}</h6>
        <p>{text}</p>
        <table>
          <thead>
            {this.renderHeader()}
          </thead>
          <tbody>
            {this.renderRows()}
          </tbody>
        </table>
      </div>
    );
  }
}
