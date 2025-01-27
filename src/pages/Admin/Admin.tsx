import { useState } from "react";
import s from "./Admin.module.css";

export const Admin = () => {
  const [file, setFile] = useState<File | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!file) {
      console.log("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "https://api.stepanplusdrawingultra.site/images",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        console.log("File uploaded successfully");
      } else {
        console.error("Upload failed");
      }
    } catch (error) {
      console.error("Error during file upload:", error);
    }
  }

  return (
    <div className={s.page}>
      <form
        method="post"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
        className={s.form}
      >
        <div>
          <label htmlFor="file">Choose file to upload</label>
          <input
            name="file"
            type="file"
            accept="image/jpeg"
            multiple
            onChange={handleFileChange}
          />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};
