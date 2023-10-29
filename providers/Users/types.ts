import { Company, Listing, Membership } from "@/types";

export namespace ApplicationUserProvider {
  export type GetProps = {
    id?: number;
    authToken?: string | null;
  };

  export type UpdatePropsMutation = {
    authToken?: string;
    displayName?: string;
    phoneNumber?: string;
    newPassword?: string;
  };

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
