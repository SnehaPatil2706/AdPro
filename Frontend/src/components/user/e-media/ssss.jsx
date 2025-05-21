// import React from 'react';
// import { Link, useNavigate, useParams } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import { Card, Form, Row, Col, Input, Button, Table, Select, DatePicker, Divider, message, TimePicker } from 'antd';
// import { SaveOutlined, PrinterOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
// import axios from 'axios';
// import moment from 'moment';
// import dayjs from 'dayjs';

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
//             fromToDate: null,
//             days: 0,
//             fromTime: moment('10:00', 'HH:mm'),
//             toTime: moment('11:00', 'HH:mm'),
//             dailySpots: 0,
//             totalSpots: 0,
//             bonusPaid: '',
//             caption: '',
//             charges: '',
//             duration: '',
//             totalCharges: ''
//         },
//     ]);
//     const [roNoExists, setRoNoExists] = useState(false);
//     const [emedias, setEmedias] = useState([]);
//     const [clients, setClients] = useState([]);
//     const [gsts, setGsts] = useState([]);
//     const { RangePicker } = DatePicker;
//     const [data, setData] = useState({
//         agencyid: agency?._id,
//         rono: { type: Number },
//         rodate: "",
//         clientid: "",
//         emediaid: "",
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
//         gstid: "",
//         cgstpercent: 0, // CGST percentage
//         cgstamount: 0,
//         sgstpercent: 0, // CGST percentage
//         sgstamount: 0,
//         igstpercent: 0, // CGST percentage
//         igstamount: 0,
//     });

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

//     const handleAddRow = () => {
//         const newItem = {
//             key: Date.now(),
//             fromToDate: null,
//             days: 0,
//             fromTime: moment('10:00', 'HH:mm'),
//             toTime: moment('11:00', 'HH:mm'),
//             dailySpots: 0,
//             totalSpots: 0,
//             bonusPaid: '',
//             caption: '',
//             charges: '',
//             duration: '',
//             totalCharges: ''
//         };
//         setItems([...items, newItem]);
//     };

//     const handleItemChange = (key, field, value) => {
//         setItems(prevItems =>
//             prevItems.map(item => {
//                 if (item.key === key) {
//                     const updatedItem = { ...item, [field]: value };
//                     console.log(updatedItem);


//                     // Automatically update 'days' when 'fromToDate' is selected
//                     if (field === 'fromToDate' && value && value[0] && value[1]) {
//                         const start = dayjs(value[0]);
//                         const end = dayjs(value[1]);
//                         const diff = end.diff(start, 'day') + 1; // +1 to include both start & end
//                         updatedItem.days = diff;

//                         // Recalculate totalSpots when days changes
//                         if (updatedItem.dailySpots) {
//                             updatedItem.totalSpots = updatedItem.days * updatedItem.dailySpots;
//                         }
//                     }

//                     // Recalculate totalSpots when dailySpots changes
//                     if (field === 'dailySpots') {
//                         updatedItem.totalSpots = (updatedItem.days || 0) * (value || 0);
//                     };

//                     // When bonus/paid changes to "bonus", set charges to 0 and make read-only
//                     if (field === 'bonusPaid') {
//                         if (value === 'bonus') {
//                             updatedItem.charges = '0';
//                             updatedItem.totalCharges = '0';
//                         }
//                     }

//                     // Calculate total charges when charges, duration, or totalSpots change
//                     if (field === 'charges' || field === 'duration' || field === 'totalSpots') {
//                         const charges = parseFloat(updatedItem.charges) || 0;
//                         const duration = parseFloat(updatedItem.duration) || 0;
//                         const totalSpots = parseFloat(updatedItem.totalSpots) || 0;


//                         // Calculate: (charges/10) * duration * totalSpots
//                         updatedItem.totalCharges = ((charges / 10) * duration * totalSpots).toFixed(2);

//                     }

//                     return updatedItem;
//                 }
//                 return item;
//             })
//         );
//     };

//     const calculateTotalSpots = () => {
//         return items.reduce((sum, item) => sum + (item.totalSpots || 0), 0);
//     };

//     const calculateTotalCharges = () => {
//         return items.reduce((sum, item) => sum + (parseFloat(item.totalCharges) || 0), 0).toFixed(2);
//     };

//     const calculateCommissionAmount = () => {
//         const commissionPercent = parseFloat(form.getFieldValue('comissionpercent')) || 0;
//         const totalCharges = parseFloat(calculateTotalCharges()) || 0;
//         return ((commissionPercent / 100) * totalCharges).toFixed(2);
//     };

//     const calculateROBillAmount = (includeGst = false) => {
//         const totalCharges = parseFloat(calculateTotalCharges()) || 0;
//         const commissionAmount = parseFloat(calculateCommissionAmount()) || 0;

//         console.log(totalCharges);
//         console.log(commissionAmount);

//         let robillamount = (totalCharges - commissionAmount).toFixed(2);

//         // Only apply GST if explicitly requested and GST type is selected
//         if (includeGst && data.gstid) {
//             const selectedGst = gsts.find(gst => gst.value === data.gstid);
//             if (selectedGst) {
//                 const gstAmount = (parseFloat(robillamount) *
//                     (selectedGst.cgstpercent + selectedGst.sgstpercent + selectedGst.igstpercent) / 100);
//                 robillamount = (parseFloat(robillamount) + parseFloat(gstAmount)).toFixed(2);
//             }
//         }

//         form.setFieldsValue({ robillamount });
//         return robillamount;
//     };

//     const handleGstTypeChange = (value) => {
//         const selectedGst = gsts.find((gst) => gst.value === value);
//         if (!selectedGst) return;

//         // Get RO bill amount before GST
//         const robillamountBeforeGst = calculateROBillAmount(false);
//         console.log(robillamountBeforeGst);


//         // Calculate GST amounts
//         const cgstAmount = (robillamountBeforeGst * selectedGst.cgstpercent / 100).toFixed(2);
//         const sgstAmount = (robillamountBeforeGst * selectedGst.sgstpercent / 100).toFixed(2);
//         const igstAmount = (robillamountBeforeGst * selectedGst.igstpercent / 100).toFixed(2);

//         // Update state and form values
//         setData((prev) => ({
//             ...prev,
//             gstid: value,
//             cgstpercent: selectedGst.cgstpercent,
//             sgstpercent: selectedGst.sgstpercent,
//             igstpercent: selectedGst.igstpercent,
//             cgstamount: cgstAmount,
//             sgstamount: sgstAmount,
//             igstamount: igstAmount
//         }));

//         form.setFieldsValue({
//             gstid: value,
//             cgstpercent: selectedGst.cgstpercent,
//             sgstpercent: selectedGst.sgstpercent,
//             igstpercent: selectedGst.igstpercent,
//             cgstamount: cgstAmount,
//             sgstamount: sgstAmount,
//             igstamount: igstAmount
//         });

//         // Calculate and set final RO bill amount with GST
//         const finalAmount = (parseFloat(robillamountBeforeGst) +
//             parseFloat(cgstAmount) +
//             parseFloat(sgstAmount) +
//             parseFloat(igstAmount));
//         form.setFieldsValue({ robillamount: finalAmount.toFixed(2) });
//     };

//     const handleSave = async (values) => {
//         try {
//             setLoading(true);

//             // Recalculate everything before saving
//             const totalCharges = parseFloat(calculateTotalCharges()) || 0;
//             const commissionAmount = parseFloat(calculateCommissionAmount()) || 0;
//             let robillamount = (totalCharges - commissionAmount).toFixed(2);

//             // Apply GST if selected
//             if (values.gstid) {
//                 const selectedGst = gsts.find(gst => gst.value === values.gstid);
//                 if (selectedGst) {
//                     const gstAmount = (parseFloat(robillamount) *
//                         (selectedGst.cgstpercent + selectedGst.sgstpercent + selectedGst.igstpercent) / 100);
//                     robillamount = (parseFloat(robillamount) + parseFloat(gstAmount)).toFixed(2);
//                 }
//             }

//             const payload = {
//                 ...values,
//                 totalspots: calculateTotalSpots(),
//                 totalcharges: totalCharges,
//                 comissionamount: commissionAmount,
//                 robillamount: robillamount,
//                 rodate: values.rodate ? dayjs(values.rodate).format('YYYY-MM-DD') : null,
//                 chequedate: values.chequedate ? dayjs(values.chequedate).format('YYYY-MM-DD') : null,
//                 items: items.map(item => ({
//                     ...item,
//                     fromToDate: item.fromToDate ? [
//                         dayjs(item.fromToDate[0]).format('YYYY-MM-DD'),
//                         dayjs(item.fromToDate[1]).format('YYYY-MM-DD')
//                     ] : null,
//                     fromTime: item.fromTime ? dayjs(item.fromTime).format('HH:mm:ss') : null,
//                     toTime: item.toTime ? dayjs(item.toTime).format('HH:mm:ss') : null,
//                     totalCharges: item.totalCharges || 0
//                 })),
//                 agencyid: agencyid,
//                 status: "active"
//             };

//             const response = isEditMode
//                 ? await axios.put(`http://localhost:8081/emediaros/${id}`, payload)
//                 : await axios.post('http://localhost:8081/emediaros', payload);

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
//             render: (_, record) => (
//                 <RangePicker
//                     format="DD/MM/YYYY"
//                     style={{ width: '100%', backgroundColor: '#f48fb1', borderColor: '#9b59b6' }}
//                     value={record.fromToDate}
//                     onChange={(dates) => handleItemChange(record.key, 'fromToDate', dates)}
//                 />
//             ),
//         },
//         {
//             title: 'Days',
//             dataIndex: 'days',
//             key: 'days',
//             width: 130,
//             render: (text, record) => (
//                 <Input
//                     value={text}
//                     readOnly
//                     style={{ width: '100%', backgroundColor: '#d1c4e9', borderColor: '#9b59b6' }}
//                 />
//             ),
//         },
//         {
//             title: "From Time",
//             dataIndex: "fromTime",
//             key: "fromTime",
//             width: 150,
//             render: (text, record) => (
//                 <TimePicker
//                     use12Hours
//                     format="h:mm A"
//                     value={text}
//                     onChange={(time) => handleItemChange(record.key, 'fromTime', time)}
//                 />
//             ),
//         },
//         {
//             title: "To Time",
//             dataIndex: "toTime",
//             key: "toTime",
//             width: 150,
//             render: (text, record) => (
//                 <TimePicker
//                     use12Hours
//                     format="h:mm A"
//                     value={text}
//                     onChange={(time) => handleItemChange(record.key, 'toTime', time)}
//                 />
//             ),
//         },
//         {
//             title: "Daily Spots",
//             dataIndex: "dailySpots",
//             key: "dailySpots",
//             width: 140,
//             render: (text, record) => (
//                 <Input
//                     value={text}
//                     onChange={(e) => handleItemChange(record.key, 'dailySpots', e.target.value)}
//                 />
//             ),
//         },
//         {
//             title: "Total Spots",
//             dataIndex: "totalSpots",
//             key: "totalSpots",
//             width: 140,
//             render: (text, record) => (
//                 <Input
//                     value={text}
//                     readOnly
//                     style={{ width: '100%', backgroundColor: '#d1c4e9', borderColor: '#9b59b6' }}
//                 />
//             ),
//         },
//         {
//             title: "Paid/Bonus",
//             placeholder: "Select",
//             dataIndex: "bonusPaid",
//             key: "bonusPaid",
//             width: 140,
//             render: (text, record) => (
//                 <Select
//                     value={text}
//                     style={{ width: '100%' }}
//                     options={payOptions}
//                     onChange={(value) => handleItemChange(record.key, 'bonusPaid', value)}
//                 />
//             ),
//         },
//         {
//             title: "Caption",
//             dataIndex: "caption",
//             key: "caption",
//             placeholder: "Caption",
//             render: (text, record) => (
//                 <Input
//                     value={text}
//                     onChange={(e) => handleItemChange(record.key, 'caption', e.target.value)}
//                 />
//             ),
//         },
//         {
//             title: "Charges(10sec)",
//             dataIndex: "charges",
//             key: "charges",
//             width: 140,
//             render: (text, record) => (
//                 <Input
//                     value={text}
//                     onChange={(e) => handleItemChange(record.key, 'charges', e.target.value)}
//                     readOnly={record.bonusPaid === 'bonus'}
//                     style={{
//                         backgroundColor: record.bonusPaid === 'bonus' ? '#f0f0f0' : 'inherit',
//                         borderColor: record.bonusPaid === 'bonus' ? '#d9d9d9' : 'inherit'
//                     }}
//                 />
//             ),
//         },
//         {
//             title: "Duration(in sec)",
//             dataIndex: "duration",
//             key: "duration",
//             width: 140,
//             render: (text, record) => (
//                 <Input
//                     value={text}
//                     onChange={(e) => handleItemChange(record.key, 'duration', e.target.value)}
//                 />
//             ),
//         },
//         {
//             title: "Total Charges",
//             dataIndex: "totalCharges",
//             key: "totalCharges",
//             width: 140,
//             render: (text, record) => (
//                 <Input
//                     value={text}
//                     readOnly
//                     style={{ width: '100%', backgroundColor: '#d1c4e9', borderColor: '#9b59b6' }}
//                 />
//             ),
//         }
//     ];

//     function loadData() {
//         axios.get("http://localhost:8081/emedias")
//             .then((res) => {
//                 if (res.data && Array.isArray(res.data.data)) {
//                     setEmedias(
//                         res.data.data.map((emedia) => ({
//                             label: emedia.name,
//                             value: emedia._id,
//                         }))
//                     );
//                 }
//             })
//             .catch((err) => {
//                 console.error("Error fetching emedia:", err);
//             });

//         axios.get(`http://localhost:8081/clients/${agency._id}`)
//             .then((res) => {
//                 if (res.data && Array.isArray(res.data.data)) {
//                     setClients(
//                         res.data.data.map((client) => ({
//                             label: client.name,
//                             value: client._id,
//                         }))
//                     );
//                 }
//             })
//             .catch((err) => {
//                 console.error("Error fetching clients:", err);
//             });

//         axios.get("http://localhost:8081/gsts")
//             .then((res) => {
//                 if (res.data && Array.isArray(res.data.data)) {
//                     setGsts(
//                         res.data.data.map((gst) => ({
//                             label: gst.title,
//                             value: gst._id,
//                             cgstpercent: gst.cgstpercent,
//                             sgstpercent: gst.sgstpercent,
//                             igstpercent: gst.igstpercent
//                         }))
//                     );
//                 }
//             })
//             .catch((err) => {
//                 console.error("Error fetching gsts:", err);
//             });
//     };

//     useEffect(() => {
//         loadData();
//         if (id) {
//             setIsEditMode(true);
//             axios.get(`http://localhost:8081/emediaros/${id}`)
//                 .then(res => {
//                     const data = res.data.data;
//                     console.log(data);

//                     if (data) {
//                         form.setFieldsValue({
//                             ...data,
//                             rodate: data.rodate ? moment(data.rodate) : null,
//                             chequedate: data.chequedate ? moment(data.chequedate) : null,
//                             cgstpercent: data.cgstpercent || 0,
//                             sgstpercent: data.sgstpercent || 0,
//                             igstpercent: data.igstpercent || 0,
//                             cgstamount: data.cgstamount || 0,
//                             sgstamount: data.sgstamount || 0,
//                             igstamount: data.igstamount || 0,
//                             clientid: data.clientid?._id || null,
//                             emediaid: data.emediaid?._id || null,
//                             gstid: data.gstid?._id || null,
//                         });

//                         setData(prev => ({
//                             ...prev,
//                             cgstpercent: data.cgstpercent || 0,
//                             sgstpercent: data.sgstpercent || 0,
//                             igstpercent: data.igstpercent || 0
//                         }));
//                         if (data.items) {
//                             setItems(data.items.map(item => ({
//                                 ...item,
//                                 fromToDate: item.fromToDate ? [
//                                     moment(item.fromToDate[0]),
//                                     moment(item.fromToDate[1])
//                                 ] : null,
//                                 fromTime: item.fromTime ? moment(item.fromTime, 'HH:mm:ss') : null,
//                                 toTime: item.toTime ? moment(item.toTime, 'HH:mm:ss') : null
//                             })));
//                         }
//                     }
//                 })
//                 .catch(err => console.error('Error fetching RO data:', err));
//         }
//     }, [id, form]);

//     useEffect(() => {
//         const totalCharges = parseFloat(calculateTotalCharges()) || 0;
//         const commissionAmount = parseFloat(calculateCommissionAmount()) || 0;
//         const robillamountBeforeGst = (totalCharges - commissionAmount).toFixed(2);

//         // Only calculate GST if GST type is selected
//         if (data.gstid) {
//             const selectedGst = gsts.find(gst => gst.value === data.gstid);
//             if (selectedGst) {
//                 const cgstAmount = (robillamountBeforeGst * selectedGst.cgstpercent / 100).toFixed(2);
//                 const sgstAmount = (robillamountBeforeGst * selectedGst.sgstpercent / 100).toFixed(2);
//                 const igstAmount = (robillamountBeforeGst * selectedGst.igstpercent / 100).toFixed(2);

//                 form.setFieldsValue({
//                     cgstamount: cgstAmount,
//                     sgstamount: sgstAmount,
//                     igstamount: igstAmount
//                 });

//                 // Calculate final amount with GST
//                 const finalAmount = (parseFloat(robillamountBeforeGst) +
//                     parseFloat(cgstAmount) +
//                     parseFloat(sgstAmount) +
//                     parseFloat(igstAmount));
//                 form.setFieldsValue({ robillamount: finalAmount.toFixed(2) });
//             }
//         } else {
//             // If no GST selected, just show amount before GST
//             form.setFieldsValue({ robillamount: robillamountBeforeGst });
//         }

//         form.setFieldsValue({
//             totalspots: calculateTotalSpots(),
//             totalcharges: totalCharges,
//             comissionamount: commissionAmount
//         });
//     }, [items, form.getFieldValue('comissionpercent'), data.gstid]);

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

//             <Card title="">
//                 <Form form={form} layout="vertical" onFinish={handleSave}>
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
//                                 <Input onChange={handleRONoChange} placeholder="Enter ro number" style={{ width: '200px' }} />
//                             </Form.Item>
//                         </Col>
//                         <Col span={8}>
//                             <Form.Item label="RO Date" name="rodate" style={{ marginBottom: '8px' }}>
//                                 <DatePicker style={{ width: "50%", backgroundColor: '#f48fb1', borderColor: '#9b59b6' }} format="DD/MM/YYYY" />
//                             </Form.Item>
//                         </Col>
//                         <Col span={8}>
//                             <Form.Item label="Client" name="clientid" style={{ marginBottom: '8px' }}>
//                                 {/* {
//                                     console.log(clients[0].label)
                                    
//                                 } */}
//                                 <Select
//                                     showSearch
//                                     allowClear
//                                     placeholder="Select Client"
//                                     disabled={loading}
//                                     style={{ width: '200px' }}
//                                     options={clients}
//                                     filterOption={(input, option) =>
//                                         option.label.toLowerCase().includes(input.toLowerCase())
//                                     }
//                                 />
//                             </Form.Item>
//                         </Col>
//                         <Col span={8}>
//                             <Form.Item label="Media Bill No" name="mediabillno" style={{ marginBottom: '8px' }}>
//                                 <Input placeholder="Enter media bill number" style={{ width: '200px' }} />
//                             </Form.Item>
//                         </Col>
//                         <Col span={8}>
//                             <Form.Item label="Media Bill Amount" name="mediabillamount" style={{ marginBottom: '8px' }}>
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
//                                     options={emedias}
//                                     filterOption={(input, option) =>
//                                         option.label.toLowerCase().includes(input.toLowerCase())
//                                     }
//                                 />
//                             </Form.Item>
//                         </Col>
//                         <Col span={8}>
//                             <Form.Item label="Broadcast Center" name="centers" style={{ marginBottom: '8px' }}>
//                                 <Input style={{ width: '200px' }} />
//                             </Form.Item>
//                         </Col>
//                         <Col span={8}>
//                             <Form.Item label="Caption" name="caption" style={{ marginBottom: '8px' }}>
//                                 <Input style={{ width: '200px' }} />
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
//                                     filterOption={(input, option) =>
//                                         option.label.toLowerCase().includes(input.toLowerCase())
//                                     }
//                                 />
//                             </Form.Item>
//                         </Col>
//                     </Row>

//                     <Divider />

//                     <Table
//                         columns={columns}
//                         dataSource={items}
//                         pagination={false}
//                         rowKey="key"
//                         bordered
//                         scroll={{ x: 'max-content' }}
//                     />

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
//                                 <Input style={{ width: '190px', backgroundColor: '#d1c4e9', borderColor: '#9b59b6' }} placeholder='spot' value={calculateTotalSpots()}
//                                     readOnly />
//                             </Form.Item>
//                         </Col>
//                         <Col span={6}>
//                             <Form.Item label="Total Charges" name="totalcharges" style={{ marginBottom: '8px' }}>
//                                 <Input style={{ width: '180px', backgroundColor: '#d1c4e9', borderColor: '#9b59b6' }} value={calculateTotalCharges()} readOnly />
//                             </Form.Item>
//                         </Col>
//                         <Col span={6}>
//                             <Form.Item label="Comission(%)" name="comissionpercent" style={{ marginBottom: '8px' }}>
//                                 <Input style={{ width: '180px', backgroundColor: '#f48fb1', borderColor: '#9b59b6' }}
//                                     onChange={() => {
//                                         // Update commission amount when percentage changes
//                                         // form.setFieldsValue({ comissionamount: calculateCommissionAmount() });
//                                         const commissionAmount = calculateCommissionAmount();
//                                         form.setFieldsValue({
//                                             comissionamount: commissionAmount,
//                                             // RO Bill Amount will be updated by calculateCommissionAmount
//                                         });
//                                         handleItemChange()

//                                     }}
//                                 />
//                             </Form.Item>
//                         </Col>
//                         <Col span={5}>
//                             <Form.Item label="Comission Amount" name="comissionamount" style={{ marginBottom: '8px' }}>
//                                 <Input style={{ width: '180px', backgroundColor: '#d1c4e9', borderColor: '#9b59b6' }} readOnly />
//                             </Form.Item>
//                         </Col>
//                     </Row><br />

//                     <Row gutter={[8, 4]}>
//                         <Col span={5}>
//                             <Form.Item label="GST Tax Type" name="gstid"
//                                 style={{ marginBottom: '8px', backgroundColor: '#f48fb1', borderColor: '#9b59b6', width: '200px' }}>
//                                 <Select
//                                     showSearch
//                                     allowClear
//                                     placeholder="Select"
//                                     disabled={loading}
//                                     style={{ width: '200px' }}
//                                     options={gsts}
//                                     filterOption={(input, option) =>
//                                         option.label.toLowerCase().includes(input.toLowerCase())
//                                     }
//                                     onChange={handleGstTypeChange}
//                                 />
//                             </Form.Item>
//                             <Form.Item name="cgstpercent" hidden>
//                                 <Input />
//                             </Form.Item>
//                             <Form.Item name="sgstpercent" hidden>
//                                 <Input />
//                             </Form.Item>
//                             <Form.Item name="igstpercent" hidden>
//                                 <Input />
//                             </Form.Item>
//                         </Col>
//                         <Col span={5}>
//                             <Form.Item label={`CGST (${data.cgstpercent}%)`} name="cgstamount" style={{ marginBottom: '8px' }}>
//                                 <Input style={{ width: '180px', backgroundColor: '#d1c4e9', borderColor: '#9b59b8' }} />
//                             </Form.Item>
//                         </Col>
//                         <Col span={5}>
//                             <Form.Item label={`SGST (${data.sgstpercent}%)`} name="sgstamount" style={{ marginBottom: '8px' }}>
//                                 <Input style={{ width: '180px', backgroundColor: '#d1c4e9', borderColor: '#9b59b8' }} />
//                             </Form.Item>
//                         </Col>
//                         <Col span={5}>
//                             <Form.Item label={`IGST (${data.igstpercent}%)`} name="igstamount" style={{ marginBottom: '8px' }}>
//                                 <Input style={{ width: '180px', backgroundColor: '#d1c4e9', borderColor: '#9b59b6' }} />
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
//                                 <DatePicker style={{ width: "100%", backgroundColor: '#f48fb1', borderColor: '#9b59b6' }} format="DD/MM/YYYY" />
//                             </Form.Item>
//                         </Col>
//                         <Col span={9}>
//                             <Form.Item label="Bank Name" name="bankname" style={{ marginBottom: '8px' }}>
//                                 <Input placeholder="Select" style={{ width: '415px' }} />
//                             </Form.Item>
//                         </Col><br />
//                     </Row><br />

//                     <Row gutter={[8, 4]}>
//                         <Col span={5}>
//                             <Form.Item label="RO Bill Amount" name="robillamount" style={{ marginBottom: '8px' }}>
//                                 <Input style={{ width: '170px', backgroundColor: '#d1c4e9', borderColor: '#9b59b6' }} readOnly />
//                             </Form.Item>
//                         </Col>
//                         <Col span={15}>
//                             <Form.Item label="Instructions" name="instructions" style={{ marginBottom: '8px' }}>
//                                 <Input.TextArea style={{ width: '500%' }} rows={1} />
//                             </Form.Item>
//                         </Col>
//                     </Row>

//                     <Row justify="center" gutter={16}>
//                         <Col>
//                             <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
//                                 {isEditMode ? "Update" : "Save"}
//                             </Button>
//                         </Col>
//                         <Col>
//                             <Button type="default" icon={<PrinterOutlined />} onClick={handleCancel}>
//                                 Print
//                             </Button>
//                         </Col>
//                         <Col>
//                             <Button type="primary" danger icon={<CloseOutlined />} onClick={handleCancel}>
//                                 Cancel
//                             </Button>
//                         </Col>
//                     </Row>
//                 </Form>
//             </Card>
//         </main>
//     );
// }

// export default EMediaROMaster;



// import { useState, React, useEffect } from 'react';
// import { Link, useNavigate, useParams } from 'react-router-dom';
// import { Card, Form, Row, Col, Input, DatePicker, Select, Divider, Button, Popconfirm, message, TimePicker, Table, Alert } from 'antd';
// import { SaveOutlined, CloseOutlined, PrinterOutlined, PlusOutlined, DeleteOutlined, } from "@ant-design/icons";
// import axios from 'axios';
// import dayjs from 'dayjs';
// import moment from 'moment';

// function EMediaROBilling() {
//   const [loading, setLoading] = useState(true);
//   const agency = JSON.parse(localStorage.getItem("agency")) || null;
//   const agencyid = agency?._id;
//   const [form] = Form.useForm();
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [clients, setClients] = useState([]);
//   const { RangePicker } = DatePicker;
//   const [gsts, setGsts] = useState([]);
//   const [items, setItems] = useState([
//     {
//       key: Date.now(),
//       fromToDate: null,
//       days: 0,
//       fromTime: moment('10:00', 'HH:mm'),
//       toTime: moment('11:00', 'HH:mm'),
//       dailySpots: 0,
//       totalSpots: 0,
//       bonusPaid: '',
//       caption: '',
//       charges: '',
//       duration: '',
//       totalCharges: ''
//     },
//   ]);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [data, setData] = useState({
//     id: "",
//     agencyid: agency._id,
//     invoiceno: "",
//     invoicedate: "",
//     billclientid: "",
//     discountpercent: "",
//     discountamount: "",
//     taxableamount: "",
//     gstid: "",
//     cgstamount: "",
//     sgstamount: "",
//     igstamount: "",
//     invoiceamount: "",
//     advance: "",

//     invoicegstid: "",
//     icgstpercent: 0, // CGST percentage
//     icgstamount: 0,
//     isgstpercent: 0, // CGST percentage
//     isgstamount: 0,
//     iigstpercent: 0, // CGST percentage
//     iigstamount: 0,
//   });
//   const [roInvoices, setRoInvoices] = useState([]);

//   const handleCancel = () => {
//     navigate("/emedia/emediaROList");
//   };

//   const loadData = () => {
//     axios.get(`http://localhost:8081/clients/${agency._id}`)
//       .then((res) => {
//         if (res.data && Array.isArray(res.data.data)) {
//           setClients(
//             res.data.data.map((client) => ({
//               label: client.name,
//               value: client._id,
//             }))
//           );
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching clients:", err);
//       });

//     axios.get("http://localhost:8081/gsts")
//       .then((res) => {
//         if (res.data && Array.isArray(res.data.data)) {
//           setGsts(
//             res.data.data.map((gst) => ({
//               label: gst.title,
//               value: gst._id,
              
//           cgstpercent: gst.cgstpercent,
//           sgstpercent: gst.sgstpercent,
//           igstpercent: gst.igstpercent
//             }))
//           );
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching GSTs:", err);
//       });
//   };

//   const loadROData = () => {
//     axios.get(`http://localhost:8081/emediaros/${id}`)
//       .then((res) => {
//         if (res.data && res.data.status === 'success') {
//           const roData = res.data.data;

//           form.setFieldsValue({
//             // ...existing fields...
//             rono: roData.rono,
//             rodate: roData.rodate ? dayjs(roData.rodate) : null,
//             emediaid: roData.emediaid.name,
//             centers: roData.centers,
//             clientid: roData.clientid.name,
//             language: roData.language,
//             caption: roData.caption,
//             comissionpercent: roData.comissionpercent,
//             comissionamount: roData.comissionamount,
//             robillamount: roData.robillamount,
//             totalcharges: roData.totalcharges,
//             totalspots: roData.totalspots,
//             gstid: roData.gstid.title,
//             cgstpercent: roData.cgstpercent,
//             sgstpercent: roData.sgstpercent,
//             igstpercent: roData.igstpercent,
//             instructions: roData.instructions,
//             chequeno: roData.chequeno,
//             chequedate: roData.chequedate ? dayjs(roData.chequedate) : null,
//             bankname: roData.bankname
//           });

//           if (roData.items && roData.items.length > 0) {
//             const formattedItems = roData.items.map(item => ({
//               key: item._id || Date.now(),
//               fromToDate: item.fromToDate ? [
//                 dayjs(item.fromToDate[0]),
//                 dayjs(item.fromToDate[1])
//               ] : null,
//               days: item.days,
//               fromTime: item.fromTime ? moment(item.fromTime, 'HH:mm:ss') : null,
//               toTime: item.toTime ? moment(item.toTime, 'HH:mm:ss') : null,
//               dailySpots: item.dailySpots,
//               totalSpots: item.totalSpots,
//               bonusPaid: item.bonusPaid,
//               caption: item.caption,
//               charges: item.charges,
//               duration: item.duration,
//               totalCharges: item.totalCharges
//             }));
//             setItems(formattedItems);
//           }

//           // --- ADD THIS LINE: recalculate GST and RO Billed Amount on load ---
//           setTimeout(() => handleCommissionOrTotalChargesChange(), 0);
//         } else {
//           message.error("RO data not found");
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching RO data:", err);
//         message.error("Failed to load RO data");
//       });
//   };

//   const loadROInvoices = () => {
//     axios.get(`http://localhost:8081/emediaroinvoices/by-ro/${id}`)
//       .then(res => {
//         if (res.data && res.data.status === 'success' && res.data.data.length > 0) {
//           const invoiceData = res.data.data[0]; // Get the first invoice from the array
//           setRoInvoices(invoiceData);

//           // Format the date properly for the DatePicker
//           const formattedData = {
//             ...invoiceData,
//             invoicedate: invoiceData.invoicedate ? dayjs(invoiceData.invoicedate) : null
//           };

//           // Set form values
//           form.setFieldsValue(formattedData);

//         } else {
//           message.info("No invoice found for this RO");
//         }
//       })
//       .catch(err => {
//         console.error("Error fetching RO invoices:", err);
//         setRoInvoices(null);
//       });
//   };

//   const columns = [
//     {
//       title: "Sr. No",
//       key: "sr",
//       width: 80,
//       render: (_, __, index) => index + 1,
//     },
//     {
//       title: "From-To Date",
//       dataIndex: "fromToDate",
//       key: "fromToDate",
//       width: 250,
//       render: (_, record) => (
//         <RangePicker
//           format="DD/MM/YYYY"
//           value={record.fromToDate}
//         // style={{ width: '100%', backgroundColor: '#f48fb1', borderColor: '#9b59b6' }}
//         />
//       ),
//     },
//     {
//       title: 'Days',
//       dataIndex: 'days',
//       key: 'days',
//       width: 130,
//       render: (text, record) => (
//         <Input
//           value={text}
//           readOnly
//         />
//       ),
//     },
//     {
//       title: "From Time",
//       dataIndex: "fromTime",
//       key: "fromTime",
//       width: 150,
//       render: (text, record) => (
//         <TimePicker
//           use12Hours
//           format="h:mm A"
//           value={text}
//         />
//       ),
//     },
//     {
//       title: "To Time",
//       dataIndex: "toTime",
//       key: "toTime",
//       width: 150,
//       render: (text, record) => (
//         <TimePicker
//           use12Hours
//           format="h:mm A"
//           value={text}
//         />
//       ),
//     },
//     {
//       title: "Daily Spots",
//       dataIndex: "dailySpots",
//       key: "dailySpots",
//       width: 140,
//       render: (text, record) => (
//         <Input
//           value={text}
//           readOnly
//         />
//       ),
//     },
//     {
//       title: "Total Spots",
//       dataIndex: "totalSpots",
//       key: "totalSpots",
//       width: 140,
//       render: (text, record) => (
//         <Input
//           value={text}
//           readOnly
//         />
//       ),
//     },
//     {
//       title: "Paid/Bonus",
//       placeholder: "Select",
//       dataIndex: "bonusPaid",
//       key: "bonusPaid",
//       width: 140,
//       render: (text, record) => (
//         <Select
//           value={text}
//           style={{ width: '100%' }}
//           readOnly
//         />
//       ),
//     },
//     {
//       title: "Caption",
//       dataIndex: "caption",
//       key: "caption",
//       placeholder: "Caption",
//       render: (text, record) => (
//         <Input
//           value={text}
//           readOnly
//         />
//       ),
//     },
//     {
//       title: "Charges(10sec)",
//       dataIndex: "charges",
//       key: "charges",
//       width: 140,
//       render: (text, record) => (
//         <Input
//           value={text}
//           style={{
//             backgroundColor: record.bonusPaid === 'bonus' ? '#f0f0f0' : 'inherit',
//             borderColor: record.bonusPaid === 'bonus' ? '#d9d9d9' : 'inherit'
//           }}
//         />
//       ),
//     },
//     {
//       title: "Duration(in sec)",
//       dataIndex: "duration",
//       key: "duration",
//       width: 140,
//       render: (text, record) => (
//         <Input
//           value={text}
//           readOnly
//         />
//       ),
//     },
//     {
//       title: "Total Charges",
//       dataIndex: "totalCharges",
//       key: "totalCharges",
//       width: 140,
//       render: (text, record) => (
//         <Input
//           value={text}
//           readOnly
//         // style={{ width: '100%', backgroundColor: '#d1c4e9', borderColor: '#9b59b6' }}
//         />
//       ),
//     }
//   ];

//   const handleDelete = () => {
//     axios.delete(`http://localhost:8081/emediaros/${id}`)
//       .then((res) => {
//         if (res.data && res.data.status === 'success') {
//           message.success("Record deleted successfully");
//           navigate("/emedia/emediaROList"); // Navigate back to the list page
//         } else {
//           message.error("Failed to delete the record");
//         }
//       })
//       .catch((err) => {
//         console.error("Error deleting record:", err);
//         message.error("An error occurred while deleting the record");
//       });
//   };

//   const handleSave = async () => {
//     try {
//       setLoading(true);
//       const values = await form.validateFields();

//       const payload = {
//         agencyid: agency._id,
//         emediaroid: id, // Link to the RO record
//         ...values,
//         invoicedate: values.invoicedate ? dayjs(values.invoicedate).format('YYYY-MM-DD') : null
//       };

//       // If editing existing invoice
//       if (roInvoices._id) {
//         await axios.put(`http://localhost:8081/emediaroinvoices/${roInvoices._id}`, payload);
//         message.success("Invoice updated successfully");
//       } else {
//         // Creating new invoice
//         await axios.post('http://localhost:8081/emediaroinvoices', payload);
//         message.success("Invoice created successfully");
//       }

//       // // Save to emediaroinvoices
//       // await axios.post('http://localhost:8081/emediaroinvoices', payload);

//       message.success("Billing information saved successfully");
//       navigate("/emedia/emediaROList");

//     } catch (err) {
//       console.error("Save error:", err);
//       message.error(err.response?.data?.message || "Failed to save billing data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateCommissionAmount = (totalCharges, percent) => {
//     const commission = ((parseFloat(totalCharges) || 0) * (parseFloat(percent) || 0)) / 100;
//     return commission.toFixed(2);
//   };

//   const calculateNetTotalCharges = (totalCharges, commissionAmount) => {
//     return ((parseFloat(totalCharges) || 0) - (parseFloat(commissionAmount) || 0)).toFixed(2);
//   };

//   const calculateGSTAmount = (netTotalCharges, cgst, sgst, igst) => {
//     const gstPercent = (parseFloat(cgst) || 0) + (parseFloat(sgst) || 0) + (parseFloat(igst) || 0);
//     const gstAmount = ((parseFloat(netTotalCharges) || 0) * gstPercent) / 100;
//     return gstAmount.toFixed(2);
//   };

//   // Handler to update all related fields
//   const handleCommissionOrTotalChargesChange = () => {
//     const totalCharges = parseFloat(form.getFieldValue('totalcharges')) || 0;
//     const percent = parseFloat(form.getFieldValue('icomissionpercent')) || 0;
//     let commission = 0;
//     let netTotalCharges = totalCharges;

//     if (percent > 0) {
//       commission = calculateCommissionAmount(totalCharges, percent);
//       netTotalCharges = calculateNetTotalCharges(totalCharges, commission);
//     } else {
//       commission = 0;
//       netTotalCharges = totalCharges;
//     }

//     const cgst = parseFloat(form.getFieldValue('cgstpercent')) || 0;
//     const sgst = parseFloat(form.getFieldValue('sgstpercent')) || 0;
//     const igst = parseFloat(form.getFieldValue('igstpercent')) || 0;
//     const gstAmount = parseFloat(calculateGSTAmount(netTotalCharges, cgst, sgst, igst)) || 0;

//     // Calculate RO Billed Amount as netTotalCharges + gstAmount
//     const robillamount = (parseFloat(netTotalCharges) + gstAmount).toFixed(2);

//     form.setFieldsValue({
//       icomissionamount: commission,
//       gstamount: gstAmount.toFixed(2),
//       robillamount: robillamount,
//       taxableamount: robillamount,
//       invoiceamount: robillamount
//     });
//   };

//   const calculateDiscountAmount = (robillamount, discountPercent) => {
//     return ((parseFloat(robillamount) || 0) * (parseFloat(discountPercent) || 0) / 100).toFixed(2);
//   };

//   const handleDiscountPercentChange = () => {
//     const robillamount = parseFloat(form.getFieldValue('robillamount')) || 0;
//     const discountPercent = parseFloat(form.getFieldValue('discountpercent')) || 0;
//     const discountAmount = calculateDiscountAmount(robillamount, discountPercent);
//     const taxable = (robillamount - discountAmount).toFixed(2);

//     form.setFieldsValue({
//       discountamount: discountAmount,
//       taxableamount: taxable,
//       invoiceamount: taxable
//     });
//   };

//   const handleInvoiceGSTTypeChange = (value) => {
//   const selectedGST = gsts.find((gst) => gst.value === value);
//   if (!selectedGST) return;

//   const taxableamount = parseFloat(form.getFieldValue('taxableamount')) || 0;

//   // Use the correct field names from your GST master
//   const icgstPercent = selectedGST.cgstpercent || 0;
//   const isgstPercent = selectedGST.sgstpercent || 0;
//   const iigstPercent = selectedGST.igstpercent || 0;

//   const icgstAmount = ((taxableamount * icgstPercent) / 100).toFixed(2);
//   const isgstAmount = ((taxableamount * isgstPercent) / 100).toFixed(2);
//   const iigstAmount = ((taxableamount * iigstPercent) / 100).toFixed(2);
  

//   setData((prev) => ({
//     ...prev,
//     invoicegstid: value,
//     icgstpercent: icgstPercent,
//     isgstpercent: isgstPercent,
//     iigstpercent: iigstPercent,
//     icgstamount: icgstAmount,
//     isgstamount: isgstAmount,
//     iigstamount: iigstAmount
//   }));

//   form.setFieldsValue({
//     invoicegstid: value,
//     icgstpercent: icgstPercent,
//     isgstpercent: isgstPercent,
//     iigstpercent: iigstPercent,
//     icgstamount: icgstAmount,
//     isgstamount: isgstAmount,
//     iigstamount: iigstAmount
//   });

//   // Calculate invoice bill amount with GST
//   const invoiceAmount = (
//     taxableamount +
//     parseFloat(icgstAmount) +
//     parseFloat(isgstAmount) +
//     parseFloat(iigstAmount)
//   );
//   form.setFieldsValue({ invoiceamount: invoiceAmount.toFixed(2) });
// };

//   useEffect(() => {
//     loadData();
//     loadROData();
//     loadROInvoices();
//   }, [id]);

//   return (
//     <main id="main" className="main" style={{ backgroundColor: "#f5f5f5", padding: 20 }}>
//       <div className="pagetitle">
//         <h1>E-Media RO Billing</h1>
//         <nav>
//           <ol className="breadcrumb">
//             <li className="breadcrumb-item">
//               <Link to={"/"}>E-Media</Link>
//             </li>
//             <li className="breadcrumb-item active">Billing</li>
//           </ol>
//         </nav>
//       </div>

//       <Card style={{
//         backgroundColor: '#ccccff',
//         borderRadius: '8px',
//         padding: '16px',
//         boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
//         width: '100%' // Ensure card takes full width of its container
//       }}>
//         <Form form={form} layout="vertical">
//           <section className="section" style={{ width: '100%' }}> {/* Make section full width */}
//             <div style={{ width: '100%' }}> {/* Make this div full width */}
//               <Row gutter={[8, 4]}>
//                 <Col span={4}>
//                   <Form.Item label="Invoice No" name="invoiceno" style={{ marginBottom: '8px' }}>
//                     <Input
//                       id="invoiceNo"
//                       placeholder=""
//                       style={{ width: "100%" }}
//                       type="number"
//                       value={data.invoiceno}
//                       onChange={(e) => setData({ ...data, invoiceno: Number(e.target.value) })}
//                     />
//                   </Form.Item>
//                 </Col>
//                 <Col span={4}>
//                   <Form.Item label="Invoice Date" name="invoicedate" style={{ marginBottom: '8px' }}>
//                     <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
//                   </Form.Item>
//                 </Col>
//               </Row>
//               <div style={{
//                 backgroundColor: '#e6e6ff',
//                 borderRadius: '8px',
//                 padding: '16px',
//                 boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
//                 width: '100%', // Make this div full width
//                 marginTop: '16px' // Add some spacing between sections
//               }}>
//                 <Row gutter={[8, 4]}>
//                   <Col span={4}>
//                     <Form.Item label="RO No" name="rono" style={{ marginBottom: '8px' }}>
//                       <Input style={{ width: '100%' }} readOnly />
//                     </Form.Item>
//                   </Col>
//                   <Col span={4}>
//                     <Form.Item label="RO Date" name="rodate" style={{ marginBottom: '8px' }}>
//                       <Input style={{ width: '100%' }} readOnly />
//                     </Form.Item>
//                   </Col>
//                   <Col span={6}>
//                     <Form.Item label="Publication" name="emediaid" style={{ marginBottom: '8px' }}>
//                       <Input style={{ width: '100%' }} readOnly />
//                     </Form.Item>
//                   </Col>
//                   <Col span={6}>
//                     <Form.Item label="Broadcast Center" name="centers" style={{ marginBottom: '8px' }}>
//                       <Input style={{ width: '130%' }} readOnly />
//                     </Form.Item>
//                   </Col>
//                 </Row>
//                 <div style={{
//                   // backgroundColor: '#f48fb1', borderColor: '#9b59b6',
//                   backgroundColor: '#4d194d   ',
//                   borderRadius: '8px',
//                   padding: '16px',
//                   boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
//                   width: '100%', // Make this div full width
//                   marginTop: '16px' // Add some spacing between sections
//                 }}>
//                   <Row gutter={[8, 4]}>
//                     <Col span={8}>
//                       <Form.Item label="Client" name="clientid" style={{ marginBottom: '8px' }}>
//                         <Input style={{ width: '80%' }} readOnly />
//                       </Form.Item>
//                     </Col>
//                     <Col span={8}>
//                       <Form.Item label="Billing Against Client" name="billclientid" style={{ marginBottom: '8px' }}>
//                         <Select style={{ width: '120%' }} options={clients}
//                           value={data.billclientid}
//                           onChange={(value) => setData({ ...data, billclientid: value })} />
//                       </Form.Item>
//                     </Col>
//                   </Row>
//                 </div>
//                 <Row gutter={[13]}>
//                   <Col span={6}>
//                     <Form.Item label="Language" name="language" style={{ marginBottom: '8px' }}>
//                       <Input style={{ width: '80%' }} readOnly />
//                     </Form.Item>
//                   </Col>
//                   <Col span={6}>
//                     <Form.Item label="Caption" name="caption" style={{ marginBottom: '8px' }}>
//                       <Input style={{ width: '190%' }} readOnly />
//                     </Form.Item>
//                   </Col>
//                 </Row>
//                 <Row gutter={[13]}>
//                   <Col span={6}>
//                     <Form.Item label="RO GST Tax Type" name="gstid">
//                       <Select
//                         showSearch
//                         allowClear
//                         placeholder="Select"
//                         style={{ width: '200px' }}
//                       />
//                     </Form.Item>
//                   </Col>
//                   <Col span={6}>
//                     <Form.Item label="RO CGST %" name="cgstpercent" style={{ marginBottom: '8px' }}>
//                       <Input style={{ width: '80%' }} readOnly />
//                     </Form.Item>
//                   </Col>
//                   <Col span={6}>
//                     <Form.Item label="RO SGST %" name="sgstpercent" style={{ marginBottom: '8px' }}>
//                       <Input style={{ width: '80%' }} readOnly />
//                     </Form.Item>
//                   </Col>
//                   <Col span={6}>
//                     <Form.Item label="RO IGST %" name="igstpercent" style={{ marginBottom: '8px' }}>
//                       <Input style={{ width: '80%' }} readOnly />
//                     </Form.Item>
//                   </Col>
//                 </Row>
//                 <Table
//                   columns={columns}
//                   dataSource={items}
//                   pagination={false}
//                   rowKey="key"
//                   bordered
//                   scroll={{ x: 'max-content' }}
//                 /><br />
//                 <Row gutter={[13]}>
//                   <Col span={4}>
//                     <Form.Item label="Total Spots" name="totalspots" style={{ marginBottom: '8px' }}>
//                       <Input style={{ width: '80%' }} />
//                     </Form.Item>
//                   </Col>
//                   <Col span={4}>
//                     <Form.Item label="Total Charges" name="totalcharges" style={{ marginBottom: '8px' }}>
//                       <Input
//                         style={{ width: '80%' }}
//                         onChange={handleCommissionOrTotalChargesChange}
//                       />
//                     </Form.Item>
//                   </Col>
//                   <Col span={4}>
//                     <Form.Item label="Commision (%)" name="icomissionpercent" style={{ marginBottom: '8px' }}>
//                       <Input
//                         style={{ width: '80%' }}
//                         onChange={handleCommissionOrTotalChargesChange}
//                       />
//                     </Form.Item>
//                   </Col>
//                   <Col span={4}>
//                     <Form.Item label="Commision Amount" name="icomissionamount" style={{ marginBottom: '8px' }}>
//                       <Input style={{ width: '80%' }} readOnly />
//                     </Form.Item>
//                   </Col>
//                   <Col span={4}>
//                     <Form.Item label="GST Amount" name="gstamount" style={{ marginBottom: '8px' }}>
//                       <Input style={{ width: '80%' }} readOnly />
//                     </Form.Item>
//                   </Col>
//                   <Col span={4}>
//                     <Form.Item label="RO Billed Amount" name="robillamount" style={{ marginBottom: '8px' }}>
//                       <Input style={{ width: '80%' }} />
//                     </Form.Item>
//                   </Col>
//                 </Row>
//               </div>
//               <Divider />
//               <Row gutter={[13]}>
//                 <Col span={8}>
//                   <Form.Item label="Discount(%)" name="discountpercent" style={{ marginBottom: '8px' }}>
//                     <Input
//                       type="number"
//                       style={{ width: '80%' }}
//                       onChange={handleDiscountPercentChange}
//                     />
//                   </Form.Item>
//                 </Col>
//                 <Col span={8}>
//                   <Form.Item label="Discount Amount" name="discountamount" style={{ marginBottom: '8px' }}>
//                     <Input style={{ width: '80%' }} readOnly />
//                   </Form.Item>
//                 </Col>
//                 <Col span={8}>
//                   <Form.Item label="Taxable Amount" name="taxableamount" style={{ marginBottom: '8px' }}>
//                     <Input style={{ width: '80%' }} readOnly />
//                   </Form.Item>
//                 </Col>
//               </Row>
//               <Row gutter={[8, 4]}>
//                 <Col span={5}>
//                   <Form.Item label="GST Tax Type" name="invoicegstid">
//                     <Select
//                       showSearch
//                       allowClear
//                       placeholder="Select"
//                       options={gsts}
//                       style={{ width: '200px' }}
//                       onChange={handleInvoiceGSTTypeChange}
//                     />
//                   </Form.Item>

//                   <Form.Item name="icgstpercent" hidden>
//                     <Input />
//                   </Form.Item>
//                   <Form.Item name="isgstpercent" hidden>
//                     <Input />
//                   </Form.Item>
//                   <Form.Item name="iigstpercent" hidden>
//                     <Input />
//                   </Form.Item>
//                 </Col>
//                 <Col span={5}>
//                   <Form.Item label={`CGST (${data.icgstpercent}%)`} name="icgstamount" style={{ marginBottom: '8px' }} >
//                     <Input style={{ width: '100%' }} />
//                   </Form.Item>
//                 </Col>
//                 <Col span={5}>
//                   <Form.Item label={`SGST (${data.isgstpercent}%)`} name="isgstamount" style={{ marginBottom: '8px' }}>
//                     <Input style={{ width: '100%' }} />
//                   </Form.Item>
//                 </Col>
//                 <Col span={5}>
//                   <Form.Item label={`IGST (${data.iigstpercent}%)`} name="iigstamount" style={{ marginBottom: '8px' }}>
//                     <Input style={{ width: '100%' }} />
//                   </Form.Item>
//                 </Col>
//               </Row>
//               <Row gutter={[13]}>
//                 <Col span={8}>
//                   <Form.Item label="Invoice Amount" name="invoiceamount" style={{ marginBottom: '8px' }}>
//                     <Input style={{ width: '80%' }} />
//                   </Form.Item>
//                 </Col>
//                 <Col span={8}>
//                   <Form.Item label="Advance" name="advance" style={{ marginBottom: '8px' }}>
//                     <Input style={{ width: '80%' }} />
//                   </Form.Item>
//                 </Col>
//                 <Col span={8}>
//                   <Form.Item label="Instructions" name="instructions" style={{ marginBottom: '8px' }}>
//                     <Input style={{ width: '80%' }} readOnly />
//                   </Form.Item>
//                 </Col>
//               </Row>
//             </div>
//           </section>
//         </Form>
//       </Card><br />
//       <Row justify="center" gutter={16}>
//         <Col>
//           <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
//             {isEditMode ? "Update" : "Save"}
//           </Button>
//         </Col>
//         <Col>
//           <Button
//             icon={<PrinterOutlined />}
//             style={{
//               backgroundColor: '#669999',  // muted teal
//               color: '#ffffff',            // white text
//               borderColor: '#5c8a8a'       // slightly darker teal border
//             }}
//           >
//             Print
//           </Button>
//         </Col>
//         <Col>
//           <Button
//             icon={<CloseOutlined />}
//             onClick={handleCancel}
//             style={{
//               backgroundColor: '#FFB800',  // vibrant amber
//               color: '#ffffff',            // white text for readability
//               borderColor: '#e6a500'       // slightly darker border
//             }}
//           >
//             Cancel
//           </Button>
//         </Col>
//         <Col>
//           <Popconfirm
//             title="Are you sure you want to delete this record?"
//             onConfirm={handleDelete}
//             okText="Yes"
//             cancelText="No"
//           >
//             <Button type="primary" danger icon={<DeleteOutlined />}>
//               Delete
//             </Button>
//           </Popconfirm>
//         </Col>
//       </Row>
//     </main>
//   );
// };

// export default EMediaROBilling;



// import React from 'react';
// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Card, Form, Row, Col, Button, Select, DatePicker, Input, Typography, Table, Popconfirm, message, Tooltip } from 'antd';
// import { SearchOutlined, RedoOutlined, EditOutlined, DeleteOutlined, PrinterOutlined, DollarOutlined } from '@ant-design/icons';
// import axios from 'axios';
// import dayjs from 'dayjs';

// const { Text } = Typography;

// function EMediaROList() {
//     let agency = JSON.parse(localStorage.getItem("agency")) || null;
//     const navigate = useNavigate();
//     const [searchForm] = Form.useForm();
//     const [loading, setLoading] = useState(false);
//     const [dataSource, setDataSource] = useState([]);
//     const [originalData, setOriginalData] = useState([]);
//     const [emedias, setEmedias] = useState([]);
//     const [clients, setClients] = useState([]);

//     const onSearch = (values) => {
//         let filtered = [...originalData];
//         setDataSource(filtered);
//     };

//     const onResetSearch = () => {
//         searchForm.resetFields();
//         setDataSource(originalData);
//     };

//     const statusOptions = [
//         { label: "All (Billed & Not Billed)", value: "all" },
//         { label: "Not Billed", value: "not_billed" },
//         { label: "Billed", value: "billed" },
//         { label: "Cancelled", value: "cancelled" },
//     ];

//     const paystatusOptions = [
//         { label: "All", value: "all" },
//         { label: "Partially", value: "partially" },
//         { label: "Fully", value: "fully" },
//         { label: "Not Paid", value: "not_paid" },
//     ];

//     const columns = [
//         {
//             title: 'Actions',
//             dataIndex: 'actions',
//             key: 'actions',
//             width: 100,
//             render: (_, record) => (
//                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center' }}>
//                     <div style={{ display: 'flex', gap: '4px' }}>
//                         <Tooltip title="Click to edit"
//                             overlayInnerStyle={{
//                                 backgroundColor: '#3b82f6', // Yellow background
//                             }}>
//                             <Button
//                                 size="small"
//                                 icon={<EditOutlined />}
//                                 style={{ background: '#3b82f6', color: '#fff' }}
//                                 onClick={() => navigate(`/emedia/emediaROMaster/${record.key}`)}
//                             />
//                         </Tooltip>
//                         <Tooltip title="Click to delete"
//                             overlayInnerStyle={{
//                                 backgroundColor: '#ef4444', // Yellow background
//                             }}>
//                             <Popconfirm
//                                 title="Are you sure to delete this RO?"
//                                 onConfirm={() => deleteRO(record.key)}
//                                 okText="Yes"
//                                 cancelText="No"
//                             >
//                                 <Button
//                                     size="small"
//                                     icon={<DeleteOutlined />}
//                                     style={{ background: '#ef4444', color: '#fff' }}
//                                 />
//                             </Popconfirm>
//                         </Tooltip>
//                     </div>
//                     <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
//                         <Tooltip title="Click to print"
//                             overlayInnerStyle={{
//                                 backgroundColor: '#22c55e', // Yellow background
//                             }}>
//                             <Button
//                                 size="small"
//                                 icon={<PrinterOutlined />}
//                                 style={{ background: '#22c55e', color: '#fff' }}
//                                 onClick={() => handlePrint(record.key)}
//                             />
//                         </Tooltip>
//                         <Tooltip title="Click to add / view packages and payment transactions"
//                             overlayInnerStyle={{
//                                 backgroundColor: '#be185d', // Yellow background
//                             }}>
//                             <Button
//                                 size="small"
//                                 icon={<DollarOutlined />}
//                                 style={{ background: '#be185d', color: '#fff' }}
//                                 onClick={() => navigate(`/emedia/emediaInvoicePayment/${record.key}`)}
//                             />
//                         </Tooltip>
//                     </div>
//                 </div >
//             ),
//         },
//         {
//             title: 'RO No',
//             dataIndex: 'rono',
//             key: 'roNo',
//             width: 80,
//             onCell: (record) => ({
//                 style: {
//                     backgroundColor: record.invoiceno ? '#ffb6d1' : '#ff0000', // Light pink if has invoice, else red
//                     color: '#000000', // Black text for better readability
//                     textAlign: 'center',
//                     padding: '4px'
//                 }
//             }),
//             // render: (text, record) => (
//             //     <div>
//             //         <div style={{ color: '#ffffff' }}>{text}</div>
//             //         <button
//             //             style={{
//             //                 marginTop: '4px',
//             //                 backgroundColor: '#ffcc00',
//             //                 color: '#000000',
//             //                 fontStyle: 'italic',
//             //                 textTransform: 'lowercase',
//             //                 fontWeight: 'bold',
//             //                 border: 'none',
//             //                 borderRadius: '2px',
//             //                 padding: '1px 4px',
//             //                 cursor: 'pointer',
//             //                 fontSize: '10px',
//             //                 lineHeight: '1'
//             //             }}
//             //             onClick={() => handleBillingClick(record)}
//             //         >
//             //             billing
//             //         </button>
//             //     </div>
//             // )
//             render: (text, record) => (
//                 <div>
//                     <div style={{ color: record.invoiceno ? '#000000' : '#ffffff' }}>{text}</div>

//                     <Tooltip title="Click to go to billing"
//                         overlayInnerStyle={{
//                             backgroundColor: '#ffcc00', // Yellow background
//                         }}>
//                         <button
//                             style={{
//                                 marginTop: '4px',
//                                 backgroundColor: '#ffcc00',
//                                 color: '#ffffff',
//                                 fontStyle: 'italic',
//                                 textTransform: 'lowercase',
//                                 fontWeight: 'bold',
//                                 border: 'none',
//                                 borderRadius: '4px',
//                                 padding: '2px 6px',
//                                 cursor: 'pointer',
//                                 fontSize: '12px'
//                             }}
//                             onClick={() => navigate(`/emedia/emediaROBilling/${record.key}`)}
//                         >
//                             billing
//                         </button>
//                     </Tooltip>

//                 </div>
//             )
//         },
//         { title: 'RO Date', dataIndex: 'rodate', key: 'roDate', width: 100 },
//         { title: 'Invoice No', dataIndex: 'invoiceno', key: 'invoiceNo', width: 80 },
//         { title: 'Invoice Date', dataIndex: 'invoicedate', key: 'invoiceDate', width: 100 },
//         { title: 'Client', dataIndex: 'clientid', key: 'client', width: 120 },
//         { title: 'Publication', dataIndex: 'emediaid', key: 'publication', width: 120 },
//         { title: 'RO Amount', dataIndex: 'robillamount', key: 'amount', width: 80 },
//         { title: 'Discount', dataIndex: 'discountamount', key: 'discountamount', width: 80 },
//         {
//             title: 'GST',
//             dataIndex: 'gstamount',
//             key: 'gstPercent',
//             width: 80,
//             render: (_, record) => {
//                 // Safely parse and sum the GST amounts
//                 const icgst = parseFloat(record.icgstamount) || 0;
//                 const isgst = parseFloat(record.isgstamount) || 0;
//                 const iigst = parseFloat(record.iigstamount) || 0;
//                 const totalGST = icgst + isgst + iigst;
//                 return totalGST ? totalGST.toFixed(2) : '';
//             }
//         },
//         { title: 'Invoice Amount', dataIndex: 'invoiceamount', key: 'invoiceamount', width: 100 },
//         { title: 'Paid', dataIndex: 'paid', key: 'paid', width: 80 },
//         { title: 'Remaining', dataIndex: 'remaining', key: 'remaining', width: 100 },
//     ];

//     const deleteRO = async (id) => {
//         try {
//             setLoading(true);
//             const response = await axios.delete(`http://localhost:8081/emediaros/${id}`);
//             if (response.data.status === "success") {
//                 message.success("RO deleted successfully");
//                 // Reload both data and RO data
//                 loadData().then(({ emedias, clients }) => {
//                     loadROData(emedias, clients);
//                 });
//             }
//         } catch (err) {
//             console.error("Error deleting RO:", err);
//             message.error("An error occurred while deleting the RO");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handlePrint = (agencyid, invoiceid) => {
//         navigate(`/emedia/emediaROPrint/${agencyid}/${invoiceid}`);
//     };

//     function loadData() {
//         return Promise.all([
//             axios.get("http://localhost:8081/emedias"),
//             axios.get(`http://localhost:8081/clients/${agency._id}`)
//         ]).then(([emediasRes, clientsRes]) => {
//             const emediasList = (emediasRes.data?.data || []).map(emedia => ({
//                 label: emedia.name,
//                 value: emedia._id
//             }));
//             const clientsList = (clientsRes.data?.data || []).map(client => ({
//                 label: client.name,
//                 value: client._id
//             }));
//             setEmedias(emediasList);
//             setClients(clientsList);
//             return { emedias: emediasList, clients: clientsList }; // return for chaining
//         }).catch((err) => {
//             console.error("Error loading data:", err);
//             setEmedias([]);
//             setClients([]);
//             return { emedias: [], clients: [] };
//         });
//     };

//     function loadROData(emediasList, clientsList) {
//         setLoading(true);
//         axios.get("http://localhost:8081/emediaros")
//             .then(async (res) => {
//                 if (res.data && Array.isArray(res.data.data)) {
//                     const ros = res.data.data;
//                     const roIds = ros.map(ro => ro._id);

//                     // Fetch all invoices for these ROs
//                     const invoiceRes = await axios.post("http://localhost:8081/emediaroinvoices/by-ro-ids", { roIds });
//                     const invoices = invoiceRes.data.data;

//                     // Map emediaroid to invoice
//                     const invoiceMap = {};
//                     invoices.forEach(inv => {
//                         invoiceMap[inv.emediaroid] = inv;
//                     });

//                     const formattedData = ros.map((ro) => {
//                         const invoice = invoiceMap[ro._id] || {};
//                         return {
//                             key: ro._id,
//                             rono: ro.rono,
//                             rodate: dayjs(ro.rodate).format('DD/MM/YYYY'),
//                             clientid: clientsList.find(c => c.value === ro.clientid)?.label || ro.clientid,
//                             emediaid: emediasList.find(e => e.value === ro.emediaid)?.label || ro.emediaid,
//                             robillamount: ro.robillamount,
//                             // Invoice fields:
//                             invoiceno: invoice.invoiceno || '',
//                             invoiceamount: invoice.invoiceamount || '',
//                             invoicedate: invoice.invoicedate ? dayjs(invoice.invoicedate).format('DD/MM/YYYY') : '',
//                             discountamount: invoice.discountamount || '',
//                             icgstamount: invoice.icgstamount || 0,
//                             isgstamount: invoice.isgstamount || 0,
//                             iigstamount: invoice.iigstamount || 0,

//                             // ...other fields as needed
//                         };
//                     });
//                     setDataSource(formattedData);
//                     setOriginalData(formattedData);
//                 } else {
//                     setDataSource([]);
//                     setOriginalData([]);
//                 }
//             })
//             .catch((err) => {
//                 console.error("Error fetching RO data:", err);
//                 setDataSource([]);
//                 setOriginalData([]);
//             })
//             .finally(() => {
//                 setLoading(false);
//             });
//     };

//     useEffect(() => {
//         loadData().then(({ emedias, clients }) => {
//             loadROData(emedias, clients); // pass freshly loaded data
//         });
//     }, []);

//     return (
//         <main id="main" className="main" style={{ backgroundColor: "#f5f5f5", padding: 20 }}>
//             <div className="pagetitle">
//                 <h1>E-Media RO List</h1>
//                 <nav>
//                     <ol className="breadcrumb">
//                         <li className="breadcrumb-item">
//                             <Link to={"/"}>E-Media</Link>
//                         </li>
//                         <li className="breadcrumb-item active">RO List</li>
//                     </ol>
//                 </nav>
//             </div>

//             <Card
//                 title="Search E-Medias"
//                 // style={{ maxWidth: 1200, margin: '0 auto', padding: '12px', backgroundColor: "#f5f5f5" }} // Reduce padding here
//                 bodyStyle={{ padding: '8px' }} // Important: reduces inner padding
//                 style={{ maxWidth: 1200, margin: '0 auto' }}
//             >

//                 <Form form={searchForm} layout="vertical" onFinish={onSearch}>
//                     <Row gutter={[8, 4]}>
//                         <Col span={8}>
//                             <Form.Item
//                                 label="STATUS"
//                                 name="status"
//                                 style={{ marginBottom: '8px' }}
//                             >
//                                 <Select
//                                     showSearch
//                                     allowClear
//                                     placeholder="Select Bill status"
//                                     disabled={loading}
//                                     style={{ width: '100%' }}
//                                     options={statusOptions}
//                                     filterOption={(input, option) =>
//                                         option.label.toLowerCase().includes(input.toLowerCase())
//                                     }
//                                 />
//                             </Form.Item>
//                         </Col>
//                         <Col span={8}>
//                             <Form.Item label="PUBLICATION" name="publication" style={{ marginBottom: '8px' }} >
//                                 <Select
//                                     showSearch
//                                     allowClear
//                                     placeholder="Select"
//                                     disabled={loading}
//                                     style={{ width: '100%' }}
//                                     options={emedias}
//                                     filterOption={(input, option) =>
//                                         option.label.toLowerCase().includes(input.toLowerCase())
//                                     }
//                                 />
//                             </Form.Item>
//                         </Col>
//                         <Col span={8}>
//                             <Form.Item label="CLIENT" name="clientid" style={{ marginBottom: '8px' }} >
//                                 <Select
//                                     showSearch
//                                     allowClear
//                                     placeholder="Select Client"
//                                     disabled={loading}
//                                     style={{ width: '100%' }}
//                                     options={clients}
//                                     filterOption={(input, option) =>
//                                         option.label.toLowerCase().includes(input.toLowerCase())
//                                     }
//                                 />
//                             </Form.Item>
//                         </Col>
//                         <Col span={8}>
//                             <Form.Item label="PAY STATUS" name="pay status" style={{ marginBottom: '8px' }} >
//                                 <Select
//                                     showSearch
//                                     allowClear
//                                     placeholder="Select Pay status"
//                                     disabled={loading}
//                                     style={{ width: '100%' }}
//                                     options={paystatusOptions}
//                                     filterOption={(input, option) =>
//                                         option.label.toLowerCase().includes(input.toLowerCase())
//                                     }
//                                 />
//                             </Form.Item>
//                         </Col>
//                         <Col span={8}>
//                             <Form.Item label="SEARCH RO/INVOICE NO" name="pay status" style={{ marginBottom: '8px' }} >
//                                 <Input.Search
//                                     placeholder="Search..."
//                                     disabled={loading}
//                                     style={{ width: '100%' }}
//                                     onSearch={(value) => console.log(value)} // Add your search handler here
//                                     enterButton
//                                 />
//                             </Form.Item>
//                         </Col>
//                     </Row>
//                     <Row gutter={[8, 4]}>
//                         <Col span={8}>
//                             <Form.Item label="FROM DATE" name="fromDate" style={{ marginBottom: '8px' }} >
//                                 <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
//                             </Form.Item>
//                         </Col>
//                         <Col span={8}>
//                             <Form.Item label="TO DATE" name="toDate" style={{ marginBottom: '8px' }} >
//                                 <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
//                             </Form.Item>
//                         </Col>
//                     </Row>
//                     <Row justify="start" gutter={16}>
//                         <Col>
//                             <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
//                                 SHOW
//                             </Button>
//                         </Col>
//                         <Col>
//                             <Button danger type="primary" onClick={onResetSearch} icon={<RedoOutlined />}>
//                                 RESET
//                             </Button>
//                         </Col>
//                         <Col>
//                             <Button
//                                 type="primary"
//                                 onClick={() => navigate('/emedia/emediaROMaster')}
//                             >
//                                 Add New RO
//                             </Button>
//                         </Col>
//                     </Row>
//                 </Form>
//             </Card>

//             <Card title="RO Records" style={{ maxWidth: 1200, margin: '24px auto' }} >
//                 <div style={{ padding: "16px 16px 0 16px" }}>
//                     <Text type="danger" style={{ fontSize: 16 }}>
//                         Total records: {dataSource.length}
//                     </Text>
//                 </div>

//                 <Table
//                     className="striped-table"
//                     columns={columns}
//                     dataSource={dataSource}
//                     pagination={{ pageSize: 10 }}
//                     bordered
//                     size="middle"
//                     loading={loading}
//                     style={{ marginTop: 12 }}
//                 />
//             </Card>
//         </main>
//     )
// };

// export default EMediaROList;



import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Modal, Button, Input, DatePicker, Table, message, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

function EMediaInvoicePayment() {
    const [open, setOpen] = useState(false);
    const [invoice, setInvoice] = useState(null);
    const [emediaro, setEmediaro] = useState(null);
    const [emedia, setEmedia] = useState(null);
    const [paymentDate, setPaymentDate] = useState(dayjs());
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const navigate = useNavigate();
    const { id } = useParams(); // Get invoice ID from route

    useEffect(() => {
        setOpen(true);
        if (id) {
            fetchInvoice(id);
        }
    }, [id]);

    // Fetch invoice by emediaroid
    const fetchInvoice = async (emediaroid) => {
        const res = await axios.get(`http://localhost:8081/emediaroinvoices/by-emediaroid/${emediaroid}`);
        setInvoice(res.data.data);
        if (res.data.data?.emediaroid) {
            // If emediaroid is an object, use ._id, else use as is
            const emediaroId = res.data.data.emediaroid._id || res.data.data.emediaroid;
            fetchEmediaro(emediaroId);
        }
    };

    const fetchEmediaro = async (emediaroId) => {
        const res = await axios.get(`http://localhost:8081/emediaros/${emediaroId}`);
        setEmediaro(res.data.data);
        if (res.data.data?.emediaid) {
            const emediaId = res.data.data.emediaid._id || res.data.data.emediaid;
            fetchEmedia(emediaId);
        }
        console.log("Fetched E-Media RO:", res.data.data.emediaid);
    };

    const fetchEmedia = async (emediaId) => {
        const res = await axios.get(`http://localhost:8081/emedias/${emediaId}`);
        setEmedia(res.data.data);
        console.log("Fetched E-Media:", res.data.data);

    };

    // Dummy data for table
    const columns = [
        { title: 'No', dataIndex: 'no', key: 'no', width: 50 },
        { title: 'Payment Date', dataIndex: 'paymentdate', key: 'date' },
        { title: 'Description', dataIndex: 'description', key: 'desc' },
        { title: 'Amount', dataIndex: 'amount', key: 'amount' },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <Popconfirm
                    title="Are you sure to delete this Payment?"
                    onConfirm={() => handleDeletePayment(record._id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        size='small'
                    />
                </Popconfirm>
            ),
            width: '5%',
        },
    ];
    const data = [];

    // Save payment handler
    const handleSavePayment = async () => {
        if (!paymentDate || !description || !amount) {
            message.error('Please fill all payment fields.');
            return;
        }
        try {
            await axios.patch(
                `http://localhost:8081/emediaroinvoices/${invoice._id}/add-payment`,
                {
                    payment: {
                        paymentdate: paymentDate.toISOString(),
                        description,
                        amount: parseFloat(amount),
                    },
                }
            );
            message.success('Payment saved!');
            // Optionally, refresh invoice data to update table
            fetchInvoice(id);
            setDescription('');
            setAmount('');
            setPaymentDate(dayjs());
        } catch (err) {
            message.error('Failed to save payment.');
        }
    };

    // Delete payment handler
    const handleDeletePayment = async (paymentId) => {
        try {
            await axios.patch(
                `http://localhost:8081/emediaroinvoices/${invoice._id}/delete-payment`,
                { paymentId }
            );
            message.success('Payment deleted!');
            // Optionally, refresh invoice data to update table
            fetchInvoice(id);
        } catch (err) {
            message.error('Failed to delete payment.');
        }
    };

    return (
        <main id="main" className="main" style={{ backgroundColor: "#f5f5f5", padding: 20 }}>
            <Modal
                open={open}
                footer={null}
                closable={false}
                width={1000}
                bodyStyle={{ padding: 32 }}
                style={{ right: 100, top: 120, position: 'absolute' }}
            >
                <h4
                    style={{
                        color: '#ff9800',
                        textAlign: 'center',
                        marginBottom: 24,
                        fontWeight: 'bold',
                    }}
                >
                    E-Media Invoice Payment Details
                </h4>
                <hr />
                <div style={{ borderBottom: '1px solid #eee', marginBottom: 16, paddingBottom: 16 }}>
                    {/* Row 1 */}
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            fontWeight: 600,
                            marginBottom: 12,
                        }}
                    >
                        <div style={{ minWidth: '200px' }}>
                            <span style={{ fontWeight: 'bold' }}>Invoice No : </span>{invoice?.invoiceno || ''}
                        </div>
                        <div style={{ minWidth: '200px' }}>
                            <span style={{ fontWeight: 'bold' }}>Invoice Date : </span>{invoice?.invoicedate ? new Date(invoice.invoicedate).toLocaleDateString('en-GB') : ''}
                        </div>
                        <div style={{ minWidth: '200px' }}>
                            <span style={{ fontWeight: 'bold' }}>RO No : </span>{emediaro?.rono || ''}
                        </div>
                        <div style={{ minWidth: '200px' }}>
                            <span style={{ fontWeight: 'bold' }}>RO Date : </span>{emediaro?.rodate ? new Date(emediaro.rodate).toLocaleDateString('en-GB') : ''}
                        </div>
                    </div>
                    {/* Row 2 */}
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            fontWeight: 600,
                        }}
                    >
                        <div style={{ minWidth: '300px', marginLeft: 0 }}>
                            <span style={{ fontWeight: 'bold' }}>Client : </span>{emediaro?.clientid.name || ''}
                        </div>
                        <div style={{ minWidth: '297px', marginLeft: 24 }}>
                            <span style={{ fontWeight: 'bold' }}>Publication : </span>{emediaro?.emediaid.name || ''}
                        </div><br />
                        <div style={{ minWidth: '300px', marginTop: 16 }} >
                            <span style={{ fontWeight: 'bold' }}>Invoice Amount : </span>{invoice?.invoiceamount || ''}
                        </div>
                        <div style={{ minWidth: '430px', marginTop: 16 }}>
                            <span style={{ fontWeight: 'bold' }}>Remaining Amount : </span>
                            {(invoice?.payments?.length === 0 || !invoice?.payments)
                                ? invoice?.invoiceamount
                                : invoice?.remainingamount || ''}
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 24 }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: 16 }}>
                            <label>Payment Date</label>
                            <DatePicker style={{ width: '100%' }} defaultValue={dayjs()} format="DD/MM/YYYY" value={paymentDate} onChange={setPaymentDate} />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label>Description</label>
                            <Input value={description} onChange={e => setDescription(e.target.value)} />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label>Amount</label><br />
                            <Input
                                type="number"
                                value={amount}
                                style={{ width: '50%' }}
                                onChange={e => setAmount(e.target.value)}
                            />
                        </div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <Table
                            columns={columns}
                            dataSource={invoice?.payments?.map((p, i) => ({
                                key: i,
                                no: i + 1,
                                paymentdate: p.paymentdate ? new Date(p.paymentdate).toLocaleDateString('en-GB') : '',
                                description: p.description,
                                amount: p.amount,
                                _id: p._id,
                            })) || []}
                            pagination={false}
                            bordered
                            size="small"
                        />
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: 24, marginBottom: 0 }}>
                    <Button type="primary" style={{ marginRight: 16, width: 120 }} onClick={handleSavePayment}>SAVE</Button>
                    <Button danger style={{ width: 120 }} onClick={() => navigate('/emedia/emediaROList')}>CLOSE</Button>
                </div>
            </Modal>
        </main>
    );
}

export default EMediaInvoicePayment;
