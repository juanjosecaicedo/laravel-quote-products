import {BaggageClaim, ChartCandlestick, FileText, LogOut, ShoppingBag, User} from "lucide-react";
import {Link, usePage, useForm} from "@inertiajs/react";
import {Customer} from "@/interfaces/customer.ts";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {Badge} from "@/components/ui/badge.tsx";
import {Quote, QuoteItem} from "@/interfaces/quote.ts";

type Props = {
  customer: Customer | null;
  flash?: {
    quote?: Quote
  }
}

const INITIAL_PADDING = 'md:py-1';

export default function Navigation() {
  const {customer} = usePage<Props>().props;
  const [padding, setPadding] = useState<string>(INITIAL_PADDING);

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setPadding(scrollTop > 0 ? 'md:py-0' : INITIAL_PADDING);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll); // Limpieza del evento
    };
  }, []);

  const initialPadding = 'md:py-2'

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 0) {
      setPadding('md:py-1')
    } else {
      setPadding(initialPadding);
    }
  })

  const {post} = useForm()

  const handlerLogOut = () => {
    post('/customer-account/logout')
  }

  const [open, setOpen] = useState(false);
  const [quote, setQuote] = useState<Quote | null>(null);

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setOpen(false);
    }
  }

  const [quantity, setQuantity] = useState(0);

  useEffect(() => {

    const handleItemAdded = (event: CustomEvent<any>) => {
      const {detail} = event;
      setQuantity(detail.quote?.quote_items.reduce((acc: number, item: QuoteItem) => acc + item.quantity, 0))
      setQuote(detail.quote);
    }

    window.addEventListener('cart-updated', handleItemAdded as EventListener);
    return () => {
      window.removeEventListener('cart-updated', handleItemAdded as EventListener);
    }
  }, []);

  const exportPdf = () => {
    window.location.href = '/export-quote-pdf';
    setQuote(null)
    setQuantity(0)
  }

  return (
    <>
      <header
        className="max-w-screen-lg mx-auto sticky top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full text-sm">
        <nav
          className={`transition-all duration-300 mt-4 px-2 relative w-full bg-white/60 backdrop-blur-md dark:bg-neutral-900/60 border border-gray-200 rounded-lg mx-2  md:flex md:items-center md:justify-between py-2.5 ${padding} md:px-4 md:mx-auto dark:bg-neutral-900 dark:border-neutral-700`}>
          <div className="flex items-center justify-between">
            <Link
              className="flex-none font-semibold text-xl text-black focus:outline-none focus:opacity-80 dark:text-white"
              href="/" aria-label="Brand">
              <BaggageClaim size={24}/>
            </Link>

            <div className="md:hidden">
              <button type="button"
                      onClick={() => document.getElementById('hs-header-classNameic')?.classList.toggle('hidden')}
                      className="hs-collapse-toggle relative size-9 flex justify-center items-center text-sm font-semibold rounded-full border border-gray-200 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                      id="hs-header-classNameic-collapse" aria-expanded="false" aria-controls="hs-header-classNameic"
                      aria-label="Toggle navigation" data-hs-collapse="#hs-header-classNameic">
                <svg className="hs-collapse-open:hidden size-4" xmlns="http://www.w3.org/2000/svg" width="24"
                     height="24"
                     viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                     strokeLinejoin="round">
                  <line x1="3" x2="21" y1="6" y2="6"/>
                  <line x1="3" x2="21" y1="12" y2="12"/>
                  <line x1="3" x2="21" y1="18" y2="18"/>
                </svg>
                <svg className="hs-collapse-open:block shrink-0 hidden size-4" xmlns="http://www.w3.org/2000/svg"
                     width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                     strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/>
                  <path d="m6 6 12 12"/>
                </svg>
                <span className="sr-only">Toggle navigation</span>
              </button>
            </div>
          </div>

          <div id="hs-header-classNameic"
               className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow md:block"
               aria-labelledby="hs-header-classNameic-collapse">
            <div
              className="overflow-hidden overflow-y-auto max-h-[75vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
              <div className="py-2 md:py-0 flex flex-col md:flex-row md:items-center md:justify-end gap-0.5 md:gap-1">
                <Link
                  className="p-2 flex items-center text-sm text-gray-800 hover:text-gray-500 focus:outline-none focus:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                  href="/">
                  <svg className="shrink-0 size-4 me-3 md:me-2 block md:hidden" xmlns="http://www.w3.org/2000/svg"
                       width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                       strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Home
                </Link>

                <Button variant="link" className="justify-start" onClick={() => setOpen(true)}>
                  <ShoppingBag/>
                  <Badge className="p-1 text-[12px] leading-none">{quantity}</Badge>
                </Button>

                <div
                  className="relative flex items-center gap-x-1.5 md:ps-2.5  md:ms-1.5 before:block before:absolute before:top-1/2 before:-start-px before:w-px before:h-4 before:bg-gray-300 before:-translate-y-1/2 dark:before:bg-neutral-700">
                  {customer ? (
                    <>
                      <Link
                        className="link"
                        href="/customer-account">
                        <ChartCandlestick size={16} className="me-3 md:me-2"/>
                        Account
                      </Link>
                      <Button variant="link" className="text-red-500" onClick={handlerLogOut}>
                        <LogOut size={16} className=""/>
                        <span>Log Out</span>
                      </Button>
                    </>

                  ) : (
                    <Link
                      className="link"
                      href="/customer/login">
                      <User size={16} className="me-3 md:me-2"/>
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Cart items</SheetTitle>
          </SheetHeader>
          <SheetDescription>
            You have {quantity} items in your cart.
          </SheetDescription>
          <div className="flex flex-col gap-2 mt-2">
            {quote?.quote_items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-2 border-b py-2">
                <div
                  className="w-[20%] flex-col space-y-1.5 p-0 h-20 md:h-20  flex items-center justify-center overflow-hidden">
                  <img src={item.product.image} className="w-full object-cover" alt=""/>
                </div>

                <div className="w-[80%] flex flex-col justify-between">
                  <div className="text-sm"><span className="font-semibold">{item.product.name}</span></div>
                  <div className="text-sm">SKU: <span className="font-semibold">{item.product.sku}</span></div>
                  <div className="text-sm">Qty: <span className="font-semibold">{item.quantity}</span></div>
                </div>
              </div>
            ))}
          </div>
          {quote && (
            <div className="mt-10">
              <Button className="w-full " onClick={exportPdf}>

                <span>Export Pdf</span>
                <FileText/>

              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
