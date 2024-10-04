<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    // Danh sách Role
    public function index()
    {
        $roles = Role::all();
        return response()->json($roles, 200);
    }

    // Hiển thị form tạo Role
    public function create()
    {
        return view('roles.create');
    }

    // Lưu Role mới
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
        ]);

        $role = Role::create([
            'name' => $request->name,
        ]);

        return response()->json(['message' => 'Role created successfully!', 'role' => $role], 201);
    }


    // Hiển thị thông tin Role
    public function show(Role $role)
    {
        return response()->json($role, 200);
    }

    // Hiển thị form chỉnh sửa Role
    public function edit(Role $role)
    {
        return view('roles.edit', compact('role'));
    }

    // Cập nhật Role
    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
        ]);

        $role->update([
            'name' => $request->name,
        ]);

        return response()->json(['message' => 'Role updated successfully!', 'role' => $role], 200);
    }

    // Xóa Role (API)
    public function destroy(Role $role)
    {
        $role->delete();
        return response()->json(['message' => 'Role deleted successfully!'], 200);
    }
}

