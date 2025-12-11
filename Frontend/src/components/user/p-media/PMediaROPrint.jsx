import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Typography, Divider, Row, Col, Table, Card, Image, List, Descriptions, Menu, Button, Dropdown } from 'antd';
import axios from "axios";
import { DownOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";

function PMediaROPrint() {
  const { agencyid } = useParams();
  const { Title, Paragraph, Text } = Typography;
  const [dataSource, setDataSource] = useState([]);
  const { id } = useParams(); // Get the RO id from the route
  const [roData, setRoData] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [pMediaRO, setPMediaRO] = useState(null);
  const [showDate, setShowDate] = useState(true);

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      width: 50,
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) =>
        date ? new Date(date).toLocaleDateString('en-GB') : '',
    },
    {
      title: 'Caption',
      dataIndex: 'caption',
      key: 'caption',
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Hue',
      dataIndex: 'hue',
      key: 'hue',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: (size) =>
        size ? `${size.width} x ${size.height}` : '',
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      key: 'rate',
    },
    {
      title: 'Charges',
      dataIndex: 'charges',
      key: 'charges',
    },
    {
      title: 'Commission',
      key: 'commission',
      render: (record) =>
        record.commissionamount ?? record.commission,
    },
    {
      title: 'Amount',
      key: 'amount',
      render: (record) =>
        record.totalcharges ?? record.amount,
    },
    {
      title: 'Chq No',
      dataIndex: 'chequeno',
      key: 'chequeno',
      render: (val, record) =>
        val ?? record.chqNo ?? '',
    },
    {
      title: 'Chq Date',
      key: 'chequedate',
      dataIndex: 'chequedate',
      render: (_, record) => {
        const rawDate = record.chequedate;
        if (!rawDate) return '';

        const parsedDate = new Date(rawDate);
        return isNaN(parsedDate)
          ? rawDate
          : parsedDate.toLocaleDateString('en-GB');
      }
    }

  ];

  useEffect(() => {
    axios.get(`http://localhost:8081/pmediaros/${agencyid}/${id}`)
      .then((response) => {
        const roData = response.data.data;
        setRoData(roData);
        setDataSource(roData.items || []); // <-- set items array here
        console.log("RO data:", roData);
      })
      .catch((error) => {
        console.error("Error fetching RO data:", error);
      })

    axios.get(`http://localhost:8081/pmediaroinvoices/by-ro/${id}`)
      .then((response) => {
        // If response.data.data is an array, use the first item
        const invoiceData = Array.isArray(response.data.data)
          ? response.data.data[0]
          : response.data.data;
        setInvoiceData(invoiceData);
        console.log("Invoice Data:", invoiceData);
      })
      .catch((error) => {
        console.error("Error fetching invoice data:", error);
      });
  }, [id]);

  const handleDownload = (format) => {
    if (format === "word") {
      // Logic to download as Word document
      const element = document.createElement("a");
      const content = document.getElementById("pMediaRO-content").innerHTML;
      const blob = new Blob(["\ufeff" + content], { type: "application/msword" });
      const url = URL.createObjectURL(blob);
      element.href = url;
      element.download = "pMediaRO.doc";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else if (format === "excel") {
      console.log("Download as Excel");
      // Add logic for Excel download
    } else if (format === "pdf") {
      // Generate PDF with page numbers
      const doc = new jsPDF();
      const content = document.getElementById("pMediaRO-content");
      const pageHeight = doc.internal.pageSize.height;
      const contentHeight = content.scrollHeight;
      const totalPages = Math.ceil(contentHeight / pageHeight);

      for (let i = 0; i < totalPages; i++) {
        if (i > 0) doc.addPage();
        doc.html(content, {
          x: 10,
          y: 10 - i * pageHeight,
          html2canvas: { scale: 0.5 },
          callback: () => {
            doc.setFontSize(10);
            doc.text(`Page ${i + 1} of ${totalPages}`, doc.internal.pageSize.width - 50, doc.internal.pageSize.height - 10);
            if (i === totalPages - 1) doc.save("pMediaRO.pdf");
          },
        });
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const menu = (
    <Menu style={{ backgroundColor: "#f0f0f0" }}>
      <Menu.Item key="word" onClick={() => handleDownload("word")}>
        Word
      </Menu.Item>
      <Menu.Item key="excel" onClick={() => handleDownload("excel")}>
        Excel
      </Menu.Item>
      <Menu.Item key="pdf" onClick={() => handleDownload("pdf")}>
        PDF
      </Menu.Item>
    </Menu>
  );

  return (
    <main id="main" className="main" style={{ backgroundColor: "#f5f5f5", padding: 20 }}>
      <div className="pagetitle">
        <h1>Invoice</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to={"/"}>Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/p-media/pmediaROList">P-Media</Link>
            </li>
            <li className="breadcrumb-item active">Print</li>
            <Col span={8} offset={8}>
              {/* Print and Show/Hide Date Buttons */}
              <div style={{ textAlign: "right", marginBottom: 20 }}>
                <Button
                  type="primary"
                  onClick={handlePrint}
                  style={{ marginRight: "10px" }}
                >
                  Print
                </Button>
                <Button
                  type="default"
                  onClick={() => setShowDate(true)}
                  style={{ marginRight: "10px" }}
                >
                  Show Date
                </Button>
                <Button
                  type="default"
                  danger
                  onClick={() => setShowDate(false)}
                >
                  Hide Date
                </Button>
              </div>
            </Col>
          </ol>
        </nav>
      </div>

      <div style={{ backgroundColor: "white", padding: "10px", marginBottom: "20px" }}>
        <Dropdown overlay={menu} >
          <Button style={{ backgroundColor: "#f0f0f0", color: "#333" }}>
            Download <DownOutlined />
          </Button>
        </Dropdown>
        <div style={{ textAlign: "right", fontSize: "12px", marginTop: "5px" }}>
          Page 1 of 1 {/* This is static; it will be dynamic in the PDF */}
        </div>
      </div>

      <Card
        id="invoice-content"
        style={{
          padding: 30,
          fontFamily: 'Arial',
          maxWidth: 800,
          margin: '0 auto',
          backgroundColor: 'white',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        }}
        bordered={false} // remove if you want the default border
      >

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 20, width: '100%' }}>
          <Title level={2} style={{ margin: 0 }}>RELEASE ORDER</Title>
          <Title level={5} style={{ fontWeight: 'bold' }}>NEWSPAPER SPACE</Title>

          <Paragraph style={{ fontSize: '12px', marginBottom: 0 }}>
            <Text strong>Office:</Text> Tulip Classic, Office No. 202, 12th Lane, Rajarampuri, Kolhapur. Pin 416 008. <br />
            <Text strong>Tel:</Text> 0231-2529585 | <Text strong>Mob:</Text> 8698711555 | <Text strong>Email:</Text> brandcf@gmail.com
          </Paragraph>
        </div>

        <Divider style={{ borderColor: '#000', borderWidth: 2 }} />

        {/*P-Media Invoice & Client Details */}
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={12}>
            <Paragraph style={{ fontSize: '14px' }}><Text strong>RO No:</Text>{roData?.rono || ""}</Paragraph>
            <Paragraph style={{ fontSize: '14px' }}><Text strong>Media Bill No:</Text>{roData?.mediabillno || ""}</Paragraph>
            <Paragraph style={{ fontSize: '14px' }}><Text strong>Client Name:</Text>{roData?.clientid?.name || ""}</Paragraph>
            <Paragraph style={{ fontSize: '14px' }}>
              <Text strong>Publication:</Text>
              {roData?.pmediaid?.name || ""}
            </Paragraph>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Paragraph style={{ fontSize: '14px' }}>
              <Text strong>Date:</Text>
              {showDate && roData?.rodate ? new Date(roData.rodate).toLocaleDateString('en-GB') : ""}
            </Paragraph>            <Paragraph style={{ fontSize: '14px' }}><Text strong>Invoice No:</Text>{invoiceData?.invoiceno || ""}</Paragraph>
            <Paragraph style={{ fontSize: '14px' }}><Text strong>Media GST Code:</Text>{roData?.pmediaid?.gstno || ""}</Paragraph>
            <Paragraph style={{ fontSize: '14px' }}><Text strong>Editions:</Text>{roData?.editions || ""}</Paragraph>
          </Col>
        </Row>

        <div style={{ marginTop: 12 }}>
          <Title level={5} style={{ marginBottom: 8 }}>Schedule Details</Title>
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
              <Paragraph style={{ fontSize: '14px' }}><Text strong>Instructions:</Text>{roData?.instructions || ""}</Paragraph>
            </div>
          </Col>
          {/* Totals and Payment Info */}
          <Col span={12}>
            <div style={{ float: "right" }}>
              <Descriptions
                column={1}
                size="small"
                bordered={false}
                labelStyle={{
                  textAlign: "right",
                  paddingRight: 10,
                  border: "none",
                  background: "none"
                }}
                contentStyle={{
                  textAlign: "right",
                  border: "none",
                  background: "none"
                }}
                style={{
                  border: "none"
                }}
              >
                <Descriptions.Item label={<Text strong>Bill Amount:</Text>}>{roData?.robillamount || "0.00"} </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Commission:</Text>}>{roData?.commissionTotal || "0.00"} </Descriptions.Item>
                <Descriptions.Item label={<Text strong>C & C Amount:</Text>}>{roData?.ccamount || "0.00"} </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Total:</Text>}>
                  {(
                    (parseFloat(roData?.totalcharges) || 0) -
                    (parseFloat(roData?.comissionamount) || 0)
                  ).toFixed(2)}
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>CGST:</Text>}>{roData?.cgstTotal || "0.00"} </Descriptions.Item>
                <Descriptions.Item label={<Text strong>SGST:</Text>}> {roData?.sgstTotal || "0.00"}</Descriptions.Item>
                <Descriptions.Item label={<Text strong>IGST:</Text>}>{roData?.igstTotal || "0.00"} </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Gross Total:</Text>}>{roData?.robillamount || "0.00"} </Descriptions.Item>
              </Descriptions>
            </div>
          </Col>
        </Row>

        <Divider style={{ borderColor: '#000', borderWidth: 2, marginTop: 40 }} />

        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={5}>
            <Paragraph style={{ fontSize: '14px' }}>
              <Text strong>Cheque No:</Text>
              {roData?.items?.[0]?.chequeno || ""}
            </Paragraph>          </Col>
          <Col span={5} style={{ textAlign: '' }}>
            <Paragraph style={{ fontSize: '14px' }}>
              <Text strong>Cheque Date:</Text>
              {roData?.items?.[0]?.chequedate ? new Date(roData.items[0].chequedate).toLocaleDateString('en-GB') : ""}
            </Paragraph>          </Col>
          <Col span={5} style={{ textAlign: '' }}>
            <Paragraph style={{ fontSize: '14px' }}><Text strong>Bank:</Text>{roData?.bankname || ""}</Paragraph>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={5}>
            <Paragraph style={{ fontSize: '14px' }}><Text strong>PAN No:</Text></Paragraph>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={5}>
            <Paragraph style={{ fontSize: '14px' }}><Text strong>GST No:</Text></Paragraph>
          </Col>
          <Col span={12} style={{ textAlign: 'center' }}>
            <Image
              src="/stamp.png"
              alt="Company Seal"
              width={100}
              height={100}
              style={{ opacity: 0.8 }}
              preview={false}
            />
            <Paragraph>
              <Text strong>For IGAP ADPRO</Text>
            </Paragraph>
          </Col>
        </Row>

      </Card>
    </main>
  )
};

export default PMediaROPrint;