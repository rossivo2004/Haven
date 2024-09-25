<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product_image;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Dotenv\Validator;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brands = new Brand();
        $categories = new category();
        $options = [];
        $category_id = '';
        $query = Product::query();
        $products = $query->get();
        

        // return view('Product.home', [
        //     'product' =>   $products,
        //     'categories' => $categories::orderBy('id', 'desc')->get(),
        //     'brands' => $brands::orderBy('id', 'desc')->get(),
        //     'category_id' => $category_id
        // ]);
        return response()->json([
          'product' =>   $products,
            'categories' => $categories::orderBy('id', 'desc')->get(),
            'brands' => $brands::orderBy('id', 'desc')->get(),
            'category_id' => $category_id
        ]);
    }

    public function shop()
    {
        $brands = new Brand();
        $categories = new Category();
        $query = ProductVariant::query();
        if(request()->has('category') || request('category') != null ){
            $category_id = request('category');
            $query->whereHas('product', function ($q) use ($category_id) {
                $q->whereIn('category_id', $category_id);
            })->get();
         }
         if(request()->has('brand') || request('brand') != null ){
            $brand_id = request('brand');
            $query->whereHas('product', function ($q) use ($brand_id) {
                $q->whereIn('brand_id', $brand_id);
            })->get();
         }
         if(request()->has('search') || request('search') != null ){
            $search = request('search');
            $query->where('name','like', '%'. $search . '%')->get();
         }
         if(request()->has('priceRanges') || request('priceRanges') != null ){
            $priceRanges =  collect(request('priceRanges'));
            $ChangeValue = $priceRanges->map(function ($priceValue) {
                $range = explode('-', $priceValue);
                return (object) ['min' => intval($range[0]), 'max' => intval($range[1])];
            });
            foreach($ChangeValue as $item){
                $query->orWhereBetween('price', [$item->min, $item->max]);
            }
        }
        $productVariants = $query->paginate(1)->appends([
            'priceRanges' => request('priceRanges'),
            'category' => request('category'),
            'brand' => request('brand'),
            'search' => request('search')
        ]);
        // return view('Product.shop', [
        //     'categories' => $categories::orderBy('id', 'desc')->get(),
        //     'brands' => $brands::orderBy('id', 'desc')->get(),
        //     'productvariants' => $productVariants,
        // ]);  
        return response()->json([
            'categories' => $categories::orderBy('id', 'desc')->get(),
            'brands' => $brands::orderBy('id', 'desc')->get(),
            'productvariants' => $productVariants,
        ]);  
 
    }

    public function create()
    {
        $brands = new Brand();
        $categories = new Category();
        // return response()->json([
        //     'categories' => $categories::orderBy('id', 'desc')->get(),
        //     'brands' => $brands::orderBy('id', 'desc')->get(),
        // ]);  
        return view('Product.store', [
            'categories' => $categories::orderBy('id', 'desc')->get(),
            'brands' => $brands::orderBy('id', 'desc')->get(),
        ]);    
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {

        try {
          
        $product = new Product();
        $product->fill($request->except('tag'));
        $product->name = $request->name_product;
        $product->save();
        $productId = $product->id;
       

        $images = $request->file('images') ?? [];
        foreach($images as $item){
        $product_img = new ProductImage();
        $extension =  $item->getClientOriginalExtension();
        $filename = time() . '.' . $extension; 
        $uploadedFileUrl = Cloudinary::upload($item->getRealPath(), [
            'public_id' => $filename
        ])->getSecurePath();
        $product_img->image = $uploadedFileUrl;
        $product_img->product_id = $productId;
        $product_img->save();
        }

        $names = $request->input('name');
        $prices = $request->input('price');
        $images = $request->file('image'); // Xử lý file hình ảnh
        $stocks = $request->input('stock');
        $variant_values = $request->input('variant_value');
        $discounts = $request->input('discount');
        $tags = $request->input('tag');
        
        // $product_variant = new ProductVariant();

        foreach ($names as $index => $name) {
            $productVariant = new ProductVariant();
            $productVariant->name = $name;
            $productVariant->price = $prices[$index];
    
            // Xử lý upload hình ảnh
            $extension = $images[$index]->getClientOriginalExtension();
            $filename = time() . '.' . $extension; 
            $uploadedFileUrl = Cloudinary::upload($images[$index]->getRealPath(), [
                'public_id' => $filename
            ])->getSecurePath();
            $productVariant->image = $uploadedFileUrl;
            $productVariant->stock = $stocks[$index];
            $productVariant->variant_value = $variant_values[$index];
            $productVariant->discount = $discounts[$index];
            $productVariant->tag = $tags[$index];
            $productVariant->product_id = $productId;
            $productVariant->save();
        }
            
            // Return a success response
            return response()->json([
                'success' => true,
                'message' => 'Sản phẩm đã được thêm thành công',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Xảy ra lỗi trong quá trình thêm',
                'error' => $e->getMessage()
            ], 500);
        }
        // return redirect()->route('Product.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductVariant $productVariant)
    {

        return response()->json([
            // 'categories' => $categories::orderBy('id', 'desc')->get(),
            // 'brands' => $brands::orderBy('id', 'desc')->get(),
            // // 'product' => ProductVariant::
            // 'productvariants' => $productVariants,
            // 'product' => $productVariant->product,
            'productVariant' => $productVariant,
            'productImages' => ProductImage::where('product_id',$productVariant->product->id)->get(),
            'relatedProductVariants' => ProductVariant::where('product_id',$productVariant->product->id)->get(),
            
        ]);
        // return view('Product.detail', [
        //     'productVariant' => $productVariant,
        //     'relatedProductVariants' => ProductVariant::where('product_id',$productVariant->product->id)->get(),
        //     'productImages' => ProductImage::where('product_id',$productVariant->product->id)->get(),
        //     'product' => $productVariant->product,
        // ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $brands = new Brand();
        $categories = new Category();
        $variants = ProductVariant::where('product_id',$product->id)->get();
        

        return response()->json([
            'product' => $product,
            'categories' => $categories::orderBy('id', 'desc')->get(),
            'brands' => $brands::orderBy('id', 'desc')->get(),
            'productImages' => ProductImage::where('product_id',$product->id)->get(),
            'variants' =>$variants
        ]);
        // return view('Product.edit', [
        //     'product' => $product,
        //     'categories' => $categories::orderBy('id', 'desc')->get(),
        //     'brands' => $brands::orderBy('id', 'desc')->get(),
        //     'productImages' => ProductImage::where('product_id',$product->id)->get(),
        //     'variants' =>$variants
        // ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
       
        try {
            $product->fill($request->except('tag'));
            $product->name = $request->name_product;
            $product->update();
    
            // xóa / thêm ảnh tham khảo
            $delete_images = $request->delete_images ?? [];
            foreach($delete_images as $item){
                $product_img = new ProductImage();
                $productImg = $product_img::find($item);
              
                $parsedUrl = parse_url($productImg->image, PHP_URL_PATH);
                // Loại bỏ phần '/image/upload/' và các thư mục khác
                $pathParts = explode('/', $parsedUrl);
                // Lấy phần cuối cùng là public_id (bao gồm cả extension)
                $fileWithExtension = end($pathParts);
                // Loại bỏ phần extension (đuôi file .jpg, .png, ...)
                $publicId = pathinfo($fileWithExtension, PATHINFO_FILENAME);
                Cloudinary::destroy($publicId);
                $productImg->delete();
            }
            // dd($count);
            //thêm ảnh tham khảo
            $images = $request->file('images') ?? [];
            foreach($images as $item){
                $product_img = new ProductImage();
                $extension =  $item->getClientOriginalExtension();
                $filename = time() . '.' . $extension; 
                $uploadedFileUrl = Cloudinary::upload($item->getRealPath(), [
                    'public_id' => $filename
                ])->getSecurePath();
                $product_img->fill($request->except('image'));
                $product_img->image = $uploadedFileUrl;
                $product_img->product_id = $product->id;
                $product_img->save();
            }
    
    
            $variantIds = $request->input('variant_id');
            $names = $request->input('name');
            $prices = $request->input('price');
            $images = $request->file('image');
            $stocks = $request->input('stock');
            $variant_values = $request->input('variant_value');
            $discounts = $request->input('discount');
            $tags = $request->input('tag');
        
    
            foreach ($names as $index => $name) {
                if (isset($variantIds[$index])) {
                    $productVariant = ProductVariant::findOrFail($variantIds[$index]);
                    $productVariant->name = $names[$index];
                    $productVariant->price = $prices[$index];
            
                    // Cập nhật hình ảnh nếu có
                    if (isset($images[$index])) {
                        $parsedUrl = parse_url($productVariant->image, PHP_URL_PATH);
                        // Loại bỏ phần '/image/upload/' và các thư mục khác
                    $pathParts = explode('/', $parsedUrl);
                        // Lấy phần cuối cùng là public_id (bao gồm cả extension)
                    $fileWithExtension = end($pathParts);
                        // Loại bỏ phần extension (đuôi file .jpg, .png, ...)
                    $publicId = pathinfo($fileWithExtension, PATHINFO_FILENAME);
            
                    Cloudinary::destroy($publicId);
            
                    // đổi tên file ảnh rồi mới thêm vào á đổi tên theo thời gian
                    $extension = $images[$index]->getClientOriginalExtension();
                    $filename = time() . '.' . $extension; 
                    $uploadedFileUrl = Cloudinary::upload($images[$index]->getRealPath(), [
                        'public_id' => $filename
                    ])->getSecurePath();
                    $productVariant->image = $uploadedFileUrl;
                    }
            
                    $productVariant->stock = $stocks[$index];
                    $productVariant->variant_value = $variant_values[$index];
                    $productVariant->discount = $discounts[$index];
                    $productVariant->tag = $tags[$index];
                    $productVariant->save();
                } else {
                    $productVariant = new ProductVariant();
                    $productVariant->name = $name;
                    $productVariant->price = $prices[$index];
            
                    // Xử lý upload hình ảnh
                  
                    $productVariant->stock = $stocks[$index];
                    $productVariant->variant_value = $variant_values[$index];
                    $productVariant->discount = $discounts[$index];
                    $productVariant->tag = $tags[$index];
                    $productVariant->product_id = $product->id;
    
                    $extension = $images[$index]->getClientOriginalExtension();
                    $filename = time() . '.' . $extension; 
                    $uploadedFileUrl = Cloudinary::upload($images[$index]->getRealPath(), [
                        'public_id' => $filename
                    ])->getSecurePath();
                    $productVariant->image = $uploadedFileUrl;
                    $productVariant->save();
                }
            }
            // xóa product variant nào đã đc check
            $delete_variants = $request->delete_variants ?? [];
            foreach($delete_variants as $item){
                $product_variant = new ProductVariant();
                $variant = $product_variant::find($item);
              
                $parsedUrl = parse_url($variant->image, PHP_URL_PATH);
                // Loại bỏ phần '/image/upload/' và các thư mục khác
                $pathParts = explode('/', $parsedUrl);
                // Lấy phần cuối cùng là public_id (bao gồm cả extension)
                $fileWithExtension = end($pathParts);
                // Loại bỏ phần extension (đuôi file .jpg, .png, ...)
                $publicId = pathinfo($fileWithExtension, PATHINFO_FILENAME);
                Cloudinary::destroy($publicId);
                $variant->delete();
            }
            return response()->json([
                'success' => true,
                'message' => 'Sản phẩm đã được cập nhật thành công',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Xảy ra lỗi trong quá trình cập nhật',
                'error' => $e->getMessage()
            ], 500);
        }

        // return response()->json([
        //     'success' => true,
        //     'message' => 'Sản phẩm đã được cập nhật thành công',
        // ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
       
        try {
            $productImgOb = new ProductImage();
            $productVariantOb = new ProductVariant();
            $productImages = $productImgOb->where('product_id',$product->id)->get();
            $productVariants = $productVariantOb->where('product_id',$product->id)->get();
            foreach($productImages as $item){
                $parsedUrl = parse_url($item->image, PHP_URL_PATH);
                // Loại bỏ phần '/image/upload/' và các thư mục khác
                $pathParts = explode('/', $parsedUrl);
                // Lấy phần cuối cùng là public_id (bao gồm cả extension)
                $fileWithExtension = end($pathParts);
                // Loại bỏ phần extension (đuôi file .jpg, .png, ...)
                $publicId = pathinfo($fileWithExtension, PATHINFO_FILENAME);
                Cloudinary::destroy($publicId);
            }
            foreach($productVariants as $item){
                $parsedUrl = parse_url($item->image, PHP_URL_PATH);
                // Loại bỏ phần '/image/upload/' và các thư mục khác
                $pathParts = explode('/', $parsedUrl);
                // Lấy phần cuối cùng là public_id (bao gồm cả extension)
                $fileWithExtension = end($pathParts);
                // Loại bỏ phần extension (đuôi file .jpg, .png, ...)
                $publicId = pathinfo($fileWithExtension, PATHINFO_FILENAME);
                Cloudinary::destroy($publicId);
            }
    
            $product->delete();
            
            // Return a success response
            return response()->json([
                'success' => true,
                'message' => 'Sản phẩm đã được xóa thành công',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Xảy ra lỗi trong quá trình xóa',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function getProductByTag($tag)
    {
            $product = ProductVariant::where('tag',$tag)->with('product')->first();
            if (!$product) {
                return response()->json(['message' => 'Product not found'], 404);
            }
            return response()->json($product);
    }
}
