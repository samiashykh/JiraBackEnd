const authenticateUser = async (req, res, next) => {
    console.log("Req Header : ",req.headers)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log("Token is :",token)
    if (token == null) return res.sendStatus(401).json({ message: 'Authentication token missing' });
    const response = await fetch('https://api.github.com/user', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    }).catch((response) => { console.log("Catch error : ", response.message) })
    console.log("Authentication :",response.status)
    if (response.status === 200) {
        next()
    }
}
module.exports = authenticateUser;
