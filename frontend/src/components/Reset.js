import React from 'react';
import { Form, Input, Button, Checkbox, Spin, message } from 'antd';
import { UserOutlined, LockOutlined, LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

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

class Reset extends React.Component {


  onFinish = values => {
    console.log('Received values of form: ', values, this.props);
    axios.post(`http://localhost:8000/rest-auth/password/reset/confirm/`,{
      new_password1: values.new_password1,
      new_password2: values.new_password2,
      uid: this.props.uid.match.params.uid,
      token: this.props.uid.match.params.token
    }).then(res => {
      console.log(res);
      message.success('changed successfullu!')
    })
    //<Redirect to="/" />
  }






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
          name="new_password1"
          dependencies={['password']}
          rules={[
            {
              required: true,
              message: 'Enter Pass'
            },
          ]}
        >
          <Input 
           style={{ borderRadius: '20px', border: "1px solid #FF9800" }}
           prefix={<LockOutlined className="site-form-item-icon" />}
           type="password"
          placeholder="Enter Password" />
        </Form.Item>

        <Form.Item
          name="new_password2"
          rules={[
            {
              required: true,
              message: 'Re-Enter Password'
            },({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('new_password1') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(t('Registration.21'));
              },
            })
          ]}
        >
          <Input 
           style={{ borderRadius: '20px', border: "1px solid #FF9800" }}
           prefix={<LockOutlined className="site-form-item-icon" />}
           type="password"
          placeholder="Confirm Password" />
        </Form.Item>


            <Form.Item className="log1" style={{ backgroundColor: '#ffe0b2', borderRadius: '20px', border: "1px solid #FF9800" }}>
              <Button className="log1" htmlType="submit" > Send </Button>
            </Form.Item>
      </Form>

    );
  }
}



export default Reset;