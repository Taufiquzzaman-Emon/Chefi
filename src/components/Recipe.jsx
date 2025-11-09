import React from "react";
import ReactMarkdown from "react-markdown";

export default function ClaudeRecipe({ ingredients }) {
  const [recipe, setRecipe] = React.useState(""); // AI-generated recipe
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!ingredients || ingredients.length === 0) return;

    async function fetchRecipe() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("http://localhost:5000/api/getRecipe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ingredients }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setRecipe(data.recipe);
      } catch (err) {
        console.error(err);
        setError("Failed to get recipe. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [ingredients]);

  if (loading) return <p>Fetching recipe...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="suggested-recipe-container">
      <h2>Suggested recipe:</h2>
      <ReactMarkdown>{recipe}</ReactMarkdown>
    </section>
  );
}
