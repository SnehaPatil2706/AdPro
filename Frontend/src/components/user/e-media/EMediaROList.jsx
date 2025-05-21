import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Form, Row, Col, Button, Select, DatePicker, Input, Typography, Table, Popconfirm, message, Tooltip } from 'antd';
import { SearchOutlined, RedoOutlined, EditOutlined, DeleteOutlined, PrinterOutlined, DollarOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

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
    ];

    const columns = [
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            width: 100,
            render: (_, record) => (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        <Tooltip title="Click to edit"
                            overlayInnerStyle={{
                                backgroundColor: '#3b82f6', // Yellow background
                            }}>
                            <Button
                                size="small"
                                icon={<EditOutlined />}
                                style={{ background: '#3b82f6', color: '#fff' }}
                                onClick={() => navigate(`/emedia/emediaROMaster/${record.key}`)}
                            />
                        </Tooltip>
                        <Tooltip title="Click to delete"
                            overlayInnerStyle={{
                                backgroundColor: '#ef4444', // Yellow background
                            }}>
                            <Popconfirm
                                title="Are you sure to delete this RO?"
                                onConfirm={() => deleteRO(record.key)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    style={{ background: '#ef4444', color: '#fff' }}
                                />
                            </Popconfirm>
                        </Tooltip>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                        <Tooltip title="Click to print"
                            overlayInnerStyle={{
                                backgroundColor: '#22c55e', // Yellow background
                            }}>
                            <Button
                                size="small"
                                icon={<PrinterOutlined />}
                                style={{ background: '#22c55e', color: '#fff' }}
                                onClick={() => handlePrint(record.key)}
                            />
                        </Tooltip>
                        <Tooltip title="Click to add / view packages and payment transactions"
                            overlayInnerStyle={{
                                backgroundColor: '#be185d', // Yellow background
                            }}>
                            <Button
                                size="small"
                                icon={<DollarOutlined />}
                                style={{ background: '#be185d', color: '#fff' }}
                                onClick={() => navigate(`/emedia/emediaInvoicePayment/${record.key}`)}
                            />
                        </Tooltip>
                    </div>
                </div >
            ),
        },
        {
    title: 'RO No',
    dataIndex: 'rono',
    key: 'roNo',
    width: 80,
    onCell: (record) => {
        // Determine background and font color
        let bgColor = '#ff0000'; // Default red
        let fontColor = '#ffffff'; // Default white

        if (record.remaining === '0.00') {
            bgColor = '#008000'; // Green
            fontColor = '#ffffff'; // White on green
        } else if (record.invoiceno) {
            bgColor = '#ffb6d1'; // Pink
            fontColor = '#000000'; // Black on pink
        }

        return {
            style: {
                backgroundColor: bgColor,
                color: fontColor,
                textAlign: 'center',
                padding: '4px'
            }
        };
    },
    render: (text, record) => {
        // Match the font color logic from onCell
        let fontColor = '#ffffff';
        if (record.remaining === '0.00') {
            fontColor = '#ffffff';
        } else if (record.invoiceno) {
            fontColor = '#000000';
        }
        return (
            <div>
                <div style={{ color: fontColor }}>{text}</div>
                <Tooltip title="Click to go to billing"
                    overlayInnerStyle={{
                        backgroundColor: '#ffcc00',
                    }}>
                    <button
                        style={{
                            marginTop: '4px',
                            backgroundColor: '#ffcc00',
                            color: '#ffffff',
                            fontStyle: 'italic',
                            textTransform: 'lowercase',
                            fontWeight: 'bold',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '2px 6px',
                            cursor: 'pointer',
                            fontSize: '12px'
                        }}
                        onClick={() => navigate(`/emedia/emediaROBilling/${record.key}`)}
                    >
                        billing
                    </button>
                </Tooltip>
            </div>
        );
    }
},
        { title: 'RO Date', dataIndex: 'rodate', key: 'roDate', width: 100 },
        { title: 'Invoice No', dataIndex: 'invoiceno', key: 'invoiceNo', width: 80 },
        { title: 'Invoice Date', dataIndex: 'invoicedate', key: 'invoiceDate', width: 100 },
        { title: 'Client', dataIndex: 'clientid', key: 'client', width: 120 },
        { title: 'Publication', dataIndex: 'emediaid', key: 'publication', width: 120 },
        { title: 'RO Amount', dataIndex: 'robillamount', key: 'amount', width: 80 },
        { title: 'Discount', dataIndex: 'discountamount', key: 'discountamount', width: 80 },
        {
            title: 'GST',
            dataIndex: 'gstamount',
            key: 'gstPercent',
            width: 80,
            render: (_, record) => {
                // Safely parse and sum the GST amounts
                const icgst = parseFloat(record.icgstamount) || 0;
                const isgst = parseFloat(record.isgstamount) || 0;
                const iigst = parseFloat(record.iigstamount) || 0;
                const totalGST = icgst + isgst + iigst;
                return totalGST ? totalGST.toFixed(2) : '';
            }
        },
        { title: 'Invoice Amount', dataIndex: 'invoiceamount', key: 'invoiceamount', width: 100 },
        { title: 'Paid', dataIndex: 'paid', key: 'paid', width: 80 },
        { title: 'Remaining', dataIndex: 'remaining', key: 'remaining', width: 100 },
    ];

    const deleteRO = async (id) => {
        try {
            setLoading(true);
            const response = await axios.delete(`http://localhost:8081/emediaros/${id}`);
            if (response.data.status === "success") {
                message.success("RO deleted successfully");
                // Reload both data and RO data
                loadData().then(({ emedias, clients }) => {
                    loadROData(emedias, clients);
                });
            }
        } catch (err) {
            console.error("Error deleting RO:", err);
            message.error("An error occurred while deleting the RO");
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = (agencyid, invoiceid) => {
        navigate(`/emedia/emediaROPrint/${agencyid}/${invoiceid}`);
    };

    function loadData() {
        return Promise.all([
            axios.get("http://localhost:8081/emedias"),
            axios.get(`http://localhost:8081/clients/${agency._id}`)
        ]).then(([emediasRes, clientsRes]) => {
            const emediasList = (emediasRes.data?.data || []).map(emedia => ({
                label: emedia.name,
                value: emedia._id
            }));
            const clientsList = (clientsRes.data?.data || []).map(client => ({
                label: client.name,
                value: client._id
            }));
            setEmedias(emediasList);
            setClients(clientsList);
            return { emedias: emediasList, clients: clientsList }; // return for chaining
        }).catch((err) => {
            console.error("Error loading data:", err);
            setEmedias([]);
            setClients([]);
            return { emedias: [], clients: [] };
        });
    };

    function loadROData(emediasList, clientsList) {
        setLoading(true);
        axios.get("http://localhost:8081/emediaros")
            .then(async (res) => {
                if (res.data && Array.isArray(res.data.data)) {
                    const ros = res.data.data;
                    const roIds = ros.map(ro => ro._id);

                    // Fetch all invoices for these ROs
                    const invoiceRes = await axios.post("http://localhost:8081/emediaroinvoices/by-ro-ids", { roIds });
                    const invoices = invoiceRes.data.data;

                    // Map emediaroid to invoice
                    const invoiceMap = {};
                    invoices.forEach(inv => {
                        invoiceMap[inv.emediaroid] = inv;
                    });

                    const formattedData = ros.map((ro) => {
                        const invoice = invoiceMap[ro._id] || {};
                        // Calculate paid and remaining
                        const payments = invoice.payments || [];
                        const invoiceAmount = Number(invoice.invoiceamount) || 0;
                        const paid = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
                        const remaining = invoiceAmount - paid;
                        return {
                            key: ro._id,
                            rono: ro.rono,
                            rodate: dayjs(ro.rodate).format('DD/MM/YYYY'),
                            clientid: clientsList.find(c => c.value === ro.clientid)?.label || ro.clientid,
                            emediaid: emediasList.find(e => e.value === ro.emediaid)?.label || ro.emediaid,
                            robillamount: ro.robillamount,
                            // Invoice fields:
                            invoiceno: invoice.invoiceno || '',
                            invoiceamount: invoice.invoiceamount || '',
                            invoicedate: invoice.invoicedate ? dayjs(invoice.invoicedate).format('DD/MM/YYYY') : '',
                            discountamount: invoice.discountamount || '',
                            icgstamount: invoice.icgstamount || 0,
                            isgstamount: invoice.isgstamount || 0,
                            iigstamount: invoice.iigstamount || 0,
                            paid: paid ? paid.toFixed(2) : '',
                            remaining: invoiceAmount ? remaining.toFixed(2) : '',

                            // ...other fields as needed
                        };
                    });
                    setDataSource(formattedData);
                    setOriginalData(formattedData);
                } else {
                    setDataSource([]);
                    setOriginalData([]);
                }
            })
            .catch((err) => {
                console.error("Error fetching RO data:", err);
                setDataSource([]);
                setOriginalData([]);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        loadData().then(({ emedias, clients }) => {
            loadROData(emedias, clients); // pass freshly loaded data
        });
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
                                    options={emedias}
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().includes(input.toLowerCase())
                                    }
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
                            <Button danger type="primary" onClick={onResetSearch} icon={<RedoOutlined />}>
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
};

export default EMediaROList;
