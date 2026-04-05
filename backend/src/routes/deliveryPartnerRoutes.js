const express = require('express');
const router = express.Router();
const DeliveryPartner = require('../models/DeliveryPartner');
const Order = require('../models/Order');

// GET all delivery partners
router.get('/delivery-partners', async (req, res) => {
  try {
    const partners = await DeliveryPartner.find().sort({ createdAt: -1 });
    res.json(partners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new delivery partner
router.post('/delivery-partners', async (req, res) => {
  try {
    const { name, phone } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }
    const partner = await DeliveryPartner.create({ name, phone });
    return res.status(201).json(partner);
  } catch (err) {
    // Always return JSON — never let Express fall through to HTML error pages
    return res.status(400).json({ error: err.message || 'Failed to create partner' });
  }
});

// DELETE a delivery partner
router.delete('/delivery-partners/:id', async (req, res) => {
  try {
    await DeliveryPartner.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH update a delivery partner (name, phone, status)
router.patch('/delivery-partners/:id', async (req, res) => {
  try {
    const { name, phone, status } = req.body;
    const update = {};
    if (name)   update.name   = name.trim();
    if (phone)  update.phone  = phone.trim();
    if (status) update.status = status;

    const partner = await DeliveryPartner.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    );
    if (!partner) return res.status(404).json({ error: 'Partner not found' });
    return res.json(partner);
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to update partner' });
  }
});


// and marks the partner as busy
router.patch('/orders/:id/assign-partner', async (req, res) => {
  try {
    const { partnerId } = req.body;
    const partner = await DeliveryPartner.findById(partnerId);
    if (!partner) return res.status(404).json({ error: 'Partner not found' });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { assignedPartner: partnerId, status: 'out_for_delivery' },
      { new: true }
    ).populate('assignedPartner');

    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Mark partner as busy
    await DeliveryPartner.findByIdAndUpdate(partnerId, { status: 'busy' });

    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
