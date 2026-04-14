const User = require('../models/User');

// Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Toggle product in wishlist (add/remove)
exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    const index = user.wishlist.indexOf(productId);
    
    if (index > -1) {
      // Remove from wishlist
      user.wishlist.splice(index, 1);
      await user.save();
      const updatedUser = await User.findById(req.user._id).populate('wishlist');
      res.json({ message: 'Removed from wishlist', wishlist: updatedUser.wishlist });
    } else {
      // Add to wishlist
      user.wishlist.push(productId);
      await user.save();
      const updatedUser = await User.findById(req.user._id).populate('wishlist');
      res.json({ message: 'Added to wishlist', wishlist: updatedUser.wishlist });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
