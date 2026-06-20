export namespace CompanyProvider {
  export type CreateMutation = {
    name: string;
    email: string;
    phoneNumber: string;
    description: string;
    address: {
      locality: string;
      route: string;
      streetNumber: string;
      administrativeArea: string;
      postalCode: string;
      latitude: string;
      longitude: string;
    };
  };

  export type UpdateMutation = {
    name: string;
    email: string;
    phoneNumber: string;
    description: string;
    address: {
      locality: string;
      route: string;
      streetNumber: string;
      administrativeArea: string;
      postalCode: string;
      latitude: string;
      longitude: string;
    };
  };

  export type ResponseError = {
    message?: string;
  };
}
