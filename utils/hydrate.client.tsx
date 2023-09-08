"use client";

import { Hydrate as RQHydrate, HydrateProps } from "react-query/hydration";

function Hydrate(props: HydrateProps) {
  return <RQHydrate {...props} />;
}

export default Hydrate;
