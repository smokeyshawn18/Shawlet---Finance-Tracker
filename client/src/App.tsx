import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
  SignOutButton,
} from "@clerk/clerk-react";
import Dashboard from "./pages/dashboard";
import Auth from "./pages/auth";

import { Pocket } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { FinancialRecordProvider } from "./contexts/financial-record-context";

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-gray-100 flex  flex-col px-4 sm:px-6 lg:px-12">
        {/* Navbar */}
        <div className="bg-[#0d0907] sticky top-0 z-50 text-white rounded-b-lg py-4 px-6 flex flex-wrap md:flex-nowrap justify-between items-center gap-4 shadow-lg">
          {/* Brand & Logo */}
          <div className="flex items-center gap-2 text-2xl font-bold text-teal-300">
            Shawlet <Pocket className="w-7 h-7" />
          </div>

          {/* Authentication Area */}
          <div className="flex items-center gap-4 ml-auto">
            <SignedIn>
              <div className="flex items-center gap-4">
                <UserButton />
                <SignOutButton>
                  <button className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-md text-white text-sm font-medium">
                    Sign Out
                  </button>
                </SignOutButton>
              </div>
            </SignedIn>

            <SignedOut>
              <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                <SignInButton mode="modal">
                  <button className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-md text-white text-sm font-medium">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded-md text-white text-sm font-medium">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        </div>

        {/* Routing Area */}
        <div className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                <FinancialRecordProvider>
                  <SignedIn>
                    <Dashboard />
                  </SignedIn>
                  <SignedOut>
                    <div className="text-center py-12 text-xl text-gray-700 font-semibold">
                      Please sign in to access your dashboard.
                    </div>
                  </SignedOut>
                </FinancialRecordProvider>
              }
            />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
