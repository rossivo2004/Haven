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
        <h2>Create Product</h2>
        <form action="/api/brand/update/{{$brand->id}}" enctype="multipart/form-data"  method="post"  >
          @csrf
          @method('PUT')
            <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input type="text" value="{{$brand->name}}" class="form-control" id="name" name="name" required>
             
                <div class="mb-3">
                    <label for="formFileMultiple" class="form-label">Logo</label>
                    <input class="form-control" type="file" id="formFileMultiple" name="image" multiple>
                    <img src="{{  $brand->image }}" style="width: 300px" height="300px" alt="">
                    {{-- <img src="https://res.cloudinary.com/dkp2b25gf/image/upload/v1725873251/1725873248.jpeg.jpg" style="width: 300px" height="300px" alt=""> --}}
                </div>
                
            </div>
            
            <button type="submit" class="btn btn-primary">edit</button>
        </form>
    </div>
</body>
</html>