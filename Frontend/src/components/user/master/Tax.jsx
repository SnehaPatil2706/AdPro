import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button, Input, Select, Table, message } from "antd";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Space } from "antd";

function Tax() {
  let agency = JSON.parse(localStorage.getItem("agency")) || null;

  // const navigate = useNavigate();
  const [result, setResult] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

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
  }

  function handleSave(e) {
    e.preventDefault();

    if (isEditMode) {
      axios
        .put(`http://localhost:8081/gsts/${data.id}`, data)
        .then(() => {
          message.success("GST updated successfully");
          loadData();
          setIsEditMode(false);
        })
        .catch(() => message.error("Update failed"));
    } else {
      axios
        .post("http://localhost:8081/gsts", data)
        .then(() => {
          message.success("GST added successfully");
          loadData();
        })
        .catch(() => message.error("Save failed"));
    }
  }

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
  }

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
  }

  function handleDelete(id) {
    axios
      .delete(`http://localhost:8081/gsts/${id}`)
      .then(() => {
        message.success("GST deleted successfully");
        loadData();
      })
      .catch(() => message.error("Delete failed"));
  }

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

    

    axios.get("http://localhost:8081/gsts/").then((res) => {
      setResult(res.data.data);
    });
  }

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
    },
    {
      title: "SGST %",
      dataIndex: "sgstpercent",
    },
    {
      title: "IGST %",
      dataIndex: "igstpercent",
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
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record._id)}
          >
            Delete
          </Button>
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
                  />
                </div>
                <div className="col-lg-6 p-1">
                  GST PLAN CODE*
                  <Input
                    id="gstcode"
                    onChange={handleChange}
                    value={data.gstcode}
                    placeholder="GST Code"
                  />
                </div>
                <div className="col-lg-6 p-1">
                  CGST %*
                  <Input
                    id="cgstpercent"
                    onChange={handleChange}
                    value={data.cgstpercent}
                    placeholder="CGST"
                  />
                </div>
                <div className="col-lg-6 p-1">
                  SGST %*
                  <Input
                    id="sgstpercent"
                    onChange={handleChange}
                    value={data.sgstpercent}
                    placeholder="SGST"
                  />
                </div>
                <div className="col-lg-6 p-1">
                  IGST %*
                  <Input
                    id="igstpercent"
                    onChange={handleChange}
                    value={data.igstpercent}
                    placeholder="IGST"
                  />
                </div>
                <div className="col-lg-12 p-1">
                  <Button onClick={handleSave} type="primary">
                    {isEditMode ? "Update" : "Save"}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    danger
                    className="ms-1"
                    type="default"
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