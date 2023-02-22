import React from 'react';
import { Form, Button, Input ,Drawer   } from 'antd';
import axios from 'axios';
import { withTranslation } from 'react-i18next';
import Uploader from './Uploader';
import { message } from 'antd';


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




class AddRest extends React.Component {
  
  state = {
    visible : false ,
    logo: null,
    cover: null,
  }
  handleLogoChange = (e) => {
    this.setState({
      logo: e.target.files[0]
    })
  };

  handleCoverChange = (e) => {
    this.setState({
      cover: e.target.files[0]
    })
  }
  showDrawer = () => {
    this.setState({visible : true});
};
 onClose = () => {
    this.setState({visible : false});
};
  
  render() {
    const { t } = this.props;
    return (

<div className = "buy2">
      <Button style={{border:"1px solid"}} className= "btnn" type="primary" onClick={this.showDrawer}>
      {t('AddRestaurant.1')}
      </Button>
      <Drawer
        width={500}
        title={t('AddRestaurant.1')}
        placement="right"
        closable={false}
        onClose={this.onClose}
        visible={this.state.visible}
      >
        <Form
          {...formItemLayout}
          name= {t('AddRestaurant.1')}
          
        
          onFinish={(values) => {
            console.log("from ONFINISH :", values)
            let form_data = new FormData();
            form_data.append('name', values.name);
            form_data.append('location', values.location);
            form_data.append('from_hour', parseInt(values.from_Hour)+1);
            form_data.append('to_hour', values.to_Hour);
            form_data.append('img', this.state.logo, this.state.logo.name);
            form_data.append('cover', this.state.cover, this.state.cover.name);
            form_data.append('verified', false);
            axios.post('http://localhost:8000/api/restaurant/',form_data, {
              
           
                headers: {
                  'content-type' : 'multipart/form-data; boundary=<calculated when request is sent>',
                  'Authorization': `token ${localStorage.getItem('token')}`
              }
            })
              .then(res => {
                console.log(res);
                message.success(t('AddRestaurant.8'));
                
              })
              .catch(err => {
                console.log(err);
              })
          }}
          scrollToFirstError
        >
          <Form.Item
            label={t('AddRestaurant.2')}
            style={{fontWeight:"bold"}}
            name="name"
            rules={[
              {
                required: true,
                message: t('AddRestaurant.9'),
              }
            ]}
          >
            <Input style={{width:"150%",border:"2px solid #ff9800",borderRadius:"15px"}}  />
          </Form.Item>
          <Form.Item
           style={{fontWeight:"bold"}}
            label={t('AddRestaurant.3')}
            name="location"
            rules={[
              {
                required: true,
                message: t('AddRestaurant.10'),
              },
            ]}
          >
            <Input style={{width:"150%",border:"2px solid #ff9800",borderRadius:"15px"}} />
          </Form.Item>
          <Form.Item
           style={{fontWeight:'bold'}}
            label={t('AddRestaurant.4')}
            name="from_Hour"
            rules={[{ required: true, message: t('AddRestaurant.11'), whitespace: true }]}
          >
            <Input  style={{width:"150%",border:"2px solid #ff9800",borderRadius:"15px"}} />
          </Form.Item>
          <Form.Item
           style={{fontWeight:"bold"}}
            label={t('AddRestaurant.5')}
            name="to_Hour"
            rules={[{ required: true, message: t('AddRestaurant.12'), whitespace: true }]}
            >
            <Input   style={{width:"150%",border:"2px solid #ff9800",borderRadius:"15px"}} />
            </Form.Item>
            <Form.Item
            style={{fontWeight:"bold"}}
              name="logo"
              label="logo"
            >
              <Input type="file"
              style={{width:"150%",border:"2px solid #ff9800",borderRadius:"15px"}}
                     id="image"
                     accept="image/png, image/jpeg"  onChange={this.handleLogoChange} required/>
            </Form.Item>
            <Form.Item
            style={{fontWeight:"bold"}}
              name="cover"
              label="cover"
            >
                <Input type="file"
                style={{width:"150%",border:"2px solid #ff9800",borderRadius:"15px"}}
                id="image"
                accept="image/png, image/jpeg"  onChange={this.handleCoverChange} required/>
       </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <div className = "buy2">
            <Button  style={{border:"2px solid ",width:"30%"}} className= "btnn" type="primary" htmlType="submit" >
            {t('AddRestaurant.7')}
             </Button>
              </div>
          </Form.Item>


          

        </Form>

          

      </Drawer>
  
</div>
    
      )
  }
}

export default withTranslation()(AddRest);
