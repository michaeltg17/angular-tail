import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../models/customer';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private http = inject(HttpClient);
  private readonly url = '/api/customers';

  private readonly customersSignal = signal<Customer[]>([]);
  private readonly loadedSignal = signal(false);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  private readonly deleteSuccessSignal = signal(false);

  readonly customers = computed(() => this.customersSignal());
  readonly loading = computed(() => this.loadingSignal());
  readonly error = computed(() => this.errorSignal());
  readonly deleteSuccess = computed(() => this.deleteSuccessSignal());

  private startOp() {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
  }

  private endOp() {
    this.loadingSignal.set(false);
  }

  loadCustomers() {
    if (this.loadedSignal()) return;

    this.startOp();

    this.http.get<Customer[]>(this.url).subscribe({
      next: (data) => {
        this.customersSignal.set(data);
        this.loadedSignal.set(true);
        this.endOp();
      },
      error: (err) => {
        this.errorSignal.set(
          err.status === 404 ? 'Customers file not found' : 'Failed to load customers',
        );
        this.endOp();
      },
    });
  }

  getCustomers() {
    this.loadCustomers();
    return this.customers;
  }

  getCustomerById(id: number) {
    return computed(() => this.customersSignal().find((c) => c.id === id));
  }

  addCustomer(customer: Customer) {
    this.startOp();

    this.http.post<Customer>(this.url, customer).subscribe({
      next: (created) => {
        this.customersSignal.update((c) => [...c, created]);
        this.endOp();
      },
      error: () => {
        this.errorSignal.set('Failed to add customer');
        this.endOp();
      },
    });
  }

  updateCustomer(customer: Customer) {
    this.startOp();

    this.http.put<Customer>(`${this.url}/${customer.id}`, customer).subscribe({
      next: (updated) => {
        this.customersSignal.update((c) => c.map((x) => (x.id === updated.id ? updated : x)));
        this.endOp();
      },
      error: () => {
        this.errorSignal.set('Failed to update customer');
        this.endOp();
      },
    });
  }

  deleteCustomers(ids: number[]) {
    this.startOp();

    this.http.delete<void>(this.url, { body: ids }).subscribe({
      next: () => {
        this.customersSignal.update((c) => c.filter((x) => !ids.includes(x.id)));
        this.deleteSuccessSignal.set(true);
        this.endOp();
      },
      error: () => {
        this.errorSignal.set('Failed to delete customers');
        this.endOp();
      },
    });
  }

  resetDeleteSuccess() {
    this.deleteSuccessSignal.set(false);
  }
}
