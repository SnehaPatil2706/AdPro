import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Card, Form, Input, DatePicker, Select, Button, Row, Col, Divider, InputNumber, Table, message, } from "antd";
import { SaveOutlined, CloseOutlined, PrinterOutlined, PlusOutlined, DeleteOutlined, } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Option } = Select;

function InvoiceMaster() {
    const { id } = useParams();
    const agency = JSON.parse(localStorage.getItem("agency")) || null;
    const [form] = Form.useForm();
    const [clients, setClients] = useState([]);
    const [gstTypes, setGstTypes] = useState([]);
    const [items, setItems] = useState([
        { key: Date.now(), particular: "", quantity: 1, amount: 0, total: 0 },
        { key: Date.now() + 1, particular: "", quantity: 1, amount: 0, total: 0 },
    ]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [invoiceNoExists, setInvoiceNoExists] = useState(false);
    const navigate = useNavigate();
    const [data, setData] = useState({
        id: "",
        agencyid: agency?._id,
        invoiceNo: "",
        invoiceDate: "",
        clientid: "",
        amount: 0,
        discount: 0,
        taxableAmount: 0,
        cgstPercent: 0,
        cgstAmount: 0,
        sgstPercent: 0,
        sgstAmount: 0,
        igstPercent: 0,
        igstAmount: 0,
        billAmount: 0,
        gstType: "",
    });

    const agencyid = agency?._id;

    const fetchNextInvoiceNo = async () => {
        if (!id && agencyid) {
            try {
                const res = await axios.get(`http://localhost:8081/invoices/last/${agencyid}`);
                if (res.data && res.data.invoiceNo) {
                    form.setFieldsValue({ invoiceNo: res.data.invoiceNo });
                    setData((prev) => ({ ...prev, invoiceNo: res.data.invoiceNo }));
                }
            } catch (err) {
                console.error("Error fetching next invoice number:", err);
                message.error("Failed to fetch next invoice number");
            }
        }
    };

    useEffect(() => {
        const fetchClients = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8081/clients/${agencyid}`);
                if (response.data && Array.isArray(response.data.data)) {
                    setClients(response.data.data);
                } else {
                    message.error("Invalid response format");
                }
            } catch (error) {
                message.error(error.message || "Failed to fetch clients");
            } finally {
                setLoading(false);
            }
        };

        const fetchGSTs = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`http://localhost:8081/gsts/${agencyid}`);
                console.log("GST API Response:", res.data); // Add this to see the actual response

                if (res.data && Array.isArray(res.data.data)) {
                    const transformedGstTypes = res.data.data.map((gst) => ({
                        value: gst._id,
                        label: gst.name || gst.title, // Adjust based on actual field names
                        cgstpercent: gst.cgstPercent || gst.cgstpercent || 0,
                        sgstpercent: gst.sgstPercent || gst.sgstpercent || 0,
                        igstpercent: gst.igstPercent || gst.igstpercent || 0,
                    }));
                    console.log("Transformed GST Types:", transformedGstTypes); // Verify the transformed data
                    setGstTypes(transformedGstTypes);
                } else {
                    message.error("Invalid GST data format");
                }
            } catch (error) {
                console.error("Error fetching GSTs:", error);
                message.error(error.message || "Failed to fetch gsts");
            } finally {
                setLoading(false);
            }
        };
        // console.log(setGstTypes);

        fetchClients();
        fetchGSTs();
        fetchNextInvoiceNo();
    }, [agencyid, id]);

    useEffect(() => {
        const fetchInvoice = async () => {
            if (id) {
                try {
                    setLoading(true);
                    const response = await axios.get(`http://localhost:8081/invoices/${agencyid}/${id}`);
                    if (response.data && response.data.status === "success") {
                        const invoice = response.data.data;

                        form.setFieldsValue({
                            invoiceNo: invoice.invoiceNo,
                            invoiceDate: dayjs(invoice.invoiceDate),
                            clientid: invoice.clientid._id,
                            gstType: invoice.gstType,
                        });

                        setItems(invoice.items || []);
                        setData({
                            ...data,
                            ...invoice,
                            invoiceDate: dayjs(invoice.invoiceDate),
                        });

                        setIsEditMode(true);
                    } else {
                        message.error("Failed to fetch invoice data");
                    }
                } catch (error) {
                    console.error("Error fetching invoice:", error);
                    message.error("Failed to fetch invoice data");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchInvoice();
    }, [id, agencyid]);

    const handleItemChange = (value, field, index) => {
        const updatedItems = [...items];
        updatedItems[index][field] = value;
        updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].amount;
        setItems(updatedItems);

        const totalAmount = updatedItems.reduce((sum, item) => sum + item.total, 0);
        setData((prev) => ({
            ...prev,
            amount: totalAmount,
            taxableAmount: totalAmount - (prev.discount || 0),
        }));
    };

    const handleDiscountChange = (value) => {
        const discountPercent = value || 0; // Treat the input as a percentage
        const discountAmount = (data.amount * discountPercent) / 100; // Calculate the discount amount
        const taxableAmount = data.amount - discountAmount;

        const cgstAmount = (taxableAmount * data.cgstPercent) / 100;
        const sgstAmount = (taxableAmount * data.sgstPercent) / 100;
        const igstAmount = (taxableAmount * data.igstPercent) / 100;
        const billAmount = taxableAmount + cgstAmount + sgstAmount + igstAmount;

        setData((prev) => ({
            ...prev,
            discount: discountPercent, // Store the percentage value
            taxableAmount,
            cgstAmount,
            sgstAmount,
            igstAmount,
            billAmount,
        }));
    };

    const handleSave = async () => {
        try {
            let formdata = { ...data, details: items };
            console.log(formdata, "Data");
            setLoading(true); // Start loading
            const values = await form.validateFields();

            const cgstAmount = parseFloat(((data.taxableAmount * data.cgstPercent) / 100).toFixed(2));
            const sgstAmount = parseFloat(((data.taxableAmount * data.sgstPercent) / 100).toFixed(2));
            const igstAmount = parseFloat(((data.taxableAmount * data.igstPercent) / 100).toFixed(2));
            const billAmount = parseFloat((data.taxableAmount + cgstAmount + sgstAmount + igstAmount).toFixed(2));

            console.log("Taxable Amount:", data.taxableAmount);
            console.log("CGST Amount:", cgstAmount);
            console.log("SGST Amount:", sgstAmount);
            console.log("IGST Amount:", igstAmount);
            console.log("Calculated Bill Amount:", billAmount);

            const payload = {
                ...data,
                ...values,
                invoiceDate: values.invoiceDate.format("YYYY-MM-DD"),
                items,
                amount: data.amount,
                taxableAmount: data.taxableAmount,
                cgstAmount,
                sgstAmount,
                igstAmount,
                billAmount,
                details: items,
            };

            if (isEditMode) {
                await axios.put(`http://localhost:8081/invoices/${id}`, payload);
                message.success("Invoice updated successfully");
            } else {
                await axios.post("http://localhost:8081/invoices", payload);
                message.success("Invoice created successfully");
            }

            navigate("/invoice/invoiceList");
        } catch (error) {
            console.error("Save error:", error);
            message.error(
                error.response?.data?.message || "Failed to save invoice. Please check the form and try again."
            );
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleInvoiceNoChange = (e) => {
        const value = e.target.value;
        setData((prev) => ({ ...prev, invoiceNo: value }));
        form.setFieldsValue({ invoiceNo: value });
    };

    const handleGstTypeChange = (value) => {
        const selectedGst = gstTypes.find((gst) => gst.value === value);
        if (!selectedGst) return;

        const taxableAmount = data.taxableAmount;
        const cgstAmount = (taxableAmount * selectedGst.cgstpercent) / 100;
        const sgstAmount = (taxableAmount * selectedGst.sgstpercent) / 100;
        const igstAmount = (taxableAmount * selectedGst.igstpercent) / 100;
        const billAmount = taxableAmount + cgstAmount + sgstAmount + igstAmount;

        setData((prev) => ({
            ...prev,
            gstType: value,
            cgstPercent: selectedGst.cgstpercent,
            sgstPercent: selectedGst.sgstpercent,
            igstPercent: selectedGst.igstpercent,
            cgstAmount,
            sgstAmount,
            igstAmount,
            billAmount,
        }));
    };

    const handleCancel = () => {
        setItems([
            { key: Date.now(), particular: "", quantity: 1, amount: 0, total: 0 },
            { key: Date.now() + 1, particular: "", quantity: 1, amount: 0, total: 0 },
        ]);
        setIsEditMode(false);
        setData({
            id: "",
            agencyid: agency._id,
            invoiceNo: "",
            invoiceDate: "",
            clientid: "",
            amount: 0,
            discount: 0,
            taxableAmount: 0,
            cgstPercent: 0,
            sgstPercent: 0,
            igstPercent: 0,
            gstType: "",
            billAmount: 0,
        });
        form.resetFields();
        fetchNextInvoiceNo();
        navigate("/invoice/invoiceList");
    };

    const handleAddRow = () => {
        const newItem = {
            key: Date.now(),
            particular: "",
            quantity: 1,
            amount: 0,
            total: 0,
        };
        setItems([...items, newItem]);
    };

    const handleDeleteRow = (key) => {
        setItems(items.filter((item) => item.key !== key));
    };

    const columns = [
        {
            title: "Sr. No",
            key: "sr",
            render: (_, __, index) => index + 1,
        },
        {
            title: "Particular",
            dataIndex: "particular",
            render: (text, record, index) => (
                <Input
                    value={text}
                    onChange={(e) => handleItemChange(e.target.value, "particular", index)}
                    placeholder="Item"
                />
            ),
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            render: (value, record, index) => (
                <InputNumber
                    min={1}
                    value={value}
                    onChange={(val) => handleItemChange(val, "quantity", index)}
                />
            ),
        },
        {
            title: "Amount",
            dataIndex: "amount",
            render: (value, record, index) => (
                <InputNumber
                    min={0}
                    value={value}
                    onChange={(val) => handleItemChange(val, "amount", index)}
                />
            ),
        },
        {
            title: "Total",
            dataIndex: "total",
            render: (_, record) => <span>{record.total || 0}</span>,
        },
        {
            title: "Action",
            render: (_, record) => (
                <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteRow(record.key)}
                />
            ),
        },
    ];

    return (
        <main id="main" className="main">
            <div className="pagetitle">
                <h1>Design & Printing Invoice Master</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to={"/"}>Invoice</Link>
                        </li>
                        <li className="breadcrumb-item active">Invoice Master</li>
                    </ol>
                </nav>
            </div>

            <Card title="INVOICE" style={{ maxWidth: 1200, margin: "0 auto" }}>
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                label="Invoice No"
                                name="invoiceNo"
                                rules={[
                                    { required: true, message: 'Please enter invoice number' },
                                    { pattern: /^[0-9]+$/, message: 'Invoice number should contain only numbers' }
                                ]}
                                validateStatus={invoiceNoExists ? 'error' : ''}
                                help={invoiceNoExists ? 'Invoice number already exists' : ''}
                            >
                                <Input onChange={handleInvoiceNoChange} placeholder="Enter invoice number" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Invoice Date" name="invoiceDate" rules={[{ required: true }]}>
                                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="clientid" label="Client" rules={[{ required: true }]}>
                                <Select
                                    placeholder="Select Client"
                                    options={clients.map((c) => ({
                                        label: c.name,
                                        value: c._id,
                                    }))}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider />

                    <Table columns={columns} dataSource={items} pagination={false} rowKey="key" bordered />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        style={{ margin: "16px 0", float: "right" }}
                        onClick={handleAddRow}
                    >
                        Add Item
                    </Button>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item label="Amount">
                                <InputNumber style={{ width: "100%" }} value={data.amount} readOnly />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Discount (%)">
                                <InputNumber
                                    style={{ width: "100%" }}
                                    value={data.discount}
                                    min={0}
                                    max={100} // Optional: Limit the discount to 100%
                                    onChange={handleDiscountChange}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Taxable Amount">
                                <InputNumber style={{ width: "100%" }} value={data.taxableAmount} readOnly />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item label="GST Type" name="gstType" rules={[{ required: true }]}>
                                <Select
                                    placeholder="Select GST Type"
                                    options={gstTypes}
                                    onChange={handleGstTypeChange}
                                    loading={loading}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label={`CGST (${data.cgstPercent}%)`}>
                                <InputNumber style={{ width: "100%" }} readOnly value={(data.taxableAmount * data.cgstPercent / 100).toFixed(2)} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label={`SGST (${data.sgstPercent}%)`}>
                                <InputNumber style={{ width: "100%" }} readOnly value={(data.taxableAmount * data.sgstPercent / 100).toFixed(2)} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label={`IGST (${data.igstPercent}%)`}>
                                <InputNumber style={{ width: "100%" }} readOnly value={(data.taxableAmount * data.igstPercent / 100).toFixed(2)} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Bill Amount">
                                <InputNumber
                                    style={{ width: "100%" }}
                                    readOnly
                                    value={parseFloat((data.taxableAmount + (data.taxableAmount * (data.cgstPercent + data.sgstPercent + data.igstPercent) / 100)).toFixed(2))}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify="center" gutter={16}>
                        <Col>
                            <Button type="primary" icon={<SaveOutlined />} htmlType="submit">
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

export default InvoiceMaster;