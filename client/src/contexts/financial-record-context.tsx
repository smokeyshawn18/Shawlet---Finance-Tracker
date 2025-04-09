import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react"; // Assuming you're using Clerk
import toast from "react-hot-toast"; // Assuming you're using react-hot-toast for notifications

export interface FinancialRecord {
  _id: string;
  userId: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
  currency: string;
}

interface FinancialRecordContextType {
  records: FinancialRecord[];
  addRecord: (record: FinancialRecord) => void;
  updateRecord: (id: string, newRecord: FinancialRecord) => void;
  deleteRecord: (id: string) => void;
}

export const FinancialRecordContext = createContext<
  FinancialRecordContextType | undefined
>(undefined);

export const FinancialRecordProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const { isSignedIn, user } = useUser();

  const BACKENDAPI = "https://shawlet-backend.onrender.com";

  // ✅ Always declare hook
  useEffect(() => {
    if (!isSignedIn) {
      console.warn("User not authenticated!");
      return;
    }

    const fetchRecords = async () => {
      try {
        const res = await fetch(
          `${BACKENDAPI}/financial-records/getAllByUserID/${user?.id}`
        );
        const data = await res.json();
        setRecords(data);
      } catch (err) {
        console.error("Failed to fetch records:", err);
      }
    };

    fetchRecords();
  }, [isSignedIn]);

  const addRecord = async (record: FinancialRecord) => {
    if (!isSignedIn || !user) {
      console.warn("User not authenticated!");
      toast.error("You must be signed in to add a record.");
      return;
    }

    try {
      const response = await fetch(`${BACKENDAPI}/financial-records`, {
        method: "POST",
        body: JSON.stringify(record),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const newRecord: FinancialRecord = await response.json();
        setRecords((prev) => [...prev, newRecord]);
        toast.success("Record added successfully!");
      } else {
        const errorData = await response.json();
        console.error("Failed to add record:", errorData);
        toast.error(
          `Failed to add record: ${errorData.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error adding record:", error);
      toast.error("An error occurred while adding the record.");
    }
  };

  const updateRecord = async (id: string, newRecord: FinancialRecord) => {
    const response = await fetch(`/financial-records/${id}`, {
      method: "PUT",
      body: JSON.stringify(newRecord),
      headers: {
        "Content-Type": "application/json",
      },
    });

    try {
      if (response.ok) {
        const newRecord = await response.json();
        setRecords((prev) =>
          prev.map((record) => {
            if (record._id === id) {
              return newRecord;
            } else {
              return record;
            }
          })
        );
      }
    } catch (err) {}
  };

  const deleteRecord = async (id: string) => {
    const response = await fetch(`${BACKENDAPI}/financial-records/${id}`, {
      method: "DELETE",
    });

    try {
      if (response.ok) {
        const deletedRecord = await response.json();
        setRecords((prev) =>
          prev.filter((record) => record._id !== deletedRecord._id)
        );
      }
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };
  return (
    <FinancialRecordContext.Provider
      value={{ records, addRecord, updateRecord, deleteRecord }}
    >
      {children}
    </FinancialRecordContext.Provider>
  );
};

export const useFinancialRecords = () => {
  const context = useContext(FinancialRecordContext);

  if (!context) {
    throw new Error(
      "useFinancialRecords must be used within a FinancialRecordProvider"
    );
  }

  return context;
};
