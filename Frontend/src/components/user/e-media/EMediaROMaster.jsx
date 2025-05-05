import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card, Form, Row, Col, Input, Button, Table, Select, DatePicker, Divider, message, TimePicker } from 'antd';
import { SaveOutlined, PrinterOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

function EMediaROMaster() {
    const agency = JSON.parse(localStorage.getItem("agency")) || null;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [items, setItems] = useState([
        {
            key: Date.now(),
            fromToDate: '',
            days: 0,
            fromTime: '10:00 AM',
            toTime: '11:00 AM',
            dailySpots: 0,
            totalSpots: 0,
            bonusPaid: 'Bonus',
            caption: ' Caption',
            charges: '',
            duration: '',
            totalCharges: ''
        },
        {
            key: Date.now() + 1,
            fromToDate: '',
            days: 0,
            fromTime: '10:00 AM',
            toTime: '11:00 AM',
            dailySpots: 0,
            totalSpots: 0,
            bonusPaid: 'Bonus',
            caption: ' Caption',
            charges: '',
            duration: '',
            totalCharges: ''
        }
    ]);
    const { RangePicker } = DatePicker;
    const [roNoExists, setRoNoExists] = useState(false);
    const [emedias, setEmedias] = useState([]);
    const [clients, setClients] = useState([]);

    const [data, setData] = useState({
        agencyid: agency?._id,
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

    function handleSave(values) {
        const payload = { ...data, ...values };
        if (isEditMode) {
            axios
                .put(`http://localhost:8081/emediaros/${data.id}`, payload)
                .then(() => {
                    message.success("RO updated successfully");
                    loadData();
                    setIsEditMode(false);
                })
                .catch((err) => {
                    console.error("Error updating ro:", err);
                    message.error("Update failed");
                });
        } else {
            axios
                .post("http://localhost:8081/emediaros", payload)
                .then(() => {
                    message.success("RO added successfully");
                    loadData();
                })
                .catch((err) => {
                    console.error("Error adding ro:", err);
                    message.error("Save failed");
                });
        }
    }
    

    const handleCancel = () => {

    }

    const handleRONoChange = (e) => {
        const value = e.target.value;
        setData((prev) => ({ ...prev, roNo: value }));
        form.setFieldsValue({ roNo: value });
    };

    const columns = [
        {
            title: "Sr. No",
            key: "sr",
            render: (_, __, index) => index + 1,
        },
        {
            title: "From-To Date",
            dataIndex: "fromToDate",
            key: "fromToDate",
            render: () => (
                <RangePicker
                    format="DD/MM/YYYY"
                    style={{ width: '100%', backgroundColor: '#d1c4e9 ', borderColor: '#9b59b6' }}
                    onChange={(dates, dateStrings) => {
                        console.log("Selected Dates:", dates);
                        console.log("Formatted Strings:", dateStrings);
                    }}
                />
            ),
        },
        {
            title: 'Days',
            dataIndex: 'days',
            key: 'days',
            render: (text, record) => <Input   />,
        },
        {
            title: "From Time",
            key: "fromTime",
            render: () => (
                <TimePicker
                    use12Hours
                    format="h:mm A"
                    defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
                />
            ),
        },
        {
            title: "To Time",
            render: () => (
                <TimePicker
                    use12Hours
                    format="h:mm A"
                    defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
                />
            ),
        },
        {
            title: "Daily Spots",
            render: (text, record) => <Input   />,
        },
        {
            title: "Total Spots",
            render: (text, record) => <Input   />,
        },
        {
            title: "Paid/Bonus",
            render: (text, record) => (
                <Select
                    showSearch
                    allowClear
                    placeholder="Select"
                    disabled={loading}
                    style={{ width: '100%' }}
                    options={payOptions}
                    filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                    }
                />
            ),
        },
        {
            title: "Caption",
            render: (text, record) => <Input   />,
        },
        {
            title: "Charges(10sec)",
            render: (text, record) => <Input   />,
        },
        {
            title: "Duration(in sec)",
            render: (text, record) => <Input   />,
        },
        {
            title: "Total Charges",
            render: (text, record) => <Input   />,
        }
    ];

    const languageOptions = [
        { label: 'Marathi', value: 'marathi' },
        { label: 'Hindi', value: 'hindi' },
        { label: 'English', value: 'english' },
        { label: 'Kannada', value: 'kannada' },
    ]

    const payOptions = [
        { label: 'Paid', value: 'paid' },
        { label: 'Bonus', value: 'bonus' },
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
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <main id="main" className="main" style={{ backgroundColor: "#f5f5f5", padding: 20 }}>
            <div className="pagetitle">
                <h1>E-Media RO Master</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to={"/"}>E-Media</Link>
                        </li>
                        <li className="breadcrumb-item active">Master Form</li>
                    </ol>
                </nav>
            </div>

            <Card title="" >
                <Form form={form} layout="vertical" onFinish={handleSave} >
                    <Row gutter={[8, 4]}>
                        <Col span={8}>
                            <Form.Item
                                label="RO No"
                                name="roNo"
                                style={{ marginBottom: '8px' }}
                                rules={[
                                    { required: true, message: 'Please enter ro number' },
                                    { pattern: /^[0-9]+$/, message: 'RO number should contain only numbers' }
                                ]}
                                validateStatus={roNoExists ? 'error' : ''}
                                help={roNoExists ? 'RO number already exists' : ''}
                            >
                                <Input onChange={handleRONoChange} 
                                placeholder="Enter ro number" 
                                style={{ width: '200px' }}
                                value={data.rono} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="RO Date" name="roDate" rules={[{ required: true }]} style={{ marginBottom: '8px' }}>
                                <DatePicker style={{ width: "50%" }} format="DD/MM/YYYY" value={data.rodate} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="client" label="Client" rules={[{ required: true }]} style={{ marginBottom: '8px' }}>
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder="Select Client"
                                    disabled={loading}
                                    style={{ width: '200px' }}
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
                            <Form.Item label="Media Bill No" name="billNo"  style={{ marginBottom: '8px' }}>
                                <Input placeholder="Enter media bill number" style={{ width: '200px' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Media Bill Amount" name="billAmount"  style={{ marginBottom: '8px' }}>
                                <Input placeholder="Enter media bill amount" style={{ width: '200px' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="publication" label="Publication" rules={[{ required: true }]} style={{ marginBottom: '8px' }}>
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder="Select"
                                    disabled={loading}
                                    style={{ width: '200px' }}
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
                            <Form.Item label="Broadcast Center" name="broadcastName" rules={[{ required: true }]} style={{ marginBottom: '8px' }}>
                                <Input style={{ width: '200px' }} value={data.centers}/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Caption" name="caption" rules={[{ required: true }]} style={{ marginBottom: '8px' }}>
                                <Input style={{ width: '200px' }} value={data.caption}/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="language" label="Language" rules={[{ required: true }]} style={{ marginBottom: '8px' }}>
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder="Select"
                                    disabled={loading}
                                    style={{ width: '200px' }}
                                    options={languageOptions}
                                    value={data.language}
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().includes(input.toLowerCase())
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider />

                    <Table columns={columns} dataSource={items} pagination={false} rowKey="key" bordered  
                    scroll={{ x: 'max-content'}}
                    />

                    <Row gutter={[8, 4]}>
                        <Col span={4}>
                            <Form.Item label="Total Spots" name="totalspots" rules={[{ required: true }]} style={{ marginBottom: '8px' }}>
                                <Input style={{ width: '100px' }} placeholder='spot'/>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="Total Charges" name="totalCharges" rules={[{ required: true }]} style={{ marginBottom: '8px' }}>
                                <Input style={{ width: '100px' }} />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="Comission(%)" name="comission" rules={[{ required: true }]} style={{ marginBottom: '8px' }}>
                                <Input style={{ width: '100px', backgroundColor: '#f48fb1', borderColor: '#9b59b6' }} />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="Comission Amount" name="comissionAmount" rules={[{ required: true }]} style={{ marginBottom: '8px' }}>
                                <Input style={{ width: '100px' }} />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name="gstType" label="GST Tax Type" rules={[{ required: true }]} style={{ marginBottom: '8px', backgroundColor: '#f48fb1', borderColor: '#9b59b6' }}>
                                <Select
                                    placeholder="Select "
                                    style={{ width: '250px' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row><br />

                    <Row gutter={[8, 4]}>
                        <Col span={4}>
                            <Form.Item label="CGST %" name="cgst" rules={[{ required: true }]} style={{ marginBottom: '8px' }}>
                                <Input style={{ width: '100px', backgroundColor: '#d1c4e9 ', borderColor: '#9b59b6' }} />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="CGST Amount" name="cgstAmount" rules={[{ required: true }]} style={{ marginBottom: '8px' }}>
                                <Input style={{ width: '100px' }} />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="SGST %" name="sgst" rules={[{ required: true }]} style={{ marginBottom: '8px' }}>
                                <Input style={{ width: '100px', backgroundColor: '#d1c4e9 ', borderColor: '#9b59b6' }} />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="SGST Amount" name="sgstAmount" rules={[{ required: true }]} style={{ marginBottom: '8px' }}>
                                <Input style={{ width: '100px' }} />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="IGST %" name="igst" rules={[{ required: true }]} style={{ marginBottom: '8px' }}>
                                <Input style={{ width: '100px', backgroundColor: '#d1c4e9 ', borderColor: '#9b59b6' }} />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="IGST Amount" name="igstAmount" rules={[{ required: true }]} style={{ marginBottom: '8px' }}>
                                <Input style={{ width: '100px' }} />
                            </Form.Item>
                        </Col>
                    </Row><br />

                    <Row gutter={[8, 4]}>
                        <Col span={4}>
                            <Form.Item label="Cheque No" name="chequeNo" rules={[{ required: true }]} style={{ marginBottom: '8px' }}>
                                <Input style={{ width: '150px', backgroundColor: '#f48fb1 ', borderColor: '#9b59b6' }} />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="Cheque Date" name="chequeDate" rules={[{ required: true }]} style={{ marginBottom: '8px' }}>
                                <DatePicker style={{ width: "100%", backgroundColor: '#f48fb1 ', borderColor: '#9b59b6' }} format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="bankName" label="Bank Name" rules={[{ required: true }]} style={{ marginBottom: '8px' }}>
                                <Input
                                    placeholder="Select "
                                    style={{ width: '400px', backgroundColor: '#f48fb1', borderColor: '#9b59b6' }}
                                />
                            </Form.Item>
                        </Col><br />
                    </Row><br />

                    <Row gutter={[8, 4]}>
                        <Col span={6}>
                            <Form.Item
                                label="RO Bill Amount"
                                name="roBillAmount"
                                rules={[{ required: true }]}
                                style={{ marginBottom: '8px' }}
                            >
                                <Input style={{ width: '100%', backgroundColor: '#d1c4e9 ', borderColor: '#9b59b6' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Instructions"
                                name="instructions"
                                rules={[{ required: true }]}
                                style={{ marginBottom: '8px' }}
                            >
                                <Input.TextArea style={{ width: '100%', backgroundColor: '#d1c4e9 ', borderColor: '#9b59b6' }} rows={1} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify="center" gutter={16}>
                        <Col>
                            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                                {isEditMode ? "Update" : "Save"}
                            </Button>
                        </Col>
                        <Col>
                            <Button type="default" icon={<PrinterOutlined />} onClick={handleCancel}>
                                Print
                            </Button>
                        </Col>
                        <Col>
                            <Button type="default" danger icon={<CloseOutlined />} onClick={handleCancel}>
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </main>
    )
}

export default EMediaROMaster;