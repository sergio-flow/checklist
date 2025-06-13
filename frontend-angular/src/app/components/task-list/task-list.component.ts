import { Component } from '@angular/core';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TaskService } from '../../../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';
import { Task } from '../../../models/task.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, DragDropModule, TaskFormComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent {
  tasks: Task[] = [];
  loading = true;
  showForm = false;
  editingTask: Task | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.loading = true;

    this.taskService.getTasks().subscribe({
    next: (tasks) => {
        this.tasks = tasks;
        this.loading = false;
    },
    error: (error) => {
        console.error('Error loading tasks:', error);
        this.loading = false;
    }
    });
  }

  onAddTask() {
    this.editingTask = null;
    this.showForm = true;
  }

  onEditTask(task: Task) {
    this.editingTask = task;
    this.showForm = true;
  }

  onDeleteTask(id: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (error) => {
          console.error('Error deleting task:', error);
        }
      });
    }
  }

  onFormSubmit(success: boolean) {
    if (success) {
      this.loadTasks();
    }
    this.showForm = false;
    this.editingTask = null;
  }

  onFormCancel() {
    this.showForm = false;
    this.editingTask = null;
  }

  drop(event: CdkDragDrop<Task[]>) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
    
    // Update order in database
    const orders = this.tasks.map((task, index) => ({
      id: task.id,
      order: index
    }));

    this.taskService.updateTaskOrder({ orders }).subscribe({
      next: () => {
        console.log('Order updated successfully');
      },
      error: (error) => {
        console.error('Error updating order:', error);
        // Reload tasks to revert changes
        this.loadTasks();
      }
    });
  }
}