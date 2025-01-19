import { useState } from "react";

export const Admin = () => {
  const [file, setFile] = useState<File | null>(null);

  // Обработчик изменения файла
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
    }
  }

  // Обработчик отправки формы
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!file) {
      console.log("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3300/upload", {
        method: "POST",
        body: formData,
      });

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
    <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
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
  );
};
