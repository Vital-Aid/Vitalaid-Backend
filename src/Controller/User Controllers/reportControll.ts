import axios from "axios";
import { Request, Response, NextFunction } from "express";
import CustomError from "../../utils/CustomError";

export const generateReport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      height,
      weight,
      pressureRate,
      sugarRate,
      cholesterol,
      allergies,
      otherDiseases,
      aboutYou,
    } = req.body;

    const prompt = `
Generate a detailed medical report based on the following patient details:

**Patient Information:**
- Height: ${height || "Not provided"}
- Weight: ${weight || "Not provided"}
- Blood Pressure: ${pressureRate || "Not provided"} mmHg (Specify if systolic/diastolic or single value)
- Blood Sugar Level: ${sugarRate || "Not provided"} mg/dL (Specify if fasting, postprandial, or random)
- Cholesterol Level: ${cholesterol || "Not provided"} mg/dL (Specify if total cholesterol, LDL, HDL, or triglycerides)
- Allergies: ${allergies || "None reported"}
- Other Diseases/Medical History: ${otherDiseases || "None reported"}
- Additional Patient Notes: ${aboutYou || "No additional details"}

**Task:**
1. **Assess Health Status:** Provide a structured medical summary, interpreting the given values based on standard health guidelines.
2. **Identify Concerns:** Highlight any potential health risks, abnormal values, or medical conditions that may need further evaluation.
3. **Give Recommendations:** Provide actionable medical advice, including necessary lifestyle changes, diet, exercise, or possible medical tests required.
4. **Rate Health Status:** Provide a rating out of 10 based on the overall health condition.
5. **Determine Health Stage:** Categorize the patient’s health status into one of the following: "Healthy", "Needs Monitoring", "At Risk", or "Requires Immediate Attention".

**Important:** Keep the response structured, clear, and medically relevant.
`;

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return next(new CustomError("GEMINI_API_KEY is not configured", 400));
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const candidates = response.data?.candidates;

    if (!candidates || candidates.length === 0) {
      console.error(
        "No candidates found in Gemini API response:",
        response.data
      );
      throw new CustomError("No candidates found in Gemini API response", 500);
    }

    const reportText = candidates[0]?.content?.parts?.[0]?.text;

    if (!reportText) {
      console.error(
        "Report text not found in Gemini API response:",
        response.data
      );
      throw new CustomError("Report text not found in Gemini API response", 500);
    }

    const normalText = reportText.replace(/\*\*/g, "");

    res.status(200).json({
      success: true,
      report: normalText,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error?.message || "API request failed";
      return next(new CustomError(errorMessage, error.response?.status || 500));
    }
    next(error);
  }
};
