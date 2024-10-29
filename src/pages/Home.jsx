import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import QRCode from "react-qr-code";

export default function Home() {
    console.log(import.meta.env.BASE_URL);

    return (
        <div className="p-4">
            <div className="flex gap-2 ">
                <div className="max-w-64">
                    <QRCode style={{ height: "auto", maxWidth: "100%", width: "100%" }} value={"https://employee-verification.netlify.app/verify/" + '0x07e284b5fd90a1b476ed83c55e02825e5cfcbdcbcd8a1be6437253be5a4b98d5'} viewBox={`0 0 256 256`} />
                </div>
                <Button variant='outline' onClick={()=>{ navigator.clipboard.writeText()}} >Copy link <Copy/></Button>
            </div>
        </div>
    );
}
