<?php

namespace App\Http\Controllers;

use App\Models\FlashSale;
use App\Http\Requests\StoreFlashSaleRequest;
use App\Http\Requests\UpdateFlashSaleRequest;
use App\Models\FlashSaleProduct;
use App\Models\Product;
use App\Models\ProductVariant;
use Carbon\Carbon;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Request;

class FlashSaleController extends Controller
{

    /**
     * Display a listing of the resource.
     */

    public function index(Request $request)
    {
        $status =  $request->input('status');
        
        $flashSales = FlashSale::when($status === '0' || $status === '1', function ($query) use ($status) {
            return $query->where('status',  $status);
        })->orderBy('id', 'desc')->paginate(20)->appends(request()->all());
        // $flashSales = FlashSale::where('status',  $status)->get();

        // return view('FlashSale.home', [
        //     'flashSales' => $flashSales ,
        // ]);
        return response()->json([
            'flashSales' =>   $flashSales,
        ]);
    }
    public function listFlashSale()
    {
        return response()->json([
            'flashSales' =>   FlashSale::all(),
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */

    public function create()
    {
        // return response()->json([
        //     'success' => true,
        //     'productVariants' => ProductVariant::where('stock', '>', 0)->get(),
        // ], 200);
        return view('FlashSale.store', [
            'productVariants' => ProductVariant::where('stock', '>', 0)->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFlashSaleRequest $request)
    {
        
        // Done-Thời gian bắt đầu (Start Time): Cần đảm bảo rằng thời gian bắt đầu của chương trình Flash Sale phải là sau thời gian hiện tại và không được ở trong quá khứ.
        // Done-Thời gian kết thúc (End Time): Thời gian kết thúc phải sau thời gian bắt đầu và không thể kết thúc trước thời gian bắt đầu.
        // Done-Không xung đột với các khuyến mãi khác: Đảm bảo rằng Flash Sale không mâu thuẫn hoặc chồng chéo với các chương trình khuyến mãi khác để tránh nhầm lẫn về giá.
        // Done-Sản phẩm duy nhất: Đảm bảo rằng một sản phẩm không tham gia nhiều Flash Sale cùng lúc.
        // Done - Kiểm tra tính hợp lệ của sản phẩm: Đảm bảo rằng sản phẩm có đủ tồn kho, sản phẩm không bị ngừng bán, hoặc các biến thể sản phẩm có đầy đủ thông tin trước khi thêm vào Flash Sale.
        try {
            $flashSale = new FlashSale();
            $startTimeRequest = Carbon::parse($request->input('start_time'));
            $endTimeRequest = Carbon::parse($request->input('end_time'));
            $startTime = $startTimeRequest->format('Y-m-d H:i:s');
            $endTime = $endTimeRequest->format('Y-m-d H:i:s');

            $productVariantIds = $request->input('product_variant_ids');
            $stocks = $request->input('stocks');
            $discountPercents = $request->input('discount_percents');

            $outOfStockProducts = [];
            $overStockFlashSaleProducts = [];

            // kiểm tra xem có flash sale nào trùng lặp hay không
            $overlappingFlashSales = FlashSale::where(function ($query) use ($startTime, $endTime) {
                $query->whereBetween('start_time', [$startTime, $endTime])
                    ->orWhereBetween('end_time', [$startTime, $endTime])
                    ->orWhere(function ($query) use ($startTime, $endTime) {
                        $query->where('start_time', '<=', $startTime)
                            ->where('end_time', '>=', $endTime);
                    });
            })->get();

            if ($overlappingFlashSales->isNotEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Chương trình Flash sale bị chồng chéo với chương trình Flash sale khác !',
                ], 422);
            } else {
                // thêm flashsale 
                $flashSale->start_time = $startTime;
                $flashSale->end_time =  $endTime;
                $flashSale->save();
                $flashSaleId = $flashSale->id;
            }


            // kiểm tra nhập trùng lặp sản phẩm
            $uniqueArray = array_unique($productVariantIds);
            if (count($productVariantIds) !== count($uniqueArray)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nhập trùng sản phẩm !',
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
                'message' => 'Chương trình flash sale đã được lưu thành công',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Xảy ra lỗi trong quá trình lưu',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(FlashSale $flashSale)
    {
        
        return response()->json([
            'success' => true,
            'flashSale' => $flashSale
        ], 200);
    }
    public function getProductVariants(FlashSale $flashSale)
    {
        $productVariantobj = new ProductVariant();
        return response()->json([
            'success' => true,
            'FlashsaleProducts' => ProductVariant::whereHas('flashSales', function($query) use ($flashSale) {
                $query->where('flash_sale_id', $flashSale->id);
            })->paginate(20)->appends(request()->all()),
        ], 200);
    }
    
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FlashSale $flashsale)
    {
        //chỉ hiển thị sản phẩm còn hàng trong khi chỉnh sửa flash sale vì trong input select chỉ hiển thị sản phẩm còn hàng để chọn thôi
        $productVariantFlashSales = $flashsale->productVariants->where('stock', '>', 0);
        // dd($productVariants);
        return response()->json([
            'success' => true,
            'flashSale' => $flashsale,
            'productVariantFlashSales' => $productVariantFlashSales,
            'productVariants' => ProductVariant::where('stock', '>', 0)->get()
        ], 200);
        // return view('FlashSale.edit', [
        //     'flashSale' => $flashsale,
        //     'productVariantFlashSales' => $productVariantFlashSales,
        //     'productVariants' => ProductVariant::where('stock', '>', 0)->get()
        // ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFlashSaleRequest $request, FlashSale $flashsale)
    {
        // dd($flashsale);
        try {
            $flashSale = $flashsale;
            $variantIds = $request->input('variant_id');
            $startTimeRequest = Carbon::parse($request->input('start_time'));
            $endTimeRequest = Carbon::parse($request->input('end_time'));
            $startTime = $startTimeRequest->format('Y-m-d H:i:s');
            $endTime = $endTimeRequest->format('Y-m-d H:i:s');

              // kiểm tra xem có flash sale nào trùng lặp hay không
              $overlappingFlashSales = FlashSale::where(function ($query) use ($startTime, $endTime) {
                $query->whereBetween('start_time', [$startTime, $endTime])
                    ->orWhereBetween('end_time', [$startTime, $endTime])
                    ->orWhere(function ($query) use ($startTime, $endTime) {
                        $query->where('start_time', '<=', $startTime)
                            ->where('end_time', '>=', $endTime);
                    })
                ;
            })->Where('id', '!=', $flashSale->id)->get();

            if ($overlappingFlashSales->isNotEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Chương trình Flash sale bị chồng chéo với chương trình Flash sale khác !',
                ], 500);
            } else {
                // thêm flashsale 
                $flashSale->start_time = $startTime;
                $flashSale->end_time =  $endTime;
                $flashSale->update();
            }
            


        //     $productVariantIds = $request->input('product_variant_ids');
        //     $stocks = $request->input('stocks');
        //     $discountPercents = $request->input('discount_percents');

        //     $outOfStockProducts = [];
        //     $overStockFlashSaleProducts = [];

        //     // kiểm tra nhập trùng lặp sản phẩm
        //     $uniqueArray = array_unique($productVariantIds);
        //     if (count($productVariantIds) !== count($uniqueArray)) {
        //         return response()->json([
        //             'success' => false,
        //             'message' => 'Nhập trùng sản phẩm !',
        //         ], 500);
        //     }
        //     // kiểm tra hàng tồn kho
        //     foreach ($productVariantIds as $index => $productVariantid) {
        //         $productVariant = ProductVariant::find($productVariantid);
        //         if ($productVariant->stock == 0) {
        //             $overStockFlashSaleProducts[] = [
        //                 'product_variant_id' => $productVariantid,
        //                 'requested_quantity' => $stocks[$index],
        //                 'available_stock' => $productVariant->stock
        //             ];
        //         }
        //     }
        //     if (!empty($outOfStockProducts)) {
        //         return response()->json([
        //             'success' => false,
        //             'message' => 'Một số sản phẩm không đủ hàng tồn kho.',
        //             'out_of_stock_products' => $outOfStockProducts
        //         ], 500);
        //     }
        //     //kiểm tra số lượng flash sale có lớn hơn số lượng tồn kho hay không
        //     foreach ($productVariantIds as $index => $productVariantid) {
        //         $productVariant = ProductVariant::find($productVariantid);
        //         if ($productVariant->stock < $stocks[$index]) {
        //             $overStockFlashSaleProducts[] = [
        //                 'product_variant_id' => $productVariantid,
        //                 'requested_quantity' => $stocks[$index],
        //                 'available_stock' => $productVariant->stock
        //             ];
        //         }
        //     }
        //     if ($overStockFlashSaleProducts) {
        //         return response()->json([
        //             'success' => false,
        //             'message' => 'Một số sản phẩm không đủ hàng tồn kho cho flash sale.',
        //             'over_stock_flash_sale_products' => $overStockFlashSaleProducts
        //         ], 500);
        //     }

        // //   kiểm tra có trùng lặp flash sale hay không

        //     // Cập nhật sản phẩm vào flash_sale_product
        //     foreach ($productVariantIds as $index => $productVariantid) {
        //         if (isset($variantIds[$index])) {
        //             $flashSaleProduct = FlashSaleProduct::findOrFail($variantIds[$index]);
        //             $flashSaleProduct->product_variant_id = $productVariantid;
        //             $flashSaleProduct->stock = $stocks[$index];
        //             $flashSaleProduct->discount_percent = $discountPercents[$index];
        //             $flashSaleProduct->save();
        //         } else {
        //             $flashSaleProduct = new FlashSaleProduct();
        //             $flashSaleProduct->flash_sale_id = $flashSaleId;
        //             $flashSaleProduct->product_variant_id = $productVariantid;
        //             $flashSaleProduct->stock = $stocks[$index];
        //             $flashSaleProduct->discount_percent = $discountPercents[$index];
        //             $flashSaleProduct->save();
        //         }
        //     }
        //     $delete_variants = $request->delete_variants ?? [];
        //     foreach ($delete_variants as $item) {
        //         $productFlashSale = FlashSaleProduct::Find($item);
        //         $productFlashSale->delete();
        //     }

        

            return response()->json([
                'success' => true,
                'message' => 'Chương trình flash sale đã được cập nhật thành công',
                'flashSale' => $flashSale,
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
    public function destroy(FlashSale $flashsale)
    {
        try {
            $flashsale->delete();
            
            // Return a success response
            return response()->json([
                'success' => true,
                'message' => 'Flash sale đã được xóa thành công',
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
