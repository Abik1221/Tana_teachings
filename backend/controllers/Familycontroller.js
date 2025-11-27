const Family = require('../models/family');
exports.createFamily = async (req, res) => {
    try {
    const { name, contactEmail, phone, address } = req.body;
    const family = new Family({
      parent: req.user._id, // From JWT auth middleware
      name,
      contactEmail,
      phone,
      address,
    });
    await family.save();
    res.status(201).json(family);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateFamily = async (req, res) => {
  try {
    const family = await Family.findOneAndUpdate(
      { _id: req.params.id, parent: req.user._id }, // Ensure owned by user
      req.body,
      { new: true, runValidators: true }
    );
    if (!family) return res.status(404).json({ message: 'Family not found' });
    res.json(family);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};