import React, { useState } from 'react';

function NoteForm({ onSubmit }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit({ title, content, tags, createdAt: new Date().toISOString(), modifiedAt: new Date().toISOString() });
        setTitle('');
        setContent('');
        setTags('');
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
            <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Tags (separert med komma)"
            />
            <button type="submit">Lagre Notat</button>
        </form>
    );
}

export default NoteForm;
