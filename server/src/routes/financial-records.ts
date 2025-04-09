import express, { Request, Response } from "express";
import FinancialRecordModel from "../schema/financial-record";

const router = express.Router();

router.get(
  "/getAllByUserID/:userId",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = req.params.userId;

      // Fetch records for the given userId
      const records = await FinancialRecordModel.find({ userId });

      // Handle case where no records are found
      if (records.length === 0) {
        return res.status(404).send("No records found for the user.");
      }

      // Send records as response
      res.status(200).json(records);
    } catch (error) {
      // Handle errors
      res
        .status(500)
        .send({ error: "An error occurred while fetching records." });
    }
  }
);

router.post("/", async (req: Request, res: Response) => {
  try {
    // Destructure _id out of the body and ignore it
    const { _id, ...newRecordBody } = req.body;

    // Create a new record without an explicit _id, letting MongoDB generate it
    const newRecord = new FinancialRecordModel(newRecordBody);
    const savedRecord = await newRecord.save();

    res.status(201).send(savedRecord); // Use 201 for resource creation
  } catch (error) {
    console.error("Error while saving record:", error);
    res
      .status(500)
      .send({ error: "An error occurred while adding the record." });
  }
});

router.put("/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id;
    const newRecordBody = req.body;
    const record = await FinancialRecordModel.findByIdAndUpdate(
      id,
      newRecordBody,
      { new: true }
    );
    if (!record) return res.status(404).send("Record not found.");

    res.status(200).send(record);
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while adding the record." });
  }
});

router.delete("/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id;
    const record = await FinancialRecordModel.findByIdAndDelete(id);
    if (!record) return res.status(404).send("Record not found.");

    res.status(200).send(record);
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while adding the record." });
  }
});

export default router;
