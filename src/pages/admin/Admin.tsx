import { useContext, useRef, useState } from "react";
import { Button } from "@/ui/button";
import { Form } from "@/ui/form";
import { Input } from "@/ui/input";
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
  const formRef = useRef<HTMLFormElement | null>(null);
  const timerRef = useRef<number | null>(null);

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
        setStatus("success");
        setMessage("File uploaded successfully!");
        timerRef.current = window.setTimeout(() => {
          resetForm();
        }, 3000);
      }
    } catch (error) {
      console.error("Error during file upload:", error);
      setStatus("error");
      setMessage("An error occurred during the upload.");
      timerRef.current = window.setTimeout(() => {
        resetForm();
      }, 3000);
    }
  }

  function resetForm() {
    if (formRef.current) {
      formRef.current.reset();
    }
    setFile(null);
    setStatus("idle");
    setMessage("");
  }

  function handleLogout() {
    authStore.logout();
  }

  return (
    <div className={s.page}>
      <Button className={s.logoutButton} onClick={handleLogout}>
        Logout
      </Button>
      <Form
        ref={formRef}
        method="post"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        <Input
          ref={fileInputRef}
          id="file"
          name="file"
          type="file"
          accept="image/jpeg"
          onChange={handleFileChange}
          disabled={status === "loading"}
          required
        />

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
