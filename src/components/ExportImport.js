import React from 'react';

function ExportImport({ onExport, onImport }) {
    const handleFileChange = (event) => {
        const fileReader = new FileReader();
        fileReader.readAsText(event.target.files[0], "UTF-8");
        fileReader.onload = e => {
            const notes = JSON.parse(e.target.result);
            onImport(notes);
        };
    };

    return (
        <div>
            <button onClick={onExport}>Eksporter Notater</button>
            <input type="file" onChange={handleFileChange} accept=".json" />
        </div>
    );
}

export default ExportImport;
