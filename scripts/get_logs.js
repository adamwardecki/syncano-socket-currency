var connect = require('syncano-server').default;

const { data } = connect()

data.conversion_logs
  .list()
  .then((data) => {
    setResponse(new HttpResponse(200, JSON.stringify(data), 'application/json'));
  })
  .catch((error) => {
    setResponse(new HttpResponse(400, JSON.stringify(error), 'application/json'));
  });
