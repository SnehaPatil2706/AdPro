import React from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import { Link } from "react-router";
import { Button, Row, Col, DatePicker, Typography, Divider, Card } from "antd";
import axios from "axios";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

const { Text, Title } = Typography;
ChartJS.register(ArcElement, Tooltip, Legend);

// Create center text plugin
const centerTextPlugin = {
  id: 'centerText',
  beforeDraw(chart) {
    const { ctx, chartArea: { width, height } } = chart;
    
    // Save the default state
    ctx.save();
    
    // Calculate center position
    const x = width / 2;
    const y = height / 2;
    
    // Draw centered text
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Ads Distribution', x, y);
    
    // Restore the default state
    ctx.restore();
  }
};

function Dashboard() {
  const [roAmount, setRoAmount] = React.useState(0);
  const [invoiceAmount, setInvoiceAmount] = React.useState(0);
  const [comissionAmount, setComissionAmount] = React.useState(0);
  const [emediaGSTAmount, setEmediaGSTAmount] = React.useState(0);
  const [emediaClientGSTAmount, setEmediaClientGSTAmount] = React.useState(0);
  const [invoiceMediaAmount, setInvoiceMediaAmount] = React.useState(0);
  const [invoiceMediaGSTAmount, setInvoiceMediaGSTAmount] = React.useState(0);

  React.useEffect(() => {
    // Fetch RO Amount, Comission Amount, and E-Media GST
    axios.get("http://localhost:8081/emediaros")
      .then(res => {
        let data = Array.isArray(res.data?.data) ? res.data.data : res.data;
        if (Array.isArray(data)) {
          const total = data.reduce((sum, item) => sum + (Number(item.robillamount) || 0), 0);
          setRoAmount(total);
          const comissionTotal = data.reduce((sum, item) => sum + (Number(item.comissionamount) || 0), 0);
          setComissionAmount(comissionTotal);
          const gstTotal = data.reduce(
            (sum, item) =>
              sum +
              (Number(item.cgstamount) || 0) +
              (Number(item.sgstamount) || 0) +
              (Number(item.igstamount) || 0),
            0
          );
          setEmediaGSTAmount(gstTotal);
        }
      })
      .catch(err => {
        console.error("Failed to fetch emediaros:", err);
      });

    // Fetch Invoice Amount and E-Media Client GST
    axios.get("http://localhost:8081/emediaroinvoices")
      .then(res => {
        let data = Array.isArray(res.data?.data) ? res.data.data : res.data;
        if (Array.isArray(data)) {
          const total = data.reduce((sum, item) => sum + (Number(item.invoiceamount) || 0), 0);
          setInvoiceAmount(total);

          // Calculate E-Media Client GST
          const clientGSTTotal = data.reduce(
            (sum, item) =>
              sum +
              (Number(item.icgstamount) || 0) +
              (Number(item.isgstamount) || 0) +
              (Number(item.iigstamount) || 0),
            0
          );
          setEmediaClientGSTAmount(clientGSTTotal);
        }
      })
      .catch(err => {
        console.error("Failed to fetch emediaroinvoices:", err);
      });

    // Fetch Invoice-Media Invoice Amount from "invoices" collection
    axios.get("http://localhost:8081/invoices")
      .then(res => {
        let data = Array.isArray(res.data?.data) ? res.data.data : res.data;
        if (Array.isArray(data)) {
          const total = data.reduce((sum, item) => sum + (Number(item.billAmount) || 0), 0);
          setInvoiceMediaAmount(total);

          // Calculate GST Amount (cgstAmount + sgstAmount + igstAmount)
          const gstTotal = data.reduce(
            (sum, item) =>
              sum +
              (Number(item.cgstAmount) || 0) +
              (Number(item.sgstAmount) || 0) +
              (Number(item.igstAmount) || 0),
            0
          );
          setInvoiceMediaGSTAmount(gstTotal);
        }
      })
      .catch(err => {
        console.error("Failed to fetch invoices:", err);
      });
  }, []);

  // Pie chart data
  const pieData = {
    labels: ['WWW.ANALOGA-ROAD-BOXKINI.TN', 'Publish Publications Pvt. Ltd.(978)'],
    datasets: [
      {
        data: [7.26, 38.05],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1,
        // Add cutout for doughnut effect
        cutout: '70%'
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw}%`;
          }
        }
      },
      // Add our custom plugin
      centerTextPlugin
    }
  };

  return (
    <>
      <main id="main" className="main" style={{ backgroundColor: "#f5f5f5", padding: 20 }}>
        <div className="pagetitle">
          <h1>Dashboard</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to={"/"}>Home</Link>
              </li>
              <li className="breadcrumb-item active">Dashboard</li>
            </ol>
          </nav>
        </div>

        <section className="section dashboard">
          <div className="row">
            {/* For E-Media */}
            <Card style={{ marginBottom: '20px', backgroundColor: '#ffffff' }}>
            <div className="col-lg-12">
              <Row align="middle" style={{ height: '30px', backgroundColor: 'white' }}>
                <Col flex="none">
                  <Title level={4} style={{ margin: 0, paddingRight: 10,paddingLeft:"0.5rem" }}>E-MEDIA FINANCIAL STATUS</Title>
                </Col>
              </Row><br />
              <div className="row">
                <div className="col-xxl-4 col-md-12">
                  <div className="card info-card revenue-card" style={{ maxWidth: "300px", height: "120px", }}   >
                    <div className="card-body" style={{ paddingTop: "0.0rem", paddingBottom: "0.0rem", paddingLeft: "0.0rem", paddingRight: "0.0rem" }}  >
                      <div style={{ maxWidth: "300px", backgroundColor: "#c38eb4", paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
                        <h5 className="card-title fs-6 mb-1">
                          RO Amount <span className="fs-7">| Total</span>
                        </h5>
                      </div>
                      <div className="d-flex align-items-center" style={{ marginTop: "0.5rem", paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
                        <div
                          className="card-icon rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: "40px",
                            height: "40px",
                            fontSize: "1.5rem",
                            backgroundColor: "#e88ec5",
                            color: "#843b6b",
                            // backgroundColor: "#ffc0cb",  // Pink background
                            // color: "#d63384",            // Darker pink for the icon
                            // boxShadow: "0 2px 4px rgba(214, 51, 132, 0.2)"
                          }}
                        >
                          <i className="bi bi-currency-rupee"></i>
                        </div>
                        <div className="ps-2">
                          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                            {roAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-md-12">
                  <div className="card info-card revenue-card" style={{ maxWidth: "300px", height: "120px" }}>
                    <div></div>
                    <div className="card-body" style={{ paddingTop: "0.0rem", paddingBottom: "0.0rem", paddingLeft: "0.0rem", paddingRight: "0.0rem" }}>
                      <div style={{ maxWidth: "300px",backgroundColor: "#c38eb4", }}>
                        <h5 className="card-title fs-6 mb-1" style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
                          Invoice Amount <span className="fs-7">| Total</span>
                        </h5>
                      </div>

                      <div className="d-flex align-items-center" style={{ marginTop: "0.5rem", paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: "40px",
                            height: "40px",
                            fontSize: "1.5rem",
                            backgroundColor: "#e88ec5",
                            color: "#843b6b",
                          }}>
                          <i className="bi bi-currency-rupee"></i> {/* Changed icon to rupee */}
                        </div>
                        <div className="ps-2">
                          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                            {invoiceAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-md-12">
                  <div className="card info-card revenue-card" style={{
                    maxWidth: "300px",
                    height: "120px"  // Reduced height
                  }}>
                    <div className="card-body" style={{ paddingTop: "0.0rem", paddingBottom: "0.0rem", paddingLeft: "0.0rem", paddingRight: "0.0rem" }}>
                      <div style={{ maxWidth: "300px", backgroundColor: "#c38eb4", }}>
                        <h5 className="card-title fs-6 mb-1" style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
                          Comission Amount <span className="fs-7">| Total</span>
                        </h5>
                      </div>

                      <div className="d-flex align-items-center" style={{ marginTop: "0.5rem", paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: "40px",
                            height: "40px",
                            fontSize: "1.5rem",
                            backgroundColor: "#e88ec5",
                            color: "#843b6b",
                          }}>
                          <i className="bi bi-currency-rupee"></i> {/* Changed icon to rupee */}
                        </div>
                        <div className="ps-2">
                          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                            {comissionAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-md-12">
                  <div className="card info-card revenue-card" style={{
                    maxWidth: "300px",
                    height: "120px"  // Reduced height
                  }}>
                    <div className="card-body" style={{ paddingTop: "0.0rem", paddingBottom: "0.0rem", paddingLeft: "0.0rem", paddingRight: "0.0rem" }}>
                      <div style={{ maxWidth: "300px", backgroundColor: "#c38eb4", }}>
                        <h5 className="card-title fs-6 mb-1" style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
                          E-Media GST <span className="fs-7">| Total</span>
                        </h5>
                      </div>

                      <div className="d-flex align-items-center" style={{ marginTop: "0.5rem", paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: "40px",
                            height: "40px",
                            fontSize: "1.5rem",
                            backgroundColor: "#e88ec5",
                            color: "#843b6b",
                          }}>
                          <i className="bi bi-currency-rupee"></i> {/* Changed icon to rupee */}
                        </div>
                        <div className="ps-2">
                          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                            {emediaGSTAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-md-12">
                  <div className="card info-card revenue-card" style={{
                    maxWidth: "300px",
                    height: "120px"  // Reduced height
                  }}>
                    <div className="card-body" style={{ paddingTop: "0.0rem", paddingBottom: "0.0rem", paddingLeft: "0.0rem", paddingRight: "0.0rem" }}>
                      <div style={{ maxWidth: "300px",backgroundColor: "#c38eb4", }}>
                        <h5 className="card-title fs-6 mb-1" style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
                          E-Media Client GST <span className="fs-7">| Total</span>
                        </h5>
                      </div>

                      <div className="d-flex align-items-center" style={{ marginTop: "0.5rem", paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: "40px",
                            height: "40px",
                            fontSize: "1.5rem",
                            backgroundColor: "#e88ec5",
                            color: "#843b6b",
                          }}>
                          <i className="bi bi-currency-rupee"></i> {/* Changed icon to rupee */}
                        </div>
                        <div className="ps-2">
                          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                            {emediaClientGSTAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </Card>
            {/* For E-Media */}

            {/* For P-Media */}
            <Card style={{ marginBottom: '20px', backgroundColor: '#ffffff' }}>
            <div className="col-lg-12">
              <Row align="middle" style={{ height: '30px', backgroundColor: 'white' }}>
                <Col flex="none">
                  <Title level={4} style={{ margin: 0, paddingRight: 10 }}>P-MEDIA FINANCIAL STATUS</Title>
                </Col>
              </Row><br />
              <div className="row">
                <div className="col-xxl-4 col-md-12">
                  <div className="card info-card revenue-card" style={{
                    maxWidth: "300px",
                    height: "120px",
                  }}>
                    <div className="card-body" style={{ paddingTop: "0.0rem", paddingBottom: "0.0rem", paddingLeft: "0.0rem", paddingRight: "0.0rem" }}>
                      <div style={{ maxWidth: "300px", backgroundColor: "#a0e9e5  " }}>
                        <h5 className="card-title fs-6 mb-1" style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
                          RO Amount <span className="fs-7">| Total</span>
                        </h5>
                      </div>

                      <div className="d-flex align-items-center" style={{ marginTop: "0.5rem", paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: "40px",
                            height: "40px",
                            fontSize: "1.5rem",
                          }}>
                          <i className="bi bi-currency-rupee"></i> {/* Changed icon to rupee */}
                        </div>
                        <div className="ps-2">
                          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>20,403,809.30</Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-md-12">
                  <div className="card info-card revenue-card" style={{
                    maxWidth: "300px",
                    height: "120px",
                  }}>
                    <div className="card-body" style={{ paddingTop: "0.0rem", paddingBottom: "0.0rem", paddingLeft: "0.0rem", paddingRight: "0.0rem" }}>
                      <div style={{ maxWidth: "300px", backgroundColor: "#a0e9e5  " }}>
                        <h5 className="card-title fs-6 mb-1" style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
                          Invoice Amount <span className="fs-7">| Total</span>
                        </h5>
                      </div>

                      <div className="d-flex align-items-center" style={{ marginTop: "0.5rem", paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: "40px",
                            height: "40px",
                            fontSize: "1.5rem"
                          }}>
                          <i className="bi bi-currency-rupee"></i> {/* Changed icon to rupee */}
                        </div>
                        <div className="ps-2">
                          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>20,403,809.30</Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-md-12">
                  <div className="card info-card revenue-card" style={{
                    maxWidth: "300px",
                    height: "120px",
                  }}>
                    <div className="card-body" style={{ paddingTop: "0.0rem", paddingBottom: "0.0rem", paddingLeft: "0.0rem", paddingRight: "0.0rem" }}>
                      <div style={{ maxWidth: "300px", backgroundColor: "#a0e9e5  " }}>
                        <h5 className="card-title fs-6 mb-1" style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
                          Comission Amount <span className="fs-7">| Total</span>
                        </h5>
                      </div>

                      <div className="d-flex align-items-center" style={{ marginTop: "0.5rem", paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: "40px",
                            height: "40px",
                            fontSize: "1.5rem",
                          }}>
                          <i className="bi bi-currency-rupee"></i> {/* Changed icon to rupee */}
                        </div>
                        <div className="ps-2">
                          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>20,403,809.30</Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-md-12">
                  <div className="card info-card revenue-card" style={{
                    maxWidth: "300px",
                    height: "120px",
                  }}>
                    <div className="card-body" style={{ paddingTop: "0.0rem", paddingBottom: "0.0rem", paddingLeft: "0.0rem", paddingRight: "0.0rem" }}>
                      <div style={{ maxWidth: "300px", backgroundColor: "#a0e9e5  " }}>
                        <h5 className="card-title fs-6 mb-1" style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
                          P-Media GST <span className="fs-7">| Total</span>
                        </h5>
                      </div>

                      <div className="d-flex align-items-center" style={{ marginTop: "0.5rem", paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: "40px",
                            height: "40px",
                            fontSize: "1.5rem",
                          }}>
                          <i className="bi bi-currency-rupee"></i> {/* Changed icon to rupee */}
                        </div>
                        <div className="ps-2">
                          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>20,403,809.30</Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-md-12">
                  <div className="card info-card revenue-card" style={{
                    maxWidth: "300px",
                    height: "120px",
                  }}>
                    <div className="card-body" style={{ paddingTop: "0.0rem", paddingBottom: "0.0rem", paddingLeft: "0.0rem", paddingRight: "0.0rem" }}>
                      <div style={{ maxWidth: "300px", backgroundColor: "#a0e9e5  " }}>
                        <h5 className="card-title fs-6 mb-1" style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
                          P-Media Client GST <span className="fs-7">| Total</span>
                        </h5>
                      </div>

                      <div className="d-flex align-items-center" style={{ marginTop: "0.5rem", paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: "40px",
                            height: "40px",
                            fontSize: "1.5rem",
                            border: "1px solid #00ff00"
                          }}>
                          <i className="bi bi-currency-rupee"></i> {/* Changed icon to rupee */}
                        </div>
                        <div className="ps-2">
                          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>20,403,809.30</Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </Card>
            {/* For E-Media */}

            {/* For Invoice */}
            <Card style={{ marginBottom: '20px', backgroundColor: '#ffffff' }}>
            <div className="col-lg-12">
              <Row align="middle" style={{ height: '30px', backgroundColor: 'white' }}>
                <Col flex="none">
                  <Title level={4} style={{ margin: 0, paddingRight: 10 }}>INVOICE-MEDIA FINANCIAL STATUS</Title>
                </Col>
              </Row><br />
              <div className="row">
                <div className="col-xxl-4 col-md-12">
                  <div className="card info-card revenue-card" style={{
                    maxWidth: "300px",
                    height: "120px",
                  }}>
                    <div className="card-body" style={{ paddingTop: "0.0rem", paddingBottom: "0.0rem", paddingLeft: "0.0rem", paddingRight: "0.0rem" }}>
                      <div style={{
                        maxWidth: "300px",
                        //  backgroundColor: "#ffc0cb  ",
                        backgroundColor: "#bfa5c9",
                      }}>
                        <h5 className="card-title fs-6 mb-1" style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
                          Invoice Amount <span className="fs-7">| Total</span>
                        </h5>
                      </div>

                      <div className="d-flex align-items-center" style={{ marginTop: "0.5rem", paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: "40px",
                            height: "40px",
                            fontSize: "1.5rem",
                            backgroundColor: "#e88ec5",
                            color: "#843b6b",
                          }}>
                          <i className="bi bi-currency-rupee"></i> {/* Changed icon to rupee */}
                        </div>
                        <div className="ps-2">
                          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                            {invoiceMediaAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-md-12">
                  <div className="card info-card revenue-card" style={{
                    maxWidth: "300px",
                    height: "120px",
                  }}>
                    <div className="card-body" style={{ paddingTop: "0.0rem", paddingBottom: "0.0rem", paddingLeft: "0.0rem", paddingRight: "0.0rem" }}>
                      <div style={{ maxWidth: "300px", backgroundColor: "#bfa5c9" }}>
                        <h5 className="card-title fs-6 mb-1" style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
                          Invoice GST Amount <span className="fs-7">| Total</span>
                        </h5>
                      </div>

                      <div className="d-flex align-items-center" style={{ marginTop: "0.5rem", paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: "40px",
                            height: "40px",
                            fontSize: "1.5rem",
                            backgroundColor: "#e88ec5",
                            color: "#843b6b",
                          }}>
                          <i className="bi bi-currency-rupee"></i> {/* Changed icon to rupee */}
                        </div>
                        <div className="ps-2">
                          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                            {invoiceMediaGSTAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </Card>
            {/* For Invoice */}
          </div>
        </section>

         {/* Pie Chart Section */}
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <Row align="middle" style={{ height: '30px', backgroundColor: 'white' }}>
                <Col flex="none">
                  <Title level={4} style={{ margin: 0, paddingRight: 10 }}>ADVERTISEMENT DISTRIBUTION</Title>
                </Col>
              </Row>
              <div className="card" style={{ marginTop: '20px' }}>
                <div className="card-body">
                  <div style={{ 
                    width: '100%', 
                    maxWidth: '500px', 
                    margin: '0 auto',
                    position: 'relative'  // Needed for absolute positioning
                  }}>
                    <Pie 
                      data={pieData} 
                      options={pieOptions}
                      plugins={[centerTextPlugin]}  // Register our plugin
                    />
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

export default Dashboard;
