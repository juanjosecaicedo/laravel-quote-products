<?php

namespace App\Http\Controllers\Customer;

use Inertia\Inertia;

class DashboardController
{
    public function index(): \Inertia\Response
    {
        return Inertia::render('Customer/Dashboard');
    }
}
