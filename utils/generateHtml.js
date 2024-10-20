export const signUpTemp = (link) => `<!DOCTYPE html>
<html>
<head>
<title>Activate your Account</title>
<style>
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  padding: 0;
}

.container {
  width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.step {
  width: 100px;
  text-align: center;
}

.step i {
  font-size: 24px;
  color: #333;
  margin-bottom: 5px;
}

.step span {
  display: block;
  font-weight: bold;
  color: #333;
}

p {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  width: 200px;
  display: block;
  margin: 0 auto;
}

button:hover {
  background-color: #45a049;
}

.footer {
  text-align: center;
  margin-top: 20px;
}

.footer a {
  color: #333;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}

.social-links {
  margin-top: 10px;
}

.social-links a {
  display: inline-block;
  margin: 0 5px;
}

.social-links i {
  font-size: 20px;
  color: #333;
}
</style>
</head>
<body>
<div class="container">
  <h1>Activate your Account</h1>

  <div class="steps">
    <div class="step">
      <i><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#4CAF50"/></svg></i>
      <span>Create Account</span>
    </div>
    <div class="step">
      <i><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20.29 8.29L12 20.59 3.71 8.29 2.29 9.71 12 21.41 21.71 9.71 20.29 8.29z" fill="#4CAF50"/></svg></i>
      <span>Verify Email</span>
    </div>
    <div class="step">
      <i><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0-2c-6.63 0-12 5.37-12 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" fill="#4CAF50"/></svg></i>
      <span>Enjoy Service</span>
    </div>
  </div>

  <p>Thank you for registering with us. In order to activate your account please click the button below.</p>

<button><a href="${link}">ACTIVATE ACCOUNT</a></button>

  <div class="footer">
    <a href="#">View as a Web Page</a>
    <p>© 2017 StartupEmails, Inc. All rights reserved.</p>
    <p>123 Incredible Street, SomeTown, OR, 87466 US, (123) 456-7890</p>
    <div class="social-links">
      <a href="#"><i class="fab fa-linkedin"></i></a>
      <a href="#"><i class="fab fa-twitter"></i></a>
      <a href="#"><i class="fab fa-rss"></i></a>
    </div>
    <p>You received this email because you signed up for StartupEmails</p>
    <a href="#">unsubscribe</a>
  </div>
</div>
</body>
</html>`



export const resetPassTemp = (code) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Template</title>
</head>
<body>
    <h1>Code Template</h1>
    <p>Code: <input type="number" value="${code}" /></p>
</body>
</html>`