const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString().split('T')[0]; // YYYY-MM-DD format
};

const validateUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, '');
};

const parseQueryParams = (query) => {
  const params = {};

  if (query.status) {
    params.status = query.status;
  }

  if (query.priority) {
    params.priority = query.priority;
  }

  if (query.search) {
    params.search = sanitizeString(query.search);
  }

  return params;
};

module.exports = {
  formatDate,
  validateUUID,
  sanitizeString,
  parseQueryParams
};