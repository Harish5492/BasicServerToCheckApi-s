const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;
const symbol = 'ETH';

const getCryptoId = async (symbol) => {
  try {
    console.log('Making API request...');
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/map', {
      headers: {
        'X-CMC_PRO_API_KEY': '47bbfced-ac0e-4803-8f7f-1bdbccd91b88',
      },
    });

    console.log('API response received');
    const data = response.data;
    if (data && data.data) {
      console.log(`Data received from API: ${JSON.stringify(data.data)}`);
      const crypto = data.data.find((item) => item.symbol === symbol);
      if (crypto) {
        console.log(`Found cryptocurrency: ${JSON.stringify(crypto)}`);
        return crypto.id;
      } else {
        console.log(`Cryptocurrency with symbol ${symbol} not found.`);
        return null;
      }
    } else {
      console.log('No data found in the API response.');
      return null;
    }
  } catch (ex) {
    console.log(`Error fetching data from API: ${ex}`);
    return null;
  }
};

app.get('/', async (req, res) => {
  console.log('Received request on /');
  const cryptoId = await getCryptoId(symbol);
  if (cryptoId) {
    res.send(`The ID of the cryptocurrency with symbol ${symbol} is ${cryptoId}.`);
  } else {
    res.send(`Could not find the cryptocurrency with symbol ${symbol}.`);
  }
});

app.listen(port, () => {
  console.log(`Application is listening on port ${port}`);
});
