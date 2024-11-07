<?php

namespace App\Http\Controllers;

use App\Models\Product_variant;
use App\Http\Requests\StoreProduct_variantRequest;
use App\Http\Requests\UpdateProduct_variantRequest;
use App\Models\Product;
use App\Models\ProductVariant;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\Client\Request;

class ProductVariantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'productVariants' => ProductVariant::all(),
            ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return response()->json([
            'product' => Product::all(),
            ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    // public function test(Request $request){
    //     return response()->json([
    //         'success' => true,
    //         'product' => $request->all(),
    //     ], 200);
    // }



    function getRelatedVariants(ProductVariant $productVariant)
{
    // Lấy sản phẩm biến thể cụ thể
   
    try {
        $product = $productVariant->product;

    // Lấy sản phẩm biến thể cùng danh mục, loại trừ bản thân
    $categoryVariants = ProductVariant::whereHas('product', function ($query) use ($product) {
            $query->where('category_id', $product->category_id);
        })
        ->where('id', '!=', $productVariant->id)
        ->inRandomOrder()
        ->take(2)
        ->get();

    // Lấy sản phẩm biến thể cùng thương hiệu, loại trừ bản thân
    $brandVariants = ProductVariant::whereHas('product', function ($query) use ($product) {
            $query->where('brand_id', $product->brand_id);
        })
        ->where('id', '!=', $productVariant->id)
        ->inRandomOrder()
        ->take(1) 
        ->get();

    
    $sameProductVariants = ProductVariant::where('product_id', $product->id)
        ->where('id', '!=', $productVariant->id)
        ->inRandomOrder()
        ->take(1) 
        ->get();

   
    $relatedVariants = $categoryVariants->merge($brandVariants)->merge($sameProductVariants);
        return response()->json([
            'success' => true,
            'relatedVariants' => $relatedVariants,
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Xảy ra lỗi trong quá trình lấy',
            'error' => $e->getMessage()
        ], 500);
    }
    // Lấy sản phẩm chính của biến thể
    

    
}



    public function store(StoreProduct_variantRequest $request)
    {
        
        try {
        $productVariant = new ProductVariant();
        $extension = $request->file('image')->getClientOriginalExtension();
        $filename = time() . '.' . $extension; 
        $uploadedFileUrl = Cloudinary::upload($request->file('image')->getRealPath(), [
            'public_id' => $filename
        ])->getSecurePath();
        // lưu 
        $productVariant->fill($request->except('image'));
        $productVariant->image = $uploadedFileUrl;
        $productVariant->save();
            return response()->json([
                'success' => true,
                'message' => 'Product variant đã được thêm thành công',
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
    public function show(ProductVariant $productVariant)
    {
        $productVariant->increment('view');
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
        return response()->json([
            'success' => true,
            'productVariant' => $productVariant,
            'products' => Product::all(),
            ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProduct_variantRequest $request, ProductVariant $productVariant)
    {
        try {
            $input = $request->all();
            if ($request->file('image') == null) {
                unset($input['image']);
            } else {
                
                $parsedUrl = parse_url($productVariant->image, PHP_URL_PATH);
                // Loại bỏ phần '/image/upload/' và các thư mục khác
                 $pathParts = explode('/', $parsedUrl);
                // Lấy phần cuối cùng là public_id (bao gồm cả extension)
            $fileWithExtension = end($pathParts);
                // Loại bỏ phần extension (đuôi file .jpg, .png, ...)
            $publicId = pathinfo($fileWithExtension, PATHINFO_FILENAME);
            Cloudinary::destroy($publicId);
    
            // đổi tên file ảnh rồi mới thêm vào á đổi tên theo thời gian
            $extension = $request->file('image')->getClientOriginalExtension();
            $filename = time() . '.' . $extension; 
            $uploadedFileUrl = Cloudinary::upload($request->file('image')->getRealPath(), [
                'public_id' => $filename
            ])->getSecurePath();
    
            $input['image'] = $uploadedFileUrl;
            }
            $productVariant->update($input);
            
            // Return a success response
            return response()->json([
                'success' => true,
                'message' => 'ProductVariant đã được cập nhật thành công',
                'data' => $productVariant
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Xảy ra lỗi trong quá trình cập nhật',
                'error' => $e->getMessage()
            ], 500);
        }
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
