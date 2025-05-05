import React, { useState, useEffect } from 'react';
import { Table, Select, DatePicker, Button, Row, Col, Typography, message } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;
const { Title, Text } = Typography;

const InvoiceReport = () => {
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
    const params = {
      client,
      fromDate: fromDate ? moment(fromDate).format('YYYY-MM-DD') : null,
      toDate: toDate ? moment(toDate).format('YYYY-MM-DD') : null,
    };
  
    axios.get(`http://localhost:8081/invoices/${agencyid}`, { params })
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
  

  const resetFilters = () => {
    setClient(null);
    setFromDate(null);
    setToDate(null);
    setInvoiceData([]);
  };

  const columns = [
    { title: 'No', dataIndex: 'key', key: 'key' },
    { title: 'Invoice No', dataIndex: 'invoiceNo', key: 'invoiceNo' },
    { title: 'Invoice Date', dataIndex: 'invoiceDate', key: 'invoiceDate' },
    { title: 'Client', dataIndex: 'client', key: 'client' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Discount', dataIndex: 'discount', key: 'discount' },
    { title: 'Taxable Amount', dataIndex: 'taxableAmount', key: 'taxableAmount' },
    { title: 'Client GST Code', dataIndex: 'gstCode', key: 'gstCode' },
    { title: 'GST Amount', dataIndex: 'gstAmount', key: 'gstAmount' },
    { title: 'Invoice Amount', dataIndex: 'invoiceAmount', key: 'invoiceAmount' },
  ];

  const formattedData = invoiceData.map((item, index) => ({
    key: index + 1,
    ...item,
    invoiceDate: new Date(item.invoiceDate).toLocaleDateString('en-GB'), // dd/mm/yyyy
  }));

  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>Design & Printing Invoice Report</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Reports</Link></li>
            <li className="breadcrumb-item active">Invoice Report</li>
          </ol>
        </nav>
      </div>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <label>Client</label>
          <Select
            style={{ width: '100%' }}
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
        <Col span={6}>
          <label>From Date</label>
          <DatePicker
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
            value={fromDate}
            onChange={setFromDate}
          />
        </Col>
        <Col span={6}>
          <label>To Date</label>
          <DatePicker
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
            value={toDate}
            onChange={setToDate}
          />
        </Col>
        <Col span={6} style={{ display: 'flex', alignItems: 'end', gap: 8 }}>
          <Button type="primary" onClick={fetchInvoices}>SHOW</Button>
          <Button>PRINT</Button>
          <Button style={{ backgroundColor: '#4CAF50', color: 'white' }}>EXPORT</Button>
          <Button danger onClick={resetFilters}>RESET</Button>
        </Col>
      </Row>

      <Title level={5} style={{ textAlign: 'center' }}>DESIGN AND PRINTING INVOICE REPORT</Title>
      <Text type="danger" style={{ float: 'right' }}>
        Total records: {invoiceData.length}
      </Text>

      <Table
        dataSource={formattedData}
        columns={columns}
        pagination={false}
        bordered
        style={{ marginTop: 20 }}
      />
    </main>
  );
};

export default InvoiceReport;