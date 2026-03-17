import { EditorContent, useEditor } from "@tiptap/react";
import styles from "./TextEditor.module.css";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import ResizeImage from "tiptap-extension-resize-image";
import axios from "axios";

const TextEditor = ({ data, setData }) => {
  const editor = useEditor({
    extensions: [StarterKit, Image, ResizeImage],
    content: data || "", //state세팅
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setData(editor.getHTML());
    },
  });
  return (
    <div className={styles.editor_wrap}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className={styles.editor_content} />
    </div>
  );
};

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }
  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*"; // image/* 작성하면 이미지 관련 파일만 올릴 수 있고 나머지는 올릴 수 없음
    input.click();

    input.onchange = () => {
      const file = input.files && input.files[0];
      console.log(file);
      if (!file) {
        return; //파일이 없을 때 리턴
      }
      //선택한 이미지를 백앤드 서버에 업로드하고, 파일 이름을 받아옴
      const form = new FormData();
      form.append("image", file);
      axios
        .post(`${import.meta.env.VITE_BACKSERVER}/boards/image-upload`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res);
          const imageUrl = `${import.meta.env.VITE_BACKSERVER}/editor/${res.data}`;
          editor.chain().setImage({ src: imageUrl }).run();
        })
        .catch((err) => {
          console.log(err);
        });
    };
  };
  return (
    <div className={styles.menu_bar}>
      <button
        type="button"
        className={editor.isActive("bold") ? styles.active : ""}
        onClick={() => {
          editor.chain().focus().toggleBold().run();
        }}
      >
        Bold
      </button>
      <button
        type="button"
        className={editor.isActive("italic") ? styles.active : ""}
        onClick={() => {
          editor.chain().focus().toggleItalic().run();
        }}
      >
        Italic
      </button>
      <button
        type="button"
        className={
          editor.isActive("heading", { level: 2 }) ? styles.active : ""
        }
        onClick={() => {
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        }}
      >
        H2
      </button>
      <button
        type="button"
        className={editor.isActive("bulletList") ? styles.active : ""}
        onClick={() => {
          editor.chain().focus().toggleBulletList().run();
        }}
      >
        BulletList
      </button>
      <button type="button" onClick={addImage}>
        Image
      </button>
    </div>
  );
};

export default TextEditor;
