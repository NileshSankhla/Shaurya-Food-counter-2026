const Scan = require('../models/Scan');

// @desc    Verify and record a QR scan
// @route   POST /api/scan/verify
// @access  Private
const verifyScan = async (req, res) => {
    const { studentId, mealType } = req.body;

    const validMeals = ['Breakfast', 'Lunch', 'Dinner'];
    if (!validMeals.includes(mealType)) {
        return res.status(400).json({ message: 'Invalid or missing mealType' });
    }

    if (!studentId || !studentId.toUpperCase().startsWith('SHAURYA')) {
        try {
            const scan = await Scan.create({
                studentId: studentId || 'UNKNOWN',
                status: 'failed',
                reason: 'Invalid Code',
                mealType,
                scannedBy: req.user.id
            });
            return res.status(201).json(scan);
        } catch (error) {
            return res.status(500).json({ message: 'Failed to record scan', error: error.message });
        }
    }

    try {
        // Check if already scanned today for THIS meal
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const existingScan = await Scan.findOne({
            studentId: studentId,
            status: 'success',
            mealType: mealType,
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });

        if (existingScan) {
            const scan = await Scan.create({
                studentId: studentId,
                status: 'failed',
                reason: `Already Scanned for ${mealType} Today`,
                mealType,
                scannedBy: req.user.id
            });
            return res.status(201).json(scan);
        }

        // If not scanned today for this meal, mark as success
        const scan = await Scan.create({
            studentId: studentId,
            status: 'success',
            reason: '',
            mealType,
            scannedBy: req.user.id
        });
        res.status(201).json(scan);
    } catch (error) {
        res.status(500).json({ message: 'Failed to record scan', error: error.message });
    }
};

// @desc    Get scan history
// @route   GET /api/scan/history
// @access  Private
const getHistory = async (req, res) => {
    try {
        const scans = await Scan.find({}).sort({ createdAt: -1 });
        res.json(scans);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch history', error: error.message });
    }
};

// @desc    Get scan stats
// @route   GET /api/scan/stats
// @access  Private
const getStats = async (req, res) => {
    try {
        const total = await Scan.countDocuments();
        const successful = await Scan.countDocuments({ status: 'success' });
        const failed = await Scan.countDocuments({ status: 'failed' });
        
        res.json({
            total,
            successful,
            failed
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
    }
};

module.exports = { verifyScan, getHistory, getStats };
