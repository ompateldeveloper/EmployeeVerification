import { Route, Routes } from "react-router-dom";
import Admin from "./pages/Admin";
import Verify from "./pages/Verify";
import Redirect from "./pages/Redirect";

export default function App() {
    return (
        <div className="">
            <Routes>
                <Route path="*" element={<Redirect />} />
                <Route path="/verify/:hex" element={<Verify />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>
        </div>
    );
}
