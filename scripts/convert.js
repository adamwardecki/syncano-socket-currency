var axios = require('axios');
var fx = require('money');
var connect = require('syncano-server').default;


const { data, event } = connect()

function response(code, content) {
  setResponse(new HttpResponse(code, JSON.stringify(content), 'application/json'));
  return process.exit();
}

function convert(from, to, amount) {
  // Calling Fixer API. Documentation can be found here: http://fixer.io/
  return axios.get('http://api.fixer.io/latest')
    .then((response) => {
  // Money.js https://openexchangerates.github.io/money.js/
      fx.rates = response.data.rates;
      fx.base = response.data.base;

      return fx(amount).from(from).to(to);
    })
    .catch((error) => {
      response(400, JSON.stringify(error));
    });
}

const { from, to, amount } = ARGS;

const fromError = `'${from}' value type for 'from' param is not valid. It should be a string.`
const toError = `'${to}' value type for 'to' param is not valid. It should be a string.`
const amountError = `'${amount}' value type is not valid. It should be a number.`

if (typeof from !== 'string') response(400, {"error": fromError});
if (typeof to !== 'string') response(400, {"error": toError});
if (typeof amount !== 'number') response(400, {"error": amountError});


convert(from, to, amount)
  .then(function(result) {
    // Line below uses Syncano data storage features
    // Log the conversion info in in the conversion_logs class for future reference
    data.conversion_logs.create({from, to, amount, result}).then(() => {
      const error = 'Please provide proper currency value (i.e. "USD").'
      if (typeof result !== 'number') response(400, {error});

      response(200, {result})
    });
  })
  .catch((error) => response(400, error));
