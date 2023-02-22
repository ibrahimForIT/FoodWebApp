import React, {  Component } from 'react';
import { Drawer, Button  , Form, Input } from 'antd';
import { withTranslation } from 'react-i18next';
import axios from 'axios';
import { message } from 'antd';


class EditPost extends Component {

    constructor(props) {
        super(props);

    this.state = {
        visible : false,
        postTitle : '',
        postContent : '',
        postImage : null,
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
            postImage: e.target.files[0]
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
         console.log(res);
         this.setState({
             resturant: res.data
         }) })
      }
    
    
    Add = () => {
        console.log(this.state.resturant);
        console.log(this.state);
        console.log(this.props.img);
        console.log(this.state.postImage);
        let form_data = new FormData();
        form_data.append('title',  this.state.postTitle || this.props.title);
        form_data.append('content',this.state.postContent || this.props.content);
        form_data.append('author',this.state.resturant.id || this.props.id);
        if (this.state.postImage!==null) {
            form_data.append('img', this.state.postImage, this.state.postImage.name);
        } else {
            form_data.append('img', this.props.img, this.props.img.name);
        }
        //form_data.append('img',(this.state.postImage===null? this.props.img: this.state.postImage) , (this.state.postImage===null? this.props.img.name: this.state.postImage.name));

        axios.put(`http://localhost:8000/api/posts/${this.props.postid}/`,form_data, {
            
        headers: {
            'Authorization': `token ${localStorage.getItem('token')}`,
            'content-type' : 'multipart/form-data; boundary=<calculated when request is sent>',
        }
            
        }).then(res => {
            message.success('Editing the Post is Successfully');
            console.log(res)

        })
            .catch(err => {
                message.error('Fail to Edit the Post');
                console.log(err)
            })
    
    }


    render() {
        const { t } = this.props;
        return (


            <div className="buy1">
                <Button   style={{ fontWeight: "bold", color: '#4a7777' , backgroundColor :'white' , borderColor : 'white' }} type="primary" onClick={this.showDrawer}>
                Edit
            </Button>
                <Drawer
                    width={500}
                    title= "Edit Post"
                    placement="left"
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
                                    
                                    required: false, 
                                    message: t('AddPost.8'),
                                },
                            ]}
                        >
                            <Input  placeholder={this.props.title}  value={this.state.postTitle} onChange={this.handleTitle} />
                        </Form.Item>

                        <Form.Item name="Content" label={t('AddPost.5')} rules={[{ required: false, message: t('AddPost.9'), },]}>
                            <Input type="textarea" placeholder ={this.props.content} value={this.state.postContent} onChange={this.handleContent} />
                        </Form.Item>

                        <Form.Item name="img" label={t('AddPost.7')} rules={[{ required: false, message: t('AddPost.11') },]}>
                        <Input type="file"
                            id="image"
                            accept="image/png, image/jpeg"  onChange={this.handleImage} required/>
                        </Form.Item>
                        
                        <button type = "submit" onClick = {this.Add}>Edit</button>

                    </Form>



                </Drawer>
            </div>




        );
    }


    

}
export default withTranslation()(EditPost)