import styled from 'react-emotion';

import space from 'app/styles/space';

const GRID_HEADER_HEIGHT = '45px';
const GRID_EDIT_WIDTH = '35px';
const GRID_EDIT_WIDTH_DOUBLE = '70px'; // (2 * GRID_EDIT_WIDTH)

type TableEditableProps = {
  isEditable?: boolean;
  isEditing?: boolean;
};

export const Grid = styled.table<TableEditableProps>`
  position: relative;
  display: grid;
  grid-template-columns: 3fr repeat(4, 1fr);

  box-sizing: border-box;
  border-collapse: collapse;
  margin: 0;

  background-color: pink;
  overflow-x: hidden;

  /*
    For the last column, we want to have some space on the right if column
    is editable.

    For the header, we set padding for 1 or 2 buttons depending on state
    For the body, use "td:last-child"
  */
  th:last-child {
    ${p => {
      if (!p.isEditable) {
        return '0px';
      }
      if (!p.isEditing) {
        return `padding-right: ${GRID_EDIT_WIDTH};`;
      }

      return `padding-right: ${GRID_EDIT_WIDTH_DOUBLE};`;
    }}
  }
  /*
    The design spec has a padding but it seems unnecessary, hence
    I have commented it out

  td:last-child {
    ${p => {
      if (!p.isEditable) {
        return '0px';
      }

      return `padding-right: ${GRID_EDIT_WIDTH};`;
    }}
  }
  */
`;
export const GridRow = styled.tr`
  display: contents;
`;

export const GridHead = styled.thead`
  display: contents;
`;
export const GridHeadCell = styled.th`
  /*
    By default, a grid item cannot be smaller than the size of its content.
    We override this by setting min-width to be 0.
  */
  min-width: 0;
  height: ${GRID_HEADER_HEIGHT};

  border-bottom: 1px solid ${p => p.theme.borderDark};
  background: ${p => p.theme.offWhite};
`;
export const GridHeadCellButton = styled.div<TableEditableProps>`
  margin: ${space(1)};
  padding: ${space(1)};
  border-radius: ${p => p.theme.borderRadius};

  color: ${p => p.theme.gray3};
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  text-transform: uppercase;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  background-color: ${p => (p.isEditing ? p.theme.offWhite2 : 'none')};
`;

export const GridBody = styled.tbody`
  display: contents;

  > tr:last-child td {
    border-bottom: none;
  }
`;
export const GridBodyCell = styled.td`
  /*
    By default, a grid item cannot be smaller than the size of its content.
    We override this by setting min-width to be 0.
  */
  min-width: 0;
  padding: ${space(2)};

  background-color: mintcream;
  /* border: 1px solid black; */
  border-bottom: 1px solid ${p => p.theme.borderLight};

  font-size: ${p => p.theme.fontSizeMedium};
`;

export const GridEditGroup = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  height: ${GRID_HEADER_HEIGHT};

  border-bottom: 1px solid ${p => p.theme.borderDark};
  cursor: pointer;
`;

export const GridEditGroupButton = styled.div`
  display: block;
  width: ${GRID_EDIT_WIDTH};
  height: ${GRID_HEADER_HEIGHT};

  color: ${p => p.theme.gray1};
  font-size: 16px;

  /* todo(leedongwei): Set SVG fill/color */
  &:hover {
    color: ${p => p.theme.gray2};
  }
  &:active {
    color: ${p => p.theme.gray3};
  }
  &:last-child {
    border-left: 1px solid ${p => p.theme.borderDark};
  }

  /* Tooltip */
  > span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
`;
