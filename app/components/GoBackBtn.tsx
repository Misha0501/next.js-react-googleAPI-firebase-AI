'use client'
import {useRouter} from "next/navigation";
import {Button} from "@tremor/react";
import {ChevronLeftIcon} from "@heroicons/react/20/solid";

interface GoBackBtnProps {
    className?:string,
    label?:string
}

export const GoBackBtn = ({className,label='Click here to go back'}:GoBackBtnProps) => {
    const router = useRouter()
    return (
        <Button variant={'light'} className={className} icon={ChevronLeftIcon} onClick={() => router.back()}>
            {label}
        </Button>
    )
};