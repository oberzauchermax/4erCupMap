import Map from './components/Map/Map'
import "tailwindcss";
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css'

function App() {
  return (
    <div className="App">
      <h1 className="absolute text-3xl font-semibold tracking-wide top-4 left-1/2 transform -translate-x-1/2 z-10"> 4er Cup Map </h1>
      <div className="MainContainer">
          <div className="MapContainer">
              <Map/>
          </div>
      </div>
    </div>
  )
}

export default App