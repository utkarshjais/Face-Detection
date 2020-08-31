import React,{Component} from 'react';
import Particles from 'react-particles-js';
import './App.css';
import Navigation from './Components/Navigation';
import Logo from './Components/Logo';
import ImageLinkForm from './Components/ImageLinkForm';
import Rank from './Components/Rank';
import FaceRecognition from './Components/FaceRecognition';
import 'tachyons';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
 apiKey: '99fc6b5320774906aabd781c49b7e063'
});
const ParticlesComponent={
  particles: {
    number:{
      value:100,
      density:{
        enable:true,
        value_area:600
      }
    }
  }
}
class App extends Component{
  constructor(){
    super();
      this.state={
        input:'',
        imageUrl:''
    }
  }
  onInputChange=(event)=>{
    this.setState({input:event.target.value});
  }
  onButtonSubmit=()=>{
    this.setState({imageUrl:this.state.input})
    app.models.predict(Clarifai.FACE_DETECT_MODEL,this.state.input).then(
    function(response) {
      console.log(response);        

    },
    function(err) {
      // there was an error
    }
  );
  }
  render(){
  return (
    <div className="App">
      <Particles className='particles'
              params={ParticlesComponent}
            />
      <Navigation/>
      <Logo/>
      <Rank/> 
      <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
      <FaceRecognition imageUrl={this.state.imageUrl}/>
    </div>
  );
}
}
export default App;
