import { Drawer, Button , Select  , Avatar ,  Checkbox, Table} from 'antd';
import React, { Component } from 'react'
import axios from 'axios';
import Form from 'antd/lib/form/Form';
import { withTranslation } from 'react-i18next';

const {check} = Checkbox





const { Option } = Select;

class Orders extends React.Component {
  constructor(props) {
    super(props);
  this.state = {
       visible: false,
       childrenDrawer1: false,
       childrenDrawer2: false,
       childrenDrawer3: false,
       childrenDrawer4: false,
       order : [] ,
       myorder: [],
       data : [] ,
       myRestaurants : [], 
       dataOrder : [], 
       key : [] ,
       selectedRowKeys: []
       

    };
    
  }
  

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  showChildrenDrawer1 = () => {
    this.setState({
      childrenDrawer1: true,
    });
  };
  showChildrenDrawer2 = () => {
    this.setState({
      childrenDrawer2: true,
    });
  };
  showChildrenDrawer3 = () => {
    this.setState({
      childrenDrawer3: true,
    });
  };
  showChildrenDrawer4 = () => {
    this.setState({
      childrenDrawer4: true,
    });
  };
  

  onChildrenDrawerClose1 = () => {
    this.setState({
      childrenDrawer1: false,
    });
  };
  onChildrenDrawerClose2 = () => {
    this.setState({
      childrenDrawer2: false,
    });
  };
  onChildrenDrawerClose3 = () => {
    this.setState({
      childrenDrawer3: false,
    });
  };
  onChildrenDrawerClose4 = () => {
    this.setState({
      childrenDrawer4: false,
    });
  };

  

  componentDidMount() {
        
    
    axios.get('http://localhost:8000/api/my-restaurants/' , 
    {
      headers: {
        'Authorization': `token ${localStorage.getItem('token')}`
    }
    })
    .then(res => {
      
        this.setState({
            myRestaurants: res.data
        })
    })
    .catch(err => {

        console.log("getting ERROR!! ", err);
    })
   
   }

 

  ok = () => {
    
    const data = this.state.myRestaurants.map(data => ({
      id: data.id,
      name: `${data.name}`
    }));
    
    this.setState({ data : data   });
  }


onChangeSel(value) {
  console.log(`selected ${value}`);
  
  localStorage.setItem('myRestaurantId', value);
  
  
}
   NewOrders = () => {
      
    axios.post('http://localhost:8000/api/orders-for-restaurant/', {
      Content:  {  restaurant: localStorage.getItem('myRestaurantId') , status: "new" } }, 
      {
        headers: {
          Authorization: `token ${localStorage.getItem('token')}`
      
        }
      
        
    }).then(foo => {
        console.log(foo);
        this.setState({
            order : foo.data.orders
            
        })

    })
        .catch(err => {
            console.log(err)
        })

}

    InProcessOrders = () => {

        axios.post('http://localhost:8000/api/orders-for-restaurant/', {
          Content:  { restaurant: localStorage.getItem('myRestaurantId') , status: "in_process" 
        } }, 
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`
        
          }
        
            
        }).then(foo => {
          console.log(foo);
            this.setState({
              order : foo.data.orders
            })

        })
            .catch(err => {
                console.log(err)
            })

    }

    InDeliveryOrders = () => {
        
        axios.post('http://localhost:8000/api/orders-for-restaurant/', {
          Content:  { restaurant: parseInt(localStorage.getItem('myRestaurantId')) , status: "in_delivery" 
        } }, 
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`
        
          }
        
           
        }).then(foo => {
          console.log(foo);
            this.setState({
              order : foo.data.orders
            })

        })
            .catch(err => {
                console.log(err)
            })

    }   

    ok2 = () => {

      const key = this.state.order.map(data => (
        { id: data.id }

      ));

      let order = this.state.order;

      for (let index = 0; index < this.state.order.length; index++) {
        let element = this.state.order[index];
        axios.get(`http://localhost:8000/api/profile/${element.customer}`,
          {
            headers: {
              Authorization: `token ${localStorage.getItem('token')}`
            }
          }).then(res => {
            //element.id = `${element.id}`;
            element.customerName = `${res.data.first_name}`;
            element.phone = `${res.data.phone_no}`;
            element.key = `${element.id}`;
            element.date = `${element.order_time}`.substring(0, 10);
            element.time = `${element.order_time}`.substring(11, 19);
            !element.in_process && !element.in_delivery ?
              element.situation = `New` :
              element.in_process && !element.in_delivery ?
                element.situation = `In Process` :
                element.situation = "In Delivery"
          })
      }


      for (let index = 0; index < this.state.order.length; index++) {
        let element = this.state.order[index];
        console.log("my testss",element);
        axios.get(`http://localhost:8000/api/restaurant/${element.restaurant}`,
          {
            headers: {
              Authorization: `token ${localStorage.getItem('token')}`
            }
          }).then(res => {
            element.restaurantName = `${res.data.name}`;
          })
      }
      this.setState({
        order, key
      })
  
      
          
    }
    onChange(e) {
      console.log(`checked = ${e.target.checked}`);
      
    }
   
    onSelectedRowKeysChange = (selectedRowKeys) => {
      //console.log(`checked = ${selectedRowKeys.target.checked}`);
      
      console.log(selectedRowKeys);
     
      console.log("selected row key",this.state.selectedRowKeys);
      axios.get(`http://localhost:8000/api/order/${selectedRowKeys[0]}/`).then( res => {
        console.log(res);
        !res.data.in_process && !res.data.in_delivery ? 
      axios.put(`http://localhost:8000/api/order/${res.data.id}/`, {
        restaurant: res.data.restaurant,
        food_ids: res.data.food_ids,
        food_quantities: res.data.food_quantities,
        notes: res.data.notes,
        deliver_location: res.data.deliver_location,
        in_process : true,
        in_delivery: false
      },
      {
        headers: {
          'Authorization': `token ${localStorage.getItem('token')}`
        }
      })  
     : 
    axios.put(`http://localhost:8000/api/order/${res.data.id}/`, {
        restaurant: res.data.restaurant,
        food_ids: res.data.food_ids,
        food_quantities: res.data.food_quantities,
        notes: res.data.notes,
        deliver_location: res.data.deliver_location,
        in_process : true,
        in_delivery: true
      },
      {
        headers: {
          'Authorization': `token ${localStorage.getItem('token')}`
        }
      }) 
     } )
     const dataSource = [...this.state.order];
    this.setState({
      order: dataSource.filter((item) => item.key !== selectedRowKeys[0]),
    });

   selectedRowKeys = []

     
     
    }
    onChangeT(pagination, filters, sorter, extra) {
      console.log('params',sorter);
    }

    myOrders= () => {
      axios.post('http://localhost:8000/api/orders-for-customer/', {
       'Content' :  {customer : localStorage.getItem('id') }
      },{
        headers: {
          'Authorization': `token ${localStorage.getItem('token')}`
        }}).then(res=>{
          console.log(res);
          this.setState({
            myorder : res.data.orders
          })
        })
      
      }
  render() {
    const { t } = this.props;
    const { selectedRowKeys } = this.state;
    const rowSelection = { selectedRowKeys,  onChange: this.onSelectedRowKeysChange,
      
    };

    const columns = [
      {
        title : t('Order.9'),
        dataIndex : "id",
        key : "id",
      },
      {
        title : t('Order.10'),
        dataIndex : "customerName",
        key : "customerName",
      },
      {
        title : t('Order.11'),
        dataIndex : "phone",
        key : "phone",
      },
      {
        title : t('Order.12'),
        dataIndex : "deliver_location",
        key : "deliver_location",
      },
      {
        title : t('Order.13'),
        dataIndex : "time",
        key : "time",
      },
      {
        title : t('Order.14'),
        dataIndex : "date",
        key : "date",
        //sorter: (a,b) => new Date(b.date) - new Date(a.date)
      },
      
      
      
    
    ]
    const columnsMyOrders = [
      
      {
        title : t('Order.15'),
        dataIndex : "restaurantName",
        key : "restaurantName",
      },
      
      {
        title : t('Order.12'),
        dataIndex : "deliver_location",
        key : "deliver_location",
      },
      {
        title : t('Order.13'),
        dataIndex : "time",
        key : "time",
      },
      {
        title : t('Order.14'),
        dataIndex : "date",
        key : "date",
        sorter: (a,b) => new Date(b.date) - new Date(a.date)
      },
      {
        title : t('Order.16'),
        dataIndex : "situation",
        key : "situation"
      }
      
      
      
    
    ]
    const {  data } = this.state;
    const { dataOrder} = this.state;
  
    
    return (
      <div className = "buy2">
        <Button  style={{border:"1px solid #546E7A "}} className ="btnn"  className ="btnn" type="primary" onClick={this.showDrawer}>
          {t('Order.4')}
        </Button>
        <Drawer
          title={t('Order.17')}
          width={300}
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          onChange={this.ok}
        >
          <Form>
            <Select
              showSearch
              style={{ width: 200, border:"1px solid #00FF00" }}
              placeholder={t('Order.5')}
              optionFilterProp="children"
              onChange={this.onChangeSel}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              onSearch={this.onSearch}
            //filterOption={(input, option) =>
            //    option.children.indexOf(input) >= 0}
            >

              {

                data.map(item => (

                  <Option key={item.id} value={item.id} >
                    <div>
                      <Avatar style={{ background: "#A52A2A",color:"#fff" }}>{item.id}</Avatar>{" "}
                      {item.name}
                    </div>
                  </Option>
                ))}
            </Select>
            <br></br>
            <br></br>

            <Button  style={{backgroundColor:"#FFAB91 ",border:"1px solid #FFAB91  "}} className="newo"  type="primary"  onClick={this.showChildrenDrawer1} onMouseEnter={this.NewOrders}>
              {t('Order.1')}
          </Button>
            <Drawer
              title={t('Order.6')}
              width={650}
              closable={false}
              onClose={this.onChildrenDrawerClose1}
              visible={this.state.childrenDrawer1}
              onChange={this.ok2}
            >
              
              <Table
                columns={columns}
                rowSelection={rowSelection}
                dataSource={this.state.order} 
                size='small'
            />
              {console.log(this.state)}

            </Drawer>
            <br></br>
            <br></br>
            <Button style={{backgroundColor:"#FF7050",border:"1px solid #ff7050"}} className="ori" type="primary" onClick={this.showChildrenDrawer2} onMouseEnter={this.InProcessOrders}>
            {t('Order.2')}
          </Button>
            <Drawer
              title={t('Order.7')}
              width={650}
              closable={false}
              onClose={this.onChildrenDrawerClose2}
              visible={this.state.childrenDrawer2}
              onChange={this.ok2}
            >
              <Table
                columns={columns}
                rowSelection={rowSelection}
                dataSource={this.state.order} 
                size='small'
               
            />

            </Drawer>
            <br></br>
            <br></br>
            <Button  style={{backgroundColor:"#F4511E ",border:"1px solid #F4511E"}} className="orin" type="primary" onClick={this.showChildrenDrawer3} onMouseEnter={this.InDeliveryOrders}>
            {t('Order.3')}
          </Button>
            <Drawer
              title={t('Order.7')}
              width={650}
              closable={false}
              onClose={this.onChildrenDrawerClose3}
              visible={this.state.childrenDrawer3}
              onChange={this.ok2}
            >
              <Table
                columns={columns}
                dataSource={this.state.order} 
                size='small'
            />

            </Drawer>
          </Form>
          <hr></hr>
          <Button  style={{backgroundColor:"#F4511E ",border:"1px solid #F4511E"}} className="orin" type="primary" onClick={this.showChildrenDrawer4} onMouseEnter={this.myOrders}>
          {t('Order.4')}
          </Button>
            <Drawer
              title={t('Order.4')}
              width={650}
              closable={false}
              onClose={this.onChildrenDrawerClose4}
              visible={this.state.childrenDrawer4}
              onChange={this.ok2}
            >

              <Table
                columns={columnsMyOrders}
                dataSource={this.state.myorder} 
                onChange={this.onChangeT}
                size='small'
            />

            </Drawer>
        </Drawer>
        
      </div>
    );
  }
}

export default withTranslation()(Orders)