import React from 'react';
import { Calendar } from 'antd';
import { Link } from "react-router";

function Holiday() {
  const onPanelChange = (value, mode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };
  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>Holiday Planner</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to={"/"}>Master</Link>
            </li>
            <li className="breadcrumb-item active">Holiday</li>
          </ol>
        </nav>
      </div>
     <Calendar onPanelChange={onPanelChange} />
     </main>
  )
}

export default Holiday