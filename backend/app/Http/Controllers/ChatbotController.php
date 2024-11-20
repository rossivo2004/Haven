<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProductVariant;
use App\Models\FlashSaleProduct;
use App\Models\OrderDetail;
use DB;
use GeminiAPI\Client;
use GeminiAPI\Resources\Parts\TextPart;

class ChatbotController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'question' => 'required',
        ]);

        $question = $request->question;
        $client = new Client(env('GEMINI_API_KEY'));

// CÂU HỎI VỀ SẢN PHẨM

        // Kiểm tra từ khóa trong câu hỏi về sản phẩm bán chạy nhất
        if (preg_match('/sản phẩm bán chạy nhất|sản phẩm bán chạy|sản phẩm bán chạy nhất trong shop|sản phẩm nào bán chạy nhất/i', $question)) {
            $topSellingProduct = OrderDetail::join('orders', 'orders.id', '=', 'order_details.order_id')
                ->join('product_variants', 'order_details.product_variant_id', '=', 'product_variants.id')
                ->select('product_variants.id', 'product_variants.name as product_name', DB::raw('SUM(order_details.quantity) as total_sold'))
                ->where('orders.status', 'complete')
                ->groupBy('product_variants.id', 'product_variants.name')
                ->orderByDesc('total_sold')
                ->first();

            if ($topSellingProduct) {
                // Lưu product_id trong session cho câu hỏi tiếp theo
                $request->session()->put('topSellingProductId', $topSellingProduct->id);

                $answer = "Sản phẩm bán chạy nhất là {$topSellingProduct->product_name} với tổng lượt bán là {$topSellingProduct->total_sold}.";
            } else {
                $answer = "Hiện tại không có sản phẩm nào .";
            }
        }
        // Kiểm tra từ khóa trong câu hỏi về sản phẩm nổi bật
        elseif (preg_match('/sản phẩm nổi bật|sản phẩm nổi bật nhất|sản phẩm nào nổi bật|sản phẩm hot/i', $question)) {
            $bestProducts = ProductVariant::orderBy('view', 'desc')->take(5)->get();
            if ($bestProducts->isNotEmpty()) {
                // Lưu danh sách các product_id và tên sản phẩm vào session cho câu hỏi tiếp theo
                $bestProductIds = $bestProducts->pluck('name', 'id')->toArray();
                $request->session()->put('bestProductIds', $bestProductIds);

                // Tạo câu trả lời cho danh sách các sản phẩm nổi bật nhất
                $answer = "Danh sách các sản phẩm nổi bật nhất:\n";
                foreach ($bestProducts as $product) {
                    $answer .= "- {$product->name} với tổng lượt xem là {$product->view}\n";
                }
            } else {
                $answer = "Hiện tại không có sản phẩm nào nổi bật trong cơ sở dữ liệu.";
            }
        }
        // Kiểm tra từ khóa trong câu hỏi về sản phẩm mới
        elseif (preg_match('/sản phẩm mới|sản phẩm mới nhất|sản phẩm mới ra/i', $question)) {
            $newProducts = ProductVariant::orderBy('id', 'desc')->take(5)->get();

            if ($newProducts->isNotEmpty()) {
                $answer = "Danh sách các sản phẩm mới nhất:\n";

                foreach ($newProducts as $product) {
                    $discountedPrice = $product->price * (1 - $product->discount / 100);
                    $formattedPrice = number_format($discountedPrice, 0, ',', '.');

                    if ($product->stock > 0) {
                        $answer .= "- {$product->name} - có giá {$formattedPrice} VNĐ - tình trạng còn hàng\n";
                    } else {
                        $answer .= "- {$product->name} - có giá {$formattedPrice} VNĐ - tình trạng hết hàng\n";
                    }
                }
            } else {
                $answer = "Hiện tại không có sản phẩm nào nổi bật trong cơ sở dữ liệu.";
            }
        }

        // Kiểm tra câu hỏi về bảo hành của sản phẩm đã lưu
        elseif (preg_match('/sản phẩm đó có được bảo hành không|bảo hành sản phẩm bán chạy|sản phẩm bán chạy có bảo hành không/i', $question)) {
            $answer = "Tất cả các sản phẩm được mua tại cửa hàng Haven của chúng tôi đều luôn được bảo hành , đổi trả trong vòng 3 ngày !.";
        }

        // Kiểm tra câu hỏi về cách sử dụng của sản phẩm đã lưu
        elseif (preg_match('/cách sử dụng sản phẩm như thế nào|hướng dẫn sử dụng sản phẩm|sử dụng sản phẩm/i', $question)) {
                    // Sử dụng Gemini cho các câu hỏi khác
                    $prompt = $question;

                    // Gọi API Gemini để tạo phản hồi
                    $response = $client->geminiPro()->generateContent(
                        new TextPart($prompt),
                    );

                    // Trích xuất câu trả lời từ phản hồi API
                    $answer = $response->text();
        }

        // Kiểm tra câu hỏi về sản phẩm nổi bật
        elseif (preg_match('/sản phẩm nổi bật nhất|sản phẩm nổi bật|sản phẩm nào nổi bật|sản phẩm hot/i', $question)) {
            $bestProducts = ProductVariant::orderBy('view', 'desc')->take(5)->get();
            if ($bestProducts->isNotEmpty()) {
                // Lưu danh sách các product_id và tên sản phẩm vào session cho câu hỏi tiếp theo
                $bestProductIds = $bestProducts->pluck('name', 'id')->toArray();
                $request->session()->put('bestProductIds', $bestProductIds);

                // Tạo câu trả lời cho danh sách các sản phẩm nổi bật nhất
                $answer = "Danh sách các sản phẩm nổi bật nhất:\n";
                foreach ($bestProducts as $product) {
                    $answer .= "- {$product->name} với tổng lượt xem là {$product->view}\n";
                }
            } else {
                $answer = "Hiện tại không có sản phẩm nào nổi bật trong cơ sở dữ liệu.";
            }
        }

        elseif (preg_match('/sản phẩm flashsale|sản phẩm đang flashsale|các sản phẩm flashsale/i', $question)) {
            $flashsaleProducts = FlashSaleProduct::with('productVariant')->take(5)->get();

            if ($flashsaleProducts->isNotEmpty()) {
                $answer = "Danh sách các sản phẩm FlashSale:\n";
                foreach ($flashsaleProducts as $product) {
                    $variant = $product->productVariant;
                    $discountedPrice = $variant->price * (1 - $product->discount_percent / 100);
                    $formattedPrice = number_format($discountedPrice, 0, ',', '.');

                    if ($variant->stock > 0) {
                        $answer .= "- {$variant->name} - có giá {$formattedPrice} VNĐ - tình trạng còn hàng\n";
                    } else {
                        $answer .= "- {$variant->name} - có giá {$formattedPrice} VNĐ - tình trạng hết hàng\n";
                    }
                }
            } else {
                $answer = "Hiện tại không có sản phẩm nào nổi bật trong cơ sở dữ liệu.";
            }
        }

        elseif (preg_match('/sản phẩm mới|sản phẩm mới nhất|các sản phẩm mới/i', $question)) {
            $newProducts = ProductVariant::orderBy('id', 'desc')->take(5)->get();

            if ($newProducts->isNotEmpty()) {
                $answer = "Danh sách các sản phẩm mới nhất:\n";

                foreach ($newProducts as $product) {
                    $discountedPrice = $product->price * (1 - $product->discount / 100);
                    $formattedPrice = number_format($discountedPrice, 0, ',', '.');

                    if ($product->stock > 0) {
                        $answer .= "- {$product->name} - có giá {$formattedPrice} VNĐ - tình trạng còn hàng\n";
                    } else {
                        $answer .= "- {$product->name} - có giá {$formattedPrice} VNĐ - tình trạng hết hàng\n";
                    }
                }
            } else {
                $answer = "Hiện tại không có sản phẩm nào nổi bật trong cơ sở dữ liệu.";
            }
        }

        elseif (preg_match('/những sản phẩm giá rẻ nhất|sản phẩm giá rẻ|các sản phẩm giá rẻ/i', $question)) {
            $downProducts = ProductVariant::orderBy('price', 'asc')->take(5)->get();

            if ($downProducts->isNotEmpty()) {
                $answer = "Danh sách các sản phẩm rẻ nhất:\n";

                foreach ($downProducts as $product) {
                    $discountedPrice = $product->price * (1 - $product->discount / 100);
                    $formattedPrice = number_format($discountedPrice, 0, ',', '.');

                    if ($product->stock > 0) {
                        $answer .= "- {$product->name} - có giá {$formattedPrice} VNĐ - tình trạng còn hàng\n";
                    } else {
                        $answer .= "- {$product->name} - có giá {$formattedPrice} VNĐ - tình trạng hết hàng\n";
                    }
                }
            } else {
                $answer = "Hiện tại không có sản phẩm nào nổi bật trong cơ sở dữ liệu.";
            }
        }

// KẾT THÚC CÂU HỎI SẢN PHẨM


// CÂU HỎI VỀ ĐƠN HÀNG
        elseif (preg_match('/tra cứu đơn hàng|kiểm tra đơn hàng|theo dõi đơn hàng/i', $question)) {
            $answer = 'Đường dẫn để tra cứu đơn hàng là: https://haven-gold.vercel.app/tracking';
        }
        elseif (preg_match('/tôi có thể hủy đơn hàng không|hủy đơn hàng|có thể hủy đơn hàng/i', $question)) {
            $answer = 'Nếu bạn là người dùng thì sau khi đặt hàng có thể hủy trong phần tài khoản cá nhân, còn là người dùng mua hàng không tài khoản thì sẽ không hủy được, vui lòng liên hệ hotline (0326 482 490) để giải quyết !';
        }
        elseif (preg_match('/có thể mua lại đơn hàng đã mua không|mua lại đơn hàng|đặt lại đơn hàng/i', $question)) {
            $answer = ' Hiện tại trang web chúng tôi đang cập nhật tính năng trên ! ';
        }
        elseif (preg_match('/làm sao để xem lịch sử mua hàng|kiểm tra lịch sử mua hàng|xem lịch sử mua hàng/i', $question)) {
            $answer = ' Vào phần tài khoản cá nhân của bạn, kích vào mục quản lí đơn hàng để xem ! ';
        }
// KẾT THÚC VỀ ĐƠN HÀNG

// CÂU HỎI VỀ GIAO HÀNG
        elseif (preg_match('/khi nào tôi sẽ nhận được hàng|thời gian giao hàng|nhận hàng khi nào/i', $question)) {
            $answer = ' Thời gian giao hàng dự kiến : 5 ngày làm việc ! ';
        }
        elseif (preg_match('/phí vận chuyển là bao nhiêu|cước vận chuyển|phí ship/i', $question)) {
            $answer = ' Free Ship TP.HCM, còn lại đồng giá ship 30k ! ';
        }
        elseif (preg_match('/làm sao để kiểm tra trạng thái đơn hàng của tôi|kiểm tra trạng thái đơn hàng|theo dõi đơn hàng của tôi/i', $question)) {
            $answer = ' Để kiểm tra trạng thái đơn hàng của bạn, vào phần "https://haven-gold.vercel.app/tracking", nhập mã đơn hàng đã thông báo qua email đặt hàng của bạn, hoặc nhấn vào theo dõi đơn hàng trong mail để xem chi tiết ! ';
        }
// KẾT THÚC VÊ GIAO HÀNG

// BẮT ĐẦU VÊ THANH TOÁN
        elseif (preg_match('/có những phương thức thanh toán nào|phương thức thanh toán|các phương thức thanh toán/i', $question)) {
            $answer = ' Chúng tôi có 2 phương thức thanh toán : COD và VNPay ! ';
        }
        elseif (preg_match('/có chương trình tích điểm hoặc giảm giá khi thanh toán không|giảm giá khi thanh toán|tích điểm khi thanh toán/i', $question)) {
            $answer = ' Có, sau khi bạn mua thành công 1 đơn hàng sẽ cộng điểm tích lũy bằng 1% tổng đơn hàng cho bạn, bạn có thể sử dụng điểm tích lũy để giảm giá ! ';
        }
// KẾT THÚC VÊ THANH TOÁN
         else {
            // Sử dụng Gemini cho các câu hỏi khác
            $prompt = $question;

            // Gọi API Gemini để tạo phản hồi
            $response = $client->geminiPro()->generateContent(
                new TextPart($prompt),
            );

            // Trích xuất câu trả lời từ phản hồi API
            $answer = $response->text();
        }

        // Trả về câu hỏi và câu trả lời dưới dạng JSON
        return response()->json(['question' => $question, 'answer' => $answer]);
    }
}
