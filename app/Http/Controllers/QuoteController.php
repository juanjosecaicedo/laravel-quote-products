<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use App\Models\QuoteItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Dompdf\Dompdf;
use Dompdf\Options;

class QuoteController extends Controller
{
    public function cart(): \Illuminate\Http\JsonResponse
    {
        $customer = Auth::guard('customer');
        if (!$customer->check()) {
            return response()->json([]);
        }

        $email = $customer->user()->email;

        try {
            $quote = Quote::where('customer_email', $email)
                ->where('is_active', true)
                ->first();

            return response()->json([
                'quote' => $quote->load(['quoteItems.product']),
            ]);
        } catch (\Throwable $th) {
            return response()->json([]);
        }
    }

    public function addToCart(Request $request)
    {
        $validation = $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $quote = $this->getQuote();
        if (!$quote) {
            return redirect()->route('customer.login')->with('flash', [
                'message' => 'Please login to add products to cart',
                'status_code' => 401,
            ]);
        }

        $existingItem = QuoteItem::where('quote_id', $quote->id)
            ->where('product_id', $validation['product_id'])
            ->first();

        if ($existingItem) {
            // Si el item ya existe, sumar la cantidad
            $existingItem->quantity += $request->input('quantity', 1);
            $existingItem->save();
        } else {
            // Si no existe, crearlo
            QuoteItem::create([
                'quote_id' => $quote->id,
                'product_id' => $validation['product_id'],
                'quantity' => $request->input('quantity', 1),
            ]);
        }

        $total = QuoteItem::where('quote_id', $quote->id)
            ->get()
            ->sum(function ($item) {
                return $item->product->price * $item->quantity;
            });

        $quote->total = $total;
        $quote->save();

        return back()->with('flash', [
            'message' => 'Product added to cart',
            'status_code' => 204,
            'quote' => $quote->load(['quoteItems.product']),
        ]);
    }

    private function getQuote()
    {
        $customer = Auth::guard('customer');
        if (!$customer->check()) {
            return;
        }

        $email = $customer->user()->email;

        $quote = Quote::where('customer_email', $email)
            ->where('is_active', true)
            ->first();

        if (!$quote) {
            $quote = Quote::create([
                'customer_email' => $email,
                'is_active' => true,
                'quote_number' => Str::uuid(),
                'total' => 0,
            ]);
        }
        return $quote;
    }

    private function loadQuote()
    {
        $customer = Auth::guard('customer');
        if (!$customer->check()) {
            return null;
        }
        $email = $customer->user()->email;
        $quote = Quote::where('customer_email', $email)
            ->where('is_active', true)
            ->first();

        return $quote->load(['quoteItems.product']);
    }


    public function exportPdf(): \Symfony\Component\HttpFoundation\StreamedResponse|RedirectResponse
    {
        $quote = $this->loadQuote();
        if (!$quote) {
            return back()->with('flash', [
                'status_code' => 404,
                'message' => __('Quote not found')
            ]);
        }


        // Configurar Dompdf
        $options = new Options();
        $options->set('defaultFont', 'Helvetica');
        $dompdf = new Dompdf($options);

        // Generar contenido HTML para el PDF
        $html = view('quotes.pdf', ['quote' => $quote])->render();

        // Cargar HTML dentro de Dompdf
        $dompdf->loadHtml($html);

        // Opcional: Configurar el tamaño y orientación del PDF
        $dompdf->setPaper('A4', 'portrait');

        // Renderizar el PDF
        $dompdf->render();

        // Enviar el PDF como respuesta para su descarga
        $quote->is_active = false;
        $quote->save();
        return response()->streamDownload(
            fn() => print($dompdf->output()),
            'quote-' . $quote->quote_number . '.pdf'
        );
    }
}
