import React, { Component } from 'react';
import { List, Card , Select  } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Rate from './Rate'
import axios from 'axios'



const IconText = ({ icon, text }) => (
  <span >
    {React.createElement(icon, { style: { marginRight: 8 } })}
    {text}
  </span>
);


class myrest extends Component {

  state =  {
    articles  : []
  }
  componentDidMount() {
    console.log(this.state);
    console.log(this.props);
    axios.get('http://localhost:8000/api/my-restaurants' , 
      
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
   
  }
  
 

  render() {
    
    return (
      <div>


         
          
         
           
            
            

       
          <List
            
            grid={{ gutter: 16, column: 4 }}
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: page => {
                console.log(page);
              },
              pageSize: 8,
            }}
            dataSource={this.state.articles}
            footer={
              <div>

              </div>
            }
            renderItem={item => (

              <Card style={{ borderRadius: "50px", backgroundImage: "url(https://bistroonbridge.com/wp-content/uploads/OIHR970-e1522873047667.jpg)", width: "20%", margin: "2%" }}
                key={item.title}

                extra={
                  <Link to={'/restaurants/'+ item.id} href="#" className="column col-xs-6" id="zoomIn"><figure>
                    <img

                      style={{ position: "relative", height: '200px', borderRadius: '50px' }}
                      position="center"
                      width="100%"
                      alt="img"
                      src={item.cover}
                    >

                    </img>

                  </figure>
                  </Link>
                }>


                <Card.Meta
                  title={<Link className="btn2" style={{ marginLeft: '70px', fontSize: '25px' }} to={'/restaurants/'+ item.id}>{item.name}</Link>}
                // title={<Link to='/res'>{item.name}</Link>}

                />
                <IconText icon={StarOutlined} text={item.avg_of_rating} key="list-vertical-star-o" />,
                <br></br>
                <h6 style={{ color: '#F4D03F  ', marginLeft: '75px' }}>
                  {item.location}
                </h6>
                {console.log(this.props)}
                <Rate id={item.id} value={item.avg_of_rating} />
              </Card>
            )}
          />

        </div>
      )

    }
  }
  export default myrest;