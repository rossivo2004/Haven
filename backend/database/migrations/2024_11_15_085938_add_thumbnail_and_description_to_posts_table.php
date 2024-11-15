<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->string('thumbnail')->nullable()->after('content'); // Thêm cột ảnh đại diện
            $table->text('description')->nullable()->after('thumbnail'); // Thêm cột mô tả
        });
    }

    public function down()
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn('thumbnail');
            $table->dropColumn('description');
        });
    }
};
