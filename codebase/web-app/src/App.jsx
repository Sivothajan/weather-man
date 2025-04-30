import { Route, Routes, BrowserRouter } from "react-router-dom"
import './App.css'
import Home from "./pages/home/Home"
import About from "./pages/about/About"
import Weather from "./pages/weather/Weather"
import Error404 from "./errors/Error404"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/*" element={<Error404 />} />

        <Route path="/about" element={<About />} />

        <Route path="/weather" element={<Weather />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
