const { ObjectId } = require('mongodb');
const User = require("../models/user");

exports.successtoRedirect = (req, res) => {
    console.log("USER : ",req.user)
    res.redirect(`http://localhost:3000/user/Dashbaord?id=${req.user.id}&name=${req.user.name}`);
}

exports.fetchToken = async (req, res) => {
    if (req.body.uid.length > 0) {
        const objectId = new ObjectId(req.body.uid);
        const user = await User.findOne({ _id: objectId });
        const { name, accessToken,email } = user
        if (accessToken.length > 0) {
            res.json({ name, accessToken,email })
        }
    }
}

exports.login = (res) => {
    res.redirect(`http://localhost:3000/`);
}

exports.DashBoardData = async (req, res) => {
    const _id = new ObjectId(req.body.id);
    const user = await User.findOne(
        {
            _id
        }
    )
    //console.log("User : ", user, " On ID : ", _id)
    if (user) {
        res.send({ Introduction: user.Introduction, AssignedMe: user.AssignedMe, Projects: user.Projects, ActivityStream: user.ActivityStream })
    }

}