import React from 'react';

function NoteList({ notes }) {
    return (
        <div>
            <h2>Notater</h2>
            {notes.map(note => (
                <div key={note.id}>
                    <h3>{note.title}</h3>
                    <p>{note.content}</p>
                    <small>Tags: {note.tags}</small>
                    <br/>
                    <small>Opprettet: {note.createdAt}</small>
                    <br/>
                    <small>Sist endret: {note.modifiedAt}</small>
                </div>
            ))}
        </div>
    );
}

export default NoteList;
