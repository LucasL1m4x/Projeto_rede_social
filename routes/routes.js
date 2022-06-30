var express = require("express")
var app = express();
var router = express.Router();
var groupService = require("../services/GroupService");
var userService = require("../services/UserService");
var postService = require("../services/PostService");
const { auth } = require("../services/UserService");

router.post('/user',  userService.create);
router.get('/users', auth, userService.getAll);
router.get('/user/:id', userService.findById);
router.delete('/user/:id', userService.delete);
router.put('/user/:id', userService.update);
router.post('/auth/:id', userService.token);

router.post('/group', groupService.create);
router.get('/groups', groupService.getAll);
router.get('/group/:id', groupService.findById);
router.delete('/group/:id', groupService.delete);
router.put('/group/:id', groupService.update);

router.post('/post', postService.create);
router.get('/posts', postService.getAll);
router.get('/post/:id', postService.findById);
router.delete('/post/:id', postService.delete);
router.put('/post/:id', postService.update);

module.exports = router;
