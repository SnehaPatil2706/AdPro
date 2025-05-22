import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Typography, Divider, Row, Col, Table, Card, Image, List, Descriptions } from 'antd';
import axios from "axios";

function EMediaROPrint() {
    const { Title, Paragraph, Text } = Typography;
    const [dataSource, setDataSource] = useState([]);
    const { id } = useParams(); // Get the RO id from the route
    const [roData, setRoData] = useState(null);
    const [invoiceData, setInvoiceData] = useState(null);

    const columns = [
        { title: ' No', dataIndex: '', key: '', width: 80 },
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

    useEffect(() => {
        axios.get(`http://localhost:8081/emediaros/${id}`)
            .then((response) => {
                const roData = response.data.data;
                setRoData(roData);
                setDataSource(roData.items || []); // <-- set items array here
                console.log("RO data:", roData);
            })
            .catch((error) => {
                console.error("Error fetching RO data:", error);
            })

        axios.get(`http://localhost:8081/emediaroinvoices/by-ro/${id}`)
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
                            <Link to="/emedia/emediaROList">E-Media</Link>
                        </li>
                        <li className="breadcrumb-item active">Print</li>
                    </ol>
                </nav>
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
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                    <Title level={2} style={{ margin: 0 }}>RELEASE ORDER</Title>
                    <Title level={5} style={{ fontWeight: 'bold' }}>ELECTRONIC MEDIA</Title>

                    <Paragraph style={{ fontSize: '12px', marginBottom: 0 }}>
                        <Text strong>Office:</Text> Tulip Classic, Office No. 202, 12th Lane, Rajarampuri, Kolhapur. Pin 416 008. <br />
                        <Text strong>Tel:</Text> 0231-2529585 | <Text strong>Mob:</Text> 8698711555 | <Text strong>Email:</Text> brandcf@gmail.com
                    </Paragraph>
                </div>

                <Divider style={{ borderColor: '#000', borderWidth: 2 }} />

                {/*EMedia Invoice & Client Details */}
                <Row gutter={16} style={{ marginBottom: 20 }}>
                    <Col span={12}>
                        <Paragraph style={{ fontSize: '14px' }}><Text strong>RO No:</Text>{roData?.rono || ""}</Paragraph>
                        <Paragraph style={{ fontSize: '14px' }}><Text strong>Media Bill No:</Text>{roData?.mediabillno || ""}</Paragraph>
                        <Paragraph style={{ fontSize: '14px' }}><Text strong>Client Name:</Text>{roData?.clientid.name || ""}</Paragraph>
                        <Paragraph style={{ fontSize: '14px' }}><Text strong>Publication:</Text>{roData?.emediaid.name || ""}</Paragraph>
                        <Paragraph style={{ fontSize: '14px' }}><Text strong>Broadcast Centers:</Text>{roData?.centers || ""}</Paragraph>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                        <Paragraph style={{ fontSize: '14px' }}><Text strong>Date:</Text>{roData?.rodate ? new Date(roData.rodate).toLocaleDateString('en-GB') : ""}</Paragraph>
                        <Paragraph style={{ fontSize: '14px' }}><Text strong>Invoice No:</Text>{invoiceData?.invoiceno || ""}</Paragraph>
                        <Paragraph style={{ fontSize: '14px' }}><Text strong>Language:</Text>{roData?.language || ""}</Paragraph>
                        <Paragraph style={{ fontSize: '14px' }}><Text strong>Caption:</Text>{roData?.caption || ""}</Paragraph>
                        <Paragraph style={{ fontSize: '14px' }}><Text strong>Total Spots:</Text>{roData?.totalspots || ""}</Paragraph>
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
                        <Paragraph style={{ fontSize: '14px' }}><Text strong>Cheque No:</Text>{roData?.chequeno || ""}</Paragraph>
                    </Col>
                    <Col span={5} style={{ textAlign: '' }}>
                        <Paragraph style={{ fontSize: '14px' }}><Text strong>Cheque Date:</Text>{roData?.chequedate ? new Date(roData.chequedate).toLocaleDateString('en-GB') : ""}</Paragraph>
                    </Col>
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

export default EMediaROPrint;