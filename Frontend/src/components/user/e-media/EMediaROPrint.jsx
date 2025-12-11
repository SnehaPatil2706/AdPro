import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Typography, Divider, Row, Col, Table, Card, Image, List, Descriptions, Dropdown, Menu, Button } from 'antd';
import axios from "axios";
import { DownOutlined, PrinterOutlined, CalendarOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";

function EMediaROPrint() {
    const { Title, Paragraph, Text } = Typography;
    const [dataSource, setDataSource] = useState([]);
    const { id } = useParams(); // Get the RO id from the route
    const [roData, setRoData] = useState(null);
    const [invoiceData, setInvoiceData] = useState(null);
    const navigate = useNavigate();

    const columns = [
        { title: ' No', dataIndex: 'no', key: 'no', width: 80, render: (text, record, index) => index + 1 },
        {
            title: 'From To Date',
            dataIndex: 'fromToDate',
            key: '',
            width: 100,
            render: (value) => {
                // If value is an array, join it
                if (Array.isArray(value) && value.length === 2) {
                    const format = (d) => {
                        const date = new Date(d);
                        return isNaN(date) ? "" : date.toLocaleDateString('en-GB');
                    };
                    return `${format(value[0])} - ${format(value[1])}`;
                }
                // If value is a string, try to extract two dates
                if (typeof value === "string") {
                    // Try splitting by 'Z' if both dates are concatenated
                    const parts = value.split('Z').filter(Boolean).map(s => s + 'Z');
                    if (parts.length === 2) {
                        const format = (d) => {
                            const date = new Date(d);
                            return isNaN(date) ? "" : date.toLocaleDateString('en-GB');
                        };
                        return `${format(parts[0])} - ${format(parts[1])}`;
                    }
                    // fallback: try to match ISO dates
                    const match = value.match(/(\d{4}-\d{2}-\d{2}T[0-9:.Z]+)/g);
                    if (match && match.length === 2) {
                        const format = (d) => {
                            const date = new Date(d);
                            return isNaN(date) ? "" : date.toLocaleDateString('en-GB');
                        };
                        return `${format(match[0])} - ${format(match[1])}`;
                    }
                }
                return "";
            }
        },
        { title: 'Days', dataIndex: 'days', key: 'days', width: 120 },
        {
            title: 'Slot Time',
            key: 'slotTime',
            width: 120,
            render: (_, record) => {
                const formatTime = (timeStr) => {
                    if (!timeStr) return '';
                    const date = new Date(`1970-01-01T${timeStr}`);
                    return date.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    });
                };

                const from = formatTime(record.fromTime);
                const to = formatTime(record.toTime);

                return `${from} - ${to}`;
            }
        },
        { title: 'Daily Spots', dataIndex: 'dailySpots', key: 'dailySpots', width: 80 },
        { title: 'Total Spots', dataIndex: 'totalSpots', key: 'totalSpots', width: 80 },
        { title: 'Captiont', dataIndex: 'caption', key: 'caption', width: 100 },
        { title: 'Bonus / Paid', dataIndex: 'bonusPaid', key: 'bonusPaid', width: 80 },
        { title: 'Rate (10 sec)', dataIndex: 'charges', key: 'charges', width: 100 },
        { title: 'Duration (sec)', dataIndex: 'duration', key: 'duration', width: 100 },
        { title: 'Amount', dataIndex: 'totalCharges', key: 'totalCharges', width: 100 }

    ];

    // inject print CSS once
    useEffect(() => {
        const style = document.createElement("style");
        style.innerHTML = `
      @media print {
        body * { visibility: hidden; }
        #invoice-content, #invoice-content * { visibility: visible; }
        #invoice-content { position: absolute; top: 0; left: 0; width: 100%; }
      }
    `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    useEffect(() => {
        // Fetch RO data by emediaroid
        axios.get(`http://localhost:8081/emediaros/${id}`)
            .then((response) => {
                const roData = response.data.data;
                setRoData(roData);
                setDataSource(roData.items || []);
                console.log("RO data:", roData);

                // Now fetch invoice data using the RO id
                return axios.get(`http://localhost:8081/emediaroinvoices/by-ro/${id}`);
            })
            .then((invoiceResponse) => {
                // If invoiceResponse.data.data is an array, use the first item
                const invoiceData = Array.isArray(invoiceResponse.data.data)
                    ? invoiceResponse.data.data[0]
                    : invoiceResponse.data.data;
                setInvoiceData(invoiceData);
                console.log("Invoice Data:", invoiceData);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });

    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    const menu = (
        <Menu>
            <Menu.Item onClick={() => handleDownload("word")}>Download as Word</Menu.Item>
            <Menu.Item onClick={() => handleDownload("pdf")}>Download as PDF</Menu.Item>
        </Menu>
    );

    const handleDownload = (format) => {
        const content = document.getElementById("invoice-content");
        const fileName = `RO_${roData?.rono || "document"}`;

        if (format === "pdf") {
            const doc = new jsPDF();
            doc.html(content, {
                callback: (d) => d.save(`${fileName}.pdf`),
                margin: [10, 10, 10, 10],
                autoPaging: "text",
                width: 190,
                windowWidth: 650,
            });
        } else {
            const html = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office"
              xmlns:w="urn:schemas-microsoft-com:office:word"
              xmlns="http://www.w3.org/TR/REC-html40">
          <head><title>${fileName}</title></head>
          <body>${content.innerHTML}</body>
        </html>`;
            const blob = new Blob(["\ufeff", html], { type: "application/msword" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${fileName}.doc`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    if (!roData) {
        return (
            <Card style={{ margin: 20 }}>
                <div style={{ textAlign: 'center', padding: 20 }}>
                    <h2>Release Order Not Found</h2>
                    <p>The requested RO could not be loaded.</p>
                    <Button
                        type="primary"
                        onClick={() => navigate(`/emedia/emediaROList`)}
                        style={{ marginTop: 20 }}
                    >
                        Back to RO List
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <main id="main" className="main" style={{ backgroundColor: "#f5f5f5", padding: 20 }}>
            <div className="pagetitle">
                <h1>Release Order</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to={"/"}>Home</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="/emedia/emediaROList">E-Media</Link>
                        </li>
                        <li className="breadcrumb-item active">Print</li>
                    </ol>
                </nav>
            </div>

            <Card
                id="invoice-content"
                // className="print-only"
                style={{
                    padding: 30,
                    fontFamily: 'Arial',
                    maxWidth: 800,
                    margin: '0 auto',
                    backgroundColor: 'white',
                    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                }}
                bordered={false}
            >

                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                    <Title level={2} style={{ margin: 0 }}>RELEASE ORDER</Title>
                    <Title level={5} style={{ fontWeight: 'bold' }}>ELECTRONIC MEDIA</Title>

                    <Paragraph style={{ fontSize: '12px', marginBottom: 0 }}>
                        <Text strong>Office:</Text> Tulip Classic, Office No. 202, 12th Lane, Rajarampuri, Kolhapur. Pin 416 008. <br />
                        <Text strong>Tel:</Text> 0231-2529585 | <Text strong>Mob:</Text> 8698711555 | <Text strong>Email:</Text> brandcf@gmail.com
                    </Paragraph>
                </div>

                <Divider style={{ borderColor: '#000', borderWidth: 2 }} />

                {/* EMedia RO & Client Details */}
                <Row gutter={16} style={{ marginBottom: 20 }}>
                    <Col span={12}>
                        <Paragraph style={{ fontSize: '14px' }}><Text strong>RO No :-</Text>
                            <span style={{ marginLeft: 8 }}>{roData?.rono || ""}</span></Paragraph>
                        <Paragraph style={{ fontSize: '14px' }}><Text strong>Media Bill No :- </Text>
                            <span style={{ marginLeft: 8 }}>{roData?.mediabillno || ""}</span></Paragraph>
                        <Paragraph style={{ fontSize: '14px' }}><Text strong>Client Name :-</Text>
                            <span style={{ marginLeft: 8 }}>{roData?.clientid?.name || ""}</span></Paragraph>
                        <Paragraph style={{ fontSize: '14px' }}><Text strong>Publication :-</Text>
                            <span style={{ marginLeft: 8 }}>{roData?.emediaid?.name || ""}</span></Paragraph>
                        <Paragraph style={{ fontSize: '14px' }}><Text strong>Broadcast Centers :-</Text>
                            <span style={{ marginLeft: 8 }}>{roData?.centers || ""}</span></Paragraph>
                    </Col>
                    <Col span={12} style={{ paddingLeft: '80px', textAlign: 'left' }}>
                        <Paragraph style={{ fontSize: '14px' }}><Text strong>Date :-</Text>
                            <span style={{ marginLeft: 8 }}>{roData?.rodate ? new Date(roData.rodate).toLocaleDateString('en-GB') : ""}</span></Paragraph>
                        <Paragraph style={{ fontSize: '14px' }}><Text strong>Invoice No :-</Text>
                            <span style={{ marginLeft: 8 }}>{invoiceData?.invoiceno || "Not generated"}</span></Paragraph>
                        <Paragraph style={{ fontSize: '14px' }}><Text strong>Language :-</Text>
                            <span style={{ marginLeft: 8 }}>{roData?.language || ""}</span></Paragraph>
                        <Paragraph style={{ fontSize: '14px' }}><Text strong>Caption :-</Text>
                            <span style={{ marginLeft: 8 }}>{roData?.caption || ""}</span></Paragraph>
                        <Paragraph style={{ fontSize: '14px' }}><Text strong>Total Spots :-</Text>
                            <span style={{ marginLeft: 8 }}>{roData?.totalspots || ""}</span></Paragraph>
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
                            <Paragraph style={{ fontSize: '14px' }}><Text strong>Instructions :-</Text><span style={{ marginLeft: 8 }}>{roData?.instructions || ""}</span></Paragraph>
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
                                <Descriptions.Item label={<Text strong>Bill Amount:</Text>}>{roData?.totalcharges || "0.00"} </Descriptions.Item>
                                <Descriptions.Item label={<Text strong>Commission:</Text>}>{roData?.comissionamount || "0.00"} </Descriptions.Item>
                                <Descriptions.Item label={<Text strong>Total:</Text>}>
                                    {(
                                        (parseFloat(roData?.totalcharges) || 0) -
                                        (parseFloat(roData?.comissionamount) || 0)
                                    ).toFixed(2)}
                                </Descriptions.Item>
                                <Descriptions.Item label={<Text strong>CGST:</Text>}>{roData?.cgstamount || "0.00"} </Descriptions.Item>
                                <Descriptions.Item label={<Text strong>SGST:</Text>}> {roData?.sgstamount || "0.00"}</Descriptions.Item>
                                <Descriptions.Item label={<Text strong>IGST:</Text>}>{roData?.igstamount || "0.00"} </Descriptions.Item>
                                <Descriptions.Item label={<Text strong>Gross Total:</Text>}>{roData?.robillamount || "0.00"} </Descriptions.Item>
                            </Descriptions>
                        </div>
                    </Col>
                </Row>

                <Divider style={{ borderColor: '#000', borderWidth: 2, marginTop: 40 }} />

                <Row gutter={16} style={{ marginBottom: 20 }}>
                    <Col span={5}>
                        <Paragraph style={{ fontSize: '14px' }}><Text strong>Cheque No:</Text><span style={{ marginLeft: 8 }}>{roData?.chequeno || ""}</span></Paragraph>
                    </Col>
                    <Col span={7} style={{ textAlign: '' }}>
                        <Paragraph style={{ fontSize: '14px' }}><Text strong>Cheque Date:</Text><span style={{ marginLeft: 8 }}>{roData?.chequedate ? new Date(roData.chequedate).toLocaleDateString('en-GB') : ""}</span></Paragraph>
                    </Col>
                    <Col span={5} style={{ textAlign: '' }}>
                        <Paragraph style={{ fontSize: '14px' }}><Text strong>Bank:</Text><span style={{ marginLeft: 8 }}>{roData?.bankname || ""}</span></Paragraph>
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginBottom: 20 }}>
                    <Col span={5}>
                        <Paragraph style={{ fontSize: '14px' }}><Text strong>PAN No:</Text></Paragraph>
                    </Col>
                    <Col span={7}>
                        <Paragraph style={{ fontSize: '14px' }}><Text strong>GST No:</Text></Paragraph>
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginBottom: 20 }}>
                    <Col span={19} style={{ textAlign: 'right' }}>
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
            </Card><br /><br />

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
    )
};

export default EMediaROPrint;