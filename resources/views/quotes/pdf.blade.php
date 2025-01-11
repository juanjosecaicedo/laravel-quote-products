<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quote #{{ $quote->quote_number }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }

        h1 {
            font-size: 24px;
            margin-bottom: 10px;
        }

        h2 {
            font-size: 18px;
            margin-top: 20px;
        }

        p {
            margin: 5px 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        table, th, td {
            border: 1px solid #ddd;
        }

        th, td {
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #f8f8f8;
        }

        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #555;
        }
    </style>
</head>
<body>
<h1>Quote #{{ $quote->quote_number }}</h1>


<p><strong>Email:</strong> {{ $quote->customer_email }}</p>
<p><strong>status:</strong> {{ $quote->is_active ? 'Activa' : 'Inactiva' }}</p>
<p><strong>Total:</strong> ${{ number_format($quote->total, 2) }}</p>


<h2>Items:</h2>
<table>
    <thead>
    <tr>
        <th>Product</th>
        <th>Qty</th>
        <th>Price</th>
        <th>Subtotal</th>
    </tr>
    </thead>
    <tbody>
    @foreach ($quote->quoteItems as $item)
        <tr>
            <td>{{ $item->product->name }}</td>
            <td>{{ $item->quantity }}</td>
            <td>${{ number_format($item->product->price, 2) }}</td>
            <td>${{ number_format($item->product->price * $item->quantity, 2) }}</td>
        </tr>
    @endforeach
    </tbody>
</table>

<div class="footer">
    <p>Thank you for trusting us. If you have any questions, please do not hesitate to contact us.</p>
</div>
</body>
</html>
