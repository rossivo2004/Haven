
<form action="{{ route('logout') }}" method="POST" style="display: inline;">
    @csrf
    <button type="submit" class="btn btn-danger">Đăng xuất</button>
</form>
<a href="{{ route('roles.index') }}">Role</a>
    <div class="container">
        <h1>User List</h1>
        @if ($errors->any())
            <div class="alert alert-danger">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif
        <a href="{{ route('users.create') }}" class="btn btn-primary">Add New User</a>
        <table class="table mt-3">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Ảnh</th>
                    <th>Roles</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($users as $user)
                    <tr>
                        <td>{{ $user->name }}</td>
                        <td>{{ $user->email }}</td>
                        <td>{{ $user->phone }}</td>
                        <td>{{ $user->status == 1 ? 'Active' : 'Inactive' }}</td>
                        <td>
                            <img src="{{ $user->image }}" alt="User Image" style="width: 150px; height: 150px;">
                        </td>
                        <td>{{ $user->role->name ?? 'Chưa có vai trò' }}</td>

                        <td>
                            <a href="{{ route('users.show', $user->id) }}" class="btn btn-info">View</a>
                            <a href="{{ route('users.edit', $user->id) }}" class="btn btn-warning">Edit</a>
                            <form action="{{ route('users.destroy', $user->id) }}" method="POST" style="display:inline-block;">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-danger">Delete</button>
                            </form>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
