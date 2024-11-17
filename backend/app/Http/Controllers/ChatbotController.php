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

        // Kiểm tra từ khóa trong câu hỏi
        if (stripos($question, 'sản phẩm bán chạy nhất') !== false) {
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
        // Kiểm tra câu hỏi về giá của sản phẩm bán chạy đã lưu
        elseif (stripos($question, 'giá của sản phẩm bán chạy đó') !== false) {
            $topSellingProductId = $request->session()->get('topSellingProductId');
            if ($topSellingProductId) {
                $product = ProductVariant::find($topSellingProductId);
                if ($product) {
                    $discountedPrice = $product->price * (1 - $product->discount / 100);
                    $formattedPrice = number_format($discountedPrice, 0, ',', '.');
                    $answer = "Giá của sản phẩm {$product->name} là {$formattedPrice} VND.";
                } else {
                    $answer = "Không tìm thấy thông tin giá cho sản phẩm.";
                }
            } else {
                $answer = "Giá của sản phẩm không được cung cấp trong ngữ cảnh do đó tôi không thể trả lời câu hỏi.";
            }
        }
        // Kiểm tra câu hỏi về stock của sản phẩm đã lưu
        elseif (stripos($question, 'sản phẩm bán chạy đó còn hàng không') !== false) {
            $topSellingProductId = $request->session()->get('topSellingProductId');

            if ($topSellingProductId) {
                $product = ProductVariant::find($topSellingProductId);
                if ($product->stock > 0) {
                    $answer = "Sản phẩm {$product->name} còn hàng.";
                } else {
                    $answer = "Sản phẩm {$product->name} hết hàng.";
                }
            } else {
                $answer = "Giá của sản phẩm không được cung cấp trong ngữ cảnh do đó tôi không thể trả lời câu hỏi.";
            }
        }
        // Kiểm tra câu hỏi về flashsale của sản phẩm đã lưu
        elseif (stripos($question, 'có chương trình khuyến mãi cho sản phẩm bán chạy này không') !== false) {
            $topSellingProductId = $request->session()->get('topSellingProductId');

            if ($topSellingProductId) {
                $product = ProductVariant::find($topSellingProductId);
                if ($product) {
                    $finalPrice = $product->price;  // Mặc định là giá thông thường

                    // Kiểm tra xem sản phẩm có đang trong chương trình flash sale không
                    $flashSaleProduct = FlashSaleProduct::where('product_variant_id', $topSellingProductId)->first();

                    if ($flashSaleProduct !== null) { // Đảm bảo $flashSaleProduct tồn tại
                        $discountedPrice = $product->price * (1 - $flashSaleProduct->discount_percent / 100);
                        $finalPrice = round($discountedPrice, 2);
                        $answer = "Sản phẩm {$product->name} nằm trong chương trình khuyến mãi và có giá khuyến mãi là {$finalPrice} VND.";
                    } else {
                        $answer = "Sản phẩm {$product->name} không nằm trong chương trình khuyến mãi và có giá thông thường là {$finalPrice} VND.";
                    }
                } else {
                    $answer = "Không tìm thấy thông tin sản phẩm.";
                }
            } else {
                $answer = "Giá của sản phẩm không được cung cấp trong ngữ cảnh do đó tôi không thể trả lời câu hỏi.";
            }
        }
        // Kiểm tra câu hỏi về bảo hành của sản phẩm đã lưu
        elseif (stripos($question, 'sản phẩm đó có được bảo hành không') !== false) {
            $topSellingProductId = $request->session()->get('topSellingProductId');

            if ($topSellingProductId) {
                $product = ProductVariant::find($topSellingProductId);
                if ($product) {
                    $answer = "Tất cả các sản phẩm được mua tại cửa hàng Haven của chúng tôi đều luôn được bảo hành , đổi trả trong vòng 3 ngày !.";
                } else {
                    $answer = "No answer";
                }
            } else {
                $answer = "Giá của sản phẩm không được cung cấp trong ngữ cảnh do đó tôi không thể trả lời câu hỏi.";
            }
        }
        // Kiểm tra câu hỏi về cách sử dụng của sản phẩm đã lưu
        elseif (stripos($question, 'cách sử dụng sản phẩm như thế nào') !== false) {
            $topSellingProductId = $request->session()->get('topSellingProductId');

            if ($topSellingProductId) {
                $product = ProductVariant::find($topSellingProductId);
                if ($product) {
                    // Sử dụng Gemini cho các câu hỏi khác
                    $prompt = $question;

                    // Gọi API Gemini để tạo phản hồi
                    $response = $client->geminiPro()->generateContent(
                        new TextPart($prompt),
                    );

                    // Trích xuất câu trả lời từ phản hồi API
                    $answer = $response->text();
                } else {
                    $answer = "No answer";
                }
            } else {
                $answer = "Giá của sản phẩm không được cung cấp trong ngữ cảnh do đó tôi không thể trả lời câu hỏi.";
            }
        }

        elseif (stripos($question, 'sản phẩm nổi bật nhất') !== false) {
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

        // Kiểm tra câu hỏi về giá của sản phẩm nổi bật
        elseif (stripos($question, 'giá của sản phẩm') !== false) {
            // Lấy danh sách các sản phẩm nổi bật đã lưu trong session
            $bestProductIds = $request->session()->get('bestProductIds');

            if ($bestProductIds) {
                // Tìm tên sản phẩm từ câu hỏi
                $productName = str_replace('giá của sản phẩm', '', $question);
                $productName = trim($productName);

                // Tìm product_id dựa trên tên sản phẩm
                $productId = array_search($productName, $bestProductIds);

                if ($productId) {
                    $product = ProductVariant::find($productId);
                    if ($product) {
                        $discountedPrice = $product->price * (1 - $product->discount / 100);
                        $formattedPrice = number_format($discountedPrice, 0, ',', '.');
                        $answer = "Giá của sản phẩm {$product->name} là {$formattedPrice} VND.";
                    } else {
                        $answer = "Không tìm thấy thông tin giá cho sản phẩm '{$productName}'. Có thể sản phẩm này chưa được cập nhật giá.";
                    }
                } else {
                    $answer = "Không tìm thấy thông tin về sản phẩm '{$productName}'.";
                }
            } else {
                $answer = "Danh sách sản phẩm nổi bật không có sẵn. Vui lòng hỏi về sản phẩm nổi bật trước.";
            }
        }
        // Kiểm tra câu hỏi về stock của sản phẩm nổi bật
        elseif (stripos($question, 'sản phẩm còn hàng không') !== false) {
            // Lấy danh sách các sản phẩm nổi bật đã lưu trong session
            $bestProductIds = $request->session()->get('bestProductIds');

            if ($bestProductIds) {
                // Tìm tên sản phẩm từ câu hỏi, loại bỏ phần "sản phẩm" trong câu hỏi
                $productName = str_replace('sản phẩm còn hàng không', '', $question);
                $productName = trim($productName); // Lọc trắng các ký tự thừa

                // Tìm product_id dựa trên tên sản phẩm
                $productId = array_search($productName, $bestProductIds);

                if ($productId) {
                    $product = ProductVariant::find($productId);
                    if ($product) {
                        // Kiểm tra tồn kho sản phẩm
                        if ($product->stock > 0) {
                            $answer = "Sản phẩm {$product->name} còn hàng.";
                        } else {
                            $answer = "Sản phẩm {$product->name} hết hàng.";
                        }
                    } else {
                        $answer = "Không tìm thấy sản phẩm ";
                    }
                } else {
                    $answer = "Không tìm thấy thông tin về sản phẩm '{$productName}'.";
                }
            } else {
                $answer = "Danh sách sản phẩm nổi bật không có sẵn. Vui lòng hỏi về sản phẩm nổi bật trước.";
            }
        }
        // Kiểm tra câu hỏi về flashsale của sản phẩm nổi bật
        elseif (stripos($question, 'sản phẩm có nằm trong flashsale không') !== false) {
            // Lấy danh sách các sản phẩm nổi bật đã lưu trong session
            $bestProductIds = $request->session()->get('bestProductIds');

            if ($bestProductIds) {
                // Tìm tên sản phẩm từ câu hỏi, loại bỏ phần "sản phẩm" trong câu hỏi
                $productName = str_replace('sản phẩm có nằm trong flashsale không', '', $question);
                $productName = trim($productName); // Lọc trắng các ký tự thừa

                // Tìm product_id dựa trên tên sản phẩm
                $productId = array_search($productName, $bestProductIds);

                if ($productId) {
                    $product = ProductVariant::find($productId);
                    if ($product) {
                        $finalPrice = $product->price;  // Mặc định là giá thông thường

                        // Kiểm tra xem sản phẩm có đang trong chương trình flash sale không
                        $flashSaleProduct = FlashSaleProduct::where('product_variant_id',  $bestProductIds)->first();

                        if ($flashSaleProduct !== null) { // Đảm bảo $flashSaleProduct tồn tại
                            $discountedPrice = $product->price * (1 - $flashSaleProduct->discount_percent / 100);
                            $finalPrice = round($discountedPrice, 2);
                            $answer = "Sản phẩm {$product->name} nằm trong chương trình khuyến mãi và có giá khuyến mãi là {$finalPrice} VND.";
                        } else {
                            $answer = "Sản phẩm {$product->name} không nằm trong chương trình khuyến mãi và có giá thông thường là {$finalPrice} VND.";
                        }
                    } else {
                        $answer = "Không tìm thấy sản phẩm .";
                    }
                } else {
                    $answer = "Không tìm thấy thông tin về sản phẩm '{$productName}'.";
                }
            } else {
                $answer = "Danh sách sản phẩm nổi bật không có sẵn. Vui lòng hỏi về sản phẩm nổi bật trước.";
            }
        }
        elseif (stripos($question, 'sản phẩm flashsale') !== false) {
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

        elseif (stripos($question, 'sản phẩm mới') !== false) {
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

        elseif (stripos($question, 'những sản phẩm giá rẻ nhất') !== false) {
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
        elseif (stripos($question, 'tra cứu đơn hàng') !== false) {
            $answer = 'Đường dẫn để tra cứu đơn hàng là: https://haven-gold.vercel.app/tracking';
        }
        elseif (stripos($question, 'tôi có thể hủy đơn hàng không') !== false) {
            $answer = 'Nếu bạn là người dùng thì sau khi đặt hàng có thể hủy trong phần tài khoản cá nhân, còn là người dùng mua hàng không tài khoản thì sẽ không hủy được, vui lòng liên hệ hotline (0326 482 490) để giải quyết !';
        }
        elseif (stripos($question, 'có thể mua lại đơn hàng đã mua không') !== false) {
            $answer = ' Hiện tại trang web chúng tôi đang cập nhật tính năng trên ! ';
        }
        elseif (stripos($question, 'làm sao để xem lịch sử mua hàng') !== false) {
            $answer = ' Vào phần tài khoản cá nhân của bạn, kích vào mục quản lí đơn hàng để xem ! ';
        }
// KẾT THÚC VỀ ĐƠN HÀNG

// CÂU HỎI VỀ GIAO HÀNG
        elseif (stripos($question, 'khi nào tôi sẽ nhận được hàng') !== false) {
            $answer = ' Thời gian giao hàng dự kiến : 5 ngày làm việc ! ';
        }
        elseif (stripos($question, 'phí vận chuyển là bao nhiêu') !== false) {
            $answer = ' Free Ship TP.HCM, còn lại đồng giá ship 30k ! ';
        }
        elseif (stripos($question, 'làm sao để kiểm tra trạng thái đơn hàng của tôi') !== false) {
            $answer = ' Để kiểm tra trạng thái đơn hàng của bạn, vào phần "https://haven-gold.vercel.app/tracking", nhập mã đơn hàng đã thông báo qua email đặt hàng của bạn, hoặc nhấn vào theo dõi đơn hàng trong mail để xem chi tiết ! ';
        }
        elseif (stripos($question, 'làm sao để kiểm tra trạng thái đơn hàng của tôi') !== false) {
            $answer = ' Để kiểm tra trạng thái đơn hàng của bạn, vào phần "https://haven-gold.vercel.app/tracking", nhập mã đơn hàng đã thông báo qua email đặt hàng của bạn, hoặc nhấn vào theo dõi đơn hàng trong mail để xem chi tiết ! ';
        }
// KẾT THÚC VÊ GIAO HÀNG

// BẮT ĐẦU VÊ THANH TOÁN
        elseif (stripos($question, 'có những phương thức thanh toán nào') !== false) {
            $answer = ' Chúng tôi có 2 phương thức thanh toán : COD và VNPay ! ';
        }
        elseif (stripos($question, 'có những phương thức thanh toán nào') !== false) {
            $answer = ' Chúng tôi có 2 phương thức thanh toán : COD và VNPay ! ';
        }
        elseif (stripos($question, 'có chương trình tích điểm hoặc giảm giá khi thanh toán không') !== false) {
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
        return response()->json([ 'answer' => $answer]);
    }
}
