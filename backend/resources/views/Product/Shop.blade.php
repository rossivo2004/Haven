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
      <div>
        <form action="">
          <input type="search" name="search">
        </form>
        <a href="?">All</a> -
        <form action="">
        @foreach ($categories as $item)
      
          <input type="checkbox" name="category[]" value="{{$item->id}}" id="">{{$item->name}}
        
         
            
        @endforeach
        Brands

        @foreach ($brands as $item)
        
            <input type="checkbox" name="brand[]" value="{{$item->id}}" id="">{{$item->name}}
          
           
              
          @endforeach
        <input type="submit" value="submit">
      </form>


        
      </div>
      <div>
        <form action="">
          <input type="checkbox" name="priceRanges[]" value="0-100" id="">0-100
          <input type="checkbox" name="priceRanges[]" value="100-200">100-200
          <input type="checkbox" name="priceRanges[]" value="200-300">200-300
          <input type="submit" value="submit">
        </form>
      </div>
        <table class="table">
            <thead>
              <tr>
                <th scope="col">#id</th>
                <th scope="col">name</th>
                <th scope="col">tag</th>
                <th scope="col">img</th>
                <th scope="col">action</th>
              </tr>
            </thead>
            <tbody>
                @foreach ($productvariants as $item)
                <tr>
                    <th scope="row">{{$item->id}}</th>
                    <td>{{$item->name}}</td>
                    <td>{{$item->tag}}</td>
                    <td><img src="{{$item->image}}" alt="" style="width: 50px; height: 50px" width="50px" height="50px"></td>
                    <td><a href="{{route('Product.show',['productVariant' => $item->id])}}" class="btn btn-primary">show</a>
                    </td>
                  </tr>
                    </td>
                  </tr>
                @endforeach 
            </tbody>
          </table>
        
          {{ $productvariants->links() }}
    </div>
</body>
</html>