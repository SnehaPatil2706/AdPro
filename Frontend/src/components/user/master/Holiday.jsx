import React, { useState } from 'react';
import dayjs from 'dayjs';
import 'bootstrap/dist/css/bootstrap.min.css';
import './calendar.css';
import { Link } from "react-router";
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { message,Switch,  } from 'antd';
import axios from 'axios';

function Holiday() {
  let agency = JSON.parse(localStorage.getItem("agency")) || null;
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [holidayName, setHolidayName] = useState('');
  const [recurring, setRecurring] = useState(false);

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const handleSaveHoliday = (e) => {
    e.preventDefault();
    const holidayData = {
      agencyid: agency._id,
      hdate: selectedDate,
      reason: holidayName,
      every_year: recurring,
    };

    axios
      .post("http://localhost:8081/holidays", holidayData)
      .then(() => {
        message.success("Holiday added successfully");
        setShowModal(false);
        setHolidayName('');
        setRecurring(false);
        setSelectedDate(null);
        // fetchHolidays();
      })
      .catch(() => {
        message.error("Save failed");
      });
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
              <div className="text-primary small mt-1 text-center">New Holiday</div>
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
          <h1>Holiday</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to={"/"}>Master</Link>
              </li>
              <li className="breadcrumb-item active">Holiday</li>
            </ol>
          </nav>
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
        <div className="modal fade show d-block custom-modal-overlay" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title w-100 text-center" style={{ color: 'orange', fontWeight: 'bold' }}>
                  New Holiday
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label>Date</label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select a date"
                    showPopperArrow={false}
                  />
                </div>

                <div className="mb-3">
                  <label>Holiday Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={holidayName}
                    onChange={(e) => setHolidayName(e.target.value)}
                  />
                </div>
                <div className="form-check">
                  <Switch
                    checked={recurring}
                    onChange={(checked) => setRecurring(checked)}
                    checkedChildren="YES"
                    unCheckedChildren="NO"
                  />
                  <label className="form-check-label ms-2" htmlFor="recurring">
                    Repeat Every Year
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-danger" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSaveHoliday}>
                  Save Holiday
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Holiday;
