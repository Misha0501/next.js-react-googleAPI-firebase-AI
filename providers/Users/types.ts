import { ApplicationUser, Company, Listing, Membership } from "@/types";
import * as z from "zod";

export namespace ApplicationUserProvider {

  export type GetProps = {
    id?: number;
    authToken?: string | null;
  };

  export type UpdateProps = {
    data: ApplicationUser & { authToken: string };
    authToken?: string;
  }

  export type UpdatePropsMutation = {
    authToken?: string;
    displayName?: string,
    phoneNumber?: string,
    newPassword?: string,
  }

  export interface GetAPIPayload extends GetProps {
    authToken?: string;
  }
  export interface DetailResponse {
    id: number;
    email: string;
    displayName: string;
    phoneNumber: string;
    Membership: Membership[];
    createdAt: string;
    Company?: Company;
    Listing?: Listing[];
  }
}
