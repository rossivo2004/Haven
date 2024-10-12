<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\CartRequest;
use App\Http\Requests\CartUpdateRequest;
use App\Models\Cart;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class CartController extends Controller
{
    public function addToCart(CartRequest $request)
{
    try {
        $productVariant = ProductVariant::findOrFail($request->product_variant_id);
        $quantity = $request->quantity ?? 1;

        if (Auth::check()) { 
            // Người dùng đã đăng nhập -> thêm sản phẩm vào giỏ hàng trong database
            $cartItem = Cart::where('user_id', Auth::user()->id)
                            ->where('product_variant_id', $productVariant->id)
                            ->first();
            if ($cartItem) {
                // Nếu sản phẩm đã có trong giỏ hàng -> cập nhật số lượng
                $cartItem->quantity += $quantity;
                $cartItem->save();
            } else {
                // Nếu sản phẩm chưa có -> thêm mới vào giỏ hàng
                Cart::create([
                    'user_id' => Auth::user()->id,
                    'product_variant_id' => $productVariant->id,
                    'quantity' => $quantity,
                ]);
            }
        } else {
            // Người dùng chưa đăng nhập -> lưu vào session
            $cart = Session::get('cart', []);
            // Kiểm tra và cộng số lượng đúng cách
            if (isset($cart[$productVariant->id])) {
                $cart[$productVariant->id] += $quantity;
            } else {
                $cart[$productVariant->id] = $quantity;
            }
            Session::put('cart', $cart);
        }

        return response()->json(['message' => 'Product added to cart']);
    } catch (\Exception $e) {
        return response()->json([   
            'success' => false,
            'message' => 'Xảy ra lỗi trong quá trình thêm giỏ hàng',
            'error' => $e->getMessage()
        ], 500);
    }
}


    // Hiển thị giỏ hàng
    public function showCart()
{
    if (Auth::check()) {
        // Người dùng đã đăng nhập -> lấy giỏ hàng từ database
        $cartItems = Cart::where('user_id', Auth::user()->id)->with('productVariant')->get();
    } else {
        // Người dùng chưa đăng nhập -> lấy giỏ hàng từ session
        $cart = Session::get('cart', []);

        // Lấy danh sách các ProductVariant từ session
        $productVariants = ProductVariant::whereIn('id', array_keys($cart))
            ->with(['product.category', 'product.brand'])
            ->get();

        // Tạo cấu trúc giỏ hàng tương tự như khi người dùng đã đăng nhập
        $cartItems = $productVariants->map(function ($productVariant) use ($cart) {
            return [
                // 'id' => null, // Không có ID vì không lưu vào database
                // 'product_variant_id' => $productVariant->id,
                // 'user_id' => null, // Không có user_id vì chưa đăng nhập
                // 'quantity' => $cart[$productVariant->id], // Số lượng từ session
                // 'created_at' => now(), // Thời gian hiện tại
                // 'updated_at' => now(), // Thời gian hiện tại
                'product_variant' => $productVariant, // Load đầy đủ thông tin product_variant
            ];
        });
    }

    return response()->json($cartItems);
}

public function deleteCart($productVariantId)
{
    // Kiểm tra nếu người dùng đã đăng nhập
    if (Auth::check()) {
        $user = Auth::user();

        // Tìm sản phẩm trong giỏ hàng của người dùng
        $cartItem = Cart::where('user_id', $user->id)
            ->where('product_variant_id', $productVariantId)
            ->first();

        // Kiểm tra nếu sản phẩm không tồn tại trong giỏ hàng
        if (!$cartItem) {
            return response()->json(['message' => 'Product not found in cart'], 404);
        }

        // Xóa sản phẩm khỏi giỏ hàng database
        $cartItem->delete();

        return response()->json(['message' => 'Product removed from cart successfully'], 200);
    } else {
        // Xử lý xóa giỏ hàng trong session nếu người dùng chưa đăng nhập
        $sessionCart = session()->get('cart', []);

        // Kiểm tra sản phẩm có trong giỏ hàng session hay không
        if (!isset($sessionCart[$productVariantId])) {
            return response()->json(['message' => 'Product not found in cart'], 404);
        }

        // Xóa sản phẩm khỏi giỏ hàng session
        unset($sessionCart[$productVariantId]);

        // Cập nhật lại session giỏ hàng
        session()->put('cart', $sessionCart);

        return response()->json(['message' => 'Product removed from session cart successfully'], 200);
    }
}

public function clearCart()
{
    if (Auth::check()) {
        // Xóa toàn bộ giỏ hàng của người dùng đã đăng nhập
        Cart::where('user_id', Auth::user()->id)->delete();
        return response()->json(['message' => 'Cart cleared successfully'], 200);
    } else {
        // Xóa giỏ hàng trong session của người dùng chưa đăng nhập
        session()->forget('cart');
        return response()->json(['message' => 'Session cart cleared successfully'], 200);
    }
}

public function updateCart(CartUpdateRequest $request, $productVariantId)
{
    // Lấy số lượng mới từ request
    $newQuantity = $request->input('quantity');

    // Kiểm tra người dùng đã đăng nhập hay chưa
    if (Auth::check()) {
        // Cập nhật số lượng trong giỏ hàng database cho người dùng đã đăng nhập
        $cartItem = Cart::where('user_id', Auth::user()->id)
            ->where('product_variant_id', $productVariantId)
            ->first();

        if (!$cartItem) {
            return response()->json(['message' => 'Product not found in cart'], 404);
        }

        $cartItem->quantity = $newQuantity;
        $cartItem->save();

        return response()->json(['message' => 'Quantity updated successfully'], 200);
    } else {
        // Cập nhật số lượng trong giỏ hàng session cho người dùng chưa đăng nhập
        $sessionCart = session()->get('cart', []);

        if (!isset($sessionCart[$productVariantId])) {
            return response()->json(['message' => 'Product not found in session cart'], 404);
        }

        $sessionCart[$productVariantId] = $newQuantity;
        session()->put('cart', $sessionCart);

        return response()->json(['message' => 'Quantity updated in session cart'], 200);
    }
}

public function cartTotal()
{
    $total = 0;

    // Kiểm tra người dùng đã đăng nhập
    if (Auth::check()) {
        $cartItems = Cart::where('user_id', Auth::user()->id)->get();
        
        foreach ($cartItems as $item) {
            $total += $item->quantity * $item->productVariant->price;
        }
    } else {
        $sessionCart = session()->get('cart', []);
        foreach ($sessionCart as $productVariantId => $quantity) {
            $productVariant = ProductVariant::find($productVariantId);
            if ($productVariant) {
                $total += $quantity * $productVariant->price;
            }
        }
    }

    return response()->json(['total' => $total], 200);
}


}