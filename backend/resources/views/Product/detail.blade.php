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
     
        <ul>
          <li>
            {{$productVariant->name}}
          </li>
          <li>
            <img src="{{$productVariant->image}}" alt="" style="width: 50px; height: 50px" width="50px" height="50px">
          </li>
          <li>
            {{$productVariant->price}}
          </li>
          <li>
            {{$product->description}}
          </li>
        </ul>
        <h1>Ảnh tham khảo</h1>
        @foreach ($productImages as $item)
        <img src="{{$item->image}}" alt="" style="width: 50px; height: 50px" width="50px" height="50px">
        @endforeach
        <h1>Biến thể</h1>
        @foreach ($relatedProductVariants as $item)
        <ul>
          <li>
            {{$item->name}}
          </li>
          <li>
            {{$item->price}}
          </li>
          <li>
            <img src="{{$item->image}}" alt="" style="width: 50px; height: 50px" width="50px" height="50px">
          </li>
        </ul>
        @endforeach
       
    </div>
</body>
</html>