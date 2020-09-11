import React,{Component} from 'react';
import Particles from 'react-particles-js';
import './App.css';
import Navigation from './Components/Navigation';
import SignIn from './Components/SignIn';
import Register from './Components/Register';
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
  constructor(props){
    super(props);
      this.state={
        input:'',
        imageUrl:'',
        box:{},
        route:'signin',
        isSignedIn:false,
        user:{
          id:'',
          name:'',
          email:'',
          password:'',
          entries:0,
          joined:''
        }
    }
  }

  loadUser=(data)=>{
    this.setState({user:{
          id:data.id,
          name:data.name,
          email:data.email,
          password:data.password,
          entries:data.entries,
          joined:data.joined
    }})
  }

  calculateFaceLocation=(data)=>{
    const clarifaiFace= data.outputs[0].data.regions[0].region_info.bounding_box;
    const image=document.getElementById('inputImage');
    const width=Number(image.width);
    const height=Number(image.height);
    return {
      leftCol:clarifaiFace.left_col*width,
      topRow:clarifaiFace.top_row*height,
      rightCol:width-(clarifaiFace.right_col*width),
      bottomRow:height-(clarifaiFace.bottom_row*height)
    }
  }
  onRouteChange=(route)=>{
    if(route==='signout')
      this.setState({isSignedIn:false})
    else if(route==='home')
      this.setState({isSignedIn:true})
    this.setState({route:route});
  }
  displayFaceBox=(box)=>{
    this.setState({box:box})
  }
  onInputChange=(event)=>{
     this.setState({input:event.target.value});
  }
  onButtonSubmit=()=>{
    this.setState({imageUrl:this.state.input});
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
    .then(response=>{
      if(response){
        fetch('http://localhost:3000/image',
          {
            method:'put',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(
            {
            id:this.state.user.id

      })
    })
      .then(response=>response.json())
      .then(count=>{
        this.setState(Object.assign(this.state.user,{entries:count}))
      })
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
      })
          .catch(err=>console.log(err));
  }
  render(){
    const{isSignedIn,imageUrl,route,box}=this.state;
  return (
    <div className="App">
      <Particles className='particles'
              params={ParticlesComponent}
            />
            <Navigation isSignedIn={isSignedIn}onRouteChange={this.onRouteChange}/>
      
      {
        route==='home'?
                <div>
                    <Logo/>
                    <Rank name={this.state.user.name} entries={this.state.user.entries}/> 
                    <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
                    <FaceRecognition box={box}imageUrl={imageUrl}/>
                </div>:(
                  route==='signin'?<SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>:
                  <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                  )
          }
    </div>
  );
}
}
export default App;
