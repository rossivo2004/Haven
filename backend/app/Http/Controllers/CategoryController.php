<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Product;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $search = $request->input('search');
        $categories = Category::when($search, function ($query, $search) {
            return $query->where('name', 'like', '%' . $search . '%');
        })->orderBy('id', 'desc')->paginate(20)->appends(request()->all());

        return response()->json([
            'success' => true,
            'categories' => $categories,
        ], 200);
        
    
        
        // return view('Category.home',[
        //     'categories' => $categories,
        // ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // return view('Category.store');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorecategoryRequest $request)
    {

        try {
            $category = new Category();
        
        $extension = $request->file('image')->getClientOriginalExtension();
        $filename = time() . '.' . $extension; 
        $uploadedFileUrl = Cloudinary::upload($request->file('image')->getRealPath(), [
            'public_id' => $filename
        ])->getSecurePath();
        $category->fill($request->except('image'));
        $category->image = $uploadedFileUrl;
        $category->save();
            // Return a success response
            return response()->json([
                'success' => true,
                'message' => 'Category đã được thêm thành công',
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
    public function show(category $category)
    {
        return response()->json([
            'success' => true,
            'category' => $category
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(category $category)
    {
        return response()->json([
            'success' => true,
            'Category' => $category
        ], 200);
        // return view('Category.edit',[
        //     'category' => $category,
        // ]);
    }
    public function getProducts(category $category)
    {
        return response()->json([
            'success' => true,
            'products' => Product::where('category_id', $category->id)->paginate(20)
        ], 200);
        // return view('Category.edit',[
        //     'category' => $category,
        // ]);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatecategoryRequest $request, category $category)
    {
   
        $input = $request->all();
        if ($request->file('image') == null) {
            unset($input['image']);
        } else {
            
        $parsedUrl = parse_url($category->image, PHP_URL_PATH);
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
        // $category->update($input);
        
        try {
            $category->update($input);
            
            // Return a success response
            return response()->json([
                'success' => true,
                'message' => '  ',
                'data' => $category
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Xảy ra lỗi trong quá trình cập nhật',
                'error' => $e->getMessage()
            ], 500);
        }
        // return redirect()->route('Category.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(category $category)
    {
        try {
            $parsedUrl = parse_url($category->image, PHP_URL_PATH);
            // Loại bỏ phần '/image/upload/' và các thư mục khác
            $pathParts = explode('/', $parsedUrl);
            // Lấy phần cuối cùng là public_id (bao gồm cả extension)
            $fileWithExtension = end($pathParts);
            // Loại bỏ phần extension (đuôi file .jpg, .png, ...)
            $publicId = pathinfo($fileWithExtension, PATHINFO_FILENAME);
            Cloudinary::destroy($publicId);
  
          $category->delete();
            
            // Return a success response
            return response()->json([
                'success' => true,
                'message' => 'Category đã được xóa thành công',
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
