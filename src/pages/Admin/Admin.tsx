import { useState } from "react";
import s from "./Admin.module.css";

export const Admin = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");
  const [message, setMessage] = useState<string>("");

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
      setStatus("loading");
      setMessage("");

      const response = await fetch(
        "https://api.stepanplusdrawingultra.site/images",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        setFile(null); // Очистить инпут после успешной загрузки
        setStatus("success");
        setMessage("File uploaded successfully!");
      } else {
        setFile(null);
        setStatus("error");
        setMessage("Failed to upload file. Please try again.");
      }
    } catch (error) {
      console.error("Error during file upload:", error);
      setStatus("error");
      setMessage("An error occurred during the upload.");
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
        <div className={s.inputContainer}>
          <label className={s.label} htmlFor="file">
            Choose file to upload:
          </label>
          <input
            className={s.input}
            name="file"
            type="file"
            accept="image/jpeg"
            multiple
            onChange={handleFileChange}
            disabled={status === "loading"} // Отключить инпут во время загрузки
          />
        </div>

        <button
          className={s.button}
          type="submit"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Uploading..." : "Upload"}
        </button>
        {status === "success" && <p className={s.statusSuccess}>{message}</p>}
        {status === "error" && <p className={s.statusError}>{message}</p>}
      </form>
    </div>
  );
};
