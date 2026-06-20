import { getFetchUrl } from "@/app/lib/getFetchUrl";
import { notifySessionExpired } from "@/app/lib/auth/notifySessionExpired";

interface IDefaultHeadersProps {
  medium: string;
  "Content-Type": string;
}

const defaultHeaders: IDefaultHeadersProps = {
  medium: "platform-web",
  "Content-Type": "application/json",
};

interface IAPArgs {
  url: string;
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  body?: Record<string, unknown> | FormData | null;
  headers?: Record<string, string>;
  queryParams?: Record<string, QueryParamValue> | null;
  formData?: boolean;
  baseDomain?: string;
  parseJSON?: boolean;
}

type QueryParamPrimitive = string | number | boolean;
type QueryParamValue =
  | QueryParamPrimitive
  | null
  | undefined
  | (QueryParamPrimitive | null | undefined)[];

const appendQueryParamValue = (
  params: URLSearchParams,
  key: string,
  value: QueryParamPrimitive | null | undefined,
) => {
  if (value == null || value === "") return;
  params.append(key, String(value));
};

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
  } = args;

  const requestHeaders: Record<string, string> = {
    ...defaultHeaders,
    ...headers,
  };

  if (formData) {
    delete requestHeaders["Content-Type"];
  }

  const props: RequestInit = {
    method,
    headers: requestHeaders,
    credentials: "include",
  };

  if (method !== "GET") {
    props.body = formData
      ? body instanceof FormData
        ? body
        : undefined
      : JSON.stringify(body ?? {});
  }

  let fetchUrl = baseDomain || getFetchUrl(url);

  if (queryParams) {
    const params = new URLSearchParams();

    Object.entries(queryParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => appendQueryParamValue(params, key, item));
        return;
      }

      appendQueryParamValue(params, key, value);
    });

    const queryString = params.toString();
    if (queryString) fetchUrl = `${fetchUrl}?${queryString}`;
  }

  const data = await fetch(fetchUrl, props);

  if (!data.ok) {
    if (data.status === 401) notifySessionExpired();
    const errorMessage = await data.text();
    throw new Error(
      errorMessage || "Something went wrong please try again later",
    );
  }

  return (parseJSON ? await data.json() : data) as T;
}

export default service;
