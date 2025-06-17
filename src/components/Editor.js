import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Toolbar from './Toolbar';

const TiptapEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Placeholder.configure({
        placeholder: 'Write your text here...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: '',
  });

  const [html, setHtml] = useState('');
  const [json, setJson] = useState('');
  const [showDelete, setShowDelete] = useState(false);

  const exportContent = () => {
    if (!editor) return;
    setHtml(editor.getHTML());
    setJson(JSON.stringify(editor.getJSON(), null, 2));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const reader = new FileReader();
    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result }).run();
    };
    reader.readAsDataURL(file);
  };

  const deleteSelectedImage = () => {
    editor?.chain().focus().deleteSelection().run();
    setShowDelete(false);
  };

  useEffect(() => {
    if (!editor) return;

    const updateSelection = () => {
      const { from, to } = editor.state.selection;
      let imageSelected = false;

      editor.state.doc.nodesBetween(from, to, (node) => {
        if (node.type.name === 'image') {
          imageSelected = true;
        }
      });

      setShowDelete(imageSelected);
    };

    editor.on('selectionUpdate', updateSelection);
    return () => editor.off('selectionUpdate', updateSelection);
  }, [editor]);

  return (
    <div>
      <Toolbar editor={editor} />

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ marginTop: '10px' }}
      />

      <div
        className="editor-container"
        style={{
          border: '2px solid black',
          borderRadius: '5px',
          overflow: 'auto',
          height: '300px',
          padding: '10px',
          marginTop: '10px',
          position: 'relative',
        }}
      >
        {showDelete && (
          <button
            onClick={deleteSelectedImage}
            style={{
              position: 'absolute',
              top: 5,
              right: 5,
              padding: '5px 10px',
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              zIndex: 10,
            }}
          >
            Remove Image
          </button>
        )}

        <EditorContent editor={editor} />
      </div>

      <button onClick={exportContent} style={{ marginTop: '10px' }}>
        Export Content
      </button>

      <div className="output-section" style={{ marginTop: '20px' }}>
        <h4>HTML Output:</h4>
        <pre>{html}</pre>

        <h4>JSON Output:</h4>
        <pre>{json}</pre>
      </div>
    </div>
  );
};

export default TiptapEditor;
