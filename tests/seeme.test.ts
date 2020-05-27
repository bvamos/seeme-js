import { SeeMeGateway, SeeMeGatewayOptions } from '../src';

const options: SeeMeGatewayOptions = {
  apiKey: ''
};

try {
  const seeme = new SeeMeGateway(options);

  /*seeme.setIP('')
  .then((response) => console.log(response))
  .catch((error) => console.error(error.message));*/

  seeme.getBalance()
  .then((response) => console.log(response))
  .catch((error) => console.error(error.message));

  seeme.sendSMS(1, 'Hello!?!?')
  .then((response) => console.log(response))
  .catch((error) => console.error(error.message));
} catch (e) {
  console.error(e);
}
