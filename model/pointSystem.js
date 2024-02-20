const mongoose = require("mongoose");
const transactionSchema = mongoose.Schema({
        battingRun: {
                type: Number,
        },
        battingFourBonus: {
                type: Number,
        },
        battingSixBonus: {
                type: Number,
        },
        battingThirtyBonus: {
                type: Number,
        },
        battingHalfCenturyBonus: {
                type: Number,
        },
        battingCenturyBonus: {
                type: Number,
        },
        battingDisMissalForDuck: {
                type: Number,
        },
        bowlingWicketExceptRunOut: {
                type: Number,
        },
        bowlingMaidenOver: {
                type: Number,
        },
        bowlingLBW: {
                type: Number,
        },
        threeWicketHaulBonus: {
                type: Number,
        },
        fourWicketHaulBonus: {
                type: Number,
        },
        fiveWicketHaulBonus: {
                type: Number,
        },
        fieldingCatch: {
                type: Number,
        },
        fieldingThreeCatch: {
                type: Number,
        },
        fieldingStumping: {
                type: Number,
        },
        fieldingRunOutDirect: {
                type: Number,
        },
        fieldingRunOutMultiplayerInvolved: {
                type: Number,
        },
});

const transaction = mongoose.model("pointSystem", transactionSchema);
module.exports = transaction;
