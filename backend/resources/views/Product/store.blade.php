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
        <form action="{{route('Product.store')}}" enctype="multipart/form-data"  method="post"  >
          @csrf
            <div>
                <h1>Main product</h1>
                <div class="mb-3">
                    <label for="name" class="form-label">Name product </label>
                    <input type="text" class="form-control" id="name_product" name="name_product" required>
                </div>
                <label for="category_id" class="form-label">Category ID</label>
            <select class="form-select" name="category_id" aria-label="Default select example">
                @foreach ($categories as $item)
                    <option value="{{$item->id}}">{{$item->name}}</option>
                @endforeach


              </select>

            <label for="brand_id" class="form-label">Brand ID</label>
            <select class="form-select" name="brand_id" aria-label="Default select example">
                @foreach ($brands as $item)
                    <option value="{{$item->id}}">{{$item->name}}</option>
                @endforeach


              </select>
              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea class="form-control" id="description" name="description" rows="3"></textarea>
            </div>
            <div class="mb-3">
                <label for="formFileMultiple" class="form-label">Img 2</label>
                <input class="form-control" type="file" id="formFileMultiple" name="images[]" >
            </div>
            {{-- <div class="mb-3">
                <label for="formFileMultiple" class="form-label">Img 2</label>
                <input class="form-control" type="file" id="formFileMultiple" name="images[]" >
            </div>
            <div class="mb-3">
                <label for="formFileMultiple" class="form-label">Img 3</label>
                <input class="form-control" type="file" id="formFileMultiple" name="images[]" >
            </div> --}}
            </div>
            <div id="variants">
                <h4>Thêm biến thể</h4>
                <div class="variant">
                    <div class="mb-3">
                        <label for="name" class="form-label">Name product variant</label>
                        <input type="text" class="form-control" id="name" name="name[]" required>
                    </div>
                    <div class="mb-3">
                        <label for="price" class="form-label">Price</label>
                        <input type="number" step="0.01" class="form-control" id="price" name="price[]" required>
                    </div>

                    <div class="mb-3">
                        <label for="quantity" class="form-label">Stock</label>
                        <input type="number" class="form-control" id="quantity" name="stock[]" required>
                    </div>
                    <div class="mb-3">
                        <label for="expiry" class="form-label">variant_value</label>
                        <input type="text" class="form-control" id="expiry" name="variant_value[]">
                    </div>
                    <div class="mb-3">
                        <label for="formFileMultiple" class="form-label">Multiple files input example</label>
                        <input class="form-control" type="file" id="formFileMultiple" name="image[]" multiple>
                    </div>
                    <div class="mb-3">
                        <label for="sale" class="form-label">Discount</label>
                        <input type="number" step="0.01" class="form-control" id="sale" name="discount[]">
                    </div>
                </div>
            </div>
            <hr>

            <button type="button" id="add-variant">Thêm biến thể</button>

            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>
    <script>
        document.getElementById('add-variant').addEventListener('click', function() {
            var variantCount = document.querySelectorAll('.variant').length;
            var newVariant = `
                 <div class="variant">
                   <h1>  Nhập thêm sản phẩm </h1>
                    <div class="mb-3">
                        <label for="name" class="form-label">Name product variant</label>
                        <input type="text" class="form-control" id="name" name="name[]" required>
                    </div>
                    <div class="mb-3">
                        <label for="price" class="form-label">Price</label>
                        <input type="number" step="0.01" class="form-control" id="price" name="price[]" required>
                    </div>
                    <div class="mb-3">
                        <label for="quantity" class="form-label">Stock</label>
                        <input type="number" class="form-control" id="quantity" name="stock[]" required>
                    </div>
                    <div class="mb-3">
                        <label for="expiry" class="form-label">Variant value</label>
                        <input type="text" class="form-control" id="expiry" name="variant_value[]">
                    </div>
                    <div class="mb-3">
                        <label for="formFileMultiple" class="form-label">Multiple files input example</label>
                        <input class="form-control" type="file" id="formFileMultiple" name="image[]" multiple>
                    </div>
                    <div class="mb-3">
                        <label for="sale" class="form-label">Discount</label>
                        <input type="number" step="0.01" class="form-control" id="sale" name="discount[]">
                    </div>
                </div>
            <hr>

            `;
            document.getElementById('variants').insertAdjacentHTML('beforeend', newVariant);
        });
        </script>
</body>
</html>
