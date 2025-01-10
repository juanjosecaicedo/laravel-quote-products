import {usePage} from "@inertiajs/react";
import {Customer} from "@/interfaces/customer.ts";

type Props = {
  customer: Customer;
}
export default function Dashboard() {
  const props = usePage<Props>().props;
  console.log(props)
  return (
    <div>Dashboard</div>
  )
}
