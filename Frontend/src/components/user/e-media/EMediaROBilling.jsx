import { useState, React, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Card, Form, Row, Col, Input, DatePicker, Select, Divider, Button, Popconfirm, message, TimePicker, Table, Alert } from 'antd';
import { SaveOutlined, CloseOutlined, PrinterOutlined, PlusOutlined, DeleteOutlined, } from "@ant-design/icons";
import axios from 'axios';
import dayjs from 'dayjs';
import moment from 'moment';

function EMediaROBilling() {
  const [loading, setLoading] = useState(true);
  const agency = JSON.parse(localStorage.getItem("agency")) || null;
  const agencyid = agency?._id;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [clients, setClients] = useState([]);
  const { RangePicker } = DatePicker;
  const [gsts, setGsts] = useState([]);
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [data, setData] = useState({
    id: "",
    agencyid: agency._id,
    invoiceno: "",
    invoicedate: "",
    billclientid: "",
    discountpercent: "",
    discountamount: "",
    taxableamount: "",
    gstid: "",
    cgstamount: "",
    sgstamount: "",
    igstamount: "",
    invoiceamount: "",
    advance: "",

    invoicegstid: "",
    icgstpercent: 0, // CGST percentage
    icgstamount: 0,
    isgstpercent: 0, // CGST percentage
    isgstamount: 0,
    iigstpercent: 0, // CGST percentage
    iigstamount: 0,
  });
  const [roInvoices, setRoInvoices] = useState([]);

  const handleCancel = () => {
    navigate("/emedia/emediaROList");
  };

  const loadData = () => {
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
        console.error("Error fetching GSTs:", err);
      });
  };

  const loadROData = () => {
    axios.get(`http://localhost:8081/emediaros/${id}`)
      .then((res) => {
        if (res.data && res.data.status === 'success') {
          const roData = res.data.data;

          form.setFieldsValue({
            // ...existing fields...
            rono: roData.rono,
            rodate: roData.rodate ? dayjs(roData.rodate) : null,
            emediaid: roData.emediaid.name,
            centers: roData.centers,
            clientid: roData.clientid.name,
            language: roData.language,
            caption: roData.caption,
            comissionpercent: roData.comissionpercent,
            comissionamount: roData.comissionamount,
            robillamount: roData.robillamount,
            totalcharges: roData.totalcharges,
            totalspots: roData.totalspots,
            gstid: roData.gstid.title,
            cgstpercent: roData.cgstpercent,
            sgstpercent: roData.sgstpercent,
            igstpercent: roData.igstpercent,
            instructions: roData.instructions,
            chequeno: roData.chequeno,
            chequedate: roData.chequedate ? dayjs(roData.chequedate) : null,
            bankname: roData.bankname
          });

          if (roData.items && roData.items.length > 0) {
            const formattedItems = roData.items.map(item => ({
              key: item._id || Date.now(),
              fromToDate: item.fromToDate ? [
                dayjs(item.fromToDate[0]),
                dayjs(item.fromToDate[1])
              ] : null,
              days: item.days,
              fromTime: item.fromTime ? moment(item.fromTime, 'HH:mm:ss') : null,
              toTime: item.toTime ? moment(item.toTime, 'HH:mm:ss') : null,
              dailySpots: item.dailySpots,
              totalSpots: item.totalSpots,
              bonusPaid: item.bonusPaid,
              caption: item.caption,
              charges: item.charges,
              duration: item.duration,
              totalCharges: item.totalCharges
            }));
            setItems(formattedItems);
          }

          // --- ADD THIS LINE: recalculate GST and RO Billed Amount on load ---
          setTimeout(() => handleCommissionOrTotalChargesChange(), 0);
        } else {
          message.error("RO data not found");
        }
      })
      .catch((err) => {
        console.error("Error fetching RO data:", err);
        message.error("Failed to load RO data");
      });
  };

  const loadROInvoices = () => {
    axios.get(`http://localhost:8081/emediaroinvoices/by-ro/${id}`)
      .then(res => {
        if (res.data && res.data.status === 'success' && res.data.data.length > 0) {
          const invoiceData = res.data.data[0];
          setRoInvoices(invoiceData);
          console.log("Invoice Data:", invoiceData);

          const formattedData = {
            ...invoiceData,
            invoicedate: invoiceData.invoicedate ? dayjs(invoiceData.invoicedate) : null,
            icgstpercent: invoiceData.icgstpercent || 0,
            isgstpercent: invoiceData.isgstpercent || 0,
            iigstpercent: invoiceData.iigstpercent || 0,
            icgstamount: invoiceData.icgstamount || 0,
            isgstamount: invoiceData.isgstamount || 0,
            iigstamount: invoiceData.iigstamount || 0,
          };

          form.setFieldsValue(formattedData);


          // Also update data state for label display
          setData(prev => ({
            ...prev,
            icgstpercent: invoiceData.icgstpercent || 0,
            isgstpercent: invoiceData.isgstpercent || 0,
            iigstpercent: invoiceData.iigstpercent || 0,
            icgstamount: invoiceData.icgstamount || 0,
            isgstamount: invoiceData.isgstamount || 0,
            iigstamount: invoiceData.iigstamount || 0,
          }));

        } else {
          message.info("No invoice found for this RO");
        }
      })
      .catch(err => {
        console.error("Error fetching RO invoices:", err);
        setRoInvoices(null);
      });

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
          value={record.fromToDate}
        // style={{ width: '100%', backgroundColor: '#f48fb1', borderColor: '#9b59b6' }}
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
          readOnly
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
          readOnly
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
          readOnly
        />
      ),
    },
    {
      title: "Charges(10sec)",
      dataIndex: "charges",
      key: "charges",
      width: 140,
      render: (text, record, index) => (
        <Input
          value={text}
          onChange={e => {
            const newItems = [...items];
            const charges = parseFloat(e.target.value) || 0;
            const duration = parseFloat(newItems[index].duration) || 0;
            const totalSpots = parseFloat(newItems[index].totalSpots) || 0;
            newItems[index].charges = e.target.value;
            // Calculate totalCharges using the formula
            newItems[index].totalCharges = ((charges / 10) * duration * totalSpots).toFixed(2);
            setItems(newItems);

            // --- NEW: Sum all totalCharges and update form field ---
            const totalChargesSum = newItems.reduce(
              (sum, item) => sum + (parseFloat(item.totalCharges) || 0),
              0
            );
            form.setFieldsValue({ totalcharges: totalChargesSum.toFixed(2) });

            // --- NEW: Trigger full calculation chain ---
            handleCommissionOrTotalChargesChange();
          }}
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
          readOnly
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
        // style={{ width: '100%', backgroundColor: '#d1c4e9', borderColor: '#9b59b6' }}
        />
      ),
    }
  ];

  const handleDelete = () => {
    axios.delete(`http://localhost:8081/emediaros/${id}`)
      .then((res) => {
        if (res.data && res.data.status === 'success') {
          message.success("Record deleted successfully");
          navigate("/emedia/emediaROList"); // Navigate back to the list page
        } else {
          message.error("Failed to delete the record");
        }
      })
      .catch((err) => {
        console.error("Error deleting record:", err);
        message.error("An error occurred while deleting the record");
      });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const payload = {
        agencyid: agency._id,
        emediaroid: id, // Link to the RO record
        ...values,
        invoicedate: values.invoicedate ? dayjs(values.invoicedate).format('YYYY-MM-DD') : null
      };

      // If editing existing invoice
      if (roInvoices._id) {
        await axios.put(`http://localhost:8081/emediaroinvoices/${roInvoices._id}`, payload);
        message.success("Invoice updated successfully");
      } else {
        // Creating new invoice
        await axios.post('http://localhost:8081/emediaroinvoices', payload);
        message.success("Invoice created successfully");
      }

      // // Save to emediaroinvoices
      // await axios.post('http://localhost:8081/emediaroinvoices', payload);

      message.success("Billing information saved successfully");
      navigate("/emedia/emediaROList");

    } catch (err) {
      console.error("Save error:", err);
      message.error(err.response?.data?.message || "Failed to save billing data");
    } finally {
      setLoading(false);
    }
  };

  const calculateCommissionAmount = (totalCharges, percent) => {
    const commission = ((parseFloat(totalCharges) || 0) * (parseFloat(percent) || 0)) / 100;
    return commission.toFixed(2);
  };

  const calculateNetTotalCharges = (totalCharges, commissionAmount) => {
    return ((parseFloat(totalCharges) || 0) - (parseFloat(commissionAmount) || 0)).toFixed(2);
  };

  const calculateGSTAmount = (netTotalCharges, cgst, sgst, igst) => {
    const gstPercent = (parseFloat(cgst) || 0) + (parseFloat(sgst) || 0) + (parseFloat(igst) || 0);
    const gstAmount = ((parseFloat(netTotalCharges) || 0) * gstPercent) / 100;
    return gstAmount.toFixed(2);
  };

  // --- Place these functions above your component or inside it before use ---

  // Helper to recalculate GST and invoice amount
  const recalculateGST = (taxableAmount) => {
    const taxable = parseFloat(taxableAmount) || 0;
    const icgstPercent = parseFloat(form.getFieldValue('icgstpercent')) || 0;
    const isgstPercent = parseFloat(form.getFieldValue('isgstpercent')) || 0;
    const iigstPercent = parseFloat(form.getFieldValue('iigstpercent')) || 0;

    const icgstAmount = ((taxable * icgstPercent) / 100).toFixed(2);
    const isgstAmount = ((taxable * isgstPercent) / 100).toFixed(2);
    const iigstAmount = ((taxable * iigstPercent) / 100).toFixed(2);

    const invoiceAmount = (
      taxable +
      parseFloat(icgstAmount) +
      parseFloat(isgstAmount) +
      parseFloat(iigstAmount)
    ).toFixed(2);

    form.setFieldsValue({
      icgstamount: icgstAmount,
      isgstamount: isgstAmount,
      iigstamount: iigstAmount,
      invoiceamount: invoiceAmount
    });

    setData(prev => ({
      ...prev,
      icgstamount: icgstAmount,
      isgstamount: isgstAmount,
      iigstamount: iigstAmount
    }));
  };

  // Update the discount handler to trigger GST recalculation
  const handleDiscountPercentChange = () => {
    const robillamount = parseFloat(form.getFieldValue('robillamount')) || 0;
    const discountPercent = parseFloat(form.getFieldValue('discountpercent')) || 0;
    const discountAmount = ((robillamount * discountPercent) / 100).toFixed(2);
    const taxable = (robillamount - discountAmount).toFixed(2);

    form.setFieldsValue({
      discountamount: discountAmount,
      taxableamount: taxable,
    });

    // Trigger GST recalculation after discount changes
    recalculateGST(taxable);
  };

  // Update GST type handler to set new percentages and recalculate GST
  const handleInvoiceGSTTypeChange = (value) => {
    const selectedGST = gsts.find((gst) => gst.value === value);
    if (!selectedGST) return;

    const taxableamount = parseFloat(form.getFieldValue('taxableamount')) || 0;

    const updates = {
      invoicegstid: value,
      icgstpercent: selectedGST.cgstpercent || 0,
      isgstpercent: selectedGST.sgstpercent || 0,
      iigstpercent: selectedGST.igstpercent || 0,
    };

    setData(prev => ({ ...prev, ...updates }));
    form.setFieldsValue(updates);

    // Recalculate GST amounts with new percentages
    recalculateGST(taxableamount);
  };

  // Update commission/charges handler to flow through all calculations
  const handleCommissionOrTotalChargesChange = () => {
    const totalCharges = parseFloat(form.getFieldValue('totalcharges')) || 0;
    const percent = parseFloat(form.getFieldValue('icomissionpercent')) || 0;
    let commission = 0;
    let netTotalCharges = totalCharges;

    if (percent > 0) {
      commission = calculateCommissionAmount(totalCharges, percent);
      netTotalCharges = calculateNetTotalCharges(totalCharges, commission);
    }

    const cgst = parseFloat(form.getFieldValue('cgstpercent')) || 0;
    const sgst = parseFloat(form.getFieldValue('sgstpercent')) || 0;
    const igst = parseFloat(form.getFieldValue('igstpercent')) || 0;
    const gstAmount = parseFloat(calculateGSTAmount(netTotalCharges, cgst, sgst, igst)) || 0;

    const robillamount = (parseFloat(netTotalCharges) + gstAmount).toFixed(2);

    form.setFieldsValue({
      icomissionamount: commission,
      gstamount: gstAmount.toFixed(2),
      robillamount: robillamount,
      taxableamount: robillamount // This will trigger discount and GST recalculations
    });

    // Trigger discount and GST recalculations
    handleDiscountPercentChange();
  };

  useEffect(() => {
    loadData();
    loadROData();
    loadROInvoices();
  }, [id]);

  return (
    <main id="main" className="main" style={{ backgroundColor: "#f5f5f5", padding: 20 }}>
      <div className="pagetitle">
        <h1>E-Media RO Billing</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to={"/"}>E-Media</Link>
            </li>
            <li className="breadcrumb-item active">Billing</li>
          </ol>
        </nav>
      </div>

      <Card style={{
        backgroundColor: '#ccccff',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        width: '100%' // Ensure card takes full width of its container
      }}>
        <Form form={form} layout="vertical">
          <section className="section" style={{ width: '100%' }}> {/* Make section full width */}
            <div style={{ width: '100%' }}> {/* Make this div full width */}
              <Row gutter={[8, 4]}>
                <Col span={4}>
                  <Form.Item label="Invoice No" name="invoiceno" style={{ marginBottom: '8px' }}>
                    <Input
                      id="invoiceNo"
                      placeholder=""
                      style={{ width: "100%" }}
                      type="number"
                      value={data.invoiceno}
                      onChange={(e) => setData({ ...data, invoiceno: Number(e.target.value) })}
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item label="Invoice Date" name="invoicedate" style={{ marginBottom: '8px' }}>
                    <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
                  </Form.Item>
                </Col>
              </Row>
              <div style={{
                backgroundColor: '#e6e6ff',
                borderRadius: '8px',
                padding: '16px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                width: '100%', // Make this div full width
                marginTop: '16px' // Add some spacing between sections
              }}>
                <Row gutter={[8, 4]}>
                  <Col span={4}>
                    <Form.Item label="RO No" name="rono" style={{ marginBottom: '8px' }}>
                      <Input style={{ width: '100%' }} readOnly />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="RO Date" name="rodate" style={{ marginBottom: '8px' }}>
                      <Input style={{ width: '100%' }} readOnly />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Publication" name="emediaid" style={{ marginBottom: '8px' }}>
                      <Input style={{ width: '100%' }} readOnly />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Broadcast Center" name="centers" style={{ marginBottom: '8px' }}>
                      <Input style={{ width: '130%' }} readOnly />
                    </Form.Item>
                  </Col>
                </Row>
                <div style={{
                  // backgroundColor: '#f48fb1', borderColor: '#9b59b6',
                  backgroundColor: '#4d194d   ',
                  borderRadius: '8px',
                  padding: '16px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  width: '100%', // Make this div full width
                  marginTop: '16px' // Add some spacing between sections
                }}>
                  <Row gutter={[8, 4]}>
                    <Col span={8}>
                      <Form.Item label="Client" name="clientid" style={{ marginBottom: '8px' }}>
                        <Input style={{ width: '80%' }} readOnly />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="Billing Against Client" name="billclientid" style={{ marginBottom: '8px' }}>
                        <Select style={{ width: '120%' }} options={clients}
                          value={data.billclientid}
                          onChange={(value) => setData({ ...data, billclientid: value })} />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
                <Row gutter={[13]}>
                  <Col span={6}>
                    <Form.Item label="Language" name="language" style={{ marginBottom: '8px' }}>
                      <Input style={{ width: '80%' }} readOnly />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Caption" name="caption" style={{ marginBottom: '8px' }}>
                      <Input style={{ width: '190%' }} readOnly />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[13]}>
                  <Col span={6}>
                    <Form.Item label="RO GST Tax Type" name="gstid">
                      <Select
                        showSearch
                        allowClear
                        placeholder="Select"
                        style={{ width: '200px' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="RO CGST %" name="cgstpercent" style={{ marginBottom: '8px' }}>
                      <Input style={{ width: '80%' }} readOnly />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="RO SGST %" name="sgstpercent" style={{ marginBottom: '8px' }}>
                      <Input style={{ width: '80%' }} readOnly />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="RO IGST %" name="igstpercent" style={{ marginBottom: '8px' }}>
                      <Input style={{ width: '80%' }} readOnly />
                    </Form.Item>
                  </Col>
                </Row>
                <Table
                  columns={columns}
                  dataSource={items}
                  pagination={false}
                  rowKey="key"
                  bordered
                  scroll={{ x: 'max-content' }}
                /><br />
                <Row gutter={[13]}>
                  <Col span={4}>
                    <Form.Item label="Total Spots" name="totalspots" style={{ marginBottom: '8px' }}>
                      <Input style={{ width: '80%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="Total Charges" name="totalcharges" style={{ marginBottom: '8px' }}>
                      <Input
                        style={{ width: '80%' }}
                        onChange={handleCommissionOrTotalChargesChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="Commision (%)" name="icomissionpercent" style={{ marginBottom: '8px' }}>
                      <Input
                        style={{ width: '80%' }}
                        onChange={handleCommissionOrTotalChargesChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="Commision Amount" name="icomissionamount" style={{ marginBottom: '8px' }}>
                      <Input style={{ width: '80%' }} readOnly />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="GST Amount" name="gstamount" style={{ marginBottom: '8px' }}>
                      <Input style={{ width: '80%' }} readOnly />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="RO Billed Amount" name="robillamount" style={{ marginBottom: '8px' }}>
                      <Input style={{ width: '80%' }} />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
              <Divider />
              <Row gutter={[13]}>
                <Col span={8}>
                  <Form.Item label="Discount(%)" name="discountpercent" style={{ marginBottom: '8px' }}>
                    <Input
                      type="number"
                      style={{ width: '80%' }}
                      onChange={handleDiscountPercentChange}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Discount Amount" name="discountamount" style={{ marginBottom: '8px' }}>
                    <Input style={{ width: '80%' }} readOnly />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Taxable Amount" name="taxableamount" style={{ marginBottom: '8px' }}>
                    <Input style={{ width: '80%' }} readOnly />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[8, 4]}>
                <Col span={5}>
                  <Form.Item label="GST Tax Type" name="invoicegstid">
                    <Select
                      showSearch
                      allowClear
                      placeholder="Select"
                      options={gsts}
                      style={{ width: '200px' }}
                      onChange={handleInvoiceGSTTypeChange}
                    />
                  </Form.Item>

                  <Form.Item name="icgstpercent" hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item name="isgstpercent" hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item name="iigstpercent" hidden>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item label={`CGST (${data.icgstpercent}%)`} name="icgstamount" style={{ marginBottom: '8px' }} >
                    <Input style={{ width: '100%' }} readOnly />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item label={`SGST (${data.isgstpercent}%)`} name="isgstamount" style={{ marginBottom: '8px' }}>
                    <Input style={{ width: '100%' }} readOnly />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item label={`IGST (${data.iigstpercent}%)`} name="iigstamount" style={{ marginBottom: '8px' }}>
                    <Input style={{ width: '100%' }} readOnly />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[13]}>
                <Col span={8}>
                  <Form.Item label="Invoice Amount" name="invoiceamount" style={{ marginBottom: '8px' }}>
                    <Input style={{ width: '80%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Advance" name="advance" style={{ marginBottom: '8px' }}>
                    <Input style={{ width: '80%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Instructions" name="instructions" style={{ marginBottom: '8px' }}>
                    <Input style={{ width: '80%' }} readOnly />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </section>
        </Form>
      </Card><br />
      <Row justify="center" gutter={16}>
        <Col>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
            {isEditMode ? "Update" : "Save"}
          </Button>
        </Col>
        <Col>
          <Button
            icon={<PrinterOutlined />}
            style={{
              backgroundColor: '#669999',  // muted teal
              color: '#ffffff',            // white text
              borderColor: '#5c8a8a'       // slightly darker teal border
            }}
          >
            Print
          </Button>
        </Col>
        <Col>
          <Button
            icon={<CloseOutlined />}
            onClick={handleCancel}
            style={{
              backgroundColor: '#FFB800',  // vibrant amber
              color: '#ffffff',            // white text for readability
              borderColor: '#e6a500'       // slightly darker border
            }}
          >
            Cancel
          </Button>
        </Col>
        <Col>
          <Popconfirm
            title="Are you sure you want to delete this record?"
            onConfirm={handleDelete}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Col>
      </Row>
    </main>
  );
};

export default EMediaROBilling;