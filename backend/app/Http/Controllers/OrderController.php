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
        $selectedProductVariantIds = $request->input('product_variant_id', []);
        $orderData = $request->only(['invoice_code','full_name', 'phone', 'email', 'total', 'province', 'district', 'ward', 'address', 'payment_transpot', 'payment_method']);

        // Kiểm tra giỏ hàng của người dùng đã đăng nhập
        if ($user_id) {
            $cartItems = Cart::where('user_id', $user_id)
                             ->whereIn('product_variant_id', $selectedProductVariantIds)
                             ->get();

            // Tính tổng tiền giỏ hàng cho người dùng đã đăng nhập
            // foreach ($cartItems as $item) {
            //     $total += $item->quantity * $item->productVariant->price;
            // }
            if($cartItems->isEmpty()){
                return response()->json([
                    'message' => 'Giỏ hàng người dùng trống'
                ]);
            }

        } else {
            // Người dùng chưa đăng nhập: lấy giỏ hàng từ session
            $cart = $request->session()->get('cart_items', []);
            $cartItems = array_filter($cart, function($item) use ($selectedProductVariantIds) {
                return in_array($item['product_variant_id'], $selectedProductVariantIds);
            });

            // Tính tổng tiền giỏ hàng cho người dùng chưa đăng nhập
            // foreach ($cartItems as $item) {
            //     $product = ProductVariant::find($item['product_variant_id']);
            //     if ($product) {
            //         $total += $item['quantity'] * $product->price;
            //     }
            // }
        }

        // Tính phí vận chuyển (TP.HCM có id là 1)
        // $hoChiMinhProvinceId = 1;
        // $shippingFee = ($request->province == $hoChiMinhProvinceId) ? 0 : 30000;
        // $total += $shippingFee;
        // Xác định trạng thái thanh toán dựa trên phương thức thanh toán   
        
        $paymentStatus = ($orderData['payment_method'] == 1) ? 'unpaid' : 'paid';

        // Tạo đơn hàng
        $order = Order::create(array_merge($orderData, [
            'user_id' => $user_id,
            'status' => 'pending', // hoặc trạng thái mặc định khác
            'payment_status' => $paymentStatus,
        ]));

        Mail::to($orderData['email'])->send(new OrderConfirmationMail($order));

        // Thêm từng sản phẩm vào chi tiết đơn hàng
        foreach ($cartItems as $item) {
            $product = ProductVariant::find($item['product_variant_id']);
            if ($product) {
                OrderDetail::create([
                    'order_id' => $order->id,
                    'product_variant_id' => $item['product_variant_id'],
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                ]);
                $product->stock -= $item->quantity;
                $product->save();
            }
        }

        // Cập nhật điểm tích lũy cho người dùng
    if ($user_id) {
        $user = User::find($user_id);
        if ($user) {
            $loyaltyPoints = $orderData['total'] * 0.01; // 1% của tổng số tiền đơn hàng
            $user->point += $loyaltyPoints;
            $user->save();
        }
    }

        // Cập nhật giỏ hàng: xóa các sản phẩm đã mua khỏi giỏ hàng
        if ($user_id) {
            Cart::where('user_id', $user_id)
                ->whereIn('product_variant_id', $selectedProductVariantIds)
                ->delete();
        } else {
            foreach ($selectedProductVariantIds as $productId) {
                unset($cart[$productId]);
            }
            $request->session()->put('cart_items', $cart);
        }

        return response()->json([
            'message' => 'Order created successfully!',
            'order' => $order,
            'loyalty_points_added' => $user_id ? $loyaltyPoints : 0
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





}
