export function removeEmpty(obj) {
  Object.entries(obj).forEach(([key, val]) => {
    if (_.isEmpty(val) || val.length === 0 || val === null) {
      delete obj[key];
      removeEmpty(obj);
    } else if (typeof val === 'object') {
      removeEmpty(val);
    }
  });

  return obj;
}

export function sendResponse(self, data, code) {
  let request = self.request;
  let response = self.response;

  if (typeof code === 'number')
    response.statusCode = code;

  response.setHeader('access-control-allow-origin', '*');
  response.setHeader('content-type', 'application/json');

  data = omitFields(data, ['_id']);

  if (response.statusCode === 400) {
    data.status = data.status || 'error';
  } else if (response.statusCode === 200) {
    data.status = data.status || 'success';
  } else {
    data.status = data.status || 'process';
  }

  response.end(JSON.stringify(data));
}

export function omitFields(data, fields) {
  if (typeof fields === 'string')
    fields = [fields];

  _.each(fields, function(field) {
    _.each(data, function(value, key) {
      if (key === field) {
        delete data[key]
      } else if (_.isObject(value)) {
        omitFields(value, field);
      } else if (_.isArray(value)) {
        _.each(value, function(v) {
          omitFields(v, field);
        });
      }
    });
  });

  return data;
}

export function setOptionsHeaders(response) {
  response.setHeader('access-control-allow-origin', '*');
  response.setHeader('content-type', 'application/json');
  response.setHeader('access-control-allow-headers', 'Authorization, Content-Type, Whodis-User');
  response.end();
}

export function createAuthCode() {
  return Math.floor(Random.fraction(6) * 1000000);
}