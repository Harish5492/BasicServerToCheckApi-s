const express = require('express');
const app = express();
const port = 3000;

// app.get('/',(req,res)=>{
//     res.send("Hello, world!");
// })
const axios = require('axios');

let response = null;
new Promise(async (resolve, reject) => {
  try {
    response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/map', {
      headers: {
        'X-CMC_PRO_API_KEY': '47bbfced-ac0e-4803-8f7f-1bdbccd91b88',
      },
    });
  } catch(ex) {
    response = null;
    // error
    console.log(ex);
    reject(ex);
  }
  if (response) {
    // success
    const json = response.data;
    console.log(json);
    resolve(json);
  }
});

app.listen(port,()=>{
    console.log(`application is listening on ${port}`);
})