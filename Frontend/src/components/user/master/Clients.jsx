import React, { useState,useEffect } from "react";
import { Link } from "react-router";
import { Button, Input, Select } from "antd";
import { Table } from 'antd';
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Clients() {

  const [id, setId] = useState(undefined);
  const navigate = useNavigate();
  const [clientData, setClientData] = useState([]);

  function handleAdd(e){
    e.preventDefault();
    navigate('/master/addclients');
  }

  const [info, setInfo] = useState({
    agencyid: "",
    name: "",
    contact: "",
    address: "",
    stateid: "",
    gstno: "",
  });

  
  function handleChange(e) {
    setInfo({ ...data, [e.target.id]: e.target.value });
  }

  function handleSave(e) {
    e.preventDefault();
    if (id === undefined) {
      axios.post("http://localhost:8081/clients", data)
        .then((res) => {
          console.log(res.data.data);
          setInfo({
            agencyid: "",
            name: "",
            contact: "",
            address: "",
            stateid: "",
            gstno: "",
          });

          loadData();
          alert("Data Submitted Successfully !!!")
        })
    } else {
      axios.put("http:///localhost:8081/clients/" + id, data)
        .then((res) => {
          console.log(res.data.data);

          setInfo({
            agencyid: "",
            name: "",
            contact: "",
            address: "",
            stateid: "",
            gstno: "",
          });

          loadData();
          setId(undefined)
        })
    }

  }

  function loadData() {
    axios.get("http://localhost:8081/clients")
        .then((res) => {
            console.log(res.data.data);
            setClientData(res.data.data);
        })
}

useEffect(() => {
    loadData();
}, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      filters: [
        {
          text: 'Joe',
          value: 'Joe',
        },
        {
          text: 'Category 1',
          value: 'Category 1',
        },
        {
          text: 'Category 2',
          value: 'Category 2',
        },
      ],
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.name.startsWith(value),
      width: '30%',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      filters: [
        {
          text: 'London',
          value: 'London',
        },
        {
          text: 'New York',
          value: 'New York',
        },
      ],
      onFilter: (value, record) => record.address.startsWith(value),
      filterSearch: true,
      width: '40%',
    },
  ];
  const data = [
    {
      key: '',
      name: '',
      age: '',
      address: '',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
    },
    {
      key: '4',
      name: 'Jim Red',
      age: 32,
      address: 'London No. 2 Lake Park',
    },
  ];
  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  return (
    <>
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
          <div className="d-flex justify-content-end mb-3">
            <Button onClick={handleAdd} type="primary">Add Client</Button>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-12">
                  <div className="card p-3">
                    <Table columns={columns} dataSource={data} onChange={onChange} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Clients;
