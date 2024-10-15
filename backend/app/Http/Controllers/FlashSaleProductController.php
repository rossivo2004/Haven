<?php

namespace App\Http\Controllers;

use App\Models\FlashSaleProduct;
use App\Http\Requests\StoreFlashSaleProductRequest;
use App\Http\Requests\UpdateFlashSaleProductRequest;
use App\Models\FlashSale;
use App\Models\ProductVariant;

class FlashSaleProductController extends Controller
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
    public function store(StoreFlashSaleProductRequest $request)
    {
       try {
        $flashSaleId = $request->input('flash_sale_id');
        $productVariantIds = $request->input('product_variant_ids');
        $stocks = $request->input('stocks');
        $discountPercents = $request->input('discount_percents');

        $outOfStockProducts = [];
        $overStockFlashSaleProducts = [];
            // kiểm tra nhập trùng lặp sản phẩm
            $uniqueArray = array_unique($productVariantIds);
            if (count($productVariantIds) !== count($uniqueArray)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nhập trùng sản phẩm !',
                ], 422);
            }

             $exists = FlashSaleProduct::where('flash_sale_id', $flashSaleId)
                              ->where('product_variant_id', $productVariantIds)
                              ->exists();
            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sản phẩm đã tồn tại trong chương trình flash sale !',
                ], 422);
            }
            // kiểm tra hàng tồn kho
            foreach ($productVariantIds as $index => $productVariantid) {
                $productVariant = ProductVariant::find($productVariantid);
                if ($productVariant->stock == 0) {
                    $overStockFlashSaleProducts[] = [
                        'product_variant_id' => $productVariantid,
                        'requested_quantity' => $stocks[$index],
                        'available_stock' => $productVariant->stock
                    ];
                }
            }
            if (!empty($outOfStockProducts)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Một số sản phẩm không đủ hàng tồn kho.',
                    'out_of_stock_products' => $outOfStockProducts
                ], 422);
            }
            //kiểm tra số lượng flash sale có lớn hơn số lượng tồn kho hay không
            foreach ($productVariantIds as $index => $productVariantid) {
                $productVariant = ProductVariant::find($productVariantid);
                if ($productVariant->stock < $stocks[$index]) {
                    $overStockFlashSaleProducts[] = [
                        'product_variant_id' => $productVariantid,
                        'requested_quantity' => $stocks[$index],
                        'available_stock' => $productVariant->stock
                    ];
                }
            }

            if ($overStockFlashSaleProducts) {
                return response()->json([
                    'success' => false,
                    'message' => 'Một số sản phẩm không đủ hàng tồn kho cho flash sale.',
                    'over_stock_flash_sale_products' => $overStockFlashSaleProducts
                ], 422);
            }


            // lưu sản phẩm vào flash_sale_product
            foreach ($productVariantIds as $index => $productVariantid) {
                $flashSaleProduct = new FlashSaleProduct();
                $flashSaleProduct->flash_sale_id = $flashSaleId;
                $flashSaleProduct->product_variant_id = $productVariantid;
                $flashSaleProduct->stock = $stocks[$index];
                $flashSaleProduct->discount_percent = $discountPercents[$index];
                $flashSaleProduct->save();
            }

            return response()->json([
                'success' => true,
                'message' => 'Flash sale product đã được thêm thành công',
            ], 200);
       } catch (\Throwable $e) {
        return response()->json([
            'success' => false,
            'message' => 'Xảy ra lỗi trong quá trình cập nhật',
            'error' => $e->getMessage()
        ], 500);
       }
    }

    /**
     * Display the specified resource.
     */
    public function show(FlashSaleProduct $flashSaleProduct)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FlashSaleProduct $flashSaleProduct)
    {
        $productVariants = ProductVariant::whereDoesntHave('flashSaleProducts', function ($query) use ($flashSaleProduct) {
            $query->where('flash_sale_id', $flashSaleProduct->flash_sale_id);
        })->get();
            return response()->json([
                  'success' => true,
                  'flashSaleProduct' =>  $productVariants,
              ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFlashSaleProductRequest $request, FlashSaleProduct $flashSaleProduct)
    {
       
        try {
          
            $flashSaleId = $request->input('flash_sale_id');
            $productVariantIds = $request->input('product_variant_id');
            $stocks = $request->input('stock');
            $discountPercents = $request->input('discount_percent');
    
            // kiểm tra nhập trùng lặp sản phẩm ở flash sale
            $exists = FlashSaleProduct::where('flash_sale_id', $flashSaleId)
                              ->where('product_variant_id', $productVariantIds)
                              ->Where('id', '!=', $flashSaleProduct->id)
                              ->exists();
            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nhập trùng sản phẩm trong chương trình flash sale  !',
                ], 422);
            }
           
            // kiểm tra hàng tồn kho của sản phẩm gốc
            $productVariant = ProductVariant::find($productVariantIds);
            if ($productVariant->stock == 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sản phẩm gốc hết hàng tồn kho.',
                ], 422);
            }

            //kiểm tra số lượng flash sale có lớn hơn số lượng tồn kho hay không
            $productVariant = ProductVariant::find($productVariantIds);
            if ($productVariant->stock < $stocks) {
                return response()->json([
                    'success' => false,
                    'message' => 'Số lượng sản phẩm không đủ hàng tồn kho cho số lượng flash sale.',
                ], 422);
            }
            $flashSaleProduct->flash_sale_id = $flashSaleId;
            $flashSaleProduct->product_variant_id = $productVariantIds;
            $flashSaleProduct->stock = $stocks;
            $flashSaleProduct->discount_percent = $discountPercents;
            $flashSaleProduct->update();
              
              // Return a success response
              return response()->json([
                  'success' => true,
                  'message' => 'Flash sale product đã được cập nhật thành công',
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
    public function destroy(FlashSaleProduct $flashSaleProduct)
    {
        try {
          
          $flashSaleProduct->delete();
            
            // Return a success response
            return response()->json([
                'success' => true,
                'message' => 'Flash sale product đã được xóa thành công',
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
