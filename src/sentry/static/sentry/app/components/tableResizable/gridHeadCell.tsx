import React from 'react';

import {FLAG_GRID_RESIZABLE} from './flags';

import {
  GridHeadCell as GridHeadCellWrapper,
  GridHeadCellButton,
  GridHeadCellResizer,
} from './styles';

/*
  Abstracting the complexity of GridHeadCell away.
 */
export type GridHeadCellProps = {
  isEditing: boolean;
  children: React.ReactChild;
};

class GridHeadCell extends React.Component<GridHeadCellProps> {
  render() {
    const {isEditing, children} = this.props;

    return (
      <GridHeadCellWrapper>
        <GridHeadCellButton isEditing={isEditing}>{children}</GridHeadCellButton>
        {FLAG_GRID_RESIZABLE && <GridHeadCellResizer isEditing={isEditing} />}
      </GridHeadCellWrapper>
    );
  }
}

export default GridHeadCell;
