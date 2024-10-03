<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    
    public function up(): void
    {
        Schema::create('flash_sales', function (Blueprint $table) {
            $table->id();      
            $table->timestamp('start_time')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('end_time')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->boolean('status')->default(false);  
            $table->timestamps();            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flash_sales');
    }
};
