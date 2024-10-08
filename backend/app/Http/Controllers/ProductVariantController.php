<?php

namespace App\Http\Controllers;

use App\Models\Product_variant;
use App\Http\Requests\StoreProduct_variantRequest;
use App\Http\Requests\UpdateProduct_variantRequest;
use App\Models\ProductVariant;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class ProductVariantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProduct_variantRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductVariant $productVariant)
    {
        return response()->json([
            'success' => true,
            'product' => $productVariant
            ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductVariant $productVariant)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProduct_variantRequest $request, ProductVariant $productVariant)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductVariant $productVariant)
    {
        try {
            $parsedUrl = parse_url($productVariant->image, PHP_URL_PATH);
        // Loại bỏ phần '/image/upload/' và các thư mục khác
         $pathParts = explode('/', $parsedUrl);
        // Lấy phần cuối cùng là public_id (bao gồm cả extension)
    $fileWithExtension = end($pathParts);
        // Loại bỏ phần extension (đuôi file .jpg, .png, ...)
    $publicId = pathinfo($fileWithExtension, PATHINFO_FILENAME);
    Cloudinary::destroy($publicId);
  
          $productVariant->delete();
            
            // Return a success response
            return response()->json([
                'success' => true,
                'message' => 'ProductVariant đã được xóa thành công',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Xảy ra lỗi trong quá trình xóa',
                'error' => $e->getMessage()
            ], 500);
        }
       
    }
}
