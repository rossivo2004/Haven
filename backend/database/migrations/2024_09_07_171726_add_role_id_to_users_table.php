<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRoleIdToUsersTable extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('role_id')->nullable(); // Thêm cột role_id, có thể cho phép null nếu cần
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade'); // Thiết lập khóa ngoại
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']); // Xóa khóa ngoại
            $table->dropColumn('role_id'); // Xóa cột role_id
        });
    }
}

