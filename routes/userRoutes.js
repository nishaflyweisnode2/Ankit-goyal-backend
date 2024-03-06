const auth = require("../controller/userController");
const authJwt = require("../middleware/authJwt");
const { productUpload, bannerUpload, blogUpload, aboutusUpload, subCategoryUpload, categoryUpload, serviceUpload, userProfileUpload, testimonial } = require('../middleware/imageUpload')
const express = require("express");
const router = express()
module.exports = (app) => {
        app.post("/api/v1/user/social/Login", auth.socialLogin);
        app.post("/api/v1/user/loginWithPhone", auth.loginWithPhone);
        app.post("/api/v1/user/resendOtp/:id", auth.resendOTP);
        app.post("/api/v1/user/:id", auth.verifyOtp);
        app.post("/api/v1/user/comp/registration", [authJwt.verifyToken], auth.registration);
        app.get("/api/v1/user/getProfile", [authJwt.verifyToken], auth.getProfile);
        app.put("/api/v1/user/updateProfile", [authJwt.verifyToken], userProfileUpload.single('image'), auth.updateProfile);
        app.post("/api/v1/notification/sendNotification", authJwt.verifyToken, auth.sendNotification);
        app.get("/api/v1/notification/allNotification", authJwt.verifyToken, auth.allNotification);
        app.post('/api/v1/wallet/addWallet', [authJwt.verifyToken], auth.addMoney);
        app.post('/api/v1/wallet/removeWallet', [authJwt.verifyToken], auth.removeMoney);
        app.get('/api/v1/wallet/getwallet', [authJwt.verifyToken], auth.getWallet);
        app.get("/api/v1/allTransactionUser", [authJwt.verifyToken], auth.allTransactionUser);
        app.get("/api/v1/allcreditTransactionUser", [authJwt.verifyToken], auth.allcreditTransactionUser);
        app.get("/api/v1/allDebitTransactionUser", [authJwt.verifyToken], auth.allDebitTransactionUser);
        app.post("/api/v1/contest/join", [authJwt.verifyToken], auth.joinContest);
        app.post('/api/v1/contest/join/code', [authJwt.verifyToken], auth.joinContestByCode);
        app.get('/api/v1/upcoming-contests', [authJwt.verifyToken], auth.getUpcomingContests);
        app.get('/api/v1/upcoming-contests/:id', [authJwt.verifyToken], auth.getUpcomingContestById);
        app.get('/api/v1/live-contest', [authJwt.verifyToken], auth.getLiveContests);
        app.get('/api/v1/live-contest/:id', [authJwt.verifyToken], auth.getLiveContestsById);
        app.get('/api/v1/completed-contest', [authJwt.verifyToken], auth.getCompltedContests);
        app.get('/api/v1/completed-contest/:id', [authJwt.verifyToken], auth.getCompltedContestsById);
        app.post('/api/v1/teams', [authJwt.verifyToken], auth.createTeam);
        app.get('/api/v1/teams', [authJwt.verifyToken], auth.getAllTeams);
        app.get('/api/v1/teams/:id', [authJwt.verifyToken], auth.getTeamById);
        app.put('/api/v1/teams/:id', [authJwt.verifyToken], auth.updateTeamById);
        app.delete('/api/v1/teams/:id', [authJwt.verifyToken], auth.deleteTeamById);
        app.get('/api/v1/teams/match/:matchId', [authJwt.verifyToken], auth.findTeamsByMatchId);
        app.get('/api/v1/teams/contest/:contestId', [authJwt.verifyToken], auth.findTeamsByContestId);
        app.post('/api/v1/team/add-player', [authJwt.verifyToken], auth.addPlayerToTeam);
        app.post('/api/v1/team/remove-player', [authJwt.verifyToken], auth.removePlayerFromTeam);



}