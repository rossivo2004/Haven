<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Session;
use App\Models\Cart;
use App\Models\ProductVariant;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class TransferCartToDatabase
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Login $event): void
    {
        // Lấy giỏ hàng từ session
        $sessionCart = Session::get('cart', []);

        if (count($sessionCart) > 0) {
            // Lặp qua từng sản phẩm trong giỏ hàng session
            foreach ($sessionCart as $productVariantId => $quantity) {
                // Kiểm tra xem product_variant có tồn tại không
                $productVariant = ProductVariant::find($productVariantId);

                if ($productVariant) {
                    // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng database của người dùng
                    $existingCartItem = Cart::where('user_id', $event->user->id)
                        ->where('product_variant_id', $productVariant->id)
                        ->first();

                    if ($existingCartItem) {
                        // Nếu sản phẩm đã tồn tại, cộng thêm số lượng từ session
                        $existingCartItem->update([
                            'quantity' => $existingCartItem->quantity + $quantity,
                        ]);
                    } else {
                        // Nếu sản phẩm chưa tồn tại, thêm mới vào giỏ hàng database
                        Cart::create([
                            'user_id' => $event->user->id,
                            'product_variant_id' => $productVariant->id,
                            'quantity' => $quantity, // số lượng từ session
                        ]);
                    }
                }
            }

            // Xóa giỏ hàng session sau khi đã chuyển qua database
            Session::forget('cart');
        }
    }
}
