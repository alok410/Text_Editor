import React from 'react';

const Toolbar = ({ editor, darkMode, toggleDarkMode }) => {
  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL', previousUrl || '');

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().setLink({ href: url }).run();
  };

  const buttons = [
    { label: 'Bold', action: () => editor.chain().focus().toggleBold().run(), isActive: () => editor.isActive('bold') },
    { label: 'Italic', action: () => editor.chain().focus().toggleItalic().run(), isActive: () => editor.isActive('italic') },
    { label: 'Underline', action: () => editor.chain().focus().toggleUnderline().run(), isActive: () => editor.isActive('underline') },
    { label: 'H1', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), isActive: () => editor.isActive('heading', { level: 1 }) },
    { label: 'H2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: () => editor.isActive('heading', { level: 2 }) },
    { label: 'Bullet List', action: () => editor.chain().focus().toggleBulletList().run() },
    { label: 'Numbered List', action: () => editor.chain().focus().toggleOrderedList().run() },
    { label: 'Code Block', action: () => editor.chain().focus().toggleCodeBlock().run() },
    { label: 'Quote', action: () => editor.chain().focus().toggleBlockquote().run() },
    { label: 'HR', action: () => editor.chain().focus().setHorizontalRule().run() },
    { label: 'Undo', action: () => editor.chain().focus().undo().run() },
    { label: 'Redo', action: () => editor.chain().focus().redo().run() },
    { label: 'Link', action: setLink },
    { label: 'Unlink', action: () => editor.chain().focus().unsetLink().run() },
  ];

  return (
    <div className="toolbar">
      {buttons.map(({ label, action, isActive }) => (
        <button
          key={label}
          onClick={action}
          className={isActive?.() ? 'active' : ''}
        >
          {label}
        </button>
      ))}

      <button onClick={toggleDarkMode}>
        {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
      </button>
    </div>
  );
};

export default Toolbar;
