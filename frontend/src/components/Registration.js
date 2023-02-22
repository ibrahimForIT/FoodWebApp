import React from 'react';
import {
  Form,
  Input,
  Checkbox,
  Button,
} from 'antd';
import { Link , NavLink} from "react-router-dom";
import * as auths from '../store/actions/auth';
import { connect } from 'react-redux';
import { compose } from 'redux';


import { withTranslation } from 'react-i18next';


const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
class RegistrationForm extends React.Component {

  state = {
    value: ''
  }

  handlePhoneChange = (e) => {
    this.setState({
      value: e.target.value
    })
    console.log(this.state.value)
  }

  onFinish = values => {
    console.log('Received values of form: ', values);
    this.props.onAuth(values.email, values.password, values.password2, values.firstName, values.lastName, values.phone)
    //history.push("/");
  };




  render() {
    const { t } = this.props;
    return (
      <Form
        style={{
          margin: "auto",
          fontWeight: 'bold',
          width: "80%",
          padding: "10px",

        }}
        {...formItemLayout}
        
        name="register"
        onFinish={this.onFinish}
        scrollToFirstError
      >
        <Form.Item

          name="email"
          label={t('Registration.1')}
          rules={[
            {
              type: 'email',
              message: t('Registration.4'),
            },
            {
              required: true,
              message: t('Registration.5'),
            },
          ]}
        >
          <Input style={{ borderRadius: "20px", border: "1px solid #FF9800" }} />
        </Form.Item>

        <Form.Item
          name="password"
          label={t('Registration.2')}

          rules={[
            {
              required: true,
              type: "regexp",
              pattern: new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d){8,}$"),
              message: t('Registration.6'),
            },
          ]}
          hasFeedback
        >
          <Input.Password style={{ borderRadius: "20px", border: "1px solid #FF9800" }} />
        </Form.Item>

        <Form.Item
          name="password2"
          label={t('Registration.3')}
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: t('Registration.7'),
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(t('Registration.21'));
              },
            }),
          ]}
        >
          <Input.Password style={{ borderRadius: "20px", border: "1px solid #FF9800" }} />
        </Form.Item>

        <Form.Item
          name="firstName"
          label={
            <span>
              {t('Registration.20')}&nbsp;
          </span>
          }
          rules={[{ required: true, message: t('Registration.8'), whitespace: true }]}
        >
          <Input style={{ borderRadius: "20px", border: "1px solid #FF9800" }} />
        </Form.Item>

        <Form.Item
          name="lastName"
          label={t('Registration.9')}
          rules={[
            { required: true, message: t('Registration.10') },
          ]}
        >
          <Input style={{ width: "100%", borderRadius: "20px", border: "1px solid #FF9800" }} />
        </Form.Item>

        <Form.Item
          name="phone"
          label={t('Registration.11')}
          rules={[{ required: true, message: t('Registration.12') }]}
        >
          <Input onChange={this.handlePhoneChange} style={{ width: '100%', borderRadius: "20px", border: "1px solid #FF9800" }} />

        </Form.Item>
        <NavLink  to={'/validate/'+ this.state.value}><Button
          style={{
            color: "#fff",
            backgroundColor: "#FF9800",
            border: "none",
            left: '59%',
            bottom: "63px",
            borderTopRightRadius: '20px',
            borderBottomRightRadius: "20px",
            textAlign: 'center'
          }}> validate </Button></NavLink>

        <Form.Item
          style={{ backgroundColor: '#FFE0B2 ', borderRadius: '20px', border: "1px solid #FF9800" }}
          name="agreement"
          valuePropName="checked"
          rules={[
            { validator: (_, value) => value ? Promise.resolve() : Promise.reject(t('Registration.13')) },
          ]}
          {...tailFormItemLayout}
        >
          <Checkbox style={{ marginLeft: "10%" }}>
            {t('Registration.14')} <Link to="" style={{ color: '#FF9800' }}>{t('Registration.15')}</Link>
          </Checkbox>
        </Form.Item>


        <Form.Item className="reg" {...tailFormItemLayout}  >
          <Button className="reg" style={{ left: "23%", borderRadius: '5px', textAlign: 'center' }} type="primary" htmlType="submit" >
            {t('Registration.16')}

          </Button>
        </Form.Item>
      </Form>
    )
  }
      }

    const mapStateToprops = (state) => {
      return {
        loading: state.loading,
        error: state.error
      }
    }

    const mapDispatchToProps = dispatch => {
      return {
        onAuth: (email , password , password2 , firstName , lastName , phone) =>
          dispatch(auths.authSignup(email , password , password2 , firstName , lastName , phone))
     
  }
}

export default compose(withTranslation(), connect(mapStateToprops, mapDispatchToProps))(RegistrationForm);

//export default RegistrationForm;