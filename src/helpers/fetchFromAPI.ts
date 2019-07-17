export type ErrorResult = {
  isError: true;
  errorMessage: string;
  status: number | undefined;
  data: unknown;
};

export type DataResult = {
  isError: false;
  data: ObjectOf<unknown>;
};

export type FetchResult = ErrorResult | DataResult;

type Options = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: ObjectOf<string>;
  body?: ObjectOf<unknown>;
};

let defaultOptions: Options = {};

async function fetchFromAPI(
  path: string,
  options: Options = defaultOptions,
): Promise<FetchResult> {
  let headers: ObjectOf<string> = {
    Accept: 'application/json',
    ...options.headers,
  };
  let body: string | undefined;
  let method = options.method || 'GET';
  if (options.body != null) {
    headers['Content-Type'] = 'application/json; charset=utf-8';
    body = JSON.stringify(options.body);
    method = options.method || 'POST';
  }
  let response: Response;
  try {
    response = await fetch(`https://demo-api.huxapp.com${path}`, {
      method,
      headers,
      body,
    });
  } catch (e) {
    return error(`Network error: ${e.message}`);
  }
  if (!response.ok) {
    let { status } = response;
    return error(`Unexpected response status: ${status}`, status);
  }
  let contentType: string | null = response.headers.get('Content-Type');
  if (!isJSON(contentType)) {
    return error(`Unexpected response type: ${contentType}`);
  }
  let data: unknown;
  try {
    data = await response.json();
  } catch (e) {
    return error(`Error parsing response JSON: ${e.message}`);
  }
  if (data != null && typeof data === 'object' && !Array.isArray(data)) {
    return { isError: false, data: data as any };
  } else {
    return { isError: false, data: { '': data } };
  }
}

export function isJSON(contentType: string | null): boolean {
  return (
    typeof contentType === 'string' &&
    contentType.split(';')[0].toLowerCase() === 'application/json'
  );
}

export function error(
  errorMessage: string,
  status?: number,
  data?: unknown,
): ErrorResult {
  return {
    isError: true,
    errorMessage,
    status,
    data,
  };
}

export default fetchFromAPI;
