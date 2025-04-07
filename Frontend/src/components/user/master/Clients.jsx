import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button, Input, Select } from "antd";
import { Table } from 'antd';
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Clients() {

  let agency = JSON.parse(localStorage.getItem('agency')) || null;

  const [states, setStates] = useState([]);
  const navigate = useNavigate();
  const [result, setResult] = useState([]);
  const [data, setData] = useState({
    id:"",
    agencyid: agency._id,
    name: "",
    contact: "",
    address: "",
    stateid: "",
    gstno: "",
  });


  function handleChange(e) {
    setData({ ...data, [e.target.id]: e.target.value });
  }

  function handleSave(e) {
    e.preventDefault();
    console.log(data);
    
    if (data.id === "") {
      axios.post("http://localhost:8081/clients", data)
        .then((res) => {
          loadData();
        })
    } else {
      axios.put("http:///localhost:8081/clients/" + data.id, data)
        .then((res) => {
          loadData();
        })
    }
  }

  function loadData() {
    setData({
      id:"",
      agencyid: agency._id,
      name: "",
      contact: "",
      address: "",
      stateid: "",
      gstno: "",
    });
    axios.get("http://localhost:8081/states")
      .then((res) => {
        setStates(res.data.data.map((state) => ({
          label: state.name,
          value: state._id,
        })));
      });
    axios.get("http://localhost:8081/clients/" + agency._id)
      .then((res) => {
        setResult(res.data.data);
      });
  }


  useEffect(() => {
    loadData();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name'
    },
    {
      title: 'Address',
      dataIndex: 'address'
    },
    {
      title: 'GST',
      dataIndex: 'gstno',
    },
    {
      title: 'Contact',
      dataIndex: 'contact'
    },
  ];


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
          <div className="row">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-12">
                  <div className="card p-3">
                    <div className="row">
                      <div className="col-lg-6 p-1">
                        Name*
                        <Input id="name" onChange={handleChange} value={data.name} placeholder="Name" />
                      </div>
                      <div className="col-lg-6 p-1">
                        Contact*
                        <Input id="contact" onChange={handleChange} value={data.contact} placeholder="Contact" />
                      </div>
                      <div className="col-lg-6 p-1">
                        Address*
                        <Input id="address" onChange={handleChange} value={data.address} placeholder="Address" />
                      </div>
                      <div className="col-lg-6 p-1">
                          State*<br />
                          <Select
                            className="w-100"
                            showSearch
                            options={states} // directly pass the array
                            placeholder="Select a state"
                            filterOption={(input, option) =>
                              option.label.toLowerCase().includes(input.toLowerCase())
                            }
                            onChange={(value) => setData({ ...data, stateid: value })}
                          />
                      </div>
                      <div className="col-lg-6 p-1">
                        GST No
                        <Input id="gstno" onChange={handleChange} value={data.gstno} placeholder="GST No" />
                      </div>
                      <div className="col-lg-12 p-1">
                        <Button onClick={handleSave} type="primary">Save</Button>
                        <Button variant="solid" className="ms-1" color="danger">Cancel</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-12">
                  <div className="card p-3">
                    <Table columns={columns} dataSource={result} />
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
