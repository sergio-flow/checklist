import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {
  @Input() task: Task | null = null;
  @Output() taskSubmitted = new EventEmitter<boolean>();
  @Output() cancelled = new EventEmitter<void>();

  taskForm: FormGroup;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['']
    });
  }

  ngOnInit() {
    if (this.task) {
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description
      });
    }
  }

  get isEditing(): boolean {
    return this.task !== null;
  }

  onSubmit() {
    if (this.taskForm.valid && !this.submitting) {
      this.submitting = true;
      const formValue = this.taskForm.value;

      const operation = this.isEditing
        ? this.taskService.updateTask(this.task!.id, formValue)
        : this.taskService.createTask(formValue);

      operation.subscribe({
        next: () => {
          this.submitting = false;
          this.taskSubmitted.emit(true);
        },
        error: (error) => {
          console.error('Error saving task:', error);
          this.submitting = false;
          this.taskSubmitted.emit(false);
        }
      });
    }
  }

  onCancel() {
    this.cancelled.emit();
  }
}