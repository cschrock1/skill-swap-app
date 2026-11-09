// server/controllers/listingController.js
const Listing = require('../models/Listing');

const getListings = async (req, res) => {
  try {
    const listings = await Listing.findAll({ include: ['User'] });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

const createListing = async (req, res) => {
  try {
    const { title, category, description, listingType } = req.body;
    const listing = await Listing.create({
      title,
      category,
      description,
      listingType,
      userId: req.user.id,
    });
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = { getListings, createListing };
