import React from 'react';
import { Form, Input, Button, Spin } from 'antd';
import { UserOutlined, LoadingOutlined } from '@ant-design/icons';
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

const onFinish = values => {
  console.log('Received values of form: ', values);
  
}

class ResetPassword extends React.Component {

  state= {
    phoneNumber: this.props.match.params.phoneNum
  }

  componentDidMount() {

  }
  handleChange = (event) => {
    this.setState({
      phoneNumber: event.target.value
    })
  }

  
  onClickSend = () => {
    const sendph = this.state.phoneNumber
   
  }
  
  render() {
    

  return (
    
    <Form {...formItemLayout}
    name="otp-validate"
    className="login-form"
    initialValues={{
      remember: false,
    }}
    onFinish={onFinish}
    style={{margin: "auto",
    width: "28%",
    padding: "10px"}}
    >
      
      <Form.Item
        name="phone"
        rules={[
          {
            required: true,
            message: 'Please input your Phone!',
          },
        ]}
        >
        <Input
       
       onChange={this.handleChange}
       defaultValue={this.state.phoneNumber}
        maxLength={10}
        prefix={<UserOutlined className="site-form-item-icon" />} 
        placeholder="Phone" />
      </Form.Item>
        
        <Form.Item>
        <Button onClick={this.onClickSend}>
          send code
        </Button>
        </Form.Item>

      <Form.Item
        name="otp"
        rules={[
          {
            required: true,
            message: 'Please input the code that you recived!',
          },
        ]}
        >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Code" />
      </Form.Item>

      {
        this.props.loading?
        
        <Spin indicator={antIcon} />
        :
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
           Validate 
        </Button>
      </Form.Item>
      }
    </Form>
  
  );
}
}

export default ResetPassword;