import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Item from './Item';

export default class Grid extends Item {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  getGridValue() {
    const { id } = this.props.item;
    const str = this.props.formState.values[id];
    try {
      return JSON.parse(str);
    } catch (e) {
      return [];
    }
  }

  serializeGridValue(gridValue) {
    const lastIdx = gridValue.reduce((prev, curr, i) => {
      if (curr && Object.keys(curr).length > 0) {
        return i;
      }
      return prev;
    }, -1);
    if (lastIdx !== -1) {
      return JSON.stringify(gridValue.slice(0, lastIdx + 1));
    }
    return JSON.stringify(gridValue);
  }

  handleChange(rowIdx, columnId, value, cellCategory) {
    const gridValue = this.getGridValue();
    const row = gridValue[rowIdx] || {};
    if (cellCategory === 'date') {
      row[columnId] = value ? value.format('YYYY-MM-DD') : '';
    } else {
      row[columnId] = value;
    }
    if (!row[columnId]) {
      delete row[columnId];
    }
    gridValue[rowIdx] = row;
    this.props.onChange(this.props.item.id, this.serializeGridValue(gridValue));
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

  renderCell(r, c, disabled) {
    const gridValue = this.getGridValue();
    const { columns } = this.props.item;
    const item = columns[c];
    const cellId = `${item.id}[${r}]`;
    const cellValue = gridValue[r] && gridValue[r][item.id];
    switch (item.category) {
      case 'date':
        return (
          <DatePicker
            selected={cellValue ? moment(cellValue) : ''}
            onChange={(value) => this.handleChange(r, item.id, value, item.category)}
            placeholderText="MM/DD/YYYY"
            disabled={disabled}
          />
        );
      default:
        return (
          <input
            type={item.category || 'text'}
            id={cellId}
            name={cellId}
            value={cellValue || ''}
            onChange={(event) => this.handleChange(r, item.id, event.target.value, item.category)}
            disabled={disabled}
          />
        );
    }
  }

  renderRows(disabled) {
    const { columns, id } = this.props.item;
    const numRows = this.props.formState.props[`${id}.rows`] || this.props.item.rows;
    const empty = new Array(numRows).fill(0);
    const rows = empty.map((_, i) => {
      const row = columns.map((c, j) => (
        <td key={`${id}-${i}-${j}`}>{this.renderCell(i, j, disabled)}</td>)
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
    const { id, text } = this.props.item;
    const disabled = this.props.formState.props[`${id}.skip`];
    return (
      <div className="grid item">
        {this.renderTitle()}
        <p>{text}</p>
        <table>
          <thead>
            {this.renderHeader()}
          </thead>
          <tbody>
            {this.renderRows(disabled)}
          </tbody>
        </table>
      </div>
    );
  }
}
