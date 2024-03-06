const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var newOTP = require("otp-generators");
const authConfig = require("../configs/auth.config");
const User = require("../model/userModel");
const Notification = require("../model/notification");
const transaction = require('../model/transactionModel');
const Match = require('../model/matchModel');
const Contest = require('../model/contestModel');
const Team = require('../model/teamModel');




exports.registration = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user._id });
                if (user) {
                        if (req.body.refferalCode == null || req.body.refferalCode == undefined) {
                                req.body.otp = newOTP.generate(4, { alphabets: false, upperCase: false, specialChar: false, });
                                req.body.otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
                                req.body.accountVerification = false;
                                req.body.refferalCode = await reffralCode();
                                req.body.completeProfile = true;
                                const userCreate = await User.findOneAndUpdate({ _id: user._id }, req.body, { new: true, });
                                let obj = { id: userCreate._id, completeProfile: userCreate.completeProfile, phone: userCreate.phone }
                                return res.status(200).send({ status: 200, message: "Registered successfully ", data: obj, });
                        } else {
                                const findUser = await User.findOne({ refferalCode: req.body.refferalCode });
                                if (findUser) {
                                        req.body.otp = newOTP.generate(4, { alphabets: false, upperCase: false, specialChar: false, });
                                        req.body.otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
                                        req.body.accountVerification = false;
                                        req.body.userType = "User";
                                        req.body.refferalCode = await reffralCode();
                                        req.body.refferUserId = findUser._id;
                                        req.body.completeProfile = true;
                                        const userCreate = await User.findOneAndUpdate({ _id: user._id }, req.body, { new: true, });
                                        if (userCreate) {
                                                let updateWallet = await User.findOneAndUpdate({ _id: findUser._id }, { $push: { joinUser: userCreate._id } }, { new: true });
                                                let obj = { id: userCreate._id, completeProfile: userCreate.completeProfile, phone: userCreate.phone }
                                                return res.status(200).send({ status: 200, message: "Registered successfully ", data: obj, });
                                        }
                                } else {
                                        return res.status(404).send({ status: 404, message: "Invalid refferal code", data: {} });
                                }
                        }
                } else {
                        return res.status(404).send({ status: 404, msg: "Not found" });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Server error" });
        }
};
exports.loginWithPhone = async (req, res) => {
        try {
                const { phone } = req.body;
                const user = await User.findOne({ phone: phone, userType: "User" });
                if (!user) {
                        let otp = newOTP.generate(4, { alphabets: false, upperCase: false, specialChar: false, });
                        let otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
                        let accountVerification = false;
                        let refferalCode = await reffralCode();
                        const newUser = await User.create({ phone: phone, otp, otpExpiration, refferalCode, accountVerification, userType: "User" });
                        let obj = { id: newUser._id, otp: newUser.otp, phone: newUser.phone }
                        return res.status(200).send({ status: 200, message: "logged in successfully", data: obj });
                } else {
                        const userObj = {};
                        userObj.otp = newOTP.generate(4, { alphabets: false, upperCase: false, specialChar: false, });
                        userObj.otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
                        userObj.accountVerification = false;
                        const updated = await User.findOneAndUpdate({ phone: phone, userType: "User" }, userObj, { new: true, });
                        let obj = { id: updated._id, otp: updated.otp, phone: updated.phone }
                        return res.status(200).send({ status: 200, message: "logged in successfully", data: obj });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Server error" });
        }
};
exports.resendOTP = async (req, res) => {
        const { id } = req.params;
        try {
                const user = await User.findOne({ _id: id, userType: "User" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found" });
                }
                const otp = newOTP.generate(4, { alphabets: false, upperCase: false, specialChar: false, });
                const otpExpiration = new Date(Date.now() + 60 * 1000);
                const accountVerification = false;
                const updated = await User.findOneAndUpdate({ _id: user._id }, { otp, otpExpiration, accountVerification }, { new: true });
                let obj = {
                        id: updated._id,
                        otp: updated.otp,
                        phone: updated.phone
                }
                return res.status(200).send({ status: 200, message: "OTP resent", data: obj });
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error" + error.message });
        }
};
exports.verifyOtp = async (req, res) => {
        try {
                const { otp } = req.body;
                const user = await User.findById(req.params.id);
                if (!user) {
                        return res.status(404).send({ message: "user not found" });
                }
                if (user.otp !== otp || user.otpExpiration < Date.now()) {
                        return res.status(400).json({ message: "Invalid OTP" });
                }
                const updated = await User.findByIdAndUpdate({ _id: user._id }, { accountVerification: true }, { new: true });
                const accessToken = await jwt.sign({ id: user._id }, authConfig.secret, {
                        expiresIn: authConfig.accessTokenTime,
                });
                let obj = {
                        userId: updated._id,
                        otp: updated.otp,
                        phone: updated.phone,
                        token: accessToken,
                        completeProfile: updated.completeProfile
                }
                return res.status(200).send({ status: 200, message: "logged in successfully", data: obj });
        } catch (err) {
                console.log(err.message);
                return res.status(500).send({ error: "internal server error" + err.message });
        }
};
exports.getProfile = async (req, res) => {
        try {
                const data = await User.findOne({ _id: req.user._id, })
                if (data) {
                        return res.status(200).json({ status: 200, message: "get Profile", data: data });
                } else {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.updateProfile = async (req, res) => {
        try {
                const data = await User.findOne({ _id: req.user._id, });
                if (data) {
                        let image;
                        if (req.file) {
                                image = req.file.path
                        }
                        let obj = {
                                fullName: req.body.fullName || data.fullName,
                                email: req.body.email || data.email,
                                phone: req.body.phone || data.phone,
                                dob: req.body.dob || data.dob,
                                gender: req.body.gender || data.gender,
                                state: req.body.state || data.state,
                                city: req.body.city || data.city,
                                image: image || data.image,
                        }
                        let update = await User.findByIdAndUpdate({ _id: data._id }, { $set: obj }, { new: true });
                        if (update) {
                                return res.status(200).json({ status: 200, message: "Update profile successfully.", data: update });
                        }
                } else {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.socialLogin = async (req, res) => {
        try {
                const { fullName, email, phone } = req.body;
                const user = await User.findOne({ $and: [{ $or: [{ email }, { phone }] }, { userType: "User" }] });
                if (user) {
                        jwt.sign({ id: user._id }, authConfig.secret, (err, token) => {
                                if (err) {
                                        return res.status(401).send("Invalid Credentials");
                                } else {
                                        let obj = {
                                                userId: user._id,
                                                otp: user.otp,
                                                phone: user.phone,
                                                token: token,
                                                completeProfile: user.completeProfile
                                        }
                                        return res.status(200).send({ status: 200, message: "logged in successfully", data: obj });
                                }
                        });
                } else {
                        let refferalCode = await reffralCode();
                        const newUser = await User.create({ fullName, phone, email, refferalCode, userType: "User" });
                        if (newUser) {
                                jwt.sign({ id: newUser._id }, authConfig.secret, (err, token) => {
                                        if (err) {
                                                return res.status(401).send("Invalid Credentials");
                                        } else {
                                                let obj = {
                                                        userId: newUser._id,
                                                        otp: newUser.otp,
                                                        phone: newUser.phone,
                                                        token: token,
                                                        completeProfile: newUser.completeProfile
                                                }
                                                return res.status(200).send({ status: 200, message: "logged in successfully", data: obj });
                                        }
                                });
                        }
                }
        } catch (err) {
                console.error(err);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.sendNotification = async (req, res) => {
        try {
                const admin = await User.findById({ _id: req.user._id });
                if (!admin) {
                        return res.status(404).json({ status: 404, message: "Admin not found" });
                } else {
                        if (req.body.total == "ALL") {
                                let userData = await User.find({ userType: req.body.sendTo });
                                if (userData.length == 0) {
                                        return res.status(404).json({ status: 404, message: "User not found" });
                                } else {
                                        for (let i = 0; i < userData.length; i++) {
                                                if (userData.deviceToken != null || userData.deviceToken != undefined) {
                                                        let result = await commonFunction.pushNotificationforUser(userData[i].deviceToken, req.body.title, req.body.body);
                                                        let obj = {
                                                                userId: userData[i]._id,
                                                                title: req.body.title,
                                                                body: req.body.body,
                                                                date: req.body.date,
                                                                image: req.body.image,
                                                                time: req.body.time,
                                                        }
                                                        await Notification.create(obj)
                                                        let obj1 = {
                                                                userId: admin._id,
                                                                title: req.body.title,
                                                                body: req.body.body,
                                                                date: req.body.date,
                                                                image: req.body.image,
                                                                time: req.body.time,
                                                        }
                                                        await Notification.create(obj1)
                                                        return res.status(200).json({ status: 200, message: "Notification send successfully." });
                                                } else {
                                                        let obj = {
                                                                userId: userData[i]._id,
                                                                title: req.body.title,
                                                                body: req.body.body,
                                                                date: req.body.date,
                                                                image: req.body.image,
                                                                time: req.body.time,
                                                        }
                                                        await Notification.create(obj)
                                                        let obj1 = {
                                                                userId: admin._id,
                                                                title: req.body.title,
                                                                body: req.body.body,
                                                                date: req.body.date,
                                                                image: req.body.image,
                                                                time: req.body.time,
                                                        }
                                                        await Notification.create(obj1)
                                                        return res.status(200).json({ status: 200, message: "Notification send successfully." });
                                                }
                                        }
                                }
                        }
                        if (req.body.total == "SINGLE") {
                                let userData = await User.findById({ _id: req.body._id, userType: req.body.sendTo });
                                if (!userData) {
                                        return res.status(404).json({ status: 404, message: "Employee not found" });
                                } else {
                                        if (userData.deviceToken != null || userData.deviceToken != undefined) {
                                                let result = await commonFunction.pushNotificationforUser(userData.deviceToken, req.body.title, req.body.body);
                                                let obj = {
                                                        userId: userData._id,
                                                        title: req.body.title,
                                                        body: req.body.body,
                                                        date: req.body.date,
                                                        image: req.body.image,
                                                        time: req.body.time,
                                                }
                                                let data = await Notification.create(obj)
                                                if (data) {
                                                        let obj1 = {
                                                                userId: admin._id,
                                                                title: req.body.title,
                                                                body: req.body.body,
                                                                date: req.body.date,
                                                                image: req.body.image,
                                                                time: req.body.time,
                                                        }
                                                        await Notification.create(obj1)
                                                        return res.status(200).json({ status: 200, message: "Notification send successfully.", data: data });
                                                }
                                        } else {
                                                let obj = {
                                                        userId: userData._id,
                                                        title: req.body.title,
                                                        body: req.body.body,
                                                        date: req.body.date,
                                                        image: req.body.image,
                                                        time: req.body.time,
                                                }
                                                let data = await Notification.create(obj)
                                                if (data) {
                                                        let obj1 = {
                                                                userId: admin._id,
                                                                title: req.body.title,
                                                                body: req.body.body,
                                                                date: req.body.date,
                                                                image: req.body.image,
                                                                time: req.body.time,
                                                        }
                                                        await Notification.create(obj1)
                                                        return res.status(200).json({ status: 200, message: "Notification send successfully.", data: data });
                                                }
                                        }
                                }
                        }
                }
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
}
exports.allNotification = async (req, res) => {
        try {
                const admin = await User.findById({ _id: req.user._id });
                if (!admin) {
                        return res.status(404).json({ status: 404, message: "User not found" });
                } else {
                        let findNotification = await Notification.find({ userId: admin._id }).populate('userId');
                        if (findNotification.length == 0) {
                                return res.status(404).json({ status: 404, message: "Notification data not found successfully.", data: {} })
                        } else {
                                return res.status(200).json({ status: 200, message: "Notification data found successfully.", data: findNotification })
                        }
                }
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
}
exports.addMoney = async (req, res) => {
        try {
                const updatedUser = await User.findByIdAndUpdate(
                        { _id: req.user._id },
                        { $inc: { wallet: parseInt(req.body.balance) } },
                        { new: true }
                );
                if (updatedUser) {
                        const transactionData = {
                                user: req.user._id,
                                date: Date.now(),
                                amount: req.body.balance,
                                type: "Credit",
                        };
                        const createdTransaction = await transaction.create(transactionData);
                        const welcomeMessage = `Welcome, ${updatedUser.fullName}! Thank you for adding money to your wallet.`;
                        const welcomeNotification = new Notification({
                                recipient: updatedUser._id,
                                content: welcomeMessage,
                                type: 'welcome',
                        });
                        await welcomeNotification.save();
                        return res.status(200).json({
                                status: 200,
                                message: "Money has been added.",
                                data: updatedUser,
                        });
                } else {
                        return res.status(404).json({
                                status: 404,
                                message: "No data found",
                                data: {},
                        });
                }
        } catch (error) {
                console.log(error);
                return res.status(500).send({
                        status: 500,
                        message: "Server error.",
                        data: {},
                });
        }
};
exports.removeMoney = async (req, res) => {
        try {
                const updatedUser = await User.findByIdAndUpdate({ _id: req.user._id }, { $inc: { wallet: -parseInt(req.body.balance) } }, { new: true });
                if (updatedUser) {
                        const transactionData = {
                                user: req.user._id,
                                date: Date.now(),
                                amount: req.body.balance,
                                type: "Debit",
                        };
                        const createdTransaction = await transaction.create(transactionData);
                        const welcomeMessage = `Welcome, ${updatedUser.fullName}! Money has been deducted from your wallet.`;
                        const welcomeNotification = new notification({
                                recipient: updatedUser._id,
                                content: welcomeMessage,
                                type: 'welcome',
                        });
                        await welcomeNotification.save();
                        return res.status(200).json({
                                status: 200,
                                message: "Money has been deducted.",
                                data: updatedUser,
                        });
                } else {
                        return res.status(404).json({
                                status: 404,
                                message: "No data found",
                                data: {},
                        });
                }
        } catch (error) {
                console.log(error);
                return res.status(500).send({
                        status: 500,
                        message: "Server error.",
                        data: {},
                });
        }
};
exports.getWallet = async (req, res) => {
        try {
                const data = await User.findOne({ _id: req.user._id, });
                if (data) {
                        return res.status(200).json({ status: 200, message: "get wallet", data: data.wallet });
                } else {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.allTransactionUser = async (req, res) => {
        try {
                const data = await transaction.find({ user: req.user._id }).populate("user");
                return res.status(200).json({ data: data });
        } catch (err) {
                return res.status(400).json({ message: err.message });
        }
};
exports.allcreditTransactionUser = async (req, res) => {
        try {
                const data = await transaction.find({ user: req.user._id, type: "Credit" });
                return res.status(200).json({ data: data });
        } catch (err) {
                return res.status.status(400).json({ message: err.message });
        }
};
exports.allDebitTransactionUser = async (req, res) => {
        try {
                const data = await transaction.find({ user: req.user._id, type: "Debit" });
                return res.status(200).json({ data: data });
        } catch (err) {
                return res.status(400).json({ message: err.message });
        }
};
exports.joinContest = async (req, res) => {
        try {
                const userId = req.user._id
                const { contestId } = req.body;

                const user = await User.findById(userId);
                if (!user) {
                        return res.status(404).json({ status: 404, message: 'User not found' });
                }

                const contest = await Contest.findById(contestId);
                if (!contest) {
                        return res.status(404).json({ status: 404, message: 'Contest not found' });
                }

                if (contest.participants.length >= contest.maxParticipants) {
                        return res.status(400).json({ status: 400, message: 'Contest is already full' });
                }

                if (contest.participants.includes(userId)) {
                        return res.status(400).json({ status: 400, message: 'User is already part of the contest' });
                }

                contest.participants.push(userId);
                await contest.save();

                return res.status(200).json({ status: 200, message: 'User joined the contest successfully', data: contest });
        } catch (error) {
                console.error('Error joining contest:', error);
                return res.status(500).json({ status: 500, error: 'Internal server error' });
        }
};
exports.joinContestByCode = async (req, res) => {
        try {
                const userId = req.user._id
                const { code } = req.body;

                const user = await User.findById(userId);
                if (!user) {
                        return res.status(404).json({ status: 404, message: 'User not found' });
                }

                const contest = await Contest.findOne({ code });

                if (!contest) {
                        return res.status(404).json({ status: 404, message: 'Contest not found for the provided code' });
                }

                if (contest.participants.length >= contest.maxParticipants) {
                        return res.status(400).json({ status: 400, message: 'Contest is already full' });
                }

                if (contest.participants.includes(userId)) {
                        return res.status(400).json({ status: 400, message: 'User is already part of the contest' });
                }

                contest.participants.push(userId);
                await contest.save();

                return res.status(200).json({ status: 200, message: 'Successfully joined the contest via code', data: contest });
        } catch (error) {
                console.error('Error joining contest via code:', error);
                return res.status(500).json({ status: 500, error: 'Internal server error' });
        }
};
exports.getUpcomingContests = async (req, res) => {
        try {
                const userId = req.user._id
                const user = await User.findById(userId);
                if (!user) {
                        return res.status(404).json({ status: 404, message: 'User not found' });
                }
                const upcomingContests = await Contest.find({
                        participants: userId,
                        status: 'pending',
                        startTime: { $gte: new Date() }
                });

                return res.status(200).json({ status: 200, message: 'Upcoming contests retrieved successfully', data: upcomingContests });
        } catch (error) {
                console.error('Error fetching upcoming contests:', error);
                return res.status(500).json({ status: 500, error: 'Internal server error' });
        }
};
exports.getUpcomingContestById = async (req, res) => {
        try {
                const contestId = req.params.id;

                const contest = await Contest.findOne({
                        _id: contestId,
                        status: 'pending',
                        startTime: { $gte: new Date() }
                });

                if (!contest) {
                        return res.status(404).json({ status: 404, message: 'Contest not found or not upcoming' });
                }

                return res.status(200).json({ status: 200, message: 'Upcoming contest retrieved successfully', data: contest });
        } catch (error) {
                console.error('Error fetching upcoming contest by ID:', error);
                return res.status(500).json({ status: 500, error: 'Internal server error' });
        }
};
exports.getLiveContests = async (req, res) => {
        try {
                const userId = req.user._id
                const user = await User.findById(userId);
                if (!user) {
                        return res.status(404).json({ status: 404, message: 'User not found' });
                }
                const upcomingContests = await Contest.find({
                        participants: userId,
                        status: 'active',
                        // startTime: { $gte: new Date() }
                });

                return res.status(200).json({ status: 200, message: 'Upcoming contests retrieved successfully', data: upcomingContests });
        } catch (error) {
                console.error('Error fetching upcoming contests:', error);
                return res.status(500).json({ status: 500, error: 'Internal server error' });
        }
};
exports.getLiveContestsById = async (req, res) => {
        try {
                const contestId = req.params.id;

                const contest = await Contest.findOne({
                        _id: contestId,
                        status: 'active',
                        // startTime: { $gte: new Date() }
                });

                if (!contest) {
                        return res.status(404).json({ status: 404, message: 'Contest not found or not live' });
                }

                return res.status(200).json({ status: 200, message: 'live contest retrieved successfully', data: contest });
        } catch (error) {
                console.error('Error fetching live contest by ID:', error);
                return res.status(500).json({ status: 500, error: 'Internal server error' });
        }
};
exports.getCompltedContests = async (req, res) => {
        try {
                const userId = req.user._id
                const user = await User.findById(userId);
                if (!user) {
                        return res.status(404).json({ status: 404, message: 'User not found' });
                }
                const upcomingContests = await Contest.find({
                        participants: userId,
                        status: 'completed',
                });

                return res.status(200).json({ status: 200, message: 'Upcoming contests retrieved successfully', data: upcomingContests });
        } catch (error) {
                console.error('Error fetching upcoming contests:', error);
                return res.status(500).json({ status: 500, error: 'Internal server error' });
        }
};
exports.getCompltedContestsById = async (req, res) => {
        try {
                const contestId = req.params.id;

                const contest = await Contest.findOne({
                        _id: contestId,
                        status: 'completed',
                        // startTime: { $gte: new Date() }
                });

                if (!contest) {
                        return res.status(404).json({ status: 404, message: 'Contest not found or not completed' });
                }

                return res.status(200).json({ status: 200, message: 'completed contest retrieved successfully', data: contest });
        } catch (error) {
                console.error('Error fetching completed contest by ID:', error);
                return res.status(500).json({ status: 500, error: 'Internal server error' });
        }
};
exports.createTeam = async (req, res) => {
        try {
                const userId = req.user._id
                const { name, contest, players, captain, viceCaptain } = req.body;

                const user = await User.findById(userId);
                if (!user) {
                        return res.status(404).json({ status: 404, message: 'User not found' });
                }

                const checkContest = await Contest.findById(contest);
                if (!checkContest) {
                        return res.status(404).json({ status: 404, message: 'Contest not found' });
                }

                const team = new Team({
                        name,
                        contest,
                        match: checkContest.match,
                        players,
                        captain,
                        viceCaptain,
                        createdBy: user._id
                });

                await team.save();

                const match = await Match.findById(checkContest.match);
                if (!match) {
                        return res.status(404).json({ status: 404, message: 'Match not found' });
                }

                const notification = new Notification({
                        userId: user._id,
                        title: 'Team Created',
                        body: `Your team "${name}" has been created successfully for the match "${match.team1}" Vs "${match.team2}".`,
                });

                await notification.save();

                return res.status(201).json({ status: 201, message: 'Team created successfully', data: team });
        } catch (error) {
                console.error('Error creating team:', error);
                return res.status(500).json({ status: 500, error: 'Internal server error' });
        }
};
exports.getAllTeams = async (req, res) => {
        try {
                const userId = req.user._id

                const user = await User.findById(userId);
                if (!user) {
                        return res.status(404).json({ status: 404, message: 'User not found' });
                }

                const teams = await Team.find({ createdBy: userId });
                return res.status(200).json({ status: 200, message: 'Teams retrieved successfully', data: teams });
        } catch (error) {
                console.error('Error getting teams:', error);
                return res.status(500).json({ status: 500, error: 'Internal server error' });
        }
};
exports.getTeamById = async (req, res) => {
        try {
                const teamId = req.params.id;
                const team = await Team.findById(teamId);
                if (!team) {
                        return res.status(404).json({ status: 404, message: 'Team not found' });
                }
                return res.status(200).json({ status: 200, message: 'Team retrieved successfully', data: team });
        } catch (error) {
                console.error('Error getting team by ID:', error);
                return res.status(500).json({ status: 500, error: 'Internal server error' });
        }
};
exports.updateTeamById = async (req, res) => {
        try {
                const teamId = req.params.id;
                const updates = req.body;
                const updatedTeam = await Team.findByIdAndUpdate(teamId, updates, { new: true });
                if (!updatedTeam) {
                        return res.status(404).json({ status: 404, message: 'Team not found' });
                }
                return res.status(200).json({ status: 200, message: 'Team updated successfully', data: updatedTeam });
        } catch (error) {
                console.error('Error updating team by ID:', error);
                return res.status(500).json({ status: 500, error: 'Internal server error' });
        }
};
exports.deleteTeamById = async (req, res) => {
        try {
                const teamId = req.params.id;
                const deletedTeam = await Team.findByIdAndDelete(teamId);
                if (!deletedTeam) {
                        return res.status(404).json({ status: 404, message: 'Team not found' });
                }
                return res.status(200).json({ status: 200, message: 'Team deleted successfully', data: deletedTeam });
        } catch (error) {
                console.error('Error deleting team by ID:', error);
                return res.status(500).json({ status: 500, error: 'Internal server error' });
        }
};
exports.findTeamsByContestId = async (req, res) => {
        try {
                const userId = req.user._id

                const user = await User.findById(userId);
                if (!user) {
                        return res.status(404).json({ status: 404, message: 'User not found' });
                }

                const contestId = req.params.contestId;
                const teams = await Team.find({ contest: contestId, createdBy: userId })
                        .populate('contest')
                        .populate('match')
                        .populate('players')
                        .populate('captain')
                        .populate('viceCaptain')
                        .populate('createdBy');
                if (!teams || teams.length === 0) {
                        return res.status(404).json({ status: 404, message: 'No teams found for the provided contest ID' });
                }
                return res.status(200).json({ status: 200, message: 'Teams found successfully', data: teams });
        } catch (error) {
                console.error('Error finding teams by contest ID:', error);
                return res.status(500).json({ status: 500, error: 'Internal server error' });
        }
};
exports.findTeamsByMatchId = async (req, res) => {
        try {
                const userId = req.user._id

                const user = await User.findById(userId);
                if (!user) {
                        return res.status(404).json({ status: 404, message: 'User not found' });
                }

                const matchId = req.params.matchId;
                const teams = await Team.find({ match: matchId, createdBy: userId })
                        .populate('contest')
                        .populate('match')
                        .populate('players')
                        .populate('captain')
                        .populate('viceCaptain')
                        .populate('createdBy');
                if (!teams || teams.length === 0) {
                        return res.status(404).json({ status: 404, message: 'No teams found for the provided match ID' });
                }
                return res.status(200).json({ status: 200, message: 'Teams found successfully', data: teams });
        } catch (error) {
                console.error('Error finding teams by match ID:', error);
                return res.status(500).json({ status: 500, error: 'Internal server error' });
        }
};
exports.addPlayerToTeam = async (req, res) => {
        try {
                const { teamId, playerId } = req.body;

                const team = await Team.findById(teamId);
                if (!team) {
                        return res.status(404).json({ status: 404, message: 'Team not found' });
                }

                if (team.players.includes(playerId)) {
                        return res.status(400).json({ status: 400, message: 'Player is already in the team' });
                }

                team.players.push(playerId);

                await team.save();

                return res.status(200).json({ status: 200, message: 'Player added to the team successfully', data: team });
        } catch (error) {
                console.error('Error adding player to team:', error);
                return res.status(500).json({ status: 500, error: 'Internal server error' });
        }
};
exports.removePlayerFromTeam = async (req, res) => {
        try {
                const { teamId, playerId } = req.body;

                const team = await Team.findById(teamId);
                if (!team) {
                        return res.status(404).json({ status: 404, message: 'Team not found' });
                }

                const playerIndex = team.players.indexOf(playerId);
                if (playerIndex === -1) {
                        return res.status(404).json({ status: 404, message: 'Player not found in the team' });
                }

                team.players.splice(playerIndex, 1);

                await team.save();

                return res.status(200).json({ status: 200, message: 'Player removed from the team successfully', data: team });
        } catch (error) {
                console.error('Error removing player from team:', error);
                return res.status(500).json({ status: 500, error: 'Internal server error' });
        }
};





const reffralCode = async () => {
        var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let OTP = '';
        for (let i = 0; i < 9; i++) {
                OTP += digits[Math.floor(Math.random() * 36)];
        }
        return OTP;
}
