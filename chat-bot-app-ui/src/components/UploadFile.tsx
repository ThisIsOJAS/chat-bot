import { useRef, useState } from "react";
import { uploadDocument } from "../utils/backend";
import { useDispatch } from "react-redux";
import { setDocId } from "../store/docSlice";

const UploadFile = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    dispatch(setDocId("")); // clear store on new selection
    setSuccess(false);
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);
      const id = await uploadDocument(file);
      dispatch(setDocId(id));
      setSuccess(true);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 p-4 m-4 rounded-xl shadow flex flex-wrap items-center justify-center gap-4 w-full max-w-xl mx-auto">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx"
        className="hidden"
      />

      <button
        onClick={handleBrowseClick}
        className="bg-sky-700 hover:bg-sky-800 text-white font-semibold py-2 px-4 rounded cursor-pointer"
      >
        Choose File
      </button>

      <span className="text-gray-700 max-w-xs truncate">
        {file ? file.name : "No file chosen"}
      </span>

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed enabled:cursor-pointer transition-colors duration-200"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {success && (
        <p className="text-green-600 whitespace-nowrap">
          ✅ Uploaded Successfully !
        </p>
      )}
    </div>
  );
};

export default UploadFile;
