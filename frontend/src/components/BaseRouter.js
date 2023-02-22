
import React from 'react'
import {message} from 'antd'
import NormalLoginForm from './LogIn';
import RegistrationForm from './Registration';
import Profile from './Profile';
import { Redirect, Route, Switch } from 'react-router-dom';
import ArticleList from '../cont/ArticleV'
import Rest from '../cont/Rest';
import HomePage from './HomePage';
import AddRest from './AddRest';
import ValidatePhone from './ValidatePhone';
import Contact from './contact';
import RestaurantSearch from './restaurantsSearch'
import LogIn from './LogIn';
import Myrest from './myrest'
import axios from 'axios'
import Reset from './Reset'
import ResetPass from './ResetPass'




const BaseRouter = () => {

    return( 

            <Switch>

            
            <Route exact path = "/myrest"  render= {() => {
            return(
              localStorage.getItem('token')!==null?
            <Myrest/>
            :
            <LogIn/>
            )
            
          }} />
              

          <Route exact path = "/"  render= {() => {
            return(
              localStorage.getItem('token')!==null?
            <HomePage/>
            :
            <LogIn/>
            )
            
          }} />
          
          <Route exact path = '/restaurants'  render= {() => {
            return(
              localStorage.getItem('token')!==null?
            <ArticleList/>
            :
            <LogIn/>
            )
            
        }} />
          
          <Route exact path = '/restaurants/:RestId'  render= {(RestId) => {
            return(
              localStorage.getItem('token')!==null?
            <Rest resid={RestId}/>
            :
            <LogIn/>
            )
            
          }} />
          
          <Route exact path = '/contact'  render= {() => {
            return(
              localStorage.getItem('token')!==null?
            <Contact/>
            :
            <LogIn/>
            )
            
          }} />
          
          <Route exact path = '/validate/:phoneNum' render= {(RestId) => {
            return(
              localStorage.getItem('token')===null?
            <ValidatePhone resid={RestId}/>
            :
            <HomePage/>
            )
            
          }} />
          
          <Route exact path = '/addrestautant' render= {() => {
            return(
              localStorage.getItem('token')!==null?
            <AddRest/>
            :
            <LogIn/>
            )
            
          }} />
          
          <Route exact path = '/login'  render= {() => {
            return(
              localStorage.getItem('token')===null?
            <NormalLoginForm/>
            :
            <HomePage/>
            )
            
          }} />
          
          <Route exact path = '/register'  render= {() => {
            return(
              localStorage.getItem('token')===null?
            <RegistrationForm/>
            :
            <HomePage/>
            )
            
          }} />
          
          <Route exact path = '/profile'  render= {() => {
            return(
              localStorage.getItem('token')!==null?
            <Profile/>
            :
            <LogIn/>
            )
            
          }} />
          
        <Route exact path='/restaurantSearch' render={() => {
          return (
            localStorage.getItem('token') !== null ?
              <RestaurantSearch />
              :
              <LogIn />
          )

        }} />

        <Route exact path='/verify-email/:Blah' render={(Blah) => {
          console.log("BLAaaaaaaah", Blah)
          //http://localhost:3000/verify-email/Nw:1kJJcL:h02Lof9lFPWNGhpm6WiRQOUNbb0
          axios.get(`http://localhost:8000/verify-email/${Blah.match.params.Blah}`,
            {
              headers: {
                Authorization: `token ${localStorage.getItem('token')}`
              }
            })
            .then(res => {
              console.log("CONFIRMED", res)
              message.success("Email Confirmed!")
              return (
                <Redirect to="/" />
              )
            })
            .catch(err => {
              console.log(err);
            })
        }} >

          {/*<Redirect to="/" />*/}
        </Route>

        <Route exact path='/resetreq' render={() => {
          return (
            localStorage.getItem('token') === null ?
              <ResetPass />
              :
              <HomePage />
          )

        }} />

        <Route exact path='/reset/:uid/:token' render={(uid, token) => {
          return (
            <div>
              {console.log("HEEEEEEEEEEEEEEEEEEEY YOUUUU", uid, token)}
              <Reset uid={uid} token={token} />
            </div>
          )
        }} >
        </Route>




      </Switch>
          )
}

export default BaseRouter;