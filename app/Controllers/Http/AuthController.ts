import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

import User from 'App/Models/User'

export default class AuthController {
  public async login ({ request,response,auth}:HttpContextContract) {
    const {email,password} = request.all()
    const token = await auth.attempt(email,password)
    return token.toJSON()
  }



  public async register ({ request,response,auth}:HttpContextContract) {
    try{
        const createUserScehma = schema.create({
            name:schema.string({},[
                rules.required(),
            ]),
            email:schema.string({},[
                rules.email(),
                rules.unique({table:'users', column:'email'}),
    
            ]),
            password:schema.string({},[
                rules.required(),
                rules.confirmed('confirmPassword'),
            ]),
            reset_question:schema.string.optional(),
            reset_answer:schema.string.optional(),
            })
        const newUser = await request.validate({schema:createUserScehma}) as Partial<User>
        console.log(newUser)
  
        const user = await User.create(newUser)
        response.status(200).json(
          {
            message:'post success',
            user,
  
          }
        )
      } catch(err){
        response.badRequest({
          message:`ERROR ${err.message} `,
          error:{err},
        })
      }
  }
}
