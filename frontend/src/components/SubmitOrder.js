import React from 'react';
import { List, Modal, Button, Input , Form  , message} from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';


import { withTranslation } from 'react-i18next';
import axios from 'axios';


class SubmitOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      articles: [],
      total: 0,
      foodId: "",
      count: "",
      note: '',
      location : ''
    }

    this.handleNote = this.handleNote.bind(this);
    this.handleLocation = this.handleLocation.bind(this);
  }

  handleNote = event => {
    this.setState({ note: event.target.value })
  };
  handleLocation = event => {
    this.setState({ location : event.target.value })
  };

  showModal = () => {

    console.log("SSSSSSSSSSSSSSSSSSSSSU", this.props.id);
    this.setState({
      articles: this.props.data
    })
    console.log("here totatl: ", this.state.total)
    let tot =0
    let id = ""
    let count1 =""
      for (let i = 0; i < this.props.data.length; i++) {
      const art = this.props.data[i];
      
      if (art.quant>0){
       
        id += `${art.id} `
        tot += art.quant*art.price
        count1 += `${art.quant} `
      }
      console.log(art);
    }
    this.setState({
      total: tot,
      foodId : id,
      count : count1
    })

    this.setState({
      visible: true
    });
  };

  handleOk = () => {
    console.log(this.state);
    axios.post('http://127.0.0.1:8000/api/order/', {
      //'Content': {
        restaurant: this.props.id,
        food_ids: this.state.foodId.substring(0,`${this.state.foodId.length}` -1),
        food_quantities: this.state.count.substring(0,`${this.state.count.length}` -1),
        notes: this.state.note || "no notes",
        deliver_location: this.state.location || " ",
        in_process: false,
        in_delivery: false
      //}
    
  }, {
      headers: {
          'Authorization': `token ${localStorage.getItem('token')}`
      }
    }).then(res => {
      message.success('Your order has been successfully registered');
      console.log(res)

    })
      .catch(err => {
        message.error('Failed to register your order');
        console.log(err)
      })
      this.setState({
        visible: false,
      });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { t } = this.props; 
    console.log("HEREME:",this.props.data)
    return (
      <div className="buy">
        <Button className="btnn" type="primary" onClick={this.showModal}>
          {t('res.5')}
          <ShoppingCartOutlined style={{fontSize:"20px"}} />
        </Button>
        <Modal
          title={t('res.6')}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
           <p>
                Item Name , Item Price , Item Quantities :
                </p>
            <List
              itemLayout="vertical"
              dataSource={this.props.data}
              renderItem={item => (
                
                item.quant >0?
                <div>
                 
                <p>
                {item.name} , {item.price} , {item.quant}
                 
                </p>
                </div>
                :
                <div/>
              )}
              footer= {
                <p>total: {this.state.total}</p>
              }
              />
              <Form>
              <Form.Item name = "notes" label='Your Notes :' rules={[
                                {
                                    required: true,
                                    message: 'Enter your notes plz',
                                },
                            ]}>
              <Input   value={this.state.note} onChange={this.handleNote} /> 
              </Form.Item>
              <Form.Item name ="location" label='Deliver Location :' rules={[
                                {
                                    required: true,
                                    message: 'Enter your Location plz',
                                },
                            ]}>
              <Input   value={this.state.Location} onChange={this.handleLocation} /> 
              </Form.Item>
              </Form>
        </Modal>
      </div>
    );
  }
}

export default withTranslation()(SubmitOrder);
