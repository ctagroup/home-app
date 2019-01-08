import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

class ControlledTable extends Component {
  constructor(props) {
    super(props);
    const {
      page,
    //   onPageChange,
    //   onPageSizeChange,

    } = props;
    // const defaultPageSizeChange = (pageSize, pageIndex) => this.setState({ page });
    // const defaultPageChange = (page) => this.setState({ page });
    // this.onPageChange = onPageChange || defaultPageChange;
    // this.onPageChange = onPageChange || defaultPageChange;
    this.page = page;
  }

  render() {
    return (
      <ReactTable
        resizable={false}
        // Props
        page={0} // the index of the page you wish to display
        pageSize={20} // the number of rows per page to be displayed
        sorted={[{ // the sorting model for the table
          id: 'lastName',
          desc: true,
        }, {
          id: 'firstName',
          desc: true,
        }]}
        expanded={{ // The nested row indexes on the current page that should appear expanded
          1: true,
          4: true,
          5: {
            2: true,
            3: true,
          },
        }}
        filtered={[{ // the current filters model
          id: 'lastName',
          value: 'linsley',
        }]}
        resized={[{ // the current resized column model
          id: 'lastName',
          value: 446.25,
        }]}

        // Callbacks
        // onPageChange={this.onPageChange} // Called when the page index is changed by the user

        // Called when the pageSize is changed by the user.
        // The resolve page is also sent to maintain approximate position in the data
        // onPageSizeChange={(pageSize, pageIndex) => {...}}

        // Called when a sortable column header is clicked with the column itself
        //   and if the shiftkey was held.
        // If the column is a pivoted column, `column` will be an array of columns
        // onSortedChange={(newSorted, column, shiftKey) => {...}}

        // Called when an expander is clicked. Use this to manage `expanded`
        // onExpandedChange={(newExpanded, index, event) => {...}}

        // Called when a user enters a value into a filter input field
        //   or the value passed to the onFiltersChange handler by the Filter option.
        // onFilteredChange={(filtered, column) => {...}}

        // Called when a user clicks on a resizing component (the right edge of a column header)
        // onResizedChange={(newResized, event) => {...}}
      />
    );
  }
}

export default ControlledTable;
