import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Modal, Button, Input, DatePicker, Table, message, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

function EMediaInvoicePayment() {
    const [open, setOpen] = useState(false);
    const [invoice, setInvoice] = useState(null);
    const [emediaro, setEmediaro] = useState(null);
    const [emedia, setEmedia] = useState(null);
    const [paymentDate, setPaymentDate] = useState(dayjs());
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const navigate = useNavigate();
    const { id } = useParams(); // Get invoice ID from route

    useEffect(() => {
        setOpen(true);
        if (id) {
            fetchInvoice(id);
        }
    }, [id]);

    // Fetch invoice by emediaroid
    const fetchInvoice = async (emediaroid) => {
        const res = await axios.get(`http://localhost:8081/emediaroinvoices/by-emediaroid/${emediaroid}`);
        setInvoice(res.data.data);
        if (res.data.data?.emediaroid) {
            // If emediaroid is an object, use ._id, else use as is
            const emediaroId = res.data.data.emediaroid._id || res.data.data.emediaroid;
            fetchEmediaro(emediaroId);
        }
    };

    const fetchEmediaro = async (emediaroId) => {
        const res = await axios.get(`http://localhost:8081/emediaros/${emediaroId}`);
        setEmediaro(res.data.data);
        if (res.data.data?.emediaid) {
            const emediaId = res.data.data.emediaid._id || res.data.data.emediaid;
            fetchEmedia(emediaId);
        }
        console.log("Fetched E-Media RO:", res.data.data.emediaid);
    };

    const fetchEmedia = async (emediaId) => {
        const res = await axios.get(`http://localhost:8081/emedias/${emediaId}`);
        setEmedia(res.data.data);
        console.log("Fetched E-Media:", res.data.data);

    };

    // Dummy data for table
    const columns = [
        { title: 'No', dataIndex: 'no', key: 'no', width: 50 },
        { title: 'Payment Date', dataIndex: 'paymentdate', key: 'date' },
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
    const data = [];

    // Save payment handler
    const handleSavePayment = async () => {
        if (!paymentDate || !description || !amount) {
            message.error('Please fill all payment fields.');
            return;
        }
        try {
            await axios.patch(
                `http://localhost:8081/emediaroinvoices/${invoice._id}/add-payment`,
                {
                    payment: {
                        paymentdate: paymentDate.toISOString(),
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
                `http://localhost:8081/emediaroinvoices/${invoice._id}/delete-payment`,
                { paymentId }
            );
            message.success('Payment deleted!');
            // Optionally, refresh invoice data to update table
            fetchInvoice(id);
        } catch (err) {
            message.error('Failed to delete payment.');
        }
    };

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
                    E-Media Invoice Payment Details
                </h4>
                <hr />
                <div style={{ borderBottom: '1px solid #eee', marginBottom: 16, paddingBottom: 16 }}>
                    {/* Row 1 */}
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            fontWeight: 600,
                            marginBottom: 12,
                        }}
                    >
                        <div style={{ minWidth: '200px' }}>
                            <span style={{ fontWeight: 'bold' }}>Invoice No : </span>{invoice?.invoiceno || ''}
                        </div>
                        <div style={{ minWidth: '200px' }}>
                            <span style={{ fontWeight: 'bold' }}>Invoice Date : </span>{invoice?.invoicedate ? new Date(invoice.invoicedate).toLocaleDateString('en-GB') : ''}
                        </div>
                        <div style={{ minWidth: '200px' }}>
                            <span style={{ fontWeight: 'bold' }}>RO No : </span>{emediaro?.rono || ''}
                        </div>
                        <div style={{ minWidth: '200px' }}>
                            <span style={{ fontWeight: 'bold' }}>RO Date : </span>{emediaro?.rodate ? new Date(emediaro.rodate).toLocaleDateString('en-GB') : ''}
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
                            <span style={{ fontWeight: 'bold' }}>Client : </span>{emediaro?.clientid.name || ''}
                        </div>
                        <div style={{ minWidth: '297px', marginLeft: 24 }}>
                            <span style={{ fontWeight: 'bold' }}>Publication : </span>{emediaro?.emediaid.name || ''}
                        </div><br />
                        <div style={{ minWidth: '300px', marginTop: 16 }} >
                            <span style={{ fontWeight: 'bold' }}>Invoice Amount : </span>{invoice?.invoiceamount || ''}
                        </div>
                        <div style={{ minWidth: '430px', marginTop: 16 }}>
                            <span style={{ fontWeight: 'bold' }}>Remaining Amount : </span>
                            {(() => {
                                const invoiceAmount = Number(invoice?.invoiceamount) || 0;
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
                                paymentdate: p.paymentdate ? new Date(p.paymentdate).toLocaleDateString('en-GB') : '',
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
                    <Button danger style={{ width: 120 }} onClick={() => navigate('/emedia/emediaROList')}>CLOSE</Button>
                </div>
            </Modal>
        </main>
    );
}

export default EMediaInvoicePayment;