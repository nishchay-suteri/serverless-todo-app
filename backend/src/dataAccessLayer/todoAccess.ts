import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as AWS from 'aws-sdk'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

import { createLogger } from '../utils/logger'

const logger = createLogger('dataLayer')

export class TodoAccess {
  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly todoTable = process.env.TODO_TABLE,
    private readonly todoUserIdIndex = process.env.TODO_USER_ID_INDEX
  ) {}

  async createTodo(newItem: TodoItem): Promise<TodoItem> {
    logger.info('Creating ToDo Item ')

    await this.docClient
      .put({
        TableName: this.todoTable,
        Item: newItem
      })
      .promise()

    return newItem
  }

  async getTodoById(todoId: string): Promise<Boolean> {
    logger.info(`Getting ToDo by ID ${todoId}`)

    const result = await this.docClient
      .get({
        TableName: this.todoTable,
        Key: {
          todoId: todoId
        }
      })
      .promise()

    return !!result.Item
  }

  async getTodos(userId: string): Promise<TodoItem[]> {
    logger.info(`Getting ToDos for userId ${userId}`)
    const result = await this.docClient
      .query({
        TableName: this.todoTable,
        IndexName: this.todoUserIdIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()
    const items = result.Items
    return items as TodoItem[]
  }

  async deleteToDo(todoId: string) {
    logger.info(`Deleting ToDo with toDo ID ${todoId}`)
    const key = {
      todoId: todoId
    }
    await this.docClient
      .delete({ TableName: this.todoTable, Key: key })
      .promise()
  }

  async updateToDo(todoId: string, updatedTodo: TodoUpdate) {
    logger.info(`Updating ToDo with todo Id: ${todoId}`)
    await this.docClient
      .update({
        TableName: this.todoTable,
        Key: {
          todoId: todoId
        },
        UpdateExpression:
          'set #namefield = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeNames: {
          '#namefield': 'name'
        },
        ExpressionAttributeValues: {
          ':name': updatedTodo.name,
          ':dueDate': updatedTodo.dueDate,
          ':done': updatedTodo.done
        },
        ReturnValues: 'NONE'
      })
      .promise()
  }
}
