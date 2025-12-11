import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Modal, Button, Input, DatePicker, Table, message, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

function PMediaInvoicePayment() {
    const agency = JSON.parse(localStorage.getItem("agency")) || null;
    const agencyid = agency?._id;
    const [open, setOpen] = useState(false);
    const [invoice, setInvoice] = useState(null);
    const [pmediaro, setPmediaro] = useState(null);
    const [pmedia, setPmedia] = useState(null);
    const [paymentDate, setPaymentDate] = useState(dayjs());
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const navigate = useNavigate();
    const { id } = useParams(); // Get invoice ID from route
    const [descriptionError, setDescriptionError] = useState('');
const [amountError, setAmountError] = useState('');


    useEffect(() => {
        console.log("Value of id from URL params:", id); // This should print
        setOpen(true);
        if (id) {
            console.log("Calling fetchInvoice now...");
            fetchInvoice(id);
            fetchPmediaro(id);
            fetchPmedia(id);
        }
    }, [id]);

    // Fetch invoice by pmediaroid
    const fetchInvoice = async (pmediaroid) => {
        console.log("Fetching invoice with pmediaroid:", pmediaroid);
        try {
            const res = await axios.get(`http://localhost:8081/pmediaroinvoices/by-pmediaroid/${pmediaroid}`);

            if (res.data && res.data.status === 'success') {
                setInvoice(res.data.data);
                console.log("Fetched Invoice:", res.data.data);

                // If you need to fetch related data
                if (res.data.data?.pmediaroid) {
                    const pmediaroId = res.data.data.pmediaroid._id || res.data.data.pmediaroid;
                    await fetchPmediaro(pmediaroId);
                }
            } else {
                console.error("Unexpected response format:", res.data);
                message.error("Failed to load invoice data");
            }
        } catch (err) {
            console.error("Error fetching invoice:", err);
            message.error("Failed to connect to server");

            // For debugging - log the full error
            if (err.response) {
                console.error("Server responded with:", err.response.status, err.response.data);
            }
        }
    };

    const fetchPmediaro = async (pmediaroId) => {
        const res = await axios.get(`http://localhost:8081/pmediaros/${pmediaroId}`);
        setPmediaro(res.data.data);
        console.log("Fetched P-Media RO:", res.data.data);

        if (res.data.data?.pmediaid) {
            const pmediaId = res.data.data.pmediaid._id || res.data.data.pmediaid;
            fetchPmedia(pmediaId);
        }
        console.log("Fetched P-Media RO:", res.data.data.pmediaid);
    };

    const fetchPmedia = async (pmediaId) => {
        try {
            const res = await axios.get(`http://localhost:8081/pmedias/${pmediaId}`);
            setPmedia(res.data.data);
            console.log("Fetched P-Media:", res.data.data);

        } catch (error) {
            console.error("Error fetching P-Media:", error);
        }
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
    let valid = true;
    if (!description.trim()) {
        setDescriptionError('Description is required.');
        valid = false;
    } else {
        setDescriptionError('');
    }

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        setAmountError('Enter a valid amount greater than 0.');
        valid = false;
    } else {
        setAmountError('');
    }

    if (!valid) return;

    try {
        await axios.patch(
            `http://localhost:8081/pmediaroinvoices/${invoice._id}/add-payment`,
            {
                payment: {
                    paymentdate: paymentDate.toISOString(),
                    description,
                    amount: parseFloat(amount),
                },
            }
        );
        message.success('Payment saved!');
        fetchInvoice(id);
        setDescription('');
        setAmount('');
        setPaymentDate(dayjs());
        setDescriptionError('');
        setAmountError('');
    } catch (err) {
        message.error('Failed to save payment.');
    }
};


    // Delete payment handler
    const handleDeletePayment = async (paymentId) => {
        try {
            await axios.patch(
                `http://localhost:8081/pmediaroinvoices/${invoice._id}/delete-payment`,
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
                    P-Media Invoice Payment Details
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
                            <span style={{ fontWeight: 'bold' }}>RO No : </span>{pmediaro?.rono || ''}
                        </div>
                        <div style={{ minWidth: '200px' }}>
                            <span style={{ fontWeight: 'bold' }}>RO Date : </span>{pmediaro?.rodate ? new Date(pmediaro.rodate).toLocaleDateString('en-GB') : ''}
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
                            <span style={{ fontWeight: 'bold' }}>Client : </span>{pmediaro?.clientid.name || ''}
                        </div>
                        <div style={{ minWidth: '297px', marginLeft: 24 }}>
                            <span style={{ fontWeight: 'bold' }}>Publication : </span>{pmediaro?.pmediaid.name || ''}
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
    <Input
        value={description}
        onChange={e => {
            setDescription(e.target.value);
            if (e.target.value.trim()) setDescriptionError('');
        }}
    />
    {descriptionError && <div style={{ color: 'red', fontSize: 12 }}>{descriptionError}</div>}
</div>

<div style={{ marginBottom: 16 }}>
    <label>Amount</label><br />
    <Input
        type="number"
        value={amount}
        style={{ width: '50%' }}
        onChange={e => {
            setAmount(e.target.value);
            if (parseFloat(e.target.value) > 0) setAmountError('');
        }}
    />
    {amountError && <div style={{ color: 'red', fontSize: 12 }}>{amountError}</div>}
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
                    <Button danger style={{ width: 120 }} onClick={() => navigate('/p-media/pmediaROList')}>CLOSE</Button>
                </div>
            </Modal>
        </main>
    );
}

export default PMediaInvoicePayment;