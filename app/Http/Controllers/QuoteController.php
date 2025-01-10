<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use App\Models\QuoteItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class QuoteController extends Controller
{
    /*public function addToCart(Request $request)
    {
        $validated = $request->validate([
            'customer_email' => 'nullable|email|max:255',
            'products' => 'required|array', // Array de productos
            'products.*.id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
        ]);
        $quoteNumber = Str::uuid();
        $total = 0;

        $quote = Quote::create([
            'customer_email' => $validated['customer_email'],
            'quote_number' => $quoteNumber,
            'total' => $total,
        ]);

        foreach ($validated['products'] as $productData) {
            $product = Product::find($productData['id']);
            $quantity = $productData['quantity'];
            $total += $product->price * $quantity;
            $quote->products()->attach($product->id, ['quantity' => $quantity]);
        }

        $quote->total = $total;
        $quote->save();
    }*/

    public function addToCart(Request $request)
    {
        $quote = $this->getQuote();
        $validation = $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

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
            return redirect()->route('customer.login');
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
}
