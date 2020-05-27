var SeeMeGatewayModule = require('../dist/index');

const options = {
  apiKey: ''
};

try {
  const seeme = new SeeMeGatewayModule.SeeMeGateway(options);
  
  /*seeme.setIP('1')
  .then((response) => console.log(response))
  .catch((error) => console.error(error.message));*/

  seeme.getBalance()
  .then((response) => console.log(response))
  .catch((error) => console.error(error.message));

  /*seeme.sendSMS('1', 'Hello!?!?')
  .then((response) => console.log(response))
  .catch((error) => console.error(error.message));*/
} catch (e) {
  console.error(e);
}

