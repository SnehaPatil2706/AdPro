import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { Button, Input, Select } from "antd";
import axios from "axios";
import { useLocation, useNavigate, useParams } from 'react-router-dom';


function AddClients() {
    let { id } = useParams();
    let navigate = useNavigate();
    const [state, setState] = useState([]);

    const [data, setData] = useState({
        agencyid: "",
        name: "",
        contact: "",
        address: "",
        stateid: "",
        gstno: ""
    });

    useEffect(() => {
        fetchStates();
    }, []);

    const fetchStates = async () => {
        try {
            const response = await axios.get("http://localhost:8081/states");
            setState(response.data.status === "success" ? response.data.data : []);
        } catch (error) {
            console.error("Error fetching states:", error);
            setState([]);
        }
    };

    function handleChange(e) {
        setData({ ...data, [e.target.id]: e.target.value });
    };

    function handleSave(e) {
        e.preventDefault();
        if (id == undefined) {
            axios.post("http://localhost:8081/clients", data)
                .then((res) => {
                    console.log(res.data.data);
                    setData({
                        agencyid: "",
                        name: "",
                        contact: "",
                        address: "",
                        stateid: "",
                        gstno: ""
                    });
                    alert("Data Added Successfully");
                    navigate('/clients');
                })
        } else {
            axios.put(`http://localhost:8081/clients/${id}`, data)
                .then((res) => {
                    console.log(res.data.data);
                    setData({
                        agencyid: "",
                        name: "",
                        contact: "",
                        address: "",
                        stateid: "",
                        gstno: ""
                    });

                    navigate('/clients');
                })
        }
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
                            <li className="breadcrumb-item active">Client Master</li>
                        </ol>
                    </nav>
                </div>

                <div className="row">
                    <div className="col-lg-12">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card p-3">
                                    <div className="row">
                                        <div className="col-lg-6 p-1">
                                            Name*
                                            <Input onChange={handleChange} value={data.name} placeholder="Name" />
                                        </div>
                                        <div className="col-lg-6 p-1">
                                            Contact*
                                            <Input onChange={handleChange} value={data.contact} placeholder="Contact" />
                                        </div>
                                        <div className="col-lg-6 p-1">
                                            Address*
                                            <Input onChange={handleChange} value={data.address} placeholder="Address" />
                                        </div>
                                        <div className="col-lg-6 p-1">
                                            State*<br />
                                            <select
                                                name="state"
                                                className="form-control"
                                                value={data.state}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select State</option>
                                                {state.map((s) => (
                                                    <option key={s.id} value={s.name}>
                                                        {s.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-lg-6 p-1">
                                            GST No
                                            <Input onChange={handleChange} value={data.gstno} placeholder="GST No" />
                                        </div>
                                        <div className="col-lg-6 p-1">
                                            Agency*<br />
                                            <Select
                                                onChange={handleChange} value={data.agencyid}
                                                className="w-100"
                                                showSearch
                                                placeholder="Select Agency"

                                                optionFilterProp="label"
                                                options={[
                                                    {
                                                        value: "jack",
                                                        label: "Jack",
                                                    }
                                                ]}
                                            />
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
            </main>
        </>
    )
}

export default AddClients