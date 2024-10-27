<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Cart;
use App\Models\User;
use App\Models\OrderDetail;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderConfirmationMail;

class OrderController extends Controller
{ 
    public function checkout(Request $request)
    {
        $user_id = $request->input('user_id', null);
        $selectedProductVariantIds = $request->input('product_variant_id', []);
        $orderData = $request->only(['full_name', 'phone', 'email', 'total', 'province', 'district', 'ward', 'address', 'payment_transpot', 'payment_method']);

        // Kiểm tra giỏ hàng của người dùng đã đăng nhập
        if ($user_id) {
            $cartItems = Cart::where('user_id', $user_id)
                             ->whereIn('product_variant_id', $selectedProductVariantIds)
                             ->get();

            // Tính tổng tiền giỏ hàng cho người dùng đã đăng nhập
            // foreach ($cartItems as $item) {
            //     $total += $item->quantity * $item->productVariant->price;
            // }

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

    }

    public function showOrderdetail($order){

        if($order){
            // Lấy danh sách đơn hàng của người dùng đã đăng nhập
        $orderdetail = OrderDetail::where('order_id', $order)->get();

        return response()->json($orderdetail);
        }

    }

    public function show(){
        $orders = Order::orderBy('id', 'DESC')->get();
        return response()->json($orders);
    }
}
