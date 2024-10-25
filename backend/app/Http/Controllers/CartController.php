<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\CartRequest;
use App\Http\Requests\CartUpdateRequest;
use App\Models\Cart;
use App\Models\User;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class CartController extends Controller
{

    public function removeSelectedItems(Request $request, $userId)
{
    // Lấy danh sách product_variant_id muốn xóa
    $productVariantIds = $request->input('product_variant_id', []);

    if ($userId) {
        // Người dùng đã đăng nhập -> xóa sản phẩm từ database
        Cart::where('user_id', $userId)
            ->whereIn('product_variant_id', $productVariantIds)
            ->delete();
    } else {
        // Người dùng chưa đăng nhập -> xóa sản phẩm từ session
        $cart = $request->session()->get('cart_items', []);

        // Xóa các sản phẩm được chọn từ session
        foreach ($productVariantIds as $productVariantId) {
            if (isset($cart[$productVariantId])) {
                unset($cart[$productVariantId]); // Xóa sản phẩm từ giỏ hàng session
            }
        }

        // Cập nhật lại session sau khi xóa sản phẩm
        $request->session()->put('cart_items', $cart);
    }

    return response()->json(['message' => 'Selected items removed successfully']);
}


    public function moveCartToDatabase(Request $request){

    $cartItems = $request->input('cart_items');

    foreach ($cartItems as $item) {
        $userId = $item['user_id'];
        // Nếu user_id tồn tại, xử lý giỏ hàng
    $user = User::find($userId);

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

        $existingItem = Cart::where('user_id', $userId)
            ->where('product_variant_id', $item['product_variant_id'])
            ->first();

        if ($existingItem) {
            $existingItem->quantity += $item['quantity'];
            $existingItem->save();
        } else {
            Cart::create([
                'user_id' => $user->id,
                'product_variant_id' => $item['product_variant_id'],
                'quantity' => $item['quantity'],
            ]);
        }
    }

     // Xóa giỏ hàng trong session
    $request->session()->forget('cart_items');

    return response()->json(['message' => 'Cart synchronized successfully'], 200);
    }

    public function addToCart(CartRequest $request){
            $userId = $request->input('user_id');
            $productVariant = ProductVariant::findOrFail($request->product_variant_id);
            $quantity = $request->quantity ?? 1;
                // Nếu user_id tồn tại, xử lý giỏ hàng
            $user = User::find($userId);

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

        if ($userId) {
            // Người dùng đã đăng nhập -> thêm sản phẩm vào giỏ hàng trong database
            $cartItem = Cart::where('user_id', $userId)
                            ->where('product_variant_id', $productVariant->id)
                            ->first();
            if ($cartItem) {
                // Nếu sản phẩm đã có trong giỏ hàng -> cập nhật số lượng
                $cartItem->quantity += $quantity;
                $cartItem->save();
            } else {
                // Nếu sản phẩm chưa có -> thêm mới vào giỏ hàng
                Cart::create([
                    'user_id' => $userId,
                    'product_variant_id' => $productVariant->id,
                    'quantity' => $quantity,
                ]);
            }
        }
        return response()->json(['message' => 'Product added to cart']);
    }

    // Hiển thị giỏ hàng
    public function showCart(Request $request, $userId )
    {
        if ($userId) {
            // Người dùng đã đăng nhập -> lấy giỏ hàng từ database
            $cartItems = Cart::where('user_id', $userId)
                ->with('productVariant') // Tải productVariant liên quan
                ->get();

            // Chỉ lấy dữ liệu productVariant
            $cartItems = $cartItems->map(function ($item) {
                return [
                    'product_variant' => $item->productVariant, // Trả về productVariant
                    'quantity' => $item->quantity,              // Trả về số lượng sản phẩm
                ];
            });

        } else {
            // Người dùng chưa đăng nhập -> lấy giỏ hàng từ session
            $cart = $request->session()->get('cart_items', []);

            // Lấy danh sách các ProductVariant từ session
            $productVariants = ProductVariant::whereIn('id', array_keys($cart))
                ->with(['product.category', 'product.brand']) // Tải thông tin liên quan
                ->get();

            // Chỉ trả về productVariant
            $cartItems = $productVariants->map(function ($productVariant) {
                return [
                    'product_variant' => $productVariant,        // Trả về productVariant
                    'quantity' => $cart[$productVariant->id],    // Trả về số lượng sản phẩm từ session
                ];
            });
        }

        return response()->json($cartItems);
    }


public function deleteCart($userId,$productVariantId)
{
    // Kiểm tra nếu người dùng đã đăng nhập
    if ($userId) {
        // Tìm sản phẩm trong giỏ hàng của người dùng
        $cartItem = Cart::where('user_id', $userId)
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
        $sessionCart = $request->session()->forget('cart_items');

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

public function clearCart($userId)
{
    if ($userId) {
        // Xóa toàn bộ giỏ hàng của người dùng đã đăng nhập
        Cart::where('user_id', $userId)->delete();
        return response()->json(['message' => 'Cart cleared successfully'], 200);
    } else {
        // Xóa giỏ hàng trong session của người dùng chưa đăng nhập
        $request->session()->forget('cart_items');
        return response()->json(['message' => 'Session cart cleared successfully'], 200);
    }
}

public function updateCart(CartUpdateRequest $request, $userId, $productVariantId)
{
    // Lấy số lượng mới từ request
    $newQuantity = $request->input('quantity');

    // Kiểm tra người dùng đã đăng nhập hay chưa
    if ($userId) {
        // Cập nhật số lượng trong giỏ hàng database cho người dùng đã đăng nhập
        $cartItem = Cart::where('user_id', $userId)
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
        $sessionCart = $request->session()->get('cart_items');

        if (!isset($sessionCart[$productVariantId])) {
            return response()->json(['message' => 'Product not found in session cart'], 404);
        }

        $sessionCart[$productVariantId] = $newQuantity;
        $request->session()->put('cart', $sessionCart);

        return response()->json(['message' => 'Quantity updated in session cart'], 200);
    }
}

public function cartTotal($userId)
{
    $total = 0;

    // Kiểm tra người dùng đã đăng nhập
    if ($userId) {
        $cartItems = Cart::where('user_id', $userId)->get();

        foreach ($cartItems as $item) {
            $total += $item->quantity * $item->productVariant->price;
        }
    } else {
        $sessionCart = $request->session()->get('cart_items', []);
        foreach ($sessionCart as $productVariantId => $quantity) {
            $productVariant = ProductVariant::find($productVariantId);
            if ($productVariant) {
                $total += $quantity * $productVariant->price;
            }
        }
    }

    return response()->json(['total' => $total], 200);
}

public function cartPoint($userId){
    if ($userId) {
        $user = User::find($userId);
        $points = $user->point;
    } else {
        $points = 0; // Điểm tích lũy mặc định là 0
    }

return response()->json(['point' => $points], 200);

}

}
