import React from 'react';
import { Form, Input, Button, Checkbox, Spin } from 'antd';
import { UserOutlined, LockOutlined, LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 25 },
  },
};

class ResetPass extends React.Component {


  onFinish = values => {
    console.log('Received values of form: ', values);
    axios.post('http://localhost:8000/rest-auth/password/reset/', 
    {
      email: values.Email
    })
  };






  render() {
    const { t } = this.props
    return (

      <Form {...formItemLayout}
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: false,
        }}
        onFinish={this.onFinish}
        style={{
          margin: "auto",
          width: "30%",
          padding: "10px"
        }}
      >

        <Form.Item
          name="Email"
          rules={[
            {
              required: true,
              message: 'Enter Your E-mail'
            },
          ]}
        >
          <Input 
          style={{ borderRadius: "20px", 
          border: "1px solid #FF9800" }} 
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Your E-mail" />
        </Form.Item>


            <Form.Item className="log1" style={{ backgroundColor: '#ffe0b2', borderRadius: '20px', border: "1px solid #FF9800" }}>
              <Button className="log1" htmlType="submit" > Send </Button>

            </Form.Item>
      </Form>

    );
  }
}



export default ResetPass;