const auth = require("../controller/userController");
const authJwt = require("../middleware/authJwt");
const { productUpload, bannerUpload, blogUpload, aboutusUpload, subCategoryUpload, categoryUpload, serviceUpload, userProfileUpload, testimonial } = require('../middleware/imageUpload')
const express = require("express");
const router = express()
module.exports = (app) => {
        app.post("/api/v1/user/social/Login", auth.socialLogin);
        app.post("/api/v1/user/loginWithPhone", auth.loginWithPhone);
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
}