<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
</head>
<body>
    <div class="container mt-5">
<<<<<<< HEAD
      <form action="">
        <input type="search" name="search">
      </form>
=======
>>>>>>> origin/TNghia
        <table class="table">
            <thead>
              <tr>
                <th scope="col">#id</th>
                <th scope="col">name</th>
                <th scope="col">action</th>
              </tr>
            </thead>
            <tbody>
<<<<<<< HEAD
                @foreach ($products as $item)
=======
                @foreach ($product as $item)
>>>>>>> origin/TNghia
                <tr>
                    <th scope="row">{{$item->id}}</th>
                    <td>{{$item->name}}</td>
                    <td><a href="{{route('Product.edit',['product' => $item->id])}}" class="btn btn-primary">edit</a>
                      <form action="{{ route('Product.delete', $item) }}" method="post">
    
                        @csrf
                        @method('DELETE')
                        <button class="btn btn-danger">Delete</button>
                      </form>
                    </span>
                      {{-- <a href="{{route('delete',['product' => $item->id])}}" class="btn btn-primary">delete</a> --}}
                    </td>
                  </tr>
                    </td>
                  </tr>
                @endforeach 
            </tbody>
          </table>
        
<<<<<<< HEAD
          {{ $products->links() }}
=======
>>>>>>> origin/TNghia

    </div>
</body>
</html>