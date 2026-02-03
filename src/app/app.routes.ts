import { Routes } from "@angular/router";
import { CustomersTable } from "./components/customers-table/customers-table";

export const routes: Routes = [
  {
    path: 'customers',
    component: CustomersTable
  },
  {
    path: 'customers/:id',
    component: CustomersTable
  }
];
