import { Component, Inject, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { PageStateService } from '../services/page-state.services';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],

  animations: [
    trigger('slideFromRightToLeft', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-in', style({ transform: 'translateX(0%)' })),
      ]),
    ]),
  ],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  itemsPerPage: number | null = null;
  totalPages: number = 1;
  pageNumber: number = 1;
  searchUserId: number | null = null;
  translateY = 0;
  userNotFound: boolean = false;
  loading: boolean = false;
  searchOff: boolean = true;
  enableNext: boolean = true;
  enablePrev: boolean = true;
  slidingIn: boolean = true;
  slidingOut: boolean = false;

  constructor(
    @Inject(PageStateService) private pageStateService: PageStateService,
    private userService: UserService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  updatePaginationButtons(): void {
    this.enablePrev = this.pageNumber > 1;
    this.enableNext = this.pageNumber < this.totalPages;
  }

  showSpinner(): void {
    this.loading = true;
    this.spinner.show();
  }

  hideSpinner(): void {
    this.loading = false;
    this.spinner.hide();
  }


  loadUsers(): void {
    this.showSpinner();
    const pageNumber = this.pageStateService.getPageNumber() || 1;
    this.userService.getUsers(pageNumber)
      .subscribe(
        (response) => {
          this.users = (response as any).data as User[];
          this.itemsPerPage = (response as any).per_page;
          this.totalPages = (response as any).total_pages;
          this.pageNumber = pageNumber;
        },
        (error) => {
          console.error('Error loading users:', error);
        }
      ).add(() => {
        this.hideSpinner();
        this.updatePaginationButtons();
      });
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.translateY = 0;
      this.pageStateService.setPageNumber(this.pageNumber);
      this.enableNext = true;
      this.enablePrev = false;
      this.loadUsers();
    }
  }

  prevPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.translateY = 100;
      this.pageStateService.setPageNumber(this.pageNumber);
      this.enableNext = false;
      this.enablePrev = true;
      this.loadUsers();
    }
  }

  navigateToUserDetails(userId: number): void {
    this.router.navigate(['user', userId]);
  }

  searchUsers(): void {
    this.showSpinner();
    this.searchOff = false;
    if (this.searchUserId) {
      this.userService.getUserDetails(this.searchUserId)
        .subscribe(
          (response) => {
            if ('data' in response) {
              const userData = response['data'];

              if (Array.isArray(userData)) {
                this.users = userData as User[];
              } else {
                this.users = [userData as User];
              }
              this.userNotFound = false;
            } else { }
          },
          (error) => {
            if (error.status === 404) {
              this.users = [];
              this.userNotFound = true;
            }
          })
        .add(() => {
          this.hideSpinner();
        }
        );
    } else if (this.searchUserId == 0) {
      this.users = [];
      this.hideSpinner();
      this.userNotFound = true;
    } else {
      this.searchOff = true;
      this.userNotFound = false;
      this.loadUsers();
    }
  }

}
