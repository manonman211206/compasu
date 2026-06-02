const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return re.test(password);
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

const validateRegisterInput = (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || typeof username !== 'string' || username.length < 3 || username.length > 50) {
    return res.status(400).json({ message: 'Username must be between 3-50 characters' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters with uppercase, lowercase, and number',
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  req.body.username = sanitizeInput(username);
  req.body.email = email.toLowerCase();
  next();
};

const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  req.body.email = email.toLowerCase();
  next();
};

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validateEmail,
  validatePassword,
  sanitizeInput,
};