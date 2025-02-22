import ws from "k6/ws";
import { check, sleep } from "k6";

export let options = {
  stages: [
    { duration: "10s", target: 10 }, 
    { duration: "30s", target: 10 }, 
    { duration: "10s", target: 0 },  
  ],
};

export default function () {
  let url = "ws://host.docker.internal:3000"; 

  let res = ws.connect(url, function (socket) {
    socket.on("open", function () {
      console.log("🔗 Connected to WebSocket server");

      // Send message with userId
      socket.send(JSON.stringify({
        userId: "test-user-123", 
        character: "Iron Man",
        user_message: "What is your suit made of?",
      }));
    });

    // Listen for response
    socket.on("message", function (data) {
      console.log(`📩 Received: ${data}`);
      check(data, {
        "Valid response received": (msg) => msg && msg.length > 0 && JSON.parse(msg).response,
      });
    });

    // Handle errors
    socket.on("error", function (err) {
      console.error(" WebSocket error:", err);
    });

    socket.on("close", function () {
      console.log("🔌 Connection closed");
    });

    sleep(1); // Simulate real-world delay
  });

  check(res, { "WebSocket connected": (r) => r && r.status === 101 });
}


//docker run --rm --network host -i grafana/k6 run - < src/test/loadTest.js