import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Form, Row, Col, Button, Select, DatePicker, Input, Typography, Table } from 'antd';
import { SearchOutlined, RedoOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text } = Typography;

function EMediaROList() {
    let agency = JSON.parse(localStorage.getItem("agency")) || null;
    const navigate = useNavigate();
    const [searchForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [emedias, setEmedias] = useState([]);
    const [clients, setClients] = useState([]);
    const [data, setData] = useState({
        agencyid: agency._id,
        rono: "",
        rodate: "",
        clientid: "",
        emediaid: "",
        centers: "",
        language: "",
        caption: "",
        noofrecords: "",
        totalspots: "",
        totalcharges: "",
        comissionpercent: "",
        comissionamount: "",
        chequeno: "",
        chequedate: "",
        bankname: "",
        robillamount: "",
        instructions: "",
        gstid: "",
        cgstpercent: "",
        sgstpercent: "",
        sgstamount: "",
        igstpercent: "",
        igstamount: "",
        status: "",
    });

    const onSearch = (values) => {
        let filtered = [...originalData];
        setDataSource(filtered);
    };

    const onResetSearch = () => {
        searchForm.resetFields();
        setDataSource(originalData);
    };

    const statusOptions = [
        { label: "All (Billed & Not Billed)", value: "all" },
        { label: "Not Billed", value: "not_billed" },
        { label: "Billed", value: "billed" },
        { label: "Cancelled", value: "cancelled" },
    ];

    const paystatusOptions = [
        { label: "All", value: "all" },
        { label: "Partially", value: "partially" },
        { label: "Fully", value: "fully" },
        { label: "Not Paid", value: "not_paid" },
    ]

    const columns = [
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            width: 100,
            // render: (_, record) => (
            //     // <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center' }}>
            //     //     <div style={{ display: 'flex', gap: '4px' }}>
            //     //         <Button
            //     //             size="small"
            //     //             icon={<EditOutlined />}
            //     //             style={{ background: '#3b82f6', color: '#fff' }}
            //     //             onClick={() => navigate(`/invoice/invoiceMaster/${record.key}`)}
            //     //         />
            //     //         <Popconfirm
            //     //             title="Are you sure to delete this invoice?"
            //     //             onConfirm={() => deleteInvoice(record.key)}
            //     //             okText="Yes"
            //     //             cancelText="No"
            //     //         >
            //     //             <Button
            //     //                 size="small"
            //     //                 icon={<DeleteOutlined />}
            //     //                 style={{ background: '#ef4444', color: '#fff' }}
            //     //             />
            //     //         </Popconfirm>
            //     //         {/* <Button
            //     //             size="small"
            //     //             icon={<DeleteOutlined />}
            //     //             style={{ background: '#ef4444', color: '#fff' }}
            //     //             onClick={() => {
            //     //                 if (window.confirm("Are you sure you want to delete this invoice?")) {
            //     //                     deleteInvoice(record.key);
            //     //                 }
            //     //             }}
            //     //         /> */}
            //     //     </div>
            //     //     <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
            //     //         <Button
            //     //             size="small"
            //     //             icon={<PrinterOutlined />}
            //     //             style={{ background: '#22c55e', color: '#fff' }}
            //     //             onClick={() => handlePrint(record.key)}
            //     //         />
            //     //         <Button
            //     //             size="small"
            //     //             icon={<DollarOutlined />}
            //     //             style={{ background: '#be185d', color: '#fff' }}
            //     //             onClick={() => {
            //     //                 setSelectedInvoice(record); // Set the selected invoice
            //     //                 setIsPaymentModalVisible(true); // Open the modal
            //     //             }}
            //     //         />
            //     //     </div>
            //     // </div>
            // ),
        },
        { title: 'RO No', dataIndex: 'roNo', key: 'roNo', width: 80 },
        { title: 'RO Date', dataIndex: 'roDate', key: 'roDate', width: 100 },
        { title: 'Invoice No', dataIndex: 'invoiceNo', key: 'invoiceNo', width: 80 },
        { title: 'Invoice Date', dataIndex: 'invoiceDate', key: 'invoiceDate', width: 100 },
        { title: 'Client', dataIndex: 'client', key: 'client', width: 120 },
        { title: 'Publication', dataIndex: 'publication', key: 'publication', width: 120 },
        { title: 'RO Amount', dataIndex: 'amount', key: 'amount', width: 80 },
        { title: 'Discount', dataIndex: 'discount', key: 'discount', width: 80 },
        { title: 'GST%', dataIndex: 'gstPercent', key: 'gstPercent', width: 80 },
        { title: 'Invoice Amount', dataIndex: 'billAmount', key: 'billAmount', width: 100 },
        { title: 'Paid', dataIndex: 'paid', key: 'paid', width: 80 },
        { title: 'Remaining', dataIndex: 'remaining', key: 'remaining', width: 100 },
    ];

    function loadData() {
        axios.get("http://localhost:8081/emedias")
            .then((res) => {
                console.log("States API Response:", res.data.data); // Debugging
                if (res.data && Array.isArray(res.data.data)) {
                    setEmedias(
                        res.data.data.map((emedia) => ({
                            label: emedia.name,
                            value: emedia._id,
                        }))
                    );
                } else {
                    console.error("Invalid emedias response:", res.data);
                    setEmedias([]);
                }
            })
            .catch((err) => {
                console.error("Error fetching emedia:", err);
                setEmedias([]);
            });

        axios.get(`http://localhost:8081/clients/${agency._id}`)
        // axios.get("http://localhost:8081/clients/67f6094704247221a4c16daf")
            .then((res) => {
                console.log("States API Response:", res.data.data); // Debugging
                if (res.data && Array.isArray(res.data.data)) {
                    setClients(
                        res.data.data.map((client) => ({
                            label: client.name,
                            value: client._id,
                        }))
                    );
                } else {
                    console.error("Invalid clients response:", res.data);
                    setClients([]);
                }
            })
            .catch((err) => {
                console.error("Error fetching clients:", err);
                setClients([]);
            });
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        <main id="main" className="main" style={{ backgroundColor: "#f5f5f5", padding: 20 }}>
            <div className="pagetitle">
                <h1>E-Media RO List</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to={"/"}>E-Media</Link>
                        </li>
                        <li className="breadcrumb-item active">RO List</li>
                    </ol>
                </nav>
            </div>

            <Card
                title="Search E-Medias"
                // style={{ maxWidth: 1200, margin: '0 auto', padding: '12px', backgroundColor: "#f5f5f5" }} // Reduce padding here
                bodyStyle={{ padding: '8px' }} // Important: reduces inner padding
                style={{ maxWidth: 1200, margin: '0 auto' }}
            >

                <Form form={searchForm} layout="vertical" onFinish={onSearch}>
                    <Row gutter={[8, 4]}>
                        <Col span={8}>
                            <Form.Item
                                label="STATUS"
                                name="status"
                                style={{ marginBottom: '8px' }}
                            >
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder="Select Bill status"
                                    disabled={loading}
                                    style={{ width: '100%' }}
                                    options={statusOptions}
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().includes(input.toLowerCase())
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="PUBLICATION" name="publication" style={{ marginBottom: '8px' }} >
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder="Select"
                                    disabled={loading}
                                    style={{ width: '100%' }}
                                    options={emedias}  // ✅ Correct variable
                                    value={data.emediaid}
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().includes(input.toLowerCase())
                                    }
                                    onChange={(value) => setData({ ...data, emediaid: value })}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="CLIENT" name="clientid" style={{ marginBottom: '8px' }} >
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder="Select Client"
                                    disabled={loading}
                                    style={{ width: '100%' }}
                                    options={clients}
                                    value={data.clientid}
                                    onChange={(value) => setData({ ...data, clientid: value })}
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().includes(input.toLowerCase())
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="PAY STATUS" name="pay status" style={{ marginBottom: '8px' }} >
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder="Select Pay status"
                                    disabled={loading}
                                    style={{ width: '100%' }}
                                    options={paystatusOptions}
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().includes(input.toLowerCase())
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="SEARCH RO/INVOICE NO" name="pay status" style={{ marginBottom: '8px' }} >
                                <Input.Search
                                    placeholder="Search..."
                                    disabled={loading}
                                    style={{ width: '100%' }}
                                    onSearch={(value) => console.log(value)} // Add your search handler here
                                    enterButton
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[8, 4]}>
                        <Col span={8}>
                            <Form.Item label="FROM DATE" name="fromDate" style={{ marginBottom: '8px' }} >
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="TO DATE" name="toDate" style={{ marginBottom: '8px' }} >
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify="start" gutter={16}>
                        <Col>
                            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                                SHOW
                            </Button>
                        </Col>
                        <Col>
                            <Button danger onClick={onResetSearch} icon={<RedoOutlined />}>
                                RESET
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                onClick={() => navigate('/emedia/emediaROMaster')}
                            >
                                Add New RO
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>

            <Card title="RO Records" style={{ maxWidth: 1200, margin: '24px auto' }} >
                <div style={{ padding: "16px 16px 0 16px" }}>
                    <Text type="danger" style={{ fontSize: 16 }}>
                        Total records: {dataSource.length}
                    </Text>
                </div>

                <Table
                    className="striped-table"
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{ pageSize: 10 }}
                    bordered
                    size="middle"
                    loading={loading}
                    style={{ marginTop: 12 }}
                />
            </Card>
        </main>
    )
}

export default EMediaROList
