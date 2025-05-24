import React from 'react'
import { Link } from 'react-router-dom';
import { Button, Row, Col, Typography, Table } from 'antd';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useRef, useEffect, useState } from 'react';
import axios from 'axios';

const { Title, Text } = Typography;

function HolidayListReport() {
    const printRef = useRef();
    const [holidayData, setHolidayData] = useState([]);
    const [holidayList, setHolidayList] = useState([]);

    const columns = [
        { title: 'No', dataIndex: 'key', key: 'key' },
        { title: 'Date', dataIndex: 'hdate', key: 'date' },
        { title: 'Reason', dataIndex: 'reason', key: 'reason' },
        { title: 'Every Year', dataIndex: 'every_year', key: 'everyYear' },
    ];

    const handlePrint = () => {
        const printContents = printRef.current.innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // reload to restore React state
    };

    const exportToExcel = () => {
        const exportData = formattedData.map(({ key, hdate, reason, every_year }) => ({
            No: key,
            Date: hdate,
            Reason: reason,
            EveryYear: every_year ? "Yes" : "No",
        }));


        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Holidays");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        });

        const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(fileData, "Holiday_List.xlsx");
    };

    const formattedData = holidayData.map((item, index) => ({
        key: index + 1,
        hdate: new Date(item.hdate).toLocaleDateString('en-GB'), // dd/mm/yyyy
        reason: item.reason,
        every_year: item.every_year ? "Yes" : "No"
    }));


    useEffect(() => {
        axios.get("http://localhost:8081/holidays")
            .then(res => {
                const data = res.data.data || [];
                setHolidayData(data);
                setHolidayList(data.map(holiday => ({
                    label: holiday.name,
                    value: holiday._id
                })));
            })
            .catch(err => {
                console.error("Error fetching holidays:", err);
                setHolidayData([]);
                setHolidayList([]);
            });
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
                <h1>Holidays List</h1>
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
                <Title level={5} style={{ textAlign: 'center' }}>HOLIDAYS LIST</Title>
                <Text type="danger" style={{ float: 'left' }}>
                    Total records: {holidayData.length}
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

export default HolidayListReport;