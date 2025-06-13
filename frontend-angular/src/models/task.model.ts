export interface Task {
  id: number;
  title: string;
  description: string;
  task_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
}

export interface UpdateTaskRequest {
  title: string;
  description: string;
}

export interface UpdateOrderRequest {
  orders: { id: number; order: number }[];
}