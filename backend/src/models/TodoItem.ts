// For Refactoring to Business Logiic - Ports- Adapters Architecture
export interface TodoItem {
  userId: string
  todoId: string
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
