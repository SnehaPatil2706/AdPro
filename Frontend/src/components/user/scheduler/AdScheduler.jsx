import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../master/calendar.css';
import { message, Switch, Select, Input, TimePicker } from 'antd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function AdScheduler() {
    let agency = JSON.parse(localStorage.getItem("agency")) || null;
    const [selectedDate, setSelectedDate] = useState(null);
    const [beforeAgencySwitch, setBeforeAgencySwitch] = useState(false);
    const [beforeClientSwitch, setBeforeClientSwitch] = useState(false);
    const [onDayAgencySwitch, setOnDayAgencySwitch] = useState(false);
    const [onDayClientSwitch, setOnDayClientSwitch] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [clients, setClients] = useState([]); // State for clients
    const [result, setResult] = useState([]);

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

    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    // Fetch clients from the database

    const handleDateClick = (date) => {
        setSelectedDate(date);
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
                    const isSunday = currentDate.getDay() === 0;
                    const isToday =
                        currentDate.getDate() === today.getDate() &&
                        currentDate.getMonth() === today.getMonth() &&
                        currentDate.getFullYear() === today.getFullYear();

                    week.push(
                        <td
                            key={date}
                            className={`align-top p-2 position-relative ${isSunday ? 'bg-lightgray' : ''} ${isToday ? 'bg-info text-white' : ''}`}
                            onClick={() => handleDateClick(currentDate)}
                            style={{ cursor: 'pointer', height: '100px' }}
                        >
                            <div className="date-number"><strong>{date}</strong></div>
                            <div className="text-primary small mt-1 text-center">New Ad</div>
                        </td>
                    );
                    date++;
                }
            }
            calendar.push(<tr key={row}>{week}</tr>);
        }
        return calendar;
    };

    const handleMonthChange = (e) => {
        setCurrentMonth(parseInt(e.target.value, 10));
    };

    const handleYearChange = (e) => {
        setCurrentYear(parseInt(e.target.value, 10));
    };

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

            {/* Modal */}
            {showModal && (
                <d className="modal fade show d-block custom-modal-overlay" tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content shadow">
                            <div className="modal-header">
                                <h5 className="modal-title w-100 text-center" style={{ color: 'orange', fontWeight: 'bold' }}>
                                    Add New Advertise
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
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
                                                onChange={(date) => setSelectedDate(date)}
                                                className="form-control"
                                                dateFormat="yyyy-MM-dd"
                                                placeholderText="Select a date"
                                                showPopperArrow={false}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label>Client</label>
                                            <Select
                                                className="w-100"
                                                showSearch
                                                options={clients}
                                                placeholder="Select Client"
                                                value={data.clientid}
                                                filterOption={(input, option) =>
                                                    option.label.toLowerCase().includes(input.toLowerCase())
                                                }
                                                onChange={(value) => setData({ ...data, clientid: value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label>Newspaper</label>
                                            <Select
                                                className="w-100"
                                                showSearch
                                                options={clients}
                                                placeholder="Select Newspaper"
                                                value={data.clientid}
                                                filterOption={(input, option) =>
                                                    option.label.toLowerCase().includes(input.toLowerCase())
                                                }
                                                onChange={(value) => setData({ ...data, clientid: value })}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label>Description</label>
                                            <Input.TextArea
                                                rows={2}
                                                style={{ resize: "both", overflow: "auto" }}
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
                                            />
                                            <TimePicker
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
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="d-block">Client- One Day Before Ad</label>
                                            <Switch
                                                checked={beforeClientSwitch}
                                                onChange={setBeforeClientSwitch}
                                                checkedChildren="YES"
                                                unCheckedChildren="NO"
                                            />
                                            <TimePicker
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
                                            />
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
                                            <TimePicker
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
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="d-block">Client- On Ad Day</label>
                                            <Switch
                                                checked={onDayClientSwitch}
                                                onChange={setOnDayClientSwitch}
                                                checkedChildren="YES"
                                                unCheckedChildren="NO"
                                            />
                                            <TimePicker
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
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="modal-footer">
                                    <button className="btn btn-danger" onClick={() => setShowModal(false)}>
                                        Cancel
                                    </button>
                                    <button className="btn btn-primary">
                                        Save
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </d>
            )}
        </main>
    );
}

export default AdScheduler;