let express = require("express");
let router= express.Router();


let userController = require("../controllers/userController");


router.post('/registerUser',userController.registerUser);
router.post('/login',userController.login);
router.put('/updateUser',userController.updateUser);
router.delete('/deleteUser',userController.deleteUser);
router.get('/viewUsers',userController.viewUsers)


module.exports = router;