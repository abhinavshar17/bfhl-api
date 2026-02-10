const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

const EMAIL = "abhinav0008.be23@chitkara.edu.in";

// ---------- Helpers ----------
function fibonacci(n) {
  if (n <= 0) return [];
  let a = 0, b = 1, res = [0];
  for (let i = 1; i < n; i++) {
    res.push(b);
    [a, b] = [b, a + b];
  }
  return res;
}

function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++)
    if (num % i === 0) return false;
  return true;
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(arr) {
  return arr.reduce((a, b) => (a * b) / gcd(a, b));
}

function hcf(arr) {
  return arr.reduce((a, b) => gcd(a, b));
}

// ---------- Health ----------
app.get("/health", (req, res) => {
  res.json({ is_success: true, official_email: EMAIL });
});

// ---------- Main ----------
app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;

    if (body.fibonacci !== undefined) {
      return res.json({
        is_success: true,
        official_email: EMAIL,
        data: fibonacci(body.fibonacci)
      });
    }

    if (body.prime !== undefined) {
      return res.json({
        is_success: true,
        official_email: EMAIL,
        data: body.prime.filter(isPrime)
      });
    }

    if (body.lcm !== undefined) {
      return res.json({
        is_success: true,
        official_email: EMAIL,
        data: lcm(body.lcm)
      });
    }

    if (body.hcf !== undefined) {
      return res.json({
        is_success: true,
        official_email: EMAIL,
        data: hcf(body.hcf)
      });
    }

    // ---------- Gemini AI ----------
    if (body.AI !== undefined) {
      const aiRes = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_KEY}`,
        {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Answer in ONE WORD only: ${body.AI}`
                }
              ]
            }
          ]
        }
      );

      const text = aiRes.data.candidates[0].content.parts[0].text.trim();

      return res.json({
        is_success: true,
        official_email: EMAIL,
        data: text
      });
    }

    return res.status(400).json({
      is_success: false,
      official_email: EMAIL
    });

  } catch (err) {
    console.log("GEMINI ERROR:", err.response?.data || err.message);
    return res.status(500).json({
      is_success: false,
      official_email: EMAIL
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));

