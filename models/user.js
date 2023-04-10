const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
            unique: [true, 'email is already exists'],
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            trim: true,
        },
        githubId: {
            type: String,
        },
        accessToken:{
            type:String,
        },
        created: {
            type: Date,
            default: Date.now
        },
        Introduction:{
            title:{
                type:String
            },
            body:{
                type:String
            }
        },
        AssignedMe:{
            body:{
                type:String
            }
        },
        Projects:[
            {
                projectname:{
                    type:String
                },
                leadname:{
                    type:String
                },
                created: {
                    type: Date,
                    default: Date.now
                },    
            }
        ],
        ActivityStream:[
            {
                companyname:{
                    type:String
                },created: {
                    type: Date,
                    default: Date.now
                },  
            }
        ]
    }
)
module.exports = mongoose.model('user', userSchema);