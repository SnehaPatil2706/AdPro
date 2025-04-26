import React, { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import { Input, message, Modal, Button, Tooltip, Table, Switch } from 'antd';
import axios from 'axios';
// import { DeleteOutlined } from '@ant-design/icons';

function WorkScheduler() {
    let agency = JSON.parse(localStorage.getItem("agency")) || null;

    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [workTitle, setWorkTitle] = useState('');
    const [workDescription, setWorkDescription] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [users, setUsers] = useState([]);
    const [workList, setWorkList] = useState([]);
    const [workDate, setWorkDate] = useState(null);
    const [workModal, setWorkModal] = useState(false);

    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    const handleMonthChange = (e) => setCurrentMonth(parseInt(e.target.value, 10));
    const handleYearChange = (e) => setCurrentYear(parseInt(e.target.value, 10));

    const isPastDate = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const handleDateClick = (date) => {
        if (!isPastDate(date)) {
            setSelectedDate(date);
            setShowModal(true);
        }
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
                    const isToday = currentDate.toDateString() === today.toDateString();

                    // Filter works based on the current date
                    const workReasons = workList.filter(work =>
                        dayjs(work.wdate).format('YYYY-MM-DD') === formattedDate
                    );

                    // Count works where status is "No"
                    const worksWithStatusNo = workReasons.filter(work => work.status === 'No');

                    // Calculate total work count (both Yes and No)
                    const totalWorksCount = workReasons.length;

                    // Calculate works count with status "No"
                    const worksCount = worksWithStatusNo.length;

                    // Only render the "Works" button if there is any work assigned on this day
                    const showWorksButton = totalWorksCount > 0;

                    const tooltipContent = (
                        <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', color: 'black' }}>
                            <strong style={{ fontSize: '14px', display: 'block', marginBottom: '5px' }}>
                                {dayjs(currentDate).format('DD/MM/YYYY')}
                            </strong>
                            <div style={{ height: '2px', backgroundColor: 'blue', marginBottom: '10px' }}></div>
                            {totalWorksCount > 0 ? (
                                <ol style={{ paddingLeft: '20px', margin: '0' }}>
                                    {workReasons.map((work, index) => (
                                        <li
                                            key={index}
                                            style={{
                                                fontSize: '12px',
                                                marginBottom: '5px',
                                                color: work.title.toLowerCase().includes('holiday') ? 'red' : 'black',
                                                fontWeight: work.title.toLowerCase().includes('holiday') ? 'bold' : 'normal'
                                            }}
                                        >
                                            {work.title}
                                        </li>
                                    ))}
                                </ol>
                            ) : (
                                <p style={{ fontSize: '12px', color: 'gray' }}>No work found</p>
                            )}
                        </div>
                    );

                    week.push(
                        <td
                            key={`day-${date}`}
                            className={`align-top p-2 position-relative ${isSunday ? 'bg-lightgray' : ''} ${isToday ? 'bg-info text-white' : ''}${isPastDate(currentDate) ? 'text-muted' : ''}`}
                            style={{ cursor: 'pointer', height: '100px' }}
                        >
                            <div className="date-number">
                                <strong>{date}</strong>
                            </div>

                            <Tooltip
                                title={tooltipContent}
                                placement="top"
                                mouseEnterDelay={0.3}
                                overlayStyle={{ pointerEvents: 'none' }}
                            >
                                {showWorksButton && (
                                    <Button
                                        size="small"
                                        style={{ backgroundColor: 'orange', color: 'white', marginTop: 5 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setWorkDate(currentDate);
                                            setWorkModal(true);
                                        }}
                                    >
                                        {worksCount > 0 ? `Works: ${worksCount}` : 'Works: 0'}
                                    </Button>
                                )}
                            </Tooltip>

                            {!isPastDate(currentDate) && (
                                <div
                                    className="text-primary small mt-1 text-center"
                                    style={{ position: 'absolute', bottom: '5px', left: '5px', cursor: 'pointer' }}
                                    onClick={() => handleDateClick(currentDate)}
                                >
                                    New Work
                                </div>
                            )}
                        </td>
                    );
                    date++;
                }
            }
            calendar.push(<tr key={row}>{week}</tr>);
        }
        return calendar;
    };



    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        axios.get("http://localhost:8081/users")
            .then((res) => {
                setUsers(
                    res.data.data.map((user) => ({
                        label: user.name,
                        value: user._id
                    }))
                );
            });

        axios.get("http://localhost:8081/workschedules")
            .then((res) => {
                setWorkList(res.data.data);
            });
    };

    const handleSaveWork = async (e) => {
        e.preventDefault();
        if (!selectedDate || !workTitle.trim() || !workDescription.trim()) {
            message.error("Please fill in all fields.");
            return;
        }

        const workData = {
            agencyid: agency._id,
            userid: selectedUser,
            wdate: dayjs(selectedDate).format('YYYY-MM-DD'),
            title: workTitle.trim(),
            description: workDescription.trim(),
            status: 'No'
        };

        setLoading(true);
        try {
            const response = await axios.post("http://localhost:8081/workschedules", workData);
            if (response.data.status === "success") {
                message.success("Work added successfully");

                // Refresh data
                loadData();
                setWorkModal(false);
                // Reset form and close modal
                setShowModal(false);
                setWorkTitle('');
                setWorkDescription('');
                setSelectedDate(null);
            } else {
                message.error(response.data.message || "Failed to save work");
            }
        } catch (error) {
            console.error("Save failed:", error);
            message.error(error.response?.data?.message || "Failed to save work");
        } finally {
            setLoading(false);
        }
        setShowModal(false)
        setSelectedUser('');
        setWorkTitle('');
        setWorkDescription('');
        setSelectedDate(null);


        window.location.reload();
    };

    // Delete a work
    // const deleteWork = async (id) => {
    //     try {
    //         setLoading(true);
    //         const response = await axios.delete(`http://localhost:8081/workschedules/${id}`); // ✅ Corrected endpoint

    //         if (response.data.status === "success") {
    //             message.success("Work deleted successfully");
    //             // Refresh data instead of filtering manually (to be safe)
    //             loadData();
    //             setWorkModal(false); // close the modal if needed
    //         } else {
    //             message.error(response.data.message || "Failed to delete work");
    //         }
    //     } catch (error) {
    //         console.error("Delete failed:", error);
    //         message.error(error.response?.data?.message || "Failed to delete work");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleStatusChange = async (id, checked) => {
        try {
            setLoading(true);
            const newStatus = checked ? 'Yes' : 'No';
            await axios.put(`http://localhost:8081/workschedules/${id}`, { status: newStatus });
            message.success(`Status updated to ${newStatus}`);
            loadData(); // refresh the table
        } catch (error) {
            console.error('Error updating status:', error);
            message.error('Failed to update status');
        } finally {
            setLoading(false);
        }
    };


    const filteredWorks = useMemo(() => {
        if (!workDate) return [];
        return workList.filter(work =>
            dayjs(work.wdate).format('YYYY-MM-DD') === dayjs(workDate).format('YYYY-MM-DD')
        );
    }, [workList, workDate]);

    const userMap = useMemo(() => {
        const map = {};
        users.forEach(user => {
            map[user.value] = user.label;
        });
        return map;
    }, [users]);


    return (
        <main id="main" className="main">
            <div className={`content-wrapper ${showModal ? 'blurred' : ''}`}>
                <div className="pagetitle">
                    <h1>Work Scheduler</h1>
                </div>

                {/* Month & Year Selectors */}
                <div className="d-flex justify-content-end align-items-center mb-3">
                    <select value={currentMonth} onChange={handleMonthChange} className="form-select w-auto me-2">
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i} value={i}>{dayjs().month(i).format('MMMM')}</option>
                        ))}
                    </select>
                    <select value={currentYear} onChange={handleYearChange} className="form-select w-auto">
                        {Array.from({ length: 10 }, (_, i) => currentYear - 5 + i).map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                {/* Calendar */}
                <table className="table table-bordered calendar-table">
                    <thead>
                        <tr className="table-light text-center">
                            <th>SUNDAY</th><th>MONDAY</th><th>TUESDAY</th><th>WEDNESDAY</th><th>THURSDAY</th><th>FRIDAY</th><th>SATURDAY</th>
                        </tr>
                    </thead>
                    <tbody>{renderCalendar()}</tbody>
                </table>
            </div>

            {/* Add Work Modal */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
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
                                    <label>User</label>
                                    <select
                                        className='form-control'
                                        value={selectedUser}
                                        onChange={(e) => setSelectedUser(e.target.value)}
                                    >
                                        <option value="">Select User</option>
                                        {users.map(user => (
                                            <option key={user.value} value={user.value}>{user.label}</option>
                                        ))}
                                    </select>

                                </div>
                                <div className="mb-3">
                                    <label>Work Title</label>
                                    <input type="text" className="form-control" value={workTitle} onChange={(e) => setWorkTitle(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label>Work Description</label>
                                    <Input.TextArea rows={2} className="mt-2" value={workDescription} onChange={(e) => setWorkDescription(e.target.value)} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-danger" onClick={() => setShowModal(false)} disabled={loading}>Cancel</button>
                                <button className="btn btn-primary"
                                    onClick={handleSaveWork}
                                    disabled={loading || !selectedDate || !workTitle.trim() || !workDescription.trim()}>
                                    {loading ? 'Saving...' : 'Save Work'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Work View Modal */}
            <Modal
                title={
                    <div style={{
                        color: 'orange',
                        textAlign: 'center',
                        padding: '16px 0',
                        fontSize: '18px',
                        fontWeight: '500'
                    }}>
                        {`Works on: ${dayjs(workDate).format('DD/MM/YYYY')}`}
                    </div>
                }
                open={workModal}
                onCancel={() => setWorkModal(false)}
                footer={[
                    <Button
                        key="close"
                        className="btn btn-danger"
                        onClick={() => setWorkModal(false)}
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
                        // {
                        //     title: 'Actions',
                        //     key: 'actions',
                        //     render: (_, record) => (
                        //         <Popconfirm
                        //             title="Are you sure you want to delete this Work?"
                        //             onConfirm={() => deleteWork(record._id)}  // ✅ Only runs when user confirms
                        //             okText="Yes"
                        //             cancelText="No"
                        //         >
                        //             <Button
                        //                 type="primary"
                        //                 danger
                        //                 icon={<DeleteOutlined style={{ fontSize: '12px' }} />}
                        //                 size="small"
                        //                 style={{
                        //                     padding: '0 6px',
                        //                     fontSize: '12px',
                        //                     height: '28px', // you can try '22px' for even tighter
                        //                     lineHeight: '24px'
                        //                 }}
                        //             >
                        //             </Button>
                        //         </Popconfirm>
                        //     ),
                        //     width: 80,
                        //     align: 'center'
                        // },
                        {
                            title: 'No',
                            key: 'no',
                            render: (_, __, index) => index + 1,
                            width: 60,
                            align: 'center'
                        },
                        {
                            title: 'Employee',
                            dataIndex: 'userid',
                            key: 'userid',
                            render: (userid) => userMap[userid] || 'Unknown'

                        },
                        {
                            title: 'Title',
                            dataIndex: 'title',
                            key: 'title',
                            ellipsis: true
                        },
                        {
                            title: 'Description',
                            dataIndex: 'description',
                            key: 'description',
                            ellipsis: true
                        },
                        {
                            title: 'Done?',
                            dataIndex: 'status',
                            key: 'status',
                            render: (status, record) => (
                                <Switch
                                    checked={status === 'Yes'}  // Show checked if status is 'Yes'
                                    checkedChildren="YES"
                                    unCheckedChildren="NO"
                                    onChange={(checked) => handleStatusChange(record._id, checked)}
                                />
                            ),
                        },


                    ]}
                    dataSource={filteredWorks}
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

export default WorkScheduler;