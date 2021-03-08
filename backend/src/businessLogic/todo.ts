import { parseUserId } from '../auth/utils'
import { TodoAccess } from '../dataAccessLayer/todoAccess'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

import * as uuid from 'uuid'

const todoAccess = new TodoAccess()

export async function getTodos(jwtToken: string): Promise<TodoItem[]> {
  const userId: string = parseUserId(jwtToken)
  return await todoAccess.getTodos(userId)
}

export async function createTodo(
  createToDoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {
  const userId: string = parseUserId(jwtToken)
  const todoId = uuid.v4()

  const createdAt = new Date().toISOString()

  // attachmentUrl ??

  const newItem: TodoItem = {
    userId: userId,
    todoId: todoId,
    createdAt: createdAt,
    ...createToDoRequest,
    done: false
  }

  return await todoAccess.createTodo(newItem)
}

export async function updateTodo(
  updateToDoRequest: UpdateTodoRequest,
  todoId: string
) {
  const validTodoId: Boolean = await todoAccess.getTodoById(todoId)

  if (!validTodoId) {
    console.log(`Item to update with id ${todoId} Doesn't exist`)
    throw new Error(`Item to update with id ${todoId} Doesn't exist`)
  }
  const updatedToDo: TodoUpdate = {
    name: updateToDoRequest.name,
    dueDate: updateToDoRequest.dueDate,
    done: updateToDoRequest.done
  }
  return await todoAccess.updateToDo(todoId, updatedToDo)
}

export async function deleteTodo(todoId: string) {
  const validTodoId = await todoAccess.getTodoById(todoId)

  if (!validTodoId) {
    console.log(`Item to delete with id ${todoId} Doesn't exist`)
    throw new Error(`Item to delete with id ${todoId} Doesn't exist`)
  }
  return await todoAccess.deleteToDo(todoId)
}
