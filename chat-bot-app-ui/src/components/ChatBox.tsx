import { useState } from "react";
import { askQuestion } from "../utils/backend";
import { useSelector } from "react-redux";

const ChatBox = () => {
  const docId = useSelector((state: any) => state.document.docId);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    try {
      const response = await askQuestion(docId, question);
      setAnswer(response);
      setQuestion(""); // Clear question input after asking
    } catch (err) {
      console.error("Error:", err);
      setAnswer("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 m-4 rounded-xl shadow w-full max-w-xl mx-auto">
      <h2 className="text-lg font-semibold mb-2">Ask a Question</h2>

      <textarea
        className="w-full p-2 border rounded-md resize-none"
        rows={4}
        placeholder={
          docId
            ? "Ask a question about your uploaded file..."
            : "Upload a file before asking a question"
        }
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        onClick={handleAsk}
        disabled={loading || !docId || !question.trim()}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 enabled:cursor-pointer transition-colors duration-200"
      >
        {loading ? "Asking..." : "Send"}
      </button>

      {answer && (
        <div className="mt-4 p-3 bg-gray-100 border rounded">
          <strong>AI Response:</strong>
          <p className="mt-1 whitespace-pre-wrap">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
