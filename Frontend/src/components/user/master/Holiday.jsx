import React, { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './calendar.css';
import { message, Table, Button, Modal, Tooltip, Select } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Link } from "react-router";

const { Option } = Select;

function Holiday() {
  let agency = JSON.parse(localStorage.getItem("agency")) || null;
  const today = new Date();

  const [selectedDate, setSelectedDate] = useState(null);
  const [holidayName, setHolidayName] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reasonModal, setReasonModal] = useState(false);
  const [reasonDate, setReasonDate] = useState(null);
  const [holidayList, setHolidayList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Save holiday to the database
  const handleSaveHoliday = async (e) => {
    e.preventDefault();
    if (!selectedDate || !holidayName.trim()) {
      message.error("Please fill all required fields");
      return;
    }

    const holidayData = {
      agencyid: agency._id,
      hdate: dayjs(selectedDate).format('YYYY-MM-DD'),
      reason: holidayName.trim(),
      every_year: recurring,
    };

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8081/holidays", holidayData);
      if (response.data.status === "success") {
        message.success("Holiday added successfully");
        // Update the holidayList state immediately
        setHolidayList(prevList => [...prevList, response.data.data]);
        setShowModal(false);
        setHolidayName('');
        setRecurring(false);
        setSelectedDate(null);
      } else {
        message.error(response.data.message || "Failed to save holiday");
      }
    } catch (error) {
      console.error("Save failed:", error);
      message.error(error.response?.data?.message || "Failed to save holiday");
    } finally {
      setLoading(false);
    }
  };

  // Fetch holidays from the database
  const fetchHolidays = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/holidays/${agency._id}`);
      if (response.data.status === "success") {
        setHolidayList(response.data.data || []);
      } else {
        console.error("Failed to fetch holidays:", response.data.message);
      }
    } catch (err) {
      console.error("Error fetching holidays:", err);
      message.error("Failed to fetch holidays");
    }
  };

  // Delete a holiday
  const deleteHoliday = async (id) => {
    try {
      setLoading(true);
      const response = await axios.delete(`http://localhost:8081/holidays/${id}`);

      if (response.data.status === "success") {
        message.success("Holiday deleted successfully");
        // Update state immediately without refetching
        setHolidayList(prevList => prevList.filter(holiday => holiday._id !== id));
        // Close the reason modal if open
        setReasonModal(false);
      } else {
        message.error(response.data.message || "Failed to delete holiday");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      message.error(error.response?.data?.message || "Failed to delete holiday");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const openReasonModalForDate = (date) => {
    setReasonDate(date);
    setReasonModal(true);
  };

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
          week.push(<td key={`empty-${row}-${col}`} />);
        } else if (date > daysInMonth) {
          week.push(<td key={`empty-${row}-${col}`} />);
        } else {
          const currentDate = new Date(currentYear, currentMonth, date);
          const formattedDate = dayjs(currentDate).format('YYYY-MM-DD');
          const isSunday = currentDate.getDay() === 0;
          const isToday =
            currentDate.getDate() === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();

          // Filter holidays for the current date
          const holidayReasons = holidayList.filter(holiday =>
            dayjs(holiday.hdate).format('YYYY-MM-DD') === formattedDate
          );

          const tooltipContent = (
            <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', color: 'black' }}>
              <strong style={{ fontSize: '14px', display: 'block', marginBottom: '5px' }}>
                {dayjs(currentDate).format('DD/MM/YYYY')}
              </strong>
              <div style={{ height: '2px', backgroundColor: 'blue', marginBottom: '10px' }}></div>
              {holidayReasons.length > 0 ? (
                <ol style={{ paddingLeft: '20px', margin: '0' }}>
                  {holidayReasons.map((holiday, index) => (
                    <li key={index} style={{ fontSize: '12px', marginBottom: '5px' }}>
                      {holiday.reason}
                    </li>
                  ))}
                </ol>
              ) : (
                <p style={{ fontSize: '12px', color: 'gray' }}>No holidays found</p>
              )}
            </div>
          );

          const hasHoliday = holidayReasons.length > 0;

          week.push(
            <td
              key={`day-${date}`}
              className={`text-center align-top p-2 position-relative ${isSunday ? 'bg-lightgray' : ''} ${isToday ? 'bg-info text-white' : ''}`}
              style={{ cursor: 'pointer', height: '100px' }}
            >
              <div>
                <strong>{date}</strong>
              </div>

              {hasHoliday && (
                <Tooltip
                  title={tooltipContent}
                  placement="top"
                  mouseEnterDelay={0.3}
                  overlayStyle={{ pointerEvents: 'none' }}
                >
                  <Button
                    size="small"
                    style={{ backgroundColor: 'orange', color: 'white', marginTop: 5 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      openReasonModalForDate(formattedDate);
                    }}
                  >
                    Reasons: {holidayReasons.length}
                  </Button>
                </Tooltip>
              )}

              <div
                className="text-primary small mt-1"
                style={{ position: 'absolute', bottom: '5px', left: '5px', cursor: 'pointer' }}
                onClick={() => handleDateClick(currentDate)}
              >
                New Holiday
              </div>
            </td>
          );
          date++;
        }
      }
      calendar.push(<tr key={`week-${row}`}>{week}</tr>);
    }

    return calendar;
  };

  const handleMonthChange = (value) => {
    setCurrentMonth(parseInt(value, 10));
  };

  const handleYearChange = (value) => {
    setCurrentYear(parseInt(value, 10));
  };


  const filteredReasons = useMemo(() => {
    if (!reasonDate) return [];
    return holidayList.filter(holiday =>
      dayjs(holiday.hdate).format('YYYY-MM-DD') === reasonDate
    );
  }, [holidayList, reasonDate]);

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
          <div className='d-flex justify-content-end align-items-center mb-3'>
            <Select
              value={currentMonth}
              onChange={handleMonthChange}
              style={{ width: 120, marginRight: 10 }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <Option key={i} value={i}>
                  {dayjs().month(i).format('MMMM')}
                </Option>
              ))}
            </Select>
            <Select
              value={currentYear}
              onChange={handleYearChange}
              style={{ width: 120 }}
            >
              {Array.from({ length: 20 }, (_, i) => (
                <Option key={i} value={today.getFullYear() - 10 + i}>
                  {today.getFullYear() - 10 + i}
                </Option>
              ))}
            </Select>
          </div>
        </div>
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
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title text-center w-100" style={{ color: 'orange' }}>Add Holiday</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label>Date</label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date()}
                  />
                </div>
                <div className="mb-3">
                  <label>Holiday Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={holidayName}
                    onChange={(e) => setHolidayName(e.target.value)}
                    placeholder="Enter holiday reason"
                  />
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="recurring"
                    checked={recurring}
                    onChange={(e) => setRecurring(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="recurring">
                    Repeat Every Year
                  </label>
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
                  onClick={handleSaveHoliday}
                  disabled={loading || !selectedDate || !holidayName.trim()}
                >
                  {loading ? 'Saving...' : 'Save Holiday'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        title={
          <div style={{
            color: 'orange',
            textAlign: 'center',
            padding: '16px 0',
            fontSize: '18px',
            fontWeight: '500'
          }}>
            {`Reasons for the holiday on: ${dayjs(reasonDate).format('DD/MM/YYYY')}`}
          </div>
        }
        open={reasonModal}
        onCancel={() => setReasonModal(false)}
        footer={[
          <Button
            key="close"
            className="btn btn-danger"
            onClick={() => setReasonModal(false)}
            style={{ margin: '16px 0' }}
          >
            Close
          </Button>,
        ]}
        bodyStyle={{
          padding: '20px 24px'
        }}
        style={{
          top: '50px'
        }}
      >
        <Table
          columns={[
            {
              title: 'Actions',
              key: 'actions',
              render: (_, record) => (
                <Button
                  type="text"
                  icon={<DeleteOutlined style={{ color: 'red' }} />}
                  onClick={() => deleteHoliday(record._id)}
                  disabled={loading}
                />
              ),
              width: 80,
              align: 'center'
            },
            {
              title: 'No',
              key: 'no',
              render: (_, __, index) => index + 1,
              width: 60,
              align: 'center'
            },
            {
              title: 'Details',
              dataIndex: 'reason',
              key: 'reason',
              ellipsis: true
            },
            {
              title: 'Every Year',
              dataIndex: 'every_year',
              key: 'every_year',
              render: (val) => val ? 'Yes' : 'No',
              width: 100,
              align: 'center'
            }
          ]}
          dataSource={filteredReasons}
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

export default Holiday;