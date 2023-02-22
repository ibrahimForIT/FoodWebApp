import React from 'react';
import CustomLayout from './cont/layout';
import './App.css';
import 'antd/dist/antd.css'; 
//import so from './cont/Social';
import { BrowserRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux'
import BaseRouter from './components/BaseRouter';
import * as actions from './store/actions/auth';


class App extends React.Component {
 
 componentDidMount() {
   this.props.onTryAutoSignup();
 }
 
 render() {
    
  return (  
    
    <div>
  <BrowserRouter >
  
  {console.log("from app token", localStorage.getItem('token'))}
  {console.log("ALLERT DONT GO!")}
  
    <CustomLayout {...this.props} >
      <BaseRouter {...this.props}/>
    </CustomLayout>
  </BrowserRouter>
  </div>
    


  )};
}
  
const mapStateToProps = state => {
  return {
    isAuthenticated: localStorage.getItem('token') !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}
  
  export default connect(mapStateToProps, mapDispatchToProps)(App);


//export default App;