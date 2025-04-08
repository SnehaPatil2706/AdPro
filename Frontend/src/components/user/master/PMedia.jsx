import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button, Input, Select, Table, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Space } from "antd";

function PMedia() {
  let agency = JSON.parse(localStorage.getItem("agency")) || null;
  
    const [states, setStates] = useState([]);
    const navigate = useNavigate();
    const [result, setResult] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
  
    const [data, setData] = useState({
      id: "",
      agencyid: agency._id,
      name: "",
      contact: "",
      address: "",
      stateid: "",
      gstno: "",
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
          .put(`http://localhost:8081/pmedia/${data.id}`, data)
          .then(() => {
            message.success("P-Media updated successfully");
            loadData();
            setIsEditMode(false);
          })
          .catch(() => message.error("Update failed"));
      } else {
        axios
          .post("http://localhost:8081/pmedia", data)
          .then(() => {
            message.success("P-Media added successfully");
            loadData();
          })
          .catch(() => message.error("Save failed"));
      }
    }
  
    function handleCancel() {
      setData({
        id: "",
        agencyid: agency._id,
        name: "",
        contact: "",
        address: "",
        stateid: "",
        gstno: "",
      });
      setIsEditMode(false);
    }
  
    function handleEdit(record) {
      setData({
        id: record._id,
        agencyid: record.agencyid,
        name: record.name,
        contact: record.contact,
        address: record.address,
        stateid: record.stateid,
        gstno: record.gstno,
      });
      setIsEditMode(true);
    }
  
    function handleDelete(id) {
      axios
        .delete(`http://localhost:8081/pmedia/${id}`)
        .then(() => {
          message.success("P-Media deleted successfully");
          loadData();
        })
        .catch(() => message.error("Delete failed"));
    }
  
    function loadData() {
      setData({
        id: "",
        agencyid: agency._id,
        name: "",
        contact: "",
        address: "",
        stateid: "",
        gstno: "",
      });
      setIsEditMode(false);
  
      axios.get("http://localhost:8081/states").then((res) => {
        setStates(
          res.data.data.map((state) => ({
            label: state.name,
            value: state._id,
          }))
        );
      });
  
      axios.get("http://localhost:8081/pmedia/" ).then((res) => {
        setResult(res.data.data);
      });
    }
  
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "Address",
        dataIndex: "address",
      },
      {
        title: "GST",
        dataIndex: "gstno",
      },
      {
        title: "Contact",
        dataIndex: "contact",
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
        <h1>P-Media</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to={"/"}>Master</Link>
            </li>
            <li className="breadcrumb-item active">P-Media</li>
          </ol>
        </nav>
      </div>

      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            <div className="card p-3">
              <div className="row">
                <div className="col-lg-6 p-1">
                  Name*
                  <Input
                    id="name"
                    onChange={handleChange}
                    value={data.name}
                    placeholder="Name"
                  />
                </div>
                <div className="col-lg-6 p-1">
                  Contact*
                  <Input
                    id="contact"
                    onChange={handleChange}
                    value={data.contact}
                    placeholder="Contact"
                  />
                </div>
                <div className="col-lg-6 p-1">
                  Address*
                  <Input
                    id="address"
                    onChange={handleChange}
                    value={data.address}
                    placeholder="Address"
                  />
                </div>
                <div className="col-lg-6 p-1">
                  State*<br />
                  <Select
                    className="w-100"
                    showSearch
                    options={states}
                    placeholder="Select a state"
                    value={data.stateid}
                    filterOption={(input, option) =>
                      option.label.toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={(value) => setData({ ...data, stateid: value })}
                  />
                </div>
                <div className="col-lg-6 p-1">
                  GST No
                  <Input
                    id="gstno"
                    onChange={handleChange}
                    value={data.gstno}
                    placeholder="GST No"
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

export default PMedia