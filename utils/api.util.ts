/**
 * Builds URLSearchParams from an object of parameters
 * @param params - Object containing key-value pairs for query parameters
 * @returns URLSearchParams object with all defined parameters
 */
export function buildSearchParams(
  params?: Record<string, string | number | boolean | undefined | null | any>
): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (!params) {
    return searchParams;
  }

  Object.entries(params).forEach(([key, value]) => {
    // Skip undefined and null values
    if (value === undefined || value === null) {
      return;
    }

    // Convert value to string and append
    searchParams.append(key, value.toString());
  });

  return searchParams;
}

/**
 * Builds a complete URL with query parameters
 * @param baseUrl - Base URL without query string
 * @param params - Object containing key-value pairs for query parameters
 * @returns Complete URL with query string
 */
export function buildUrlWithParams(
  baseUrl: string,
  params?: Record<string, string | number | boolean | undefined | null | any>
): string {
  const searchParams = buildSearchParams(params);
  const queryString = searchParams.toString();

  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}
