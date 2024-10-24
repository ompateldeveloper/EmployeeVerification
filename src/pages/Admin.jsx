import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ethers } from "ethers";
import { abi } from "../components/EmployeeExperience.json";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import QRCode from "react-qr-code";
const formSchema = z
    .object({
        name: z.string().min(2, { message: "Name must be at least 2 characters." }),
        company: z.string().min(2, { message: "Company must be at least 2 characters." }),
        startDate: z.date({
            required_error: "Start date is required.",
        }),
        endDate: z.date({
            required_error: "End date is required.",
        }),
    })
    .refine((data) => data.startDate <= data.endDate, {
        message: "End date must be after start date",
        path: ["endDate"],
    });

export default function Admin() {
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [recept, setRecept] = useState(null);
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data) => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

        const contract = new ethers.Contract(contractAddress, abi, signer);

        const tx = await contract.addExperience(data.name, data.company, Math.floor(data.startDate.getTime() / 1000), Math.floor(data.endDate.getTime() / 1000));
        console.log(contract);
        const receipt = await tx.wait();
        setDialogOpen(true);
        setRecept({
            hex: receipt.logs[0].args[0],
            name: receipt.logs[0].args[1],
            company: receipt.logs[0].args[2],
        });
        console.log(receipt.logs[0].args[0]);
        console.log(receipt.logs[0].args[1]);
        console.log(receipt.logs[0].args[2]);
        console.log(receipt.logs[0].args[3]);
        console.log(receipt.logs[0].args[4]);

        setSubmitSuccess(true);
    };

    const [connected, setConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState("");

    // Function to connect/disconnect the wallet
    async function connectWallet() {
        if (!connected) {
            // Connect the wallet using ethers.js
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const _walletAddress = await signer.getAddress();
            setConnected(true);
            setWalletAddress(_walletAddress);
        } else {
            // Disconnect the wallet
            setWalletAddress("");
            setConnected(false);
            await window.ethereum.request({
                method: "wallet_revokePermissions",
                params: [
                    {
                        eth_accounts: {},
                    },
                ],
            });
            // window.ethereum.selectedAddress = null;
        }
    }
    if (!connected) {
        return (
            <div className="max-w-md mx-auto flex items-center justify-center h-screen">
                <div className="">
                    <div className="text-zinc-500 font-semibold text-lg">It looks like You are not Connected to Metamask</div>
                    <Button className="btn" onClick={connectWallet}>
                        Connect Wallet
                    </Button>
                </div>
            </div>
        );
    }
    return (
        <div className="max-w-md mx-auto mt-10">
            <div className=" font-semibold text-xl">Admin</div>
            <div className="py-2">
                {connected && "connected as: " + walletAddress}
                <Button className="btn" variant={"destructive"} onClick={connectWallet}>
                    Disconnect Wallet
                </Button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...register("name")} />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" {...register("company")} />
                    {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Controller
                        control={control}
                        name="startDate"
                        render={({ field }) => (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                </PopoverContent>
                            </Popover>
                        )}
                    />
                    {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Controller
                        control={control}
                        name="endDate"
                        render={({ field }) => (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                </PopoverContent>
                            </Popover>
                        )}
                    />
                    {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>}
                </div>

                <Dialog open={dialogOpen}>
                    <Button type="submit" className="w-full">
                        Submit
                    </Button>
                    <DialogTrigger>yoho</DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Share This code With employee</DialogTitle>
                            <DialogDescription>or Scan image to see details </DialogDescription>
                        </DialogHeader>
                        <div className="w-full truncate">{recept && recept.hex}</div>
                        <div className="flex ">
                            {recept && (
                                <div className="max-w-64">
                                    <QRCode size={256} style={{ height: "auto", maxWidth: "100%", width: "100%" }} value={"http://localhost:5173/verify" + recept.hex} viewBox={`0 0 256 256`} />
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </form>

            {submitSuccess && <p className="text-green-500 mt-4">Form submitted successfully!</p>}
        </div>
    );
}
