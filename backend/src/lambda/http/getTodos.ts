import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'

import * as AWS from 'aws-sdk'

import { parseUserId } from '../../auth/utils'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLE

const todoUserIdIndex = process.env.TODO_USER_ID_INDEX

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Processing Event: ', event)

  const authorizationHeader = event.headers.Authorization
  const split = authorizationHeader.split(' ')
  const jwtToken = split[1]

  const userId = parseUserId(jwtToken)

  try {
    const result = await docClient
      .query({
        TableName: todoTable,
        IndexName: todoUserIdIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    const items = result.Items

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        items
      })
    }
  } catch (err) {
    console.log('GetTodo: Error Occurred when Getting ToDo')
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
