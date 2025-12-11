import React, { useState } from 'react';
import { Card, Form, Input, Button, Divider, message, Row, Col } from 'antd';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import { Link } from 'react-router-dom';

const Settings = () => {
  const [loading, setLoading] = useState(false);

  // Simulate profile update
  const onProfileFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('Profile updated successfully!');
    }, 1200);
  };

  // Simulate password change
  const onPasswordFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('Password changed successfully!');
    }, 1200);
  };

  return (
    <>
      <Header />
      <Sidebar />
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Account Settings</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">Profile</li>
              <li className="breadcrumb-item active">Settings</li>
            </ol>
          </nav>
        </div>
        <section
          className="section"
          style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
            paddingTop: 40,
            gap: 32,
            flexWrap: 'wrap'
          }}
        >
          <Card
            title={
              <span>
                <i className="bi bi-person-circle" style={{ color: '#764ba2', marginRight: 8, fontSize: 22 }} />
                Profile Information
              </span>
            }
            style={{
              maxWidth: 420,
              minWidth: 320,
              borderRadius: 24,
              borderLeft: '6px solid #764ba2',
              boxShadow: '0 8px 32px rgba(118,75,162,0.10)',
              background: 'rgba(255,255,255,0.95)',
              marginBottom: 24,
            }}
            bodyStyle={{ padding: 28 }}
          >
            <Form layout="vertical" onFinish={onProfileFinish} initialValues={{
              name: 'Sneha Patil',
              email: 'sneha.patil@gmail.com',
              contact: '+1 234 567 890',
              address: '123 Main Street, Kolhapur, India',
            }}>
              <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter your name!' }]}>
                <Input size="large" />
              </Form.Item>
              <Form.Item label="Email" name="email" rules={[
                { required: true, message: 'Please enter your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}>
                <Input size="large" />
              </Form.Item>
              <Form.Item label="Contact" name="contact">
                <Input size="large" />
              </Form.Item>
              <Form.Item label="Address" name="address">
                <Input size="large" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block size="large" style={{ borderRadius: 8 }}>
                  Update Profile
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <Card
            title={
              <span>
                <i className="bi bi-shield-lock" style={{ color: '#667eea', marginRight: 8, fontSize: 22 }} />
                Change Password
              </span>
            }
            style={{
              maxWidth: 420,
              minWidth: 320,
              borderRadius: 24,
              borderLeft: '6px solid #667eea',
              boxShadow: '0 8px 32px rgba(102,126,234,0.10)',
              background: 'rgba(255,255,255,0.95)',
              marginBottom: 24,
            }}
            bodyStyle={{ padding: 28 }}
          >
            <Form layout="vertical" onFinish={onPasswordFinish}>
              <Form.Item
                label="Current Password"
                name="currentPassword"
                rules={[{ required: true, message: 'Please enter your current password!' }]}
              >
                <Input.Password size="large" />
              </Form.Item>
              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[{ required: true, message: 'Please enter your new password!' }]}
              >
                <Input.Password size="large" />
              </Form.Item>
              <Form.Item
                label="Confirm New Password"
                name="confirmPassword"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Please confirm your new password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password size="large" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block size="large" style={{ borderRadius: 8 }}>
                  Change Password
                </Button>
              </Form.Item>
              <Divider />
              <Row justify="center">
                <Col>
                  <Link to="/forgotpassword">
                    <Button type="link">Forgot Password? Send OTP</Button>
                  </Link>
                </Col>
              </Row>
            </Form>
          </Card>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Settings;