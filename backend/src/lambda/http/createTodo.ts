import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getJwtToken } from '../utils'
import { createTodo } from '../../businessLogic/todo'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing Event: ', event)

    const jwtToken = getJwtToken(event)

    const newTodo: CreateTodoRequest = JSON.parse(event.body) // name & dueDate

    try {
      const newItem = await createTodo(newTodo, jwtToken)
      return {
        statusCode: 201,
        body: JSON.stringify({
          item: newItem
        })
      }
    } catch (err) {
      console.log('CreateTodo: Error Occurred when creating ToDo')
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: err
        })
      }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
