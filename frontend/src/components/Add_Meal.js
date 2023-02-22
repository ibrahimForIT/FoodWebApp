import React, {  Component } from 'react';
import { Drawer, Button  , Form, Input } from 'antd';
import Uploader from './Uploader';
import { withTranslation } from 'react-i18next';
import axios from 'axios';
import { message } from 'antd';


class Add_Meal extends Component {

    constructor(props) {
        super(props);

    this.state = {
        visible : false,
        mealName : '',
        mealPrice : null,
        mealDes : '',
        mealImage : null,
        resturant : {}

    }
    
    this.handleName = this.handleName.bind(this);
    this.handlePrice = this.handlePrice.bind(this);
    this.handleDes = this.handleDes.bind(this);
    this.handleImage = this.handleImage.bind(this);

}

    //this.handleSubmit = this.handleSubmit.bind(this);
    
    
    handleName = event => {
         this.setState({mealName : event.target.value})
    };
    handlePrice = event => {
        this.setState({mealPrice : event.target.value})
    };
    handleDes = event => {
        this.setState({mealDes : event.target.value})
    };
    handleImage = e => {
        this.setState({
            mealImage: e.target.files[0]
          })
    };

    
     showDrawer = () => {
        this.setState({visible : true});
    };
     onClose = () => {
        this.setState({visible : false});
    };
    componentDidMount() {
    console.log(this.props);
      }
    
      Add = () => {
        let form_data = new FormData();
        form_data.append('img', this.state.mealImage, this.state.mealImage.name);
        form_data.append('name', this.state.mealName);
        form_data.append('description', this.state.mealDes);
        form_data.append('price', this.state.mealPrice);
        form_data.append('restaurant', this.props.id);
        form_data.append('hide', false);

        axios.post(`http://localhost:8000/api/food/`, form_data, {
        headers: {
            'content-type' : 'multipart/form-data; boundary=<calculated when request is sent></calculated>',
            'Authorization': `token ${localStorage.getItem('token')}`
        }
        }).then(res => {
            message.success('Adding the Meal is Successfully');
            console.log(res)

        })
            .catch(err => {
                message.error('Fail to Add the Meal');
                console.log(err)
            })
    
    }


    render() {
        const { t } = this.props;
        return (


            <div className="buy1">
                <Button className="btnn"  type="primary" onClick={this.showDrawer}>
                {t('AddMeal.12')}
            </Button>
                <Drawer
                    style={{
                        backgroundImage: "url(" + "https://cdn0.iconfinder.com/data/icons/food-app-flat-style/128/Food_App_-_Flat_Style_-_33-42-512.png" + ")",
                        backgroundPosition: "center",
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        width: "100%",
                        backgroundSize: "30%",
                    }}
                    width={500}
                    title= {t('AddMeal.1')}
                    placement="right"
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.visible}
                >
                    <Form
                        id='form'
                        style={{
                            backgroundImage: "url(" + "https://cdn0.iconfinder.com/data/icons/food-app-flat-style/128/Food_App_-_Flat_Style_-_33-42-512.png" + ")",
                            backgroundPosition: "center",
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            width: "100%",
                            backgroundSize: "100%",


                        }}


                        layout="vertical"
                        name="form_in_modal"
                        initialValues={{
                            modifier: 'public',
                        }}
                    >
                        <Form.Item
                            name="title"
                            label={t('AddMeal.4')}
                            rules={[
                                {
                                    required: true,
                                    message: t('AddMeal.5'),
                                },
                            ]}
                        >
                            <Input   value={this.state.mealName} onChange={this.handleName} />
                        </Form.Item>

                        <Form.Item name="Price" label={t('AddMeal.6')} rules={[{ required: true, message: t('AddMeal.7'), },]}>
                            <Input  value={this.state.mealPrice} onChange={this.handlePrice} type="textarea" placeholder="$" />
                        </Form.Item>
                        <Form.Item name="description" label={t('AddMeal.8')} rules={[{ required: true, message: t('AddMeal.9') },]}>
                            <Input  value={this.state.mealDes} onChange={this.handleDes} type="textarea" placeholder="" />
                        </Form.Item>
                        
                        <Form.Item name="img" label={t('AddMeal.10')} rules={[{ required: false, message: t('AddMeal.11') },]}>
                        <Input type="file"
                            id="image"
                            accept="image/png, image/jpeg"  onChange={this.handleImage} required/>
                        </Form.Item>

                        
                        <button type = "submit" onClick = {this.Add}>{t('AddMeal.2')}</button>

                    </Form>

                    

                </Drawer>
            </div>




        );
    }


    

}
export default withTranslation()(Add_Meal)