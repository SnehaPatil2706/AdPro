import React, { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../master/calendar.css';
import { Switch, Input, TimePicker, message, Tooltip, Button, Modal, Table, Popconfirm } from 'antd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { useEffect } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { EditOutlined } from "@ant-design/icons";

function AdScheduler() {
    let agency = JSON.parse(localStorage.getItem("agency")) || null;

    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState(null);
    const [beforeAgencySwitch, setBeforeAgencySwitch] = useState(false);
    const [beforeClientSwitch, setBeforeClientSwitch] = useState(false);
    const [onDayAgencySwitch, setOnDayAgencySwitch] = useState(false);
    const [onDayClientSwitch, setOnDayClientSwitch] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [adDate, setAdDate] = useState(null);
    const [selectedClient, setSelectedClient] = useState("");
    const [selectedPaper, setSelectedPaper] = useState("");
    const [clients, setClients] = useState([]);
    const [pmedia, setPmedia] = useState([]);
    const [loading, setLoading] = useState(false);
    const [adDescription, setAdDescription] = useState("");
    const [adModal, setAdModal] = useState(false);
    const [adList, setAdList] = useState([]);
    const [editingRecord, setEditingRecord] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const [data, setData] = useState({
        id: "",
        agencyid: agency._id,
        clientid: "",
        pmediaid: "",
        adate: "",
        description: "",
        pmediaroid: "",
        beforeclientmessage: "",
        beforeagencymessage: "",
        ondateclientmessage: "",
        ondateagencymessage: "",
    });

    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    const handleMonthChange = (e) => {
        setCurrentMonth(parseInt(e.target.value, 10));
    };

    const handleYearChange = (e) => {
        setCurrentYear(parseInt(e.target.value, 10));
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
        setSelectedClient("");
        setSelectedPaper("");
        setAdDescription("");
        setBeforeAgencySwitch(false);
        setBeforeClientSwitch(false);
        setOnDayAgencySwitch(false);
        setOnDayClientSwitch(false);
        setShowModal(true);
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
        const calendar = [];
        let date = 1;

        for (let row = 0; row < 6; row++) {
            const week = [];
            for (let col = 0; col < 7; col++) {
                if (row === 0 && col < firstDay) {
                    week.push(<td key={`${row}-${col}`} />);
                } else if (date > daysInMonth) {
                    break;
                } else {
                    const currentDate = new Date(currentYear, currentMonth, date);
                    const formattedDate = dayjs(currentDate).format('YYYY-MM-DD');
                    const isSunday = currentDate.getDay() === 0;
                    const isToday =
                        currentDate.getDate() === today.getDate() &&
                        currentDate.getMonth() === today.getMonth() &&
                        currentDate.getFullYear() === today.getFullYear();

                    // Filter ads based on the current date
                    const adReasons = adList.filter(ad =>
                        dayjs(ad.adate).format('YYYY-MM-DD') === formattedDate
                    );

                    // Count ads where status is "No"
                    const adsWithStatusNo = adReasons.filter(ad => ad.status === 'No');

                    // Calculate total ad count (both Yes and No)
                    const totalAdsCount = adReasons.length;

                    // Calculate ads count with status "No"
                    const adsCount = adsWithStatusNo.length;

                    // Only render the "Ads" button if there is any ad assigned on this day
                    const showAdsButton = totalAdsCount > 0;

                    const tooltipContent = (
                        <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', color: 'black' }}>
                            <strong style={{ fontSize: '14px', display: 'block', marginBottom: '5px' }}>
                                {dayjs(currentDate).format('DD/MM/YYYY')}
                            </strong>
                            <div style={{ height: '2px', backgroundColor: 'blue', marginBottom: '10px' }}></div>
                            {totalAdsCount > 0 ? (
                                <ol style={{ paddingLeft: '20px', margin: '0' }}>
                                    {adReasons.map((ad, index) => {
                                        const title = ad.title || ad.description || 'Untitled Ad'; // Fallback if title is undefined
                                        const isHoliday = title.toLowerCase().includes('holiday'); // Now safe to call toLowerCase()

                                        return (
                                            <li
                                                key={index}
                                                style={{
                                                    fontSize: '12px',
                                                    marginBottom: '5px',
                                                    color: isHoliday ? 'red' : 'black',
                                                    fontWeight: isHoliday ? 'bold' : 'normal'
                                                }}
                                            >
                                                {title}
                                            </li>
                                        );
                                    })}
                                </ol>
                            ) : (
                                <p style={{ fontSize: '12px', color: 'gray' }}>No ad found</p>
                            )}
                        </div>
                    );

                    week.push(
                        <td
                            key={date}
                            className={`align-top p-2 position-relative ${isSunday ? 'bg-lightgray' : ''} ${isToday ? 'bg-info text-white' : ''}`}

                            style={{ cursor: 'pointer', height: '100px' }}
                        >
                            <div className="date-number"><strong>{date}</strong></div>

                            <Tooltip
                                title={tooltipContent}
                                placement="top"
                                mouseEnterDelay={0.3}
                                overlayStyle={{ pointerEvents: 'none' }}
                            >
                                {showAdsButton && (
                                    <Button
                                        size="small"
                                        style={{ backgroundColor: 'orange', color: 'white', marginTop: 5 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setAdDate(currentDate);
                                            setAdModal(true);
                                        }}
                                    >
                                        {`Ads: ${totalAdsCount}`}  {/* Changed from adsCount to totalAdsCount */}
                                    </Button>
                                )}
                            </Tooltip>

                            <div className="text-primary small mt-1 text-center"
                                style={{ position: 'absolute', bottom: '5px', left: '5px', cursor: 'pointer' }}
                                onClick={() => handleDateClick(currentDate)}>
                                New Ad</div>
                        </td>
                    );
                    date++;
                }
            }
            calendar.push(<tr key={row}>{week}</tr>);
        }
        return calendar;
    };

    const handleSaveAd = async (e) => {
        e.preventDefault();
        if (!selectedDate || !adDescription.trim()) {
            message.error("Please fill in all fields.");
            return;
        }

        const adData = {
            agencyid: agency._id,
            clientid: selectedClient,
            pmediaid: selectedPaper,
            adate: dayjs(selectedDate).format('YYYY-MM-DD'),
            description: adDescription.trim(),
            beforeagencymessage: beforeAgencySwitch,
            beforeclientmessage: beforeClientSwitch,
            ondateagencymessage: onDayAgencySwitch,
            ondateclientmessage: onDayClientSwitch
        };

        setLoading(true);
        try {
            let response;
            if (isEditMode && editingRecord) {
                // Update existing record
                response = await axios.put(`http://localhost:8081/adschedules/${editingRecord._id}`, adData);
                message.success("Ad schedule updated successfully.");
            } else {
                // Create new record
                response = await axios.post('http://localhost:8081/adschedules', adData);
                message.success("Ad schedule created successfully.");
            }

            if (response.data.success === "success") {
                // Refresh data
                loadData();
                setIsEditMode(false);
                resetForm();
            } else {
                message.error(response.data.message || "Failed to save ad");
            }
        } catch (error) {
            console.error("Save failed:", error);
            message.error(error.response?.data?.message || "Failed to save ad");
        } finally {
            setLoading(false);
        }
        window.location.reload();
    };

    const resetForm = () => {
        setShowModal(false);
        setAdModal(false);
        setSelectedDate(null);
        setSelectedClient("");
        setSelectedPaper("");
        setAdDescription("");
        setBeforeAgencySwitch(false);
        setBeforeClientSwitch(false);
        setOnDayAgencySwitch(false);
        setOnDayClientSwitch(false);
        setIsEditMode(false);
        setEditingRecord(null);
    };

    // Delete a advertisement
    const deleteAd = async (id) => {
        try {
            setLoading(true);
            const response = await axios.delete(`http://localhost:8081/adschedules/${id}`); // ✅ Corrected endpoint

            if (response.data.status === "success") {
                message.success("Ad deleted successfully");
                // Refresh data instead of filtering manually (to be safe)
                loadData();
                setAdModal(false); // close the modal if needed
            } else {
                message.error(response.data.message || "Failed to delete ad");
            }
        } catch (error) {
            console.error("Delete failed:", error);
            message.error(error.response?.data?.message || "Failed to delete ad");
        } finally {
            setLoading(false);
        }
    };

    // Edit an advertisement
    const handleEditAd = (record) => {
        setEditingRecord(record);
        setIsEditMode(true);
        setSelectedDate(new Date(record.adate));
        setSelectedClient(record.clientid);
        setSelectedPaper(record.pmediaid);
        setAdDescription(record.description);
        setBeforeAgencySwitch(record.beforeagencymessage);
        setBeforeClientSwitch(record.beforeclientmessage);
        setOnDayAgencySwitch(record.ondateagencymessage);
        setOnDayClientSwitch(record.ondateclientmessage);
        setShowModal(true);
        setAdModal(false); // Close the ads list modal
    };

    const loadData = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/adschedules`);
            setAdList(response.data.data || []);
        } catch (error) {
            console.error('Error loading ad data:', error);
        }
    };

    useEffect(() => {
        const fetchAdSchedules = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/adschedules`);
                setAdList(response.data.data || []);
            } catch (error) {
                console.error('Error fetching ad schedules:', error);
            }
        };

        fetchAdSchedules();

        // Also fetch clients and pmedia as you already do
        const fetchClients = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/clients/${agency._id}`);
                const clientData = response.data.data.map(client => ({
                    value: client._id,
                    label: client.name,
                }));
                setClients(clientData);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };

        const fetchPmedia = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/pmedia/${agency._id}`);
                const pmediaData = response.data.data.map(paper => ({
                    value: paper._id,
                    label: paper.name,
                }));
                setPmedia(pmediaData);
            } catch (error) {
                console.error('Error fetching pmedia:', error);
            }
        };

        fetchClients();
        fetchPmedia();
    }, [agency._id]); // Add agency._id as dependency

    const filteredAds = useMemo(() => {
        if (!adDate) return [];
        return adList.filter(ad =>
            dayjs(ad.adate).format('YYYY-MM-DD') === dayjs(adDate).format('YYYY-MM-DD')
        );
    }, [adList, adDate]);

    const clientMap = useMemo(() => {
        const map = {};
        clients.forEach(client => {
            map[client.value] = client.label;
        });
        return map;
    }, [clients]);

    const pmediaMap = useMemo(() => {
        const map = {};
        pmedia.forEach(paper => {  // Changed from papers to pmedia
            map[paper.value] = paper.label;
        });
        return map;
    }, [pmedia]);  // Changed dependency from papers to pmedia

    return (
        <main id="main" className="main">
            <div className={`content-wrapper ${showModal ? 'blurred' : ''}`}>
                <div className="pagetitle">
                    <h1>Ad Scheduler</h1>
                </div>

                {/* Year and Month Picker */}
                <div className="d-flex justify-content-end align-items-center mb-3">
                    <div className="me-2">
                        <select
                            value={currentMonth}
                            onChange={handleMonthChange}
                            className="form-select d-inline-block w-auto"
                        >
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i} value={i}>
                                    {dayjs().month(i).format('MMMM')}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <select
                            value={currentYear}
                            onChange={handleYearChange}
                            className="form-select d-inline-block w-auto"
                        >
                            {Array.from({ length: 10 }, (_, i) => currentYear - 5 + i).map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Calendar Table */}
                <table className="table table-bordered calendar-table">
                    <thead>
                        <tr className="table-light text-center">
                            <th>SUNDAY</th>
                            <th>MONDAY</th>
                            <th>TUESDAY</th>
                            <th>WEDNESDAY</th>
                            <th>THURSDAY</th>
                            <th>FRIDAY</th>
                            <th>SATURDAY</th>
                        </tr>
                    </thead>
                    <tbody>{renderCalendar()}</tbody>
                </table>
            </div>

            {/*Add Advertise Modal */}
            {showModal && <div className="modal-backdrop-custom"></div>}
            {showModal && (
                <div className="modal fade show d-block custom-modal-overlay" tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content shadow">
                            <div className="modal-header">
                                <h5 className="modal-title w-100 text-center" style={{ color: 'orange', fontWeight: 'bold' }}>
                                    {isEditMode ? 'Edit Advertise' : 'Add New Advertise'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                />
                            </div>
                            <div className="modal-body">
                                <div className="container-fluid">
                                    {/* Section: Basic Info */}
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label>Advertise Date</label>
                                            <DatePicker
                                                selected={selectedDate}
                                                onChange={(date) =>{
                                                    setSelectedDate(date)
                                                    console.log(date);
                                                    
                                                }}
                                                className="form-control"
                                                dateFormat="yyyy-MM-dd"
                                                placeholderText="Select a date"
                                                showPopperArrow={false}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label>Client</label>
                                            <select
                                                className='form-control'
                                                value={selectedClient}
                                                onChange={(e) => setSelectedClient(e.target.value)}
                                            >
                                                <option value="">Select Client</option>
                                                {clients.map(client => {
                                                    // console.log(client);
                                                    return (
                                                        <option key={client.value} value={client.value}>{client.label}</option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label>Newspaper</label>
                                            <select
                                                className='form-control'
                                                value={selectedPaper}
                                                onChange={(e) => setSelectedPaper(e.target.value)}
                                            >
                                                <option value="">Select Newspaper</option>
                                                {pmedia.map(paper => {
                                                    return (
                                                        <option key={paper.value} value={paper.value}> {paper.label} </option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label>Description</label>
                                            <Input.TextArea
                                                rows={2}
                                                style={{ resize: "both", overflow: "auto" }}
                                                value={adDescription}
                                                onChange={(e) => setAdDescription(e.target.value)}
                                            />

                                        </div>
                                    </div>

                                    {/* Section: Day Before Ad Notifications */}
                                    <div className="row mb-4 border-top pt-3">
                                        {/* <div className="col-12 mb-2 fw-bold">Notifications - Day Before Ad</div> */}

                                        <div className="col-md-6 mb-3">
                                            <label className="d-block">Agency- One Day Before Ad</label>
                                            <Switch
                                                checked={beforeAgencySwitch}
                                                onChange={setBeforeAgencySwitch}
                                                checkedChildren="YES"
                                                unCheckedChildren="NO"
                                            /><br /><br />
                                            {/* <TimePicker
                                                use12Hours
                                                format="h:mm A"
                                                minuteStep={1}
                                                className="w-50 mt-2"
                                                getPopupContainer={(trigger) => trigger.parentNode}
                                            />
                                            <Input.TextArea
                                                rows={3}
                                                className="mt-2"
                                                style={{ resize: "both", overflow: "auto" }}
                                            /> */}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="d-block">Client- One Day Before Ad</label>
                                            <Switch
                                                checked={beforeClientSwitch}
                                                onChange={setBeforeClientSwitch}
                                                checkedChildren="YES"
                                                unCheckedChildren="NO"
                                            />
                                            {/* <TimePicker
                                                use12Hours
                                                format="h:mm A"
                                                minuteStep={1}
                                                className="w-50 mt-2"
                                                getPopupContainer={(trigger) => trigger.parentNode}
                                            />
                                            <Input.TextArea
                                                rows={3}
                                                className="mt-2"
                                                style={{ resize: "both", overflow: "auto" }}
                                            /> */}
                                        </div>


                                        {/* Section: On Ad Day Notifications */}

                                        {/* <div className="col-12 mb-2 fw-bold">Notifications - On Ad Day</div> */}

                                        <div className="col-md-6 mb-3">
                                            <label className="d-block">Agency- On Ad Day</label>
                                            <Switch
                                                checked={onDayAgencySwitch}
                                                onChange={setOnDayAgencySwitch}
                                                checkedChildren="YES"
                                                unCheckedChildren="NO"
                                            />
                                            {/* <TimePicker
                                                use12Hours
                                                format="h:mm A"
                                                minuteStep={1}
                                                className="w-50 mt-2"
                                                getPopupContainer={(trigger) => trigger.parentNode}
                                            />
                                            <Input.TextArea
                                                rows={3}
                                                className="mt-2"
                                                style={{ resize: "both", overflow: "auto" }}
                                            /> */}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="d-block">Client- On Ad Day</label>
                                            <Switch
                                                checked={onDayClientSwitch}
                                                onChange={setOnDayClientSwitch}
                                                checkedChildren="YES"
                                                unCheckedChildren="NO"
                                            />
                                            {/* <TimePicker
                                                use12Hours
                                                format="h:mm A"
                                                minuteStep={1}
                                                className="w-50 mt-2"
                                                getPopupContainer={(trigger) => trigger.parentNode}
                                            />
                                            <Input.TextArea
                                                rows={3}
                                                className="mt-2"
                                                style={{ resize: "both", overflow: "auto" }}
                                            /> */}
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="modal-footer">
                                    <button className="btn btn-danger" onClick={() => {
                                        setShowModal(false)
                                        setIsEditMode(false)
                                    }} disabled={loading}>Cancel</button>
                                    <button className="btn btn-primary" 
                                    onClick={handleSaveAd}
                                    disabled={loading || !selectedDate || !selectedClient || !selectedPaper || !adDescription}>
                                        {loading ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update' : 'Save')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Ads View Modal */}
            <Modal
                title={
                    <div style={{
                        color: 'orange',
                        textAlign: 'center',
                        padding: '16px 0',
                        fontSize: '18px',
                        fontWeight: '500'
                    }}>
                        {`Ads to be published on: ${dayjs(adDate).format('DD/MM/YYYY')}`}
                    </div>
                }
                open={adModal}
                onCancel={() => setAdModal(false)}
                footer={[
                    <Button
                        key="close"
                        className="btn btn-danger"
                        onClick={() => setAdModal(false)}
                        style={{ margin: '16px 0' }}
                    >
                        Close
                    </Button>,
                ]}
                bodyStyle={{
                    padding: '20px 24px'
                }}
                width={700} // Set fixed width
                style={{
                    top: '50px',
                }}
            >
                <Table
                    columns={[
                        {
                            title: 'Actions',
                            key: 'actions',
                            render: (_, record) => (
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                    <Button
                                        type="primary"
                                        icon={<EditOutlined style={{ fontSize: '12px' }} />}
                                        size="small"
                                        style={{
                                            padding: '0 6px',
                                            fontSize: '12px',
                                            height: '28px',
                                            lineHeight: '24px'
                                        }}
                                        onClick={() => handleEditAd(record)}
                                    />
                                    <Popconfirm
                                        title="Are you sure you want to delete this Ad?"
                                        onConfirm={() => deleteAd(record._id)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button
                                            type="primary"
                                            danger
                                            icon={<DeleteOutlined style={{ fontSize: '12px' }} />}
                                            size="small"
                                            style={{
                                                padding: '0 6px',
                                                fontSize: '12px',
                                                height: '28px',
                                                lineHeight: '24px'
                                            }}
                                        />
                                    </Popconfirm>
                                </div>
                            ),
                            width: 120,
                            align: 'center'
                        },
                        {
                            title: 'Publish Date',
                            dataIndex: 'adate',
                            key: 'adate',
                            width: 120,
                            render: (date) => dayjs(date).format('DD-MM-YYYY') // Changed to DD-MM-YYYY format
                        },
                        {
                            title: 'Client',
                            dataIndex: 'clientid',
                            key: 'clientid',
                            render: (clientid) => clientMap[clientid] || 'Unknown'
                        },
                        {
                            title: 'Newspaper',
                            dataIndex: 'pmediaid',
                            key: 'pmediaid',
                            render: (pmediaid) => pmediaMap[pmediaid] || 'Unknown'
                        },
                        {
                            title: 'Description',
                            dataIndex: 'description',
                            key: 'description',
                            ellipsis: true
                        }
                    ]}
                    dataSource={filteredAds}
                    rowKey="_id"
                    pagination={false}
                    loading={loading}
                    bordered
                    size="small"
                />
            </Modal>
        </main>
    );
}

export default AdScheduler;