import React, { useCallback, useEffect, useRef, useState } from "react";
import { WrapperHeader } from "./style";
import { Button, Form, Space, Upload } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import DrawerComponent from "../Drawer/DrawerComponent";
import Highlighter from "react-highlight-words";
import { getBase64 } from "../../utils";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";
import { useQuery } from "@tanstack/react-query";
import { useMessage } from "../../components/Message/MessageProvider";
import * as UserService from "../../services/UserService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const WrapperUploadFile = ({ onChange, maxCount = 1 }) => (
  <Upload
    listType="picture"
    maxCount={maxCount}
    beforeUpload={() => false}
    onChange={onChange}
  >
    <Button icon={<UploadOutlined />}>Chọn File</Button>
  </Upload>
);

const AdminUser = () => {
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [stateUser, setStateUser] = useState({
    name: "",
    avatar: "",
    email: "",
    address: "",
    phone: "",
    isAdmin: false,
  });

  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    avatar: "",
    email: "",
    address: "",
    phone: "",
    isAdmin: false,
  });
  const handleDownloadExcel = () => {
    if (!products?.data) return;
  
    const dataExport = products.data.map((item) => ({
      "Tên khách hàng": item.name,
      "Email": item.email,
      "Số điện thoại": item.phone,
      "Địa chỉ": item.address,
      "Admin": item.isAdmin,
    }));
  
    const ws = XLSX.utils.json_to_sheet(dataExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Danh sách người dùng");
  
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Danh_sach_nguoi_dung.xlsx");
  };
  
  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined
          style={{ fontSize: "30px", color: "red", cursor: "pointer" }}
          onClick={() => setIsModalOpenDelete(true)}
        />
        <EditOutlined
          style={{ color: "orange", fontSize: "30px", cursor: "pointer" }}
          onClick={async () => await handleDetailsProduct()}
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

  const columns = [
    {
      title: "Tên khách hàng",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Ảnh",
      dataIndex: "avatar",
      key: "avatar",
      render: (text) => (
        <img
          src={text}
          alt="user"
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Admin",
      dataIndex: "isAdmin",
      key: "isAdmin",
      render: (isAdmin) => (isAdmin ? "True" : "False"),
    },
    { title: "Ghi chú", dataIndex: "action", render: renderAction },
  ];

  const mutation = useMutationHooks((data) => {
    const { name, email, address, phone, isAdmin, avatar } = data;
    const res = UserService.SignUpUser({
      name,
      email,
      address,
      phone,
      isAdmin,
      avatar,
    });
    return res;
  });

  const [form] = Form.useForm();
  const { success, error } = useMessage();
  const { data, isSuccess, isError } = mutation;

  const user = useSelector((state) => state?.user);
  const getAllUser = async () => {
    const res = await UserService.getAllUser(user?.access_token);
    return res;
  };
  const queryUser = useQuery({
    queryKey: ["users"],
    queryFn: getAllUser,
    retry: 3,
    retryDelay: 1000,
  });
  const { isLoading: isLoadingProduct, data: products } = queryUser;

  const fetchGetDetailsProduct = useCallback(async () => {
    if (!rowSelected) return;
    const res = await UserService.getDetailUser(
      rowSelected,
      user?.access_token
    );
    if (res?.data) {
      setStateUserDetails({
        name: res?.data?.name,
        email: res?.data?.email,
        address: res?.data?.address,
        phone: res?.data?.phone,
        avatar: res?.data?.avatar,
        idAdmin: res?.data?.isAdmin,
      });
    }
    return res;
  }, [rowSelected, user?.access_token]);

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  useEffect(() => {
    if (rowSelected) {
      fetchGetDetailsProduct(rowSelected);
    }
  }, [rowSelected, fetchGetDetailsProduct]);

  const handleDetailsProduct = useCallback(() => {
    if (rowSelected) {
      fetchGetDetailsProduct();
    }
    setIsOpenDrawer(true);
  }, [rowSelected, fetchGetDetailsProduct]);

  const handleCancel = useCallback(() => {
    setStateUser({
      name: "",
      email: "",
      address: "",
      phone: "",
      isAdmin: "",
    });
    form.resetFields();
  }, [form]);

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateUserDetails({
      ...stateUserDetails,
      avatar: file.preview,
    });
  };

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, rests, token);
    return res;
  });

  const onUpdateUser = () => {
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, ...stateUserDetails },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };
  const {
    data: dataUpdate,
    isSuccess: isSuccessUpdate,
    isError: isErrorUpdate,
  } = mutationUpdate;

  const handleCancelUpdate = useCallback(() => {
    setIsOpenDrawer(false);
    setStateUserDetails({
      name: "",
      price: "",
      description: "",
      rating: "",
      type: "",
      image: "",
      countInStock: "",
    });
    form.resetFields();
  }, [form]);

  useEffect(() => {
    if (isSuccessUpdate && dataUpdate?.status === "OK") {
      success("Cập nhật thành công");
      handleCancelUpdate();
    } else if (isErrorUpdate) {
      error("Xảy ra lỗi");
    }
  }, [
    isSuccessUpdate,
    isErrorUpdate,
    dataUpdate?.status,
    error,
    success,
    handleCancelUpdate,
  ]);

  const mutationDelete = useMutationHooks((data) => {
    const { id, token } = data;
    const res = UserService.deleteUser(id, token);
    return res;
  });
  const {
    data: dataDelete,
    isSuccess: isSuccessDelete,
    isError: isErrorDelete,
  } = mutationDelete;

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      success("Tạo thành công");
      handleCancel();
    } else if (isError) {
      error("Xảy ra lỗi");
    }
  }, [isSuccess, isError, data?.status, error, success, handleCancel]);

  useEffect(() => {
    if (isSuccessDelete && dataDelete?.status === "OK") {
      success("Xóa thành công");
      handleCancel();
    } else if (isErrorDelete) {
      error("Xảy ra lỗi");
    }
  }, [
    isSuccessDelete,
    isErrorDelete,
    dataDelete?.status,
    error,
    success,
    handleCancel,
  ]);

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleOkDelete = () => {
    mutationDelete.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
    setIsModalOpenDelete(false);
  };
  return (
    <div>
      <WrapperHeader>Quản lý người dùng</WrapperHeader>
      <div style={{ marginTop: "10px" }}>
        <Button
          type="primary"
          onClick={handleDownloadExcel}
          style={{ float: "right", marginRight: 20, marginBottom: 10 }}
        >
          Xuất Excel
        </Button>

        <TableComponent
          rowSelection={null}
          columns={columns}
          data={
            isLoadingProduct
              ? []
              : products?.data?.map((product) => ({
                  ...product,
                  key: product._id,
                })) || []
          }
          isLoading={isLoadingProduct}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }}
        />
      </div>

      <DrawerComponent
        title="Chi tiết khách hàng"
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
        width="80%"
        footer={null}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="Tên khách hàng"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
          >
            <InputComponent
              value={stateUserDetails.name}
              onChange={handleOnchangeDetails}
              name="name"
            />
          </Form.Item>

          <Form.Item
            label="email"
            name="email"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email!",
              },
            ]}
          >
            <InputComponent
              value={stateUserDetails.email}
              onChange={handleOnchangeDetails}
              name="email"
            />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <InputComponent
              value={stateUserDetails.phone}
              onChange={handleOnchangeDetails}
              name="phone"
            />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <InputComponent
              value={stateUserDetails.address}
              onChange={handleOnchangeDetails}
              name="address"
            />
          </Form.Item>
          <Form.Item
            label="Ảnh"
            name="avatar"
            rules={[{ required: true, message: "Vui lòng tải ảnh sản phẩm!" }]}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <WrapperUploadFile
                onChange={handleOnchangeAvatarDetails}
                maxCount={1}
              />
              {stateUser?.avatar && (
                <img
                  src={stateUser?.avatar}
                  style={{
                    height: "50px",
                    width: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginLeft: "10px",
                  }}
                  alt="avatar"
                />
              )}
            </div>
          </Form.Item>
          <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: "right" }}>
            <Button
              type="primary"
              onClick={onUpdateUser}
              style={{ marginLeft: 8 }}
            >
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </DrawerComponent>
      <ModalComponent
        title="Xóa tài khoản"
        open={isModalOpenDelete}
        onOk={handleOkDelete}
        onCancel={handleCancelDelete}
      >
        <siv>Bạn có chắn xóa khách hàng này không?</siv>
      </ModalComponent>
    </div>
  );
};

export default AdminUser;
