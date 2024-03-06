const auth = require("../controller/adminController");
const authJwt = require("../middleware/authJwt");

const { productUpload, bannerUpload, blogUpload, aboutusUpload, subCategoryUpload, categoryUpload, serviceUpload, userProfileUpload, testimonial, offerProgram, kpUpload } = require('../middleware/imageUpload')

module.exports = (app) => {
        app.post("/api/v1/admin/registration", auth.registration);
        app.post("/api/v1/admin/signin", auth.signin);
        app.get("/api/v1/admin/userList", auth.userList);
        app.get("/api/v1/admin/User/:id", auth.getUserById);
        app.delete("/api/v1/admin/User/:id", [authJwt.verifyToken], auth.deleteUser);
        app.post("/api/v1/admin/AddHowToPlay", authJwt.verifyToken, auth.AddHowToPlay);
        app.get("/api/v1/admin/getHowToPlay", auth.getHowToPlay);
        app.delete("/api/v1/admin/HowToPlay", [authJwt.verifyToken], auth.deleteHowToPlay);
        app.post('/api/v1/static/createAboutus', [authJwt.verifyToken], auth.createAboutUs);
        app.delete('/api/v1/static/aboutUs/:id', [authJwt.verifyToken], auth.deleteAboutUs);
        app.get('/api/v1/static/getAboutUs', auth.getAboutUs);
        app.get('/api/v1/static/aboutUs/:id', auth.getAboutUsById);
        app.post('/api/v1/static/createPrivacy', [authJwt.verifyToken], auth.createPrivacy);
        app.delete('/api/v1/static/privacy/:id', [authJwt.verifyToken], auth.deletePrivacy);
        app.get('/api/v1/static/getPrivacy', auth.getPrivacy);
        app.get('/api/v1/static/privacy/:id', auth.getPrivacybyId);
        app.post('/api/v1/static/createTerms', [authJwt.verifyToken], auth.createTerms);
        app.delete('/api/v1/static/terms/:id', [authJwt.verifyToken], auth.deleteTerms);
        app.get('/api/v1/static/getTerms', auth.getTerms);
        app.get('/api/v1/static/terms/:id', auth.getTermsbyId);
        app.post('/api/v1/static/createLegality', [authJwt.verifyToken], auth.createLegality);
        app.delete('/api/v1/static/Legality/:id', [authJwt.verifyToken], auth.deleteLegality);
        app.get('/api/v1/static/getLegality', auth.getLegality);
        app.get('/api/v1/static/Legality/:id', auth.getLegalitybyId);
        app.post('/api/v1/admin/createPointSystem', [authJwt.verifyToken], auth.createPointSystem);
        app.delete('/api/v1/admin/PointSystem/:id', [authJwt.verifyToken], auth.deletePointSystem);
        app.get('/api/v1/admin/getPointSystem', auth.getPointSystem);
        app.get('/api/v1/admin/PointSystem/:id', auth.getPointSystemById);
        app.post('/api/v1/admin/faqs/create', [authJwt.verifyToken], auth.createFAQ);
        app.get('/api/v1/admin/faqs', auth.getAllFAQs);
        app.get('/api/v1/admin/faqs/:id', auth.getFAQById);
        app.put('/api/v1/admin/faqs/:id', [authJwt.verifyToken], auth.updateFAQById);
        app.delete('/api/v1/admin/faqs/:id', [authJwt.verifyToken], auth.deleteFAQById);
        app.post('/api/v1/admin/call/us', [authJwt.verifyToken], auth.createCallUs);
        app.get('/api/v1/admin/call-us', auth.getAllCallUs);
        app.get('/api/v1/admin/call-us/:id', auth.getCallUsById);
        app.put('/api/v1/admin/call-us/:id', [authJwt.verifyToken], auth.updateCallUs);
        app.delete('/api/v1/admin/call-us/:id', [authJwt.verifyToken], auth.deleteCallUs);
        app.post('/api/v1/fantacy-help/createFantacySelfHelp', [authJwt.verifyToken], auth.createFantacySelfHelp);
        app.delete('/api/v1/fantacy-help/fantacy/:id', [authJwt.verifyToken], auth.deleteFantacySelfHelp);
        app.get('/api/v1/fantacy-help/getFantacySelfHelp', auth.getFantacySelfHelp);
        app.get('/api/v1/fantacy-help/fantacy/:id', auth.getFantacySelfHelpById);
        app.post('/api/v1/responsible-game/createResponsibleGame', [authJwt.verifyToken], auth.createResponsibleGame);
        app.delete('/api/v1/responsible-game/responsible/:id', [authJwt.verifyToken], auth.deleteResponsibleGame);
        app.get('/api/v1/responsible-game/getResponsibleGame', auth.getResponsibleGame);
        app.get('/api/v1/responsible-game/responsible/:id', auth.getResponsibleGameById);
        app.post("/api/v1/offer/program", [authJwt.verifyToken], offerProgram.single('image'), auth.createOfferAndProgram);
        app.get("/api/v1/offer/program", auth.getAllOfferAndProgram);
        app.get("/api/v1/offer/program/:id", auth.getOfferAndProgramById);
        app.put("/api/v1/offer/program/:id", [authJwt.verifyToken], offerProgram.single('image'), auth.updateOfferAndProgramById);
        app.delete("/api/v1/offer/program/:id", [authJwt.verifyToken], auth.deleteOfferAndProgramById);
        app.post('/api/v1/matches', [authJwt.verifyToken], kpUpload, auth.createMatch);
        app.get('/api/v1/matches', [authJwt.verifyToken], auth.getAllMatches);
        app.get('/api/v1/matches/:id', [authJwt.verifyToken], auth.getMatchById);
        app.put('/api/v1/matches/:id', [authJwt.verifyToken], kpUpload, auth.updateMatchById);
        app.delete('/api/v1/matches/:id', [authJwt.verifyToken], auth.deleteMatchById);
        app.put('/api/v1/matches/:id/status', [authJwt.verifyToken], auth.updateMatchStatusById);
        app.post('/api/v1/contests', [authJwt.verifyToken], auth.createContest);
        app.get('/api/v1/contests', [authJwt.verifyToken], auth.getAllContests);
        app.get('/api/v1/contests/:id', [authJwt.verifyToken], auth.getContestById);
        app.put('/api/v1/contests/:id', [authJwt.verifyToken], auth.updateContestById);
        app.delete('/api/v1/contests/:id', [authJwt.verifyToken], auth.deleteContestById);
        app.put('/api/v1/contests/:id/update-status', [authJwt.verifyToken], auth.updateContestStatusById);
        app.get('/api/v1/contests/by-match/:matchId', [authJwt.verifyToken], auth.getContestsByMatchId);
        app.post('/api/v1/players', [authJwt.verifyToken], auth.createPlayer);
        app.put('/api/v1/players/:id', [authJwt.verifyToken], auth.updatePlayerById);
        app.get('/api/v1/players', [authJwt.verifyToken], auth.getAllPlayer);
        app.get('/api/v1/players/:id', [authJwt.verifyToken], auth.getPlayerById);
        app.delete('/api/v1/players/:id', [authJwt.verifyToken], auth.deletePlayerById);
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