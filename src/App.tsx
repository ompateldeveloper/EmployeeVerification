import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Verify from "./pages/Verify";

export default function App() {
    return (
        <div className="">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/verify/:hex" element={<Verify />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>
        </div>
    );
}
