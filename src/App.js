import Home from './pages/Home';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="*" element={<center className="display-1">404 Page Not Found</center>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;