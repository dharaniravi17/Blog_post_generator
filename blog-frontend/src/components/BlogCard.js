import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const BlogCard = ({ title, content }) => {
  const downloadPDF = async () => {
    const doc = new jsPDF();
    
    // Capture the blog content
    const blogElement = document.getElementById(`blog-${title}`);
    
    if (blogElement) {
      const canvas = await html2canvas(blogElement);
      const imgData = canvas.toDataURL("image/png");

      doc.addImage(imgData, "PNG", 10, 10, 180, 0); // Fit image into PDF
      doc.save(`${title}.pdf`);
    }
  };

  return (
    <div className="blog-card" id={`blog-${title}`}>
      <h2>{title}</h2>
      <p>{content}</p>
      <button className="download-btn" onClick={downloadPDF}>Download PDF</button>
    </div>
  );
};

export default BlogCard;
