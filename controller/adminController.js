const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const howToPlay = require("../model/howPlay");
const staticContent = require('../model/staticContent');
const pointSystem = require('../model/pointSystem');
const authConfig = require("../configs/auth.config");
const FAQ = require('../model/faqModel');
const CallUs = require('../model/contacusModel');



exports.registration = async (req, res) => {
        const { mobileNumber, email } = req.body;
        try {
                req.body.email = email.split(" ").join("").toLowerCase();
                let user = await User.findOne({ $and: [{ $or: [{ email: req.body.email }, { mobileNumber: mobileNumber }] }], userType: "Admin" });
                if (!user) {
                        req.body.password = bcrypt.hashSync(req.body.password, 8);
                        req.body.userType = "Admin";
                        req.body.accountVerification = true;
                        const userCreate = await User.create(req.body);
                        return res.status(200).send({ message: "registered successfully ", data: userCreate, });
                } else {
                        return res.status(409).send({ message: "Already Exist", data: [] });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Server error" });
        }
};
exports.signin = async (req, res) => {
        try {
                const { email, password } = req.body;
                const user = await User.findOne({ email: email, userType: "Admin" });
                if (!user) {
                        return res
                                .status(404)
                                .send({ message: "user not found ! not registered" });
                }
                const isValidPassword = bcrypt.compareSync(password, user.password);
                if (!isValidPassword) {
                        return res.status(401).send({ message: "Wrong password" });
                }
                const accessToken = await jwt.sign({ id: user._id }, authConfig.secret, {
                        expiresIn: authConfig.accessTokenTime,
                });
                let obj = {
                        fullName: user.fullName,
                        firstName: user.fullName,
                        lastName: user.lastName,
                        mobileNumber: user.mobileNumber,
                        email: user.email,
                        userType: user.userType,
                }
                return res.status(201).send({ data: obj, accessToken: accessToken });
        } catch (error) {
                console.error(error);
                return res.status(500).send({ message: "Server error" + error.message });
        }
};
exports.userList = async (req, res) => {
        try {
                const findContest = await User.find({ userType: "User" });
                if (findContest.length == 0) {
                        return res.status(404).json({ status: 404, message: 'User not found.', });
                }
                return res.status(200).json({ status: 200, message: 'User data fetch sucessfully.', data: findContest });
        } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal server error.' });
        }
};
exports.getUserById = async (req, res) => {
        try {
                const data = await User.findById(req.params.id)
                if (!data || data.length === 0) {
                        return res.status(400).send({ msg: "not found" });
                }
                return res.status(200).json({ status: 200, message: "User data found.", data: data });
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
};
exports.deleteUser = async (req, res) => {
        try {
                const data = await User.findById(req.params.id);
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                } else {
                        const data1 = await User.findByIdAndDelete(data._id);
                        return res.status(200).json({ status: 200, message: "User delete successfully.", data: {} });
                }
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
};
exports.AddHowToPlay = async (req, res) => {
        try {
                const categories = await howToPlay.findOne({})
                if (categories) {
                        let obj = {
                                description: req.body.description || categories.description,
                        }
                        const data1 = await howToPlay.findByIdAndUpdate({ _id: categories._id }, { $set: obj }, { new: true });
                        if (data1) {
                                return res.status(200).json({ status: 200, message: "How To Play is add successfully. ", data: data1 })
                        }
                } else {
                        const Data = await howToPlay.create(req.body);
                        if (Data) {
                                return res.status(200).json({ status: 200, message: "How To Play is add successfully. ", data: Data })
                        }
                }
        } catch (err) {
                console.log(err);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getHowToPlay = async (req, res) => {
        const categories = await howToPlay.findOne({})
        if (categories) {
                return res.status(201).json({ message: "How To Play Found", status: 200, data: categories, });
        }
        return res.status(201).json({ message: "How To Play not Found", status: 404, data: {}, });
};
exports.deleteHowToPlay = async (req, res) => {
        try {
                const data = await howToPlay.findOne();
                if (!data) {
                        return res.status(400).send({ msg: "not found" });
                } else {
                        const data1 = await howToPlay.findByIdAndDelete(data._id);
                        return res.status(200).json({ status: 200, message: "How To Play delete successfully.", data: {} });
                }
        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
};
exports.createAboutUs = async (req, res) => {
        try {
                const data = await staticContent.findOne({ type: "ABOUTUS" });
                if (data) {
                        let aboutUs = req.body.aboutUs || data.aboutUs;
                        const result = await staticContent.findByIdAndUpdate({ _id: data._id }, { $set: { aboutUs: aboutUs, } }, { new: true });
                        return res.status(200).json({ status: 200, message: "update successfully.", data: result });
                } else {
                        const newAboutUs = {
                                aboutUs: req.body.aboutUs,
                                type: "ABOUTUS"
                        }
                        const result = await staticContent.create(newAboutUs)
                        return res.status(200).json({ status: 200, message: "Data create successfully.", data: result });
                }
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getAboutUs = async (req, res) => {
        try {
                const result = await staticContent.find({ type: "ABOUTUS" });
                if (!result || result.length === 0) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Data found successfully.", data: result });

        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getAboutUsById = async (req, res) => {
        try {
                const data = await staticContent.findById(req.params.id);
                if (!data || data.length === 0) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Data found successfully.", data: data });
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.deleteAboutUs = async (req, res) => {
        try {
                const result = await staticContent.findByIdAndDelete({ _id: req.params.id });
                return res.status(200).json({ message: "ok" })
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.createTerms = async (req, res) => {
        try {
                const data = await staticContent.findOne({ type: "TERMS" });
                if (data) {
                        let terms = req.body.terms || data.terms;
                        const data1 = await staticContent.findOneAndUpdate({ id: data._id }, { terms: terms, type: "TERMS" }, { new: true, });
                        return res.status(200).json({ status: 200, message: "update successfully.", data: data1 });
                } else {
                        if (!req.body.terms) {
                                return res.status(400).send("please specify terms");
                        }
                        const result = await staticContent.create({ terms: req.body.terms, type: "TERMS" });
                        return res.status(200).json({ status: 200, message: "Data create successfully.", data: result });
                }
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getTerms = async (req, res) => {
        try {
                const data = await staticContent.find({ type: "TERMS" });
                if (!data || data.length === 0) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Data found successfully.", data: data });
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getTermsbyId = async (req, res) => {
        try {
                const data = await staticContent.findById(req.params.id);
                if (!data || data.length === 0) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Data found successfully.", data: data });
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.deleteTerms = async (req, res) => {
        try {
                const data = await staticContent.findByIdAndDelete(req.params.id);
                if (!data) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Deleted Successfully", });
        } catch (err) {
                console.log(err.message);
                return res.status(500).send({ msg: "internal server error", error: err.message });
        }
};
exports.createPrivacy = async (req, res) => {
        try {
                const data = await staticContent.findOne({ type: "PRIVACY" });
                if (!data) {
                        if (!req.body.privacy) {
                                return res.status(400).send("please specify privacy");
                        }
                        const result = await staticContent.create({ privacy: req.body.privacy, type: "PRIVACY" });
                        return res.status(200).json({ status: 200, message: "Data create successfully.", data: result });
                } else {
                        let privacy = req.body.privacy || data.privacy;
                        const data1 = await staticContent.findByIdAndUpdate({ _id: data._id }, { privacy: privacy, type: data.type }, { new: true, });
                        return res.status(200).json({ status: 200, message: "update successfully.", data: data1 });
                }
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getPrivacy = async (req, res) => {
        try {
                const data = await staticContent.find({ type: "PRIVACY" });
                if (!data || data.length === 0) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Data found successfully.", data: data });
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getPrivacybyId = async (req, res) => {
        try {
                const data = await staticContent.findById(req.params.id);
                if (!data || data.length === 0) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Data found successfully.", data: data });
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.deletePrivacy = async (req, res) => {
        try {
                const data = await staticContent.findByIdAndDelete(req.params.id);
                if (!data) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Deleted Successfully", });
        } catch (err) {
                console.log(err.message);
                return res.status(500).send({ msg: "internal server error", error: err.message });
        }
};
exports.createLegality = async (req, res) => {
        try {
                const data = await staticContent.findOne({ type: "LEGALITY" });
                if (!data) {
                        if (!req.body.legality) {
                                return res.status(400).send("please specify legality");
                        }
                        const result = await staticContent.create({ legality: req.body.legality, type: "LEGALITY" });
                        return res.status(200).json({ status: 200, message: "Data create successfully.", data: result });
                } else {
                        let legality = req.body.legality || data.legality;
                        const data1 = await staticContent.findByIdAndUpdate({ _id: data._id }, { legality: legality, type: data.type }, { new: true, });
                        return res.status(200).json({ status: 200, message: "update successfully.", data: data1 });
                }
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getLegality = async (req, res) => {
        try {
                const data = await staticContent.find({ type: "LEGALITY" });
                if (!data || data.length === 0) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Data found successfully.", data: data });
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getLegalitybyId = async (req, res) => {
        try {
                const data = await staticContent.findById(req.params.id);
                if (!data || data.length === 0) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Data found successfully.", data: data });
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.deleteLegality = async (req, res) => {
        try {
                const data = await staticContent.findByIdAndDelete(req.params.id);
                if (!data) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Deleted Successfully", });
        } catch (err) {
                console.log(err.message);
                return res.status(500).send({ msg: "internal server error", error: err.message });
        }
};
exports.createPointSystem = async (req, res) => {
        try {
                const data = await pointSystem.findOne({});
                if (data) {
                        const newPointSystem = {
                                battingRun: req.body.battingRun || data.battingRun,
                                battingFourBonus: req.body.battingFourBonus || data.battingFourBonus,
                                battingSixBonus: req.body.battingSixBonus || data.battingSixBonus,
                                battingThirtyBonus: req.body.battingThirtyBonus || data.battingThirtyBonus,
                                battingHalfCenturyBonus: req.body.battingHalfCenturyBonus || data.battingHalfCenturyBonus,
                                battingCenturyBonus: req.body.battingCenturyBonus || data.battingCenturyBonus,
                                battingDisMissalForDuck: req.body.battingDisMissalForDuck || data.battingDisMissalForDuck,
                                bowlingWicketExceptRunOut: req.body.bowlingWicketExceptRunOut || data.bowlingWicketExceptRunOut,
                                bowlingMaidenOver: req.body.bowlingMaidenOver || data.bowlingMaidenOver,
                                bowlingLBW: req.body.bowlingLBW || data.bowlingLBW,
                                threeWicketHaulBonus: req.body.threeWicketHaulBonus || data.threeWicketHaulBonus,
                                fourWicketHaulBonus: req.body.fourWicketHaulBonus || data.fourWicketHaulBonus,
                                fiveWicketHaulBonus: req.body.fiveWicketHaulBonus || data.fiveWicketHaulBonus,
                                fieldingCatch: req.body.fieldingCatch || data.fieldingCatch,
                                fieldingThreeCatch: req.body.fieldingThreeCatch || data.fieldingThreeCatch,
                                fieldingStumping: req.body.fieldingStumping || data.fieldingStumping,
                                fieldingRunOutDirect: req.body.fieldingRunOutDirect || data.fieldingRunOutDirect,
                                fieldingRunOutMultiplayerInvolved: req.body.fieldingRunOutMultiplayerInvolved || data.fieldingRunOutMultiplayerInvolved
                        }
                        const result = await pointSystem.findByIdAndUpdate({ _id: data._id }, { $set: newPointSystem }, { new: true });
                        return res.status(200).json({ status: 200, message: "update successfully.", data: result });
                } else {
                        const newPointSystem = {
                                battingRun: req.body.battingRun,
                                battingFourBonus: req.body.battingFourBonus,
                                battingSixBonus: req.body.battingSixBonus,
                                battingThirtyBonus: req.body.battingThirtyBonus,
                                battingHalfCenturyBonus: req.body.battingHalfCenturyBonus,
                                battingCenturyBonus: req.body.battingCenturyBonus,
                                battingDisMissalForDuck: req.body.battingDisMissalForDuck,
                                bowlingWicketExceptRunOut: req.body.bowlingWicketExceptRunOut,
                                bowlingMaidenOver: req.body.bowlingMaidenOver,
                                bowlingLBW: req.body.bowlingLBW,
                                threeWicketHaulBonus: req.body.threeWicketHaulBonus,
                                fourWicketHaulBonus: req.body.fourWicketHaulBonus,
                                fiveWicketHaulBonus: req.body.fiveWicketHaulBonus,
                                fieldingCatch: req.body.fieldingCatch,
                                fieldingThreeCatch: req.body.fieldingThreeCatch,
                                fieldingStumping: req.body.fieldingStumping,
                                fieldingRunOutDirect: req.body.fieldingRunOutDirect,
                                fieldingRunOutMultiplayerInvolved: req.body.fieldingRunOutMultiplayerInvolved
                        }
                        const result = await pointSystem.create(newPointSystem)
                        return res.status(200).json({ status: 200, message: "Data create successfully.", data: result });
                }
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getPointSystem = async (req, res) => {
        try {
                const result = await pointSystem.findOne({});
                if (!result || result.length === 0) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Data found successfully.", data: result });

        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getPointSystemById = async (req, res) => {
        try {
                const data = await pointSystem.findById(req.params.id);
                if (!data || data.length === 0) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Data found successfully.", data: data });
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.deletePointSystem = async (req, res) => {
        try {
                const result = await pointSystem.findByIdAndDelete({ _id: req.params.id });
                return res.status(200).json({ message: "ok" })
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.createFAQ = async (req, res) => {
        try {
                const { question, answer } = req.body;
                const newFAQ = await FAQ.create({ question, answer });
                return res.status(201).json({ status: 201, data: newFAQ });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, error: error.message });
        }
};
exports.getAllFAQs = async (req, res) => {
        try {
                const faqs = await FAQ.find();
                return res.status(200).json({ status: 200, data: faqs });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, error: error.message });
        }
};
exports.getFAQById = async (req, res) => {
        try {
                const faqId = req.params.id;
                const faq = await FAQ.findById(faqId);

                if (!faq) {
                        return res.status(404).json({ status: 404, message: 'FAQ not found' });
                }

                return res.status(200).json({ status: 200, data: faq });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, error: error.message });
        }
};
exports.updateFAQById = async (req, res) => {
        try {
                const faqId = req.params.id;
                const updatedFAQ = await FAQ.findByIdAndUpdate(faqId, { $set: req.body }, { new: true });

                if (!updatedFAQ) {
                        return res.status(404).json({ status: 404, message: 'FAQ not found' });
                }

                return res.status(200).json({ status: 200, data: updatedFAQ });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, error: error.message });
        }
};
exports.deleteFAQById = async (req, res) => {
        try {
                const faqId = req.params.id;
                const deletedFAQ = await FAQ.findByIdAndDelete(faqId);

                if (!deletedFAQ) {
                        return res.status(404).json({ status: 404, message: 'FAQ not found' });
                }

                return res.status(200).json({ status: 200, data: deletedFAQ });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, error: error.message });
        }
};
exports.createCallUs = async (req, res) => {
        try {
                const { mobileNumber, email } = req.body;
                const userId = req.user._id;

                const user = await User.findById(userId);
                if (!user) {
                        return res.status(404).json({ status: 404, message: 'User not found' });
                }

                const newContactUs = await CallUs.create({
                        mobileNumber,
                        email,
                });

                return res.status(201).json({ status: 201, data: newContactUs });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, error: error.message });
        }
};
exports.getAllCallUs = async (req, res) => {
        try {
                const contactUsEntries = await CallUs.find();
                return res.status(200).json({ status: 200, data: contactUsEntries });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, error: error.message });
        }
};
exports.getCallUsById = async (req, res) => {
        try {
                const contactUsId = req.params.id;
                const contactUsEntry = await CallUs.findById(contactUsId);

                if (!contactUsEntry) {
                        return res.status(404).json({ status: 404, message: 'Contact us entry not found' });
                }

                return res.status(200).json({ status: 200, data: contactUsEntry });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, error: error.message });
        }
};
exports.updateCallUs = async (req, res) => {
        try {
                const contactUsId = req.params.id;

                const updatedContactUsEntry = await CallUs.findByIdAndUpdate(
                        contactUsId,
                        { $set: req.body },
                        { new: true }
                );

                if (!updatedContactUsEntry) {
                        return res.status(404).json({ status: 404, message: 'Contact Us entry not found' });
                }

                return res.status(200).json({ status: 200, data: updatedContactUsEntry });

        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, error: error.message });
        }
};
exports.deleteCallUs = async (req, res) => {
        try {
                const contactUsId = req.params.id;
                const deletedContactUsEntry = await CallUs.findByIdAndDelete(contactUsId);

                if (!deletedContactUsEntry) {
                        return res.status(404).json({ status: 404, message: 'Contact us entry not found' });
                }

                return res.status(200).json({ status: 200, message: 'Contact us entry deleted successfully' });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, error: error.message });
        }
};
const reffralCode = async () => {
        var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let OTP = '';
        for (let i = 0; i < 6; i++) {
                OTP += digits[Math.floor(Math.random() * 36)];
        }
        return OTP;
}
