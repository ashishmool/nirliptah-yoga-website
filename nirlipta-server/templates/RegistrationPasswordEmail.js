const RegistrationPasswordEmail = ({ email, resetLink }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Setup</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f9;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      background-color: #9B6763;
      color: #fff;
      padding: 20px;
      text-align: center;
    }
    .email-header img {
      max-width: 150px;
    }
    .email-body {
      padding: 20px;
    }
    .email-body h1 {
      font-size: 24px;
      margin-bottom: 10px;
      color: #9B6763;
    }
    .email-body p {
      font-size: 16px;
      line-height: 1.6;
    }
    .email-body a {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 20px;
      font-size: 16px;
      text-decoration: none;
      background-color: #9B6763;
      color: #fff;
      border-radius: 4px;
    }
    .email-footer {
      background-color: #f4f4f9;
      text-align: center;
      padding: 10px;
      font-size: 12px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <img src="https://gemflooring.com.np/wp-content/uploads/2025/02/nirlipta-logo-white.png" alt="Nirliptah Yoga">
      <h1>Welcome to Nirliptah Yoga!</h1>
    </div>
    <div class="email-body">
      <h1>Complete Your Registration</h1>
      <p>Hi, ${email},</p>
      <p>We are thrilled to have you on board! To complete your registration, please set your password by clicking the button below:</p>
      <a href="${resetLink}" target="_blank">Set Your Password</a>
      <p>If you did not register for an account, please ignore this email.</p>
    </div>
    <div class="email-footer">
      <p>&copy; ${new Date().getFullYear()} Nirliptah Yoga by Nivedita Pradhan. All rights reserved.</p>
      <p>[Your Address or Contact Information]</p>
    </div>
  </div>
</body>
</html>
`;

module.exports = RegistrationPasswordEmail;
