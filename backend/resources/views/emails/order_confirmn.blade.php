<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HAVEN - Xác nhận đơn hàng</title>
    <style>
    body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f7;
        color: #333;
    }

    .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #333333;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .email-header {
        text-align: center;
        padding: 20px 0;
        background-color: #FFBF00;
        color: #ffffff;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }

    .email-header h1 {
        margin: 0;
        font-size: 24px;
    }

    .img-fluid {
        text-align: center;
        margin: 0 auto;
        padding: 20px 0;
    }

    .img-fluid img {
        max-width: 150px;
        height: auto;
        display: block;
        margin: 0 auto;
    }

    .email-content {
        padding: 20px;
    }

    .email-content h2 {
        font-size: 20px;
        color: #ffffff;
    }

    .email-content p {
        line-height: 1.6;
        font-size: 16px;
        color: #ffffff;
    }

    .order-details {
        background-color: #f9f9f9;
        padding: 20px;
        border-radius: 8px;
        margin-top: 20px;
        font-size: 15px;
    }

    .order-details h3 {
        margin-top: 0;
        color: #333;
    }


.order-item {
    display: block; /* Đảm bảo mỗi .order-row sẽ xuống dòng */
}

.order-row {
    padding: 10px 0; /* Khoảng cách giữa các dòng */
    border-bottom: 1px solid #ddd; /* Đường viền dưới để phân chia */
    font-size: 16px;
    color: #333;
}

    .order-item:last-child {
        border-bottom: none;
    }

    .order-summary {
        font-size: 16px;
        color: #333;
        text-align: right;
        margin-top: 20px;
    }

    .order-summary h4 {
        margin: 5px 0;
    }

    .order-summary .total {
        font-weight: bold;
        color: #ffffff;
        font-size: 18px;
    }

    .btn-track-order {
        display: block;
        text-align: center;
        background-color: #FFBF00;
        color: #ffffff;
        padding: 15px;
        margin-top: 20px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: bold;

    }

    .footer {
        text-align: center;
        color: #999;
        font-size: 12px;
        margin-top: 20px;
    }
    </style>
</head>

<body>
    <div class="email-container">
        <!-- Header Section -->
        <div class="img-fluid">
            <img src="https://res.cloudinary.com/dtq5zfk6h/image/upload/v1731262338/cxhxahvjz9seanpdoai4.png"
                alt="Food Haven Logo">
        </div>
        <div class="email-header">
            <h1>CẢM ƠN BẠN ĐÃ ĐẶT HÀNG !</h1>
            <p>Xác nhận đơn hàng <strong>#{{ $order->invoice_code }}</strong> </p>
        </div>

        <!-- Content Section -->
        <div class="email-content">
            <h2>Xin chào {{ $order->full_name }},</h2>
            <p>Chúng tôi rất vui mừng thông báo với bạn rằng chúng tôi đã nhận được đơn hàng của bạn! Dưới đây là thông
                tin chi tiết về đơn hàng của bạn.</p>

            <!-- Order Details Section -->
            <div class="order-details">
                <h3>Thông tin đặt hàng</h3>
                <div class="order-item">
                    <div class="order-row"> Số điện thoai: {{ $order->phone }}</div>
                    <div class="order-row"> Địa chỉ: {{ $order->address }}</div>
                    <div class="order-row"> Phương thức thanh toán:
                        @if($order->payment_method == 1)
                        Thanh toán khi nhận hàng
                        @else
                        Thanh toán VNPay
                        @endif
                    </div>
                </div>
            </div>
        </div>

        <!-- Summary Section -->
        <div class="order-summary">
            <h4 class="total">Tổng tiền: {{ number_format($order->total, 0) }} VND</h4>
        </div>

        <!-- Track Order Button -->
        <a style="color: #ffffff; font-size: 20px;" href="/trackingorder/{{ $order->invoice_code }}" class="btn-track-order">Theo dõi đơn hàng của bạn</a>
    </div>

    <!-- Footer Section -->
    <div class="footer">
        <p>Nếu bạn có câu hỏi gì, vui lòng liên hệ <a href="/contact">Haven</a>.</p>
        <p>&copy; {{ date('Y') }} FOODHAVEN. All rights reserved.</p>
    </div>
    </div>
</body>

</html>
