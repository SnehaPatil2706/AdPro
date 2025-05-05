import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Row, Col, Typography, Table } from 'antd';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const { Title, Text } = Typography;

function ClientListReport() {
  const printRef = useRef();
  const [clientData, setClientData] = useState([]);
  const [clientList, setClientList] = useState([]);
  let agency = JSON.parse(localStorage.getItem("agency")) || null;

  const columns = [
    { title: 'No', dataIndex: 'key', key: 'key' },
    { title: 'Client Name', dataIndex: 'name', key: 'clientName' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    { title: 'Mobile No', dataIndex: 'contact', key: 'mobileNo' },
    { title: 'GST Code', dataIndex: 'gstno', key: 'gstCode' },
  ];

  const formattedData = clientData.map((item, index) => ({
    key: index + 1,
    ...item
  }));

  useEffect(() => {
    axios.get(`http://localhost:8081/clients/${agency?._id}`)
      .then(res => {
        const data = res.data.data || [];
        setClientData(data);
        setClientList(data.map(client => ({
          label: client.name,
          value: client._id
        })));
      })
      .catch(err => {
        console.error("Error fetching clients:", err);
        setClientData([]);
        setClientList([]);
      });
  }, []);

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // reload to restore React state
  };

  const exportToExcel = () => {
    const exportData = formattedData.map(({ key, name, contact, address, gstno }) => ({
      No: key,
      Name: name,
      Address: contact,
      MobileNo: address,
      GSTCode: gstno,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(fileData, "Client_List.xlsx");
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
        <h1>Client List</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Reports</Link></li>
            <li className="breadcrumb-item active">List</li>
          </ol>
        </nav>
      </div>

      <Row gutter={16} style={{ marginBottom: 20 }} className="no-print">
        <Col
          span={24}
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'end',
            gap: 8,
          }}
        >
          <Button type="primary" onClick={handlePrint}>PRINT</Button>
          <Button style={{ backgroundColor: '#4CAF50', color: 'white' }} onClick={exportToExcel}>
            EXPORT
          </Button>
        </Col>
      </Row>

      <div ref={printRef}>
        <Title level={5} style={{ textAlign: 'center' }}>CLIENT LIST</Title>
        <Text type="danger" style={{ float: 'right' }}>
          Total records: {clientData.length}
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
}

export default ClientListReport;
