import React from 'react';
import { Modal, Button, Input, Rate } from 'antd';
import axios from 'axios';
import { withTranslation } from 'react-i18next';

const desc = ['Terrible', 'Bad', 'Normal', 'Good', 'Wonderful'];


class RateFood extends React.Component {

  state = {
    value: 3,
    review: null,
    visible: false
  };

  handleReviewChange = (e) => {
    this.setState({
      review: e.target.value
    })
  }

  handleChange = value => {
    this.setState({ value });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
    e.preventDefault();
    axios.post(`http://localhost:8000/api/food_rating/`,{
      food: this.props.id,
      review:this.state.review || '',
      stars:this.state.value
    
  }, {
      headers: {
          'Authorization': `token ${localStorage.getItem('token')}`
      }
    }).then(res=> {
      console.log(res)
    })
    .catch(err=> {
      console.log(err)
    })
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };


  render() {
    const {t} = this.props;
    const { value } = this.state;
    return (
      <div >
        <Button style={{color:'#FFC500 '}} type="link" onClick={this.showModal}>
          {t('res.9')}
        </Button>
        <Modal
          title="The Rating"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
            
        <Rate tooltips={desc} onChange={this.handleChange} value={value} />
        
        {value ? <span style={{fontWeight:'bold'}} className="ant-rate-text">{desc[value - 1]}</span> : ''}
        <br></br>
        <br></br>
       <p style={{fontFamily:'Impact,  sans-serif'}}>Add Review :</p> 
       
        <Input value={this.state.review} onChange={this.handleReviewChange} />
        </Modal>
      </div>
    );
  }
}

export default withTranslation()(RateFood );