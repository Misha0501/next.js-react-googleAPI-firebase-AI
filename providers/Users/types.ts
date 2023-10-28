import { ApplicationUser, Company, Listing, Membership } from "@/types";

export namespace ApplicationUserProvider {

  export type GetProps = {
    id?: number;
  };

  export type UpdateProps = {
    data: ApplicationUser & { authToken: string };
    authToken?: string;
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
