import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Card, Form, DatePicker, Button, Row, Col, Table, Typography, message, Select, Modal, Input, InputNumber, Popconfirm, Tooltip } from 'antd';
import { SearchOutlined, RedoOutlined, EditOutlined, DeleteOutlined, PrinterOutlined, DollarOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { Text } = Typography;
const { Option } = Select;

function PMediaROList() {
    const agency = JSON.parse(localStorage.getItem('agency'));
    const navigate = useNavigate();
    const [searchForm] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [dataSource, setDataSource] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [clients, setClients] = useState([]);
    const [pmedias, setPmedias] = useState([]);
    // const [mediaList, setMediaList] = useState([]);
    const agencyid = agency?._id;

    const onSearch = (values) => {
        let filtered = [...originalData];

        if (values.status && values.status !== "All") {
            filtered = filtered.filter(row => {
                const paid = parseFloat(row.paid) || 0;
                const remaining = parseFloat(row.remaining) || 0;

                if (values.status === "Not Billed") return paid === 0;
                if (values.status === "Partially Billed") return paid > 0 && remaining > 0;
                if (values.status === "Billed") return remaining === 0 && paid > 0;
                return true;
            });
        }

        if (values.paper) {
            const selectedPaperName = pmedias.find(p => p.value === values.paper)?.label;
            filtered = filtered.filter(row => row.pmediaid === selectedPaperName);
        }

        if (values.client) {
            const selectedClientName = clients.find(c => c.value === values.client)?.label;
            filtered = filtered.filter(row => row.clientid === selectedClientName);
        }

        if (values.searchText) {
            const search = values.searchText.toString().toLowerCase();
            filtered = filtered.filter(row =>
                (row.invoiceno || '').toString().toLowerCase() === search ||
                (row.rono || '').toString().toLowerCase() === search
            );
        }

        // Fixed date filtering logic
        if (values.fromDate || values.toDate) {
            const fromDate = values.fromDate ? dayjs(values.fromDate).startOf('day') : null;
            const toDate = values.toDate ? dayjs(values.toDate).endOf('day') : null;

            filtered = filtered.filter(row => {
                // Parse the rodate which is stored as "DD/MM/YYYY"
                const roDate = dayjs(row.rodate, 'DD/MM/YYYY');

                if (!roDate.isValid()) return false; // Skip invalid dates

                // Check if date is after fromDate (if provided)
                const afterFrom = fromDate ? roDate.isAfter(fromDate.subtract(1, 'day')) : true;

                // Check if date is before toDate (if provided)
                const beforeTo = toDate ? roDate.isBefore(toDate.add(1, 'day')) : true;

                return afterFrom && beforeTo;
            });
        }

        setDataSource(filtered);
    };


    const onResetSearch = () => {
        searchForm.resetFields();
        setDataSource(originalData);
    };

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
                                onClick={() => navigate(`/p-media/pMediaROMaster/${record.key}`)}
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
                        <Button
                            size="small"
                            icon={<PrinterOutlined />}
                            style={{ background: '#22c55e', color: '#fff' }}
                            onClick={() => navigate(`/p-media/pMediaROPrint/${record.key}`)}
                        />
                        <Button
                            size="small"
                            icon={<DollarOutlined />}
                            style={{ background: '#be185d', color: '#fff' }}
                            onClick={() => {
                                navigate(`/p-media/pMediaInvoicePayment/${record.key}`);
                            }}
                        />
                    </div>
                </div >
            ),
        },
        {
            title: 'RO No',
            dataIndex: 'rono',
            key: 'rono',
            width: 80,
            onCell: () => ({
                style: {
                    backgroundColor: '#ff0000',
                    color: '#ffffff',
                    textAlign: 'center',
                    padding: '4px'
                }
            }),
            // render: (text, record) => (
            //     <div>
            //         <div style={{ color: '#ffffff' }}>{text}</div>
            //         <button
            //             style={{
            //                 marginTop: '4px',
            //                 backgroundColor: '#ffcc00',
            //                 color: '#000000',
            //                 fontStyle: 'italic',
            //                 textTransform: 'lowercase',
            //                 fontWeight: 'bold',
            //                 border: 'none',
            //                 borderRadius: '2px',
            //                 padding: '1px 4px',
            //                 cursor: 'pointer',
            //                 fontSize: '10px',
            //                 lineHeight: '1'
            //             }}
            //             onClick={() => handleBillingClick(record)}
            //         >
            //             billing
            //         </button>
            //     </div>
            // )
            render: (text, record) => (
                <div>
                    <div style={{ color: '#ffffff' }}>{text}</div>

                    <Tooltip title="Click to go to billing"
                        overlayInnerStyle={{
                            backgroundColor: '#ffcc00', // Yellow background
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
                            onClick={() => navigate(`/p-media/pMediaROBilling/${record.key}`)}
                        >
                            billing
                        </button>
                    </Tooltip>

                </div>
            )
        },

        { title: 'RO Date', dataIndex: 'rodate', key: 'rodate', width: 100 },
        { title: 'Invoice No', dataIndex: 'invoiceno', key: 'invoiceno', width: 80 },
        { title: 'Client', dataIndex: 'clientid', key: 'clientid', width: 120 },
        { title: 'Paper', dataIndex: 'pmediaid', key: 'pmediaid', width: 120 },
        { title: 'Editions', dataIndex: 'editions', key: 'editions', width: 120 },
        { title: 'RO Amount', dataIndex: 'robillamount', key: 'robillamount', width: 80 },
        { title: 'Invoice Count', dataIndex: 'invoiceCount', key: 'invoiceCount', width: 120 },
        { title: 'Discount', dataIndex: 'discountamount', key: 'discountamount', width: 80 },
        {
            title: 'GST Total',
            dataIndex: 'gsttotal',
            key: 'gsttotal',
            width: 100,
        }, { title: 'Invoice Amount', dataIndex: 'invoiceamount', key: 'invoiceamount', width: 100 },
        { title: 'Paid', dataIndex: 'paid', key: 'paid', width: 80 },
        { title: 'Remaining', dataIndex: 'remaining', key: 'remaining', width: 100 },
    ];

    const deleteRO = async (id) => {
        try {
            setLoading(true);
            const response = await axios.delete(`http://localhost:8081/pmediaros/${id}`);
            if (response.data.status === "success") {
                message.success("RO deleted successfully");
                // Reload both data and RO data
                loadData().then(({ pmedias, clients }) => {
                    loadROData(pmedias, clients);
                });
            }
        } catch (err) {
            console.error("Error deleting RO:", err);
            message.error("An error occurred while deleting the RO");
        } finally {
            setLoading(false);
        }
    };

    function loadData() {
        return Promise.all([
            axios.get("http://localhost:8081/pmedia"),
            axios.get(`http://localhost:8081/clients/${agency._id}`)
        ]).then(([pmediasRes, clientsRes]) => {
            const pmediasList = (pmediasRes.data?.data || []).map(pmedia => ({
                label: pmedia.name,
                value: pmedia._id
            }));
            const clientsList = (clientsRes.data?.data || []).map(client => ({
                label: client.name,
                value: client._id
            }));
            console.log("P-Medias List:", pmediasList); // Log pmediasList
            console.log("Clients List:", clientsList); // Log clientsList
            setPmedias(pmediasList);
            setClients(clientsList);
            return { pmedias: pmediasList, clients: clientsList }; // return for chaining
        }).catch((err) => {
            console.error("Error loading data:", err);
            setPmedias([]);
            setClients([]);
            return { pmedias: [], clients: [] };
        });
    }

    function loadROData(pmediasList, clientsList) {
        setLoading(true);
        axios.get("http://localhost:8081/pmediaros")
            .then(async (res) => {
                if (res.data && Array.isArray(res.data.data)) {
                    const ros = res.data.data;
                    const roIds = ros.map(ro => ro._id);

                    // Fetch all invoices for these ROs
                    const invoiceRes = await axios.post("http://localhost:8081/pmediaroinvoices/by-ro-ids", { roIds });
                    const invoices = invoiceRes.data.data;
                    // After fetching invoices
                    console.log("Invoices:", invoices);



                    // Group invoices by pmediaroid as string
                    const invoiceMap = {};
                    invoices.forEach(inv => {
                        const key = typeof inv.pmediaroid === 'object' && inv.pmediaroid.$oid
                            ? inv.pmediaroid.$oid
                            : String(inv.pmediaroid);
                        if (!invoiceMap[key]) invoiceMap[key] = [];
                        invoiceMap[key].push(inv);
                    });
                    console.log("Invoice Map:", invoiceMap);

                    // For each RO, pick the latest invoice (by invoicedate)
                    const formattedData = ros.map((ro) => {
                        const roId = typeof ro._id === 'object' && ro._id.$oid
                            ? ro._id.$oid
                            : String(ro._id);
                        const invoiceArr = invoiceMap[roId] || [];
                        const sortedInvoices = [...invoiceArr].sort((a, b) => {
                            const dateA = a.invoicedate ? new Date(a.invoicedate) : 0;
                            const dateB = b.invoicedate ? new Date(b.invoicedate) : 0;
                            return dateB - dateA;
                        });
                        const latestInvoice = sortedInvoices[0] || {};
                        const cgst = parseFloat(latestInvoice.icgstamount) || 0;
                        const sgst = parseFloat(latestInvoice.isgstamount) || 0;
                        const igst = parseFloat(latestInvoice.iigstamount) || 0;
                        console.log('GST values:', cgst, sgst, igst, 'for invoice', latestInvoice);
                        const gsttotal = (cgst + sgst + igst).toFixed(2);

                        let paid = 0;
                        let remaining = "";
                        if (latestInvoice.payments && latestInvoice.payments.length > 0) {
                            // Sum all payment amounts
                            paid = latestInvoice.payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
                            // Calculate remaining
                            remaining = ((parseFloat(latestInvoice.invoiceamount) || 0) - paid).toFixed(2);
                        } else {
                            paid = 0;
                            remaining = latestInvoice.invoiceamount || "";
                        }
                        console.log('Paid:', paid, 'Remaining:', remaining, 'for invoice', latestInvoice);

                        return {
                            key: roId,
                            rono: ro.rono,
                            rodate: ro.rodate ? dayjs(ro.rodate).format('DD/MM/YYYY') : null,
                            clientid: clientsList.find(c => c.value === ro.clientid)?.label || ro.clientid,
                            pmediaid: pmediasList.find(e => e.value === ro.pmediaid)?.label || ro.pmediaid,
                            editions: ro.editions || "N/A",
                            robillamount: ro.robillamount,
                            invoiceno: latestInvoice.invoiceno || "",
                            invoiceamount: latestInvoice.invoiceamount || "",
                            discountamount: latestInvoice.discountamount ?? "",
                            // gstid: latestInvoice.gstid || "",
                            paid: paid.toFixed(2),
                            remaining,
                            invoiceCount: invoiceArr.length,
                            gsttotal,
                        };
                    });
                    console.log("Formatted Data:", formattedData);
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
        loadData().then(({ pmedias, clients }) => {
            loadROData(pmedias, clients);
        });
    }, []);


    return (
        <main id="main" className="main" style={{ backgroundColor: "#f5f5f5", padding: 20 }}>
            <div className="pagetitle">
                <h1>P-Media RO List</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to={"/"}>P-Media</Link>
                        </li>
                        <li className="breadcrumb-item active">RO List</li>
                    </ol>
                </nav>
            </div>

            <Card
                title="Search P-Medias"
                style={{ maxWidth: 1200, margin: '0 auto', padding: '12px' }}
                bodyStyle={{ padding: '8px' }}
            >
                <Form form={searchForm} layout="vertical" onFinish={onSearch}>
                    <Row gutter={[8, 4]}>
                        <Col span={8}>
                            <Form.Item label="STATUS" name="status" style={{ marginBottom: '8px' }}>
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder="Select Bill status"
                                    disabled={loading}
                                >
                                    <Option value="All">All</Option>
                                    <Option value="Not Billed">Not Billed</Option>
                                    <Option value="Partially Billed">Partially Billed</Option>
                                    <Option value="Billed">Billed</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="PAPER" name="paper" style={{ marginBottom: '8px' }}>
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder="Select Newspaper"
                                    disabled={loading}
                                    style={{ width: '100%' }}
                                    options={pmedias}
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().includes(input.toLowerCase())
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="CLIENT" name="client" style={{ marginBottom: '8px' }}>
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
                            <Form.Item label="PAY STATUS" name="payStatus" style={{ marginBottom: '8px' }}>
                                <Select showSearch allowClear placeholder="Select" disabled={loading}
                                >
                                    <Option value="All">All</Option>
                                    <Option value="Not Billed">Partially</Option>
                                    <Option value="Partially Billed">Fully</Option>
                                    <Option value="Billed">Not Paid</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="SEARCH RO/INVOICE NO" name="searchText" style={{ marginBottom: '8px' }} form={searchForm} onFinish={onSearch}>
                                <Input.Search
                                    placeholder="Search..."
                                    disabled={loading}
                                    onSearch={searchForm.submit}
                                    enterButton
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[8, 4]}>
                        <Col span={8}>
                            <Form.Item label="FROM DATE" name="fromDate" style={{ marginBottom: '8px' }}>
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="TO DATE" name="toDate" style={{ marginBottom: '8px' }}>
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify="start" gutter={16}>
                        <Col>
                            <Button type="primary" style={{ backgroundColor: '#7fdbff', color: '#000' }}  htmlType="submit" icon={<SearchOutlined />}>
                                SHOW
                            </Button>
                        </Col>
                        <Col>
                            <Button danger type="primary"  onClick={onResetSearch} icon={<RedoOutlined />}>
                                RESET
                            </Button>
                        </Col>
                        <Col>
                            <Button type="primary" onClick={() => navigate('/p-media/pMediaROMaster')}>
                                Add New RO
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>

            <Card title="RO Records" style={{ maxWidth: 1200, margin: '24px auto'}}>
                <div style={{ padding: "16px 16px 0 16px" }}>
                    <Text type="danger" style={{ fontSize: 16 }}>
                        Total records: {dataSource.length}
                    </Text>
                </div>

                <Table
                    className="striped-table"
                    columns={columns}
                    dataSource={dataSource}
                    rowKey="key" // Ensure this matches the key in dataSource
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

export default PMediaROList;