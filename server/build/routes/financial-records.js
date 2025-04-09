"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const financial_record_1 = __importDefault(require("../schema/financial-record"));
const router = express_1.default.Router();
router.get("/getAllByUserID/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        // Fetch records for the given userId
        const records = yield financial_record_1.default.find({ userId });
        // Handle case where no records are found
        if (records.length === 0) {
            return res.status(404).send("No records found for the user.");
        }
        // Send records as response
        res.status(200).json(records);
    }
    catch (error) {
        // Handle errors
        res
            .status(500)
            .send({ error: "An error occurred while fetching records." });
    }
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Destructure _id out of the body and ignore it
        const _a = req.body, { _id } = _a, newRecordBody = __rest(_a, ["_id"]);
        // Create a new record without an explicit _id, letting MongoDB generate it
        const newRecord = new financial_record_1.default(newRecordBody);
        const savedRecord = yield newRecord.save();
        res.status(201).send(savedRecord); // Use 201 for resource creation
    }
    catch (error) {
        console.error("Error while saving record:", error);
        res
            .status(500)
            .send({ error: "An error occurred while adding the record." });
    }
}));
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const newRecordBody = req.body;
        const record = yield financial_record_1.default.findByIdAndUpdate(id, newRecordBody, { new: true });
        if (!record)
            return res.status(404).send("Record not found.");
        res.status(200).send(record);
    }
    catch (error) {
        res
            .status(500)
            .send({ error: "An error occurred while adding the record." });
    }
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const record = yield financial_record_1.default.findByIdAndDelete(id);
        if (!record)
            return res.status(404).send("Record not found.");
        res.status(200).send(record);
    }
    catch (error) {
        res
            .status(500)
            .send({ error: "An error occurred while adding the record." });
    }
}));
exports.default = router;
