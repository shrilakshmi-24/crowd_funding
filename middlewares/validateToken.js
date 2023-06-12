
const jwt=require('jsonwebtoken')
const SECRET_KEY="crowd"


const auth=(req,res,next)=>{
    try{
        let token=req.headers.authorization
        if(token){
            token=token.split(" ")[1]
            let user=jwt.verify(token,SECRET_KEY)
            req.userId=user.id
        }
        else{
            res.status(401).json({message:"Unauthorized User"})
        }
        next()
    }
    catch(error){
        res.status(500).json({message:error.message})
    }

}
module.exports=auth