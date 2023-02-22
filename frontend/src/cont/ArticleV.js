import React from 'react';
import Articles from '../components/Article';
import axios from 'axios';
import { connect } from 'react-redux';


class ArticleList extends React.Component{
    state = {
        articles: []
    }

    componentDidMount() {
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
    }

    render(){
        return(
            <Articles data={this.state.articles} />
        )
    }
}

const mapStateToProps = state => {
    return {
      articles: state.articles
    }
  }


export default connect(mapStateToProps, null) (ArticleList);
