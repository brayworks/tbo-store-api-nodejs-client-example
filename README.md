
This project shows an example usage of the Basket Online API.

Refer to [API Docs](https://developers.basket.online) for more information.

An example flow in [./src/index.js]: 
- fetch a store by name
- create product in the store
- fetch product by product id
- upload image to the product

# Prerequisites

- npm >= 6.x
- nodejs >= v12.x

# Install

```bash
npm install
```

# Run
Update authentication config in [./src/client.js]
- `userPoolId`
- `identityPoolId`
- `userPoolWebClientId`


```bash
npm run start
```

