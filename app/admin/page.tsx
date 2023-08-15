'use client'
import {useEffect} from "react";
import {useAuthContext} from "@/app/context/AuthContext";
import {useRouter} from "next/navigation";

export default function Page () {
    const {user} = useAuthContext()
    const router = useRouter()

    useEffect(() => {
        if (user == null) router.push("/")
    }, [user, router])

    return (
        <div>
            <p>This is an example of client side auth check</p>
            <h1>Only logged in users can view this page {JSON.stringify(user)}</h1>
        </div>);
}
