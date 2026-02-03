import Email from '../models/Email.js';

export const getStats = async (req, res) => {
    try {
        const total = await Email.countDocuments();
        const sent = await Email.countDocuments({ status: 'sent' });
        const pending = await Email.countDocuments({ status: 'pending' });
        const failed = await Email.countDocuments({ status: 'failed' });
        
        const recent = await Email.find({ status: { $in: ['sent', 'failed'] } })
            .sort({ sentAt: -1, updatedAt: -1 }) // sentAt for sent, updatedAt for failed maybe? usually failed doesn't set sentAt. check model.
            // Model: sentAt only set on sent. failed has error.
            .limit(10)
            .select('email status sentAt error');

        res.json({
            stats: { total, sent, pending, failed },
            recent
        });
    } catch (error) {
        console.error("Stats Error:", error);
        res.status(500).json({ error: 'Server Error' });
    }
};
