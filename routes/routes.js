var express = require("express")
var app = express();
var router = express.Router();
var groupService = require("../services/GroupService");
var userService = require("../services/UserService");
var postService = require("../services/PostService");
const { auth } = require("../services/UserService");
const LogSessaoService = require("../services/LogSessaoService");

router.post('/user',  userService.create);
router.get('/users', auth, userService.getAll);
router.get('/user/:id', userService.findById);
router.get('/users/:nome', userService.findByName);
router.delete('/user/:id', userService.delete);
router.put('/user/:id', userService.update);
router.post('/auth/:id', userService.token);
router.get('/logs', LogSessaoService.numSessao);

router.post('/group', auth, groupService.create);
router.get('/groups', groupService.getAll);
router.get('/group/:id', groupService.findById);
router.get('/groups/:nome', groupService.findByName);
router.delete('/group/:id', groupService.delete);
router.put('/group/:id', groupService.update);
router.put('/groups/manageMember', auth, groupService.manageMember);

router.post('/post', postService.create);
router.get('/posts', postService.getAll);
router.get('/post/:id', postService.findById);
router.delete('/post/:id', postService.delete);
router.put('/post/:id', postService.update);
router.put('/posts/manageLike', auth, postService.manageLike);
router.put('/posts/addComment', auth, postService.addComment);

module.exports = router;
