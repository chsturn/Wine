import { Component, OnInit, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  private adminService = inject(AdminService);

  users: WritableSignal<User[]> = signal([]);
  error: WritableSignal<string | null> = signal(null);
  success: WritableSignal<string | null> = signal(null);
  roles: string[] = ['User', 'Editor', 'Admin'];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getUsers().subscribe({
      next: (data) => this.users.set(data),
      error: (err) => {
        this.error.set(err.error.msg || 'Failed to load users');
        console.error(err);
      }
    });
  }

  onRoleChange(user: User, event: Event): void {
    const newRole = (event.target as HTMLSelectElement).value;
    this.error.set(null);
    this.success.set(null);

    if (user._id) {
      this.adminService.updateUserRole(user._id, newRole).subscribe({
        next: () => {
          // Update the local user object's role to reflect the change immediately
          this.users.update(currentUsers =>
            currentUsers.map(u => u._id === user._id ? { ...u, role: newRole } : u)
          );
          this.success.set(`Successfully updated ${user.username}'s role to ${newRole}.`);
        },
        error: (err) => {
          this.error.set(err.error.msg || 'Failed to update role');
          // Optionally, reload users to revert the change in the UI
          this.loadUsers();
        }
      });
    }
  }

  deleteUser(userId: string | undefined): void {
    if (!userId) return;
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      this.adminService.deleteUser(userId).subscribe({
        next: () => {
          this.loadUsers(); // Refresh the list
        },
        error: (err) => {
          this.error.set(err.error.msg || 'Failed to delete user');
        }
      });
    }
  }
}
