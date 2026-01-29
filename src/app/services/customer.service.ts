import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private http = inject(HttpClient);
  private readonly url = 'customers.json';
  private customersData: Customer[] = [];
  private loaded = false;

  private loadCustomers(): Observable<Customer[]> {
    if (this.loaded) {
      return of(this.customersData);
    }
    return this.http.get<Customer[]>(this.url).pipe(
      tap((data) => {
        this.customersData = [...data];
        this.loaded = true;
      })
    );
  }

  getCustomers(): Observable<Customer[]> {
    return this.loadCustomers();
  }

  deleteCustomers(customerIds: number[]): Observable<void> {
    return this.loadCustomers().pipe(
      tap(() => {
        this.customersData = this.customersData.filter(c => !customerIds.includes(c.id));
      }),
      map(() => void 0)
    );
  }

  addCustomer(customer: Customer): Observable<Customer> {
    return this.loadCustomers().pipe(
      tap(() => {
        const maxId = this.customersData.reduce((max, c) => Math.max(max, c.id), 0);
        customer.id = maxId + 1;
        this.customersData.push(customer);
      }),
      map(() => customer)
    );
  }

  updateCustomer(customer: Customer): Observable<Customer> {
    return this.loadCustomers().pipe(
      tap(() => {
        const index = this.customersData.findIndex(c => c.id === customer.id);
        if (index !== -1) {
          this.customersData[index] = customer;
          console.log('Updated customer:', customer);
        }
      }),
      map(() => customer)
    );
  }

  getCustomerById(id: number): Observable<Customer | undefined> {
    return this.loadCustomers().pipe(
      map(() => this.customersData.find(c => c.id === id))
    );
  }
}
