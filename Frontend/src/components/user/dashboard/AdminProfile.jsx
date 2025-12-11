import React from 'react';
import { Card, Avatar, Typography, Row, Col, Divider, Button } from 'antd';
import { MailOutlined, PhoneOutlined, HomeOutlined, EditOutlined, SettingOutlined } from '@ant-design/icons';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';

const { Title, Text } = Typography;

const AdminProfile = () => {
  const adminInfo = {
    name: 'Sneha Patil',
    image: 'https://i.pravatar.cc/150?img=3', // Replace with actual image URL
    email: 'sneha.patil@gmail.com',
    contact: '+1 234 567 890',
    address: '123 Main Street, Kolhapur, India',
    role: 'System Administrator',
  };

  return (
    <>
      <Header />
      <Sidebar />
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Admin Profile</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">Profile</li>
              <li className="breadcrumb-item active">Admin</li>
            </ol>
          </nav>
        </div>
        <section
          className="section"
          style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
          }}
        >
          <Card
            style={{
              maxWidth: 420,
              borderRadius: 24,
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              padding: 0,
            }}
            bodyStyle={{ padding: 0 }}
          >
            <div
              style={{
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                padding: '36px 0 24px 0',
                textAlign: 'center',
              }}
            >
              <Avatar size={100} src={adminInfo.image} style={{ border: '4px solid #fff' }} />
              <Title level={3} style={{ color: '#fff', margin: '16px 0 0 0' }}>
                {adminInfo.name}
              </Title>
              <Text style={{ color: '#e0e0e0', fontSize: 16 }}>{adminInfo.role}</Text>
            </div>
            <Divider style={{ margin: 0 }} />
            <div style={{ padding: 28 }}>
              <Row gutter={[0, 18]}>
                <Col span={24}>
                  <Text strong>
                    <MailOutlined style={{ color: '#764ba2', marginRight: 8 }} />
                    {adminInfo.email}
                  </Text>
                </Col>
                <Col span={24}>
                  <Text strong>
                    <PhoneOutlined style={{ color: '#764ba2', marginRight: 8 }} />
                    {adminInfo.contact}
                  </Text>
                </Col>
                <Col span={24}>
                  <Text strong>
                    <HomeOutlined style={{ color: '#764ba2', marginRight: 8 }} />
                    {adminInfo.address}
                  </Text>
                </Col>
              </Row>
              <Divider />
              <Row justify="center" gutter={16}>
                <Col>
                  <Button type="primary" icon={<EditOutlined />}>
                    Edit Profile
                  </Button>
                </Col>
                <Col>
                  <Button icon={<SettingOutlined />}>Settings</Button>
                </Col>
              </Row>
            </div>
          </Card>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AdminProfile;