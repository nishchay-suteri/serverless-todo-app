/**
 * Fields in a request to update a single TODO item.
 */
// For Refactoring to Business Logiic - Ports- Adapters Architecture
export interface UpdateTodoRequest {
  name: string
  dueDate: string
  done: boolean
}
