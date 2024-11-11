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
        $table->unsignedBigInteger('id_user')->nullable()->after('id');
        $table->foreign('id_user')->references('id')->on('users')->onDelete('set null');
        
    });
}

public function down()
{
    Schema::table('posts', function (Blueprint $table) {
        $table->dropForeign(['id_user']); // xóa khóa ngoại
        $table->dropColumn('id_user'); // xóa cột id_user
    });
}

};
