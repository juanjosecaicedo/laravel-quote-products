<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class IndexController extends Controller
{
    public function index(): \Inertia\Response
    {
        $products = \App\Models\Product::all()->take(12);
        return Inertia::render('Index', compact('products'));
    }
}
