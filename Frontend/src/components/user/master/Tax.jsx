import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button, Input, Select, Table, message } from "antd";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Space, Popconfirm } from "antd";

function Tax() {
  let agency = JSON.parse(localStorage.getItem("agency")) || null;
  // const navigate = useNavigate();
  const [result, setResult] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState({});

  const [data, setData] = useState({
    id: "",
    agencyid: agency._id,
    title: '',
    cgstpercent: '',
    sgstpercent: '',
    igstpercent: '',
    gstcode: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(e) {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  function validateForm() {
    const newErrors = {};

    if (!data.title.trim()) {
      newErrors.title = "title is required";
    }

    if (!data.cgstpercent.trim()) {
      newErrors.cgstpercent = "cgst percent is required";
    } else if (!/^\d+$/.test(data.cgstpercent.trim())) {
      newErrors.cgstpercent = "cgst percent must be a number";
    }

    if (!data.sgstpercent.trim()) {
      newErrors.sgstpercent = "sgst percent is required";
    }else if (!/^\d+$/.test(data.sgstpercent.trim())) {
      newErrors.sgstpercent = "sgst percent must be a number";
    }

    if (!data.igstpercent.trim()) {
      newErrors.igstpercent = "igst percent is required";
    }else if (!/^\d+$/.test(data.igstpercent.trim())) {
      newErrors.igstpercent = "igst percent must be a number";
    }

    if (!data.gstcode.trim()) {
      newErrors.gstcode = "gst code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function handleSave(e) {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...data,
      cgstpercent: parseFloat(data.cgstpercent || 0).toFixed(2),
      sgstpercent: parseFloat(data.sgstpercent || 0).toFixed(2),
      igstpercent: parseFloat(data.igstpercent || 0).toFixed(2),
    };

    if (isEditMode) {
      axios
        .put(`http://localhost:8081/gsts/${data.id}`, payload)
        .then(() => {
          message.success("GST updated successfully");
          loadData();
          setIsEditMode(false);
        })
        .catch(() => message.error("Update failed"));
    } else {
      axios
        .post("http://localhost:8081/gsts", payload)
        .then(() => {
          message.success("GST added successfully");
          loadData();
        })
        .catch(() => message.error("Save failed"));
    }
  };

  function handleCancel() {
    setData({
      id: "",
      agencyid: agency._id,
      title: '',
      cgstpercent: '',
      sgstpercent: '',
      igstpercent: '',
      gstcode: ''
    });
    setIsEditMode(false);
    setErrors({});
  };

  function handleEdit(record) {
    setData({
      id: record._id,
      agencyid: record.agencyid,
      title: record.title,
      cgstpercent: record.cgstpercent,
      sgstpercent: record.sgstpercent,
      igstpercent: record.igstpercent,
      gstcode: record.gstcode,
    });
    setIsEditMode(true);
    setErrors({});
  };

  function handleDelete(id) {
    axios
      .delete(`http://localhost:8081/gsts/${id}`)
      .then(() => {
        message.success("GST deleted successfully");
        loadData();
      })
      .catch(() => message.error("Delete failed"));
  };

  function loadData() {
    setData({
      id: "",
      agencyid: agency._id,
      title: '',
      cgstpercent: '',
      sgstpercent: '',
      igstpercent: '',
      gstcode: ''
    });
    setIsEditMode(false);
    setErrors({});

    axios.get("http://localhost:8081/gsts/").then((res) => {
      setResult(res.data.data);
    });
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "GST Code",
      dataIndex: "gstcode",
    },
    {
      title: "CGST %",
      dataIndex: "cgstpercent",
      render: (val) => Number(val).toFixed(2),
    },
    {
      title: "SGST %",
      dataIndex: "sgstpercent",
      render: (val) => Number(val).toFixed(2),
    },
    {
      title: "IGST %",
      dataIndex: "igstpercent",
      render: (val) => Number(val).toFixed(2),
    },
    {
      title: "Actions",
      render: (record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this tax planning?"
            onConfirm={() => handleDelete(record._id)}  // ✅ Only runs when user confirms
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>GST</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to={"/"}>Master</Link>
            </li>
            <li className="breadcrumb-item active">GST</li>
          </ol>
        </nav>
      </div>

      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            <div className="card p-3">
              <div className="row">
                <div className="col-lg-6 p-1">
                  GST PLAN TITLE*
                  <Input
                    id="title"
                    onChange={handleChange}
                    value={data.title}
                    placeholder="Title"
                    status={errors.title ? "error" : ""}
                  />
                  {errors.title && <div style={{ color: "red" }}>{errors.title}</div>}
                </div>
                <div className="col-lg-6 p-1">
                  GST PLAN CODE*
                  <Input
                    id="gstcode"
                    onChange={handleChange}
                    value={data.gstcode}
                    placeholder="GST Code"
                    status={errors.gstcode ? "error" : ""}
                  />
                  {errors.gstcode && <div style={{ color: "red" }}>{errors.gstcode}</div>}
                </div>
                <div className="col-lg-6 p-1">
                  CGST %*
                  <Input
                    id="cgstpercent"
                    onChange={handleChange}
                    value={data.cgstpercent}
                    placeholder="CGST"
                    status={errors.cgstpercent ? "error" : ""}
                  />
                  {errors.cgstpercent && <div style={{ color: "red" }}>{errors.cgstpercent}</div>}
                </div>
                <div className="col-lg-6 p-1">
                  SGST %*
                  <Input
                    id="sgstpercent"
                    onChange={handleChange}
                    value={data.sgstpercent}
                    placeholder="SGST"
                    status={errors.sgstpercent ? "error" : ""}
                  />
                  {errors.sgstpercent && <div style={{ color: "red" }}>{errors.sgstpercent}</div>}
                </div>
                <div className="col-lg-6 p-1">
                  IGST %*
                  <Input
                    id="igstpercent"
                    onChange={handleChange}
                    value={data.igstpercent}
                    placeholder="IGST"
                    status={errors.igstpercent ? "error" : ""}
                  />
                  {errors.igstpercent && <div style={{ color: "red" }}>{errors.igstpercent}</div>}
                </div>
                <div className="col-lg-12 p-1">
                  <Button onClick={handleSave} type="primary">
                    {isEditMode ? "Update" : "Save"}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    danger
                    className="ms-1"
                    type="primary"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>

            <div className="card p-3 mt-3">
              <Table
                columns={columns}
                dataSource={result}
                rowKey={(record) => record._id}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Tax;