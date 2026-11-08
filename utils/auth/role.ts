export const extractAuthenticatedRole = (response: unknown): string | null => {
  if (response && typeof response === 'object' && !Array.isArray(response)) {
    const role = (response as { role?: unknown }).role
    return typeof role === 'string' && role.trim() ? role.trim().toLowerCase() : null
  }

  if (Array.isArray(response) && response.length === 1 && typeof response[0] === 'string') {
    return response[0].trim().toLowerCase() || null
  }

  return null
}
