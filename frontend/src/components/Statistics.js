import React, {  Component } from 'react';
import { Drawer, Button  , Form,Select , Avatar } from 'antd';
import { withTranslation } from 'react-i18next';
import axios from 'axios';
import { message } from 'antd';
import { DatePicker, Space } from 'antd';


const { Option } = Select;

class Statistics extends Component {

    constructor(props) {
        super(props);

    this.state = {
        visible : false, 
        myRestaurants : [],
        RestaurantName : [],
        data :[]
        

    }

}
    componentDidMount() {

        console.log(this.props);


        axios.get('http://localhost:8000/api/my-restaurants/'
        ,
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
    ok = () =>{
        console.log(this.state);
        const data  = this.state.myRestaurants.map(data => ({
          id : data.id , 
          name : `${data.name}`
        }));
        this.setState({ data });
      }


    onChangeSel(value) {
        console.log(`selected ${value}`);
        
        localStorage.setItem('myRestaurantId', value);
        
        
    }

    onBlur() {
        console.log('blur');

        
     
    }

    onFocus() {
        console.log('focus');
    }

    onSearch(val) {
        console.log('search:', val);
        
    }


//handleDate = dateString => {
//   this.setState({date : dateString})
//};

    showDrawer = () => {
    this.setState({ visible: true });
    };
     onClose = () => {
        this.setState({visible : false});
    };


    


    onChange(date, dateString) {
        console.log(dateString);
        localStorage.setItem('date', dateString);

    }

  



      
      
    
    
    Add = () => {

        console.log(this.props);
        console.log(this.state);
        console.log(parseInt(localStorage.getItem('myRestaurantId')));
        console.log(parseInt(localStorage.getItem('date').substring(0, 4)));
        console.log(parseInt(localStorage.getItem('date').substring(5, 7)));

        // const headers = {
        //    'Content-Type': 'application/json'
        // }
        axios.post('http://localhost:8000/api/my-statistics/', {
            //Mediatype: headers , 
            Content: {
                restaurant: parseInt(localStorage.getItem('myRestaurantId')),
                month: parseInt(localStorage.getItem('date').substring(5, 7)),
                year: parseInt(localStorage.getItem('date').substring(0, 4))
            }
        }, {
            headers: {
                'Authorization': `token ${localStorage.getItem('token')}`
            }
        }).then(() => {
            message.success('Send Data  Successfully !');
            axios({
                url: `http://localhost:8000/api/xls/${localStorage.getItem('myRestaurantId')}/${localStorage.getItem('date').substring(5, 7)}/${localStorage.getItem('date').substring(0, 4)}`,
                method: 'GET',
                responseType: 'blob', // important
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`
                }
              }).then((response) => {
                 const url = window.URL.createObjectURL(new Blob([response.data]));
                 const link = document.createElement('a');
                 link.href = url;
                 link.setAttribute('download', 'report.xls'); //or any other extension
                 document.body.appendChild(link);
                 link.click();
              })
            
                .catch(err => {
                    console.log("Report ERROR!! ", err);
                    message.error('Report ERROR!!');
                })
        })
            .catch(err => {
                message.error('Fiald in Reporting');
                console.log(err)
            })



    }



    render() {
        const {  data } = this.state;
        const { t } = this.props;
        return (


            <div className = "buy2">
                <Button  style={{border:"1px solid #546E7A "}}  className="btnn" type="primary" onClick={this.showDrawer}>
                {t('layout.3')}
            </Button>
                <Drawer
                    title= 'My Statistic'
                    placement="top"
                    closable={false}
                    onChange={this.ok}
                    onClose={this.onClose}
                    visible={this.state.visible}
                >
                    <Form
                        id='form'
                        
                        layout="vertical"
                        name="form_in_modal"
                        initialValues={{
                            modifier: 'public',
                        }}
                    >
                        
                        <Space direction="vertical">
                            <DatePicker bordered = "true" onChange={this.onChange} picker="month" />

                        </Space>
                    
                       
                              
                        <Select
                        showSearch
                        style={{ width: 200 ,border:"1px solid #03A9F4 "}}
                        placeholder="Select a Restaurant"
                        optionFilterProp="children"
                        onChange={this.onChangeSel}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        onSearch={this.onSearch}
                        //filterOption={(input, option) =>
                        //    option.children.indexOf(input) >= 0}
                        >
                            
                            {
                            
                            data.map(item  => (
                                
                                <Option  key={item.id} value={item.id} >
                                    <div>
                                        <Avatar style={{ background: "#F44336 ",color:"#fff" }}>{item.id}</Avatar>{" "}
                                        {item.name}
                                    </div>
                                </Option>
                                  ))} 
                        </Select>
                            

                    <Button className="ss" 
                        style={{borderRadius:"3px",color:"#58D68D ",fontWeight:"bold",border:"2px solid",height:"34px"}} 
                        type = "submit" onClick = {this.Add}>Show</Button>

                    </Form>

                    

                    

                </Drawer>
            </div>




        );
    }


    

}
export default withTranslation()(Statistics)