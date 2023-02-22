import React from 'react';
import { List, Layout, message, notification } from 'antd';
import { Card } from 'antd';
import { Rate, Menu } from 'antd';
import Foods from '../components/Foods'
import SubmitOrder from './SubmitOrder';

import Add_meal from './Add_Meal'
import { Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import Add_Post from './Add_Post'
import Post from './Post';
import Orders from './Orders'
import axios from 'axios';
import InfiniteScroll from "react-infinite-scroll-component";

import { withTranslation } from 'react-i18next';

const { Content } = Layout;

class Res extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      posts:[],
      next:'',
      hasMore: false,
      file: null,
      food: true,
      loc: '',
      lan: this.props.data.language

    }
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0])
    })
  }




  componentDidMount() {
    console.log(this.props);
    console.log(this.state);
    if (this.props.data.resturant.order_cnt>0){
      notification.warn({
        message: 'you have new orders!',
        description:
          'New orders has been added to your queue',
        duration:60,
      });
    }
  }

  fetchMoreData = () => {
    this.state.next!==null?
    axios.get(this.state.next, 
      {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`
        }
      }).then(res => {
        res.data.results.map( item => {
          this.setState({
            posts: [...this.state.posts, item],
          })
        })
        console.log(this.state.posts);
      })
      :
      this.setState({
        hasMore: false
      })
    }

  render() {

    const { t } = this.props;

    const location = () => {

      if (this.state.lan === 'en') {

        return t('res.1')
      }





    }
    return (
      <div className="site-card-border-less-wrapper">

        <Card
          style={{


            borderRadius: '10px',
            background: 'rgba(255, 236, 179,0.7)',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            width: '100%'
          }} bordered={false}  >
          {
            console.log(this.props.data.resturant.name),
            console.log(this.props),
            console.log(this.state)


          }
           {
      localStorage.getItem("id")!==this.props.data.resturant.owner?
      <p/>
      :
      <input type="file" onChange={this.handleChange} />
    }


        <img alt="img" src={this.state.file || this.props.data.resturant.cover} style={{width:'100%',height:'400px',borderRadius:'5px',zIndex:'1'}}  >
          
        </img>
     

    <br></br>
          



          <p style={{ zIndex: '1', fontFamily: 'Droid Arabic Kufi', textAlign: 'center', fontSize: '30px', color: 'white', backgroundColor: '#FFA726', borderRadius: '6px' }}>{this.props.data.resturant.name}</p>

          <p style={{ color: "#B22222 ", textAlign: 'center' }}>{location()}</p>

          <p style={{ color: "#00CC00 ", textAlign: 'center', fontFamily: 'Bahnschrift SemiBold' }}>{t('res.7')} {this.props.data.resturant.from_hour} {t('res.8')} {this.props.data.resturant.to_hour}</p>
          <div style={{
            backgroundColor: "#FFE0B9",
            borderRadius: "50px",
            position: 'relative',
            textAlign: 'center',
            color: '#000  ',
            fontFamily: 'Bahnschrift SemiBold'
          }}>
            {t('res.4')} <Rate allowHalf={true} value={this.props.data.resturant.avg_of_rating} />
          </div>

        </Card>

        <br></br>

        <Layout style={{ borderRadius: '31px' }} >

          <Menu selectedKeys="-1" style={{ border: ' 3px solid #FF9800', borderRadius: '50px' }} mode="horizontal">
            <Menu.Item className="food1" onClick={() => {
              this.setState({
                food: true
              })
            }}
            >
              {console.log("qqqqqqqqqqqqqqqqqqqq",this.props.data.resturant)}
              {console.log("ssssssssssssss",localStorage.getItem('id'))}

              {this.props.data.resturant.owner!==parseInt(localStorage.getItem('id'))?
                    <div style={{color:'#FF9800'}} >FOODS &nbsp;  </div>
                    
                :
              <Dropdown overlay={
                <Menu style={{ borderRadius: '15px', backgroundColor: '#FF9800' }}>
                  <Menu.Item >
                    <a style={{ backgroundColor: '#FF9800', color: '#fff', borderRadius: '10px' }}>

                      <Add_meal id={this.props.data.resturant.id} />
                    </a>
                  </Menu.Item>

                </Menu>

              } placement={"topCenter"}  >
                <div style={{color:'#FF9800'}} >{t('res.2')} &nbsp;  <DownOutlined  /></div>
              </Dropdown>
             }
            </Menu.Item>

            <Menu.Item className="pos" style={{left:"5%"}} onClick={() => {
              axios.get(`http://localhost:8000/api/posts-for-restaurant/`, 
              {
                restaurant: this.props.data.resturant.id
              },
              {
                headers: {
                  Authorization: `Token ${localStorage.getItem('token')}`
                }
             }).then(res => {
                  console.log("HELLO",res.data.posts);
                  this.setState({
                      posts:res.data.posts
                  })
              }).catch(err =>{
                console.log(localStorage.getItem('token'));
                  console.log(err);
              })
              this.setState({
                food:false
              })
            }}
            >
              {this.props.data.resturant.owner!==parseInt(localStorage.getItem("id"))?
                  <div style={{color:'#FF9800'}}> POSTS &nbsp;  </div>
                :
              <Dropdown selectedKeys="-1" overlay={

                <Menu style={{ borderRadius: '15px', backgroundColor:"#FF9800" }}>

                  <Menu.Item >
                    <a style={{ backgroundColor: '#FF9800', color: '#fff', borderRadius: '10px' }}>
                      <Add_Post id={this.props.data.resturant.id} />
                    </a>
                  </Menu.Item>
                </Menu>

              } placement={"topCenter"}  >
                <div style={{ color: '#FF9800' }}> {t('res.3')}  &nbsp;  <DownOutlined /></div>
              </Dropdown>
              }
            </Menu.Item>
{/*
            <Menu.Item className="order" >
               
              <Dropdown selectedKeys="-1" overlay={

                <Menu style={{ borderRadius: '15px', backgroundColor: '#FF9800'}}>

                  <Menu.Item >
                    <a style={{ backgroundColor: '#FF9800', color: '#fff', borderRadius: '10px' }}>
                      <Orders id={this.props.data.resturant.id} />
                    </a>
                  </Menu.Item>
                </Menu>


              } placement={"topCenter"}  >
                <div style={{ color: '#FF9800'}}> Orders  &nbsp;  <DownOutlined /></div>
              </Dropdown>
  
            </Menu.Item>

            */      }
          </Menu>


          <Content className='ListBack'> 
            {
              this.state.food ?
                //FOOD
                <List
                  id="list"
                  grid={{ gutter: 15, column: 3 }}
                  itemLayout="vertical"
                  size="large"

                  dataSource={this.props.data.foods}
                  footer={
                    <div>

                    </div>
                  }
                  renderItem={item => (

                    <Foods id = {this.props.data.foods.id}  data={item} />

                  )}
                >
                  <SubmitOrder data={this.props.data.foods} id={this.props.data.resturant.id} />
                </List>
                :
                <InfiniteScroll
                   dataLength={this.state.posts.length}
                   next={this.fetchMoreData}
                   hasMore={this.state.hasMore}
                   loader={<h4>Loading...</h4>}
                 >
                   <Post data={this.state.posts} />
                 </InfiniteScroll>
            }
          </Content>
          {console.log(document.getElementById("list"))}
        </Layout>

      </div>


    );
  }
}


export default withTranslation()(Res);