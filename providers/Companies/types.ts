export namespace CompanyProvider {

  export type CreateMutation = {
    authToken?: string;
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
  }

  export type UpdateMutation = {
    authToken?: string;
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
  }

  export type ResponseError = {
    message?: string;
  }

}
