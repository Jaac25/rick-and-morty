import { Route, Routes } from "react-router-dom";
import "./App.css";
import Index from "./pages";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
    </Routes>
  );
}

export default App;
