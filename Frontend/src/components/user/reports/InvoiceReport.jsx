import React, { useState, useEffect, useRef } from 'react';
import { Table, Select, DatePicker, Button, Row, Col, Typography, message } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const { Option } = Select;
const { Title, Text } = Typography;

const InvoiceReport = () => {
  const printRef = useRef();
  const [client, setClient] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [clientList, setClientList] = useState([]);
  const [invoiceData, setInvoiceData] = useState([]);

  const agency = JSON.parse(localStorage.getItem("agency") || "{}");
  const agencyid = agency?._id;

  // Fetch client list on mount
  useEffect(() => {
    fetchClients();
    fetchInvoices();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/clients/${agencyid}`);
      console.log("Client API response:", response.data);
      if (Array.isArray(response.data?.data)) {
        setClientList(response.data.data);
      } else {
        message.warning("Client data is not in expected array format.");
        setClientList([]);
      }
    } catch (error) {
      console.error("Failed to load clients", error);
      message.error("Failed to load clients");
    }
  };

 const fetchInvoices = () => {

    axios.get(`http://localhost:8081/invoices/`)
      .then(res => {
        if (Array.isArray(res.data)) {
          setInvoiceData(res.data);
        } else if (Array.isArray(res.data?.data)) {
          setInvoiceData(res.data.data);
        } else {
          setInvoiceData([]);
          message.warning('Invoice data is not in expected format.');
          console.warn('Unexpected invoice response:', res.data);
        }
      })
      .catch(err => {
        message.error('Failed to fetch invoices');
        console.error('Fetch invoice error:', err);
      });
  };

const invoices = () => {
  let filtered = invoiceData;

  // Filter by client
  if (client) {
    filtered = filtered.filter(inv => {
      if (typeof inv.clientid === 'object' && inv.clientid !== null) {
        return inv.clientid.name === client;
      }
      return inv.clientid === client;
    });
  }

  // Datewise filtering
  if (fromDate && toDate) {
    const from = fromDate.startOf('day').toDate();
    const to = toDate.endOf('day').toDate();
    filtered = filtered.filter(inv => {
      const invDate = moment(inv.invoiceDate, ['YYYY-MM-DD', 'DD/MM/YYYY']).toDate();
      return invDate >= from && invDate <= to;
    });
  } else if (fromDate) {
    const from = fromDate.startOf('day').toDate();
    filtered = filtered.filter(inv => {
      const invDate = moment(inv.invoiceDate, ['YYYY-MM-DD', 'DD/MM/YYYY']).toDate();
      return invDate >= from;
    });
  } else if (toDate) {
    const to = toDate.endOf('day').toDate();
    filtered = filtered.filter(inv => {
      const invDate = moment(inv.invoiceDate, ['YYYY-MM-DD', 'DD/MM/YYYY']).toDate();
      return invDate <= to;
    });
  }

  setInvoiceData(filtered);
};

  const resetFilters = () => {
    setClient(null);
    setFromDate(null);
    setToDate(null);
    fetchInvoices(); 
  };

  const columns = [
    { title: 'No', dataIndex: 'key', key: 'key' },
    { title: 'Invoice No', dataIndex: 'invoiceNo', key: 'invoiceNo' },
    {
  title: 'Invoice Date',
  dataIndex: 'invoiceDate',
  key: 'invoiceDate',
  sorter: (a, b) => new Date(a.invoiceDate) - new Date(b.invoiceDate),
},
    {
      title: 'Client',
      dataIndex: 'clientid',
      key: 'clientid',
      render: (clientid) => typeof clientid === 'object' && clientid !== null ? clientid.name : clientid
    },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Discount', dataIndex: 'discount', key: 'discount' },
    { title: 'Taxable Amount', dataIndex: 'taxableAmount', key: 'taxableAmount' },
    { title: 'Client GST Code', dataIndex: 'gstCode', key: 'gstCode' },
    {
      title: 'GST Amount',
      dataIndex: 'gstAmount',
      key: 'gstAmount',
      render: (_, record) => {
        const cgst = Number(record.cgstAmount) || 0;
        const sgst = Number(record.sgstAmount) || 0;
        const igst = Number(record.igstAmount) || 0;
        return (cgst + sgst + igst).toLocaleString("en-IN", { minimumFractionDigits: 2 });
      }
    },
    { title: 'Invoice Amount', dataIndex: 'billAmount', key: 'invoiceAmount' },
  ];

  const formattedData = invoiceData.map((item, index) => {
    // Find the client object by _id or name
    let clientObj = null;
    if (typeof item.clientid === 'object' && item.clientid !== null && item.clientid._id) {
      clientObj = clientList.find(cli => cli._id === item.clientid._id);
    } else if (typeof item.clientid === 'string') {
      clientObj = clientList.find(cli => cli._id === item.clientid) || clientList.find(cli => cli.name === item.clientid);
    }
    return {
      key: index + 1,
      ...item,
      invoiceDate: new Date(item.invoiceDate).toLocaleDateString('en-GB'), // dd/mm/yyyy
      gstCode: clientObj && clientObj.gstno ? clientObj.gstno : '', // Add GST code here
    };
  });

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const exportToExcel = () => {
    const exportData = formattedData.map(({
      key,
      invoiceNo,
      invoiceDate,
      clientid,
      amount,
      discount,
      taxableAmount,
      gstCode,
      gstAmount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      billAmount,
    }) => ({
      No: key,
      InvoiceNo: invoiceNo,
      InvoiceDate: invoiceDate ? new Date(invoiceDate).toLocaleDateString('en-GB') : '',
      Client: typeof clientid === 'object' && clientid !== null ? clientid.name : clientid,
      Amount: amount,
      Discount: discount,
      TaxableAmount: taxableAmount,
      ClientGSTCode: gstCode,
      GSTAmount: (parseFloat(cgstAmount) || 0) + (parseFloat(sgstAmount) || 0) + (parseFloat(igstAmount) || 0),
      InvoiceAmount: billAmount,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Work Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(fileData, "Invoice_Report.xlsx");
  };

  return (
    <main id="main" className="main" style={{ backgroundColor: "#f5f5f5", padding: 20 }}>
      <style>
        {`
          @media print {
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>
      <div className="pagetitle no-print">
        <h1>Design & Printing Invoice Report</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Reports</Link></li>
            <li className="breadcrumb-item active">Invoice Report</li>
          </ol>
        </nav>
      </div>

      <Row gutter={16} style={{ marginBottom: 20 }} className="no-print" align="middle">
        <Col>
          <label>Client</label><br />
          <Select
            style={{ width: 230 }}
            placeholder="Select"
            value={client}
            onChange={setClient}
            allowClear
          >
            {(Array.isArray(clientList) ? clientList : []).map(cli => (
              <Option key={cli._id} value={cli.name}>{cli.name}</Option>
            ))}
          </Select>
        </Col>
        <Col>
          <label>From Date</label><br />
          <DatePicker
            style={{ width: 230 }}
            format="DD/MM/YYYY"
            value={fromDate}
            onChange={setFromDate}
          />
        </Col>
        <Col>
          <label>To Date</label><br />
          <DatePicker
            style={{ width: 230 }}
            format="DD/MM/YYYY"
            value={toDate}
            onChange={setToDate}
          />
        </Col>
        <Col flex="auto" />
        <Col span={24} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'end', gap: 8 }}>
          <Button type="primary" style={{ backgroundColor: '#7fdbff', color: '#000', border: 'none' }} onClick={invoices}>SHOW</Button>
          <Button type="primary" onClick={handlePrint}>PRINT</Button>
          <Button style={{ backgroundColor: '#4CAF50', color: 'white' }} onClick={exportToExcel}>EXPORT</Button>
          <Button type="primary" danger onClick={resetFilters}>RESET</Button>
        </Col>
      </Row><br />

      <div ref={printRef}>
        <Title level={5} style={{ textAlign: 'center' }}>DESIGN AND PRINTING INVOICE REPORT</Title>
        <Text type="danger" style={{ float: 'left' }}>
          Total records: {invoiceData.length}
        </Text>


        <Table
          dataSource={formattedData}
          columns={columns}
          pagination={false}
          bordered
          style={{ marginTop: 20 }}
        />
      </div>
    </main>
  );
};

export default InvoiceReport;