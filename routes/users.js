const router = require("express").Router();
// bring in the User Registeration 
const  {userRegister}  = require("../utils/auth");

//const User = require("../models/User");

// // test route
// router.get("/", (req,res)=>{
//   User.find().then((user) => res.status(200).json(user));
// })
// router.post("/",(req,res)=>{
  
//     const resource = new User({
//       name: req.body.name,
//       email: req.body.email
//     })
//     resource
//       .save()
//       .then((resource) => {
//         res.status(201).json({
//           message: "new resource created",
//           resource: resource,
//         });
//       })
//       .catch((err) => {
//         console.log(err);
//         res.status(500).json({
//           error: err,
//         });
//       });
// } )

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
router.post("/login-user", async (req, res) => {});
// Admin login Route
router.post("/login-admin", async (req, res) => {});
// Super Admin login Route
router.post("/login-super-admin", async (req, res) => {});

//Profile Route 
router.get("profile", async (req,res)=>{});

//Users  Protected Route
router.post("/user-protected", async (req, res) => {});
// Admin Protected Route
router.post("/admin-protected", async (req, res) => {});
// Super Adminr Protected Route
router.post("/super-admin-protected", async (req, res) => {});

module.exports = router;
