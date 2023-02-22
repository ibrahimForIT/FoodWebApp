import React from 'react';
import { List, Menu, Dropdown } from 'antd';
import { LikeFilled, EllipsisOutlined, MoreOutlined } from '@ant-design/icons';
import Moment from 'react-moment';
import axios from 'axios'
import EditPost from './EditPost'



class Post extends React.Component {
  

  state = {
    count: 0,
    data: [],
    
    dataSource : [],

  
  }
 

  componentDidMount() {
    console.log(this.props.data);
    console.log(this.state);
       
            
  
    

  }


  render() {
    let dataSource = this.props.data


      
        
    return (
      <div>
        
              <List
        itemLayout="vertical"
        size="small"
        style={{ maxWidth: "70%" }}
        dataSource={dataSource}

        renderItem={item => (

          <div className="opac" style={{ borderRadius: '25px' }}>
            <List.Item
              className="postsmar"
              //key={item.author}
              actions={[


                <div className="btn1" style={{ backgroundColor: '#FFE0B2 ', borderRadius: '20px', border: '10px solid transparent' }}

                >
                  <LikeFilled className='inc' onClick={() => {
                    axios.post('http://localhost:8000/api/is-liked/', {
                      Content: {
                        post: item.id
                      }
                    },
                      {
                        headers: {
                          Authorization: `Token ${localStorage.getItem('token')}`
                        }
                      }).then(res => {
                        console.log("COME FOR ME", res.data[0]);
                        if (res.data[0] === 0) {
                          axios.post('http://localhost:8000/api/likes/', {
                            'post': item.id
                          },
                            {
                              headers: {
                                Authorization: `Token ${localStorage.getItem('token')}`
                              }
                            }).then(res => {
                              //console.log(item)
                              this.setState({
                                count: 1
                              })
                            })
                        }
                        else {
                          axios.post('http://localhost:8000/api/unlike/', {
                            'post': item.id
                          },
                            {
                              headers: {
                                Authorization: `Token ${localStorage.getItem('token')}`
                              }
                            }).then(res => {
                              this.setState({
                                count: 0
                              })
                            })
                        }
                      })
                  }}




                    style={{ fontSize: '23px' }} />
                  
  &nbsp;| &nbsp;
    <span style={{ color: '#FF7043 ' }}>{item.like_cnt}</span>


                </div>


              ]}
              extra={

                <div className="grid" >

                  <figure className="effect-layla" style={{ borderRadius: "" }}>
                    <img style={{ height: "240px", borderRadius: "" }} src={item.img} alt="img06" />
                    <figcaption>
                      
                     
                      
                    </figcaption>
                  </figure>
                </div>


              }
            >
              {
               // this.props.data.resturant.owner!==localStorage.getItem("id")?
                <List.Item >
              <Dropdown placement="bottomLeft" onClick={()=>
              
              axios.get(`http://localhost:8000/api/restaurant/${item.author}`)
              //axios.get(`http://localhost:8000/api/restaurant/2`)
              .then(res => {
                console.log(res);
                this.setState({
                  data: res.data,
                  name : res.data.name
                })
               
              })
            
              
            
            } overlay={()=>
              <Menu>
              <Menu.Item style={{ fontWeight: "bold", color: '#4a7777' }}>
               

                <EditPost postid={item.id} id={item.author}  title={item.title} content={item.content} img = {item.img}/>
              
                
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item onClick={()=>
                axios.delete(`http://localhost:8000/api/posts/${item.id}`,
                {
                  headers :{ 'Authorization': `token ${localStorage.getItem('token')}`
                  }
              }).then(res =>{
                console.log(res);
                axios.get('http://localhost:8000/api/posts/',
                {
                  headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`
                
                }})
                  .then(res => {
                    console.log("OME",res.data)
                    dataSource = res.data.results
                    this.setState({
                      dataSource: res.data.results,
                      next: res.data.next
                    })
                  })
                  .catch(err => {
                    console.log(err);
                  })
                
              })
              } >
                
                <a style={{ fontWeight: "bold", color: "#EF5350 " }}>Delete</a>
                
              </Menu.Item>
          
            </Menu>
             
              
          }>
                <a className="dropdown-link" onClick={e => e.preventDefault()}>
                  <MoreOutlined style={{ fontSize: "25px", color: "#a52020" }} />
                </a>
              </Dropdown>
              </List.Item>
           //   :
              
            }



              <br></br>


              <List.Item.Meta

                title={`${item.author} Restaurant`}
                description={<Moment format="YYYY/MM/DD hh:mm" date={item.date_posted} />}
              />
              {item.title}
              <br>
              </br>
              {item.content}
             

            </List.Item>
            
         
          </div>
         
         )}
         />
      </div>
      
    );
  }
}

export default Post;
