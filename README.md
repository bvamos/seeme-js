# seeme-js
JavaScript API client library for Seeme.hu SMS Gateway

## Usage

    npm i seeme-js

### JavaScript example

````
var SeeMeGatewayModule = require('seeme-js');

const options = {
  apiKey: 'YOUR_API_KEY'
};

try {
  const seeme = new SeeMeGatewayModule.SeeMeGateway(options);
  
  seeme.getBalance()
  .then((response) => console.log(response))
  .catch((error) => console.error(error.message));

  seeme.sendSMS(3630123456, 'Check out https://www.aprohirdetes.com/')
  .then((response) => console.log(response))
  .catch((error) => console.error(error.message));
} catch (e) {
  console.error(e);
}
````

### TypeScript example

````
import { SeeMeGateway, SeeMeGatewayOptions } from 'seeme-js';

const options: SeeMeGatewayOptions = {
  apiKey: 'YOUR_API_KEY'
};

try {
  const seeme = new SeeMeGateway(options);

  seeme.getBalance()
  .then((response) => console.log(response))
  .catch((error) => console.error(error.message));

  seeme.sendSMS('3630123456', 'Check out https://www.aprohirdetes.com/')
  .then((response) => console.log(response))
  .catch((error) => console.error(error.message));
} catch (e) {
  console.error(e);
}
````