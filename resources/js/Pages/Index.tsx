import {Head, usePage, router} from "@inertiajs/react";
import {Product} from "@/interfaces/product.ts";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ShoppingBag} from "lucide-react";
import {toast} from "sonner";
import {Quote} from "@/interfaces/quote.ts";
import {Page} from "@inertiajs/core/types/types";
import {useEffect} from "react";
import axios from "axios";
import {priceFormat} from "@/lib/utils.ts";

type Props = {
  products: Product[],
  flash: {
    message: string
    status_code: number
    quote: Quote
  },
}

export default function Index() {
  const props = usePage<Props>().props;

  useEffect(() => {
    axios.get('/cart').then(response => {
      if (response) {
        const event = new CustomEvent('cart-updated', {
          detail: {
            quote: response.data.quote,
          }
        })
        window.dispatchEvent(event);
      }
    })

  }, []);

  const addToCart = (product: Product) => {
    // @ts-ignore
    router.post('/add-to-cart', {
      product_id: product.id,
      quantity: 1
    }, {
      // @ts-ignore
      onSuccess: (response: Page<Props>) => {
        console.log(response)
        if (response.props.flash.status_code === 401) {
          return;
        }

        toast.success('Product added to cart', {
          position: 'top-right',
          classNames: {
            toast: 'bg-green-100',
            title: 'text-green-500',
            icon: 'text-green-500',
          }
        });

        const event = new CustomEvent('cart-updated', {
          detail: {
            quote: response.props.flash.quote,
          }
        });

        window.dispatchEvent(event);
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
                <p className="mt-1 text-sm"><span className="font-semibold">{priceFormat(product.price)}</span></p>
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
