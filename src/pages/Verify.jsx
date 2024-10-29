import { ethers } from "ethers";
import { abi } from "../components/EmployeeExperience.json";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle, Calendar, Building2, User } from "lucide-react"



export default function UserVerification() {
    const [userData, setDetails] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { hex } = useParams();

    const getDetails = async () => {
        try {
            const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_ALCHEMY_API_URL); // Using Alchemy directly instead of Metamask

            const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
            const contract = new ethers.Contract(contractAddress, abi, provider);

            const tx = await contract.getExperience(hex);

            // If tx is null or empty, then no data is found
            if (!tx) {
                throw new Error("No data found for the provided key");
            }
            setLoading(false)

            setDetails({
                name: tx[0],
                company: tx[1],
                startDate: format(tx[2] ,"dd MMM yyyy"),
                endDate: format(tx[3] ,"dd MMM yyyy"),
            });
        } catch (err) {
            setError(err.message || "Failed to fetch details");
            console.error(err);
        }
    };
    useEffect(() => {
        if (hex) getDetails();
    }, [hex]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">User Verification</CardTitle>
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            Verified
          </Badge>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Name:</span>
                <span>{userData?.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Company:</span>
                <span>{userData?.company}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Start Date:</span>
                <span>{userData?.startDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span className="font-medium">End Date:</span>
                <span>{userData?.endDate}</span>
              </div>
              <div className="mt-6 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <span className="ml-2 text-lg font-semibold text-green-600">You Are Verified!</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}