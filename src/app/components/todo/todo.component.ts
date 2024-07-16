import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { FilterType, TodoModel } from '../../models/todo';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent implements OnInit {
  todolist = signal<TodoModel[]>([]);

  filter = signal<FilterType>('all');

  todoListFiltered = computed(() => {
    const filter = this.filter();
    const todos = this.todolist();

    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);

      case 'completed':
        return todos.filter((todo) => todo.completed);

      default:
        return todos;
    }
  });

  newTodo = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  });

  constructor() {
    effect(() => {
      localStorage.setItem('todos', JSON.stringify(this.todolist()));
    });
  }

  ngOnInit(): void {
    const storedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
    if (storedTodos) {
      this.todolist.set(storedTodos);
    }
  }

  changeFilter(filter: FilterType) {
    this.filter.set(filter);
  }

  addTodo() {
    const newTodoTitle = this.newTodo.value.trim();
    if (this.newTodo.valid && newTodoTitle !== '') {
      this.todolist.update((prev) => {
        return [
          ...prev,
          {
            id: prev.length + 1,
            title: newTodoTitle,
            completed: false,
          },
        ];
      });

      this.newTodo.reset();
    }
  }

  toggleTodo(todoId: number) {
    this.todolist.update((todos) =>
      todos.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  removeTodo(todoId: number) {
    this.todolist.update((prev) => prev.filter((todo) => todo.id !== todoId));
  }

  updateTodoEditing(todoId: number) {
    this.todolist.update((prev) =>
      prev.map((todo) =>
        todo.id === todoId
          ? { ...todo, editing: true }
          : { ...todo, editing: false }
      )
    );
  }

  saveTitleTodo(todoId: number, event: Event) {
    const title = (event.target as HTMLInputElement).value.trim();

    this.todolist.update((prev) =>
      prev.map((todo) =>
        todo.id === todoId ? { ...todo, title, editing: false } : todo
      )
    );
  }
}
