import React, { Component } from 'react';
import { Layout, Menu ,Input, Select , List, Button } from 'antd';
import { Link } from 'react-router-dom';
import { Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { UserOutlined, LogoutOutlined, InstagramOutlined, FacebookFilled, TwitterOutlined } from '@ant-design/icons';
import * as auths from '../store/actions/auth'
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import En_Ar from '../En_Ar';
import { compose } from 'redux';
import axios from 'axios';
import OrderList from '../components/Orders'
import Add_Rest from '../components/AddRest'
import Statistics from '../components/Statistics';
import { MenuOutlined } from '@ant-design/icons';
import RestaurantSearch from '../components/restaurantsSearch';
import img from '../original-logos-500.png'


const { Content, Footer } = Layout;
const { Search } = Input;
const {Option} = Select;




class CustomLayout extends Component {

  state= {
    foods:[],
    restaurants: [],
    articles :[]
  }

  componentDidMount(){
    console.log(this.props);
    
  }
  

  render() {
    const { t } = this.props;

    return (


      <Layout style={{ zIndex: '1', width: '100%', background: "url(" + "https://st3.depositphotos.com/8392720/12816/v/950/depositphotos_128167702-stock-illustration-hand-drawn-vector-seamless-fast.jpg" + "  ) " }}>


        <Menu selectedKeys="-1" style={{ backgroundColor: '#FF9800 ' }} mode="horizontal" className="lay">





          <Link to="/">
              <Avatar className="av" size={62} src={img} />
            </Link>
          <Link className="wrapper" to="/" style={{ color: '#A52A2A', fontFamily: "sans-serif", marginLeft: '55px', fontWeight: 'bold' }}>
         
          <Link className="effect-underline" style={{ color: '#A52A2A' }}> | &nbsp;
          STORE TO DOOR
           </Link> 
           </Link>




          <Menu.Item className="h" style={{ marginBottom: '8px' }}>
            <Link to="/" style={{ color: '#fff' }}>
              {t('Restaurants.2')}
            </Link>
          </Menu.Item>
          <Menu.Item style={{left:'%',marginBottom:"9px"}}>
            <Dropdown  placement="bottomCenter" overlay={
              <Menu>
              <Menu.Item onClick = {()=>
               axios.get('http://localhost:8000/api/posts/',
               {
                 headers: {
                   Authorization: `Token ${localStorage.getItem('token')}`
               
               }})
                 .then(res => {
                   console.log("OME",res.data)
                   this.setState({
                     articles: res.data.results,
                     next: res.data.next
                   })
                 })
                 .catch(err => {
                   console.log(err);
                 })
                 }>
               
                 <a style={{ fontWeight: "bold", color: '#4a7777' }}>
                 Default
                 </a>
              
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item onClick={()=>
               axios.get('http://localhost:8000/api/top-posts/',
               {
                 headers: {
                   Authorization: `Token ${localStorage.getItem('token')}`
               
               }})
               .then(res => {
                 this.setState({
                   articles: res.data.results
                 })
                 console.log(res.data)
               })
               .catch(err => {
                 console.log(err);
               })
              }>
                <a style={{ fontWeight: "bold", color: "#EF5350 " }}>
                Top Posts Today
                </a>
              </Menu.Item>
          
            </Menu>
            }>
              <a  className="dropdown-link" onClick={e => e.preventDefault()}>
                <DownOutlined style={{fontWeight:"bold", fontSize: "13px", color: "#a52020" }} />
              </a>
            </Dropdown>
          </Menu.Item>




          <Menu.Item className="hres" style={{ marginBottom: '8px' }}>
            <Link to="/restaurants" style={{ color: '#fff' }}>
              {t('Restaurants.1')}
            </Link>
          </Menu.Item>
          <Menu.Item style={{left:"-25px",marginBottom:"9px"}}>
            <Dropdown  placement="bottomCenter" overlay={
              <Menu>
              <Menu.Item onClick={()=>
               axios.get('http://localhost:8000/api/restaurant/verified' , 
      
               {
                 headers: {
                   Authorization: `Token ${localStorage.getItem('token')}`
               
               }}
               )
                   .then(res => {
                       console.log(res.data);
                       this.setState({
                           articles: res.data
                       })
                   }).catch(err => {
                       console.log(err);
                   })
              }>
                 <Link to="/restaurants" property = {this.state.articles}>
                <a style={{ fontWeight: "bold", color: '#4a7777' }}>
                  Default
                </a>
                </Link>
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item onClick={()=>
               axios.get('http://localhost:8000/api/restaurant/rating/',
               {
                 headers: {
                   Authorization: `Token ${localStorage.getItem('token')}`
               
               }})
                 .then(res => {
                   console.log(res);
                   this.setState({
         
                     articles: res.data
                   })
                   console.log(res.data)
                 })
                 .catch(err => {
                   console.log(err);
                 })
              }>
                <Link to="/restaurants" >
                <a style={{ fontWeight: "bold", color: "#EF5350 " }}>
                  Top Restaurants
                </a>
                </Link>
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item onClick={()=>
               axios.get('http://localhost:8000/api/restaurant/available/',
               {
                 headers: {
                   Authorization: `Token ${localStorage.getItem('token')}`
               
               }})
                 .then(res => {
                   this.setState({
                     articles: res.data
                   })
                   console.log(res.data)
                 })
                 .catch(err => {
                   console.log(err);
                 })
              }>
                 <Link to="/restaurants" >

                <a style={{ fontWeight: "bold", color: "#a92020 " }}>
                  Available Restaurants
                </a>
                 </Link>
              </Menu.Item>
            </Menu>
            }>
              <a  className="dropdown-link" onClick={e => e.preventDefault()}>
                <DownOutlined style={{fontWeight:"bold" ,fontSize: "13px", color: "#a52020" }} />
              </a>
            </Dropdown>
          </Menu.Item>



          <Menu.Item className="c1" style={{ marginBottom: '16px', left: '30%' }} >
            <En_Ar />
          </Menu.Item>



          <Menu.Item className="c1" style={{ marginBottom: '8px' }}>
            <Link to="/contact" style={{ color: '#fff' }}>
              {t('Restaurants.4')}
            </Link>
          </Menu.Item>



          <Menu.Item className="c1" style={{ marginBottom: '8px' }}>
            {console.log(this.props.isAuthenticated)}
            {
              this.props.isAuthenticated ?
                <div style={{ color: "#fff" }}>
                  
                  < Dropdown    overlay={() =>
                    <Menu style = {{borderRadius:"10px" , top:"18px" , left:"15px", backgroundColor:"#f1f1f1" , height:"300px"}}>
                     <Menu.Item style={{}} className = "buy2">
                        <Link style={{left:"70px",marginTop:"1px", border:"1px solid"}} className="btnn" to="/profile">
                          <UserOutlined />&nbsp; {t('layout.1')}
              </Link>
                      </Menu.Item>

                      

                      <Menu.Item className="or">
                        <OrderList />
                      </Menu.Item>

                      <Menu.Item className="or">
                       <Add_Rest />  
                      </Menu.Item>

                      <Menu.Item className="or">
                       <Statistics  />  
                      </Menu.Item>

                       <Menu.Item style={{}} className = "buy2" >
                         <Link  style={{left:"70px",marginTop:"1px", border:"1px solid" }} className="btnn" to="/myrest"     >
                         <Button placement="Center" style ={{left : '-2px' ,top:"2px", backgroundColor : '#f1f1f1' , width :'110%' }} >{t('layout.2')}</Button>
                         </Link>
                       </Menu.Item>

                      <Menu.Item className = "buy2">
                        <Link style={{border:"1px solid ", left:"70px",top:"25px",paddingTop:'10px'}} className = "btnn" to="/login" onClick={this.props.logout}>
                          <LogoutOutlined /> &nbsp;{t('layout.4')}
                </Link>
                      </Menu.Item>
                    </Menu>} >
                    <MenuOutlined style={{color:'#A52A2A'}} />
                  </ Dropdown>
                  
                </div>

                :

                <Link to="/login" className="lo" style={{ color: '#fff' }}>
                  {t('Restaurants.5')}
                </Link>

            }



          </Menu.Item>

        </Menu>




        <div className="input-group w-25 mx-auto " style={{ marginTop: '12px', paddingLeft: '0px', right: '5%' }}>
        <input style={{borderTopLeftRadius:"20px",border:"2px solid #A52A2A"}} onChange={(event)=> {
            axios.get(`http://localhost:8000/api/food/?search=${event.target.value}` , 
            {
              headers: {
                Authorization: `Token ${localStorage.getItem('token')}`
            }})
            .then(res => {
              console.log(res);
              this.setState({
                foods:res.data
              })
            })
            

            axios.get(`http://localhost:8000/api/restaurant/verified/?search=${event.target.value}` ,
            {
              headers: {
                Authorization: `Token ${localStorage.getItem('token')}`
            }}
            )
            .then(res => {
              console.log(res.data);
              this.setState({
                restaurants:res.data.results
              })
            })
            console.log(this.state);
          }} 
          type="text" 
          className="form-control" 
          placeholder={t('placeholder.1')} />

            <div className="input-group-append">  
            
            <Link to="/restaurantSearch" target="blank" onClick={()=> this.state.restaurants}> 
             <button  className="btn ">{t('Restaurants.7')}</button>
             </Link>
             </div>
            </div>



        <Content style={{ marginTop: "40px", padding: '0 50px' }}>

          <div className="site-layout-content">
            <br />
            {this.props.children}
          </div>
        </Content>

        <br />
        <br />
        <br />
        <br />

        <Footer className="footer" style={{ position: "static", width: "100%", bottom: "0", backgroundColor: '#FF8C00 ', color: 'white', textAlign: 'center', marginTop: '93px' }}>
          {t('Restaurants.6')}
          <Link to="/" className="T"><br /><br /><TwitterOutlined style={{ color: "#00FFFF" }} /> &nbsp;         <FacebookFilled style={{ color: "#1E90FF" }} />   &nbsp;       <InstagramOutlined style={{ color: "#BA55D3" }} /></Link>
        </Footer>
      </Layout>


    );
  }

}



const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(auths.logout())

  }

}

export default compose(withTranslation(), connect(null, mapDispatchToProps))(CustomLayout);
