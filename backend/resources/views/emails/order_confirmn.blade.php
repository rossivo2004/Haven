<!DOCTYPE html>
<html>
<head>
    <title>Xác nhận đơn hàng</title>
</head>
<body>
    <h1>Cảm ơn bạn đã đặt hàng!</h1>
    <p>Đơn hàng của bạn đã được xác nhận với mã đơn hàng: {{ $order->id }}</p>
    <p>Tổng tiền: {{ number_format($order->total, 0, ',', '.') }} VNĐ</p>
    <p>Thông tin giao hàng:</p>
    <p>Họ và tên: {{ $order->full_name }}</p>
    <p>Số điện thoại: {{ $order->phone }}</p>
    <p>Địa chỉ: {{ $order->address }}</p>
</body>
</html>
