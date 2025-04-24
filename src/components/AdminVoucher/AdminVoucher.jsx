import React, { useCallback, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { WrapperHeader } from "./style";
import { Button, Modal, Form, Space, InputNumber, DatePicker } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as VoucherService from "../../services/VoucherService";
import { useMessage } from "../Message/MessageProvider";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../Drawer/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";
import Highlighter from "react-highlight-words";

const AdminVoucher = () => {
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const inittial = () => ({
    code: "",
    discount_percent: "",
    max_discount: "",
    min_order_value: "",
    start_date: null,
    end_date: null,
  });

  const [stateVoucher, setStateVoucher] = useState(inittial());
  const [stateVoucherDetails, setStateVoucherDetails] = useState(inittial());

  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined
          style={{ fontSize: "30px", color: "red", cursor: "pointer" }}
          onClick={() => setIsModalOpenDelete(true)}
        />
        <EditOutlined
          style={{ color: "orange", fontSize: "30px", cursor: "pointer" }}
          onClick={handleDetailsProduct}
        />
      </div>
    );
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
            searchInput.current?.select();
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

  const columns = [
    {
      title: "Mã voucher",
      dataIndex: "code",
      key: "code",
      sorter: (a, b) => a.code.length - b.code.length,
      ...getColumnSearchProps("code"),
    },
    {
      title: "Số phần trăm được giảm",
      dataIndex: "discount_percent",
      key: "discount_percent",
      render: (discount_percent) => `${discount_percent}%`,
      sorter: (a, b) => a.discount_percent - b.discount_percent,
    },
    {
      title: "Số tiền tối đa được giảm",
      dataIndex: "max_discount",
      key: "max_discount",
      render: (max_discount) => max_discount.toLocaleString("vi-VN") + "đ",
      sorter: (a, b) => a.max_discount - b.max_discount,
    },
    {
      title: "Giá trị tối thiểu của đơn hàng",
      dataIndex: "min_order_value",
      key: "min_order_value",
      render: (min_order_value) =>
        min_order_value.toLocaleString("vi-VN") + "đ",
      sorter: (a, b) => a.min_order_value - b.min_order_value,
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (start_date) => dayjs(start_date).format("DD/MM/YYYY"),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (end_date) => dayjs(end_date).format("DD/MM/YYYY"),
    },
    {
      title: "Ghi chú",
      dataIndex: "action",
      render: renderAction,
    },
  ];

  const user = useSelector((state) => state?.user);
  const { success, error } = useMessage();
  const [form] = Form.useForm();

  const mutation = useMutationHooks((data) => {
    const { access_token, ...voucherData } = data;
    return VoucherService.createVoucher(voucherData, access_token);
  });

  const getAllVoucher = async () => {
    const res = await VoucherService.getAllVoucher();
    return res;
  };

  const {
    data: vouchers,
    isLoading: isLoadingVoucher,
    refetch,
  } = useQuery({
    queryKey: ["voucher"],
    queryFn: getAllVoucher,
    retry: 3,
    retryDelay: 1000,
  });

  const fetchGetDetailsVoucher = useCallback(
    async (id) => {
      if (!id) return;
      const res = await VoucherService.getDetailVoucher(id);
      if (res?.data) {
        const voucherData = {
          code: res.data.code,
          discount_percent: res.data.discount_percent,
          min_order_value: res.data.min_order_value,
          max_discount: res.data.max_discount,
          start_date: dayjs(res.data.start_date),
          end_date: dayjs(res.data.end_date),
        };
        setStateVoucherDetails(voucherData);
        form.setFieldsValue(voucherData);
        if (isModalOpen) {
          const empty = inittial();
          form.setFieldsValue(empty);
          setStateVoucher(empty);
        }
      }
      return res;
    },
    [form]
  );
  useEffect(() => {
      form.setFieldsValue(stateVoucherDetails);
      if (isModalOpen) {
        const empty = inittial();
        form.setFieldsValue(empty);
        setStateVoucher(empty);
      }
    }, [form,isModalOpen]);

  const handleDetailsProduct = useCallback(async () => {
    if (rowSelected) {
      await fetchGetDetailsVoucher(rowSelected);
      setIsOpenDrawer(true);
    }
  }, [rowSelected, fetchGetDetailsVoucher]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      fetchGetDetailsVoucher(rowSelected);
    }
  }, [rowSelected, isOpenDrawer, fetchGetDetailsVoucher]);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    setStateVoucher(inittial());
    form.resetFields();
  }, [form]);

  const handleOk = () => {
    form.submit();
  };

  const handleDateChange = (field, date) => {
    setStateVoucher({
      ...stateVoucher,
      [field]: date ? date.format("YYYY-MM-DD") : null,
    });
  };

  const onFinish = async () => {
    try {
      const params = {
        ...stateVoucher,
        access_token: user?.access_token,
      };

      mutation.mutate(params, {
        onSuccess: () => {
          refetch();
          success("Tạo voucher thành công");
          handleCancel();
        },
        onError: () => {
          error("Xảy ra lỗi khi tạo voucher");
        },
      });
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };

  const handleOnchange = (e) => {
    setStateVoucher({
      ...stateVoucher,
      [e.target.name]: e.target.value,
    });
  };

  const mutationUpdate = useMutationHooks((data) => {
    const { id, access_token, ...rest } = data;
    return VoucherService.updateVoucher(id, rest, access_token);
  });

  const onUpdateVoucher = async () => {
    try {
      const values = await form.validateFields();
      const params = {
        id: rowSelected,
        ...values,
        start_date: values.start_date.format("YYYY-MM-DD"),
        end_date: values.end_date.format("YYYY-MM-DD"),
        access_token: user?.access_token,
      };

      mutationUpdate.mutate(params, {
        onSuccess: () => {
          refetch();
          success("Cập nhật voucher thành công");
          setIsOpenDrawer(false);
        },
        onError: () => {
          error("Xảy ra lỗi khi cập nhật voucher");
        },
      });
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };

  const handleCancelUpdate = useCallback(() => {
    setIsOpenDrawer(false);
    setStateVoucherDetails(inittial());
    form.resetFields();
  }, [form]);

  const mutationDelete = useMutationHooks((data) => {
    const { id, access_token } = data;
    return VoucherService.deleteVoucher(id, access_token);
  });

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleOkDelete = () => {
    mutationDelete.mutate(
      { id: rowSelected, access_token: user?.access_token },
      {
        onSuccess: () => {
          refetch();
          success("Xóa voucher thành công");
          setIsModalOpenDelete(false);
        },
        onError: () => {
          error("Xảy ra lỗi khi xóa voucher");
        },
      }
    );
  };

  return (
    <div>
      <WrapperHeader>Quản lý voucher</WrapperHeader>
      <div style={{ marginTop: "30px" }}>
        <Button
          style={{ height: "150px", width: "150px", borderRadius: "6px" }}
          onClick={() => setIsModalOpen(true)}
        >
          <PlusOutlined style={{ fontSize: "40px" }} />
        </Button>
      </div>

      <div style={{ marginTop: "10px" }}>
        <TableComponent
          rowSelection={null}
          columns={columns}
          data={
            isLoadingVoucher
              ? []
              : vouchers?.data?.map((item) => ({
                  ...item,
                  key: item._id,
                })) || []
          }
          isLoading={isLoadingVoucher}
          onRow={(record) => {
            return {
              onClick: () => {
                setRowSelected(record._id);
              },
            };
          }}
        />
      </div>

      <Modal
        title="Tạo voucher"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="voucher-form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="Mã voucher"
            name="code"
            rules={[{ required: true, message: "Vui lòng nhập mã voucher!" }]}
          >
            <InputComponent
              value={stateVoucher.code}
              onChange={handleOnchange}
              name="code"
            />
          </Form.Item>

          <Form.Item
            label="Phần trăm giảm giá (%)"
            name="discount_percent"
            rules={[
              { required: true, message: "Vui lòng nhập phần trăm giảm giá!" },
              {
                type: "number",
                min: 1,
                max: 100,
                message: "Phần trăm giảm giá phải từ 1-100%",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              onChange={(value) =>
                setStateVoucher({ ...stateVoucher, discount_percent: value })
              }
            />
          </Form.Item>

          <Form.Item
            label="Giảm giá tối đa (VND)"
            name="max_discount"
            rules={[
              { required: true, message: "Vui lòng nhập mức giảm giá tối đa!" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              onChange={(value) =>
                setStateVoucher({ ...stateVoucher, max_discount: value })
              }
            />
          </Form.Item>

          <Form.Item
            label="Giá tối thiểu để áp dụng"
            name="min_order_value"
            rules={[
              { required: true, message: "Vui lòng nhập mức giá tối thiểu!" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              onChange={(value) =>
                setStateVoucher({ ...stateVoucher, min_order_value: value })
              }
            />
          </Form.Item>

          <Form.Item
            label="Ngày bắt đầu"
            name="start_date"
            rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              onChange={(date) => handleDateChange("start_date", date)}
            />
          </Form.Item>

          <Form.Item
            label="Ngày kết thúc"
            name="end_date"
            rules={[
              { required: true, message: "Vui lòng chọn ngày kết thúc!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    !value ||
                    dayjs(stateVoucher.start_date).isBefore(value)
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Ngày kết thúc phải sau ngày bắt đầu!")
                  );
                },
              }),
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              onChange={(date) => handleDateChange("end_date", date)}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Space size={20}>
              <Button onClick={handleCancel}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                Tạo voucher
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <DrawerComponent
        title="Chi tiết voucher"
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
        width="80%"
        footer={null}
      >
        <Form
          form={form}
          name="voucher-details-form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={stateVoucherDetails}
          autoComplete="off"
        >
          <Form.Item
            label="Mã voucher"
            name="code"
            rules={[{ required: true, message: "Vui lòng nhập mã voucher!" }]}
          >
            <InputComponent name="code" />
          </Form.Item>

          <Form.Item
            label="Phần trăm giảm giá (%)"
            name="discount_percent"
            rules={[
              { required: true, message: "Vui lòng nhập phần trăm giảm giá!" },
              {
                type: "number",
                min: 1,
                max: 100,
                message: "Phần trăm giảm giá phải từ 1-100%",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Giảm giá tối đa (VND)"
            name="max_discount"
            rules={[
              { required: true, message: "Vui lòng nhập mức giảm giá tối đa!" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Giá tối thiểu để áp dụng"
            name="min_order_value"
            rules={[
              { required: true, message: "Vui lòng nhập mức giá tối thiểu!" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Ngày bắt đầu"
            name="start_date"
            rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            label="Ngày kết thúc"
            name="end_date"
            rules={[
              { required: true, message: "Vui lòng chọn ngày kết thúc!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("start_date").isBefore(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Ngày kết thúc phải sau ngày bắt đầu!")
                  );
                },
              }),
            ]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Space size={20}>
              <Button onClick={handleCancelUpdate}>Hủy</Button>
              <Button type="primary" onClick={onUpdateVoucher}>
                Cập nhật voucher
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </DrawerComponent>

      <ModalComponent
        title="Xóa voucher"
        open={isModalOpenDelete}
        onOk={handleOkDelete}
        onCancel={handleCancelDelete}
      >
        <div>Bạn có chắc xóa voucher này không?</div>
      </ModalComponent>
    </div>
  );
};

export default AdminVoucher;
