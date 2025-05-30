import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Row, Col, Select, DatePicker, message, Typography, Table } from 'antd';
import { useRef, useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;
const { Title, Text } = Typography;

function ClientAdsReport() {
    const printRef = useRef();
    const [clientAdData, setClientAdData] = useState([]);
    const [client, setClient] = useState(null);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [clientList, setClientList] = useState([]);
    const agency = JSON.parse(localStorage.getItem("agency") || "{}");
    const agencyid = agency?._id;
    const [allAds, setAllAds] = useState([]);

    const getClientName = (id) => {
        const clientObj = clientList.find(client => client._id === id);
        return clientObj ? clientObj.name : id; // fallback to id if not found
    };

    const columns = [
        { title: 'No', dataIndex: 'key', key: 'key' },
        { title: 'Client Name', dataIndex: 'clientName', key: 'clientName' },
        { title: 'Date', dataIndex: 'adate', key: 'date' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
    ];

    const fetchClientAds = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/adschedules`);
            if (Array.isArray(response.data?.data)) {
                setAllAds(response.data.data); // master copy
                setClientAdData(response.data.data); // initial filtered list
                console.log(response.data.data);

            } else {
                message.warning("Client Ads data is not in expected array format.");
                setAllAds([]);
                setClientAdData([]);
            }
        } catch (error) {
            console.error("Failed to load client ads", error);
            message.error("Failed to load client ads");
        }
    };

    const fetchClients = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/clients/${agencyid}`);
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

    const clientAds = () => {
        try {
            let filtered = [...allAds]; // always start from full dataset
            console.log(fromDate, "fromDate");
            
            console.log(allAds);
            console.log("FILTERING...");
            console.log("FROM DATE:", fromDate?.format?.('DD/MM/YYYY'));
            console.log("TO DATE:", toDate?.format?.('YYYY-MM-DD'));
            console.log("RAW ADS:", allAds.slice(0, 5));

            if (client) {
                const clientObj = clientList.find(c => c.name === client);
                if (clientObj) {
                    filtered = filtered.filter(ad => ad.clientid === clientObj._id);
                } else {
                    message.warning("Selected client not found");
                }
            };

            if (fromDate) {
                const from = new Date(fromDate).setHours(0, 0, 0, 0);
                filtered = filtered.filter(ad => {
                    const adDate = new Date(ad.adate).setHours(0, 0, 0, 0);
                    return adDate >= from;
                });
                console.log(filtered);
            }
            if (toDate) {
                const to = new Date(toDate).setHours(0, 0, 0, 0);
                filtered = filtered.filter(ad => {
                    const adDate = new Date(ad.adate).setHours(0, 0, 0, 0);
                    return adDate <= to;
                });
                console.log(filtered);
            }
            console.log("FILTERED ADS:", filtered);
            setClientAdData(filtered);
        } catch (error) {
            console.error("Error filtering ads:", error);
            message.error("Error filtering ads");
        }
    };

    const formattedData = clientAdData.map((item, index) => ({
        key: index + 1,
        ...item,
        clientName: getClientName(item.clientid),
        adate: new Date(item.adate).toLocaleDateString('en-GB'), // dd/mm/yyyy
    }));

    const handlePrint = () => {
        const printContents = printRef.current.innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // reload to restore React state
    };

    const exportToExcel = () => {
        const exportData = formattedData.map(({ key, clientName, adate, description }) => ({
            No: key,
            ClientName: clientName,
            Date: adate,
            Description: description,
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Client Ads");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        });

        const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(fileData, "Client_Ad.xlsx");
    };

    const resetFilters = () => {
        setClient(null);
        setFromDate(null);
        setToDate(null);
        setClientAdData(allAds); // restore unfiltered data
    };

    useEffect(() => {
        fetchClients();
        fetchClientAds()
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
                <h1>Client Ads List</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Reports</Link></li>
                        <li className="breadcrumb-item active">List</li>
                    </ol>
                </nav>
            </div>

            <Row gutter={16} style={{ marginBottom: 20 }} className="no-print">
                <Col span={6}>
                    <label>Client</label>
                    <Select
                        style={{ width: '70%' }}
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
                    {/* <DatePicker
                        style={{ width: '60%' }}
                        format="DD/MM/YYYY"
                        value={fromDate}
                        onChange={setFromDate}
                    /> */}
                    <DatePicker
                        format="DD/MM/YYYY"
                        value={fromDate}
                        onChange={(value) => setFromDate(value)} // this ensures it's a Moment object
                    />
                </Col>
                <Col span={6}>
                    <label>To Date</label>
                    <DatePicker
                        style={{ width: '60%' }}
                        format="DD/MM/YYYY"
                        value={toDate}
                        onChange={setToDate}
                    />
                </Col>
                <Col
                    span={24}
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'end',
                        gap: 8,
                    }}
                >
                    <Button style={{ backgroundColor: '#7fdbff', color: '#000', border: 'none' }} onClick={clientAds}>
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
            </Row>

            <div ref={printRef}>
                <Title level={5} style={{ textAlign: 'center' }}>CLIENTS ADS REPORT</Title>
                <Text type="danger" style={{ float: 'left' }}>
                    Total records: {clientAdData.length}
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
    )
}

export default ClientAdsReport;