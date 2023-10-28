"use client";
import Link from "next/link";
import { Button } from "@tremor/react";

export default function NotFound() {

  return (
    <div className={"container"}>
      <div className="py-32 text-center">
        <h2 className={"text-2xl mb-8"}>Oops we could not find the property you are looking for...</h2>
        <Link href="/listings">
          <Button>View all listings</Button>
        </Link>
      </div>
    </div>
  );
}
