import http from "k6/http";
import { sleep } from "k6";

export let options = {
  stages: [
    { duration: "10s", target: 1000 }, 
    { duration: "30s", target: 1000 }, 
    { duration: "10s", target: 0 },   
  ],
};

export default function () {
  let url = "http://host.docker.internal:3000/api/v1/chat"; 
  let payload = JSON.stringify({
    character: "Iron Man",
    user_message: "What is your suit made of?",
  });

  let params = { headers: { "Content-Type": "application/json" } };

  http.post(url, payload, params);
  sleep(1);
}

//docker run --rm --network host -i grafana/k6 run - < src/test/loadTest.js