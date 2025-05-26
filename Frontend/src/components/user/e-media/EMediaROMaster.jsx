import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card, Form, Row, Col, Input, Button, Table, Select, DatePicker, Divider, message, TimePicker } from 'antd';
import { SaveOutlined, PrinterOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import dayjs from 'dayjs';

function EMediaROMaster() {
    const { id } = useParams();
    const agency = JSON.parse(localStorage.getItem("agency")) || null;
    const agencyid = agency?._id;
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [items, setItems] = useState([
        {
            key: Date.now(),
            fromToDate: null,
            days: 0,
            fromTime: moment('10:00', 'HH:mm'),
            toTime: moment('11:00', 'HH:mm'),
            dailySpots: 0,
            totalSpots: 0,
            bonusPaid: '',
            caption: '',
            charges: '',
            duration: '',
            totalCharges: ''
        },
    ]);
    const [roNoExists, setRoNoExists] = useState(false);
    const [emedias, setEmedias] = useState([]);
    const [clients, setClients] = useState([]);
    const [gsts, setGsts] = useState([]);
    const { RangePicker } = DatePicker;
    const [data, setData] = useState({
        agencyid: agency?._id,
        rono: { type: Number },
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
        cgstpercent: 0, // CGST percentage
        cgstamount: 0,
        sgstpercent: 0, // CGST percentage
        sgstamount: 0,
        igstpercent: 0, // CGST percentage
        igstamount: 0,
    });

    const languageOptions = [
        { label: 'Marathi', value: 'marathi' },
        { label: 'Hindi', value: 'hindi' },
        { label: 'English', value: 'english' },
        { label: 'Kannada', value: 'kannada' },
    ];

    const payOptions = [
        { label: 'Paid', value: 'paid' },
        { label: 'Bonus', value: 'bonus' },
    ];

    const handleAddRow = () => {
        const newItem = {
            key: Date.now(),
            fromToDate: null,
            days: 0,
            fromTime: moment('10:00', 'HH:mm'),
            toTime: moment('11:00', 'HH:mm'),
            dailySpots: 0,
            totalSpots: 0,
            bonusPaid: '',
            caption: '',
            charges: '',
            duration: '',
            totalCharges: ''
        };
        setItems([...items, newItem]);
    };

    const handleItemChange = (key, field, value) => {
        setItems(prevItems =>
            prevItems.map(item => {
                if (item.key === key) {
                    const updatedItem = { ...item, [field]: value };
                    console.log(updatedItem);


                    // Automatically update 'days' when 'fromToDate' is selected
                    if (field === 'fromToDate' && value && value[0] && value[1]) {
                        const start = dayjs(value[0]);
                        const end = dayjs(value[1]);
                        const diff = end.diff(start, 'day') + 1; // +1 to include both start & end
                        updatedItem.days = diff;

                        // Recalculate totalSpots when days changes
                        if (updatedItem.dailySpots) {
                            updatedItem.totalSpots = updatedItem.days * updatedItem.dailySpots;
                        }
                    }

                    // Recalculate totalSpots when dailySpots changes
                    if (field === 'dailySpots') {
                        updatedItem.totalSpots = (updatedItem.days || 0) * (value || 0);
                    };

                    // When bonus/paid changes to "bonus", set charges to 0 and make read-only
                    if (field === 'bonusPaid') {
                        if (value === 'bonus') {
                            updatedItem.charges = '0';
                            updatedItem.totalCharges = '0';
                        }
                    }

                    // Calculate total charges when charges, duration, or totalSpots change
                    if (field === 'charges' || field === 'duration' || field === 'totalSpots') {
                        const charges = parseFloat(updatedItem.charges) || 0;
                        const duration = parseFloat(updatedItem.duration) || 0;
                        const totalSpots = parseFloat(updatedItem.totalSpots) || 0;


                        // Calculate: (charges/10) * duration * totalSpots
                        updatedItem.totalCharges = ((charges / 10) * duration * totalSpots).toFixed(2);

                    }

                    return updatedItem;
                }
                return item;
            })
        );
    };

    const calculateTotalSpots = () => {
        return items.reduce((sum, item) => sum + (item.totalSpots || 0), 0);
    };

    const calculateTotalCharges = () => {
        return items.reduce((sum, item) => sum + (parseFloat(item.totalCharges) || 0), 0).toFixed(2);
    };

    const calculateCommissionAmount = () => {
        const commissionPercent = parseFloat(form.getFieldValue('comissionpercent')) || 0;
        const totalCharges = parseFloat(calculateTotalCharges()) || 0;
        return ((commissionPercent / 100) * totalCharges).toFixed(2);
    };

    const calculateROBillAmount = (includeGst = false) => {
        const totalCharges = parseFloat(calculateTotalCharges()) || 0;
        const commissionAmount = parseFloat(calculateCommissionAmount()) || 0;

        console.log(totalCharges);
        console.log(commissionAmount);

        let robillamount = (totalCharges - commissionAmount).toFixed(2);

        // Only apply GST if explicitly requested and GST type is selected
        if (includeGst && data.gstid) {
            const selectedGst = gsts.find(gst => gst.value === data.gstid);
            if (selectedGst) {
                const gstAmount = (parseFloat(robillamount) *
                    (selectedGst.cgstpercent + selectedGst.sgstpercent + selectedGst.igstpercent) / 100);
                robillamount = (parseFloat(robillamount) + parseFloat(gstAmount)).toFixed(2);
            }
        }

        form.setFieldsValue({ robillamount });
        return robillamount;
    };

    const handleGstTypeChange = (value) => {
        const selectedGst = gsts.find((gst) => gst.value === value);
        if (!selectedGst) return;

        // Get RO bill amount before GST
        const robillamountBeforeGst = calculateROBillAmount(false);
        console.log(robillamountBeforeGst);


        // Calculate GST amounts
        const cgstAmount = (robillamountBeforeGst * selectedGst.cgstpercent / 100).toFixed(2);
        const sgstAmount = (robillamountBeforeGst * selectedGst.sgstpercent / 100).toFixed(2);
        const igstAmount = (robillamountBeforeGst * selectedGst.igstpercent / 100).toFixed(2);

        // Update state and form values
        setData((prev) => ({
            ...prev,
            gstid: value,
            cgstpercent: selectedGst.cgstpercent,
            sgstpercent: selectedGst.sgstpercent,
            igstpercent: selectedGst.igstpercent,
            cgstamount: cgstAmount,
            sgstamount: sgstAmount,
            igstamount: igstAmount
        }));

        form.setFieldsValue({
            gstid: value,
            cgstpercent: selectedGst.cgstpercent,
            sgstpercent: selectedGst.sgstpercent,
            igstpercent: selectedGst.igstpercent,
            cgstamount: cgstAmount,
            sgstamount: sgstAmount,
            igstamount: igstAmount
        });

        // Calculate and set final RO bill amount with GST
        const finalAmount = (parseFloat(robillamountBeforeGst) +
            parseFloat(cgstAmount) +
            parseFloat(sgstAmount) +
            parseFloat(igstAmount));
        form.setFieldsValue({ robillamount: finalAmount.toFixed(2) });
    };

    const handleSave = async (values) => {
        try {
            setLoading(true);

            // Recalculate everything before saving
            const totalCharges = parseFloat(calculateTotalCharges()) || 0;
            const commissionAmount = parseFloat(calculateCommissionAmount()) || 0;
            let robillamount = (totalCharges - commissionAmount).toFixed(2);

            // Apply GST if selected
            if (values.gstid) {
                const selectedGst = gsts.find(gst => gst.value === values.gstid);
                if (selectedGst) {
                    const gstAmount = (parseFloat(robillamount) *
                        (selectedGst.cgstpercent + selectedGst.sgstpercent + selectedGst.igstpercent) / 100);
                    robillamount = (parseFloat(robillamount) + parseFloat(gstAmount)).toFixed(2);
                }
            }

            const payload = {
                ...values,
                totalspots: calculateTotalSpots(),
                totalcharges: totalCharges,
                comissionamount: commissionAmount,
                robillamount: robillamount,
                rodate: values.rodate ? dayjs(values.rodate).format('YYYY-MM-DD') : null,
                chequedate: values.chequedate ? dayjs(values.chequedate).format('YYYY-MM-DD') : null,
                items: items.map(item => ({
                    ...item,
                    fromToDate: item.fromToDate ? [
                        dayjs(item.fromToDate[0]).format('YYYY-MM-DD'),
                        dayjs(item.fromToDate[1]).format('YYYY-MM-DD')
                    ] : null,
                    fromTime: item.fromTime ? dayjs(item.fromTime).format('HH:mm:ss') : null,
                    toTime: item.toTime ? dayjs(item.toTime).format('HH:mm:ss') : null,
                    totalCharges: item.totalCharges || 0
                })),
                agencyid: agencyid,
                status: "active"
            };

            const response = isEditMode
                ? await axios.put(`http://localhost:8081/emediaros/${id}`, payload)
                : await axios.post('http://localhost:8081/emediaros', payload);

            message.success(`Record ${isEditMode ? 'updated' : 'created'} successfully`);
            navigate("/emedia/emediaROList");

        } catch (err) {
            console.error('Save error:', err);
            message.error(err.response?.data?.message || 'Failed to save record');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate("/emedia/emediaROList");
    };

    const handleRONoChange = (e) => {
        const value = e.target.value;
        form.setFieldsValue({ rono: value });
    };

    const columns = [
        {
            title: "Sr. No",
            key: "sr",
            width: 80,
            render: (_, __, index) => index + 1,
        },
        {
            title: "From-To Date",
            dataIndex: "fromToDate",
            key: "fromToDate",
            width: 250,
            render: (_, record) => (
                <RangePicker
                    format="DD/MM/YYYY"
                    style={{ width: '100%', backgroundColor: '#f48fb1', borderColor: '#9b59b6' }}
                    value={record.fromToDate}
                    onChange={(dates) => handleItemChange(record.key, 'fromToDate', dates)}
                />
            ),
        },
        {
            title: 'Days',
            dataIndex: 'days',
            key: 'days',
            width: 130,
            render: (text, record) => (
                <Input
                    value={text}
                    readOnly
                    style={{ width: '100%', backgroundColor: '#d1c4e9', borderColor: '#9b59b6' }}
                />
            ),
        },
        {
            title: "From Time",
            dataIndex: "fromTime",
            key: "fromTime",
            width: 150,
            render: (text, record) => (
                <TimePicker
                    use12Hours
                    format="h:mm A"
                    value={text}
                    onChange={(time) => handleItemChange(record.key, 'fromTime', time)}
                />
            ),
        },
        {
            title: "To Time",
            dataIndex: "toTime",
            key: "toTime",
            width: 150,
            render: (text, record) => (
                <TimePicker
                    use12Hours
                    format="h:mm A"
                    value={text}
                    onChange={(time) => handleItemChange(record.key, 'toTime', time)}
                />
            ),
        },
        {
            title: "Daily Spots",
            dataIndex: "dailySpots",
            key: "dailySpots",
            width: 140,
            render: (text, record) => (
                <Input
                    value={text}
                    onChange={(e) => handleItemChange(record.key, 'dailySpots', e.target.value)}
                />
            ),
        },
        {
            title: "Total Spots",
            dataIndex: "totalSpots",
            key: "totalSpots",
            width: 140,
            render: (text, record) => (
                <Input
                    value={text}
                    readOnly
                    style={{ width: '100%', backgroundColor: '#d1c4e9', borderColor: '#9b59b6' }}
                />
            ),
        },
        {
            title: "Paid/Bonus",
            placeholder: "Select",
            dataIndex: "bonusPaid",
            key: "bonusPaid",
            width: 140,
            render: (text, record) => (
                <Select
                    value={text}
                    style={{ width: '100%' }}
                    options={payOptions}
                    onChange={(value) => handleItemChange(record.key, 'bonusPaid', value)}
                />
            ),
        },
        {
            title: "Caption",
            dataIndex: "caption",
            key: "caption",
            placeholder: "Caption",
            render: (text, record) => (
                <Input
                    value={text}
                    onChange={(e) => handleItemChange(record.key, 'caption', e.target.value)}
                />
            ),
        },
        {
            title: "Charges(10sec)",
            dataIndex: "charges",
            key: "charges",
            width: 140,
            render: (text, record) => (
                <Input
                    value={text}
                    onChange={(e) => handleItemChange(record.key, 'charges', e.target.value)}
                    readOnly={record.bonusPaid === 'bonus'}
                    style={{
                        backgroundColor: record.bonusPaid === 'bonus' ? '#f0f0f0' : 'inherit',
                        borderColor: record.bonusPaid === 'bonus' ? '#d9d9d9' : 'inherit'
                    }}
                />
            ),
        },
        {
            title: "Duration(in sec)",
            dataIndex: "duration",
            key: "duration",
            width: 140,
            render: (text, record) => (
                <Input
                    value={text}
                    onChange={(e) => handleItemChange(record.key, 'duration', e.target.value)}
                />
            ),
        },
        {
            title: "Total Charges",
            dataIndex: "totalCharges",
            key: "totalCharges",
            width: 140,
            render: (text, record) => (
                <Input
                    value={text}
                    readOnly
                    style={{ width: '100%', backgroundColor: '#d1c4e9', borderColor: '#9b59b6' }}
                />
            ),
        }
    ];

    function loadData() {
        axios.get("http://localhost:8081/emedias")
            .then((res) => {
                if (res.data && Array.isArray(res.data.data)) {
                    setEmedias(
                        res.data.data.map((emedia) => ({
                            label: emedia.name,
                            value: emedia._id,
                        }))
                    );
                }
            })
            .catch((err) => {
                console.error("Error fetching emedia:", err);
            });

        axios.get(`http://localhost:8081/clients/${agency._id}`)
            .then((res) => {
                if (res.data && Array.isArray(res.data.data)) {
                    setClients(
                        res.data.data.map((client) => ({
                            label: client.name,
                            value: client._id,
                        }))
                    );
                }
            })
            .catch((err) => {
                console.error("Error fetching clients:", err);
            });

        axios.get("http://localhost:8081/gsts")
            .then((res) => {
                if (res.data && Array.isArray(res.data.data)) {
                    setGsts(
                        res.data.data.map((gst) => ({
                            label: gst.title,
                            value: gst._id,
                            cgstpercent: gst.cgstpercent,
                            sgstpercent: gst.sgstpercent,
                            igstpercent: gst.igstpercent
                        }))
                    );
                }
            })
            .catch((err) => {
                console.error("Error fetching gsts:", err);
            });
    };

    useEffect(() => {
        loadData();
        if (id) {
            setIsEditMode(true);
            axios.get(`http://localhost:8081/emediaros/${id}`)
                .then(res => {
                    const data = res.data.data;
                    console.log(data);

                    if (data) {
                        // Normalize language value
                        let languageValue = data.language;
                        if (languageValue) {
                            const found = languageOptions.find(
                                opt =>
                                    opt.label.toLowerCase() === languageValue.toLowerCase() ||
                                    opt.value === languageValue.toLowerCase()
                            );
                            languageValue = found ? found.value : undefined;
                        }
                        form.setFieldsValue({
                            ...data,
                            language: languageValue,
                            rodate: data.rodate ? moment(data.rodate) : null,
                            chequedate: data.chequedate ? moment(data.chequedate) : null,
                            cgstpercent: data.cgstpercent || 0,
                            sgstpercent: data.sgstpercent || 0,
                            igstpercent: data.igstpercent || 0,
                            cgstamount: data.cgstamount || 0,
                            sgstamount: data.sgstamount || 0,
                            igstamount: data.igstamount || 0,
                            clientid: data.clientid?._id || null,
                            emediaid: data.emediaid?._id || null,
                            gstid: data.gstid?._id || null,
                        });

                        setData(prev => ({
                            ...prev,
                            cgstpercent: data.cgstpercent || 0,
                            sgstpercent: data.sgstpercent || 0,
                            igstpercent: data.igstpercent || 0
                        }));
                        if (data.items) {
                            setItems(data.items.map(item => ({
                                ...item,
                                fromToDate: item.fromToDate ? [
                                    moment(item.fromToDate[0]),
                                    moment(item.fromToDate[1])
                                ] : null,
                                fromTime: item.fromTime ? moment(item.fromTime, 'HH:mm:ss') : null,
                                toTime: item.toTime ? moment(item.toTime, 'HH:mm:ss') : null
                            })));
                        }
                    }
                })
                .catch(err => console.error('Error fetching RO data:', err));
        }
    }, [id, form]);

    useEffect(() => {
        const totalCharges = parseFloat(calculateTotalCharges()) || 0;
        const commissionAmount = parseFloat(calculateCommissionAmount()) || 0;
        const robillamountBeforeGst = (totalCharges - commissionAmount).toFixed(2);

        // Only calculate GST if GST type is selected
        if (data.gstid) {
            const selectedGst = gsts.find(gst => gst.value === data.gstid);
            if (selectedGst) {
                const cgstAmount = (robillamountBeforeGst * selectedGst.cgstpercent / 100).toFixed(2);
                const sgstAmount = (robillamountBeforeGst * selectedGst.sgstpercent / 100).toFixed(2);
                const igstAmount = (robillamountBeforeGst * selectedGst.igstpercent / 100).toFixed(2);

                form.setFieldsValue({
                    cgstamount: cgstAmount,
                    sgstamount: sgstAmount,
                    igstamount: igstAmount
                });

                // Calculate final amount with GST
                const finalAmount = (parseFloat(robillamountBeforeGst) +
                    parseFloat(cgstAmount) +
                    parseFloat(sgstAmount) +
                    parseFloat(igstAmount));
                form.setFieldsValue({ robillamount: finalAmount.toFixed(2) });
            }
        } else {
            // If no GST selected, just show amount before GST
            form.setFieldsValue({ robillamount: robillamountBeforeGst });
        }

        form.setFieldsValue({
            totalspots: calculateTotalSpots(),
            totalcharges: totalCharges,
            comissionamount: commissionAmount
        });
    }, [items, form.getFieldValue('comissionpercent'), data.gstid]);

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

            <Card title="">
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Row gutter={[8, 4]}>
                        <Col span={8}>
                            <Form.Item
                                label="RO No"
                                name="rono"
                                style={{ marginBottom: '8px' }}
                                rules={[
                                    { required: true, message: 'Please enter ro number' },
                                    { pattern: /^[0-9]+$/, message: 'RO number should contain only numbers' }
                                ]}
                                validateStatus={roNoExists ? 'error' : ''}
                                help={roNoExists ? 'RO number already exists' : ''}
                            >
                                <Input onChange={handleRONoChange} placeholder="Enter ro number" style={{ width: '200px' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="RO Date" name="rodate" style={{ marginBottom: '8px' }}>
                                <DatePicker style={{ width: "50%", backgroundColor: '#f48fb1', borderColor: '#9b59b6' }} format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Client" name="clientid" style={{ marginBottom: '8px' }}>
                               
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder="Select Client"
                                    disabled={loading}
                                    style={{ width: '200px' }}
                                    options={clients}
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().includes(input.toLowerCase())
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Media Bill No" name="mediabillno" style={{ marginBottom: '8px' }}>
                                <Input placeholder="Enter media bill number" style={{ width: '200px' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Media Bill Amount" name="mediabillamount" style={{ marginBottom: '8px' }}>
                                <Input placeholder="Enter media bill amount" style={{ width: '200px' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Publication" name="emediaid" style={{ marginBottom: '8px' }}>
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder="Select"
                                    disabled={loading}
                                    style={{ width: '200px' }}
                                    options={emedias}
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().includes(input.toLowerCase())
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Broadcast Center" name="centers" style={{ marginBottom: '8px' }}>
                                <Input style={{ width: '200px' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Caption" name="caption" style={{ marginBottom: '8px' }}>
                                <Input style={{ width: '200px' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Language" name="language" style={{ marginBottom: '8px' }}>
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder="Select"
                                    disabled={loading}
                                    style={{ width: '200px' }}
                                    options={languageOptions}
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().includes(input.toLowerCase())
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider />

                    <Table
                        columns={columns}
                        dataSource={items}
                        pagination={false}
                        rowKey="key"
                        bordered
                        scroll={{ x: 'max-content' }}
                    />

                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        style={{ margin: "16px 0", float: "right" }}
                        onClick={handleAddRow}
                    >
                        Add Item
                    </Button><br /><br />

                    <Row gutter={[8, 4]}>
                        <Col span={5}>
                            <Form.Item label="Total Spots" name="totalspots" style={{ marginBottom: '8px' }}>
                                <Input style={{ width: '190px', backgroundColor: '#d1c4e9', borderColor: '#9b59b6' }} placeholder='spot' value={calculateTotalSpots()}
                                    readOnly />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Total Charges" name="totalcharges" style={{ marginBottom: '8px' }}>
                                <Input style={{ width: '180px', backgroundColor: '#d1c4e9', borderColor: '#9b59b6' }} value={calculateTotalCharges()} readOnly />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Comission(%)" name="comissionpercent" style={{ marginBottom: '8px' }}>
                                <Input style={{ width: '180px', backgroundColor: '#f48fb1', borderColor: '#9b59b6' }}
                                    onChange={() => {
                                        // Update commission amount when percentage changes
                                        // form.setFieldsValue({ comissionamount: calculateCommissionAmount() });
                                        const commissionAmount = calculateCommissionAmount();
                                        form.setFieldsValue({
                                            comissionamount: commissionAmount,
                                            // RO Bill Amount will be updated by calculateCommissionAmount
                                        });
                                        handleItemChange()

                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item label="Comission Amount" name="comissionamount" style={{ marginBottom: '8px' }}>
                                <Input style={{ width: '180px', backgroundColor: '#d1c4e9', borderColor: '#9b59b6' }} readOnly />
                            </Form.Item>
                        </Col>
                    </Row><br />

                    <Row gutter={[8, 4]}>
                        <Col span={5}>
                            <Form.Item label="GST Tax Type" name="gstid"
                                style={{ marginBottom: '8px', backgroundColor: '#f48fb1', borderColor: '#9b59b6', width: '200px' }}>
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder="Select"
                                    disabled={loading}
                                    style={{ width: '200px' }}
                                    options={gsts}
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().includes(input.toLowerCase())
                                    }
                                    onChange={handleGstTypeChange}
                                />
                            </Form.Item>
                            <Form.Item name="cgstpercent" hidden>
                                <Input />
                            </Form.Item>
                            <Form.Item name="sgstpercent" hidden>
                                <Input />
                            </Form.Item>
                            <Form.Item name="igstpercent" hidden>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item label={`CGST (${data.cgstpercent}%)`} name="cgstamount" style={{ marginBottom: '8px' }}>
                                <Input style={{ width: '180px', backgroundColor: '#d1c4e9', borderColor: '#9b59b8' }} />
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item label={`SGST (${data.sgstpercent}%)`} name="sgstamount" style={{ marginBottom: '8px' }}>
                                <Input style={{ width: '180px', backgroundColor: '#d1c4e9', borderColor: '#9b59b8' }} />
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item label={`IGST (${data.igstpercent}%)`} name="igstamount" style={{ marginBottom: '8px' }}>
                                <Input style={{ width: '180px', backgroundColor: '#d1c4e9', borderColor: '#9b59b6' }} />
                            </Form.Item>
                        </Col>
                    </Row><br />

                    <Row gutter={[8, 4]}>
                        <Col span={5}>
                            <Form.Item label="Cheque No" name="chequeno" style={{ marginBottom: '8px' }}>
                                <Input style={{ width: '170px' }} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Cheque Date" name="chequedate" style={{ marginBottom: '8px' }}>
                                <DatePicker style={{ width: "100%", backgroundColor: '#f48fb1', borderColor: '#9b59b6' }} format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                        <Col span={9}>
                            <Form.Item label="Bank Name" name="bankname" style={{ marginBottom: '8px' }}>
                                <Input placeholder="Select" style={{ width: '415px' }} />
                            </Form.Item>
                        </Col><br />
                    </Row><br />

                    <Row gutter={[8, 4]}>
                        <Col span={5}>
                            <Form.Item label="RO Bill Amount" name="robillamount" style={{ marginBottom: '8px' }}>
                                <Input style={{ width: '170px', backgroundColor: '#d1c4e9', borderColor: '#9b59b6' }} readOnly />
                            </Form.Item>
                        </Col>
                        <Col span={15}>
                            <Form.Item label="Instructions" name="instructions" style={{ marginBottom: '8px' }}>
                                <Input.TextArea style={{ width: '500%' }} rows={1} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify="center" gutter={16}>
                        <Col>
                            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                                {isEditMode ? "Update" : "Save"}
                            </Button>
                        </Col>
                        <Col>
                            <Button type="default" icon={<PrinterOutlined />} onClick={handleCancel}>
                                Print
                            </Button>
                        </Col>
                        <Col>
                            <Button type="primary" danger icon={<CloseOutlined />} onClick={handleCancel}>
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </main>
    );
}

export default EMediaROMaster;