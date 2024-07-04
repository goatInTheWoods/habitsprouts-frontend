import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import styled from 'styled-components';

const TipTapEditor = ({
  content,
  setContent
}: $TSFixMe) => {
  const editor = useEditor({
    extensions: [
      StarterKit, // This includes the 'doc' node, paragraph, text, and other basic formatting options.
    ],
    content: content,
    onCreate: ({
      editor
    }: $TSFixMe) => {
      editor.commands.setContent(content);
    },
    onUpdate: ({
      editor
    }: $TSFixMe) => {
      const html = editor.getHTML();
      setContent(html);
    },
  });

  useEffect(() => {
    if (editor && content) {
      if (editor.getHTML() !== content) {
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

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
