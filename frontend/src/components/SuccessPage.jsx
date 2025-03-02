import { useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold text-green-600">Payment Successful!</h1>
      <p>Thank you for your order.</p>
      <button onClick={() => navigate("/")} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Go to Home</button>
    </div>
  );
};

export default SuccessPage;
