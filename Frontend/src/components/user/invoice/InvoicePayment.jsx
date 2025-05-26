import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Modal, Input, Table, DatePicker, Popconfirm, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import axios from 'axios';

function InvoicePayment() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);
    const [invoice, setInvoice] = useState(null);
    const [paymentDate, setPaymentDate] = useState(dayjs());
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const { id } = useParams();

    // Fetch invoice by emediaroid
    const fetchInvoice = async (invoiceId) => {
        try {
            const res = await axios.get(`http://localhost:8081/invoices/${invoiceId}`);
            setInvoice(res.data.data);
        } catch (err) {
            // Optionally show error
        }
    };

    const columns = [
        { title: 'No', dataIndex: 'no', key: 'no', width: 50 },
        { title: 'Payment Date', dataIndex: 'paymentDate', key: 'date' },
        { title: 'Description', dataIndex: 'description', key: 'desc' },
        { title: 'Amount', dataIndex: 'amount', key: 'amount' },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <Popconfirm
                    title="Are you sure to delete this Payment?"
                    onConfirm={() => handleDeletePayment(record._id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        size='small'
                    />
                </Popconfirm>
            ),
            width: '5%',
        },
    ];

    // Save payment handler
    const handleSavePayment = async () => {
         if (!paymentDate || !description || !amount) {
            message.error('Please fill all payment fields.');
            return;
        }
        try {
            await axios.patch(
                `http://localhost:8081/invoices/${invoice._id}/add-payment`,
                {
                    payment: {
                        paymentDate: paymentDate.toISOString(),
                        description,
                        amount: parseFloat(amount),
                    },
                }
            );
            message.success('Payment saved!');
            // Optionally, refresh invoice data to update table
            fetchInvoice(id);
            setDescription('');
            setAmount('');
            setPaymentDate(dayjs());
        } catch (err) {
            message.error('Failed to save payment.');
        }

    };

    // Delete payment handler
    const handleDeletePayment = async (paymentId) => {
        try {
            await axios.patch(
                `http://localhost:8081/invoices/${invoice._id}/delete-payment`,
                { paymentId }
            );
            message.success('Payment deleted!');
            // Optionally, refresh invoice data to update table
            fetchInvoice(id);
        } catch (err) {
            message.error('Failed to delete payment.');
        }
    };

    useEffect(() => {
        if (id) {
            fetchInvoice(id);
        }
    }, [id]);

    return (
        <main id="main" className="main" style={{ backgroundColor: "#f5f5f5", padding: 20 }}>
            <Modal
                open={open}
                footer={null}
                closable={false}
                width={1000}
                bodyStyle={{ padding: 32 }}
                style={{ right: 100, top: 120, position: 'absolute' }}
            >
                <h4
                    style={{
                        color: '#ff9800',
                        textAlign: 'center',
                        marginBottom: 24,
                        fontWeight: 'bold',
                    }}
                >
                    Invoice Payment Details
                </h4>
                <hr />
                <div style={{ borderBottom: '1px solid #eee', marginBottom: 16, paddingBottom: 16 }}>
                    {/* Row 1 */}
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'start',
                            fontWeight: 600,
                            marginBottom: 12,
                            gap: '250px', // Adjust gap between Invoice No and Invoice Date
                        }}
                    >
                        <div style={{ minWidth: '200px' }}>
                            <span style={{ fontWeight: 'bold' }}>Invoice No : </span>{invoice?.invoiceNo || ''}
                        </div>
                        <div style={{ minWidth: '200px' }}>
                            <span style={{ fontWeight: 'bold' }}>Invoice Date : </span>{invoice?.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString('en-GB') : ''}
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            fontWeight: 600,
                        }}
                    >
                        <div style={{ minWidth: '300px', marginLeft: 0 }}>
                            <span style={{ fontWeight: 'bold' }}>Client : </span>{invoice?.clientid.name || ''}
                        </div>

                    </div>

                    {/* Row 3 */}
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'start',
                            fontWeight: 600,
                            marginBottom: 12,
                            gap: '150px', // Adjust gap between Invoice No and Invoice Date
                        }}
                    >
                        <div style={{ minWidth: '300px', marginTop: 16 }} >
                            <span style={{ fontWeight: 'bold' }}>Invoice Amount : </span>{invoice?.billAmount || ''}
                        </div>
                        <div style={{ minWidth: '430px', marginTop: 16 }}>
                            <span style={{ fontWeight: 'bold' }}>Remaining Amount : </span>
                            {(() => {
                                const invoiceAmount = Number(invoice?.billAmount) || 0;
                                const payments = invoice?.payments || [];
                                if (!payments.length) return invoiceAmount;
                                const paid = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
                                return (invoiceAmount - paid).toFixed(2);
                            })()}
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 24 }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: 16 }}>
                            <label>Payment Date</label>
                            <DatePicker style={{ width: '100%' }} defaultValue={dayjs()} format="DD/MM/YYYY" value={paymentDate} onChange={setPaymentDate} />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label>Description</label>
                            <Input value={description} onChange={e => setDescription(e.target.value)} />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label>Amount</label><br />
                            <Input
                                type="number"
                                value={amount}
                                style={{ width: '50%' }}
                                onChange={e => setAmount(e.target.value)}
                            />
                        </div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <Table
                            columns={columns}
                            dataSource={invoice?.payments?.map((p, i) => ({
                                key: i,
                                no: i + 1,
                                paymentDate: p.paymentDate ? new Date(p.paymentDate).toLocaleDateString('en-GB') : '',
                                description: p.description,
                                amount: p.amount,
                                _id: p._id,
                            })) || []}
                            pagination={false}
                            bordered
                            size="small"
                        />
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: 24, marginBottom: 0 }}>
                    <Button type="primary" style={{ marginRight: 16, width: 120 }} onClick={handleSavePayment}>SAVE</Button>
                    <Button danger style={{ width: 120 }} onClick={() => navigate('/invoice/invoiceList')}>CLOSE</Button>
                </div>
            </Modal>
        </main>
    )
};

export default InvoicePayment