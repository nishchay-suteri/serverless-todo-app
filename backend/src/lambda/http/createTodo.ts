import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import * as AWS from 'aws-sdk'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

import { parseUserId } from '../../auth/utils'

import * as uuid from 'uuid'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLE

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Processing Event: ', event)

  const authorizationHeader = event.headers.Authorization
  const split = authorizationHeader.split(' ')
  const jwtToken = split[1]

  const userId = parseUserId(jwtToken)

  const newTodo: CreateTodoRequest = JSON.parse(event.body) // name & dueDate

  const todoId = uuid.v4()

  const createdAt = new Date().toISOString()

  const newItem = {
    userId: userId,
    todoId: todoId,
    createdAt: createdAt,
    ...newTodo,
    done: false
  }

  // TODO: attachmentUrl ??

  try {
    await docClient
      .put({
        TableName: todoTable,
        Item: newItem
      })
      .promise()
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
  /*
  "item": {
    "todoId": "123",
    "createdAt": "2019-07-27T20:01:45.424Z",
    "name": "Buy milk",
    "dueDate": "2019-07-29T20:01:45.424Z",
    "done": false,
    "attachmentUrl": "http://example.com/image.png"
  }
  */
}
