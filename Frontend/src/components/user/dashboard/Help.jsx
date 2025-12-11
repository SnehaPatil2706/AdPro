import React from 'react';
import { Card, Typography, Button, Row, Col, Divider } from 'antd';
import { MailOutlined, PhoneOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';

const { Title, Text, Paragraph } = Typography;

const Help = () => (
  <>
    <Header />
    <Sidebar />
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>Need Help?</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">Support</li>
            <li className="breadcrumb-item active">Help</li>
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
            maxWidth: 500,
            borderRadius: 24,
            boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
            background: 'rgba(255,255,255,0.97)',
          }}
          bodyStyle={{ padding: 32 }}
        >
          <Row justify="center" style={{ marginBottom: 16 }}>
            <QuestionCircleOutlined style={{ fontSize: 48, color: '#764ba2' }} />
          </Row>
          <Title level={3} style={{ textAlign: 'center', color: '#764ba2' }}>How can we help you?</Title>
          <Paragraph style={{ textAlign: 'center', marginBottom: 24 }}>
            If you have any questions, issues, or need support, please reach out to us using the contact details below. Our team is here to assist you!
          </Paragraph>
          <Divider />
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <Text strong>
                <MailOutlined style={{ color: '#764ba2', marginRight: 8 }} />
                support@adpro.com
              </Text>
            </Col>
            <Col span={24}>
              <Text strong>
                <PhoneOutlined style={{ color: '#764ba2', marginRight: 8 }} />
                +91 98765 43210
              </Text>
            </Col>
          </Row>
          <Divider />
          <Row justify="center">
            <Col>
              <Button
                type="primary"
                href="mailto:support@adpro.com"
                icon={<MailOutlined />}
                style={{ borderRadius: 8 }}
              >
                Email Support
              </Button>
            </Col>
          </Row>
        </Card>
      </section>
    </main>
    <Footer />
  </>
);

export default Help;