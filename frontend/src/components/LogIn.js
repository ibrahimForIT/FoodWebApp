import React from 'react';
import { Form, Input, Button, Checkbox, Spin } from 'antd';
import { UserOutlined, LockOutlined, LoadingOutlined } from '@ant-design/icons';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux'
import * as auths from '../store/actions/auth'
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';

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

class NormalLoginForm extends React.Component {

  onFinish = values => {
    console.log('Received values of form: ', values);
    this.props.onAuth(values.username, values.password, values.remember);
   /*setTimeout(() => {
      if (localStorage.length > 0) {
        this.props.location.pathname = "/";
        window.location.reload(false)
      }

    }, 500)*/
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
          name="username"
          rules={[
            {
              required: true,
              message: t('Registration.22'),
            },
          ]}
        >
          <Input style={{ borderRadius: "20px", border: "1px solid #FF9800" }} prefix={<UserOutlined className="site-form-item-icon" />} placeholder={t('Registration.26')} />
        </Form.Item>


        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: t('Registration.6'),
            },
          ]}
        >
          <Input
            style={{ borderRadius: '20px', border: "1px solid #FF9800" }}
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder={t('Registration.2')}
          />

        </Form.Item>


        <Form.Item style={{ backgroundColor: '#FFE0B2 ', borderRadius: '20px', border: "1px solid #FF9800" }}>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>{t('Registration.18')}</Checkbox>
          </Form.Item>

          <Link style={{ color: '#FF9800' }} className="login-form-forgot" to="/resetreq">
            {t('Registration.19')}
          </Link>
        </Form.Item>

        {
          this.props.loading ?

            <Spin indicator={antIcon} />
            :


            <Form.Item className="log1" style={{ backgroundColor: '#ffe0b2', borderRadius: '20px', border: "1px solid #FF9800" }}>
              <Button className="log1" htmlType="submit" >   {t('Registration.24')}
              </Button> &nbsp;




       <p> {t('Registration.23')}</p> &nbsp;

       <NavLink style={{ color: '#FF9800' }} className="btn4" to="/register" >{t('Registration.25')} </NavLink>

            </Form.Item>
        }
      </Form>

    );
  }
}

//const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    error: state.error
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (username, password, remember) => dispatch(auths.authLogin(username, password, remember))
  }
}

export default compose(withTranslation(), connect(mapStateToProps, mapDispatchToProps))(NormalLoginForm);