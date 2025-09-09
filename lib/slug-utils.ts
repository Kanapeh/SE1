// Utility functions for creating and handling teacher slugs

/**
 * Creates a URL-friendly slug from teacher name
 * @param firstName - Teacher's first name
 * @param lastName - Teacher's last name
 * @param id - Teacher's ID (fallback for uniqueness)
 * @returns URL-friendly slug
 */
export function createTeacherSlug(firstName: string, lastName: string, id: string): string {
  // Simple approach: use name + last 4 characters of ID
  const nameSlug = `${firstName.toLowerCase()}-${lastName.toLowerCase()}`;
  const shortId = id.slice(-4);
  
  return `${nameSlug}-${shortId}`;
}

/**
 * Creates a simple teacher slug (just name, no ID)
 * @param firstName - Teacher's first name
 * @param lastName - Teacher's last name
 * @returns Simple slug
 */
export function createSimpleTeacherSlug(firstName: string, lastName: string): string {
  return `${firstName.toLowerCase()}-${lastName.toLowerCase()}`;
}

/**
 * Extracts teacher ID from slug
 * @param slug - The teacher slug
 * @returns Teacher ID or null if invalid
 */
export function extractTeacherIdFromSlug(slug: string): string | null {
  // Extract the last 4 characters (short ID) from slug
  const parts = slug.split('-');
  const shortId = parts[parts.length - 1];
  
  if (!shortId || shortId.length !== 4) {
    return null;
  }
  
  // This is a simplified approach - in a real app, you'd need to store the mapping
  // For now, we'll use the short ID as a fallback
  return shortId;
}

/**
 * Creates a teacher profile URL with slug
 * @param firstName - Teacher's first name
 * @param lastName - Teacher's last name
 * @param id - Teacher's ID
 * @param path - Additional path (e.g., 'book', 'chat')
 * @returns Complete URL with slug
 */
export function createTeacherUrl(firstName: string, lastName: string, id: string, path: string = ''): string {
  const slug = createTeacherSlug(firstName, lastName, id);
  const baseUrl = `/teachers/${slug}`;
  return path ? `${baseUrl}/${path}` : baseUrl;
}

/**
 * Alternative approach: Use a more readable format
 * @param firstName - Teacher's first name
 * @param lastName - Teacher's last name
 * @param id - Teacher's ID
 * @param path - Additional path
 * @returns Readable URL
 */
export function createReadableTeacherUrl(firstName: string, lastName: string, id: string, path: string = ''): string {
  // Use a more readable format: /teachers/name-lastname-id
  const readableSlug = `${firstName.toLowerCase()}-${lastName.toLowerCase()}-${id.slice(-6)}`;
  const baseUrl = `/teachers/${readableSlug}`;
  return path ? `${baseUrl}/${path}` : baseUrl;
}

/**
 * Even simpler approach: Use just the name
 * @param firstName - Teacher's first name
 * @param lastName - Teacher's last name
 * @param id - Teacher's ID
 * @param path - Additional path
 * @returns Simple URL
 */
export function createSimpleTeacherUrl(firstName: string, lastName: string, id: string, path: string = ''): string {
  // Use a simple format: /teachers/name-lastname
  const simpleSlug = `${firstName.toLowerCase()}-${lastName.toLowerCase()}`;
  const baseUrl = `/teachers/${simpleSlug}`;
  return path ? `${baseUrl}/${path}` : baseUrl;
}
