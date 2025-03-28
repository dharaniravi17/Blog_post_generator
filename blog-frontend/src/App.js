import './App.css';
import React, { useState } from "react";
import BlogCard from "./components/BlogCard";

function App() {
  const [blogs, setBlogs] = useState([]);
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateBlog = async () => {
    if (!topic.trim() || !keywords.trim()) {
      setError("Please enter both topic and keywords.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5000/generate-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, keywords: keywords.split(",").map(k => k.trim()) }),
      });

      const data = await response.json();

      if (response.ok) {
        setBlogs([{ title: topic, content: data.blog }, ...blogs]); // Newest blogs first
        setTopic("");
        setKeywords("");
      } else {
        setError(data.error || "Failed to generate blog.");
      }
    } catch (err) {
      setError("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1 style={{color:"white"}}>AI Blog Writer</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Keywords (comma separated)"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
        <button onClick={generateBlog} disabled={loading}>
          {loading ? "Generating..." : "Generate Blog"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="blog-container">
        {blogs.map((blog, index) => (
          <BlogCard key={index} title={blog.title} content={blog.content} />
        ))}
      </div>
    </div>
  );
}

export default App;
