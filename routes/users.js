const router = require("express").Router();
// bring in the User Registeration 
const  {userRegister,userLogin,userAuth,serializeUser,checkRole}  = require("../utils/auth");

const User = require("../models/User");
const Blog = require("../models/Blog")


//Users Registration Route
router.post('/register-user', async (req,res)=>{
  await userRegister(req.body,'user',res);
})

// Admin Registration Route
router.post("/register-admin", async (req, res) => {
  await userRegister(req.body,'admin',res)
});

// Super Admin Registration Route
router.post("/register-super-admin", async (req, res) => {
  await userRegister(req.body,'superadmin',res)
});

//Users  login Route
router.post("/login-user", async (req, res) => {
  await userLogin(req.body,'user',res)
});
// Admin login Route
router.post("/login-admin", async (req, res) => {
  await userLogin(req.body,'admin',res)
});
// Super Admin login Route
router.post("/login-super-admin", async (req, res) => {
  await userLogin(req.body,'super-admin',res)
});

//Profile Route 
router.get("/profile",userAuth,(req,res)=>{
  return res.json(serializeUser(req.user));
});


//Users  Protected Route
router.get(
  "/user-protected",
  userAuth,
  checkRole(['user']),
   async (req, res) => {
     
     return res.json(serializeUser(req.user));
   });
// Admin Protected Route
router.get(
  "/admin-protected",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    return res.json(serializeUser(req.user));
  }
);
// Super Adminr Protected Route
router.get(
  "/super-admin-protected",
  userAuth,
  checkRole(["admin"]),

  async (req, res) => {
    return res.json(serializeUser(req.user));
  }
);

router.get("/",(req,res)=>{
  User.find()
    
    .then((users) => res.json(users));
})

router.get("/:userId",(req,res)=>{
  const userId = req.params.userId;
  User.findById(userId)
    .populate("posted")
    .then((user) => res.json({ user: user }))
    .catch((err) => res.json({ err: err }));
})

router.post("/:id/blog",(req,res)=>{
  User.findById(req.params.id)
  
  .then(async user=>{ 
    const newBlog = new Blog(req.body)
    user.posted.push(newBlog);
    await user.save()
    await newBlog.save()
    res.json(user)
  })
  .catch(err=>res.status(500).json({Error:err}))
})

module.exports = router;
