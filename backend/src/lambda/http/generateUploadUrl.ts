import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import * as AWS from 'aws-sdk'

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { createLogger } from '../../utils/logger'

const logger = createLogger('http')

import { updateImageUrl } from '../../businessLogic/todo'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId

    const url = getUploadURL(todoId)
    try {
      await updateImageUrl(bucketName, todoId)
      logger.info(`generateUploadUrl: URL Update Success`)
      return {
        statusCode: 200,
        body: JSON.stringify({
          uploadUrl: url
        })
      }
    } catch (err) {
      logger.error('generateUploadUrl: URL Update Failure')
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: err
        })
      }
    }
  }
)

const getUploadURL = (todoId: string) => {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: parseInt(urlExpiration)
  })
}

handler.use(
  cors({
    credentials: true
  })
)
