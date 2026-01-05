/**
 * Contact form configuration
 */

// API endpoint for contact form
export const CONTACT_ENDPOINT = 'https://api.lightside.media/api/apps-script?id=AKfycbxWF7_78oTze8ybJ_R74fQgXut6RAiYLB3eJY3yqbXFlyHokb9m3ZqNi4ABmHWCxVa4';

/**
 * Submit contact form
 * @param {Object} data - Form data
 * @param {string} data.name
 * @param {string} data.email
 * @param {string} data.subject
 * @param {string} data.message
 * @returns {Promise<boolean>} - Success status
 */
export async function submitContactForm({ name, email, subject, message }) {
  const fd = new FormData();
  fd.set('name', name);
  fd.set('email', email);
  fd.set('subject', subject || 'Website contact');
  fd.set('message', message);

  const resp = await fetch(CONTACT_ENDPOINT, {
    method: 'POST',
    body: fd,
  });

  const contentType = resp.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    const json = await resp.json();
    return !!json.ok;
  }

  return resp.ok;
}
