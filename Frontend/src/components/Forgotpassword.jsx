import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';

function Forgotpassword() {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      message.success('If this email exists, an OTP has been sent!');
    }, 1500);
    // In real app, send values.email to your backend here to send OTP
  };

  return (
    // <div style={{
    //   minHeight: '100vh',
    //   display: 'flex',
    //   alignItems: 'center',
    //   justifyContent: 'center',
    //   background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)'
    // }}>
    //   <Card
    //     title="Forgot Password"
    //     style={{ width: 350, borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}
    //   >
    //     <Form layout="vertical" onFinish={onFinish}>
    //       <Form.Item
    //         label="Email Address"
    //         name="email"
    //         rules={[
    //           { required: true, message: 'Please enter your email!' },
    //           { type: 'email', message: 'Please enter a valid email!' }
    //         ]}
    //       >
    //         <Input placeholder="Enter your email" />
    //       </Form.Item>
    //       <Form.Item>
    //         <Button
    //           type="primary"
    //           htmlType="submit"
    //           loading={loading}
    //           block
    //           style={{ borderRadius: 8 }}
    //         >
    //           Send OTP
    //         </Button>
    //       </Form.Item>
    //     </Form>
    //   </Card>
    // </div>

    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center'
      }}
    >
      {/* <h1>🥳 Congratulations... 🥳</h1>
      <h3>Amhi Pan Visrloy, Tuj Tula Lakshat Thevta Yet Nahi?</h3>
      <h6 style={{ color: "red" }}>Note:- Next Time Visru Nko Atta bg tuj tu ky krnar te</h6> */}
      <h2>Contact to iGAP Technologies for recover Password.</h2>
    </div>
  );
}

export default Forgotpassword;