<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Cart;
use App\Models\User;
use App\Models\OrderDetail;
use App\Models\Payment;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderConfirmationMail;

class OrderController extends Controller
{
    public function checkout(Request $request)
{
    $user_id = $request->input('user_id', null);
    $orderData = $request->only([
        'invoice_code', 'full_name', 'phone', 'email', 'total',
        'province', 'district', 'ward', 'address', 'payment_transpot', 'payment_method'
    ]);
    $paymentStatus = 'unpaid';

    // Lấy danh sách sản phẩm từ yêu cầu
    $products = $request->input('product_variant_id', []);

    // Kiểm tra nếu giỏ hàng trống
    if (empty($products)) {
        return response()->json([
            'message' => 'Giỏ hàng trống hoặc sản phẩm không hợp lệ'
        ], 400);
    }

    // Tạo đơn hàng
    $order = Order::create(array_merge($orderData, [
        'user_id' => $user_id,
        'status' => 'pending',
        'payment_status' => $paymentStatus,
    ]));

    // Gửi mail xác nhận đơn hàng
    Mail::to($orderData['email'])->send(new OrderConfirmationMail($order));

    // Thêm sản phẩm vào chi tiết đơn hàng và cập nhật stock
    foreach ($products as $item) {
        $productVariant = ProductVariant::find($item['id']);
        if ($productVariant) {
            $quantity = $item['quantity'];
            OrderDetail::create([
                'order_id' => $order->id,
                'product_variant_id' => $productVariant->id,
                'quantity' => $quantity,
                'price' => $productVariant->price,
            ]);

            // Trừ stock
            $productVariant->stock -= $quantity;
            $productVariant->save();
        }
    }

    // Cộng điểm thưởng nếu là người dùng đã đăng nhập
    $loyaltyPoints = 0;
    if ($user_id) {
        $user = User::find($user_id);
        if ($user) {
            $loyaltyPoints = $orderData['total'] * 0.01;
            $user->point += $loyaltyPoints;
            $user->save();
        }
    }

    // Xóa sản phẩm trong giỏ hàng nếu là người dùng đã đăng nhập
    if ($user_id) {
        Cart::where('user_id', $user_id)
            ->whereIn('product_variant_id', array_column($products, 'id'))
            ->delete();
    }

    return response()->json([
        'message' => 'Order created successfully!',
        'order' => $order,
        'loyalty_points_added' => $loyaltyPoints
    ], 201);
}



    public function showOrder($userId){

        if($userId){
            // Lấy danh sách đơn hàng của người dùng đã đăng nhập
        $orders = Order::where('user_id', $userId)->get();

        return response()->json($orders);
        }

        return response()->json([
            'message' => 'Không có đơn hàng'
        ]);

    }

    public function showOrderdetail($order){

        if($order){
            $order = Order::with(['payment', 'orderDetails','user'])->where('id', $order)->first();
            return response()->json([
                'order' => $order
            ]);
        }
        return response()->json([
            'message' => 'Không có đơn hàng'
        ]);

    }

    public function showOrderdetailcode($ordercode)
{
    if ($ordercode) {
        $order = Order::with([
            'payment',
            'orderDetails.productVariant' => function ($query) {
                $query->select('id', 'name', 'image'); // Chỉ lấy các trường cần thiết
            },
            'user'
        ])->where('invoice_code', $ordercode)->first();

        if ($order) {
            return response()->json([
                'order' => $order
            ]);
        }
    }

}


    public function show(){
        $orders = Order::orderBy('id', 'DESC')->get();
        return response()->json($orders);
    }

    public function updateOrderStatus(Request $request, $orderId)
{
    $order = Order::find($orderId);
    $newStatus = $request->input('status');

    // Định nghĩa các chuyển tiếp trạng thái hợp lệ
    $validStatuses = ['pending', 'preparing', 'transport', 'complete', 'canceled'];

    // Lấy chỉ số của trạng thái hiện tại và trạng thái mới
    $currentStatusIndex = array_search($order->status, $validStatuses);
    $newStatusIndex = array_search($newStatus, $validStatuses);

    // Kiểm tra nếu đơn hàng đã hủy
    if ($order->status === 'canceled') {
        return response()->json(['error' => 'Không thể cập nhật trạng thái đơn hàng đã hủy'], 400);
    }

    // Kiểm tra nếu trạng thái mới hợp lệ
    if ($newStatusIndex === false) {
        return response()->json(['error' => 'Trạng thái không hợp lệ'], 400);
    }

    // Kiểm tra nếu trạng thái mới nhỏ hơn trạng thái hiện tại (quay lại)
    if ($newStatusIndex < $currentStatusIndex) {
        return response()->json(['error' => 'Không thể quay lại trạng thái cũ'], 400);
    }

    // Kiểm tra nếu trạng thái mới giống với trạng thái hiện tại
    if ($newStatusIndex === $currentStatusIndex) {
        return response()->json(['error' => 'Đơn hàng đã ở trạng thái này'], 400);
    }

    $order->status = $newStatus;

    // Kiểm tra nếu đơn hàng đã hoàn thành thì cho payment_status là paid
    if ($newStatus === 'complete') {
        $order->payment_status = 'paid';
    }

    $order->save();

    return response()->json(['message' => 'Cập nhật trạng thái thành công'], 200);
}

public function cancelOrder($orderId)
{
    $order = Order::find($orderId);

    // Kiểm tra nếu đơn hàng tồn tại và có thể hủy
    if (!$order) {
        return response()->json(['error' => 'Đơn hàng không tồn tại'], 404);
    }

    if (in_array($order->status, ['pending', 'preparing'])) {
        // Hoàn lại stock khi hủy
        if (!$order->refunded_stock) {
            foreach ($order->orderDetails as $item) {
                $productVariant = ProductVariant::find($item->product_variant_id);
                if ($productVariant) {
                    $productVariant->stock += $item->quantity;
                    $productVariant->save();
                }
            }
            $order->refunded_stock = true; // xác nhận đã hoàn stock
        }

        // Cập nhật trạng thái đơn hàng
        $order->status = 'canceled';
        $order->save(); // Lưu thay đổi vào cơ sở dữ liệu

        return response()->json(['message' => 'Đơn hàng đã được hủy thành công và hoàn lại stock'], 200);
    }

    return response()->json(['error' => 'Không thể hủy đơn hàng ở trạng thái hiện tại'], 400);
}


public function reorder(Request $request, $orderId)
{
    $user_id = $request->input('user_id', null);
    $order = Order::find($orderId);

    // Kiểm tra xem đơn hàng đã bị hủy hay chưa
    if ($order->status !== 'canceled') {
        return response()->json(['error' => 'Chỉ có thể tạo lại từ đơn hàng đã hủy'], 400);
    }

    // Cập nhật trạng thái đơn hàng từ 'canceled' về 'pending'
    $order->status = 'pending';
    $order->save(); // Lưu thay đổi vào cơ sở dữ liệu

    return response()->json(['message' => 'Đơn hàng đã được tạo lại từ đơn hàng đã hủy'], 201);
}

public function deductPoints(Request $request)
{
    $user_id = $request->input('user_id');
    $usedPoints = $request->input('used_points', 0); // Nhập điểm tích mà người dùng đã dùng

    $user = User::find($user_id);
    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    // Check if the user has enough points
    if ($user->point < $usedPoints) {
        return response()->json(['message' => 'Không đủ điểm tích lũy'], 400);
    }

    // Trừ điểm và lưu lại
    $user->point -= $usedPoints;
    $user->save();

    return response()->json([
        'message' => 'Điểm đã được trừ thành công!',
        'points_used' => $usedPoints,
        'remaining_points' => $user->point
    ], 200);
}


}
