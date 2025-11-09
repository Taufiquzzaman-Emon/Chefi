import express from "express";
import cors from "cors";
import OpenAI from "openai";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

// Initialize the OpenAI client with HF-compatible endpoint
const client = new OpenAI({
  apiKey: process.env.HUGGINGFACE, // your HF token
  baseURL: "https://router.huggingface.co/v1",
});

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user 
has and suggests a recipe they could make with some or all of those ingredients. 
You don't need to use every ingredient they mention in your recipe. 
The recipe can include additional ingredients they didn't mention, 
but try not to include too many extra ingredients. 
color the important things that need to be done in the recipe.
`;

app.post("/api/getRecipe", async (req, res) => {
  const { ingredients } = req.body;

  if (!ingredients || ingredients.length === 0) {
    return res.status(400).json({ error: "No ingredients provided" });
  }

  try {
    const prompt = `${SYSTEM_PROMPT}\nIngredients: ${ingredients.join(
      ", "
    )}\nPlease suggest a recipe:`;

    const completion = await client.chat.completions.create({
      model: "Qwen/Qwen2.5-7B-Instruct:together",
      messages: [{ role: "user", content: prompt }],
    });

    const recipe = completion.choices[0].message.content;
    res.json({ recipe });
  } catch (err) {
    console.error("Hugging Face/OpenAI API error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
