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
                                onClick={() => navigate(`/pmedia/pmediaROMaster/${record.key}`)}
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
                           onClick={() => navigate(`/pmedia/pmediaROPrint/${record.key}`)}
                        />
                        {/* <Button
                            size="small"
                            icon={<DollarOutlined />}
                            style={{ background: '#be185d', color: '#fff' }}
                            onClick={() => {
                                setSelectedInvoice(record); // Set the selected invoice
                                setIsPaymentModalVisible(true); // Open the modal
                            }}
                        /> */}
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
        { title: 'Invoice No', dataIndex: 'invoiceNo', key: 'invoiceNo', width: 80 },
        { title: 'Client', dataIndex: 'clientid', key: 'clientid', width: 120 },
        { title: 'Paper', dataIndex: 'pmediaid', key: 'pmediaid', width: 120 },
        { title: 'Editions', dataIndex: 'editions', key: 'editions', width: 120 },
        { title: 'RO Amount', dataIndex: 'robillamount', key: 'robillamount', width: 80 },
        { title: 'Invoice Count', dataIndex: 'invoiceCount', key: 'invoiceCount', width: 120 },
        { title: 'Discount', dataIndex: 'discount', key: 'discount', width: 80 },
        { title: 'GST%', dataIndex: 'gstPercent', key: 'gstPercent', width: 80 },
        { title: 'Invoice Amount', dataIndex: 'billAmount', key: 'billAmount', width: 100 },
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
            axios.get("http://localhost:8081/pmedias"),
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
            .then((res) => {
                console.log("Fetched RO Data:", res.data.data); // Log the fetched data
                if (res.data && Array.isArray(res.data.data)) {
                    const formattedData = res.data.data.map((ro) => {
                        console.log("Processing RO:", ro); // Log each RO being processed
                        return {
                            key: ro._id,
                            rono: ro.rono,
                            rodate: ro.rodate ? dayjs(ro.rodate).format('DD/MM/YYYY') : null,
                            clientid: clientsList.find(c => c.value === ro.clientid)?.label || ro.clientid,
                            pmediaid: pmediasList.find(e => e.value === ro.pmediaid)?.label || ro.pmediaid,
                            editions: ro.editions || "N/A", // Add editions field
                            amount: ro.amount,
                            discount: ro.discount,
                            gstPercent: ro.gstPercent,
                            robillamount: ro.robillamount,
                            paid: ro.paid,
                            remaining: ro.remaining,
                        };
                    });
                    console.log("Formatted Data:", formattedData); // Log the formatted data
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
            loadROData(pmedias, clients); // pass freshly loaded data
        });
    }, []);


    return (
        <main id="main" className="main">
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
                style={{ maxWidth: 1200, margin: '0 auto', padding: '12px', backgroundColor: "#f5f5f5" }}
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
                            <Form.Item label="SEARCH RO/INVOICE NO" name="searchText" style={{ marginBottom: '8px' }}>
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
                            <Button type="primary" onClick={() => navigate('/pmedia/pmediaROMaster')}>
                                Add New RO
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>

            <Card title="RO Records" style={{ maxWidth: 1200, margin: '24px auto', backgroundColor: "#f5f5f5" }}>
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