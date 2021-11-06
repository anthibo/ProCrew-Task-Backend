import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'


import User from 'App/Models/User'

export default class AuthController {
  public async login ({ request ,auth,response}:HttpContextContract) {
    let {email,password} = request.all()
    email = email.toLowerCase()
    const token = await auth.attempt(email,password)
    const user = await User.findBy('email',email)
    return response.status(200).json({
      token:`Bearer ${token.token}`,
      email,
      name:user?.name
    })
  }
  
  public async loginWithGoogle({request,response,auth}:HttpContextContract){
    try{
      const {email} = request.all()
      const user = await User.findBy('email',email)
      if(!user){
        throw new Error('This email is not registered in the system. Please register using this email first')
      }
      const {token} = await auth.login(user)
      return response.status(200).json({
        message:'success',
        user:{
          name:user.name,
          email:user.email,
          token:`Bearer ${token}`
        },
        
      })
    }
    catch(err){
      console.log(err)
      response.status(400).json({
        error:'unauthorized to login',
        message:err.message
      })
    }
    
  }

  public async updatePassBySecurityQuestion({request,response}:HttpContextContract){
    try{

      const {email,reset_answer,newPassword,confirmNewPassword} = request.all()
      const user = await User.findBy('email',email)
      if(!user){
        throw new Error('user not found')
      }
      if(newPassword!==confirmNewPassword&&reset_answer!==user.reset_answer){
        throw new Error('Wrong answer and passwords do not match')
      }
      if(reset_answer!==user.reset_answer){
        throw new Error('Wrong answer')
      }
      if(newPassword!==confirmNewPassword){
        throw new Error('Confirm Password missmatch')
      }
      
      user.password = newPassword
      user.save()
      response.status(200).json({
        message:'updated successfully'
      })
      
    }
    catch(err){
      console.log(err)
      response.status(400).json({
        message:'error',
        error:err.message
      })
    }
  }
}
