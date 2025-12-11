import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Col, Row, Dropdown, Menu, message, Spin, Card, Typography, Divider, Table, List } from "antd";
import { DownOutlined, PrinterOutlined, CalendarOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import dayjs from "dayjs";

const InvoicePrint = () => {
  const { agencyid, invoiceid } = useParams();
  const { Title, Paragraph, Text } = Typography;
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDate, setShowDate] = useState(true);
  const [dataSource, setDataSource] = useState([]);

  const columns = [
    { title: ' No', dataIndex: 'no', key: 'no', width: 80, render: (text, record, index) => index + 1 },
    { title: 'Particular', dataIndex: 'particular', key: 'particular', width: 120 },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', width: 120 },
    { title: 'Rate', dataIndex: 'rate', key: 'rate', width: 120 },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', width: 120 },
  ];

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
        callback: function (doc) {
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
    <main id="main" className="main" style={{ backgroundColor: "#f5f5f5", padding: 20 }}>
      <div className="pagetitle">
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
      </div>

      <Card
        id="invoice-content"
        style={{
          padding: 30,
          fontFamily: "Arial",
          maxWidth: 800,
          margin: "0 auto",
          backgroundColor: "white",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)"
        }}
        bordered={false}
      >

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <Title level={2} style={{ margin: 0 }}>INVOICE</Title>
          <Title level={5} style={{ fontWeight: 'bold' }}>DESIGN-PRODUCTION & DIGITAL MARKETING</Title>
          <Paragraph style={{ fontSize: '12px', marginBottom: 0 }}>
            <Text strong>Office:</Text> Tulip Classic, Office No. 202, 12th Lane, Rajarampuri, Kolhapur. Pin 416 008. <br />
            <Text strong>Tel:</Text> 0231-2529585 | <Text strong>Mob:</Text> 8698711555 | <Text strong>Email:</Text> brandcf@gmail.com
          </Paragraph>
        </div>

        <Divider style={{ borderColor: '#000', borderWidth: 2 }} />

        {/* Invoice & Client Details */}
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={12}>
            <Paragraph style={{ fontSize: '14px' }}><Text strong>Invoice No :-</Text>
              <span style={{ marginLeft: 8 }}>{invoice?.invoiceNo || ""}</span></Paragraph>
            <Paragraph style={{ fontSize: '14px' }}><Text strong>Client Name :-</Text>
              <span style={{ marginLeft: 8 }}>{invoice?.clientid?.name || ""}</span></Paragraph>
            <Paragraph style={{ fontSize: '14px' }}><Text strong>Client Address :-</Text>
              <span style={{ marginLeft: 8 }}>{invoice?.clientid?.address || ""}</span></Paragraph>
          </Col>
          <Col span={12} style={{ paddingLeft: '80px', textAlign: 'left' }}>
            <Paragraph style={{ fontSize: '14px' }}><Text strong>Date :-</Text>
              <span style={{ marginLeft: 8 }}>{invoice?.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString('en-GB') : ""}</span></Paragraph>
            <Paragraph style={{ fontSize: '14px' }}><Text strong>Client GST No :-</Text>
              <span style={{ marginLeft: 8 }}>{invoice?.clientid?.gstno || ""}</span></Paragraph>
            <Paragraph style={{ fontSize: '14px' }}><Text strong>Due Date :-</Text>
              <span style={{ marginLeft: 8 }}>{invoice?.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString('en-GB') : ""}</span></Paragraph>
          </Col>
        </Row>

        {/* Items Table */}
        <div style={{ marginTop: 12 }}>
          {dataSource.length > 0 ? (
            <Table
              className="striped-table"
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              bordered
              size="middle"
            />
          ) : (
            <Paragraph type="secondary" style={{ fontStyle: 'italic', margin: 0 }}>
              No schedule records available.
            </Paragraph>
          )}
        </div>

        {/* Totals and Payment Info */}
        <Row gutter={16}>
          <Col span={12}>
            {/* Terms and Conditions */}
            <div style={{ marginTop: 30 }}>
              <Title level={4}>Terms & Conditions:</Title>
              <List
                size="small"
                dataSource={[
                  "Subject to Kolhapur Jurisdiction",
                  "Terms as per PO / MOU",
                  "Interest @ 3% per month after due date",
                  "Errors to be reported within 3 days",
                  "Cheques to be drawn in favour of BRANDCHEF ADVERTISING, Kolhapur"
                ]}
                renderItem={(item) => <List.Item style={{ paddingLeft: 0 }}>{item}</List.Item>}
              /><br />
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
      </Card>

      {/* download + print controls */}
      <Row justify="end" style={{ marginTop: 16 }}>
        <Dropdown overlay={menu} placement="bottomRight">
          <Button icon={<DownOutlined />} style={{ marginRight: 8, backgroundColor: '#7fdbff', color: '#000' }}>
            Download
          </Button>
        </Dropdown>
        <Button icon={<PrinterOutlined />} type="primary" onClick={handlePrint}>
          Print
        </Button>
      </Row>
    </main>
  );
};

export default InvoicePrint;