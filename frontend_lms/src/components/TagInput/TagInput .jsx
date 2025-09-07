// src/components/TagInput.jsx
import React, { useState } from "react";
import "./TagInput.css";

const TagInput = ({ tags, setTags, maxTags = 6 }) => {
  const [inputValue, setInputValue] = useState("");


  const ab = ["5,5,5,5,55,5,5,56,6,6"]

  // const v = ab[0].split(",")
  // // const v2 = v?.split(",")
  // console.log(ab);
  // console.log(v);
  

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const addTag = (value) => {
    if (!value.trim()) return;
    const newTags = value
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    if (tags.length + newTags.length > maxTags) return;

    setTags([...tags, ...newTags]);
    setInputValue("");
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="tag-input-wrapper">
      
      {tags.length < maxTags && (
        <input
          type="text"
          value={inputValue}
          placeholder="Type and press Enter... Maximum 6 tags"
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      )}

      {tags.map((tag, index) => (
        <div key={index} className="tag-item">
          <p className="tagLine">{tag}</p>
          <button type="button" onClick={() => removeTag(index)}>×</button>
        </div>
      ))}
    </div>
  );
};

export default TagInput;
