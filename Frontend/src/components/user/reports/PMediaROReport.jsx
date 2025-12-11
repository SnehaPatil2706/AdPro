import React from 'react'
import { Link } from 'react-router-dom';
import { Button, Row, Col, Select, DatePicker, message, Typography, Table } from 'antd';
import { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import axios from 'axios';

const { Option } = Select;
const { Title, Text } = Typography;

function PMediaROReport() {
  let agency = JSON.parse(localStorage.getItem("agency")) || null;
  const printRef = useRef();
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [user, setUser] = useState(null);
  const [userList, setUserList] = useState([]);
  const [pmediaROData, setPmediaROData] = useState([]);
  const [pmedias, setPmedias] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

  function loadData() {
    return Promise.all([
      axios.get("http://localhost:8081/pmedia"),
      axios.get(`http://localhost:8081/clients/${agency._id}`),
    ]).then(([pmediasRes, clientsRes]) => {
      const pmediasList = (pmediasRes.data?.data || []).map(pmedia => ({
        label: pmedia.name,
        value: pmedia._id,
        name: pmedia.name, // Add name field for direct access
        gstno: pmedia.gstno
      }));
      const clientsList = (clientsRes.data?.data || []).map(client => ({
        label: client.name,
        value: client._id,
        name: client.name,// Add name field for direct access
        gstno: client.gstno
      }));
      setPmedias(pmediasList);
      setClients(clientsList);
      return { pmedias: pmediasList, clients: clientsList };
    }).catch((err) => {
      console.error("Error loading data:", err);
      message.error("Failed to load clients and publications");
      setPmedias([]);
      setClients([]);
      return { pmedias: [], clients: [] };
    });
  };

  const columns = [
    { title: 'No', dataIndex: 'no', key: 'no', width: 50, render: (text, record, index) => index + 1 },
    { title: 'RO No', dataIndex: 'rono', key: 'rono' },
    { title: 'RO Date', dataIndex: 'rodate', key: 'rodate', render: (date) => date ? new Date(date).toLocaleDateString('en-GB') : '' },
    { title: 'Invoice No', dataIndex: 'invoiceno', key: 'invoiceno' },
    // { title: 'Invoice Date', dataIndex: 'invoicedate', key: 'invoicedate', render: (date) => date ? new Date(date).toLocaleDateString('en-GB') : '' },
    { title: 'Client', dataIndex: 'clientid', key: 'clientid' },
    { title: 'Paper', dataIndex: 'pmediaid', key: 'pmediaid' },
    { title: 'Editions', dataIndex: 'editions', key: 'editions' },
    { title: 'RO Amount', dataIndex: 'robillamount', key: 'roamount', render: (val) => val !== undefined && val !== null ? parseFloat(val).toFixed(2) : '0.00' },
    {
      title: 'Commission',
      dataIndex: 'commissionamount',
      key: 'commissionamount',
      render: (amount) => amount !== undefined && amount !== null ? parseFloat(amount).toFixed(2) : '0.00'
    },
    { title: 'Media GST Code', dataIndex: 'gstno', key: 'gstno' },
    {
      title: 'Media GST Amount',
      dataIndex: '',
      key: '',
      render: (_, record) => {
        const icgst = parseFloat(record.icgstamount) || 0;
        const isgst = parseFloat(record.isgstamount) || 0;
        const iigst = parseFloat(record.iigstamount) || 0;
        const totalGST = icgst + isgst + iigst;
        return totalGST.toFixed(2); // Always show 0.00 if not found
      }
    },
    { title: 'Media Bill No', dataIndex: 'mediabillno', key: 'mediabillno' },
    { title: 'Media Bill Amount', dataIndex: 'mediabillamount', key: 'mediabillamount', render: (val) => val !== undefined && val !== null ? parseFloat(val).toFixed(2) : '0.00' },
    { title: 'Client GST Code', dataIndex: 'clientgstcode', key: 'clientgstcode' },
    {
      title: 'Client GST Amount',
      dataIndex: 'gstamount',
      key: 'gstamount',
      render: (_, record) => {
        const icgst = parseFloat(record.icgstamount) || 0;
        const isgst = parseFloat(record.isgstamount) || 0;
        const iigst = parseFloat(record.iigstamount) || 0;
        const totalGST = icgst + isgst + iigst;
        return totalGST.toFixed(2); // Always show 0.00 if not found
      }
    },
    { title: 'Discount', dataIndex: 'discountamount', key: 'discountamount', render: (val) => val !== undefined && val !== null ? parseFloat(val).toFixed(2) : '0.00' },
    { title: 'Invoice Amount', dataIndex: 'invoiceamount', key: 'invoiceamount', render: (val) => val !== undefined && val !== null ? parseFloat(val).toFixed(2) : '0.00' },
  ];

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const formattedData = pmediaROData.map((item, index) => ({
    key: index + 1,
    ...item,
  }));

  const exportToExcel = () => {
    const exportData = formattedData.map(({
      key,
      rono,
      rodate,
      invoiceno,
      invoicedate,
      clientid,
      emediaid,
      robillamount,
      commissionamount, // <-- use this
      mediagstcode,
      cgstamount,
      sgstamount,
      igstamount,
      mediabillno,
      mediabillamount,
      clientgstcode,
      icgstamount,
      isgstamount,
      iigstamount,
      discountamount,
      invoiceamount,
      chequeno,
      chequedate
    }) => ({
      No: key,
      RONo: rono,
      RODate: rodate ? new Date(rodate).toLocaleDateString('en-GB') : '',
      InvoiceNo: invoiceno,
      InvoiceDate: invoicedate ? new Date(invoicedate).toLocaleDateString('en-GB') : '',
      Client: clientid,
      Publication: emediaid,
      ROAmount: robillamount,
      Commission: commissionamount, // <-- use this
      MediaGSTCode: mediagstcode,
      MediaGSTAmount: (parseFloat(cgstamount) || 0) + (parseFloat(sgstamount) || 0) + (parseFloat(igstamount) || 0),
      MediaBillNo: mediabillno,
      MediaBillAmount: mediabillamount,
      ClientGSTCode: clientgstcode,
      ClientGSTAmount: (parseFloat(icgstamount) || 0) + (parseFloat(isgstamount) || 0) + (parseFloat(iigstamount) || 0),
      Discount: discountamount,
      InvoiceAmount: invoiceamount,
      ChequeNo: chequeno,
      ChequeDate: chequedate ? new Date(chequedate).toLocaleDateString('en-GB') : ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Work Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(fileData, "PMedia_RO_Report.xlsx");
  };

  const pmediaRO = async () => {
    setLoading(true);
    try {
      const { pmedias: pmediasList, clients: clientsList } = await loadData();
      const roRes = await axios.get("http://localhost:8081/pmediaros");
      let ros = roRes.data?.data || [];

      // Filter by selected publication if any
      if (selectedPublication) {
        ros = ros.filter(ro => ro.pmediaid === selectedPublication);
      }

      // Filter by selected client if any
      if (selectedClient) {
        ros = ros.filter(ro => ro.clientid === selectedClient);
      }

      // Filter by date range if both dates are selected
      if (fromDate && toDate) {
        const from = fromDate.startOf('day').toDate();
        const to = toDate.endOf('day').toDate();
        ros = ros.filter(ro => {
          const rodate = new Date(ro.rodate);
          return rodate >= from && rodate <= to;
        });
      } else if (fromDate) {
        const from = fromDate.startOf('day').toDate();
        ros = ros.filter(ro => {
          const rodate = new Date(ro.rodate);
          return rodate >= from;
        });
      } else if (toDate) {
        const to = toDate.endOf('day').toDate();
        ros = ros.filter(ro => {
          const rodate = new Date(ro.rodate);
          return rodate <= to;
        });
      }

      const roIds = ros.map(ro => ro._id);
      const invoiceRes = await axios.post("http://localhost:8081/pmediaroinvoices/by-ro-ids", { roIds });
      const invoices = invoiceRes.data?.data || [];

      const invoiceMap = {};
      invoices.forEach(inv => {
        invoiceMap[inv.pmediaroid] = inv;
      });

      const clientMap = {};
      clientsList.forEach(client => {
        clientMap[client.value] = {
          name: client.name,
          gstno: client.gstno
        };
      });

      const pmediaMap = {};
      pmediasList.forEach(pmedia => {
        pmediaMap[pmedia.value] = {
          name: pmedia.name,
          gstno: pmedia.gstno
        };
      });

      // ...inside pmediaRO and loadROData...
      console.log('Raw ros:', ros);
      const mergedData = ros.map((ro, idx) => {
        const invoice = invoiceMap[ro._id] || {};
        const clientInfo = clientMap[ro.clientid] || {};
        const pmediaInfo = pmediaMap[ro.pmediaid] || {};

        return {
          key: ro._id,
          no: idx + 1,
          ...ro,
          clientid: clientInfo.name || ro.clientid,
          pmediaid: pmediaInfo.name || ro.pmediaid,
          clientgstcode: clientInfo.gstno || '',
          mediagstcode: pmediaInfo.gstno || '',
          gstno: pmediaInfo.gstno || '',
          commissionamount: ro.commissionTotal || ro.commissionTotal || 0,
          cgstamount: ro.cgstamount || 0,
          sgstamount: ro.sgstamount || 0,
          igstamount: ro.igstamount || 0,
          invoiceno: invoice.invoiceno || '',
          invoicedate: invoice.invoicedate || '',
          discountamount: invoice.discountamount || 0,
          invoiceamount: invoice.invoiceamount || 0,
          icgstamount: invoice.icgstamount || 0,
          isgstamount: invoice.isgstamount || 0,
          iigstamount: invoice.iigstamount || 0,
          chequeno: invoice.chequeno || ro.chequeno || '',
          chequedate: invoice.chequedate || ro.chequedate || null
        };
      });
      console.log('Merged Data:', mergedData);
      setPmediaROData(mergedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to load RO data");
      setPmediaROData([]);
    } finally {
      setLoading(false);

    }

  };
  // ...existing code...

  const resetFilters = () => {
    setFromDate(null);
    setToDate(null);
    setUser(null);
    setSelectedPublication(null);
    setSelectedClient(null);
    loadROData();
  };

  const loadROData = async () => {
    setLoading(true);
    try {
      // First load clients and pmedias
      const { pmedias: pmediasList, clients: clientsList } = await loadData();

      // Then fetch RO data
      const roRes = await axios.get("http://localhost:8081/pmediaros");
      const ros = roRes.data?.data || [];
      const roIds = ros.map(ro => ro._id);

      // Fetch invoices
      const invoiceRes = await axios.post("http://localhost:8081/pmediaroinvoices/by-ro-ids", { roIds });
      const invoices = invoiceRes.data?.data || [];

      // Create a map of RO ID to invoice
      const invoiceMap = {};
      invoices.forEach(inv => {
        invoiceMap[inv.pmediaroid] = inv;
      });

      // Create client and pmedia lookup maps with all needed fields
      const clientMap = {};
      clientsList.forEach(client => {
        clientMap[client.value] = {
          name: client.name,
          gstno: client.gstno // Assuming this is the field name in your client data
        };
      });

      const pmediaMap = {};
      pmediasList.forEach(pmedia => {
        pmediaMap[pmedia.value] = {
          name: pmedia.name,
          gstno: pmedia.gstno // Add GST number for pmedias
        };
      });

      // Merge data with names and GST code
      const mergedData = ros.map((ro, idx) => {
        const invoice = invoiceMap[ro._id] || {};
        const clientInfo = clientMap[ro.clientid] || {};
        const pmediaInfo = pmediaMap[ro.pmediaid] || {};

        return {
          key: ro._id,
          no: idx + 1,
          ...ro,
          clientid: clientInfo.name || ro.clientid,
          pmediaid: pmediaInfo.name || ro.pmediaid,
          clientgstcode: clientInfo.gstno || '',
          mediagstcode: pmediaInfo.gstno || '',
          gstno: pmediaInfo.gstno || '',
          commissionamount: ro.commissionTotal || ro.comissionTotal || 0,
          cgstamount: ro.cgstamount || 0,
          sgstamount: ro.sgstamount || 0,
          igstamount: ro.igstamount || 0,
          invoiceno: invoice.invoiceno || '',
          invoicedate: invoice.invoicedate || '',
          discountamount: invoice.discountamount || 0,
          invoiceamount: invoice.invoiceamount || 0,
          icgstamount: invoice.icgstamount || 0,
          isgstamount: invoice.isgstamount || 0,
          iigstamount: invoice.iigstamount || 0,
        };
      });

      setPmediaROData(mergedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to load RO data");
      setPmediaROData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadROData();
  }, []);

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
        <h1>P-Media RO Report</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Reports</Link></li>
            <li className="breadcrumb-item active">List</li>
          </ol>
        </nav>
      </div>

      <Row gutter={16} style={{ marginBottom: 10 }} className="no-print" align="middle">
        {/* <Col>
          <label>Status</label><br />
          <Select
            style={{ width: 190 }}
            placeholder="Select"
            value={user}
            // onChange={setUser}
            allowClear
          >
            {(Array.isArray(userList) ? userList : []).map(u => (
              <Option key={u._id} value={u.name}>{u.name}</Option>
            ))}
          </Select>
        </Col> */}

        <Col>
          <label>Publication</label><br />
          <Select
            style={{ width: 150 }}
            placeholder="Select"
            showSearch
            allowClear
            options={pmedias}
            value={selectedPublication}
            onChange={setSelectedPublication}
            filterOption={(input, option) =>
              option.label.toLowerCase().includes(input.toLowerCase())
            }
          />
        </Col>

        <Col>
          <label>Client</label><br />
          <Select
            style={{ width: 150 }}
            placeholder="Select"
            showSearch
            allowClear
            options={clients}
            value={selectedClient}
            onChange={setSelectedClient}
            filterOption={(input, option) =>
              option.label.toLowerCase().includes(input.toLowerCase())
            }
          />
        </Col>

        <Col>
          <label>From Date</label><br />
          <DatePicker
            style={{ width: 150 }}
            format="DD/MM/YYYY"
            value={fromDate}
            onChange={setFromDate}
          />
        </Col>

        <Col>
          <label>To Date</label><br />
          <DatePicker
            style={{ width: 150 }}
            format="DD/MM/YYYY"
            value={toDate}
            onChange={setToDate}
          />
        </Col>

        <Col span={24}
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'end',
            gap: 8,
          }}>
          <Button style={{ backgroundColor: '#7fdbff', color: '#000', border: 'none' }} onClick={pmediaRO}>
            SHOW
          </Button>
          <Button type="primary" onClick={handlePrint}>PRINT</Button>
          <Button style={{ backgroundColor: '#4CAF50', color: 'white' }} onClick={exportToExcel}>
            EXPORT
          </Button>
          <Button type="primary" danger onClick={resetFilters}>
            RESET
          </Button>
        </Col>
      </Row><br />

      <div ref={printRef}>
        <Title level={5} style={{ textAlign: 'center' }}>P-MEDIA RO REPORT</Title>
        <Text type="danger" style={{ float: 'left' }}>
          Total records: {pmediaROData.length}
        </Text>

        <Table
          dataSource={pmediaROData}
          columns={columns}
          pagination={false}
          bordered
          style={{ marginTop: 20 }}
          scroll={{ x: 'max-content' }}
        />
      </div>
    </main>
  )
};

export default PMediaROReport;