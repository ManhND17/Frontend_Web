import React, { useCallback, useEffect, useRef, useState } from "react";
import { WrapperHeader } from "./style";
import { Button, Modal, Form, Upload, Space, Select } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { getBase64, renderOptions } from "../../utils";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as ProductService from "../../services/ProductService";
import { useMessage } from "../../components/Message/MessageProvider";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../Drawer/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";
import Highlighter from "react-highlight-words";
import { useDownloadExcel } from "react-export-table-to-excel";

const AdminProduct = () => {
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0); 
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [stateProduct, setStateProduct] = useState({
    name: "",
    price: "",
    description: "",
    rating: "",
    type: "",
    image: "",
    countInStock: "",
    selled: 0,
    discount: " ",
    newType: "",
  });

  const [stateProductDetails, setStateProductDetails] = useState({
    name: "",
    price: "",
    description: "",
    rating: "",
    type: "",
    image: "",
    countInStock: "",
    selled: "",
    discount: "",
  });
  const tableRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Danh_sach_nguoi_dung",
    sheet: "Users",
  });
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
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (text) => (
        <img
          src={text}
          alt="product"
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => price.toLocaleString("vi-VN") + "đ",
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Số sao",
      dataIndex: "rating",
      key: "rating",
      sorter: (a, b) => a.rating - b.rating,
    },
    { title: "Số lượng trong kho", dataIndex: "countInStock", key: "count" },
    { title: "Số lượng đã bán", dataIndex: "selled", key: "selled" },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
      render: (discount) => discount + "%",
      sorter: (a, b) => a.discount - b.discount,
    },
    { title: "Loại", dataIndex: "type", key: "type" },
    { title: "Ghi chú", dataIndex: "action", render: renderAction },
  ];

  const mutation = useMutationHooks((data) => {
    const {
      name,
      price,
      description,
      rating,
      type,
      image,
      countInStock,
      selled,
      discount,
    } = data;
    const res = ProductService.createProduct({
      name,
      price,
      description,
      rating,
      type,
      image,
      countInStock,
      selled,
      discount,
    });
    return res;
  });
  const [form] = Form.useForm();
  const { success, error } = useMessage();
  const { data, isSuccess, isError } = mutation;

  const user = useSelector((state) => state?.user);

  const getAllProduct = async (page,limit) => {
    const res = await ProductService.getAllProduct(null,page,limit);
    if (res.status === "OK") {
      setTotal(res.total);
    }
    return res;
  };

  const {
    data: products,
    isLoading: isLoadingProduct,
    refetch,
  } = useQuery({
    queryKey: ["products", page, limit],
    queryFn: () => getAllProduct(page, limit),
    retry: 3,
    retryDelay: 1000,
  });

  
  const fetchGetDetailsProduct = useCallback(async () => {
    if (!rowSelected) return;
    const res = await ProductService.getDetailProduct(rowSelected);
    if (res?.data) {
      setStateProductDetails({
        name: res?.data.name,
        price: res?.data.price,
        description: res?.data.description,
        rating: res?.data.rating,
        type: res?.data.type,
        image: res?.data.image,
        countInStock: res?.data.countInStock,
        selled: res?.data.selled,
        discount: res?.data.discount,
      });
    }
    return res;
  }, [rowSelected]);

  useEffect(() => {
    form.setFieldsValue(stateProductDetails);
  }, [form, stateProductDetails]);

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

  const handleOk = () => {
    form.submit();
    setIsModalOpen(false);
  };

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    setStateProduct({
      name: "",
      price: "",
      description: "",
      rating: "",
      type: "",
      image: "",
      countInStock: "",
      selled: "",
      discount: "",
    });
    form.resetFields();
  }, [form]);
  console.log(stateProduct);

  const onFinish = () => {
    const params = {
      name: stateProduct.name,
      price: stateProduct.price,
      description: stateProduct.description,
      rating: stateProduct.rating,
      type:
        stateProduct.type === "add-type"
          ? stateProduct.newType
          : stateProduct.type,
      image: stateProduct.image,
      countInStock: stateProduct.countInStock,
      selled: stateProduct.selled,
      discount: stateProduct.discount,
    };
    console.log("test", params);
    mutation.mutate(params, {
      onSettled: () => {
        refetch();
      },
    });
  };

  const handleOnchange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProduct({
      ...stateProduct,
      image: file.preview,
    });
  };

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetails({
      ...stateProductDetails,
      image: file.preview,
    });
  };

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = ProductService.updateProduct(id, token, rests);
    return res;
  });

  const onUpdateProduct = () => {
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, ...stateProductDetails },
      {
        onSettled: () => {
          refetch();
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
    setStateProductDetails({
      name: "",
      price: "",
      description: "",
      rating: "",
      type: "",
      image: "",
      countInStock: "",
      selled: "",
      discount: "",
    });
    form.resetFields();
  }, [form]);

  useEffect(() => {
    if (isSuccessUpdate && dataUpdate?.status === "OK") {
      success("Cập nhật sản phẩm thành công");
      refetch();
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
    refetch,
    handleCancelUpdate,
  ]);

  const mutationDelete = useMutationHooks((data) => {
    const { id, token } = data;
    const res = ProductService.deleteProduct(id, token);
    return res;
  });
  const {
    data: dataDelete,
    isSuccess: isSuccessDelete,
    isError: isErrorDelete,
  } = mutationDelete;

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      success("Tạo sản phẩm thành công");
      handleCancel();
    } else if (isError) {
      error("Xảy ra lỗi");
    }
  }, [isSuccess, isError, data?.status, error, success, handleCancel]);

  useEffect(() => {
    if (isSuccessDelete && dataDelete?.status === "OK") {
      success("Xóa sản phẩm thành công");
      refetch()
      handleCancel();
    } else if (isErrorDelete) {
      error("Xảy ra lỗi");
    }
  }, [
    isSuccessDelete,
    isErrorDelete,
    dataDelete?.status,
    error,
    refetch,
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
          refetch();
        },
      }
    );
    setIsModalOpenDelete(false);
  };
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    return res;
  };

  const typeProduct = useQuery({
    queryKey: ["type-product"],
    queryFn: fetchAllTypeProduct,
    retry: 3,
    retryDelay: 1000,
  });

  const WrapperUploadFile = ({ onChange, maxCount = 1 }) => {
    return (
      <Upload
        listType="picture"
        maxCount={maxCount}
        beforeUpload={() => false}
        onChange={onChange}
      >
        <Button icon={<UploadOutlined />}>Chọn File</Button>
      </Upload>
    );
  };

  const handleChangeSelect = (value) => {
    setStateProduct({
      ...stateProduct,
      type: value,
    });
  };

  return (
    <div>
      <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
      <div style={{ marginTop: "30px" }}>
        <Button
          style={{ height: "150px", width: "150px", borderRadius: "6px" }}
          onClick={() => setIsModalOpen(true)}
        >
          <PlusOutlined style={{ fontSize: "40px" }} />
        </Button>
      </div>
      <Button
        type="primary"
        onClick={onDownload}
        style={{ float: "right", marginRight: 20, marginBottom: 10 }}
      >
        Xuất Excel
      </Button>

      <div style={{ marginTop: "10px" }}>
        <TableComponent
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
          pagination={{
            current: page + 1,
            pageSize: limit,
            total: total,
            onChange: (page, pageSize) => {
              setPage(page - 1); 
              setLimit(pageSize);
            },
          }}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }}
        />
      </div>
      <Modal
        title="Tạo sản phẩm"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
          >
            <InputComponent
              value={stateProduct.name}
              onChange={handleOnchange}
              name="name"
            />
          </Form.Item>

          <Form.Item
            label="Loại"
            name="type"
            rules={[
              { required: true, message: "Vui lòng nhập loại sản phẩm!" },
            ]}
          >
            <Select
              name="type"
              value={stateProduct.type}
              onChange={handleChangeSelect}
              options={renderOptions(typeProduct?.data?.data)}
            />
          </Form.Item>

          {stateProduct.type === "add-type" && (
            <Form.Item
              label="New type"
              name="newType"
              rules={[
                { required: true, message: "Vui lòng nhập loại sản phẩm!" },
              ]}
            >
              <InputComponent
                value={stateProduct.newType}
                onChange={handleOnchange}
                name="newType"
              />
            </Form.Item>
          )}
          <Form.Item
            label="Số lượng"
            name="countInStock"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số lượng cho sản phẩm!",
              },
            ]}
          >
            <InputComponent
              value={stateProduct.countInStock}
              onChange={handleOnchange}
              name="countInStock"
            />
          </Form.Item>

          <Form.Item
            label="Số lượng đã bán"
            name="selled"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số lượng cho sản phẩm!",
              },
            ]}
          >
            <InputComponent
              value={stateProduct.selled}
              onChange={handleOnchange}
              name="selled"
            />
          </Form.Item>

          <Form.Item
            label="Giảm giá"
            name="discount"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập dữ liệu!",
              },
            ]}
          >
            <InputComponent
              value={stateProduct.discount}
              onChange={handleOnchange}
              name="discount"
            />
          </Form.Item>

          <Form.Item
            label="Giá"
            name="price"
            rules={[
              { required: true, message: "Vui lòng nhập giá cho sản phẩm!" },
            ]}
          >
            <InputComponent
              value={stateProduct.price}
              onChange={handleOnchange}
              name="price"
            />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              { required: true, message: "Vui lòng mô tả cho sản phẩm!" },
            ]}
          >
            <InputComponent
              value={stateProduct.description}
              onChange={handleOnchange}
              name="description"
            />
          </Form.Item>
          <Form.Item
            label="Số sao"
            name="rating"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số sao cho sản phẩm!",
              },
            ]}
          >
            <InputComponent
              value={stateProduct.rating}
              onChange={handleOnchange}
              name="rating"
            />
          </Form.Item>
          <Form.Item
            label="Ảnh"
            name="image"
            rules={[{ required: true, message: "Vui lòng tải ảnh sản phẩm!" }]}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1} />
              {stateProduct?.image && (
                <img
                  src={stateProduct?.image}
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
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Space size={20}>
              <Button onClick={handleCancel}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                Tạo sản phẩm
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <DrawerComponent
        title="Chi tiết sản phẩm"
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
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
          >
            <InputComponent
              value={stateProductDetails.name}
              onChange={handleOnchangeDetails}
              name="name"
            />
          </Form.Item>

          <Form.Item
            label="Loại"
            name="type"
            rules={[
              { required: true, message: "Vui lòng nhập loại sản phẩm!" },
            ]}
          >
            <InputComponent
              value={stateProductDetails.type}
              onChange={handleOnchangeDetails}
              name="type"
            />
          </Form.Item>

          <Form.Item
            label="Số lượng"
            name="countInStock"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số lượng cho sản phẩm!",
              },
            ]}
          >
            <InputComponent
              value={stateProductDetails.countInStock}
              onChange={handleOnchangeDetails}
              name="countInStock"
            />
          </Form.Item>

          <Form.Item
            label="Giảm giá"
            name="discount"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập dữ liệu!",
              },
            ]}
          >
            <InputComponent
              value={stateProductDetails.discount}
              onChange={handleOnchangeDetails}
              name="discount"
            />
          </Form.Item>

          <Form.Item
            label="Số lượng đã bán"
            name="selled"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập dữ liệu!",
              },
            ]}
          >
            <InputComponent
              value={stateProductDetails.selled}
              onChange={handleOnchangeDetails}
              name="selled"
            />
          </Form.Item>

          <Form.Item
            label="Giá"
            name="price"
            rules={[
              { required: true, message: "Vui lòng nhập giá cho sản phẩm!" },
            ]}
          >
            <InputComponent
              value={stateProductDetails.price}
              onChange={handleOnchangeDetails}
              name="price"
            />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              { required: true, message: "Vui lòng mô tả cho sản phẩm!" },
            ]}
          >
            <InputComponent
              value={stateProductDetails.description}
              onChange={handleOnchangeDetails}
              name="description"
            />
          </Form.Item>
          <Form.Item
            label="Số sao"
            name="rating"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số sao cho sản phẩm!",
              },
            ]}
          >
            <InputComponent
              value={stateProductDetails.rating}
              onChange={handleOnchangeDetails}
              name="rating"
            />
          </Form.Item>
          <Form.Item
            label="Ảnh"
            name="image"
            rules={[{ required: true, message: "Vui lòng tải ảnh sản phẩm!" }]}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <WrapperUploadFile
                onChange={handleOnchangeAvatarDetails}
                maxCount={1}
              />
              {stateProductDetails?.image && (
                <img
                  src={stateProductDetails?.image}
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
              onClick={onUpdateProduct}
              style={{ marginLeft: 8 }}
            >
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </DrawerComponent>
      <ModalComponent
        title="Xóa sản phẩm"
        open={isModalOpenDelete}
        onOk={handleOkDelete}
        onCancel={handleCancelDelete}
      >
        <siv>Bạn có chắn xóa sản phẩm này không?</siv>
      </ModalComponent>
    </div>
  );
};

export default AdminProduct;
