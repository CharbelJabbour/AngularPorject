// user-details.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
})

export class UserDetailsComponent implements OnInit {
  user: User = { id: 0, first_name: '', last_name: '', avatar: '' };
  
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    this.userService.getUserDetails(Number(userId))
      .subscribe(
        (user) => {
          this.user = user;
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      );
    this.route.params.subscribe((params) => {
      const userId = +params['id'];
      this.loadUserDetails(userId);
    });
  }

  loadUserDetails(userId: number): void {
    this.userService.getUserDetails(userId)
      .subscribe(
        (user) => {
          this.user = (user as any).data as  User; 
        },
        (error) => {
          console.error('Error loading user details:', error);
        }
      );
  }

  goBack(): void {
    this.router.navigate(['/user-list']);
  }
}
