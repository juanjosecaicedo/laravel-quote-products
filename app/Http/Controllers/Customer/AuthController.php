<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\PasswordReset;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Http\{Request, RedirectResponse};
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    private const LOGIN_FORM_PATH = 'Customer/Auth/Login';
    private const REGISTER_FORM_PATH = 'Customer/Auth/Register';
    private const FORGOT_PASSWORD_PATH = 'Customer/Auth/ForgotPassword';

    private const CREATE_PASSWORD_PATH = 'Customer/Auth/CreatePassword';

    public function loginForm(): \Inertia\Response
    {
        return Inertia::render(self::LOGIN_FORM_PATH);
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->only('email', 'password');
        if (Auth::guard('customer')->attempt($credentials)) {
            return redirect()->intended(route('dashboard'));
        }

        return back()->withErrors([
            'error' => 'The provided credentials do not match our records.',
        ]);
    }


    /**
     * Logout the customer.
     *
     * @return RedirectResponse
     */
    public function logout(): RedirectResponse
    {
        Auth::guard('customer')->logout();
        return redirect('/');
    }

    public function registerForm(): \Inertia\Response
    {
        return Inertia::render(self::REGISTER_FORM_PATH);
    }

    public function register(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:customers,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $customer = Customer::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'remember_token' => Str::random(10)
        ]);

        Auth::guard('customer')->login($customer);
        return redirect()->route('dashboard');
    }


    public function forgotPasswordForm(): \Inertia\Response
    {
        return Inertia::render(self::FORGOT_PASSWORD_PATH);
    }

    public function forgotPassword(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'email' => 'required|string|email|max:255|exists:customers,email',
        ], [
            'email.exists' => __('This email address does not exist in our records.'),
        ]);

        $customer = Customer::where('email', $request->email)->first();

        if ($customer) {
            // Generate a password reset token and send email
            $token = Str::random(60);
            DB::table('password_resets')->insert([
                'email' => $request->email,
                'token' => $token,
                'created_at' => now(),
            ]);

            // Send email to the customer with the reset link
            Mail::send('emails.password_reset', ['token' => $token], function ($message) use ($customer) {
                $message->to($customer->email);
                $message->subject(__('Password Reset Request'));
            });
        }

        return back()->with('flash', [
            'message' => __('We have emailed your password reset link!'),
            'status_code' => 200,
            'email_request' => $request->email,
        ]);
    }

    public function resetPasswordForm(Request $request, $token): \Inertia\Response|RedirectResponse
    {
        if (!$token) {
            return redirect()
                ->withErrors(['token' => 'Invalid token'])
                ->route('customer.password.reset');
        }
        $passwordReset = PasswordReset::where('token', $token)->firstOrFail();
        $email = $passwordReset->email;
        $customer = Customer::where('email_address', $email)->first();
        if (!$customer) {
            return redirect()->withErrors([
                'error' => 'This password reset token is invalid.',
            ])->route('customer.password.reset');
        }
        $routeCreatePassword = route('customer.password.create');
        return Inertia::render(self::CREATE_PASSWORD_PATH, compact('customer', 'routeCreatePassword'));
    }

    public function resetPassword(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|string|email|max:255|exists:customers,email',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'email.exists' => __('This email address does not exist in our records.'),
            'password.confirmed' => __('The password confirmation does not match.'),
        ]);

        $customer = Customer::where('email', $request->email)->first();
        $customer->password = Hash::make($request->password);
        $customer->save();

        return redirect()
            ->route('customer.login')
            ->with('flash', [
                'message' => __('Your password has been reset!'),
                'status_code' => 200,
            ]);
    }
}
