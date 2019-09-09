import React from 'react';
import styled from 'react-emotion';

export type TableResizableProps = {
  // isLoading: boolean;
  // isError: boolean;
  // errorMessage?: string;

  isColumnEditable: boolean;
};
export type TableResizableState = {
  numColumn: number;
  // isEditingColumn: boolean;
  // isAddingColumn: boolean;
};

class TableResizable extends React.Component<TableResizableProps, TableResizableState> {
  static defaultProps = {
    isColumnEditable: true,
  };

  constructor(props: TableResizableProps) {
    super(props);
  }

  static getDerivedStateFromProps(props: TableResizableProps): TableResizableState {
    return {
      numColumn: 0 + (props.isColumnEditable ? 1 : 0),
    };
  }

  renderTableHead() {
    return (
      <GridHead>
        <GridRow>
          <GridHeadCell>1 leedongwei head</GridHeadCell>
          <GridHeadCell>2 leedongwei head</GridHeadCell>
          <GridHeadCell>3 leedongwei head</GridHeadCell>
          <GridHeadCell>4 leedongwei head</GridHeadCell>
          <GridHeadCell>5 leedongwei head</GridHeadCell>
        </GridRow>
      </GridHead>
    );
  }

  renderTableBody() {
    return (
      <GridBody>
        {this.renderTableBodyRow()}
        {this.renderTableBodyRow()}
      </GridBody>
    );
  }

  renderTableBodyRow() {
    return (
      <GridRow>
        <GridBodyCell>1 leedongwei row</GridBodyCell>
        <GridBodyCell>2 leedongwei row</GridBodyCell>
        <GridBodyCell>3 leedongwei row</GridBodyCell>
        <GridBodyCell>4 leedongwei row</GridBodyCell>
        <GridBodyCell>5 leedongwei row</GridBodyCell>
      </GridRow>
    );
  }

  render() {
    return (
      <Grid>
        {this.renderTableHead()}
        {this.renderTableBody()}
      </Grid>
    );
  }
}

export default TableResizable;

const Grid = styled.table`
  display: grid;
  grid-template-columns: 3fr repeat(4);
  overflow-x: auto;

  background-color: pink;
`;

const GridRow = styled.tr`
  display: content;
`;

const GridHead = styled.thead`
  display: content;
`;

const GridHeadCell = styled.th`
  background-color: salmon;
  border: 1px solid black;
`;

const GridBody = styled.tbody`
  display: content;
`;

const GridBodyCell = styled.td`
  background-color: green;
  border: 1px solid black;
`;
