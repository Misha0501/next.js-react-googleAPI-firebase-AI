import { getFetchUrl } from "@/app/lib/getFetchUrl";

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
  body?: Record<string, unknown> | FormData | null;
  headers?: Record<string, string>;
  queryParams?: Record<string, string | number | boolean | null | undefined>;
  noAuth?: boolean;
  formData?: boolean;
  baseDomain?: string;
  parseJSON?: boolean;
}

async function service<T = unknown>(args: IAPArgs): Promise<T> {
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
    const { "Content-Type": _ct, ...rest } = props.headers;
    props.headers = rest;
  }

  let fetchUrl = baseDomain || getFetchUrl(url);

  if (queryParams) {
    const params = new URLSearchParams(
      Object.entries(queryParams)
        .filter(([, v]) => v != null)
        .map(([k, v]) => [k, String(v)]),
    );
    fetchUrl = `${fetchUrl}?${params.toString()}`;
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

  return parseJSON ? await data.json() : data;
}

export default service;
