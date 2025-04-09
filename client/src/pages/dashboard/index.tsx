import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react"; // Import the "PlusCircle" icon from Lucide

import FinancialRecordForm from "./financial-record-form";
import { FinancialRecordList } from "./financial-record-list";

const Dashboard = () => {
  const { user } = useUser(); // Getting user data from Clerk
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility

  const handleAddRecordClick = () => {
    setShowForm((prev) => !prev); // Toggle form visibility
  };

  return (
    <>
      <div className="bg-gray-50 min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-12 py-8">
        {/* Hero Section */}
        <section className="w-full mb-4 max-w-4xl bg-white rounded-xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-teal-600">
            Welcome to Shawlet
            {user?.firstName ? (
              <span className="text-black "> {user.firstName}</span>
            ) : (
              ""
            )}
          </h1>

          <h2 className="text-lg sm:text-xl md:text-2xl text-gray-700 font-semibold mt-2 mb-6">
            Take Control of Your Finances
          </h2>

          {/* Add Record Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleAddRecordClick}
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-teal-600 text-white text-base sm:text-lg md:text-xl rounded-full shadow-lg hover:bg-teal-700 transform transition duration-300 ease-in-out hover:scale-105 flex items-center justify-center"
            >
              <PlusCircle className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
              <span>Add Record</span>
            </button>
          </div>

          {/* Financial Record List */}
        </section>
        {showForm && <FinancialRecordForm />}
        <FinancialRecordList />
      </div>

      {/* Financial Record Form (conditional) */}
    </>
  );
};

export default Dashboard;
