import 'source-map-support/register'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getJwtToken } from '../utils'
import { createTodo } from '../../businessLogic/todo'

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Processing Event: ', event)

  const jwtToken = getJwtToken(event)

  const newTodo: CreateTodoRequest = JSON.parse(event.body) // name & dueDate

  try {
    const newItem = await createTodo(newTodo, jwtToken)
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: newItem
      })
    }
  } catch (err) {
    console.log('CreateTodo: Error Occurred when creating ToDo')
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: err
      })
    }
  }
}
