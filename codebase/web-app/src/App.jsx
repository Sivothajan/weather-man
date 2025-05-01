import { Route, Routes, BrowserRouter } from "react-router-dom"
import './App.css'
import About from "./pages/about/About"
import Error404 from "./errors/Error404"
import Weather from "./pages/weather/Weather"
import Dashboard from "./pages/dashboard/Dashboard"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/*" element={<Error404 />} />

        <Route path="/about" element={<About />} />

        <Route path="/weather" element={<Weather />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
