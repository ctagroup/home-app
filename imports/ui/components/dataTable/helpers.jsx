import React from 'react';
export const transformColumn = (column) => {
  let accessor;
  if (column.render) {
    if (column.data) {
      accessor = (value) =>
        // eslint-disable-next-line react/react-in-jsx-scope
        (<div
          dangerouslySetInnerHTML={{ __html:
            column.render(value[column.data], 'type', value) }}
        >
        </div>);
    } else {
      accessor = column.render;
    }
  } else {
    accessor = column.data;
  }
  const transformed = {
    id: column._id || column.data || column.id,
    accessor,
    Header: column.title,
  };
  if (column.reactCreatedCell) {
    transformed.Cell = (row) => column.reactCreatedCell(null, row.original._id, row.original);
  }
  const columnData = {
    ...column,
    ...transformed,
  };
  delete columnData.width;
  return columnData;
};
