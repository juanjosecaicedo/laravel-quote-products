<?php

use App\Http\Controllers\IndexController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Customer\AuthController;
use App\Http\Controllers\Customer\DashboardController;
use App\Http\Controllers\QuoteController;

Route::get('/', [IndexController::class, 'index'])->name('index');


Route::middleware('guest:customer')->prefix('customer')->group(function () {
    Route::get('/login', [AuthController::class, 'loginForm'])->name('customer.login');
    Route::post('/login', [AuthController::class, 'login'])->name('customer.login.submit');
    Route::get('/register', [AuthController::class, 'registerForm'])->name('customer.register');
    Route::post('/register', [AuthController::class, 'register'])->name('customer.register.submit');
    Route::get('/forgot-password', [AuthController::class, 'forgotPasswordForm'])->name('customer.forgot-password');
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->name('customer.forgot-password.submit');
    Route::get('/reset-password/{token}', [AuthController::class, 'resetPasswordForm'])->name('customer.reset-password');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('customer.reset-password.submit');
});

Route::middleware([\App\Http\Middleware\RedirectIfNotCustomer::class])->prefix('customer-account')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/logout', [AuthController::class, 'logout'])->name('customer.logout');
});

Route::post('/add-to-cart', [QuoteController::class, 'addToCart'])->name('quotes.addProduct');
Route::get('/cart', [QuoteController::class, 'cart'])->name('quotes.cart');
Route::get('/export-quote-pdf', [QuoteController::class, 'exportPdf'])->name('quotes.exportPdf');



