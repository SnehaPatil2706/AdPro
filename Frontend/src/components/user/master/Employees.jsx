import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button, Input, Select, Table, message, Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Employees() {
  let agency = JSON.parse(localStorage.getItem("agency")) || null;
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();
  const [result, setResult] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState({});

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
  };

  function validateForm() {
    const newErrors = {};

    if (!data.name.trim()) {
      newErrors.name = "name is required";
    } else if (!/^[A-Za-z\s]+$/.test(data.name.trim())) {
      newErrors.name = "name can only contain letters";
    }

    if (!data.roleid) newErrors.roleid = "role is required";
    if (!data.email.trim()) {
      newErrors.email = "email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "invalid email format";
    }
    if (!data.password.trim()) newErrors.password = "password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function handleSave(e) {
    e.preventDefault();
    if (!validateForm()) return;

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
  };

  function handleCancel() {
    setData({
      id: "",
      agencyid: agency._id,
      name: "",
      roleid: "",
      email: "",
      password: "",
    });
    setIsEditMode(false);
    setErrors({});
  };

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
    setErrors({});
  };

  function handleDelete(id) {
    axios
      .delete(`http://localhost:8081/users/${id}`)
      .then(() => {
        message.success("Employee deleted successfully");
        loadData();
      })
      .catch(() => message.error("Delete failed"));
  };

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
    setErrors({});

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
  };

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
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} size="small">
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
                      status={errors.name ? "error" : ""}
                    />
                    {errors.name && <div style={{ color: "red" }}>{errors.name}</div>}
                  </div>
                  <div className="col-lg-6 p-1">
                    Roles*<br />
                    <Select
                      className="w-100"
                      showSearch
                      options={roles}
                      placeholder="Select a role"
                      value={data.roleid}
                      status={errors.roleid ? "error" : ""}
                      filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                      }
                      onChange={(value) => setData({ ...data, roleid: value })}
                    />
                    {errors.roleid && <div style={{ color: "red" }}>{errors.roleid}</div>}
                  </div>
                  <div className="col-lg-6 p-1">
                    Email*
                    <Input
                      id="email"
                      onChange={handleChange}
                      value={data.email}
                      placeholder="Email"
                      status={errors.email ? "error" : ""}
                    />
                    {errors.email && <div style={{ color: "red" }}>{errors.email}</div>}
                  </div>
                  <div className="col-lg-6 p-1">
                    Password*
                    <Input
                      id="password"
                      onChange={handleChange}
                      value={data.password}
                      placeholder="Password"
                      status={errors.password ? "error" : ""}
                    />
                    {errors.password && <div style={{ color: "red" }}>{errors.password}</div>}
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
  );
}

export default Employees;
