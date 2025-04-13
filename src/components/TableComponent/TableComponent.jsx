import { Divider, Table } from "antd";
import React, { forwardRef } from "react";

const TableComponent = forwardRef((props,ref) => {
  const {columns=[],data=[],selectionType="checkbox"} = props
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys:${selectedRowKeys}`,
        "selectedRows:",
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      disable: record.name === "Disabled User",
      name: record.name,
    }),
  };

  return (
    <div ref={ref}>
      <Divider></Divider>
      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        {...props}
      />
    </div>
  );
});

export default TableComponent;
