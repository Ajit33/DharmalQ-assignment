# Project Name
AI Movie Character Chatbot 🎭

# Description
This backend project allows users to chat with famous movie characters. Based on the user’s message, it mimics the selected character’s speech style and provides a response. If an exact dialogue is not found in the database, the system generates a response that matches the character’s personality using Gemini AI.
# Demonstration
[![Watch the video](https://img.youtube.com/vi/lJ7jjHLnac4/maxresdefault.jpg)](https://youtu.be/lJ7jjHLnac4)

### [Watch this video on YouTube](https://youtu.be/lJ7jjHLnac4)
[![Watch the video](https://img.youtube.com/vi/6_Xy9eXt54c/maxresdefault.jpg)](https://youtu.be/6_Xy9eXt54c)

### [Watch this video on YouTube](https://youtu.be/6_Xy9eXt54c)

Follow these steps to set up the project on your local machine.
[![Watch the video](https://img.youtube.com/vi/ms3O_h2cwnI/maxresdefault.jpg)](https://youtu.be/ms3O_h2cwnI)

### [Watch this video on YouTube](https://youtu.be/ms3O_h2cwnI)
[![Watch the video](https://img.youtube.com/vi/ibi-T6dODew/maxresdefault.jpg)](https://youtu.be/ibi-T6dODew)

### [Watch this video on YouTube](https://youtu.be/ibi-T6dODew)
[![Watch the video](https://img.youtube.com/vi/rCeU68dVknY/maxresdefault.jpg)](https://youtu.be/rCeU68dVknY)

### [Watch this video on YouTube](https://youtu.be/rCeU68dVknY)

# Installation & Setup
## 1️⃣ Clone the Repository
```
git clone https://github.com/Ajit33/DharmalQ-assignment.git
cd DharmalQ-assignment
 ```

 ## 2️⃣ Install Dependencies
```
npm install
```

## 3️⃣ Configure Environment Variables
```
Copy .env.example to .env
and modify them

```

## 4️⃣ Run Database Migrations
```
npx prisma migrate dev --name init
npx prisma generate
```
## 5️⃣ Strat required servce with docker
```
# Start ChromaDB
docker run -d -p 8000:8000 --name chromadb ghcr.io/chroma-core/chroma:0.6.3

# Start Redis
docker run -d --name redis-server -p 6379:6379 redis

# Start Prometheus
docker run -d --name prometheus -p 9090:9090 prom/prometheus

# Start Grafana
docker run -d --name grafana -p 3000:3000 grafana/grafana 
```

```

npm run migrate
```

## 6️⃣ seed the Databse and start the server
```
# seed to postgres
 npm run seed
#seed to chroma
npm run seed-chroma
#npm run dev
The server will start on http://localhost:3000
```

# API Endpoints
## 1️⃣ Chat with a Character
Endpoint:
ws://localhost:5000/api/v1/chat
Request Body:
```
json
{
  "character": "Darth Vader",
  "user_message": "Are you my father?"
}
```
```
Response (From Database):

{
  "response": "I am your father."
}
```
```
Response (Generated by AI if no match is found):

{
  "response": "Join me, and together we can rule the galaxy!"
}
```
# Run with Docker
```
docker-compose up --build
```
# Features
✅ Fast & Scalable Backend using Node.js + Express\
✅ Stores Real Movie Dialogues using PostgreSQL + Prisma\
✅ Mimics Character Speech Styles\
✅ Uses Gemini AI for Fallback Responses\
✅ RESTful API for Seamless Integration\

# Technologies Used
Express.js - API Handling

PostgreSQL - Database

Prisma ORM - Database Management

ChromaDB - Vector Database

Google Gemini AI - Character Response Generation

Redis - Caching and Queue Management

Prometheus & Grafana - Metrics and Monitoring

K6 - Load test
