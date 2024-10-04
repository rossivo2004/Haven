{{-- @extends('layouts.app') --}}

@section('content')
    <h1>Create Role</h1>

    <form action="{{ route('roles.store') }}" method="POST">
        @csrf
        <label>Name:</label>
        <input type="text" name="name" value="{{ old('name') }}">
        @error('name') <span>{{ $message }}</span> @enderror

        <label>Description:</label>
        <textarea name="description">{{ old('description') }}</textarea>

        <button type="submit">Create</button>
    </form>
{{-- @endsection --}}
