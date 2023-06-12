const mongoose=require('mongoose')

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter a name"]
    },

    ph_no:{
        type:Number,
        required:true,

    },
    email:{
        type:String,
        required:true
    },
    profile_img:{
        type:String
    },
    password:{
        type:String

    },
    is_donor:{
        type:Boolean,
        default:false
    },
    is_verified:{
        type:Boolean,
        default:false
    }
},
    {
        timestamps:true
    }
)

const User=mongoose.model('User',userSchema)

module.exports=User