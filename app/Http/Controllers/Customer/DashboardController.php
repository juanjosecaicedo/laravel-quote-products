<?php

namespace App\Http\Controllers\Customer;

use App\Models\Quote;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController
{
    public function index(): \Inertia\Response
    {
        $customer = Auth::guard('customer');
        $email = $customer->user()->email;
        $quotes = Quote::where('customer_email', $email)
            ->with('quoteItems.product:id,name,price,image')
            ->get();


        return Inertia::render('Customer/Dashboard', compact('quotes'));
    }
}
