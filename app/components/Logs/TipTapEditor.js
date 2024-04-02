import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import styled from 'styled-components';

const TipTapEditor = ({ content, setContent }) => {
  const editor = useEditor({
    extensions: [
      StarterKit, // This includes the 'doc' node, paragraph, text, and other basic formatting options.
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
    },
  });

  if (!editor) {
    return <p>Loading...</p>;
  }

  return (
    <StyledEditor>
      <EditorContent editor={editor} />
    </StyledEditor>
  );
};

const StyledEditor = styled.div`
  .ProseMirror {
    padding: 10px;
    background: #fbfbfb;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.03);
    border-radius: 20px;
    height: 40vh;
    overflow-y: auto;
    border: 0.5px solid #ccc;
  }
`;

export default TipTapEditor;
