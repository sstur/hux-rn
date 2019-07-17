type Method = 'PUT' | 'POST';

type File = {
  uri: string;
  name: string;
  type: string;
};
import { FetchResult, isJSON, error } from './fetchFromAPI';

export default async function sendFile(
  method: Method = 'POST',
  url: string,
  fields: ObjectOf<string>,
  files: ObjectOf<File>,
): Promise<FetchResult> {
  let formData = new FormData();

  for (let [field, value] of Object.entries(fields)) {
    formData.append(field, value);
  }

  for (let [field, file] of Object.entries(files)) {
    formData.append(field, file as any);
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  } catch (e) {
    return error(`Network error: ${e.message}`);
  }
  let contentType: string | null = response.headers.get('Content-Type');
  let data: unknown;
  let errorParsingJSON: string | undefined;
  if (isJSON(contentType)) {
    try {
      data = await response.json();
    } catch (e) {
      errorParsingJSON = e.message;
    }
  }
  if (!response.ok) {
    let { status } = response;
    return error(`Unexpected response status: ${status}`, status, data);
  }
  if (!isJSON(contentType)) {
    return error(`Unexpected response type: ${contentType}`);
  }
  if (errorParsingJSON) {
    return error(`Error parsing response JSON: ${errorParsingJSON}`);
  }
  if (data != null && typeof data === 'object' && !Array.isArray(data)) {
    return { isError: false, data: data as any };
  } else {
    return { isError: false, data: { '': data } };
  }
}
