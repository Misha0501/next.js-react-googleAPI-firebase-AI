'use client'
import {useRouter} from "next/navigation";
import {Button} from "@tremor/react";
import {ChevronLeftIcon} from "@heroicons/react/20/solid";

export const GoBackBtn = ({className}) => {
    const router = useRouter()
    return (
        <Button variant={'light'} className={className} icon={ChevronLeftIcon} onClick={() => router.back()}>
            Click here to go back
        </Button>
    )
};