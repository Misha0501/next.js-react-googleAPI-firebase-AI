"use client";

import { PlacePropertyForm } from "@/app/components/PlacePropertyForm";

function PlacePropertyPage() {
  return (
    <>
      <section className="py-16 md:py-32">
        <div className="container">
          <PlacePropertyForm />
        </div>
      </section>
    </>
  );
}

export default PlacePropertyPage;
