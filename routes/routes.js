import express from 'express'
const router = express.Router()
import User from '../models/User.js'


router.post('/register',async (req,res)=>{
    const {name, contactNumber, bank} = req.body
    const user = await User.findOne({contactNumber:+contactNumber})
     if(user){
        res.status(400).send(" User already registered")
        return;
    }
    const newUser = new User({name:name, contactNumber:contactNumber, bank:bank})
    newUser.bank[0].isPrimary=true
    newUser.bank[0].name = newUser.bank[0].name.toUpperCase()
    await newUser.save()
    res.status(200).json(newUser)
})
 
router.get('/user/:contactnumber',async(req,res)=>{
    console.log(req.params.contactnumber)
    let user = await User.findOne({contactNumber:+req.params.contactnumber})
    if(!user){
        res.status(400).send(" not a valid user")
        return; 
    }
    res.status(200).json(user);
})



router.post('/addMoney/:contactnumber/:bank/:amount',async (req,res)=>{
    let user = await User.findOne({contactNumber:req.params.contactnumber})
    if(!user){
        res.status(400).send(" not a valid user")
        return;
    }
    let flag =false;
    user.bank.forEach((elem,index)=>{
        if(elem.name === req.params.bank.toUpperCase()){
            elem.amount += (+req.params.amount)
            flag = true;
            return
        
        }
    })
    if(!flag){
        res.status(400).send("Bank doesnot exist")
        return;
    }
    await user.save();
    res.status(200).json(user.bank)
})


router.get('/user/totalBalance/:contactnumber',async (req,res)=>{
    let user = await User.findOne({contactNumber:+req.params.contactnumber})
    if(!user){
        res.status(400).send(" not a valid user")
        return;
    }
  
    const totalAmount = await user.getBankBalance()
    console.log(totalAmount); 
    res.status(200).json(totalAmount)
})
export default router

router.post('/pay/:sender/:receiver/:amount', async (req,res)=>{
    const {sender, receiver,amount}= req.params;
    let sUser = await User.findOne({contactNumber:+sender});
    let rUser = await User.findOne({contactNumber:+receiver})
    if(!sUser || !rUser){
        res.status(400).send("Not a valid sender or paye")
        return;
    }
    sUser.bank[0].amount;
    rUser.bank[0].amount;
    
    let flag = false
    sUser.bank.forEach((e)=>{
        if(e.isPrimary){
            if (e.amount >= +amount){
                e.amount -= +amount
                return;
            }else{
                res.send("insufficient bank balance")
                flag = true;
                return;
            }
        }
    })
    if(flag ){
        return
    }
    sUser.bank[0].amount;
    rUser.bank[0].amount;
   
    rUser.bank.forEach((e)=>{
        if(e.isPrimary){
            e.amount +=  +amount
        }
    })
    // if sucees then save karenge
    await sUser.save()
    await rUser.save()
    res.status(200).send("payment done")
})

router.put('/setPrimary/:contactnumber/:bank',async (req,res)=>{
    const  {contactnumber, bank} = req.params
    let sUser = await User.findOne({contactNumber:+contactnumber});
    if(!sUser){
        res.status(400).send("not a valid user")
        return
    }
    let pbank;
    sUser.bank.forEach((e)=>{
        if(e.name === bank.toUpperCase()){
            pbank = e.name
            e.isPrimary = true
        }else{
            e.isPrimary = false
        }
    })
    await sUser.save();
    res.status(200).send(`${pbank } is set as primary bank`)
})

router.put('/addBank/:contactnumber/:bank', async (req,res)=>{
    const {contactnumber, bank} = req.params
    let preUser = await  User.findOne({contactNumber:+contactnumber});
    if(!preUser){
        res.status(200).send("user not available")
        return;
    }
    let flag =false;
   
    preUser.bank.forEach((e)=>{
        if(e.name === bank.toUpperCase()){
            flag = true;
            return
        }
    })
    if(flag){
        res.status(400).send("bank already registered")
    }
    preUser.bank.push({name:bank.toUpperCase(),amount:0})
    await preUser.save()
    res.status(200).send("bank added successfully")
})
