import {Head, usePage, router} from "@inertiajs/react";
import {Product} from "@/interfaces/product.ts";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ShoppingBag} from "lucide-react";
import {toast} from "sonner";


type Props = {
  products: Product[]
}

export default function Index() {
  const props = usePage<Props>().props;

  const addToCart = (product: Product) => {
    router.post('/add-to-cart', {
      product_id: product.id,
      quantity: 1
    }, {
      onSuccess: (respose) => {
        toast.success('Product added to cart', {
          position: 'top-right',
          classNames: {
            toast: 'bg-green-100',
            title: 'text-green-500',
            icon: 'text-green-500',
          }
        });
        console.log(respose)

        const event = new CustomEvent('cart-updated', {
          detail: {
            product,
            quote: respose?.props?.flash,
          }
        })
      }
    })
  }

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <div className="my-10">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white my-2">Products list</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 col-gap-5 gap-y-4 gap-x-2 md:gap-x-4">
          {props.products.map((product) => (
            <Card key={product.id}>
              <CardHeader
                className="p-0 w-full h-64 md:h-72 bg-gray-200 flex items-center justify-center overflow-hidden">
                <img src={product.image} className="object-cover w-full h-full" alt={product.name}/>
              </CardHeader>
              <CardContent className="px-3 mt-5">
                <hr/>
                <CardTitle className="font-normal">{product.name}</CardTitle>
                <p className="mt-1 text-sm">SKU: <span className="font-semibold">{product.sku}</span></p>
                {product.stock < 1 ? (
                  <p className="mt-1 text-red-500">Out of stock</p>
                ) : (
                  <Button className="w-full mt-3" onClick={() => addToCart(product)}>
                    <span>Add to cart</span>
                    <ShoppingBag/>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
