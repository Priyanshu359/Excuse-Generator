const marketplaceModel = require('./markeplaceModel');

exports.sellExcuse = async (req, res, next) => {
    try {
        const { excuse_id, price } = req.body;
        const user_id = req.user.user_id;

        const excuse = await marketplaceModel.checkExcuseApproved(excuse_id, user_id);
        if (!excuse) {
            return res.status(400).json({ message: 'Excuse not approved or does not exist' });
        }
        await marketplaceModel.listExcuseInMarketplace(excuse_id, user_id, price);
        res.status(201).json({ message: 'Excuse listed for sale' });
    }
    catch (err) {
        next(err);
    }
};

exports.buyExcuse = async (req, res, next) => {
    try {
        const listing_id = req.params.id;
        const buyer_id = req.user.user_id;

        const listing = await marketplaceModel.getListingById(listing_id);
        if (!listing) return res.status(400).json({ message: 'Listing not found or already sold' });

        if (listing.seller_id == buyer_id) {
            return res.status(400).json({ message: 'Cannot buy your own excuses' });
        }
        const balance = await marketplaceModel.getTokenBalance(buyer_id);
        if (balance < listing.price) {
            return res.status(400).json({ message: 'Insufficient token balance' });
        }

        await marketplaceModel.markAsSold(listing_id);
        await marketplaceModel.deductTokens(buyer_id, listing.price);
        await marketplaceModel.addTransaction({
            from_user: buyer_id,
            to_user: listing.seller_id,
            excuse_id: listing.excuse_id,
            tokens: listing.price
        });
        res.json({ message: 'Excuse purchased successfully' });
    }
    catch (err) {
        next(err);
    }
};

exports.getMarketplaceListings = async (req, res, next) => {
    try {
        const listings = await marketplaceModel.listExcusesForSale();
        res.json(listings);
    }
    catch (err) {
        next(err);
    }
};

exports.getMySales = async (req, res, next) => {
    try { 
        const user_id = req.user.user_id;
        const sales = await marketplaceModel.getUserSales(user_id);
        res.json(sales);
    }
    catch (err) {
        next(err);
    }
}

exports.getMyPurchases = async (req, res, next) => {
    try {
        const user_id = req.user.user_id;
        const purchases = await marketplaceModel.getUserPurchases(user_id);
        if (!purchases || purchases.length === 0) { 
            return res.status(404).json({ message: 'No Purchases Made' });
        }
        res.json(purchases);
    }
    catch (err) {
        next(err);
    }
}