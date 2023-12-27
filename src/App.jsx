import './App.css'
import VideoPlayer from './Component/VideoPlayer'
import { Navbar } from './Component/Navbar'

function App() {
  return (
    <div className='h-screen'>
      <Navbar/>
      <VideoPlayer/>
    </div>
  )
}
export default App;