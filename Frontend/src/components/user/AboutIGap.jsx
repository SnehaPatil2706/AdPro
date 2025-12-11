import React from 'react';
import { Collapse, Layout, Typography, Row, Col, Card } from 'antd';

const { Header, Footer, Content } = Layout;
const { Panel } = Collapse;
const { Title, Paragraph, Text } = Typography;

const AboutIGap = () => {
  return (
    <Layout>
      {/* Top Header with Logo and Title */}
      <Header style={{ backgroundColor: '#d6671a', padding: '20px 0', textAlign: 'center' }}>
        <img
          src="https://i.imgur.com/gW7Wygh.png"
          alt="Logo"
          style={{ width: 100, marginBottom: 10 }}
        />
        <Title level={2} style={{ color: '#fff', margin: 0 }}>
          iGAP Technologies
        </Title>
        <Text style={{ color: '#fff' }}>One stop solution for everything...</Text>
      </Header>

      {/* About Section */}
      <Content style={{ padding: '24px', background: '#f5f5f5' }}>
        <Row gutter={24}>
          <Col span={12}>
            <Card title="About iGAP Technologies" bordered={false}>
              <Paragraph>
                iGAP Technologies is a leader in high-end technologies in information technology & software development.
              </Paragraph>
              <Paragraph>
                The company is dedicated to developing any kind of application according to customer requirements in
                different technologies like Windows, Web, and Mobile.
              </Paragraph>
              <Paragraph>
                iGAP Technologies focuses on customer satisfaction by understanding requirements and delivering
                applications that exceed expectations.
              </Paragraph>
            </Card>
          </Col>

          {/* Accordion Section */}
          <Col span={12}>
            <Collapse defaultActiveKey={['1']}>
              <Panel header="Talent & Creativity" key="1">
                <Paragraph>We have a team of talented and creative individuals.</Paragraph>
                <Paragraph>We focus on creative design for Windows, Web, and Mobile applications.</Paragraph>
                <Paragraph>
                  We present our planned designs to customers, and upon approval, begin development.
                </Paragraph>
              </Panel>
              <Panel header="Quality & Support" key="2">
                <Paragraph>Customer satisfaction is the most important part of our business.</Paragraph>
                <Paragraph>
                  To satisfy customers, we ensure high-quality projects and ongoing support.
                </Paragraph>
                <Paragraph>We provide the best possible support and service within our reach.</Paragraph>
              </Panel>
            </Collapse>
          </Col>
        </Row>

        <div style={{ backgroundColor: '#d6671a', color: '#fff', textAlign: 'center', fontSize: 16 }}>
          Our principles are creativity, design, experience, customer satisfaction and knowledge.
          <br />
         
        </div>

        {/* Products Section */}
        <div style={{ backgroundColor: '#ffc0cb', marginTop: 40, padding: '30px 0' }}>
          <Title level={4} style={{ textAlign: 'center', marginBottom: 30 }}>
            iGAP TECHNOLOGIES PRODUCTS
          </Title>
          <div style={{ backgroundColor: '#a52a2a', margin: '0 20px', padding: 20, borderRadius: 10 }}>
            <Row gutter={[32, 32]} justify="center">
              <Col xs={24} sm={12} md={8} style={{ textAlign: 'center', color: '#fff' }}>
                <div>TEXTILE CALCI - ANDROID APP</div>
                <img
                  src="https://i.imgur.com/Ma7DANu.png"
                  alt="Textile Calci"
                  style={{ width: 100, borderRadius: '50%', margin: '10px 0' }}
                />
                <div>HOSPITAL IPDPRO - ASP.NET</div>
                <img
                  src="https://i.imgur.com/Ym0kdcB.png"
                  alt="IPDPRO"
                  style={{ width: 100, borderRadius: '50%', margin: '10px 0' }}
                />
              </Col>

              <Col xs={24} sm={12} md={8} style={{ textAlign: 'center', color: '#fff' }}>
                <div>GYMPRO - ASP.NET MVC</div>
                <img
                  src="https://i.imgur.com/Gy3X3mv.png"
                  alt="GYMPRO"
                  style={{ width: 100, borderRadius: '50%', margin: '10px 0' }}
                />
                <div>HOSPITAL OPDPRO - ASP.NET</div>
                <img
                  src="https://i.imgur.com/UVgk1qW.png"
                  alt="OPDPRO"
                  style={{ width: 100, borderRadius: '50%', margin: '10px 0' }}
                />
              </Col>

              <Col xs={24} sm={12} md={8} style={{ textAlign: 'center', color: '#fff' }}>
                <div>INSTIPRO - ASP.NET MVC</div>
                <img
                  src="https://i.imgur.com/klkzk4y.png"
                  alt="INSTIPRO"
                  style={{ width: 100, borderRadius: '50%', margin: '10px 0' }}
                />
              </Col>
            </Row>
          </div>
        </div>
      </Content>

      {/* Footer */}
      <Footer style={{ backgroundColor: '#d6671a', color: '#fff', textAlign: 'center', fontSize: 16 }}>
        <div style={{ marginTop: 10 }}>
          📍 4<sup>th</sup> Lane, Rajarampuri, Kolhapur, Maharashtra 416001 <br />
          📞 9561320192 <br />
          🔗 <a href="http://igaptechnologies.com" style={{ color: '#fff' }}>igaptechnologies.com</a> <br />
          📧 igaptechworld@gmail.com
        </div>
      </Footer>
    </Layout>
  );
};

export default AboutIGap;