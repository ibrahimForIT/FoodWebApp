import React, {  Component } from 'react';
import { Drawer, Button  , Form, Input } from 'antd';
import Uploader from './Uploader';
import { withTranslation } from 'react-i18next';
import axios from 'axios';
import { message } from 'antd';


class Add_Post extends Component {

    constructor(props) {
        super(props);

    this.state = {
        visible : false,
        postTitle : '',
        postContent : '',
        PostImage : null,
        resturant : {}
        

    }
    
    this.handleTitle = this.handleTitle.bind(this);
    this.handleContent = this.handleContent.bind(this);
    this.handleImage = this.handleImage.bind(this);

}
        
    handleTitle = event => {
         this.setState({postTitle : event.target.value})
    };
    handleContent = event => {
        this.setState({postContent : event.target.value})
    };
    handleImage = e => {
        this.setState({
            PostImage: e.target.files[0]
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
     const RestId = this.props.id;
     axios.get(`http://localhost:8000/api/restaurant/${RestId}`)
     //axios.get(`http://localhost:8000/api/restaurant/2`)
     .then (res => {
         this.setState({
             resturant: res.data
         }) })
      }
    
    
      Add = () => {
        console.log(this.state.resturant);
        console.log(this.state);
        let formData= new FormData();
        formData.append('title', this.state.postTitle);
        formData.append('content', this.state.postContent);
        formData.append('author', this.state.resturant.id);
        formData.append('img', this.state.PostImage, this.state.PostImage.name);
        axios.post(`http://localhost:8000/api/posts/`, formData , {
            headers: {
                'content-type': 'multipart/form-data; boundary=<calculated when request is sent>',
                'Authorization': `token ${localStorage.getItem('token')}`,
            }

        }).then(res => {
            message.success('Adding the Post is Successfully');
            console.log(res)

        })
            .catch(err => {
                message.error('Fail to Add the Post');
                console.log(err)
            })

    }


    render() {
        const { t } = this.props;
        return (


            <div className="buy1">
                <Button   className="btnn"  type="primary" onClick={this.showDrawer}>
                {t('AddPost.13')}
            </Button>
                <Drawer
                    width={500}
                    title= {t('AddPost.1')}
                    placement="right"
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.visible}
                >
                    <Form
                        style={{
                            backgroundImage: "url(" + "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRfxan6VjGykYyYBSgfgJuiNTIIZMsSUal7gAPu5k61WTKVQ21l&usqp=CAU.png" + ")",
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
                            label={t('AddPost.4')}
                            rules={[
                                {
                                    required: true,
                                    message: t('AddPost.8'),
                                },
                            ]}
                        >
                            <Input  value={this.state.postTitle} onChange={this.handleTitle} />
                        </Form.Item>

                        <Form.Item name="Content" label={t('AddPost.5')} rules={[{ required: true, message: t('AddPost.9'), },]}>
                            <Input type="textarea"  value={this.state.postContent} onChange={this.handleContent} />
                        </Form.Item>




                        <Form.Item name="img" label={t('AddPost.7')} rules={[{ required: false, message: t('AddPost.11') },]}>
                        <Input type="file"
                            id="image"
                            accept="image/png, image/jpeg"  onChange={this.handleImage} required/>
                        </Form.Item>
                        
                        <button type = "submit" onClick = {this.Add}>{t('AddPost.2')}</button>

                    </Form>



                </Drawer>
            </div>




        );
    }


    

}
export default withTranslation()(Add_Post)