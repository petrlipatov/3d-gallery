import { useContext, useRef, useState } from "react";

import { Button } from "@/shared/ui/button";
import { Form } from "@/shared/ui/form";
import { api } from "@/shared/http";
import { storeContext } from "@/shared/constants/contexts";
import { IMAGES_PATH } from "@/shared/constants";

import s from "./Admin.module.css";

export const Admin = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");
  const [message, setMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { authStore } = useContext(storeContext);

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

      const response = await api.post(IMAGES_PATH, formData);

      if (response.status === 200) {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setFile(null);
        setStatus("success");
        setMessage("File uploaded successfully!");
      }
    } catch (error) {
      console.error("Error during file upload:", error);
      setStatus("error");
      setMessage("An error occurred during the upload.");
    }
  }

  function handleLogout() {
    authStore.logout();
  }

  return (
    <div className={s.page}>
      <Button className={s.logoutButton} onClick={handleLogout}>
        Logout
      </Button>
      <Form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
        <div className={s.inputContainer}>
          <label className={s.label} htmlFor="file">
            Choose file to upload:
          </label>
          <input
            ref={fileInputRef}
            className={s.input}
            id="file"
            name="file"
            type="file"
            accept="image/jpeg"
            multiple
            onChange={handleFileChange}
            disabled={status === "loading"}
            required
          />
        </div>
        <Button
          variant="secondary"
          type="submit"
          isLoading={status === "loading"}
        >
          Upload
        </Button>
        {status === "success" && <p className={s.statusSuccess}>{message}</p>}
        {status === "error" && <p className={s.statusError}>{message}</p>}
      </Form>
    </div>
  );
};
