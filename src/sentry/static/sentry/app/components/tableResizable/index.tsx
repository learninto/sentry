import React from 'react';

import {t} from 'app/locale';

import InlineSvg from 'app/components/inlineSvg';
import {Panel} from 'app/components/panels';
import ToolTip from 'app/components/tooltip';

import {
  Grid,
  GridRow,
  GridHead,
  GridHeadCell,
  GridHeadCellButton,
  GridBody,
  GridBodyCell,
  GridEditGroup,
  GridEditGroupButton,
} from './styles';

export type TableResizableProps = {
  // isLoading: boolean;
  // isError: boolean;
  // errorMessage?: string;

  isEditable: boolean;
};
export type TableResizableState = {
  numColumn: number;
  isEditing: boolean;
  // isAddingColumn: boolean;
};

class TableResizable extends React.Component<TableResizableProps, TableResizableState> {
  static defaultProps = {
    isColumnEditable: true,
  };

  constructor(props: TableResizableProps) {
    super(props);

    this.toggleColumnAdd = this.toggleColumnAdd.bind(this);
    this.toggleColumnEdit = this.toggleColumnEdit.bind(this);
  }

  state = {
    numColumn: 0,
    isEditing: true,
  };

  static getDerivedStateFromProps(
    props: TableResizableProps,
    currState: TableResizableState
  ): TableResizableState {
    return {
      ...currState,
      numColumn: 0 + (props.isEditable ? 1 : 0),
    };
  }

  toggleColumnAdd() {
    this.setState({isEditing: !this.state.isEditing});
  }

  toggleColumnEdit() {
    this.setState({isEditing: !this.state.isEditing});
  }

  renderTableHead() {
    const {isEditing} = this.state;

    return (
      <GridHead>
        <GridRow>
          <GridHeadCell>
            <GridHeadCellButton isEditing={isEditing}>
              1 leedongwei head
            </GridHeadCellButton>
          </GridHeadCell>
          <GridHeadCell>
            <GridHeadCellButton isEditing={isEditing}>
              2 leedongwei head
            </GridHeadCellButton>
          </GridHeadCell>
          <GridHeadCell>
            <GridHeadCellButton isEditing={isEditing}>
              3 leedongwei head leedongwei head leedongwei head
            </GridHeadCellButton>
          </GridHeadCell>
          <GridHeadCell>
            <GridHeadCellButton isEditing={isEditing}>
              4 leedongwei head
            </GridHeadCellButton>
          </GridHeadCell>
          <GridHeadCell>
            <GridHeadCellButton isEditing={isEditing}>
              5 leedongwei head
            </GridHeadCellButton>
          </GridHeadCell>
        </GridRow>
      </GridHead>
    );
  }

  renderTableBody() {
    return (
      <GridBody>
        {this.renderTableBodyRow()}
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

  renderTableEditable() {
    if (!this.props.isEditable) {
      return null;
    }

    if (!this.state.isEditing) {
      return (
        <GridEditGroup>
          <GridEditGroupButton onClick={this.toggleColumnEdit}>
            <ToolTip title={t('Edit Columns')}>
              <InlineSvg src="icon-edit-2" />
            </ToolTip>
          </GridEditGroupButton>
        </GridEditGroup>
      );
    }

    return (
      <GridEditGroup>
        <GridEditGroupButton onClick={this.toggleColumnAdd}>
          <ToolTip title={t('Add Columns')}>
            <InlineSvg src="icon-circle-add" />
          </ToolTip>
        </GridEditGroupButton>
        <GridEditGroupButton onClick={this.toggleColumnEdit}>
          <ToolTip title={t('Cancel Edit')}>
            <InlineSvg src="icon-close" />
          </ToolTip>
        </GridEditGroupButton>
      </GridEditGroup>
    );
  }

  render() {
    return (
      <Panel>
        <Grid isEditable={this.props.isEditable} isEditing={this.state.isEditing}>
          {this.renderTableHead()}
          {this.renderTableBody()}

          {this.props.isEditable && this.renderTableEditable()}
        </Grid>
      </Panel>
    );
  }
}

export default TableResizable;
