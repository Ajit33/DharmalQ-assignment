import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

async function testChroma() {
  try {
    console.log(" Connecting to ChromaDB at:", process.env.CHROMA_DB_PATH);

    //  Axios automatically parses JSON, so no need for res.json()
    const res = await axios.get(`${process.env.CHROMA_DB_PATH}/api/v1`);

    console.log(" ChromaDB Response:", res.data);
  } catch (err: any) {
    console.error(" Cannot connect to ChromaDB:", err.message);
  }
}

testChroma();

