<?php

namespace App\Http\Controllers;

use App\Models\Product_image;
use App\Http\Requests\StoreProduct_imageRequest;
use App\Http\Requests\UpdateProduct_imageRequest;
use App\Models\ProductImage;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class ProductImageController extends Controller
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

    public function store(StoreProduct_imageRequest $request)
    {
       try{
        $images = $request->file('product_images');
        $product_id = $request->input('product_id');
        foreach ($images as $image) {
            $productImage = new ProductImage();
            // Xử lý upload hình ảnh
            $extension = $image->getClientOriginalExtension();
            $filename = time() . '.' . $extension; 
            $uploadedFileUrl = Cloudinary::upload($image->getRealPath(), [
                'public_id' => $filename
            ])->getSecurePath();
           
            $productImage->image = $uploadedFileUrl;
            $productImage->product_id = $product_id;

            $productImage->save();
        }
        return response()->json([
            'success' => true,
            'message' => "Thêm ảnh tham khảo thành công !",
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Xảy ra lỗi trong quá trình thêm',
            'error' => $e->getMessage()
        ], 500);
    }
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductImage $product_image)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductImage $product_image)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProduct_imageRequest $request, ProductImage $product_image)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductImage $productImage)
    {
        // $product_img = new ProductImage();
        // $productImg = $product_img::find($productImage->image);
      
        try {
            $parsedUrl = parse_url($productImage->image, PHP_URL_PATH);
            // Loại bỏ phần '/image/upload/' và các thư mục khác
            $pathParts = explode('/', $parsedUrl);
            // Lấy phần cuối cùng là public_id (bao gồm cả extension)
            $fileWithExtension = end($pathParts);
            // Loại bỏ phần extension (đuôi file .jpg, .png, ...)
            $publicId = pathinfo($fileWithExtension, PATHINFO_FILENAME);
            Cloudinary::destroy($publicId);
            $productImage->delete();
            
            // Return a success response
            return response()->json([
                'success' => true,
                'message' => 'Product image đã được xóa thành công',
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
