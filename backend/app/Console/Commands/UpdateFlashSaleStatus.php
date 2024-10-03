<?php

namespace App\Console\Commands;

use App\Models\FlashSale;
use Carbon\Carbon;
use Illuminate\Console\Command;

class UpdateFlashSaleStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-flash-sale-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cập nhật trạng thái của Flash Sale dựa trên thời gian hiện tại';
    

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $currentTime = Carbon::now('Asia/Ho_Chi_Minh');
        // Kích hoạt Flash Sale nếu trong thời gian hợp lệ
        FlashSale::where('start_time', '<=', $currentTime)
                 ->where('end_time', '>', $currentTime)
                 ->where('status', 0)
                 ->update(['status' => 1]);

        // Vô hiệu hóa Flash Sale nếu đã hết thời gian
        FlashSale::where('end_time', '<', $currentTime)
                 ->update(['status' => 0]);
        $this->info('Cập nhật trạng thái Flash Sale thành công!'); 
    }
}
