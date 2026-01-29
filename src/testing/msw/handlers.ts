import { http, HttpResponse } from 'msw'
import customers from '../../../public/customers.json'

export const handlers = [
  http.get('/api/customers', () => {
    return HttpResponse.json(customers)
  }),

  http.get('/api/customers/:id', ({ params }) => {
    const customer = customers.find(c => c.id === Number(params['id']))
    return customer
      ? HttpResponse.json(customer)
      : new HttpResponse(null, { status: 404 })
  })
]
