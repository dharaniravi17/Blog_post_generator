import React, { useState } from "react";

const BlogGenerator = () => {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [blog, setBlog] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateBlog = async () => {
    setLoading(true);
    setError("");
    setBlog("");

    try {
      const response = await fetch("http://127.0.0.1:5000/generate-blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          keywords: keywords.split(",").map((word) => word.trim()),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setBlog(data.blog);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

return (
    <div className="container">
        <h1 style={{color:"rgb(232, 229, 229)"}}>AI Blog Generator</h1>
        <input
            type="text"
            placeholder="Enter Blog Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
        />
        <input
            type="text"
            placeholder="Enter Keywords (comma-separated)"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
        />
        <button onClick={generateBlog} disabled={loading}>
            {loading ? "Generating..." : "Generate Blog"}
        </button>

        {error && <p className="error">{error}</p>}
        
        {blog && (
            <div className="blog-card">
                <h2>{topic}</h2>
                <p>{blog}</p>
            </div>
        )}
    </div>
);
};

export default BlogGenerator;
