import React from 'react';
import { Col, Row, message, Input, Button, Form } from 'antd';
import { Card } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import axios from 'axios';
import { withTranslation } from 'react-i18next';

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


const { Meta } = Card;

const DescriptionItem = ({ title, content }) => (
  <div
    className="site-description-item-profile-wrapper"
    style={{
      fontFamily: ' cursive',
      fontSize: 14,
      lineHeight: '32px',
      marginBottom: 7,
    }}
  >


    <p
      className="site-description-item-profile-p"
      style={{
        marginRight: 8,
        display: 'inline-block',
      }}
    >
      {title}:
    </p>
    {content}
  </div>
);

class Profile extends React.Component {

  state = {
    viewMode: 0,
    id: 0,
    user: {}
  }

  componentDidMount() {
    console.log(localStorage.getItem('token'));
    axios.post('http://localhost:8000/api/id-by-key/', 
    {
      "Content": {
        "key": localStorage.getItem('token')
      } }, {
        headers: {
            'Authorization': `token ${localStorage.getItem('token')}`
        }
      
    })
      .then(res => {
        localStorage.setItem('id', res.data.id);
        console.log(res.data.id);
        console.log("Profile id ", localStorage.getItem('id'))
      }).catch(err => {
        console.log(err);
      });


    axios.get(`http://localhost:8000/api/profile/${localStorage.getItem('id')}/` , 
   { headers: {
      'Authorization': `token ${localStorage.getItem('token')}`
   }
  })
      .then(res => {
        console.log("RESTSSS", res)
        this.setState({
          user: res.data
        })
      }).catch(err => {
        console.log(err);
      });
  }

  handlechangepassclick = value => {
    console.log(value)
    axios.post('http://localhost:8000/rest-auth/password/change/', {
      old_password: value.old1,
      new_password1: value.new1,
      new_password2: value.new2
    }, {
      headers: {
        'Authorization': `token ${localStorage.getItem('token')}`
      }
    }).then(res => {
      this.setState({ viewMode: 1 })
      message.success("password cahnged!")
    }).catch(err => {
      message.error("error changing password");
    })

  }
  onFinish = vlaue => {
    axios.put(`http://localhost:8000/api/profile/${localStorage.getItem('id')}/`, {
      email: vlaue.email || this.state.user.email,
      phone_no: vlaue.phone_no ,
      first_name: vlaue.first_name || this.state.user.first_name,
      last_name: vlaue.last_name || this.state.user.last_name
    },
    {
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`
      }
    })
    this.setState({
      viewMode: 0
    })
  }

  render() {
    const {t} = this.props;
    return (
      <div style={{ borderRadius: "20px", borderColor: "", borderWidth: "20px" }}>
        <br></br>
        <Avatar size={120} src="11.png" style={{ left: '45.5%' }} />
        <div style={{
          margin: "auto",
          width: "28%",
          border: "2px",
          borderRadius: '25px',

          padding: "15px"
        }}>
          {
            this.state.viewMode === 0 ?
              <div>
                <Card

                  style={{ borderRadius: '40px', backgroundColor: '#FFE4B5', border: '2px solid #FF9800' }}
                  actions={[

                    <EditOutlined key="Edit" />



                  ]}>
                  <Meta style={{ textAlign: "center" }} title={this.state.user.first_name + " " + this.state.user.last_name} />
                  <Row>
                  <br></br>
                  </Row>
                  <Row>
                    <Col span={30}>
                      <DescriptionItem title={t('profile.1')} content={this.state.user.email} />
                    </Col>
                  </Row>

                  <Row>
                    <Col span={30}>
                      <DescriptionItem title={t('profile.2')} content={this.state.user.phone_no} />
                    </Col>
                  </Row>
                  <Row className = "edit">
                    <Col className = "edit">
                      <Button className = "edit" onClick={() => {
                        this.setState({
                          viewMode: 1
                        })
                      }} >
                       {t('profile.3')}
            </Button>

                    </Col>
                  </Row>
                </Card>
              </div>
              :
              this.state.viewMode === 1 ?
                <div>
                  <Card
                    style={{ borderRadius: '40px', backgroundColor: '#FFE4B5', border: '2px solid #FF9800' }}

                  >
                    <Form
                      {...formItemLayout}
                      onFinish={this.onFinish}
                      style={{ float: "center", width: "350px", padding: "5px" }}
                      labelCol={{
                        span: 4,
                      }}
                      wrapperCol={{
                        span: 14,
                      }}
                      layout="horizontal"
                      initialValues={{
                        size: 'small',
                      }}
                    >
                      <Form.Item label={t('profile.4')} name="email :">
                        <Input style={{ left: '10px', border: "1px solid #FF9800", borderRadius: "15px" }} placeholder={this.state.user.email} />
                      </Form.Item>

                      <Form.Item label={t('profile.5')} name="first_name : ">
                        <Input style={{ left: '10px', border: "1px solid #FF9800", borderRadius: "15px" }} placeholder={this.state.user.first_name} />
                      </Form.Item>

                      <Form.Item label={t('profile.6')} name="last_name : ">
                        <Input style={{ left: '10px', border: "1px solid #FF9800", borderRadius: "15px" }} placeholder={this.state.user.last_name} />
                      </Form.Item>
                      <Form.Item>
                        <Form.Item className="save"
                          style={{ display: 'inline-block', width: 'calc(60% - 8px)' }}
                        >
                          <Button className="save" type="primary" htmlType="submit"  >
                          {t('profile.7')}
            </Button>
                        </Form.Item>
                        <Form.Item className="cha" type="secondery"
                          style={{ display: 'inline-block', width: 'calc(20% - 8px)' }}
                        >
                          <Button className="cha" onClick={() => {
                            this.setState({
                              viewMode: 2
                            })
                          }}>
                            {t('profile.8')}
            </Button>
                        </Form.Item>
                      
            
                      </Form.Item>

                    </Form>
                  </Card>
                </div>
                :
                <div>
                  <Card
                    style={{ borderRadius: '40px', backgroundColor: '#FFE4B5', border: '2px solid #FF9800' }}

                  >
                    <Form
                      {...formItemLayout}
                      onFinish={this.handlechangepassclick}
                      style={{ float: "center", width: "350px", padding: "5px" }}
                      labelCol={{
                        span: 4,
                      }}
                      wrapperCol={{
                        span: 14,
                      }}
                      layout="horizontal"
                      initialValues={{
                        size: 'small',
                      }}
                    >
                      <Form.Item name="old1" label={t('profile.9')}>
                        <Input type="password" placeholder={t('profile.9')} />
                      </Form.Item>

                      <Form.Item name="new1" label={t('profile.10')}>
                        <Input type="password" placeholder={t('profile.10')} />
                      </Form.Item>

                      <Form.Item name="new2" label={t('profile.13')}>
                        <Input type="password" placeholder={t('profile.13')} />
                      </Form.Item>

                      <Form.Item>
                        <Form.Item className="save"
                          style={{ display: "inline-block", width: 'calc(60% - 8px)' }}>
                          <Button className="save" type="primary" htmlType="submit">
                          {t('profile.11')}
          </Button>
                        </Form.Item>
                        <Form.Item className="back"
                          style={{ display: "inline-block", width: 'calc(20% - 8px)' }}>
                          <Button className="back" type="secondery" onClick={() => {
                            this.setState({ viewMode: 1 })
                          }}>
                            {t('profile.12')}
            </Button>
                        </Form.Item>
                      </Form.Item>


                    </Form>
                  </Card>
                </div>

          }

        </div>
      </div>
    );
  }
}

export default withTranslation()(Profile);