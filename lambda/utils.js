const randomBytes = require('crypto').randomBytes;

module.exports = {
  toUrlString: function() {
    const buffer = randomBytes(6);

    return buffer.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  },
  getCallbackConfig: function(err, res) {
    const statusCode = err ? 400 : 200;
    const body = err ? {error: err.message} : res;

    return {
      body: JSON.stringify(body),
      statusCode: statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }

    };
  }
};
