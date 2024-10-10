<?php

namespace App\Http\Controllers;

use App\Http\Requests\FavoriteRequest;
use App\Models\Favorite;
use App\Models\ProductVariant;

class FavoriteController extends Controller
{

    public function index(){
        // Lấy danh sách sản phẩm yêu thích của user hiện tại 
        $favorites = Favorite::where('user_id', auth()->id())->get();
        return response()->json($favorites);
    }

    public function store(FavoriteRequest $request)
{
    $userId = auth()->id();
    $productVariantId = $request->input('product_variant_id');

    // Kiểm tra xem mẫu mã sản phẩm đã có trong mục yêu thích chưa
    $favorite = Favorite::where('user_id', $userId)
                        ->where('product_variant_id', $productVariantId)
                        ->first();

    if ($favorite) {
        // Nếu có thì xóa
        $favorite->delete();
        return response()->json(null, 204); // No content (success)
    } else {
        // Không thì thêm
        $favorite = Favorite::create([
            'user_id' => $userId,
            'product_variant_id' => $productVariantId,
        ]);
        return response()->json($favorite, 201); // Created (success)
    }
}

}