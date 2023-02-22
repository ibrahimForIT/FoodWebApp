import React from 'react';
import axios from 'axios';
import Res from '../components/res';
import i18n from '../i18n';



class Rest extends React.Component {
    state= {
        language : i18n.language,
        resturant: {},
        foods : [],
        post: []
        
    }

    componentDidMount() {
        console.log(this.props);
        const RestId = this.props.resid.match.params.RestId;
     axios.get(`http://localhost:8000/api/restaurant/${RestId}`)
     .then (res => {
         this.setState({
             resturant: res.data
         })
     })
     .catch(err => {
         console.log("REST ERROR!! ", err);
     })
 
     axios.post("http://localhost:8000/api/food-for-restaurant/", 
     { Content: {
         'restaurant':RestId
     } }, 
     {
       headers: {
         Authorization: `Token ${localStorage.getItem('token')}`
     
       }
     
    }
     ).then(res => {
         console.log("thisis",res.data);
         {res.data.status!==false?
         this.setState({
             foods:res.data
         })
         :
         this.setState({
             foods:[]
         })}
     }).catch(err => {
         console.log(err);
         this.setState({
             foods:[]
         })
     });
 
     axios.post("http://localhost:8000/api/posts-for-restaurant/",
     {'Content': {
         'restaurant':RestId
     } }, 
     {
       headers: {
         Authorization: `Token ${localStorage.getItem('token')}`
     
       }
    }
     ).then(res => {
         console.log("HELLO",res.data.posts);
         this.setState({
             post:res.data.posts
         })
     }).catch(err =>{
         console.log(err);
     })
    }
 
    render() {
        return (
           <div>
            <Res data= {this.state} />
           </div>       
        )       
    }
 
 }
 
 export default Rest




