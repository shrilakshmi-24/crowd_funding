const mongoose=require('mongoose')
const beneficiarySchema=mongoose.Schema({
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
    Address:{
        type:String
    },
    id_proof:{
        type:String,
        required:true

    },
    document_id:{
        type:String,
        required:true

    },


},
    {
        timestamps:true
    }
)

const Beneficiary=mongoose.model('Beneficiary',beneficiarySchema)

module.exports=Beneficiary