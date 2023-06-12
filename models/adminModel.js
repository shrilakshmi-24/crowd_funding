const mongoose=require('mongoose')
const Organization=require('./organization')

const adminSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter a name"]
    },
    emailid:{
        type:String,
        required:[true,"Please enter a email"]
    },

    password:{
        type:String,
        required:true,
    },
    
    org_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    }
  
},
    {
        timestamps:true
    }
)

const Admin=mongoose.model('Admin',adminSchema)

module.exports=Admin