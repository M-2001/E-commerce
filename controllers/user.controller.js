const {User} = require('../models/userSchema');
const bcrypt = require('bcryptjs')
class UserController{

    static GetUser = async (req, res) =>{
        const userList = await User.find().select('-passwordHash');
    
        if(!userList) {
            res.status(500).json({success: false})
        } 
        res.send(userList);
    }

    static GetUserByID = async (req, res) =>{
        try {
            const user = await User.findById(req.params.id).select('-passwordHash') ;
            if (user) {
                return res.json({ok: true, user});
            }
        } catch (error) {
            return res.status(404).json({ok: false, message: 'User not found!'})
        }
    }

    static RegisterUser = async (req, res)=>{
        let user = new User({ 
            name: req.body.name,
            email: req.body.email,
            passwordHash : bcrypt.hashSync(req.body.password,10),
            street: req.body.street,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country
        })
        user = await user.save();
        if (!user) {
            return res.status(400).send('the user cannot be created')
        }
        res.send(user);
    }

    static GetCountUsers = async (req, res) => {
        try {

            const userCount = await User.countDocuments();
            if (!userCount) {
                res.status(500).json({ ok: false, message: "No count!" })
            }
            res.send({ count: userCount })
        } catch (error) {
            return res.status(500).json({ message: "Something goes wrong!", error })
        }


    }

    static RemoveUser = async (req, res) =>{
        try {
            const user = await User.findByIdAndRemove(req.params.id)
                if(user){
                    return res.status(200).json({ok:false, message:'User deleted'})
                }
                else{
                    return res.status(404).json({ok:false, message:'user not found!'})
                }
        } catch (error) {
            return res.status(500).json({ok:false, message:"Something goes wrong!"})
        }
    }




}

module.exports = UserController;