import { useAuthContext } from "@/app/context/AuthContext";
import omit from "lodash/omit";
import qs from "query-string";
import { getFetchUrl } from "@/app/lib/getFetchUrl";

// const API_URL = PUBLIC_API_URL;
// const API_URL = "http://localhost:3000";

interface IDefaultHeadersProps {
  medium: string;
  "Content-Type": string;
  Authorization?: string;
}

const defaultHeaders: IDefaultHeadersProps = {
  medium: "platform-web",
  "Content-Type": "application/json"
};

export function setAuthenticationHeader(token: string): void {
  defaultHeaders.Authorization = `Bearer ${token}`;
}

export function getAuthenticationToken(): string | undefined {
  return defaultHeaders?.Authorization;
}

export function removeAuthenticationHeader(): void {
  delete defaultHeaders.Authorization;
}

interface IAPArgs {
  url: string;
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  body?: any;
  headers?: any;
  queryParams?: Record<string, any>;
  noAuth?: boolean;
  formData?: boolean;
  baseDomain?: string;
  parseJSON?: boolean;
}

async function service(args: IAPArgs): Promise<any> {
  const {
    url,
    method = "GET",
    body = {},
    headers = {},
    queryParams = null,
    formData = false,
    baseDomain,
    parseJSON = true,
    ...extraProps
  } = args;

  const props = {
    body,
    method,
    headers: { ...defaultHeaders, ...headers },
    ...extraProps
  };

  if (method === "GET") {
    props.body = null;
  }

  if (!formData && method !== "GET") {
    props.body = JSON.stringify(body);
  }

  if (extraProps.noAuth) {
    delete props.headers.Authorization;
  }
  if (formData) {
    props.headers = omit(props.headers, ["Content-Type"]);
  }

  let fetchUrl = baseDomain || getFetchUrl(url);
    // `https://${baseDomain || process.env.API_URL || process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL}${url}`;

  if (queryParams) {
    fetchUrl = `${fetchUrl}?${qs.stringify(queryParams)}`;
  }

  const data = await fetch(fetchUrl, props);

  if (!data.ok) {
    if (data.status === 422) {
      const json = await data.json()
      console.error(json);
      throw new Error("Something went wrong please try again later");
    }
    const errorMessage = await data.text();
    throw new Error(errorMessage);
  }
  // logSuccess(API_URL, JSON.stringify(data));
  return parseJSON ? await data.json() : data;
}

export default service;
