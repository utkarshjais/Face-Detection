import React from 'react';
import Particles from 'react-particles-js';
import './App.css';
import Navigation from './Components/Navigation';
import Logo from './Components/Logo';
import ImageLinkForm from './Components/ImageLinkForm';
import Rank from './Components/Rank';
import 'tachyons';
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
function App(){
  return (
    <div className="App">
      <Particles className='particles'
              params={ParticlesComponent}
            />
      <Navigation/>
      <Logo/>
      <Rank/> 
      <ImageLinkForm/>
      {/*<FaceRecognition/>*/}
    </div>
  );
}
export default App;
