// import React from 'react';
// import { Link, useNavigate, useParams } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import { Card, Form, Row, Col, Input, Button, Table, Select, DatePicker, Divider, message, TimePicker } from 'antd';
// import { SaveOutlined, PrinterOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
// import axios from 'axios';
// import moment from 'moment';

// function EMediaROMaster() {
//     const { id } = useParams();
//     const agency = JSON.parse(localStorage.getItem("agency")) || null;
//     const agencyid = agency?._id;
//     const [form] = Form.useForm();
//     const navigate = useNavigate();
//     const [loading, setLoading] = useState(false);
//     const [isEditMode, setIsEditMode] = useState(false);
//     const [items, setItems] = useState([
//         {
//             key: Date.now(),
//             fromToDate: '',
//             days: 0,
//             fromTime: '10:00 AM',
//             toTime: '11:00 AM',
//             dailySpots: 0,
//             totalSpots: 0,
//             bonusPaid: 'Bonus',
//             caption: ' Caption',
//             charges: '',
//             duration: '',
//             totalCharges: ''
//         },
//     ]);
//     const { RangePicker } = DatePicker;
//     const [roNoExists, setRoNoExists] = useState(false);
//     const [emedias, setEmedias] = useState([]);
//     const [clients, setClients] = useState([]);
//     const [gsts, setGsts] = useState([]);

//     const [data, setData] = useState({
//         agencyid: agency?._id,
//         rono: "",
//         rodate: "",
//         clientid: null,
//         emediaid: null,
//         centers: "",
//         language: "",
//         caption: "",
//         noofrecords: "",
//         totalspots: "",
//         totalcharges: "",
//         comissionpercent: "",
//         comissionamount: "",
//         chequeno: "",
//         chequedate: "",
//         bankname: "",
//         robillamount: "",
//         instructions: "",
//         gstid: null,
//         cgstpercent: "",
//         sgstpercent: "",
//         sgstamount: "",
//         igstpercent: "",
//         igstamount: "",
//         status: "",
//     });

//     const handleAddRow = () => {
//         const newItem = {
//             key: Date.now(),
//             fromToDate: '',
//             days: 0,
//             fromTime: '10:00 AM',
//             toTime: '11:00 AM',
//             dailySpots: 0,
//             totalSpots: 0,
//             bonusPaid: 'Bonus',
//             caption: ' Caption',
//             charges: '',
//             duration: '',
//             totalCharges: ''
//         };
//         setItems([...items, newItem]);
//     };

//     const handleSave = async (values) => {
//         try {
//             setLoading(true);

//             // Format dates and prepare complete payload
//             const payload = {
//                 ...data,
//                 // ...values,
//                 items: items.map(item => ({
//                     ...item,
//                     // Format any item dates if needed
//                 })),
//                 agencyid: agencyid,
//                 rodate: values.rodate ? moment(values.rodate).format('YYYY-MM-DD') : null,
//                 chequedate: values.chequedate ? moment(values.chequedate).format('YYYY-MM-DD') : null,
//                 status: "active"  // Ensure required fields have values
//             };

//             console.log('Final payload:', payload);
//             //   axios.post('http://localhost:8081/emediaros', payload)

//             const response = isEditMode
//                 ? await axios.put(`http://localhost:8081/emediaros/${data.id}`, payload)
//                 : await axios.post('http://localhost:8081/emediaros', payload);

//             console.log('Save successful:', response.data);
//             message.success(`Record ${isEditMode ? 'updated' : 'created'} successfully`);
//             navigate("/emedia/emediaROList");

//         } catch (err) {
//             console.error('Save error:', err);
//             message.error(err.response?.data?.message || 'Failed to save record');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleCancel = () => {
//         navigate("/emedia/emediaROList");
//     };

//     const handleRONoChange = (e) => {
//         const value = e.target.value;
//         setData((prev) => ({ ...prev, rono: value }));
//         form.setFieldsValue({ rono: value });
//     };

//     const columns = [
//         {
//             title: "Sr. No",
//             key: "sr",
//             width: 80,
//             render: (_, __, index) => index + 1,
//         },
//         {
//             title: "From-To Date",
//             dataIndex: "fromToDate",
//             key: "fromToDate",
//             width: 250,
//             render: () => (
//                 <RangePicker
//                     format="DD/MM/YYYY"
//                     style={{ width: '100%', backgroundColor: '#d1c4e9 ', borderColor: '#9b59b6' }}
//                     onChange={(dates, dateStrings) => {
//                         console.log("Selected Dates:", dates);
//                         console.log("Formatted Strings:", dateStrings);
//                     }}
//                 />
//             ),
//         },
//         {
//             title: 'Days',
//             dataIndex: 'days',
//             key: 'days',
//             width: 130,
//             render: (text, record) => <Input />,
//         },
//         {
//             title: "From Time",
//             key: "fromTime",
//             width: 150,
//             render: () => (
//                 <TimePicker
//                     use12Hours
//                     format="h:mm A"
//                     defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
//                 />
//             ),
//         },
//         {
//             title: "To Time",
//             width: 150,
//             render: () => (
//                 <TimePicker
//                     use12Hours
//                     format="h:mm A"
//                     defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
//                 />
//             ),
//         },
//         {
//             title: "Daily Spots",
//             width: 140,
//             render: (text, record) => <Input />,
//         },
//         {
//             title: "Total Spots",
//             width: 140,
//             render: (text, record) => <Input />,
//         },
//         {
//             title: "Paid/Bonus",
//             key: "bonusPaid",
//             width: 140,
//             render: (text, record) => (
//                 <Select
//                     showSearch
//                     allowClear
//                     placeholder="Select"
//                     disabled={loading}
//                     style={{ width: '100%' }}
//                     options={payOptions}
//                     filterOption={(input, option) =>
//                         option.label.toLowerCase().includes(input.toLowerCase())
//                     }
//                 />
//             ),
//         },
//         {
//             title: "Caption",
//             render: (text, record) => <Input />,
//         },
//         {
//             title: "Charges(10sec)",
//             width: 140,
//             render: (text, record) => <Input />,
//         },
//         {
//             title: "Duration(in sec)",
//             width: 140,
//             render: (text, record) => <Input />,
//         },
//         {
//             title: "Total Charges",
//             width: 140,
//             render: (text, record) => <Input />,
//         }
//     ];

//     const languageOptions = [
//         { label: 'Marathi', value: 'marathi' },
//         { label: 'Hindi', value: 'hindi' },
//         { label: 'English', value: 'english' },
//         { label: 'Kannada', value: 'kannada' },
//     ];

//     const payOptions = [
//         { label: 'Paid', value: 'paid' },
//         { label: 'Bonus', value: 'bonus' },
//     ];

//     function loadData() {
//         axios.get("http://localhost:8081/emedias")
//             .then((res) => {
//                 console.log("States API Response:", res.data.data); // Debugging
//                 if (res.data && Array.isArray(res.data.data)) {
//                     setEmedias(
//                         res.data.data.map((emedia) => ({
//                             label: emedia.name,
//                             value: emedia._id,
//                         }))
//                     );
//                 } else {
//                     console.error("Invalid emedias response:", res.data);
//                     setEmedias([]);
//                 }
//             })
//             .catch((err) => {
//                 console.error("Error fetching emedia:", err);
//                 setEmedias([]);
//             });

//         axios.get(`http://localhost:8081/clients/${agency._id}`)
//             // axios.get("http://localhost:8081/clients/67f6094704247221a4c16daf")
//             .then((res) => {
//                 console.log("States API Response:", res.data.data); // Debugging
//                 if (res.data && Array.isArray(res.data.data)) {
//                     setClients(
//                         res.data.data.map((client) => ({
//                             label: client.name,
//                             value: client._id,
//                         }))
//                     );
//                 } else {
//                     console.error("Invalid clients response:", res.data);
//                     setClients([]);
//                 }
//             })
//             .catch((err) => {
//                 console.error("Error fetching clients:", err);
//                 setClients([]);
//             });

//         axios.get("http://localhost:8081/gsts")
//             .then((res) => {
//                 console.log("States API Response:", res.data.data); // Debugging
//                 if (res.data && Array.isArray(res.data.data)) {
//                     setGsts(
//                         res.data.data.map((gst) => ({
//                             label: gst.title,
//                             value: gst._id,
//                         }))
//                     );
//                 } else {
//                     console.error("Invalid emedias response:", res.data);
//                     setGsts([]);
//                 }
//             })
//             .catch((err) => {
//                 console.error("Error fetching emedia:", err);
//                 setGsts([]);
//             });
//     };

//     useEffect(() => {
//         loadData();
//     }, []);

//     return (
//         <main id="main" className="main" style={{ backgroundColor: "#f5f5f5", padding: 20 }}>
//             <div className="pagetitle">
//                 <h1>E-Media RO Master</h1>
//                 <nav>
//                     <ol className="breadcrumb">
//                         <li className="breadcrumb-item">
//                             <Link to={"/"}>E-Media</Link>
//                         </li>
//                         <li className="breadcrumb-item active">Master Form</li>
//                     </ol>
//                 </nav>
//             </div>

//             <Card title="" >
//                 <Form form={form} layout="vertical" onFinish={handleSave} >
//                     <Row gutter={[8, 4]}>
//                         <Col span={8}>
//                             <Form.Item
//                                 label="RO No"
//                                 name="rono"
//                                 style={{ marginBottom: '8px' }}
//                                 rules={[
//                                     { required: true, message: 'Please enter ro number' },
//                                     { pattern: /^[0-9]+$/, message: 'RO number should contain only numbers' }
//                                 ]}
//                                 validateStatus={roNoExists ? 'error' : ''}
//                                 help={roNoExists ? 'RO number already exists' : ''}
//                             >
//                                 <Input onChange={handleRONoChange}
//                                     placeholder="Enter ro number"
//                                     style={{ width: '200px' }}
//                                     value={data.rono} />
//                             </Form.Item>
//                         </Col>
//                         <Col span={8}>
//                             <Form.Item label="RO Date" name="rodate" style={{ marginBottom: '8px' }}>
//                                 <DatePicker style={{ width: "50%" }} format="DD/MM/YYYY" value={data.rodate} />
//                             </Form.Item>
//                         </Col>
//                         <Col span={8}>
//                             <Form.Item label="Client" name="clientid" style={{ marginBottom: '8px' }}>
//                                 <Select
//                                     showSearch
//                                     allowClear
//                                     placeholder="Select Client"
//                                     disabled={loading}
//                                     style={{ width: '200px' }}
//                                     options={clients}
//                                     value={data.clientid}
//                                     onChange={(value) => setData({ ...data, clientid: value })}
//                                     filterOption={(input, option) =>
//                                         option.label.toLowerCase().includes(input.toLowerCase())
//                                     }
//                                 />
//                             </Form.Item>
//                         </Col>
//                         <Col span={8}>
//                             <Form.Item label="Media Bill No" name="billNo" style={{ marginBottom: '8px' }}>
//                                 <Input placeholder="Enter media bill number" style={{ width: '200px' }} />
//                             </Form.Item>
//                         </Col>
//                         <Col span={8}>
//                             <Form.Item label="Media Bill Amount" name="billAmount" style={{ marginBottom: '8px' }}>
//                                 <Input placeholder="Enter media bill amount" style={{ width: '200px' }} />
//                             </Form.Item>
//                         </Col>
//                         <Col span={8}>
//                             <Form.Item label="Publication" name="emediaid" style={{ marginBottom: '8px' }}>
//                                 <Select
//                                     showSearch
//                                     allowClear
//                                     placeholder="Select"
//                                     disabled={loading}
//                                     style={{ width: '200px' }}
//                                     options={emedias}  // ✅ Correct variable
//                                     value={data.emediaid}
//                                     filterOption={(input, option) =>
//                                         option.label.toLowerCase().includes(input.toLowerCase())
//                                     }
//                                     onChange={(value) => setData({ ...data, emediaid: value })}
//                                 />
//                             </Form.Item>
//                         </Col>
//                         <Col span={8}>
//                             <Form.Item label="Broadcast Center" name="centers" style={{ marginBottom: '8px' }}>
//                                 <Input style={{ width: '200px' }} value={data.centers} />
//                             </Form.Item>
//                         </Col>
//                         <Col span={8}>
//                             <Form.Item label="Caption" name="caption" style={{ marginBottom: '8px' }}>
//                                 <Input style={{ width: '200px' }} value={data.caption} />
//                             </Form.Item>
//                         </Col>
//                         <Col span={8}>
//                             <Form.Item label="Language" name="language" style={{ marginBottom: '8px' }}>
//                                 <Select
//                                     showSearch
//                                     allowClear
//                                     placeholder="Select"
//                                     disabled={loading}
//                                     style={{ width: '200px' }}
//                                     options={languageOptions}
//                                     value={data.language}
//                                     filterOption={(input, option) =>
//                                         option.label.toLowerCase().includes(input.toLowerCase())
//                                     }
//                                 />
//                             </Form.Item>
//                         </Col>
//                     </Row>

//                     <Divider />

//                     <Table columns={columns} dataSource={items} pagination={false} rowKey="key" bordered scroll={{ x: 'max-content' }} />

//                     <Button
//                         type="primary"
//                         icon={<PlusOutlined />}
//                         style={{ margin: "16px 0", float: "right" }}
//                         onClick={handleAddRow}
//                     >
//                         Add Item
//                     </Button><br /><br />

//                     <Row gutter={[8, 4]}>
//                         <Col span={5}>
//                             <Form.Item label="Total Spots" name="totalspots" style={{ marginBottom: '8px' }}>
//                                 <Input style={{ width: '190px' }} placeholder='spot' />
//                             </Form.Item>
//                         </Col>
//                         <Col span={6}>
//                             <Form.Item label="Total Charges" name="totalcharges" style={{ marginBottom: '8px' }}>
//                                 <Input style={{ width: '180px' }} />
//                             </Form.Item>
//                         </Col>
//                         <Col span={6}>
//                             <Form.Item label="Comission(%)" name="comissionpercent" style={{ marginBottom: '8px' }}>
//                                 <Input style={{ width: '180px', backgroundColor: '#f48fb1', borderColor: '#9b59b6' }} />
//                             </Form.Item>
//                         </Col>
//                         <Col span={5}>
//                             <Form.Item label="Comission Amount" name="comissionamount" style={{ marginBottom: '8px' }}>
//                                 <Input style={{ width: '180px' }} />
//                             </Form.Item>
//                         </Col>

//                     </Row><br />


//                     <Row gutter={[8, 4]}>
//                         <Col span={5}>
//                             <Form.Item label="GST Tax Type" name="gstid"
//                                 style={{ marginBottom: '8px', backgroundColor: '#f48fb1', borderColor: '#9b59b6', width: '200px' }} >
//                                 <Select
//                                     showSearch
//                                     allowClear
//                                     placeholder="Select "
//                                     disabled={loading}
//                                     style={{ width: '200px' }}
//                                     options={gsts}
//                                     value={data.gstid}
//                                     filterOption={(input, option) =>
//                                         option.label.toLowerCase().includes(input.toLowerCase())
//                                     }
//                                     onChange={(value) => setData({ ...data, gstid: value })}
//                                 />
//                             </Form.Item>
//                         </Col>
//                         <Col span={5}>
//                             <Form.Item label="CGST %" name="cgstpercent" style={{ marginBottom: '8px' }}>
//                                 <Input style={{ width: '180px', backgroundColor: '#d1c4e9 ', borderColor: '#9b59b8' }} />
//                             </Form.Item>
//                         </Col>

//                         <Col span={5}>
//                             <Form.Item label="SGST %" name="sgstpercent" style={{ marginBottom: '8px' }}>
//                                 <Input style={{ width: '180px', backgroundColor: '#d1c4e9 ', borderColor: '#9b59b8' }} />
//                             </Form.Item>
//                         </Col>

//                         <Col span={5}>
//                             <Form.Item label="IGST %" name="igstpercent" style={{ marginBottom: '8px' }}>
//                                 <Input style={{ width: '180px', backgroundColor: '#d1c4e9 ', borderColor: '#9b59b6' }} />
//                             </Form.Item>
//                         </Col>

//                     </Row><br />

//                     <Row gutter={[8, 4]}>
//                         <Col span={5}>
//                             <Form.Item label="Cheque No" name="chequeno" style={{ marginBottom: '8px' }}>
//                                 <Input style={{ width: '170px' }} />
//                             </Form.Item>
//                         </Col>
//                         <Col span={6}>
//                             <Form.Item label="Cheque Date" name="chequedate" style={{ marginBottom: '8px' }}>
//                                 <DatePicker style={{ width: "100%", backgroundColor: '#f48fb1 ', borderColor: '#9b59b6' }} format="DD/MM/YYYY" />
//                             </Form.Item>
//                         </Col>
//                         <Col span={9}>
//                             <Form.Item label="Bank Name" name="bankname" style={{ marginBottom: '8px' }}>
//                                 <Input
//                                     placeholder="Select "
//                                     style={{ width: '415px' }}
//                                 />
//                             </Form.Item>
//                         </Col><br />
//                     </Row><br />

//                     <Row gutter={[8, 4]}>
//                         <Col span={5}>
//                             <Form.Item
//                                 label="RO Bill Amount"
//                                 name="robillamount"
//                                 style={{ marginBottom: '8px' }}
//                             >
//                                 <Input style={{ width: '170px', backgroundColor: '#d1c4e9 ', borderColor: '#9b59b6' }} />
//                             </Form.Item>
//                         </Col>
//                         <Col span={15}>
//                             <Form.Item
//                                 label="Instructions"
//                                 name="instructions"
//                                 style={{ marginBottom: '8px' }}
//                             >
//                                 <Input.TextArea style={{ width: '500%', backgroundColor: '#d1c4e9 ', borderColor: '#9b59b6' }} rows={1} />
//                             </Form.Item>
//                         </Col>
//                     </Row>

//                     <Row justify="center" gutter={16}>
//                         <Col>
//                             <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
//                                 {isEditMode ? "Update" : "Save"}
//                             </Button>
//                         </Col>
//                         <Col>
//                             <Button type="default" icon={<PrinterOutlined />} onClick={handleCancel}>
//                                 Print
//                             </Button>
//                         </Col>
//                         <Col>
//                             <Button type="default" danger icon={<CloseOutlined />} onClick={handleCancel}>
//                                 Cancel
//                             </Button>
//                         </Col>
//                     </Row>
//                 </Form>
//             </Card>
//         </main>
//     )
// }

// export default EMediaROMaster;


import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card, Form, Row, Col, Input, Button, Table, Select, DatePicker, Divider, message, TimePicker } from 'antd';
import { SaveOutlined, PrinterOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

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
            bonusPaid: 'bonus',
            caption: 'Caption',
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
            bonusPaid: 'bonus',
            caption: 'Caption',
            charges: '',
            duration: '',
            totalCharges: ''
        };
        setItems([...items, newItem]);
    };

    const handleItemChange = (key, field, value) => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.key === key ? { ...item, [field]: value } : item
            )
        );
    };

    const handleSave = async (values) => {
        try {
            setLoading(true);

            const payload = {
                ...values,
                rodate: values.rodate ? moment(values.rodate).format('YYYY-MM-DD') : null,
                chequedate: values.chequedate ? moment(values.chequedate).format('YYYY-MM-DD') : null,
                items: items.map(item => ({
                    ...item,
                    fromToDate: item.fromToDate ? [
                        moment(item.fromToDate[0]).format('YYYY-MM-DD'),
                        moment(item.fromToDate[1]).format('YYYY-MM-DD')
                    ] : null,
                    fromTime: item.fromTime ? moment(item.fromTime).format('HH:mm:ss') : null,
                    toTime: item.toTime ? moment(item.toTime).format('HH:mm:ss') : null,
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
                    style={{ width: '100%', backgroundColor: '#d1c4e9', borderColor: '#9b59b6' }}
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
                    onChange={(e) => handleItemChange(record.key, 'days', e.target.value)}
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
                    onChange={(e) => handleItemChange(record.key, 'totalSpots', e.target.value)}
                />
            ),
        },
        {
            title: "Paid/Bonus",
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
                    onChange={(e) => handleItemChange(record.key, 'totalCharges', e.target.value)}
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
                        }))
                    );
                }
            })
            .catch((err) => {
                console.error("Error fetching gsts:", err);
            });
    }

    useEffect(() => {
        loadData();
        if (id) {
            setIsEditMode(true);
            axios.get(`http://localhost:8081/emediaros/${id}`)
                .then(res => {
                    const data = res.data.data;
                    if (data) {
                        form.setFieldsValue({
                            ...data,
                            rodate: data.rodate ? moment(data.rodate) : null,
                            chequedate: data.chequedate ? moment(data.chequedate) : null
                        });
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
                                <DatePicker style={{ width: "50%" }} format="DD/MM/YYYY" />
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
                            <Form.Item label="Media Bill No" name="billNo" style={{ marginBottom: '8px' }}>
                                <Input placeholder="Enter media bill number" style={{ width: '200px' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Media Bill Amount" name="billAmount" style={{ marginBottom: '8px' }}>
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
                                <Input style={{ width: '190px' }} placeholder='spot' />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Total Charges" name="totalcharges" style={{ marginBottom: '8px' }}>
                                <Input style={{ width: '180px' }} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Comission(%)" name="comissionpercent" style={{ marginBottom: '8px' }}>
                                <Input style={{ width: '180px', backgroundColor: '#f48fb1', borderColor: '#9b59b6' }} />
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item label="Comission Amount" name="comissionamount" style={{ marginBottom: '8px' }}>
                                <Input style={{ width: '180px' }} />
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
                                />
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item label="CGST %" name="cgstpercent" style={{ marginBottom: '8px' }}>
                                <Input style={{ width: '180px', backgroundColor: '#d1c4e9', borderColor: '#9b59b8' }} />
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item label="SGST %" name="sgstpercent" style={{ marginBottom: '8px' }}>
                                <Input style={{ width: '180px', backgroundColor: '#d1c4e9', borderColor: '#9b59b8' }} />
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item label="IGST %" name="igstpercent" style={{ marginBottom: '8px' }}>
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
                                <Input style={{ width: '170px', backgroundColor: '#d1c4e9', borderColor: '#9b59b6' }} />
                            </Form.Item>
                        </Col>
                        <Col span={15}>
                            <Form.Item label="Instructions" name="instructions" style={{ marginBottom: '8px' }}>
                                <Input.TextArea style={{ width: '500%', backgroundColor: '#d1c4e9', borderColor: '#9b59b6' }} rows={1} />
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
                            <Button type="default" danger icon={<CloseOutlined />} onClick={handleCancel}>
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