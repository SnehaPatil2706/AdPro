import React from 'react';
import { Link } from "react-router";
import { Button, Input } from "antd";

function Employees() {
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
              <li className="breadcrumb-item active">Employee</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row" style={{ minHeight: "80vh" }}>
            <div className="card p-4 shadow" style={{ width: "400px" }}>
              <h3 className="text-center">Employee Details</h3>

              <div className="form d-flex flex-column align-items-center">
                <div className="w-100 p-2">
                  <label>Name*</label>
                  <Input placeholder="Enter Name" />
                </div>

                <div className="w-100 p-2">
                  <label>Address*</label>
                  <Input placeholder="Enter Address" />
                </div>

                <div className="w-100 p-2">
                  <label>Mobile No*</label>
                  <Input placeholder="Enter Mobile No" />
                </div>

                <div className="w-100 p-2">
                  <label>Username*</label>
                  <Input placeholder="Enter Username" />
                </div>

                <div className="w-100 p-2 text-center">
                  <Button type="primary" className="w-100">Save</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default Employees;
