import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Col, Row, Dropdown, Menu, message, Spin, Card } from "antd";
import { DownOutlined, PrinterOutlined, CalendarOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import dayjs from "dayjs";

const InvoicePrint = () => {
  const { agencyid, invoiceid } = useParams();

  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDate, setShowDate] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        console.log(`Fetching invoice ${invoiceid} for agency ${agencyid}`);
        
        const res = await axios.get(`http://localhost:8081/invoices/${agencyid}/${invoiceid}`);
        console.log("API Response:", res.data);

        if (res.data.status === "success") {
          setInvoice(res.data.data);
        } else {
          throw new Error(res.data.message || "Failed to load invoice");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        message.error("Failed to load invoice: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [agencyid, invoiceid]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = (format) => {
    if (!invoice) return;

    const content = document.getElementById("invoice-content");
    const fileName = `Invoice_${invoice.invoiceNo}`;

    if (format === "pdf") {
      const doc = new jsPDF();
      doc.html(content, {
        callback: function(doc) {
          doc.save(`${fileName}.pdf`);
        },
        margin: [10, 10, 10, 10],
        autoPaging: 'text',
        width: 190,
        windowWidth: 650
      });
    } else if (format === "word") {
      const htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
          <head><title>${fileName}</title></head>
          <body>${content.innerHTML}</body>
        </html>
      `;
      const blob = new Blob(['\ufeff', htmlContent], {
        type: 'application/msword'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="word" onClick={() => handleDownload("word")}>
        Download as Word
      </Menu.Item>
      <Menu.Item key="pdf" onClick={() => handleDownload("pdf")}>
        Download as PDF
      </Menu.Item>
    </Menu>
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Loading invoice..." />
      </div>
    );
  }

  if (error) {
    return (
      <Card style={{ margin: 20 }}>
        <div style={{ textAlign: 'center', padding: 20 }}>
          <h2>Error Loading Invoice</h2>
          <p>{error}</p>
          <Button 
            type="primary" 
            onClick={() => navigate(`/invoice/invoiceList`)}
            style={{ marginTop: 20 }}
          >
            Back to Invoice List
          </Button>
        </div>
      </Card>
    );
  }

  if (!invoice) {
    return (
      <Card style={{ margin: 20 }}>
        <div style={{ textAlign: 'center', padding: 20 }}>
          <h2>Invoice Not Found</h2>
          <p>The requested invoice could not be loaded.</p>
          <Button 
            type="primary" 
            onClick={() => navigate(`/invoice/invoiceList`)}
            style={{ marginTop: 20 }}
          >
            Back to Invoice List
          </Button>
        </div>
      </Card>
    );
  }

  // Calculate totals
  const totalPaid = invoice.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
  const balanceDue = invoice.billAmount - totalPaid;

  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <Row gutter={16}>
          <Col span={12}>
            <h1>Invoice #{invoice.invoiceNo}</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/invoice/invoiceList">Invoices</Link>
                </li>
                <li className="breadcrumb-item active">Invoice Print</li>
              </ol>
            </nav>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Dropdown overlay={menu} placement="bottomRight">
              <Button style={{ marginRight: 8 }}>
                Download <DownOutlined />
              </Button>
            </Dropdown>
            <Button 
              type="primary" 
              icon={<PrinterOutlined />} 
              onClick={handlePrint}
              style={{ marginRight: 8 }}
            >
              Print
            </Button>
            <Button 
              icon={<CalendarOutlined />} 
              onClick={() => setShowDate(!showDate)}
            >
              {showDate ? 'Hide Date' : 'Show Date'}
            </Button>
          </Col>
        </Row>
      </div>

      <div id="invoice-content" style={{ 
        padding: 30, 
        fontFamily: "Arial", 
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "white",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)"
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0 }}>INVOICE</h2>
          <h4>DESIGN-PRODUCTION & DIGITAL MARKETING</h4>
          <p>
            <strong>Office:</strong> Tulip Classic, Office No. 202, 12th Lane, Rajarampuri, Kolhapur. Pin 416 008. <br />
            <strong>Tel:</strong> 0231-2529585 | <strong>Mob:</strong> 8698711555 | <strong>Email:</strong> brandcf@gmail.com
          </p>
        </div>
        <hr style={{ borderTop: "1px solid #ddd" }} />

        {/* Invoice & Client Details */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <p><strong>Invoice No:</strong> {invoice.invoiceNo}</p>
            <p><strong>Client Name:</strong> {invoice.clientid?.name || "N/A"}</p>
            <p><strong>Client Address:</strong> {invoice.clientid?.address || "N/A"}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p>
              <strong>Date:</strong> {showDate ? dayjs(invoice.invoiceDate).format("DD/MM/YYYY") : ""}
            </p>
            <p>
              <strong>Client GST No:</strong> {invoice.clientid?.gstno || "N/A"}
            </p>
            <p>
              <strong>Due Date:</strong> {dayjs(invoice.invoiceDate).add(30, 'day').format("DD/MM/YYYY")}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <table border="1" style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th style={{ padding: 8 }}>No</th>
              <th style={{ padding: 8 }}>Particular</th>
              <th style={{ padding: 8 }}>Quantity</th>
              <th style={{ padding: 8 }}>Rate</th>
              <th style={{ padding: 8 }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.details?.map((item, index) => (
              <tr key={index}>
                <td style={{ padding: 8, textAlign: "center" }}>{index + 1}</td>
                <td style={{ padding: 8 }}>{item.particular}</td>
                <td style={{ padding: 8, textAlign: "center" }}>{item.quantity}</td>
                <td style={{ padding: 8, textAlign: "right" }}>{item.rate?.toFixed(2)}</td>
                <td style={{ padding: 8, textAlign: "right" }}>{item.amount?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals and Payment Info */}
        <Row gutter={16}>
          <Col span={12}>
            <div style={{ marginTop: 10 }}>
              <h4>Payment Information:</h4>
              <p><strong>Bank Name:</strong> Example Bank</p>
              <p><strong>Account Number:</strong> 1234567890</p>
              <p><strong>IFSC Code:</strong> EXMP0123456</p>
              <p><strong>UPI ID:</strong> brandcf@examplebank</p>
              
              <div style={{ textAlign: "center", marginTop: 20 }}>
                <img 
                  src={invoice.qrCode || "/default-qr.png"} 
                  alt="QR Code" 
                  style={{ width: 120, height: 120, border: "1px solid #ddd" }} 
                />
                <p><strong>SCAN TO PAY</strong></p>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ float: "right" }}>
              <table style={{ borderCollapse: 'collapse', border: 'none' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: 4, textAlign: 'right' }}><strong>Subtotal:</strong></td>
                    <td style={{ padding: 4, textAlign: 'right' }}>{invoice.amount?.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: 4, textAlign: 'right' }}><strong>Discount:</strong></td>
                    <td style={{ padding: 4, textAlign: 'right' }}>{invoice.discount?.toFixed(2)}</td>
                  </tr>
                  {invoice.cgstAmount > 0 && (
                    <tr>
                      <td style={{ padding: 4, textAlign: 'right' }}><strong>CGST ({invoice.cgstPercent}%):</strong></td>
                      <td style={{ padding: 4, textAlign: 'right' }}>{invoice.cgstAmount?.toFixed(2)}</td>
                    </tr>
                  )}
                  {invoice.sgstAmount > 0 && (
                    <tr>
                      <td style={{ padding: 4, textAlign: 'right' }}><strong>SGST ({invoice.sgstPercent}%):</strong></td>
                      <td style={{ padding: 4, textAlign: 'right' }}>{invoice.sgstAmount?.toFixed(2)}</td>
                    </tr>
                  )}
                  {invoice.igstAmount > 0 && (
                    <tr>
                      <td style={{ padding: 4, textAlign: 'right' }}><strong>IGST ({invoice.igstPercent}%):</strong></td>
                      <td style={{ padding: 4, textAlign: 'right' }}>{invoice.igstAmount?.toFixed(2)}</td>
                    </tr>
                  )}
                  <tr>
                    <td style={{ padding: 4, textAlign: 'right' }}><strong>Total Amount:</strong></td>
                    <td style={{ padding: 4, textAlign: 'right' }}>{invoice.billAmount?.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: 4, textAlign: 'right' }}><strong>Amount Paid:</strong></td>
                    <td style={{ padding: 4, textAlign: 'right' }}>{totalPaid.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: 4, textAlign: 'right' }}><strong>Balance Due:</strong></td>
                    <td style={{ padding: 4, textAlign: 'right' }}>{balanceDue.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Col>
        </Row>

        {/* Terms and Conditions */}
        <div style={{ marginTop: 30 }}>
          <h4>Terms & Conditions:</h4>
          <ul style={{ paddingLeft: 20 }}>
            <li>Subject to Kolhapur Jurisdiction</li>
            <li>Terms as per PO / MOU</li>
            <li>Interest @ 3% per month after due date</li>
            <li>Errors to be reported within 3 days</li>
            <li>Cheques to be drawn in favour of BRANDCHEF ADVERTISING, Kolhapur</li>
          </ul>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40 }}>
          <div style={{ width: "50%" }}>
            <p><strong>Customer Signature</strong></p>
            <p>_________________________</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <img 
              src="/stamp.png" 
              alt="Company Seal" 
              style={{ width: 100, height: 100, opacity: 0.8 }} 
            />
            <p><strong>Authorized Signatory</strong></p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default InvoicePrint;