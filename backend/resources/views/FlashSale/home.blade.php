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
      <form action="{{ route('FlashSale.index') }}" method="GET">
       <select name="status" id="status">
        <option value="">All</option>
        <option value="1">Active</option>
        <option value="0">In Active</option>
       </select>
       <input type="submit">
      </form>
        <table class="table">
            <thead>
              <tr>
                <th scope="col">#id</th>
                <th scope="col">start time</th>
                <th scope="col">end time</th>
                <th scope="col">status</th>
                <th scope="col">action</th>
              </tr>
            </thead>
            <tbody>
                @foreach ($flashSales as $item)
                <tr>

                    <th scope="row">{{$item->id}}</th>
                    <td>{{$item->start_time}}</td>
                    <td>{{$item->end_time}}</td>
                    <td>{{$item->StatusName}}</td>
                    <td><a href="{{ route('FlashSale.edit',['flashsale' => $item]) }}" class="btn btn-primary">edit</a>
                    
                      <form action="{{  route('FlashSale.delete',$item)  }}" method="post">
                        @csrf
                        @method('DELETE')
                        <button class="btn btn-danger">Delete</button>
                      </form>
                    </span>
                     
                    </td>
                  </tr>
                    </td>
                  </tr>
                @endforeach 
            </tbody>
          </table>
        
          {{ $flashSales->links() }}

    </div>
</body>
</html>