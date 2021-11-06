import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

import User from 'App/Models/User'
import { DateTime } from 'luxon'

export default class UsersController {
  public async get ({ request,response}:HttpContextContract) {
    try{
      let users = await User.all()
      // to get a user by email
      if(request.qs().email){
        const {email} = request.qs()
        console.log(email)
        users = users.filter(user=>user.email===email)
        // console.log(users)
      }
      response.status(200).send({
        users,
      })
    } catch(err){
      console.log(err)
      response.badRequest({
        message:'err',
        err,
      })
    }
  }

  public async getUser({response,request}){
   
      const id = request.param('id') 
      const user = await User.findOrFail(id)
      response.status(200).send({
        user,
      })
  }


  public async post ({request, response}:HttpContextContract) {
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
        reset_question:schema.string(),
        reset_answer:schema.string(),
        phone_number: schema.string({},[
          rules.mobile()
        ]),
        address:schema.string()
      })
      let newUser = await request.validate({schema:createUserScehma}) as Partial<User>
      newUser.email = newUser.email?.toLowerCase()

      const user = await User.create(newUser)
      response.status(200).send(
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

  public async patch ({request, response}:HttpContextContract) {
    try{
      const id = request.param('id')
      const user = await User.findOrFail(id)
      const updateUserScehma = schema.create({
        address:schema.string({},[
          rules.required(),
        ]),
        email:schema.string({},[
          rules.email(),
          
        ]),
        phone_number: schema.string({},[
          rules.mobile()
        ])
      })
      const userData = (await request.validate({schema:updateUserScehma}))
      const {address,email,phone_number} = userData
      user.email = email
      user.address = address
      user.phone_number = phone_number
      user.updatedAt = DateTime.local()
      
      await user.save()
      response.status(200).send(
        {
          message:'update success',
          user,

        }
      )
    } catch(err){
      response.badRequest({

        message:`ERROR.. ${err.message}`,
        error:err,
        statusCode:400,

      })
    }
  }

  public async delete ({request, response}:HttpContextContract) {
    try {
      const id = request.param('id')
      const user = await User.findOrFail(id)
      await user.delete()
      const users = await User.all()
      response.status(200).send(
        {
          message:'delete success',
          users
        }
      )
    } catch (error) {
      response.badRequest({

        message:`ERROR.. ${error.message}`,
        error,
        statusCode:400,

      })
    }
  }
}
