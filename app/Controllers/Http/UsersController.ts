import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

import User from 'App/Models/User'
import { DateTime } from 'luxon'

export default class UsersController {
  public async get ({ response}:HttpContextContract) {
    try{
      const users = await User.all()
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
        reset_question:schema.string.optional(),
        reset_answer:schema.string.optional(),
      })
      const newUser = await request.validate({schema:createUserScehma}) as Partial<User>
      console.log(newUser)

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
        name:schema.string({},[
          rules.required(),
        ]),
        email:schema.string({},[
          rules.email(),
        ]),
      })
      const userData = (await request.validate({schema:updateUserScehma}))
      const {name,email} = userData
      user.name = name
      user.email = email
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
      response.status(204).send(
        {
          message:'delete success',
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
