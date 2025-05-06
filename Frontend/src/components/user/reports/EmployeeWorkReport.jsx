import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import { Button, Row, Col, Select, DatePicker, message, Typography, Table } from 'antd';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;
const { Title, Text } = Typography;

function EmployeeWorkReport() {
    const printRef = useRef();
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [employeeWorkData, setEmployeeWorkData] = useState([]);
    const [user, setUser] = useState(null);
    const [statusFilter, setStatusFilter] = useState(null);
    const [userList, setUserList] = useState([]);
    const [allWorks, setAllWorks] = useState([]);

    const statusOptions = [
        { label: 'Done', value: 'done' },
        { label: 'Not Done', value: 'notdone' },
    ];

    const getUserName = (id) => {
        const userObj = userList.find(user => user._id === id);
        return userObj ? userObj.name : id; 
    }

    const columns = [
        { title: 'No', dataIndex: 'key', key: 'key' },
        { title: 'Employee Name', dataIndex: 'userName', key: 'name' },
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        { title: 'Date', dataIndex: 'wdate', key: 'date' },
        { title: 'Status', dataIndex: 'status', key: 'status' },
    ];

    const fetchEmployeeWorks = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/workschedules`);
            if (Array.isArray(response.data?.data)) {
                setAllWorks(response.data.data);
                setEmployeeWorkData(response.data.data);
            } else {
                message.warning("Work schedule data is not in expected array format.");
                setAllWorks([]);
                setEmployeeWorkData([]);
            }
        } catch (error) {
            console.error("Failed to load work schedules", error);
            message.error("Failed to load work schedules");
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await axios.get("http://localhost:8081/users");
            setUserList(response.data.data);
        } catch (error) {
            console.error("Error fetching employees:", error);
            message.error("Failed to fetch employee list.");
        }
    };

    const employeeWork = async () => {
        try {
            let filtered = [...allWorks];

            console.log(allWorks);
            console.log("FILTERING...");
            console.log("FROM DATE:", fromDate?.format?.('YYYY-MM-DD'));
            console.log("TO DATE:", toDate?.format?.('YYYY-MM-DD'));
            console.log("RAW WORKS:", allWorks.slice(0, 5));

            if (user) {
                const userObj = userList.find(u => u.name === user);
                if (userObj) {
                    filtered = filtered.filter(wk => wk.userid === userObj._id);
                } else {
                    message.warning("Selected employee not found");
                }
            }

            if (statusFilter) {
                const normalized = statusFilter.toLowerCase() === 'done' ? 'yes' :
                    statusFilter.toLowerCase() === 'notdone' ? 'no' : null;
                if (normalized) {
                    filtered = filtered.filter(wk => wk.status?.toLowerCase() === normalized);
                }
            }

            if (fromDate) {
                const from = new Date(fromDate).setHours(0, 0, 0, 0);
                filtered = filtered.filter(wk => {
                    const wkDate = new Date(wk.wdate).setHours(0, 0, 0, 0);
                    return wkDate >= from;
                });
                console.log(filtered);
            }
            if (toDate) {
                const to = new Date(toDate).setHours(0, 0, 0, 0);
                filtered = filtered.filter(wk => {
                    const wkDate = new Date(wk.wdate).setHours(0, 0, 0, 0);
                    return wkDate <= to;
                });
                console.log(filtered);
            }

            console.log("Filtered Works:", filtered);
            setEmployeeWorkData(filtered);
        } catch (error) {
            console.error("Error filtering works:", error);
            message.error("Error filtering works");
        }
    };

    const formattedData = employeeWorkData.map((item, index) => ({
        key: index + 1,
        ...item,
        userName: getUserName(item.userid),
        wdate: new Date(item.wdate).toLocaleDateString('en-GB'),
        status: item.status?.toLowerCase() === 'yes' ? 'Done' : 'Not Done',
    }));

    const handlePrint = () => {
        const printContents = printRef.current.innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    };

    const exportToExcel = () => {
        const exportData = formattedData.map(({ key,userName, title , description,wdate, status, }) => ({
            No: key,
            EmployeeName: userName,
            Title: title,
            Description: description,
            Date: wdate,
            Status: status,
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Work Report");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        });

        const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(fileData, "Employee_Work_Report.xlsx");
    };

    const resetFilters = () => {
        setFromDate(null);
        setToDate(null);
        setUser(null);
        setStatusFilter(null);
        setEmployeeWorkData(allWorks);
    };

    useEffect(() => {
        fetchEmployees();
        fetchEmployeeWorks().then(() => {
            console.log("Sample Works:", allWorks[0]);
        });
    }, []);

    return (
        <main id="main" className="main" style={{ backgroundColor: "#f5f5f5", padding: 20 }}>
            <style>{`
                @media print {
                    .no-print {
                        display: none !important;
                    }
                }
            `}</style>

            <div className="pagetitle no-print">
                <h1>Employee Work List</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Reports</Link></li>
                        <li className="breadcrumb-item active">List</li>
                    </ol>
                </nav>
            </div>

            <Row gutter={16} style={{ marginBottom: 10 }} className="no-print" align="middle">
                <Col>
                    <label>Employee</label><br />
                    <Select
                        style={{ width: 190 }}
                        placeholder="Select"
                        value={user}
                        onChange={setUser}
                        allowClear
                    >
                        {(Array.isArray(userList) ? userList : []).map(u => (
                            <Option key={u._id} value={u.name}>{u.name}</Option>
                        ))}
                    </Select>
                </Col>

                <Col>
                    <label>Status</label><br />
                    <Select
                        style={{ width: 150 }}
                        placeholder="Select"
                        options={statusOptions}
                        value={statusFilter}
                        onChange={setStatusFilter}
                        allowClear
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

                <Col style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                    <Button style={{ backgroundColor: '#7fdbff', color: '#000', border: 'none' }} onClick={employeeWork}>
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
                <Title level={5} style={{ textAlign: 'center' }}>EMPLOYEE WORK REPORT</Title>
                <Text type="danger" style={{ float: 'right' }}>
                    Total records: {employeeWorkData.length}
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

export default EmployeeWorkReport;
