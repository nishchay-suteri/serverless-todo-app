import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { getTodos } from '../../businessLogic/todo'
import { getJwtToken } from '../utils'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { createLogger } from '../../utils/logger'

const logger = createLogger('http')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing Event: ', event)

    const jwtToken = getJwtToken(event)

    try {
      const items = await getTodos(jwtToken)
      logger.info('getTodo: Success')
      return {
        statusCode: 200,
        body: JSON.stringify({
          items
        })
      }
    } catch (err) {
      logger.error('getTodo: Failure')
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
