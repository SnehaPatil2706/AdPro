import React from 'react';
import moment from 'moment';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios, { all } from 'axios';
import { Card, Form, Row, Col, Input, Button, Table, Select, DatePicker, InputNumber, Divider, Space, message } from 'antd';
import { SaveOutlined, PrinterOutlined, PlusOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { Typography } from "antd";
import dayjs from "dayjs";


const { Title } = Typography;
const { Option } = Select;

function PMediaROMaster() {
 const { id } = useParams();
  const agency = JSON.parse(localStorage.getItem("agency")) || null;
  const agencyid = agency?._id;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [clients, setClients] = useState([]);
  const [papers, setPapers] = useState([]);
  const [gsts, setGsts] = useState([]);
  const [items, setItems] = useState([
    {
      srno: 1,
      date: '',                      // Use Date object or dayjs/moment if using DatePicker
      caption: '',
      position: '',
      hue: '',
      size: {
        width: 0,
        height: 0
      },
      area: 0,
      paidBonus: '',                  // Should be either "Paid" or "Bonus"
      rate: 0,
      charges: 0,
      commissionpercent: 0,
      commissionamount: 0,
      cgstpercent: 0,
      cgstamount: 0,
      sgstpercent: 0,
      sgstamount: 0,
      igstpercent: 0,
      igstamount: 0,
      gsttotal: 0,
      totalcharges: 0,
      chequeno: '',
      chequedate: ''                // Use Date object or dayjs/moment
    }
  ]);

  const [originalData, setOriginalData] = useState([]);
  const navigate = useNavigate();
  const [data, setData] = useState({
    agencyid: agency?._id || "",
    rono: "",
    rodate: '',                // Date from DatePicker (use dayjs/moment if needed)
    mediabillno: "",
    mediabillamount: 0,
    clientid: "",
    pmediaid: "",
    editions: "",                 // This will hold the RO line items (matching itemSchema)
    bankname: "",
    robillamount: 0,
    instructions: "",
    gstid: "",
    cgstTotal: 0,
    sgstTotal: 0,
    igstTotal: 0,
    allgst: 0,
    totalcharges: 0,
    commissionTotal: 0,
    ccpercent: 0,
    ccamount: 0,
  });

  console.log(data);
  

  const [roTotal, setRoTotal] = useState(0);
  const [commissionTotal, setCommissionTotal] = useState(0);
  const [gst, setGst] = useState(0);
  const [gstTotal, setGstTotal] = useState(0);
  const [cgstTotal, setCgstTotal] = useState(0);
  const [sgstTotal, setSgstTotal] = useState(0);
  const [igstTotal, setIgstTotal] = useState(0);
  const [roBillTotal, setRoBillTotal] = useState(0);
  const [ccAmount, setCcAmount] = useState(0);
  const [ccpercent, setCcpercent] = useState(0);


  <DatePicker
    value={data.rodate ? moment(data.rodate) : null}
    onChange={(date) =>
      setData(prev => ({
        ...prev,
        rodate: date ? date.format("YYYY-MM-DD") : null
      }))
    }
    format="DD/MM/YYYY"
  />


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

  const fetchPapers = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/pmedias/${agencyid}`);
      if (Array.isArray(response.data?.data)) {
        setPapers(response.data.data);
        setDataSource(response.data.data);
        setOriginalData(response.data.data);
      } else {
        console.error("Expected array for papers but got:", response.data);
        setPapers([]);
      }
    } catch (error) {
      console.error("Failed to load papers", error);
      setPapers([]);
    }
  };

  const fetchGsts = async () => {
    try {
      const res = await axios.get(`http://localhost:8081/gsts/${agencyid}`);
      if (res.data && Array.isArray(res.data.data)) {
        const transformedGstTypes = res.data.data.map((gst) => ({
          value: gst._id,
          label: gst.title,
          cgstpercent: gst.cgstpercent,
          sgstpercent: gst.sgstpercent,
          igstpercent: gst.igstpercent,
        }));
        setGsts(transformedGstTypes);
      } else {
        message.error("Invalid GST data format");
      }
    } catch (error) {
      console.error("Error fetching GST types:", error);
      message.error("Failed to fetch GST types");
    }
  };

  const handleGstTypeChange = (value) => {
    const selectedGst = gsts.find((gst) => gst.value === value);
    if (!selectedGst) return;

    setData((prev) => ({
      ...prev,
      gstType: value,
      cgstpercent: selectedGst.cgstpercent,
      sgstpercent: selectedGst.sgstpercent,
      igstpercent: selectedGst.igstpercent,
    }));
  };

  // function handleChange(e) {
  //   setData({ ...data, [e.target.id]: e.target.value });
  // }

  // function loadData() {
  //   setData({
  //     id: "",
  //     agencyid: agency?._id,             
  //     rono: '',
  //     rodate: null,             // Use `moment()` or `dayjs()` if you're using Ant Design DatePicker
  //     clientid: '',             // ObjectId string
  //     pmediaid: '',             // ObjectId string
  //     gstid: '',
  //   })
  // }

  useEffect(() => {
    const fetchRecord = async () => {
      if (id) {
        try {
          console.log("Fetching record for ID:", id);
          setLoading(true);

          // Fetch clients first
          const clientsResponse = await axios.get(`http://localhost:8081/clients/${agencyid}`);
          if (clientsResponse.data?.data) {
            console.log("Clients fetched:", clientsResponse.data.data);
            setClients(clientsResponse.data.data);
          }

          // Fetch the record
          const response = await axios.get(`http://localhost:8081/pmediaros/${agencyid}/${id}`);
          if (response.data && response.data.status === "success") {
            const record = response.data.data;
            console.log("Record fetched:", record);

            // Populate form fields
            form.setFieldsValue({
              ...record,
              cgstTotal: record.cgstTotal,
              sgstTotal: record.sgstTotal,
              igstTotal: record.igstTotal,
              allgst: record.allgst,
              clientid: record.clientid?._id || null, // Extract the _id for the Select component
              rodate: record.rodate ? dayjs(record.rodate) : null,
              chequedate: record.chequedate ? dayjs(record.chequedate) : null,
            });

            // Update state
            setData({
              ...data,
              ...record,
              id: record._id, // Ensure the ID is set
            });

            // Update items with valid dayjs objects
            setItems(
              (record.items || []).map(item => ({
                ...item,
                date: item.date ? dayjs(item.date) : null,
                chequedate: item.chequedate ? dayjs(item.chequedate) : null,
                width: item.size?.width || 0,
                height: item.size?.height || 0,
                cgstpercent: item.cgstpercent ?? 0,
                sgstpercent: item.sgstpercent ?? 0,
                igstpercent: item.igstpercent ?? 0,
                cgstamount: item.cgstamount ?? 0,
                sgstamount: item.sgstamount ?? 0,
                igstamount: item.igstamount ?? 0,
                gsttotal: item.gsttotal ?? 0,
                totalcharges: item.totalcharges ?? 0,
              }))
            );

            setIsEditMode(true);
          } else {
            message.error("Failed to fetch record data");
          }
        } catch (error) {
          console.error("Error fetching record:", error);
          message.error("Failed to fetch record data");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRecord();
  }, [id, agencyid]);

  const handleSave = async () => {
    try {
      setLoading(true); // Show loading state
      const values = await form.validateFields(); // Validate form fields

      // Prepare the payload
      const payload = {
        ...data,
        ...values,
        robillamount: roBillTotal, // Value from setRoBillTotal
        ccamount: ccAmount,
        cgstTotal: cgstTotal,
        sgstTotal: sgstTotal,
        igstTotal: igstTotal,
        allgst: gstTotal,
        totalcharges: roTotal,
        commissionTotal: commissionTotal,
        items: items.map(item => ({
          ...item,
          date: item.date instanceof dayjs ? item.date.toDate() : item.date,
          chequedate: item.chequedate instanceof dayjs ? item.chequedate.toDate() : item.chequedate,
        })) || [],
        rodate: values.rodate?.toDate?.() || values.rodate || null,
        chequedate: values.chequedate?.toDate?.() || values.chequedate || null,
      };

      console.log("Payload:", payload);

      if (isEditMode) {
        // Update existing record
        const response = await axios.put(`http://localhost:8081/pmediaros/${agencyid}/${id}`, payload);
        console.log("Update Response:", response.data);
        message.success("Record updated successfully");
      } else {
        // Create new record
        const response = await axios.post("http://localhost:8081/pmediaros", payload);
        console.log("Create Response:", response.data);
        message.success("Record created successfully");
      }

      form.resetFields();
      navigate("/pmedia/pmediaROList");
    } catch (error) {
      console.error("Save error:", error);
      message.error(
        error.response?.data?.message || "Failed to save the record. Please check the form and try again."
      );
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  const handleCancel = () => {
    navigate("/pmedia/pmediaROList");
  }

  const handleInvoiceNoChange = (e) => {

  }

  useEffect(() => {
    // loadData();
    fetchClients();
    fetchPapers();
    fetchGsts();
  }, []); // Add an empty dependency array


  const [dataSource, setDataSource] = useState([
    {
      agencyid: agency?._id,             // ObjectId string
      rono: '',
      rodate: '',             // Use `moment()` or `dayjs()` if you're using Ant Design DatePicker
      mediabillno: '',             // Use `moment()` or `dayjs()` if you're using Ant Design DatePicker
      mediabillamount: 0,
      clientid: '',             // ObjectId string
      pmediaid: '',             // ObjectId string
      editions: '',
      totalcharges: 0,
      comissionpercent: 0,
      comissionamount: 0,
      chequeno: '',
      chequedate: '',         // Use `moment()` or `dayjs()` if you're using Ant Design DatePicker
      bankname: '',
      robillamount: 0,
      instructions: '',
      gstid: '',                // ObjectId string
      cgstpercent: 0,
      cgstamount: 0,
      sgetpercent: 0,
      sgstamount: 0,
      igstpercent: 0,
      igstamount: 0,
      ccpercent: 0,
      ccamount: 0,
      allgst: 0,
      commissionTotal: 0,
      totalcharges: 0,
      cgstTotal: 0,
      sgstTotal: 0,
      igstTotal: 0,
    }
  ]);

  useEffect(() => {
    const ccPercent = parseFloat(form.getFieldValue("ccpercent")) || 0;
    // When ccPercent changes, update all rows
    items.forEach((_, index) => handleInputChange(index, null, null));
  }, [form.getFieldValue("ccpercent")]); // 🔴 this won’t work as expected

  const handleInputChange = (index, field, value) => {
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      const updatedItem = { ...updatedItems[index] };

      const parseNumber = (val) => {
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num;
      };

      // Ensure size object exists
      if (!updatedItem.size) {
        updatedItem.size = { width: 0, height: 0 };
      }

      if (field === "width" || field === "height") {
        updatedItem.size[field] = parseNumber(value);
      } else if (["caption", "position", "hue", "chequeno", "paidBonus"].includes(field)) {
        updatedItem[field] = value; // keep as string
      } else {
        updatedItem[field] = parseNumber(value); // number fields
      }


      // Area calculation
      const width = parseNumber(updatedItem.size.width);
      const height = parseNumber(updatedItem.size.height);
      const area = width * height;
      updatedItem.area = area;

      // Charges
      const rate = parseNumber(updatedItem.rate);
      const charges = area * rate;
      updatedItem.charges = charges;

      // Commission
      const commissionPercent = parseNumber(updatedItem.commissionpercent);
      const commissionAmount = (charges * commissionPercent) / 100;
      updatedItem.commissionamount = commissionAmount;

      // Taxable Amount
      const taxableAmount = charges - commissionAmount;

      // GST Percentages from `data`
      const cgstPercent = parseNumber(data.cgstpercent);
      const sgstPercent = parseNumber(data.sgstpercent);
      const igstPercent = parseNumber(data.igstpercent);

      updatedItem.cgstpercent = cgstPercent;
      updatedItem.sgstpercent = sgstPercent;
      updatedItem.igstpercent = igstPercent;

      // GST Amounts
      const cgstAmount = (taxableAmount * cgstPercent) / 100;
      const sgstAmount = (taxableAmount * sgstPercent) / 100;
      const igstAmount = (taxableAmount * igstPercent) / 100;

      updatedItem.cgstamount = cgstAmount;
      updatedItem.sgstamount = sgstAmount;
      updatedItem.igstamount = igstAmount;

      const totalGst = cgstAmount + sgstAmount + igstAmount;
      updatedItem.gsttotal = totalGst;

      const originalTotal = taxableAmount + totalGst;
      updatedItem.originalTotalCharges = originalTotal;

      // CC Deduction
      const ccPercent = parseNumber(form.getFieldValue("ccpercent"));
      let ccDeduction = 0;

      if (ccPercent > 0) {
        ccDeduction = ((charges - commissionAmount) * ccPercent) / 100;
        updatedItem.totalcharges = originalTotal - ccDeduction;
      } else {
        updatedItem.totalcharges = originalTotal;
      }

      updatedItem.ccDeduction = ccDeduction;
      updatedItem.ccamount = ccDeduction; // ✅ Ensure this is present for display

      // Save back to the updated items array
      updatedItems[index] = updatedItem;

      // Recalculate totals
      const getSum = (key) =>
        updatedItems.reduce((sum, item) => sum + parseNumber(item[key]), 0);

      setRoTotal(getSum("charges"));
      setCommissionTotal(getSum("commissionamount"));
      setGstTotal(getSum("gsttotal"));
      setCgstTotal(getSum("cgstamount"));
      setSgstTotal(getSum("sgstamount"));
      setIgstTotal(getSum("igstamount"));
      setRoBillTotal(getSum("totalcharges"));

      // ✅ Set C&C Amount from `ccamount` field
      setCcAmount(getSum("ccamount"));

      // Optional GST setter
      setGst?.(getSum("cgstamount") + getSum("sgstamount") + getSum("igstamount"));

      return updatedItems;
    });
  };

  const handleBonusChange = (value, index) => {
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index] = {
        ...updatedItems[index],
        paidBonus: value,
        chequeNo: '',
        chequeDate: null,
      };
      return updatedItems;
    });
  };

  const handleAddRow = () => {
    const newItem = {
      key: Date.now(),
      date: null,
      caption: '',
      position: '',
      hue: '',
      width: '',
      height: '',
      area: '',
      rate: '',
      bonusPaid: '',
      charges: '',
      commissionPercent: '',
      commissionAmount: '',
      cgst: '',
      sgst: '',
      igst: '',
      gst: '',
      totalCharges: '',
      chequeNo: '',
      chequeDate: null,
    };


    setItems((prevItems) => {
      const updatedItems = [...prevItems, newItem];
      return updatedItems;
    });
  };

  const payOptions = [
    { label: 'Paid', value: 'paid' },
    { label: 'Bonus', value: 'bonus' },
  ];

  const handleDeleteRow = (key) => {
    setItems(items.filter((item) => item.key !== key));
  };

  const columns = [
    {
      title: "Sr. No",
      render: (_, __, index) => index + 1,
      fixed: 'left',
      width: 50,
    },
    {
      title: "Date",
      width: 120,
      dataIndex: "date",
      render: (_, record, index) => (
        <DatePicker
          format="DD/MM/YYYY"
          style={{ width: '100%', backgroundColor: '#f8d7da' }}
          value={record.date ? moment(record.date, 'DD/MM/YYYY') : null}
          onChange={(date, dateString) => handleInputChange(index, 'date', dateString)}
        />
      ),
    },
    {
      title: "Caption",
      width: 110,
      dataIndex: "caption",
      render: (_, record, index) => (
        <Input
          value={record.caption}
          placeholder="Caption"
          style={{ backgroundColor: '#f8d7da' }}
          onChange={e => handleInputChange(index, 'caption', e.target.value)}
        />
      ),
    },
    {
      title: "Position",
      width: 110,
      dataIndex: "position",
      render: (_, record, index) => (
        <Input
          value={record.position}
          placeholder="Position"
          style={{ backgroundColor: '#f8d7da' }}
          onChange={e => handleInputChange(index, 'position', e.target.value)}
        />
      ),
    },
    {
      title: "Hue",
      dataIndex: "hue",
      textAlign: "center",
      render: (_, record, index) => (
        <Select
          value={record.hue}
          placeholder="Colour"
          style={{ width: '100%' }}
          onChange={(value) => handleInputChange(index, 'hue', value)}
        >
          <Option value="Colour">Colour</Option>
          <Option value="B & W">B & W</Option>
        </Select>
      ),
    },
    {
      title: () => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div><strong>Size</strong></div>
          <div style={{ marginTop: 4, display: 'flex', gap: 20 }}>
            <input style={{ padding: '2px 6px' }} placeholder="Width" />
            <input style={{ padding: '2px 6px' }} placeholder="Height" />
          </div>
        </div>
      ),
      // dataIndex: "size",
      width: 50,
      render: (_, record, index) => (
        <div style={{ display: 'flex', gap: '4px' }}>
          <Input
            value={record.width}
            placeholder="width"
            dataIndex="width"
            style={{ backgroundColor: '#f8d7da' }}
            onChange={e => handleInputChange(index, 'width', e.target.value)}
          />
          <Input
            value={record.height}
            placeholder="height"
            dataIndex="height"
            style={{ backgroundColor: '#f8d7da' }}
            onChange={e => handleInputChange(index, 'height', e.target.value)}
          />
        </div>
      ),
    },

    {
      title: "Area",
      width: 110,
      dataIndex: "area",
      render: (_, record, index) => (
        <Input
          value={record.area}
          placeholder="area"
          style={{ backgroundColor: '#f8d7da' }}
          readOnly
        // onChange={e => handleInputChange(index, 'area', e.target.value)}
        />
      ),
    },
    {
      title: "Paid/Bonus",
      key: "paidBonus",
      dataIndex: "paidBonus",
      width: 140,
      render: (text, record, index) => (
        <Select
          showSearch
          allowClear
          placeholder="Select"
          value={record.paidBonus}
          disabled={loading}
          style={{ width: '100%' }}
          options={payOptions}
          onChange={(value) => handleBonusChange(value, index)}
          filterOption={(input, option) =>
            option.label.toLowerCase().includes(input.toLowerCase())
          }

        />
      ),
    },
    {
      title: "Rate",
      width: 110,
      dataIndex: "rate",
      render: (_, record, index) => (
        <Input
          value={record.rate}
          placeholder="rate"
          style={{ backgroundColor: '#f8d7da' }}
          options={payOptions}
          onChange={e => handleInputChange(index, 'rate', e.target.value)}
        />
      ),
    },
    {
      title: "Charges",
      width: 110,
      dataIndex: "charges",
      render: (_, record, index) => (
        <Input
          value={record.charges}
          placeholder="charges"
          style={{ backgroundColor: '#f8d7da' }}
          readOnly
        // onChange={e => handleInputChange(index, 'charges', e.target.value)}
        />
      ),
    },
    {
      title: "Com(%)",
      width: 110,
      dataIndex: "commissionpercent",
      render: (_, record, index) => (
        <Input
          value={record.commissionpercent}
          placeholder="%"
          style={{ backgroundColor: '#f8d7da' }}
          onChange={e => handleInputChange(index, 'commissionpercent', e.target.value)}
        />
      ),
    },
    {
      title: "Commission Amount",
      width: 150,
      dataIndex: "commissionamount",
      render: (_, record) => (
        <Input value={record.commissionamount} placeholder="com amount" readOnly />
      ),
    },
    {
      title: () => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ marginTop: 4, display: 'flex', gap: 30 }}>
            <div>CGST ({data.cgstpercent || 0}%)</div>
            <div>SGST ({data.sgstpercent || 0}%)</div>
            <div>IGST ({data.igstpercent || 0}%)</div>
          </div>
        </div>
      ),
      // dataIndex: "allgst",
      width: 300,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '4px' }}>
          <Input
            value={(record.cgstamount ?? 0).toFixed(2)}
            placeholder="CGST"
            style={{ backgroundColor: '#f8d7da' }}
            readOnly
          />
          <Input
            value={(record.sgstamount ?? 0).toFixed(2)}
            placeholder="SGST"
            style={{ backgroundColor: '#f8d7da' }}
            readOnly
          />
          <Input
            value={(record.igstamount ?? 0).toFixed(2)}
            placeholder="IGST"
            style={{ backgroundColor: '#f8d7da' }}
            readOnly
          />
        </div>
      ),
    },
    {
      title: "GST",
      width: 110,
      dataIndex: "gsttotal",
      render: (_, record) => (
        <Input value={record.gsttotal?.toFixed(2)} readOnly placeholder="GST" />
      ),
    },

    {
      title: "Total Charges",
      width: 150,
      dataIndex: "totalcharges",
      render: (_, record) => (
        <Input value={record.totalcharges} readOnly placeholder="Total Charges" />
      ),
    },
    {
      title: "Cheque No",
      width: 150,
      dataIndex: "chequeno",
      render: (_, record, index) => (
        <Input
          value={record.chequeno}
          placeholder="cheque no"
          style={{ backgroundColor: '#f8d7da' }}
          onChange={e => handleInputChange(index, 'chequeno', e.target.value)}
        />
      ),
    },
    {
      title: "Cheque Date",
      width: 150,
      dataIndex: "chequedate",
      render: (_, record, index) => (
        <DatePicker
          format="DD/MM/YYYY"
          value={record.chequedate ? dayjs(record.chequedate) : null}
          onChange={(date, dateString) => handleInputChange(index, 'chequedate', dateString)}
        />
      ),
    },
    {
      title: "Action",
      width: 100,
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
        <h1>P-Media RO Master</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to={"/"}>P-Media</Link>
            </li>
            <li className="breadcrumb-item active">Master Form</li>
          </ol>
        </nav>
      </div>

      <Card title="" style={{ maxWidth: 1200, margin: "0 auto", backgroundColor: "#f5f5f5" }}>
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Row gutter={[8, 4]}>
            <Col span={6}>
              <Form.Item
                label="RO No"
                name="rono"
                style={{ marginBottom: '8px' }}
              >
                <Input onChange={handleInvoiceNoChange} placeholder="Enter invoice number" style={{ width: '200px' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="RO Date" name="rodate" dataIndex="rodate" style={{ marginBottom: '8px' }}>
                <DatePicker style={{ width: "50%" }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Media Bill No" name="mediabillno" style={{ marginBottom: '8px' }}>
                <Input placeholder="Enter media bill number" style={{ width: '200px' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Media Bill Amount" name="mediabillamount" style={{ marginBottom: '8px' }}>
                <Input placeholder="Enter media bill amount" style={{ width: '200px' }} />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="Client" name="clientid" style={{ marginBottom: '8px' }}>
                <Select
                  showSearch
                  allowClear
                  placeholder="Select Client"
                  disabled={loading}
                  onChange={(value) => setData((prev) => ({ ...prev, clientid: value }))}
                >
                  {clients.map((client) => (
                    <Option key={client._id} value={client._id}>
                      {client.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Newspaper" name="pmediaid" style={{ marginBottom: '8px' }}>
                <Select
                  showSearch
                  allowClear
                  placeholder="Select Newspaper"
                  disabled={loading}
                  onChange={(value) => setData((prev) => ({ ...prev, pmediaid: value }))}
                >
                  {papers.map((paper) => (
                    <Option key={paper._id} value={paper._id}>
                      {paper.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Editions" name="editions" style={{ marginBottom: '8px' }}>
                <Input style={{ width: '200px' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="GST Type" name="gstid" style={{ backgroundColor: '#f48fb1', borderColor: '#9b59b6' }}>
                <Select
                  placeholder="Select GST Type"
                  onChange={handleGstTypeChange}
                  // onChange={(value) => setData((prev) => ({ ...prev, gstid: value }))}
                  options={gsts}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <div style={{ marginBottom: '8px' }}>
                <Title level={5} style={{ marginBottom: 8 }}>Cash & Carry Commission</Title>
                <Row gutter={16}>
                  <Col>
                    <Card
                      size="small"
                      title="CC is Available"
                      bordered
                      style={{ width: 150 }}
                    >
                      <Form.Item
                        name="ccavailable"
                        style={{ marginBottom: 0 }}
                      >
                        <Select placeholder="Select" allowClear>
                          <Option value="Yes">Yes</Option>
                          <Option value="No">No</Option>
                        </Select>
                      </Form.Item>
                    </Card>
                  </Col>
                  <Col>
                    <Card
                      size="small"
                      title="CC Percentage"
                      bordered
                      style={{ width: 150 }}
                    >
                      <Form.Item name="ccpercent" style={{ marginBottom: 0 }}>
                        <Input
                          type="number"
                          onChange={(e) => {
                            const newValue = parseFloat(e.target.value) || 0;
                            form.setFieldsValue({ ccpercent: newValue }); // update form state
                            // Recalculate all rows
                            items.forEach((_, index) => handleInputChange(index, null, null));
                          }}
                        />
                      </Form.Item>

                    </Card>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <Divider />

          <Table columns={columns}
            dataSource={items}
            pagination={false}
            scroll={{ x: 'max-content' }}
            rowKey="key"
            bordered />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ margin: "16px 0", float: "right" }}
            onClick={handleAddRow}
          >
            Add Item
          </Button>


          <Row gutter={[8, 4]}>
            <Col span={4}>
              <Form.Item label="RO Total" style={{ marginBottom: '8px' }}>
                <Input value={roTotal} readOnly style={{ width: '100px', backgroundColor: '#f8d7da' }} />
              </Form.Item>
            </Col>

            <Col span={4}>
              <Form.Item label="Commission Total" style={{ marginBottom: '8px' }}>
                <Input value={commissionTotal} readOnly style={{ width: '100px', backgroundColor: '#f8d7da' }} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="C & C Amount" style={{ marginBottom: '8px' }}>
                <Input value={ccAmount} readOnly style={{ width: '100px' }} />
              </Form.Item>
            </Col>

            <Col span={4}>
              <Form.Item label={`CGST Total`} style={{ marginBottom: '8px' }}>
                <Input value={cgstTotal} style={{ width: '100px', backgroundColor: '#f48fb1', borderColor: '#9b59b6' }} />
              </Form.Item>
            </Col>

            <Col span={4}>
              <Form.Item label={`SGST Total`} style={{ marginBottom: '8px' }}>
                <Input value={sgstTotal} style={{ width: '100px', backgroundColor: '#f48fb1', borderColor: '#9b59b6' }} />
              </Form.Item>
            </Col>

            <Col span={4}>
              <Form.Item label={`IGST Total`}  style={{ marginBottom: '8px' }}>
                <Input value={igstTotal} style={{ width: '100px', backgroundColor: '#f48fb1', borderColor: '#9b59b6' }} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="GST Total"  style={{ marginBottom: '8px' }}>
                <Input value={gstTotal} style={{ width: '100px' }} readOnly />
              </Form.Item>
            </Col>

            <Col span={4}>
              <Form.Item label="RO Bill Amount" style={{ marginBottom: '8px' }}>
                <Input value={roBillTotal} style={{ width: '100%', backgroundColor: '#d1c4e9 ', borderColor: '#9b59b6' }}
                  readOnly />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="bankname" label="Bank Name" style={{ marginBottom: '8px' }}>
                <Input
                  placeholder="Select "
                  style={{ width: '200px', backgroundColor: '#f48fb1', borderColor: '#9b59b6' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Instructions"
                name="instructions"

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
  );
}

export default PMediaROMaster