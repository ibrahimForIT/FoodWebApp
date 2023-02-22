import React from 'react';
import axios from 'axios';
import {  Select} from 'antd';
import Post from './Post';
import InfiniteScroll from "react-infinite-scroll-component";


const { Option } = Select;

class HomePage extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      count: 0,
      next: '',
      hasMore: true,
    };
  }

  // change code below this line

  increment() {
    this.setState({
      count: this.state.count + 1
    });
  };

  decrement() {
    this.setState({
      count: this.state.count - 1
    });
  };

  reset() {
    this.setState({
      count: 0
    });
  };

  state = {
    count: 0,



  }

  incrementMe = () => {
    let newCount = this.state.count + 1
    this.setState({
      count: newCount
    })
  }
 
  

  componentDidMount = () => {
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
            articles: [...this.state.articles, item],
            next: res.data.next
          })
        })
        console.log(this.state.articles);
      })
      :
      this.setState({
        hasMore: false
      })
    }


  onChangeSel  = (value) => {
    console.log(`selected ${value}`);
    if ( value === 'Default'){
      this.componentDidMount()
    }
    else {
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
    }
    
  
    
}

  render() {
    return (
      <div>
        <h4 style = {{width : '170px' }}>
          Showing ways
        </h4>
        <Select
                        showSearch
                        style={{ width: 200 , position : 'absolute' , left : '220px' , top : '139px' }}
                        placeholder="Show by : "
                        optionFilterProp="children"
                        onChange={this.onChangeSel}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        >
                                <Option  key= '1' value='Default' >Default</Option>
                                <Option  key= '2' value='TopPostsToday' >Top Posts Today</Option>
                                 
                        </Select>

                        <InfiniteScroll
                          dataLength={this.state.articles.length}
                          next={this.fetchMoreData}
                          hasMore={this.state.hasMore}
                          loader={<h4>Loading...</h4>}
                        >
                          
                          <Post data={this.state.articles}  />
                        </InfiniteScroll>

        </div>

    )
  }
}

export default HomePage;

    
  
