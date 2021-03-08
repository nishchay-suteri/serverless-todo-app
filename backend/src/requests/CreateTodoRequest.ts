/**
 * Fields in a request to create a single TODO item.
 */
// For Refactoring to Business Logiic - Ports- Adapters Architecture
export interface CreateTodoRequest {
  name: string
  dueDate: string
}
