import { useState, React, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Card, Form, Row, Col, Input, DatePicker, Select, Divider, Button, Popconfirm, message, TimePicker, Table } from 'antd';
import { SaveOutlined, CloseOutlined, PrinterOutlined, PlusOutlined, DeleteOutlined, } from "@ant-design/icons";
import axios from 'axios';
import dayjs from 'dayjs';
import moment from 'moment';

const { Option } = Select;

function PMediaROBilling() {
  const [loading, setLoading] = useState(true);
  const agency = JSON.parse(localStorage.getItem("agency")) || null;
  const agencyid = agency?._id || "";
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [clients, setClients] = useState([]);
  const { RangePicker } = DatePicker;
  const [gsts, setGsts] = useState([]);
    const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
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
  const [data, setData] = useState({
    agencyid: agency?._id || "",
    invoiceno: "",
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
    allgst: 0,
    commissionTotal: 0,
    billclientid: "",

    //
    icgstpercent: 0,
    isgstpercent: 0,
    iigstpercent: 0,
    icgstamount: 0,
    isgstamount: 0,
    iigstamount: 0,
    invoicegstid: "",
    ccpercent: 0,
    ccamount: 0,
  });
  const [roTotal, setRoTotal] = useState(0);
  const [commissionTotal, setCommissionTotal] = useState(0);
  const [gst, setGst] = useState(0);
  const [gstTotal, setGstTotal] = useState(0);
  const [cgstTotal, setCgstTotal] = useState(0);
  const [sgstTotal, setSgstTotal] = useState(0);
  const [igstTotal, setIgstTotal] = useState(0);
  const [roBillTotal, setRoBillTotal] = useState(0);
  const [roInvoices, setRoInvoices] = useState([]);
  const [gstLabelKey, setGstLabelKey] = useState(0);

  const validateForm = () => {
    const values = form.getFieldsValue();
  console.log('Form values:', values); // Add this
    const newErrors = {};

    // Validate RO Date
    if (!values.invoiceDate) {
      newErrors.invoiceDate = 'invoice date is required';
    }

    // Validate Client
    if (!values.billagainstclient) {
      newErrors.billagainstclient = 'Client is required';
    }

    // Validate discount Percentage
    if (!values.discountpercent) {
      newErrors.discountpercent = 'discount percentage is required';
    } else if (isNaN(values.discountpercent)) {
      newErrors.discountpercent = 'discount must be a number';
    } else if (values.discountpercent < 0 || values.discountpercent > 100) {
      newErrors.discountpercent = 'discount must be between 0 and 100';
    }

    // Validate GST Type if amount is non-zero
    if (!values.invoicegstid) {
      newErrors.invoicegstid = 'gst type is required';
    }

      console.log('Validation errors:', newErrors); // Add this
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    navigate("/p-media/pmediaROList");
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
              value: String(gst._id),
              cgstpercent: gst.cgstpercent || 0,
              sgstpercent: gst.sgstpercent || 0,
              igstpercent: gst.igstpercent || 0,
            }))
          );
        }
      })
      .catch((err) => {
        console.error("Error fetching GSTs:", err);
      });
  };

  const loadROData = () => {
    axios.get(`http://localhost:8081/pmediaros/${id}`)
      .then((res) => {
        if (res.data && res.data.status === 'success') {
          const roData = res.data.data;
          const pmediaId = roData.pmediaid;

          console.log('pmediaId from RO:', pmediaId);


          axios.get(`http://localhost:8081/pmedia`)
            .then((pmediasRes) => {
              const pmedias = pmediasRes.data.data;

              const matchedPmedia = typeof pmediaId === 'object'
                ? pmediaId
                : pmedias.find(e => e._id === pmediaId);

              const pmediaName = matchedPmedia?.name || (typeof pmediaId === 'object' ? pmediaId.name : pmediaId); // fallback to ID
              console.log('pmediaName:', pmediaName);

              console.log('All pmedias:', pmedias);

              // Set form values
              form.setFieldsValue({
                rono: roData.rono,
                rodate: roData.rodate ? dayjs(roData.rodate) : null,
                clientid: roData.clientid.name,
                pmediaid: typeof pmediaId === 'object' ? pmediaId.name : pmediaId,
                editions: roData.editions,
                comissionpercent: roData.comissionpercent,
                comissionamount: roData.comissionamount,
                robillamount: roData.robillamount,
                totalcharges: roData.totalcharges,
                allgst: roData.allgst,
                gstid: roData.gstid ? String(
                  typeof roData.gstid === 'object' ? roData.gstid._id : roData.gstid
                ) : undefined,
                cgstpercent: roData.cgstpercent,
                sgstpercent: roData.sgstpercent,
                igstpercent: roData.igstpercent,
                cgstamount: roData.cgstamount,
                sgstamount: roData.sgstamount,
                igstamount: roData.igstamount,
                commissionTotal: roData.commissionTotal,
                instructions: roData.instructions,
                chequeno: roData.chequeno,
                chequedate: roData.chequedate ? dayjs(roData.chequedate) : null,
              });

              // Set the items for the table
              if (roData.items && roData.items.length > 0) {
                const formattedItems = roData.items.map(item => ({
                  key: item._id || Date.now(),
                  date: item.date ? dayjs(item.date) : null,
                  caption: item.caption,
                  position: item.position,
                  hue: item.hue,
                  width: item.size?.width || 0,
                  height: item.size?.height || 0,
                  area: item.area,
                  rate: item.rate,
                  charges: item.charges,
                  commissionpercent: item.commissionpercent,
                  commissionamount: item.commissionamount,
                  cgstpercent: item.cgstpercent,
                  sgstpercent: item.sgstpercent,
                  igstpercent: item.igstpercent,
                  cgstamount: item.cgstamount,
                  sgstamount: item.sgstamount,
                  igstamount: item.igstamount,
                  gsttotal: item.gsttotal,
                  totalcharges: item.totalcharges,
                }));
                console.log("Formatted Items:", formattedItems);
                setItems(formattedItems);
              }
            })
            .catch(err => {
              console.error("Error fetching clients or publications:", err);
              message.error("Failed to load client or publication data");
            });
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
    axios.get(`http://localhost:8081/pmediaroinvoices/by-ro/${id}`)
      .then(res => {
        if (res.data && res.data.status === 'success' && res.data.data.length > 0) {
          const invoiceData = res.data.data[0];
          setRoInvoices(invoiceData);

          // Set the data state with GST percentages
          setData(prev => ({
            ...prev,
            icgstpercent: invoiceData.icgstpercent || 0,
            isgstpercent: invoiceData.isgstpercent || 0,
            iigstpercent: invoiceData.iigstpercent || 0,
            invoicegstid: invoiceData.invoicegstid?._id || invoiceData.invoicegstid || null
          }));

          const formattedData = {
            ...invoiceData,
            invoiceNo: invoiceData.invoiceno,
            invoiceDate: invoiceData.invoicedate ? dayjs(invoiceData.invoicedate) : null,
            invoicegstid: invoiceData.invoicegstid?._id || invoiceData.invoicegstid || null,
            billagainstclient: typeof invoiceData.billclientid === 'object'
              ? invoiceData.billclientid._id
              : invoiceData.billclientid || null,
            icgstpercent: invoiceData.icgstpercent || 0,
            isgstpercent: invoiceData.isgstpercent || 0,
            iigstpercent: invoiceData.iigstpercent || 0,
          };

          form.setFieldsValue(formattedData);
        }
      })
      .catch(err => {
        console.error("Error fetching RO invoices:", err);
        setRoInvoices(null);
      });
  };

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
        updatedItem[field] = parseNumber(value); // <-- update root-level field too!
      } else if (["caption", "position", "hue", "chequeno", "paidBonus"].includes(field)) {
        updatedItem[field] = value; // keep as string
      } else {
        updatedItem[field] = parseNumber(value); // number fields
      }

      // Area calculation (use root-level width/height)
      const width = parseNumber(updatedItem.width);
      const height = parseNumber(updatedItem.height);
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

      // GST Percentages from the item itself (so each row can have its own GST)
      const cgstPercent = parseNumber(updatedItem.cgstpercent);
      const sgstPercent = parseNumber(updatedItem.sgstpercent);
      const igstPercent = parseNumber(updatedItem.igstpercent);

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
      updatedItem.ccamount = ccDeduction;

      // Save back to the updated items array
      updatedItems[index] = updatedItem;

      // Recalculate totals
      const getSum = (key) =>
        updatedItems.reduce((sum, item) => sum + parseNumber(item[key]), 0);

      const totalCharges = getSum("totalcharges");
      const commissionSum = getSum("commissionamount");
      const gstSum = getSum("gsttotal");
      const cgstSum = getSum("cgstamount");
      const sgstSum = getSum("sgstamount");
      const igstSum = getSum("igstamount");
      const chargesSum = getSum("charges");

      setRoTotal(chargesSum);
      setCommissionTotal(commissionSum);
      setGstTotal(gstSum);
      setCgstTotal(cgstSum);
      setSgstTotal(sgstSum);
      setIgstTotal(igstSum);
      setRoBillTotal(totalCharges);

      setGst?.(cgstSum + sgstSum + igstSum);

      form.setFieldsValue({
        totalcharges: chargesSum,
        commissionTotal: commissionSum,
        allgst: gstSum,
        robillamount: totalCharges
      });

      return updatedItems;
    });
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
          value={record.date ? dayjs(record.date) : null}
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
        // onChange={e => calculateArea(index, 'area', e.target.value)}
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
          // options={payOptions}
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
          onChange={e => handleInputChange(index, 'charges', e.target.value)}
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
            <div name="cgstpercent">CGST ({data.cgstpercent || 0}%)</div>
            <div name="sgstpercent">SGST ({data.sgstpercent || 0}%)</div>
            <div name="igstpercent">IGST ({data.igstpercent || 0}%)</div>
          </div>
        </div>
      ),
      dataIndex: "allgst",
      width: 300,
      render: (_, record, index) => (
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
      )
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
  ];

  const handleDelete = () => {
    axios.delete(`http://localhost:8081/pmediaros/${id}`)
      .then((res) => {
        if (res.data && res.data.status === 'success') {
          message.success("Record deleted successfully");
          navigate("/p-media/pmediaROList"); // Navigate back to the list page
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
  console.log('Starting save process...'); // Add this
  if (!validateForm()) {
    message.error('Please fix the form errors before submitting');
    return;
  }

  try {
    setLoading(true);
    const values = await form.validateFields();
    
    // Prepare the payload with all required fields
    const payload = {
      agencyid: agency._id,
      pmediaroid: id,
      invoiceno: values.invoiceNo,
      invoicedate: values.invoiceDate ? dayjs(values.invoiceDate).format('YYYY-MM-DD') : null,
      billclientid: values.billagainstclient,
      discountpercent: values.discountpercent || 0,
      discountamount: values.discountamount || 0,
      taxableamount: values.taxableamount || 0,
      invoicegstid: values.invoicegstid,
      icgstpercent: values.icgstpercent || 0,
      isgstpercent: values.isgstpercent || 0,
      iigstpercent: values.iigstpercent || 0,
      icgstamount: values.icgstamount || 0,
      isgstamount: values.isgstamount || 0,
      iigstamount: values.iigstamount || 0,
      invoiceamount: values.invoiceamount || 0,
      advance: values.advance || 0,
      instructions: values.instructions || '',
      robillamount: values.robillamount || 0,
      totalcharges: values.totalcharges || 0,
      commissionTotal: values.commissionTotal || 0,
      allgst: values.allgst || 0,
      // Include RO data if needed
      rono: values.rono,
      rodate: values.rodate ? dayjs(values.rodate).format('YYYY-MM-DD') : null,
      clientid: values.clientid,
      pmediaid: values.pmediaid,
      editions: values.editions,
      gstid: values.gstid
    };

    console.log("Payload being sent:", payload);

    let response;
    if (isEditMode) {
      response = await axios.put(
        `http://localhost:8081/pmediaroinvoices/${roInvoices?._id || id}`,
        payload
      );
    } else {
      response = await axios.post(
        "http://localhost:8081/pmediaroinvoices",
        payload
      );
    }

    if (response.data && response.data.status === 'success') {
      message.success(`Record ${isEditMode ? 'updated' : 'created'} successfully`);
      navigate("/p-media/pMediaROList");
    } else {
      message.error(response.data?.message || "Failed to save the record");
    }
  } catch (error) {
    console.error("Save error:", error);
    message.error(
      error.response?.data?.message || 
      "Failed to save the record. Please check the form and try again."
    );
  } finally {
    setLoading(false);
  }
};

  const calculateDiscountAmount = (robillamount, discountPercent) => {
    return ((parseFloat(robillamount) || 0) * (parseFloat(discountPercent) || 0) / 100).toFixed(2);
  };

  const handleDiscountPercentChange = () => {
    const robillamount = parseFloat(form.getFieldValue('robillamount')) || 0;
    const discountPercent = parseFloat(form.getFieldValue('discountpercent')) || 0;
    const discountAmount = calculateDiscountAmount(robillamount, discountPercent);
    const taxable = (robillamount - discountAmount).toFixed(2);

    form.setFieldsValue({
      discountamount: discountAmount,
      taxableamount: taxable,
      invoiceamount: taxable
    });
  };

  const handleInvoiceGSTTypeChange = (value) => {
    const selectedGST = gsts.find((gst) => gst.value === value);
    if (!selectedGST) return;

    const taxableamount = parseFloat(form.getFieldValue('taxableamount')) || 0;

    const updates = {
      invoicegstid: value,
      icgstpercent: selectedGST.cgstpercent || 0,
      isgstpercent: selectedGST.sgstpercent || 0,
      iigstpercent: selectedGST.igstpercent || 0
    };
    // Use the correct field names from your GST master
    const icgstPercent = selectedGST.cgstpercent || 0;
    const isgstPercent = selectedGST.sgstpercent || 0;
    const iigstPercent = selectedGST.igstpercent || 0;

    const icgstAmount = ((taxableamount * icgstPercent) / 100).toFixed(2);
    const isgstAmount = ((taxableamount * isgstPercent) / 100).toFixed(2);
    const iigstAmount = ((taxableamount * iigstPercent) / 100).toFixed(2);

    setData((prev) => ({
      ...prev,
      updates,
      invoicegstid: value,
      icgstpercent: icgstPercent,
      isgstpercent: isgstPercent,
      iigstpercent: iigstPercent,
      icgstamount: icgstAmount,
      isgstamount: isgstAmount,
      iigstamount: iigstAmount

    }));

    form.setFieldsValue({
      invoicegstid: value,
      icgstpercent: icgstPercent,
      isgstpercent: isgstPercent,
      iigstpercent: iigstPercent,
      icgstamount: icgstAmount,
      isgstamount: isgstAmount,
      iigstamount: iigstAmount

    });

    // Calculate invoice bill amount with GST
    const invoiceAmount = (
      taxableamount +
      parseFloat(icgstAmount) +
      parseFloat(isgstAmount) +
      parseFloat(iigstAmount)
    );
    form.setFieldsValue({ invoiceamount: invoiceAmount.toFixed(2) });
    form.setFieldsValue({ updates });
    setGstLabelKey(prev => prev + 1); // force re-render
  };

  useEffect(() => {
    loadData();
    loadROData();
    loadROInvoices();
  }, [id]);

  useEffect(() => {
    const robillamount = parseFloat(form.getFieldValue("robillamount")) || 0;
    const discountpercent = parseFloat(form.getFieldValue("discountpercent")) || 0;
    const discountamount = (robillamount * discountpercent) / 100;
    const taxableamount = robillamount - discountamount;

    form.setFieldsValue({
      discountamount: discountamount.toFixed(2),
      taxableamount: taxableamount.toFixed(2),
    });
  }, [
    form.getFieldValue("robillamount"),
    form.getFieldValue("discountpercent")
  ]);


  return (
    <main id="main" className="main" style={{ backgroundColor: "#f5f5f5", padding: 20 }}>
      <div className="pagetitle">
        <h1>P-Media RO Billing</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to={"/"}>P-Media</Link>
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
                <Col span={5}>
                  <Form.Item label="Invoice No" name="invoiceNo" style={{ marginBottom: '8px' }}>
                    <Input
                      id="invoiceNo"
                      placeholder=""
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item label="Invoice Date" name="invoiceDate" style={{ marginBottom: '8px' }}
                  validateStatus={errors.invoiceDate ? 'error' : ''}
                    help={errors.invoiceDate}>
                    <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY"
                      disabledDate={(current) => current && current < dayjs().startOf('day')} />
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
                <Row gutter={[14, 8]}>
                  <Col span={5}>
                    <Form.Item label="RO No" name="rono" style={{ marginBottom: '8px' }}>
                      <Input style={{ width: '100%' }} readOnly />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item label="RO Date" name="rodate" style={{ marginBottom: '8px' }}>
                      <Input style={{ width: '100%' }} readOnly />
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
                    <Form.Item
                      label={<span style={{ color: "#fff" }}>Client</span>}
                      name="clientid"
                      style={{ marginBottom: '8px' }}
                    >
                      <Input style={{ width: '80%' }} readOnly />
                    </Form.Item>
                    <Col span={8}>
                      <Form.Item label={<span style={{ color: "#fff" }}>Billing Against Client</span>}
                        name="billagainstclient" style={{ marginBottom: '8px' }}
                        validateStatus={errors.billagainstclient ? 'error' : ''}
                        help={errors.billagainstclient}>
                        <Select style={{ width: '120%' }} options={clients} />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
                <Row gutter={[13]}>
                  <Col span={7}>
                    <Form.Item label="Newspaper" name="pmediaid" style={{ marginBottom: '25px', marginTop: '15px' }}>
                      <Input style={{ width: '100%' }} readOnly />
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item label="Editions" name="editions" style={{ marginBottom: '25px', marginTop: '15px' }}>
                      <Input style={{ width: '100%' }} readOnly />
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item label="RO GST Tax Type" name="gstid" style={{ marginBottom: '25px', marginTop: '15px' }}>
                      <Select
                        showSearch
                        allowClear
                        placeholder="Select"
                        options={gsts}
                        style={{ width: '250px' }}
                      />
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
                />

                <Row gutter={[13]}>
                  <Col span={6}>
                    <Form.Item label="Total " name="totalcharges" style={{ marginBottom: '4px', marginTop: '8px' }}>
                      <Input style={{ width: '80%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Commission " name="commissionTotal" style={{ marginBottom: '4px', marginTop: '8px' }}>
                      <Input style={{ width: '80%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="GST " name="allgst" style={{ marginBottom: '4px', marginTop: '8px' }}>
                      <Input style={{ width: '80%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="RO Bill Amount" name="robillamount" style={{ marginBottom: '1px', marginTop: '8px' }}>
                      <Input style={{ width: '80%' }} />
                    </Form.Item>
                  </Col>
                </Row> <br />
              </div>
              <Divider />
              <Row gutter={[13]}>
                <Col span={8}>
                  <Form.Item label="Discount(%)" name="discountpercent" style={{ marginBottom: '8px' }}
                  validateStatus={errors.discountpercent ? 'error' : ''}
                    help={errors.discountpercent}>
                    <Input style={{ width: '80%' }}
                      onChange={handleDiscountPercentChange} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Discount Amount" name="discountamount" style={{ marginBottom: '8px' }}>
                    <Input style={{ width: '80%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Taxable Amount" name="taxableamount" style={{ marginBottom: '8px' }}>
                    <Input style={{ width: '80%' }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[8, 4]} key={gstLabelKey}>
                <Col span={5}>
                  <Form.Item label="GST Tax Type" name="invoicegstid"
                  validateStatus={errors.invoicegstid ? 'error' : ''}
                    help={errors.invoicegstid}>
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
                  <Form.Item
                    label={`CGST (${data.icgstpercent || 0}%)`}
                    name="icgstamount"
                    style={{ marginBottom: '8px' }}
                  >
                    <Input style={{ width: '100%' }} readOnly />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item
                    label={`SGST (${data.isgstpercent || 0}%)`}
                    name="isgstamount"
                    style={{ marginBottom: '8px' }}
                  >
                    <Input style={{ width: '100%' }} readOnly />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item
                    label={`IGST (${data.iigstpercent || 0}%)`}
                    name="iigstamount"
                    style={{ marginBottom: '8px' }}
                  >
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
                    <Input style={{ width: '80%' }} />
                  </Form.Item>
                </Col>
              </Row>
              {/* <Row justify="center" gutter={16}>
              <Col>
                <Button type="primary" icon={<SaveOutlined />}>
                  {"Save"}
                </Button>
              </Col>
              <Col>
                <Button type="default" icon={<PrinterOutlined />} >
                  Print
                </Button>
              </Col>
              <Col>
                <Button type="primary" danger icon={<CloseOutlined />}>
                  Cancel
                </Button>
              </Col>
            </Row> */}
            </div>
          </section>
        </Form>
      </Card><br />
      <Row justify="center" gutter={16}>
        <Col>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
            {"Save"}
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
          <Button type="primary" danger icon={<DeleteOutlined />} onClick={handleDelete}>
            Delete
          </Button>
        </Col>
      </Row>
    </main>
  );
};

export default PMediaROBilling;