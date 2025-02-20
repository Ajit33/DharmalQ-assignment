# Project Name
AI Movie Character Chatbot 🎭

# Description
This backend project allows users to chat with famous movie characters. Based on the user’s message, it mimics the selected character’s speech style and provides a response. If an exact dialogue is not found in the database, the system generates a response that matches the character’s personality using Gemini AI.
#Demonstration
https://youtu.be/lJ7jjHLnac4

# Installation & Setup
Follow these steps to set up the project on your local machine.

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
Add your PostgreSQL Database URL and Gemini AI API Key
Example .env file:
DATABASE_URL=your_postgresql_database_url
GEMINI_API_KEY=your_google_gemini_api_key
```

## 4️⃣ Run Database Migrations
```
npx prisma migrate dev --name init
npx prisma generate
```
## 5️⃣ Seed the Database (Optional - Loads Predefined Dialogues
```
strat chroma db  
```
docker run -d -p 8000:8000 --name chroma ghcr.io/chroma-core/chroma:0.6.3 
```
```
start redis
```
```
 docker run -d --name redis-server -p 6379:6379 redis
```
npm run migrate
```

## 6️⃣ Start the Server
```
npm run dev
The server will start on http://localhost:3000
```

# API Endpoints
## 1️⃣ Chat with a Character
Endpoint:
POST /api/v1/chat
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
# Features
✅ Fast & Scalable Backend using Node.js + Express\
✅ Stores Real Movie Dialogues using PostgreSQL + Prisma\
✅ Mimics Character Speech Styles\
✅ Uses Gemini AI for Fallback Responses\
✅ RESTful API for Seamless Integration\

# Technologies Used
Node.js - Backend Framework\
Express.js - API Handling\
PostgreSQL - Database\
Prisma ORM - Database Management\
ChromaDB  -Vector Database\
Google Gemini AI - Character Response Gener\
