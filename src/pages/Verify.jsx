import { ethers } from "ethers";
import React, { Suspense, useEffect, useState } from "react";
import { abi } from "../components/EmployeeExperience.json";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

export default function Verify() {
    const [details, setDetails] = useState(null);
    const [error, setError] = useState(null);
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

            setDetails({
                name: tx[0],
                company: tx[1],
                startDate: format(Date(Number(BigInt(tx[2]))), "dd MMM yyyy"),
                endDate: format(Date(Number(BigInt(tx[3]))), "dd MMM yyyy"),
            });
        } catch (err) {
            setError(err.message || "Failed to fetch details");
            console.error(err);
        }
    };

    useEffect(() => {
        console.log(details);
    }, [details]);
    useEffect(() => {
        if (hex) getDetails();
    }, [hex]);

    return (
        <div>
            {details ? (
                <div>
                    <div className="">{details.name}</div>
                    <div className="">{details.company}</div>
                    <div className="">{details.startDate}</div>
                    <div className="">{details.endDate}</div>
                </div>
            ) : (
                <div>{error ? error : "Loading..."}</div>
            )}
        </div>
    );
}
