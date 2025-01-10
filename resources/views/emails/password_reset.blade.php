<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{__('Reset password')}}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .container {
            width: 100%;
            max-width: 600px;
            margin: 50px auto;
            background-color: #ffffff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
        }

        h1 {
            color: #333333;
        }

        p {
            color: #666666;
            line-height: 1.5;
        }

        a {
            display: inline-block;
            background-color: #0067a5;
            color: #ffffff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
        }

        a:hover {
            background-color: #045888;
        }
    </style>
</head>
<body>
<div class="container">
    <h1>{{__('Password Reset Request')}}</h1>
    <p>{{__('We have received a request to reset your password. You can do it through the following link:')}}</p>
    <a href="{{ url('/customer/reset-password', $token) }}">{{__('Reset Password')}}</a>
    <p>{{__("If you haven't requested a password reset, you don't need to do anything.")}}</p>
    <p>{{__('Thank you,')}}</p>
    <p>{{__('The team of')}} <strong>{{ config('app.name') }}</strong></p>
</div>
</body>
</html>
