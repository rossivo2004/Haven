{{-- @extends('layouts.app') --}}
<form action="{{ route('logout') }}" method="POST" style="display: inline;">
    @csrf
    <button type="submit" class="btn btn-danger">Đăng xuất</button>
</form>
@section('content')
    <h1>Roles</h1>
    <a href="{{ route('roles.create') }}" class="btn btn-primary">Create Role</a>
    <ul>
        @foreach ($roles as $role)
            <li>
                {{ $role->name }} - {{ $role->description }}
                <a href="{{ route('roles.show', $role->id) }}">View</a>
                <a href="{{ route('roles.edit', $role->id) }}">Edit</a>
                <form action="{{ route('roles.destroy', $role->id) }}" method="POST" style="display: inline;">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="btn btn-danger">Delete</button>
                </form>
            </li>
        @endforeach
    </ul>
{{-- @endsection --}}
