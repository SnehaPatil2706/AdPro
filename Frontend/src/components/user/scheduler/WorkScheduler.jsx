import React from 'react'
import { useState } from 'react';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import { Input, Select } from 'antd';
import axios from 'axios';


function WorkScheduler() {
    let agency = JSON.parse(localStorage.getItem("agency")) || null;

    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [workTitle, setWorkTitle] = useState('');
    const [users, setUsers] = useState([]);

    const [data, setData] = useState({
        id: "",
        agencyid: agency._id,
        wdate: "",
        userid: "",
        title: "",
        description: ""
    })


    const handleMonthChange = (e) => {
        setCurrentMonth(parseInt(e.target.value, 10));
    };

    const handleYearChange = (e) => {
        setCurrentYear(parseInt(e.target.value, 10));
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

                            style={{ cursor: 'pointer', height: '100px' }}
                        >
                            <div className="date-number"><strong>{date}</strong></div>
                            <div className="text-primary small mt-1 text-center"
                                style={{ position: 'absolute', bottom: '5px', left: '5px', cursor: 'pointer' }}
                                onClick={() => handleDateClick(currentDate)}>
                                New Work</div>
                        </td>
                    );
                    date++;
                }
            }
            calendar.push(<tr key={row}>{week}</tr>);
        }
        return calendar;
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
        setShowModal(true);
    };

    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    function loadData(){
        axios.get("http://localhost:8081/users").then((res)=>{
            setUsers(
                res.data.data.map((user)=>({
                    label: user.name,
                    value: user._id
                }))
            )
        })
    }

    return (
        <main id="main" className="main">
            <div className="pagetitle">
                <h1>Work Scheduler</h1>
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

            {/* Modal */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content shadow">
                            <div className="modal-header">
                                <h5 className="modal-title text-center w-100" style={{ color: 'orange' }}>Add New Work</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label>Work Date</label><br />
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={(date) => setSelectedDate(date)}
                                        className="form-control"
                                        dateFormat="yyyy-MM-dd"
                                        minDate={new Date()}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label >Employee</label><br />
                                    <Select
                                        className="w-100"
                                        showSearch
                                        style={{ width: 120 }}
                                        // onChange={handleChange}
                                        placeholder="Select Employee"
                                        options={users}
                                        value={data.userid}
                                        filterOption={(input, option) =>
                                            option.label.toLowerCase().includes(input.toLowerCase())
                                        }
                                        onChange={(value) => setData({ ...data, userid: value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Work Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={workTitle}
                                        onChange={(e) => setWorkTitle(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Work Description</label>
                                    <Input.TextArea
                                        rows={2}
                                        className="mt-2"
                                        style={{ resize: "both", overflow: "auto" }}
                                    />
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-danger"
                                    onClick={() => setShowModal(false)}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary"
                                    disabled={loading || !selectedDate || !workTitle.trim()}
                                >
                                    {loading ? 'Saving...' : 'Save Work'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}

export default WorkScheduler