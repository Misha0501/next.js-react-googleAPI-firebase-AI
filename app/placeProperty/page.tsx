"use client";

import { PlacePropertyForm } from "@/app/components/PlacePropertyForm";

function PlacePropertyPage() {
  return (
    <>
      <section className="py-32">
        <div className="container">
          <PlacePropertyForm></PlacePropertyForm>
        </div>
      </section>
    </>
  );
}

export default PlacePropertyPage;
