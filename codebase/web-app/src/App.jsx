import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./App.css";
import About from "./pages/about/About";
import Error404 from "./errors/Error404";
import Dashboard from "./pages/dashboard/Dashboard";
import Actions from "./pages/actions/Actions";
import Widget from "./pages/widget/Widget";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Widget isFullscreen={false} />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/take-action/:actionId" element={<Actions />} />
        <Route path="/weather" element={<Widget isFullscreen={false} />} />
        <Route path="/*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
