import {usePage} from "@inertiajs/react";
import {Customer} from "@/interfaces/customer.ts";
import {Quote} from "@/interfaces/quote.ts";
import {Button} from "@/components/ui/button.tsx";

type Props = {
  customer: Customer;
  quotes: Quote[]
}
export default function Dashboard() {
  const props = usePage<Props>().props;

  return (
    <div className="mb-10">
      {props.quotes.map(quote => (
        <div className="border p-2  flex flex-col gap-2" key={quote.id}>
          <div className="flex justify-between items-center bg-gray-100 p-2">
            <div>Quote: #{quote.id}</div>
            <div>
              <Button onClick={() => window.location.href = `/export-quote-pdf/${quote.id}`}>Export Pdf</Button>
            </div>
          </div>
          <div className="bg-gray-50 p-2">
            <div>
              {quote.quote_items && quote.quote_items.length > 0 ? (
                <table className="table-auto border-collapse w-full">
                  <thead>
                  <tr>
                    <th className="border px-4 py-2 text-start">Product</th>
                    <th className="border px-4 py-2 text-start">Qty</th>
                    <th className="border px-4 py-2 text-start">Price</th>
                    <th className="border px-4 py-2 text-end">Subtotal</th>
                  </tr>
                  </thead>
                  <tbody>
                  {quote.quote_items.map((item) => (
                    <tr key={item.id}>
                      <td className="border px-4 py-2">{item.product.name}</td>
                      <td className="border px-4 py-2">{item.quantity}</td>
                      <td className="border px-4 py-2">${parseFloat(item.product.price).toFixed(2)}</td>
                      <td
                        className="border px-4 py-2 text-end">${(parseFloat(item.product.price) * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              ) : (
                <p>Quote items not fount</p>
              )}
            </div>
            <div className="flex justify-end">
              <div className="px-4 py-2">Total: {quote.total}</div>
            </div>
          </div>
        </div>
      ))}

      {props.quotes.length === 0 && (
        <p className="text-center">No quotes found</p>
      )}
    </div>
  )
}
