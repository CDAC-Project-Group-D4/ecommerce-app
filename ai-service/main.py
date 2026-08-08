import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
from db import fetch_catalog_context

load_dotenv()

app = FastAPI(title="Database-Aware AI Shopping Assistant Microservice")

# Enable CORS for Spring Boot & Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_groq_client():
    api_key = os.getenv("GROQ_API_KEY", "")
    if api_key and not api_key.startswith("gsk_your"):
        try:
            return Groq(api_key=api_key)
        except Exception as err:
            print(f"Groq Client Init Warning: {err}")
            return None
    return None

class ChatRequest(BaseModel):
    query: str

@app.get("/")
def health_check():
    client = get_groq_client()
    return {"status": "AI Microservice is running!", "groq_configured": client is not None}

@app.post("/ai/chat")
async def chat_endpoint(request: ChatRequest):
    if not request.query or not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    # 1. Fetch live product catalog from MySQL
    catalog = fetch_catalog_context(request.query)

    # Fallback response if Groq API key is not configured yet
    client = get_groq_client()
    if not client:
        return {
            "reply": "Welcome to ApkaCart AI! (Groq API Key is not configured yet in .env file. Please add your free GROQ_API_KEY from https://console.groq.com to enable real-time LLM answers).",
            "products": catalog[:3]
        }

    # 2. Construct System Context Prompt for LLM
    system_prompt = f"""
    You are 'ApkaCart AI', a helpful and knowledgeable database-aware shopping assistant for our e-commerce platform.
    Your goal is to answer customer questions intelligently and recommend top products, brands (stores), and categories using ONLY the provided live catalog context below.

    LIVE PRODUCT CATALOG FROM DATABASE:
    {catalog}

    INSTRUCTIONS:
    1. If the user asks for product or brand recommendations, recommend matching items from the catalog.
    2. Include product name, brand/seller name, and price in ₹ (INR).
    3. Keep your response friendly, clear, concise, and structured.
    4. Do not invent products outside the catalog unless asked for general shopping advice.
    """

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.query}
            ],
            temperature=0.6,
            max_tokens=800
        )

        reply_text = completion.choices[0].message.content

        return {
            "reply": reply_text,
            "catalog_count": len(catalog)
        }
    except Exception as e:
        print(f"Groq API Error: {e}")
        raise HTTPException(status_code=500, detail=f"AI Service Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
