import React, { useState } from 'react';

function NoteForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  const handleTagAdd = (event) => {
    if (event.key === 'Enter' && newTag.trim() !== '') {
      event.preventDefault();
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ title, content, tags, createdAt: new Date().toISOString(), modifiedAt: new Date().toISOString() });
    setTitle('');
    setContent('');
    setTags([]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Tittel"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Innhold"
        required
      />
      <div className="tags-input">
        {tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
          </span>
        ))}
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleTagAdd}
          placeholder="Legg til tag"
        />
      </div>
      <button type="submit">Lagre Notat</button>
    </form>
  );
}

export default NoteForm;
