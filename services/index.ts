import { getFetchUrl } from "@/app/lib/getFetchUrl";

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
  noAuth?: boolean;
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
    noAuth = false,
  } = args;

  const requestHeaders: Record<string, string> = {
    ...defaultHeaders,
    ...headers,
  };

  if (noAuth) {
    delete requestHeaders.Authorization;
  }

  if (formData) {
    delete requestHeaders["Content-Type"];
  }

  const props: RequestInit = {
    method,
    headers: requestHeaders,
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
    if (data.status === 422) {
      const json = await data.json();
      console.error(json);
      throw new Error("Something went wrong please try again later");
    }
    const errorMessage = await data.text();
    throw new Error(errorMessage);
  }

  return parseJSON ? await data.json() : data;
}

export default service;
