/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

Route.get('health', async ({ response }) => {
  const report = await HealthCheck.getReport()
  return report.healthy ? response.ok(report) : response.badRequest(report)
})

Route.group(()=>{

  Route.get('users', 'UsersController.get')

  Route.get('users/:id', 'UsersController.getUser')

 

  Route.post('users', 'UsersController.post')

  Route.patch('users/:id','UsersController.patch')

  Route.delete('users/:id', 'UsersController.delete')


})


Route.post('login','AuthController.login')
Route.post('login/google','AuthController.loginWithGoogle')
Route.post('register','UsersController.post')
Route.patch('/forgotPassword','AuthController.updatePassBySecurityQuestion')







Route.get('*',({response})=>{
  response.notFound({
    message:'This route is not implemented',
    StatusCode:404,
  })
})
Route.post('*',({response})=>{
  response.notFound({
    message:'This route is not implemented',
    StatusCode:404,
  })
})

