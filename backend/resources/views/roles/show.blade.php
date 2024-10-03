{{-- @extends('layouts.app') --}}

@section('content')
    <div class="container">
        <h1>User Details</h1>
        <div class="card">
            <div class="card-body">
                <h2 class="card-title">{{ $user->name }}</h2>
                <p class="card-text"><strong>Email:</strong> {{ $user->email }}</p>
                <p class="card-text"><strong>Phone:</strong> {{ $user->phone }}</p>
                <p class="card-text"><strong>Address:</strong> {{ $user->address }}</p>
                <p class="card-text"><strong>Status:</strong> {{ $user->status == 1 ? 'Active' : 'Inactive' }}</p>
                <a href="{{ route('users.edit', $user->id) }}" class="btn btn-warning">Edit</a>
                <a href="{{ route('users.index') }}" class="btn btn-primary">Back to List</a>
            </div>
        </div>
    </div>
{{-- @endsection --}}
