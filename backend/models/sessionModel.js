import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

},
{
    timestamps: true
});

const SessionModel = mongoose.model('session', SessionSchema);

export default SessionModel;