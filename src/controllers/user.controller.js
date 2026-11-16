const UserService = require('../services/user.service');

exports.register = async (req, res) => {
  try {
    const { full_name, email, phone, password, role, village_id } = req.body;
    if (!full_name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'full_name, email, phone, and password are required',
      });
    }

    const newUser = await UserService.register({ full_name, email, phone, password, role, village_id });
    return res.status(201).json({ success: true, message: 'User registered successfully', data: newUser });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const result = await UserService.login({ email, password });
    return res.status(200).json({ success: true, message: 'Login successful', data: result });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};