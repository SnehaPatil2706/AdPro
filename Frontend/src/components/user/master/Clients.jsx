import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button, Input, Select, Table, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Space, Popconfirm } from "antd";


function Clients() {
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
  };

  function handleSave(e) {
    e.preventDefault();

    if (isEditMode) {
      axios
        .put(`http://localhost:8081/clients/${data.id}`, data)
        .then(() => {
          message.success("Client updated successfully");
          loadData();
          setIsEditMode(false);
        })
        .catch((err) => {
          console.error("Error updating client:", err);
          message.error("Update failed");
        });
    } else {
      axios
        .post("http://localhost:8081/clients", data)
        .then(() => {
          message.success("Client added successfully");
          loadData();
        })
        .catch((err) => {
          console.error("Error adding client:", err);
          message.error("Save failed");
        });
    }
  };

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
  };

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
  };

  function handleDelete(id) {
    axios
      .delete(`http://localhost:8081/clients/${id}`)
      .then(() => {
        message.success("Client deleted successfully");
        loadData();
      })
      .catch((err) => {
        console.error("Error deleting client:", err);
        message.error("Delete failed");
      });
  };

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

    // Log the agency ID for debugging
    console.log("Agency ID being used for fetching clients:", agency._id);

    // Fetch states
    axios
      .get("http://localhost:8081/states")
      .then((res) => {
        console.log("States API Response:", res.data.data); // Debugging
        if (res.data && Array.isArray(res.data.data)) {
          setStates(
            res.data.data.map((state) => ({
              label: state.name,
              value: state._id,
            }))
          );
        } else {
          console.error("Invalid states response:", res.data);
          setStates([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching states:", err);
        setStates([]);
      });

    // Fetch clients
    axios
      .get(`http://localhost:8081/clients/`+ agency._id)
      .then((res) => {
        console.log("Clients API Response:", res.data.data); // Debugging
        if (res.data && Array.isArray(res.data.data)) {
          setResult(res.data.data);
        } else {
          console.error("Invalid clients response:", res.data);
          setResult([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching clients:", err);
        setResult([]);
      });
  };

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
      title: "State",
      dataIndex: ["stateid", "name"], // Access the populated state name
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
            title="Are you sure you want to delete this client?"
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
        <h1>Clients</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to={"/"}>Master</Link>
            </li>
            <li className="breadcrumb-item active">Clients</li>
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
  );
}

export default Clients;
