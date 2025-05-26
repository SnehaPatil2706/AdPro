import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Card, Form, DatePicker, Button, Row, Col, Table, Typography, message, Select, Modal, Input, InputNumber, Popconfirm, Tooltip } from 'antd';
import { SearchOutlined, RedoOutlined, EditOutlined, DeleteOutlined, PrinterOutlined, DollarOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import 'bootstrap/dist/css/bootstrap.min.css';

const { Text } = Typography;
const { Option } = Select;

function InvoiceList() {
    const navigate = useNavigate();
    const [searchForm] = Form.useForm();
    const [clients, setClients] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [originalData, setOriginalData] = useState([]); // to keep unfiltered data
    const [loading, setLoading] = useState(false);
    const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [form] = Form.useForm();
    const [invoiceList, setInvoiceList] = useState([]);

    const agency = JSON.parse(localStorage.getItem("agency"));
    const agencyid = agency?._id;

    const fetchClients = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/clients/${agencyid}`);
            if (response.data?.data) {
                setClients(response.data.data);
            }
        } catch (error) {
            console.error("Failed to load clients", error);
        }
    };

    const fetchInvoices = async () => {
        if (!agencyid || agencyid.length !== 24) {
            console.error("Invalid agency ID:", agencyid);
            message.error("Invalid agency ID. Please login again.");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8081/invoices`);
            const invoices = response.data?.data || [];

            console.log(invoices);


            const clientMap = {};
            clients.forEach(client => {
                clientMap[client._id] = client.name;
            });

            const mappedInvoices = invoices.map(inv => {
                const clientId = inv.clientid?._id || inv.clientid;
                const clientName = clientMap[clientId] || 'Unknown';

                const totalPaid = inv.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
                const remaining = inv.billAmount - totalPaid;

                let formattedDate = "N/A";
                try {
                    formattedDate = new Date(inv.invoiceDate).toLocaleDateString();
                } catch {
                    formattedDate = "Invalid Date";
                }

                return {
                    ...inv,
                    key: inv._id,
                    client: clientName,
                    invoiceDate: formattedDate,
                    invoiceDateRaw: inv.invoiceDate, // keep original for filtering
                    paid: totalPaid,
                    remaining: remaining,
                };
            });

            setOriginalData(mappedInvoices);
            setDataSource(mappedInvoices);
        } catch (err) {
            console.error("Fetch invoices error:", err);
            message.error("Failed to load invoices");
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchClients();
            setLoading(false);
        };
        loadData();
    }, []);

    useEffect(() => {
        if (clients.length > 0) {
            fetchInvoices();
        }
    }, [clients]);

    const onSearch = (values) => {
        let filtered = [...originalData];

        if (values.client) {
            filtered = filtered.filter(inv => {
                const clientId = inv.clientid?._id || inv.clientid;
                return clientId === values.client;
            });
        }

        if (values.fromDate && values.toDate) {
            const from = values.fromDate.startOf('day');
            const to = values.toDate.endOf('day');
            filtered = filtered.filter(inv => {
                const invoiceDate = dayjs(inv.invoiceDateRaw);
                return invoiceDate.isAfter(from) || invoiceDate.isSame(from, 'day') &&
                    invoiceDate.isBefore(to) || invoiceDate.isSame(to, 'day');
            });
        }

        setDataSource(filtered);
    };

    const onResetSearch = () => {
        searchForm.resetFields();
        setDataSource(originalData);
    };

    const deleteInvoice = async (id) => {
        try {
            setLoading(true);
            const response = await axios.delete(`http://localhost:8081/invoices/${id}`);
            if (response.data.status === "success") {
                message.success("Invoice deleted successfully");
                fetchInvoices();
            } else {
                message.error("Failed to delete invoice");
            }
        } catch (err) {
            console.error("Error deleting invoice:", err);
            message.error("An error occurred while deleting the invoice");
        } finally {
            setLoading(false);
        }
    };


    const handlePrint = (agencyid, invoiceid) => {
        navigate(`/invoice/invoicePrint/${agencyid}/${invoiceid}`);
    };

    form.setFieldsValue({
        paymentDate: dayjs(), // today's date
        description: '',
        amount: null
    });

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
                                backgroundColor: '#3b82f6',
                            }}>
                            <Button
                                size="small"
                                icon={<EditOutlined />}
                                style={{ background: '#3b82f6', color: '#fff' }}
                                onClick={() => navigate(`/invoice/invoiceMaster/${record.key}`)}
                            />
                        </Tooltip>
                        <Tooltip title="Click to delete"
                            overlayInnerStyle={{
                                backgroundColor: '#ef4444',
                            }}>
                            <Popconfirm
                                title="Are you sure you want to delete this invoice?"
                                onConfirm={() => deleteInvoice(record._id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    type="primary"
                                    danger
                                    icon={<DeleteOutlined />}
                                    size="small"
                                    style={{ padding: '4px 6px' }} // optional: fine-tune spacing
                                />
                            </Popconfirm>
                        </Tooltip>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                        <Tooltip title="Click to print"
                            overlayInnerStyle={{
                                backgroundColor: '#22c55e',
                            }}>
                            <Button
                                size="small"
                                icon={<PrinterOutlined />}
                                style={{ background: '#22c55e', color: '#fff' }}
                                onClick={() => handlePrint(record.agencyid._id || record.agencyid, record._id)}
                            />
                        </Tooltip>
                        <Tooltip title="Click to add / view packages and payment transactions"
                            overlayInnerStyle={{
                                backgroundColor: '#be185d',
                            }}>
                            <Button
                                size="small"
                                icon={<DollarOutlined />}
                                style={{ background: '#be185d', color: '#fff' }}
                                onClick={() => navigate(`/invoice/invoicePayment/${record.key}`)}
                            />
                        </Tooltip>
                    </div>
                </div>
            ),
        },
        { title: 'Invoice No', dataIndex: 'invoiceNo', key: 'invoiceNo', width: 80 },
        { title: 'Invoice Date', dataIndex: 'invoiceDate', key: 'invoiceDate', width: 100 },
        { title: 'Client', dataIndex: 'client', key: 'client', width: 120 },
        { title: 'Amount', dataIndex: 'amount', key: 'amount', width: 80 },
        { title: 'Discount', dataIndex: 'discount', key: 'discount', width: 80 },
        { title: 'Taxable Amount', dataIndex: 'taxableAmount', key: 'taxableAmount', width: 100 },
        { title: 'CGST%', dataIndex: 'cgstPercent', key: 'cgstPercent', width: 80 },
        { title: 'CGST Amount', dataIndex: 'cgstAmount', key: 'cgstAmount', width: 100 },
        { title: 'SGST%', dataIndex: 'sgstPercent', key: 'sgstPercent', width: 80 },
        { title: 'SGST Amount', dataIndex: 'sgstAmount', key: 'sgstAmount', width: 100 },
        { title: 'IGST%', dataIndex: 'igstPercent', key: 'igstPercent', width: 80 },
        { title: 'IGST Amount', dataIndex: 'igstAmount', key: 'igstAmount', width: 100 },
        { title: 'Invoice Amount', dataIndex: 'billAmount', key: 'billAmount', width: 100 },
        { title: 'Paid', dataIndex: 'paid', key: 'paid', width: 80 },
        { title: 'Remaining', dataIndex: 'remaining', key: 'remaining', width: 100 },
    ];

    return (
        <main id="main" className="main" style={{ backgroundColor: "#f5f5f5", padding: 20 }}>
            <div className="pagetitle">
                <h1>Design & Printing Invoice List</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to={"/"}>Invoice</Link>
                        </li>
                        <li className="breadcrumb-item active">Invoice List</li>
                    </ol>
                </nav>
            </div>

            <Card title="Search Invoices" style={{ maxWidth: 1200, margin: '0 auto' }}>
                <Form form={searchForm} layout="vertical" onFinish={onSearch}>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item label="CLIENT" name="client">
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder="Select Client"
                                    disabled={loading}
                                    style={{ width: '100%' }}
                                >
                                    {clients.map(client => (
                                        <Option key={client._id} value={client._id}>
                                            {client.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="FROM DATE" name="fromDate">
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="TO DATE" name="toDate">
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify="start" gutter={16}>
                        <Col>
                            <Button type="primary" htmlType="submit" icon={<SearchOutlined />} style={{ backgroundColor: '#7fdbff', color: '#000' }}>
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
                                onClick={() => navigate('/invoice/invoiceMaster')}
                            >
                                Add New Invoice
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>

            <Card title="Invoice Records" style={{ maxWidth: 1200, margin: '24px auto' }}>
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
    );
}

export default InvoiceList;