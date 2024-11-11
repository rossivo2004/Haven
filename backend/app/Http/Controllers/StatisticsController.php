<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\User;
use App\Models\OrderDetail;
use App\Models\ProductVariant;
use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class StatisticsController extends Controller
{
    public function getMonthlyStatistics()
{
    // 1. Doanh thu hàng tháng theo năm
    $monthlyRevenue = Order::selectRaw('DATE_FORMAT(created_at, "%m/%Y") as month_year, SUM(total) as revenue')
        ->where('status', 'complete')
        ->groupBy('month_year')
        ->orderByRaw('YEAR(created_at), MONTH(created_at)')
        ->get();

    $totalRevenue = $monthlyRevenue->sum('revenue');


    return response()->json([
        'revenue' => $monthlyRevenue,
        'revenue_total' => $totalRevenue,
    ]);
}

public function getProductMostLeastStatistics()
{
    $currentMonthYear = now()->format('m/Y');

    $productsByMonth = OrderDetail::join('orders', 'orders.id', '=', 'order_details.order_id')
        ->join('product_variants', 'order_details.product_variant_id', '=', 'product_variants.id')
        ->selectRaw('DATE_FORMAT(orders.created_at, "%m/%Y") as month_year, product_variants.id as product_variant_id, product_variants.name as product_name, SUM(order_details.quantity) as total_sold')
        ->where('orders.status', 'complete')
        ->whereRaw('DATE_FORMAT(orders.created_at, "%m/%Y") = ?', [$currentMonthYear])
        ->groupBy('month_year', 'product_variants.id', 'product_variants.name')
        ->orderByRaw('YEAR(orders.created_at), MONTH(orders.created_at)')
        ->get()
        ->groupBy('month_year')
        ->map(function ($monthData) {
            $mostSold = $monthData->sortByDesc('total_sold')->take(10)->map(function ($item) {
                return [
                    'month_year' => $item->month_year,
                    'product_variant_id' => $item->product_variant_id,
                    'product_name' => $item->product_name,
                    'total_sold' => $item->total_sold,
                ];
            })->values();

            $soldProducts = $monthData->pluck('product_variant_id')->toArray();
            $leastSoldIds = array_diff(ProductVariant::all()->pluck('id')->toArray(), $soldProducts);

            $leastSold = ProductVariant::whereIn('id', $leastSoldIds)
                ->select('id as product_variant_id', 'name as product_name')
                ->get()
                ->map(function ($product) use ($monthData) {
                    return [
                        'month_year' => $monthData->first()->month_year,
                        'product_variant_id' => $product->product_variant_id,
                        'product_name' => $product->product_name,
                        'total_sold' => 0,
                    ];
                })->take(10);

            return [
                'most_sold' => $mostSold,
                'least_sold' => $leastSold,
            ];
        })
        ->first(); // Get only the current month’s data

    return response()->json([
        'products_by_month' => $productsByMonth,
    ]);
}


public function getUserStatistics()
{
    // có bao nhiêu user
    $totalUsers = User::count();
    return response()->json(['total_users' => $totalUsers]);
}

public function getOrderStatistics()
{
    // Tổng số lượng đơn hàng
    $totalOrders = Order::count();

    // Số lượng đơn hàng thành công
    $successfulOrders = Order::where('status', 'complete')->count();

    // Số lượng đơn hàng hủy
    $cancelledOrders = Order::where('status', 'canceled')->count();

    // Thống kê số lượng đơn hàng theo từng tháng trong năm hiện tại
    $monthlyOrders = Order::selectRaw('MONTH(created_at) as month, YEAR(created_at) as year, COUNT(*) as total')
        ->selectRaw('SUM(CASE WHEN status = "complete" THEN 1 ELSE 0 END) as successful')
        ->selectRaw('SUM(CASE WHEN status = "canceled" THEN 1 ELSE 0 END) as cancelled')
        ->whereYear('created_at', Carbon::now()->year)
        ->groupBy('month', 'year')
        ->orderBy('year')
        ->orderBy('month')
        ->get()
        ->map(function ($order) {
            return [
                'month' => sprintf('%02d/%d', $order->month, $order->year), // Định dạng thành MM/YYYY
                'total' => $order->total,
                'successful' => $order->successful,
                'cancelled' => $order->cancelled,
            ];
        });

    return response()->json([
        'total_orders' => $totalOrders,
        'successful_orders' => $successfulOrders,
        'cancelled_orders' => $cancelledOrders,
        'monthly_orders' => $monthlyOrders,
    ]);
}



public function getProductVariantStatics(){
    // có bao nhiêu sản phẩm biến thể
    $totalProductVariant = ProductVariant::count();

    return response()->json([
        'total_product_variant' => $totalProductVariant,
    ]);
}

// public function getBlogStatics(){
//     // có bao nhiêu sản phẩm biến thể
//     $totalBlog = Blog::count();

//     return response()->json([
//         'total_blog' => $totalBlog,
//     ]);
// }


public function getCategoryStatistics()
{
    $stats = DB::table('brands')
        ->join('products', 'brands.id', '=', 'products.brand_id')
        ->join('product_variants', 'products.id', '=', 'product_variants.product_id')
        ->join('order_details', 'product_variants.id', '=', 'order_details.product_variant_id')
        ->join('orders', 'order_details.order_id', '=', 'orders.id')
        ->selectRaw('
            brands.id as brand_id,
            brands.name as brand_name,
            MONTH(orders.created_at) as month,
            YEAR(orders.created_at) as year,
            SUM(order_details.quantity) as total_quantity,
            SUM(order_details.quantity * order_details.price) as total_revenue
        ')
        ->where('orders.status', 'complete')
        ->groupBy('brands.id', 'brands.name', 'month', 'year')
        ->get()
        ->map(function($item) {
            return [
                'brand_id' => $item->brand_id,
                'brand_name' => $item->brand_name,
                'month' => sprintf('%02d/%d', $item->month, $item->year), // Định dạng tháng/năm
                'total_quantity' => $item->total_quantity,
                'total_revenue' => $item->total_revenue,
            ];
        });

    return response()->json($stats);
}


public function getBrandStatistics()
{
    $stats = DB::table('brands')
        ->join('products', 'brands.id', '=', 'products.brand_id')
        ->join('product_variants', 'products.id', '=', 'product_variants.product_id')
        ->join('order_details', 'product_variants.id', '=', 'order_details.product_variant_id')
        ->join('orders', 'order_details.order_id', '=', 'orders.id')
        ->selectRaw('
            brands.id as brand_id,
            brands.name as brand_name,
            MONTH(orders.created_at) as month,
            YEAR(orders.created_at) as year,
            SUM(order_details.quantity) as total_quantity,
            SUM(order_details.quantity * order_details.price) as total_revenue
        ')
        ->where('orders.status', 'complete')
        ->groupBy('brands.id', 'brands.name', 'month', 'year')
        ->get()
        ->map(function($item) {
            return [
                'brand_id' => $item->brand_id,
                'brand_name' => $item->brand_name,
                'month' => sprintf('%02d/%d', $item->month, $item->year), // Định dạng tháng/năm
                'total_quantity' => $item->total_quantity,
                'total_revenue' => $item->total_revenue,
            ];
        });

    return response()->json($stats);
}


public function getRevenueComparison()
{
    // Lấy tháng hiện tại và tháng trước
    $currentMonth = date('m');
    $currentYear = date('Y');
    $previousMonth = date('m', strtotime('-1 month'));
    $previousYear = $currentMonth == '01' ? $currentYear - 1 : $currentYear;

    // Tính doanh thu cho tháng này
    $currentMonthRevenue = Order::whereYear('created_at', $currentYear)
        ->whereMonth('created_at', $currentMonth)
        ->where('status', 'complete')
        ->sum('total'); // Giả sử bạn có cột 'total' trong bảng 'orders'

    // Tính doanh thu cho tháng trước
    $previousMonthRevenue = Order::whereYear('created_at', $previousYear)
        ->whereMonth('created_at', $previousMonth)
        ->where('status', 'complete')
        ->sum('total');

    // Tính phần trăm thay đổi
    $percentageChange = 0;
    if ($previousMonthRevenue > 0) {
        $percentageChange = (($currentMonthRevenue - $previousMonthRevenue) / $previousMonthRevenue) * 100;
    } elseif ($previousMonthRevenue == 0 && $currentMonthRevenue > 0) {
        $percentageChange = 100; // Nếu tháng trước không có doanh thu
    }

    // Định dạng tháng/năm cho phản hồi
    $currentMonthYear = sprintf('%02d/%d', $currentMonth, $currentYear);
    $previousMonthYear = sprintf('%02d/%d', $previousMonth, $previousYear);

    return response()->json([
        'current_month_revenue' => [
            [
                'month' => $currentMonthYear,
                'revenue' => number_format($currentMonthRevenue, 0, '.', '') 
            ]
        ],
        'previous_month_revenue' => [
            [
                'month' => $previousMonthYear,
                'revenue' => number_format($previousMonthRevenue, 0, '.', '') 
            ]
        ],
        'percentage_change' => number_format($percentageChange, 2),
    ]);
}


}

