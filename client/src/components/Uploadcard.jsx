import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const navigate = useNavigate();

  const handleAnalyze = () => {
    // navigate to result page; Loader will show for a few seconds there
    navigate("/result");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />

      <div className="pt-32 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-white">
          Upload Chest X-Ray
        </h1>

        <div className="mt-8 bg-slate-800 p-6 rounded-xl shadow-md w-full max-w-md">
          <input
            type="file"
            accept="image/*"
            className="mb-4"
          />

          <button onClick={handleAnalyze} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Analyze
          </button>
        </div>
      </div>
    </div>
  );
};

export default Upload;


