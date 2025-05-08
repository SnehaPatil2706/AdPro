import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button, Input, Select, Table, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Space, Popconfirm } from "antd";


function Employees() {
  let agency = JSON.parse(localStorage.getItem("agency")) || null;
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();
  const [result, setResult] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  const [data, setData] = useState({
    id: "",
    agencyid: agency._id,
    name: "",
    roleid: "",
    email: "",
    password: "",

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
        .put(`http://localhost:8081/users/${data.id}`, data)
        .then(() => {
          message.success("Employee updated successfully");
          loadData();
          setIsEditMode(false);
        })
        .catch(() => message.error("Update failed"));
    } else {
      axios
        .post("http://localhost:8081/users", data)
        .then(() => {
          message.success("Employee added successfully");
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
      stateid: "",
      email: "",
      password: "",
    });
    setIsEditMode(false);
  }

  function handleEdit(record) {
    setData({
      id: record._id,
      agencyid: record.agencyid,
      name: record.name,
      roleid: record.roleid,
      email: record.email,
      password: record.password,
    });
    setIsEditMode(true);
  }

  function handleDelete(id) {
    axios
      .delete(`http://localhost:8081/users/${id}`)
      .then(() => {
        message.success("Employee deleted successfully");
        loadData();
      })
      .catch(() => message.error("Delete failed"));
  }

  function loadData() {
    setData({
      id: "",
      agencyid: agency._id,
      name: "",
      roleid: "",
      email: "",
      password: "",
    });
    setIsEditMode(false);

    axios.get("http://localhost:8081/roles").then((res) => {
      setRoles(
        res.data.data.map((role) => ({
          label: role.name,
          value: role._id,
        }))
      );
    });

    axios.get(`http://localhost:8081/users/agency/${agency._id}`).then((res) => {
      setResult(res.data.data);
    });


  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Roles",
      dataIndex: "roleid",
      render: (roleid) => roleid?.name || "N/A",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Password",
      dataIndex: "password",
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
            title="Are you sure you want to delete this employee?"
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
    <>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Employee</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to={"/"}>Master</Link>
              </li>
              <li className="breadcrumb-item active">Employees</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card p-3">
                <div className="row">
                  <div className="col-lg-6 p-1">
                    Employee Name*
                    <Input
                      id="name"
                      onChange={handleChange}
                      value={data.name}
                      placeholder="Name"
                    />
                  </div>
                  <div className="col-lg-6 p-1">
                    Roles*<br />
                    <Select
                      className="w-100"
                      showSearch
                      options={roles}
                      placeholder="Select a role"
                      value={data.roleid}
                      filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                      }
                      onChange={(value) => setData({ ...data, roleid: value })}
                    />
                  </div>
                  <div className="col-lg-6 p-1">
                    Email*
                    <Input
                      id="email"
                      onChange={handleChange}
                      value={data.email}
                      placeholder="Email"
                    />
                  </div>
                  <div className="col-lg-6 p-1">
                    Password*
                    <Input
                      id="password"
                      onChange={handleChange}
                      value={data.password}
                      placeholder="Password"
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
    </>
  )
}

export default Employees;
