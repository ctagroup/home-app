import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { transformColumn /* , formatDate */ } from './helpers.jsx';
// import _ from 'lodash';

class ControlledTable extends Component {
  constructor(props) {
    super(props);
    const {
      page,
      onPageChange,
      onPageSizeChange,
    } = props;
    const defaultPageSizeChange = (pageSize, pageIndex) => this.setState({ pageIndex, pageSize });
    const defaultPageChange = (pageIndex) => this.setState({ pageIndex });
    this.onPageChange = onPageChange || defaultPageChange;
    this.onPageSizeChange = onPageSizeChange || defaultPageSizeChange;
    this.page = page;

    const columns = (props || {}).options.columns.map(transformColumn);
    this.state = {
      columns,
      data: ((props || {}).data) || [],
      pages: null,
      loading: true,
    };
    this.fetchData = this.fetchData.bind(this);
  }

  fetchData(state /* , instance*/) {
    this.setState({ loading: true });
    // const columnsMap =
    //   this.state.columns.reduce((acc, value) => ({ ...acc, [value.id]: value }), {});

    if (this.props.loadData) {
      this.props.loadData(
        state.page,
        state.pageSize,
        state.sorted,
        state.filtered,
        (res) => {
          this.setState({
            data: res.data,
            pages: res.pages,
            loading: false,
          });
          /*
          let filteredData = res.data;
          const { pageSize, page, sorted, filtered } = state;
          if (filtered.length) {
            const reducer = (filteredSoFar, nextFilter) =>
              filteredSoFar.filter((row) => {
                const column = columnsMap[nextFilter.id];
                if (column.filterMethod) {
                  return columnsMap[nextFilter.id].filterMethod(nextFilter, row, column);
                }
                if (row[nextFilter.id] instanceof Date) {
                  return formatDate(row[nextFilter.id]).includes(nextFilter.value.toLowerCase());
                }
                return (`${row[nextFilter.id]}`)
                  .toLowerCase().includes(nextFilter.value.toLowerCase());
              });
            filteredData = filtered.reduce(reducer, filteredData);
          }
          // console.log('res, sorted', res, sorted);
          const sortedData = _.orderBy(
            filteredData,
            sorted.map(({ id }) => (row) => {
              const selected = row[id];
              if (selected === null) return -Infinity;
              if (selected === undefined) return -Infinity;
              if (typeof selected === 'string') return selected.toLowerCase();
              return selected;
            }),
            sorted.map(d => (d.desc ? 'desc' : 'asc'))
          );

          return this.setState({
            data: sortedData.slice(pageSize * page, pageSize * page + pageSize),
            // pages: Math.ceil(filteredData.length / pageSize),
            pages: res.pages,
            loading: false,
          });
          */
        });
    }
  }

  render() {
    const { data, pages, loading, columns } = this.state;
    const minSize = Math.min(50, data.length);
    const defaultPageSize = [5, 10, 20, 25, 50, 100]
      .find((curr) => (curr - minSize) < 0);
    return (
      <ReactTable
        columns={columns}
        // Forces table not to paginate or sort automatically, so we can handle it server-side:
        manual
        resizable={false}
        data={data}
        pages={pages} // Display the total number of pages
        loading={loading} // Display the loading overlay when we need it
        onFetchData={this.fetchData} // Request new data when things change
        filterable
        defaultPageSize={defaultPageSize}
        className="-highlight"
      />
    );
  }
}

export default ControlledTable;
