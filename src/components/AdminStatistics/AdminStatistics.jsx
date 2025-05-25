import React from "react";
import {
  Table,
  DatePicker,
  Pagination,
  Avatar,
  Statistic,
  Row,
  Col,
} from "antd";
import moment from "moment";
import * as OrderService from "../../services/OrderService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, Select } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  ShoppingCartOutlined,
  UserOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
const { RangePicker } = DatePicker;

const monthNames = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Màu sắc cho các thanh bar
const revenueBarColor = "#2563eb"; // xanh dương đậm (tailwind blue-600)
const hoverColorRevenue = "#3b82f6"; // xanh sáng khi hover

const AdminStatistics = () => {
  const user = useSelector((state) => state.user);
  const [selectedMonth, setSelectedMonth] = React.useState(
    new Date().getMonth() + 1
  );
  const [dateRange, setDateRange] = React.useState([
    moment().startOf("day"),
    moment().endOf("day"),
  ]);

  const [orderPage, setOrderPage] = React.useState(1);
  const [orderLimit, setOrderLimit] = React.useState(5);
  const [topLimit, setTopLimit] = React.useState(10);

  const year = new Date().getFullYear();

  const { data: summaryData, isLoading: loadingSummary } = useQuery({
    queryKey: ["summaryStats"],
    queryFn: async () => {
      const res = await OrderService.getSummaryStat(user?.access_token);
      return res.data.data;
    },
    enabled: !!user?.access_token,
  });

  const { data: revenueData, isLoading: loadingRevenue } = useQuery({
    queryKey: ["revenueByMonth"],
    queryFn: async () => {
      const res = await OrderService.getRevenueByMonth(user?.access_token);
      return res.data?.data || [];
    },
    enabled: !!user?.access_token,
  });
  const columnsCustomer = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "ID Khách hàng",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Số đơn",
      dataIndex: "orderCount",
      key: "orderCount",
    },
    {
      title: "Tổng chi tiêu",
      dataIndex: "totalSpent",
      key: "totalSpent",
      render: (spent) =>
        spent?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
  ];
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "ID Sản phẩm",
      dataIndex: "productId",
      key: "productId",
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) => <Avatar shape="square" size={64} src={image} />,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) =>
        price?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    {
      title: "Số lượng bán",
      dataIndex: "totalSold",
      key: "totalSold",
    },
  ];
  const { data: orderData, isLoading: loadingOrders } = useQuery({
    queryKey: ["ordersByDateRange", dateRange, orderPage, orderLimit],
    queryFn: async () => {
      if (!dateRange || dateRange.length !== 2) return { data: [], total: 0 };

      const [startDate, endDate] = dateRange;
      const res = await OrderService.getOrderByDateRange(
        startDate.format("YYYY-MM-DD"),
        endDate.format("YYYY-MM-DD"),
        orderPage,
        orderLimit,
        user?.access_token
      );
      return res.data;
    },
    enabled: !!user?.access_token && !!dateRange,
  });
  const [customerLimit, setCustomerLimit] = React.useState(10);

  const { data: topCustomersDataRaw, isLoading: loadingCustomers } = useQuery({
    queryKey: ["topCustomers", selectedMonth, customerLimit],
    queryFn: async () => {
      const res = await OrderService.TopCustomer(
        selectedMonth,
        year,
        customerLimit,
        user?.access_token
      );
      return res.data?.data || [];
    },
    enabled: !!user?.access_token,
  });

  const topCustomersData = topCustomersDataRaw?.slice(0, customerLimit) || [];

  const { data: topProductsDataRaw, isLoading: loadingTop } = useQuery({
    queryKey: ["topProducts", selectedMonth, topLimit],
    queryFn: async () => {
      const res = await OrderService.TopSelling(
        selectedMonth,
        year,
        user?.access_token
      );
      return res.data?.data || [];
    },
    enabled: !!user?.access_token,
  });

  const topProductsData = topProductsDataRaw?.slice(0, topLimit) || [];

  const revenueChartData =
    revenueData?.monthlyData.map((item) => ({
      month: monthNames[item.month],
      revenue: item.totalRevenue,
    })) || [];

  return (
    <div style={{ padding: 24, background: "#f9fafb", minHeight: "100vh" }}>
      {/* Thêm phần thống kê tổng quan */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col span={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Statistic
              title="Tổng số khách hàng"
              value={summaryData?.totalCustomers || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#3f8600" }}
              loading={loadingSummary}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Statistic
              title="Tổng số đơn hàng"
              value={summaryData?.totalOrders || 0}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: "#1890ff" }}
              loading={loadingSummary}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Statistic
              title="Tổng số sản phẩm"
              value={summaryData?.totalProduct || 0}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: "#722ed1" }}
              loading={loadingSummary}
            />
          </Card>
        </Col>
      </Row>
      {/* Doanh thu theo tháng */}
      <Card
        title="📊 Doanh thu theo tháng"
        style={{
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
          borderRadius: 16,
          marginBottom: 32,
          background: "#fff",
        }}
        headStyle={{
          fontSize: 24,
          fontWeight: 700,
          textAlign: "center",
          color: "#111827", // gray-900
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        {loadingRevenue ? (
          <p style={{ textAlign: "center", color: "#6b7280" /* gray-500 */ }}>
            Đang tải dữ liệu doanh thu...
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={420}>
            <BarChart
              data={revenueChartData}
              margin={{ top: 24, right: 30, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 14, fill: "#6b7280" }}
                axisLine={{ stroke: "#d1d5db" }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(value) => `${value / 1000000}M`}
                tick={{ fontSize: 14, fill: "#6b7280" }}
                axisLine={{ stroke: "#d1d5db" }}
                tickLine={false}
                label={{
                  value: "VNĐ",
                  angle: -90,
                  position: "insideLeft",
                  offset: 20,
                  fill: "#6b7280",
                  fontSize: 16,
                  fontWeight: "600",
                }}
              />
              <Tooltip
                cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                contentStyle={{
                  backgroundColor: "#111827",
                  borderRadius: 10,
                  border: "none",
                  color: "#f9fafb",
                  fontSize: 14,
                  padding: "8px 12px",
                  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                }}
                formatter={(value) =>
                  new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(value)
                }
              />
              <Legend
                verticalAlign="top"
                wrapperStyle={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#374151",
                }}
              />
              <Bar
                dataKey="revenue"
                fill={revenueBarColor}
                radius={[10, 10, 0, 0]}
                name="Doanh thu"
                animationDuration={900}
              >
                {revenueChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={revenueBarColor}
                    style={{ cursor: "pointer", transition: "fill 0.3s ease" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.fill = hoverColorRevenue)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.fill = revenueBarColor)
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Top sản phẩm bán chạy */}
      <Card
        title={`🔥 Top ${topLimit} sản phẩm bán chạy`}
        extra={
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <Select
              value={selectedMonth}
              onChange={(value) => setSelectedMonth(value)}
              options={Array.from({ length: 12 }, (_, i) => ({
                value: i + 1,
                label: `Tháng ${i + 1}`,
              }))}
              style={{ width: 140 }}
            />
            <Select
              value={topLimit}
              onChange={(value) => setTopLimit(value)}
              options={[5, 10, 15, 20].map((num) => ({
                value: num,
                label: `Top ${num}`,
              }))}
              style={{ width: 100 }}
            />
          </div>
        }
        style={{
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
          borderRadius: 16,
          background: "#fff",
        }}
      >
        {loadingTop ? (
          <p style={{ textAlign: "center", color: "#6b7280" }}>
            Đang tải top sản phẩm...
          </p>
        ) : (
          <Table
            style={{ marginTop: 24 }}
            columns={columns}
            dataSource={topProductsData}
            rowKey="_id"
            pagination={false}
          />
        )}
      </Card>
      <Card
        title={`🏆 Top ${customerLimit} khách hàng mua nhiều nhất`}
        extra={
          <Select
            value={customerLimit}
            onChange={(value) => setCustomerLimit(value)}
            options={[5, 10, 15, 20].map((num) => ({
              value: num,
              label: `Top ${num}`,
            }))}
            style={{ width: 100 }}
          />
        }
        style={{
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
          borderRadius: 16,
          background: "#fff",
          marginTop: 32,
        }}
      >
        {loadingCustomers ? (
          <p style={{ textAlign: "center", color: "#6b7280" }}>
            Đang tải dữ liệu khách hàng...
          </p>
        ) : (
          <Table
            style={{ marginTop: 24 }}
            columns={columnsCustomer}
            dataSource={topCustomersData}
            rowKey="_id"
            pagination={false}
          />
        )}
      </Card>
      <Card
        title="📅 Danh sách đơn hàng theo ngày"
        style={{
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
          borderRadius: 16,
          background: "#fff",
          marginTop: 32,
        }}
        extra={
          <RangePicker
            renderExtraFooter={() => null}
            picker="date"
            showNow={false}
            defaultValue={[moment().startOf("day"), moment().endOf("day")]}
            value={dateRange}
            onChange={(dates, dateStrings) => {
              if (dates && dates[0] && dates[1]) {
                const adjustedDates = [
                  dates[0].startOf("day"),
                  dates[1].endOf("day"),
                ];
                setDateRange(adjustedDates);
                setOrderPage(1);
              } else {
                setDateRange([moment().startOf("day"), moment().endOf("day")]);
              }
            }}
            format="YYYY-MM-DD"
            allowClear={false}
            disabledDate={(current) => {
              return current && current > moment().endOf("day");
            }}
          />
        }
      >
        <p
          style={{
            fontWeight: 600,
            fontSize: 16,
            color: "#059669",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Số đơn hàng đã đặt: {orderData?.pagination?.total ?? 0}
        </p>

        {loadingOrders ? (
          <p style={{ textAlign: "center", color: "#6b7280" }}>
            Đang tải danh sách đơn hàng...
          </p>
        ) : (
          <>
            <p
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "#059669",
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              <span>
                📌 Doanh thu:{" "}
                {orderData?.revenue.toLocaleString("vi-VN")} VND
              </span>
            </p>
            <Table
              dataSource={orderData?.data || []}
              rowKey="_id"
              pagination={false}
              columns={[
                {
                  title: "Mã đơn",
                  dataIndex: "_id",
                  key: "_id",
                },
                {
                  title: "Khách hàng",
                  dataIndex: "userName",
                  render: (_, record) =>
                    record.shippingAddress?.fullName || "Không có tên",
                },
                {
                  title: "SĐT",
                  key: "phone",
                  render: (_, record) =>
                    record.shippingAddress?.phone || "Không có SĐT",
                },
                {
                  title: "Địa chỉ",
                  key: "address",
                  render: (_, record) =>
                    `${record.shippingAddress?.address}, ${record.shippingAddress?.city}`,
                },
                {
                  title: "Tổng tiền",
                  dataIndex: "totalPrice",
                  key: "totalPrice",
                  render: (value) =>
                    new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(value),
                },
                {
                  title: "Ngày tạo",
                  dataIndex: "createdAt",
                  key: "createdAt",
                  render: (value) => moment(value).format("HH:mm DD/MM/YYYY"),
                },
              ]}
            />
            <Pagination
              current={orderPage}
              pageSize={orderLimit}
              total={orderData?.pagination.total || 0}
              onChange={(page, pageSize) => {
                setOrderPage(page);
                setOrderLimit(pageSize);
              }}
              style={{ marginTop: 16, textAlign: "right" }}
            />
          </>
        )}
      </Card>
    </div>
  );
};

export default AdminStatistics;
