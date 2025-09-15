import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));



// ===== Schemas =====

// --- PDF Upload ---
const pdfSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  pdf: { type: String, required: true }, // Base64
  submittedAt: { type: Date, default: Date.now },
  rating: { type: Number, default: null },
});
const Pdf = mongoose.model("Pdf", pdfSchema);

// --- Quiz Questions ---
const questionSchema = new mongoose.Schema({
  q: { type: String, required: true },
  options: { type: [String], required: true },
  correct: { type: Number, required: true }
}, { timestamps: true });
const Question = mongoose.model("Question", questionSchema);

// --- Quiz Score ---
const scoreSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  score: Number,
  total: Number,
  answers: Array,
  date: { type: Date, default: Date.now },
});
const Score = mongoose.model("Score", scoreSchema);

// --- Permission ---
const permissionSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  remaining: { type: Number, default: 0 }
});
const Permission = mongoose.model("Permission", permissionSchema);

// ===== Multer Setup for PDF Upload =====
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ===== Routes =====

// --------- PDF Routes ---------
app.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const file = req.file;
    if (!file || file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "Please upload a valid PDF file" });
    }
    const pdfData = file.buffer.toString("base64");
    const newPdf = new Pdf({ name, email, phone, pdf: pdfData });
    await newPdf.save();
    res.json({ message: "PDF uploaded successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/submissions", async (req, res) => {
  const submissions = await Pdf.find().sort({ submittedAt: -1 });
  res.json(submissions);
});

app.get("/submissions/selected", async (req, res) => {
  const selected = await Pdf.find({ rating: { $gte: 6 } }).sort({ submittedAt: -1 });
  res.json(selected);
});

app.get("/submissions/pending", async (req, res) => {
  const pending = await Pdf.find({ rating: null }).sort({ submittedAt: -1 });
  res.json(pending);
});

app.get("/submissions/not-selected", async (req, res) => {
  const notSelected = await Pdf.find({ rating: { $lt: 6, $ne: null } }).sort({ submittedAt: -1 });
  res.json(notSelected);
});

app.put("/submissions/:id/rate", async (req, res) => {
  const { rating } = req.body;
  if (rating < 0 || rating > 10) return res.status(400).json({ error: "Invalid rating" });
  const updated = await Pdf.findByIdAndUpdate(req.params.id, { rating }, { new: true });
  res.json(updated);
});

app.delete("/submissions/:id", async (req, res) => {
  await Pdf.findByIdAndDelete(req.params.id);
  res.json({ message: "Submission deleted successfully" });
});

// --------- Quiz Routes ---------
app.get("/api/questions", async (req, res) => {
  const questions = await Question.find().sort({ createdAt: 1 });
  res.json(questions);
});

app.post("/api/questions", async (req, res) => {
  try {
    const newQuestion = new Question(req.body);
    await newQuestion.save();
    res.json(newQuestion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/questions/:id", async (req, res) => {
  const updated = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.delete("/api/questions/:id", async (req, res) => {
  await Question.findByIdAndDelete(req.params.id);
  res.json({ message: "Question deleted successfully" });
});

// --------- Score Routes ---------
app.post("/api/score", async (req, res) => {
  try {
    const score = new Score(req.body);
    await score.save();
    res.json({ success: true, score });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/participants", async (req, res) => {
  const scores = await Score.find().sort({ date: -1 });
  res.json(scores);
});

app.delete("/api/score/:id", async (req, res) => {
  await Score.findByIdAndDelete(req.params.id);
  res.json({ message: "Score deleted successfully" });
});

// --------- Permission Routes ---------
app.get("/api/permission/:email", async (req, res) => {
  const perm = await Permission.findOne({ email: req.params.email });
  res.json(perm || { remaining: 0 });
});

app.post("/api/permission/:email", async (req, res) => {
  const { remaining } = req.body;
  const perm = await Permission.findOneAndUpdate(
    { email: req.params.email },
    { remaining },
    { new: true, upsert: true }
  );
  res.json(perm);
});

app.get("/api/permissions", async (req, res) => {
  const perms = await Permission.find();
  res.json(perms);
});

app.delete("/api/permission/:email", async (req, res) => {
  await Permission.deleteOne({ email: req.params.email });
  res.json({ message: "Permission deleted successfully" });
});

// ===== Server Start =====
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
