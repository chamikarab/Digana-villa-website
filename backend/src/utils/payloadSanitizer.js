export function sanitizeAdminPayload(payload = {}, allowedFields = []) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return {};
  }

  const sanitized = {};

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      sanitized[field] = payload[field];
    }
  }

  return sanitized;
}
