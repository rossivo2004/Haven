<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Http\Requests\StoreBrandRequest;
use App\Http\Requests\UpdateBrandRequest;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\Client\Request;

class BrandController extends Controller
{
    
    public function index()
    {
        return response()->json([
            'success' => true,
            'message' => 'Brand đã được lưu thành công',
            'brands' => Brand::orderBy('id', 'desc')->get(),
        ], 200);
        // return view('Brand.home', [
        //     'Brands' => Brand::all(),
        // ]);
    }

  
    public function create()
    {
        return view('Brand.store');
    }

    public function store(StoreBrandRequest $request)
    {

        try {
            $object = new Brand();
            $extension = $request->file('image')->getClientOriginalExtension();
            $filename = time() . '.' . $extension;
            $uploadedFileUrl = Cloudinary::upload($request->file('image')->getRealPath(), [
                'public_id' => $filename
            ])->getSecurePath();

            $object->fill($request->except('image'));
            $object->image = $uploadedFileUrl;
            $object->save();

            // Return a success response
            return response()->json([
                'success' => true,
                'message' => 'Brand đã được lưu thành công',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Xảy ra lỗi trong quá trình lưu',
                'error' => $e->getMessage()
            ], 500);
        }
    }

   
    public function show(Brand $brand)
    {
        
    }

   

    public function edit(Brand $brand)
    {
        return response()->json([
            'success' => true,
            'message' => 'Brand đã được lưu thành công',
            'brand' => $brand
        ], 200);
        // return view('Brand.edit', [
        //     'brand' => $brand,
        // ]);
    }

  

    public function update(UpdateBrandRequest $request, Brand $brand)
    {
        try {
            $input = $request->all();
            if ($request->file('image') == null) {
                unset($input['image']);
            } else {
                /// cập nhật ảnh thì xóa file ảnh cũ trên cloud
                $parsedUrl = parse_url($brand->image, PHP_URL_PATH);
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
            $brand->update($input);

            // Return a success response
            return response()->json([
                'success' => true,
                'message' => 'Brand đã được cập nhật thành công',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Xảy ra lỗi trong quá trình cập nhật',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Brand $brand)
    {
        try {
            // lấy đường dẫn file ảnh trong thư mục public rồi sau đó unlink là xóa file ảnh 
            $parsedUrl = parse_url($brand->image, PHP_URL_PATH);
            // Loại bỏ phần '/image/upload/' và các thư mục khác
            $pathParts = explode('/', $parsedUrl);
            // Lấy phần cuối cùng là public_id (bao gồm cả extension)
            $fileWithExtension = end($pathParts);
            // Loại bỏ phần extension (đuôi file .jpg, .png, ...)
            $publicId = pathinfo($fileWithExtension, PATHINFO_FILENAME);
            Cloudinary::destroy($publicId);

            $brand->delete();

            // Return a success response
            return response()->json([
                'success' => true,
                'message' => 'Brand đã được cập nhật thành công',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Xảy ra lỗi trong quá trình cập nhật',
                'error' => $e->getMessage()
            ], 500);
        }

        return redirect()->back();
    }
    public function getBrandByTag($tag)
    {
            $brand = Brand::where('tag',$tag)->first();
            if (!$brand) {
                return response()->json(['message' => 'Brand not found'], 404);
            }
    
            return response()->json($brand);
    }
}



