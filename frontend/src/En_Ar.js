import React, { Component } from 'react'

import './App.css';
import { withTranslation } from 'react-i18next';
import i18n from './i18n';
import { Switch } from 'antd';
import { language } from 'i18next';

class En_Ar extends Component {

  constructor(){
    super()
    this.state = {
      
       
        language : 'en' 
    }

    
}/*
  handleClick(lang) {
    i18n.changeLanguage(lang)
  }
*/
  changeLanguage1 = value => {
    this.setState({
        language : value ? 'en' : 'ar'
        
    });
    i18n.changeLanguage(this.state.language)
    
}


  

  render() {
    

    return (
      <div className="App11">
       
       <Switch
            style={{backgroundColor:"#ff9800",color:'#fff',border:'1px solid #fff',fontWeight:"bold",top:'10px'}}
            checked={this.state.language === 'en'}
            onChange={this.changeLanguage1}
            language={this.state.language}
            checkedChildren="Ar"
              unCheckedChildren="En"
    
       
              />
        
      
      </div>
    )
  }
}

export default withTranslation()(En_Ar);
/*
 
          <button onClick={() => this.handleClick('en')} >
            English
        </button>
          <button onClick={() => this.handleClick('ar')} >
            Arabic
        </button>
        
        */