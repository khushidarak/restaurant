const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== FRONTEND HTML (Embedded) =====
const bookingPage = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Table Booking</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .booking-container {
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            padding: 30px;
            width: 100%;
            max-width: 500px;
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 25px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #555;
        }
        input, select {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 16px;
            box-sizing: border-box;
        }
        button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 14px;
            width: 100%;
            border-radius: 8px;
            font-size: 18px;
            cursor: pointer;
            transition: background 0.3s;
        }
        button:hover {
            background: #45a049;
        }
        .success-message, .error-message {
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            display: none;
        }
        .success-message {
            background: #d4edda;
            color: #155724;
        }
        .error-message {
            background: #f8d7da;
            color: #721c24;
        }
    </style>
</head>
<body>
    <div class="booking-container">
        <h1>Book Your Table</h1>
        <form id="bookingForm">
            <div class="form-group">
                <label for="name">Full Name</label>
                <input type="text" id="name" required>
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" required>
            </div>
            <div class="form-group">
                <label for="date">Date</label>
                <input type="date" id="date" required>
            </div>
            <div class="form-group">
                <label for="time">Time</label>
                <input type="time" id="time" required>
            </div>
            <div class="form-group">
                <label for="guests">Number of Guests</label>
                <select id="guests" required>
                    <option value="">Select guests</option>
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5+ Guests</option>
                </select>
            </div>
            <button type="submit">Book Table</button>
        </form>
        <div id="successMessage" class="success-message">
            Booking confirmed! Check your email for details.
        </div>
        <div id="errorMessage" class="error-message">
            Booking failed. Please try again.
        </div>
    </div>

    <script>
        document.getElementById('bookingForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                date: document.getElementById('date').value,
                time: document.getElementById('time').value,
                guests: document.getElementById('guests').value
            };

            try {
                const response = await fetch('/book-table', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    document.getElementById('successMessage').style.display = 'block';
                    document.getElementById('errorMessage').style.display = 'none';
                    document.getElementById('bookingForm').reset();
                } else {
                    throw new Error('Booking failed');
                }
            } catch (error) {
                document.getElementById('errorMessage').style.display = 'block';
                document.getElementById('successMessage').style.display = 'none';
            }
        });

        document.getElementById('date').min = new Date().toISOString().split('T')[0];
    </script>
</body>
</html>
`;

// Serve booking page
app.get('/', (req, res) => {
    res.send(bookingPage);
});

// Email configuration
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Booking endpoint
app.post('/book-table', async (req, res) => {
    const { name, email, date, time, guests } = req.body;

    try {
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Table Booking Confirmation',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2c3e50;">Booking Confirmed!</h2>
                    <p>Dear ${name},</p>
                    <p>Your table has been successfully booked:</p>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Date:</strong> ${formattedDate}</p>
                        <p><strong>Time:</strong> ${time}</p>
                        <p><strong>Guests:</strong> ${guests}</p>
                    </div>
                    <p>We look forward to serving you!</p>
                </div>
            `
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ error: 'Booking failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});