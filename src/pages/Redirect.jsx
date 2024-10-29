import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Navigate } from "react-router-dom";

export default function Redirect() {
    const [timer, setTimer] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    }, []);
    return (
        <div className="flex items-center justify-center absolute inset-0">
            <div className="flex gap-2 ">Navigating to admin page in {timer}</div>
            {timer == 0 && <Navigate to={"/admin"} />}
        </div>
    );
}
