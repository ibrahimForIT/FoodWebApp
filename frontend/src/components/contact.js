import { Tag } from 'antd';
import React from 'react';
import {
  TwitterOutlined,
  YoutubeOutlined,
  FacebookOutlined,
  LinkedinOutlined,
  InstagramOutlined,
  GooglePlusOutlined,
  WhatsAppOutlined
} from '@ant-design/icons';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { MdEmail } from 'react-icons/md';

const Contact = () => {
  return (


<div className="inc1" style={{ textAlign: "center",marginTop:'11px' }}  >
      <a className="twi" href="https://www.twitter.com" target="blank">

        <Tag className="tw" style={{ fontSize: '25px', borderRadius: "40px",marginTop:'30px',fontWeight:"bold" }} icon={<TwitterOutlined style={{ marginLeft:"9px",paddingBottom:"13px",paddingTop:'13px', fontSize: "45px" }} />} >
        
  </Tag>
      </a>
      &nbsp; &nbsp;
      <a className="yout" href="https://www.WhatsApp.com" target="blank">
        <Tag className="you" style={{ fontSize: '25px', borderRadius: "40px",fontWeight:"bold" }} icon={<WhatsAppOutlined style={{marginLeft:"9px", paddingBottom:"13px",paddingTop:'13px', fontSize: "45px" }}/>} >
         
  </Tag>
      </a>
      &nbsp; &nbsp;
      <a className="fac" href="https://facebook.com" target="blank">
        <Tag className="fa" style={{ fontSize: '25px', borderRadius: "40px",fontWeight:"bold" }} icon={<FacebookOutlined style={{marginLeft:"8px", paddingBottom:"13px",paddingTop:'13px', fontSize: "45px" }}/>} >
       
  </Tag>
      </a>
      &nbsp; &nbsp;
      <a className="inst" href="https://www.instagram.com" target="blank">
        <Tag className="ins" style={{ fontSize: '19px', borderRadius: "40px" ,fontWeight:'bold'}} icon={<InstagramOutlined style={{marginLeft:"8px", paddingBottom:"13px",paddingTop:'13px', fontSize: "45px" }}/>} >
        
  </Tag>
      </a>
      &nbsp; &nbsp;
      <a className="gma" href="https://www.gmail.com" target="blank">
        <Tag className="gm" style={{ fontSize: '23px',width:"", borderRadius: "40px",fontWeight:"bold",border:"1px solid" }} icon={<GooglePlusOutlined style={{marginLeft:"9px", paddingBottom:"13px",paddingTop:'13px', fontSize: "45px" }}/>} >
        
  </Tag>
      </a>
    </div>



  );
}

export default Contact;