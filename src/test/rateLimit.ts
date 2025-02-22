import { Response } from "express";

const axios = require('axios');
let data = JSON.stringify({
  "character": "salman khan",
  "user_message": "who are you?"
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'http://localhost:5000/api/v1/chat',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};
  for(let i=0;i<10;i++){
    axios.request(config)
    .then((response:any) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error:any) => {
      console.log(error);
    });
  }
