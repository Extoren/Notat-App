import React, { Component } from 'react';

class NoteForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            content: '',
            tags: [],
            newTag: ''
        };
    }

    handleTagAdd = (event) => {
        const { newTag, tags } = this.state;
        if (event.key === 'Enter' && newTag.trim() !== '') {
            event.preventDefault();
            this.setState({
                tags: [...tags, newTag.trim()],
                newTag: ''
            });
        }
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const { title, content, tags } = this.state;
        this.props.onSubmit({
            title,
            content,
            tags,
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString()
        });
        this.setState({
            title: '',
            content: '',
            tags: []
        });
    };

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    render() {
        const { title, content, tags, newTag } = this.state;
        return (
            <form onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={this.handleChange}
                    placeholder="Tittel"
                    required
                />
                <textarea
                    name="content"
                    value={content}
                    onChange={this.handleChange}
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
                        onChange={(e) => this.setState({newTag: e.target.value})}
                        onKeyDown={this.handleTagAdd}
                        placeholder="Legg til tag"
                    />
                </div>
                <button type="submit">Lagre Notat</button>
            </form>
        );
    }
}

export default NoteForm;
