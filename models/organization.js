const mongoose=require('mongoose')


const organizationSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter a name"]
    },

    code:{
        type:String,
        required:true,

    },
    organization:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    
      }
    
},
    {
        timestamps:true
    }
)

const Organization=mongoose.model('Organization',organizationSchema)

module.exports=Organization

