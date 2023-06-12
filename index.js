require('dotenv').config()
const express=require('express')
const bodyparser=require('body-parser')
const mongoose=require('mongoose')
const Cause=require('./models/causesModel')
const User=require('./models/userModel')
const Beneficiary=require('./models/benificiaryModel')
const Donation=require('./models/donationsModel')
const Transactions=require('./models/transactionModel')
const Organization=require('./models/organization')
const bcrypt=require('bcrypt')
const admin=require('./models/adminModel')
const adminRouter=require('./routes/adminRoutes')
const userRouter = require('./routes/userRoute');
const causeRouter=require('./routes/causeRoute')
const beneficiaryRouter=require('./routes/beneficiaryRoute')
const organizationRouter=require('./routes/organizationRoute')
const donationRouter=require('./routes/donationsRouter')



console.log(process.env.PASSWORD)

app=express()


app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use('/api', userRouter);
app.use('/api', causeRouter);
app.use('/api', beneficiaryRouter);
app.use('/api', organizationRouter);
app.use('/api',donationRouter)
app.use('/api',adminRouter)


app.get('/',(req,res)=>{
    res.send('hello from api')
})


mongoose.connect(process.env.URL)
.then(() => {
    app.listen(3000,()=>{
        console.log("server running at port 3000")
    })
    
  console.log('Connected to MongoDB')
})
.catch((error) => {
  console.log(error)
})
