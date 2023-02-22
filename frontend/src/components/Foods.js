import React from 'react';
import { Card,  Badge, Button, Rate } from 'antd';
import { MinusOutlined, PlusOutlined, HeartFilled } from '@ant-design/icons';
import { MdAddShoppingCart } from "react-icons/md";
import RateFood from './RateFood'
const ButtonGroup = Button.Group;

class Foods extends React.Component {

  state = {
    count: 0,
    show: true,
  };

  /*increase = () => {
    this.props.data.quant += 1;
    this.setState({
      count:this.props.data.quant
    })
  };

  decline = () => {
    this.props.data.quant-=this.props.data.quant>0?1:0;
    this.setState({
      count: this.props.data.quant
    })
  };
*/
increase = () => {
  this.setState({
    count: this.state.count+1
  })
  this.props.data.quant=this.props.data.quant+1;    
};

decline = () => {
  this.setState({
    count: this.state.count>0? -1: 0
  })
  this.props.data.quant=this.props.data.quant>0? -1:0;

};
  render() {
    console.log(this.props);
    return (
     
      <Card title={this.props.data.name} bordered={false} style={{
        backgroundImage: `url("${this.props.data.img}")`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        margin: "10px", textAlign: 'right', width: "30%", borderRadius: '50px'
      }}>
        
        {/* <Avatar className="ll" shape="square" size={50} src={this.props.data.img} />*/}
        <br></br>
        <p style={{ borderRadius: '20px', textAlign: "left", fontFamily: 'Bahnschrift SemiBold', background: 'rgba(115, 198, 182,0.5)', color: '#17202A' }}>&nbsp;&nbsp; PRICE  &nbsp;&nbsp;------------------------------------ &nbsp;&nbsp;&nbsp;{this.props.data.price} $</p>
        <div>
          <div className="sh" >

            <br></br>
            <br></br>
            <Badge count={this.state.count} style={{ marginRight: '30px' }}>

              < MdAddShoppingCart className="kk" />

            </Badge>
            <br></br>
            <br></br>

            <ButtonGroup style={{ position: "absolute", width: '10px', height: '10px', left: '70%' }}  >
              <Button onClick={this.increase} style={{ backgroundColor: '#58D68D ', borderRadius: '100%', color: 'white' }}>
                <PlusOutlined />
              </Button>
                    &nbsp; &nbsp;
                    <Button onClick={this.decline} style={{ backgroundColor: '#E83A3A  ', borderRadius: '100%', color: 'white' }}>
                <MinusOutlined />
              </Button>


            </ButtonGroup>


          </div>
          {console.log(this.props)}
          <div style={{ textAlign: 'left', backgroundColor: '' }}>
             <Rate  value={this.props.data.avg_of_rating}style={{ textAlign: 'left' }} character={<HeartFilled />} />
             <RateFood id = {this.props.data.id}  ></RateFood>
             </div>
        </div>
      </Card>


    );
  }
}

export default Foods