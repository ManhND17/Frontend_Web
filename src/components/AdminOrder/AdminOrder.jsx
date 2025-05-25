import React, { useRef, useState } from "react";
import { Button, Image, Select, Space, Table, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import * as OrderService from "../../services/OrderService";
import { useMessage } from "../../components/Message/MessageProvider";
import { useQuery } from "@tanstack/react-query";
import Highlighter from "react-highlight-words";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "antd";
import { useSelector } from "react-redux";
import Title from "antd/es/skeleton/Title";

const AdminProduct = () => {
  const user = useSelector((state) => state.user);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [filterStatus, setFilterStatus] = useState(""); // "" nghĩa là lấy tất cả

  const statusOptions = [
    { value: "Chờ xử lý", label: "Chờ xử lý" },
    { value: "Đã xác nhận", label: "Đã xác nhận" },
    { value: "Đơn hàng đang chuẩn bị", label: "Đơn hàng đang chuẩn bị" },
    {
      value: "Đơn hàng đã được giao cho đơn vị vận chuyển",
      label: "Đơn hàng đã được giao cho đơn vị vận chuyển",
    },
    { value: "Đơn hàng đang vận chuyển", label: "Đơn hàng đang vận chuyển" },
    { value: "Giao đơn hàng thành công", label: "Giao đơn hàng thành công" },
  ];
  const statusColors = {
    "Chờ xử lý": "orange",
    "Đã xác nhận": "blue",
    "Đơn hàng đang chuẩn bị": "purple",
    "Đơn hàng đã được giao cho đơn vị vận chuyển": "geekblue",
    "Đơn hàng đang vận chuyển": "#1890ff",
    "Giao đơn hàng thành công": "green",
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => {
            var _a;
            return (_a = searchInput.current) === null || _a === void 0
              ? void 0
              : _a.select();
          }, 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const { success, error } = useMessage();

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await OrderService.updateOrderStatus(
        orderId,
        newStatus,
        user?.access_token
      );

      if (res.status === "OK") {
        success("Cập nhật trạng thái thành công");
        await refetch();
        await refetchOrderStatus();
      } else {
        error(res.message);
      }
    } catch (error) {
      error("Có lỗi xảy ra khi cập nhật trạng thái");
    }
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "_id",
      key: "_id",
      ...getColumnSearchProps("_id"),
    },
    {
      title: "Khách hàng",
      dataIndex: "shippingAddress",
      key: "customer",
      render: (address) => address.fullName,
    },
    {
      title: "Voucher",
      dataIndex: "VoucherDiscount",
      key: "VoucherDiscount",
      render: (price) => price.toLocaleString("vi-VN") + "đ",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => price.toLocaleString("vi-VN") + "đ",
    },

    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      ...getColumnSearchProps("status"),
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 400 }}
          onChange={(value) => handleStatusChange(record._id, value)}
          options={statusOptions.map((option) => ({
            value: option.value,
            label: (
              <span style={{ color: statusColors[option.value] }}>
                {option.label}
              </span>
            ),
          }))}
        />
      ),
    },
  ];

  const fetchOrders = async (limit, page, status) => {
    if (status && status !== "") {
      const res = await OrderService.getOrderByStatus(
        status,
        page,
        limit,
        user?.access_token
      );
      if (res.data.status === "OK") {
        setTotal(res.data.totalPage * limit);
        return res.data.data;
      }
      return [];
    } else {
      // lấy tất cả đơn hàng
      const res = await OrderService.getAllOrder(
        limit,
        page,
        user?.access_token
      );
      if (res.status === "OK") {
        setTotal(res.totalPage * limit);
        return res.data;
      }
      return [];
    }
  };

  const {
    data: orders,
    isLoading: isLoadingOrder,
    refetch,
  } = useQuery({
    queryKey: ["Order", page, limit, filterStatus],
    queryFn: () => fetchOrders(limit, page, filterStatus),
    keepPreviousData: true,
    retry: 3,
    retryDelay: 1000,
  });

  const { data: orderStatusData, refetch: refetchOrderStatus, } = useQuery({
    queryKey: ["OrderStatusCount"],
    queryFn: () => OrderService.getOrderCountStatus(user?.access_token),
    enabled: !!user?.access_token,
  });

  const expandedRowRender = (record) => {
    const columns = [
      { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
      {
        title: "Ảnh",
        dataIndex: "image",
        key: "image",
        render: (img) => (
          <Image
            src={img}
            style={{ width: 50, height: 50, objectFit: "cover" }}
          />
        ),
      },
      {
        title: "Giá",
        dataIndex: "price",
        key: "price",
        render: (price) => price.toLocaleString("vi-VN") + "đ",
      },
      { title: "Số lượng", dataIndex: "amount", key: "amount" },
      {
        title: "Giảm giá",
        dataIndex: "discount",
        key: "discount",
        render: (discount) => discount.toLocaleString() + "%",
      },
      {
        title: "Thành tiền",
        key: "total",
        render: (_, item) =>
          (item.price * item.amount * (1 - item.discount / 100)).toLocaleString(
            "vi-VN"
          ) + "đ",
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={record.orderItems}
        pagination={false}
        rowKey={(item) => item._id || item.name}
      />
    );
  };
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AA00FF",
    "#FF4081",
  ];
  const renderPieChart = () => {
    if (!orderStatusData?.data || orderStatusData.data.status !== "OK")
      return null;

    const data = orderStatusData.data.data.map((item) => ({
      name: item.status || "Không xác định",
      value: item.count,
    }));

    const renderCustomizedLabel = ({
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      percent,
      index,
    }) => {
      const RADIAN = Math.PI / 180;
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      return (
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor="middle"
          dominantBaseline="central"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    };

    return (
      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              dataKey="value"
              isAnimationActive={true}
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={125} 
              fill="#8884d8"
              label={renderCustomizedLabel}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value} đơn hàng`, name]} />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              wrapperStyle={{
                maxHeight: 300,
                overflow: "auto",
                lineHeight: "24px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div>
      <Card
        title={
          <Typography.Title
            level={4}
            style={{
              marginBottom: 0,
              fontWeight: 600,
              fontSize: 16,
              textAlign: "center",
            }}
          >
            Biểu đồ trạng thái đơn hàng
          </Typography.Title>
        }
        style={{ marginBottom: 10 }}
      >
        {renderPieChart()}
      </Card>

      <Select
        placeholder="Chọn trạng thái đơn hàng"
        style={{ width: 250, marginBottom: 16 }}
        allowClear
        options={[{ value: "", label: "Tất cả" }, ...statusOptions]}
        value={filterStatus}
        onChange={(value) => {
          setFilterStatus(value);
          setPage(0); // reset page về 0 khi đổi filter
        }}
      />

      <div style={{ marginTop: "10px" }}>
        <TableComponent
          rowSelection={null}
          columns={columns}
          expandable={{
            expandedRowRender,
            rowExpandable: (record) => record.orderItems.length > 0,
          }}
          data={
            isLoadingOrder
              ? []
              : orders?.map((order) => ({
                  ...order,
                  key: order._id,
                })) || []
          }
          isLoading={isLoadingOrder}
          pagination={{
            current: page + 1,
            pageSize: limit,
            total: total,
            onChange: (page, pageSize) => {
              setPage(page - 1);
              setLimit(pageSize);
            },
          }}
        />
      </div>
    </div>
  );
};

export default AdminProduct;
