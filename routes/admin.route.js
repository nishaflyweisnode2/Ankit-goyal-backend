const auth = require("../controller/adminController");
const authJwt = require("../middleware/authJwt");
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


}