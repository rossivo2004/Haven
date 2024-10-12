<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
</head>

<body>
    <div class="container mt-5">
        <h2>Create Product</h2>
        <form action="{{ route('FlashSale.update', ['flashsale' => $flashSale->id]) }}" enctype="multipart/form-data" method="post">
            @csrf
            @method('PUT')
            <div>
                <h1>Set flash sale</h1>
                <div class="mb-3">
                    <label for="start_time" class="form-label">Start time </label>
                    <input type="datetime-local" class="form-control" id="start_time" name="start_time" value="{{$flashSale->start_time}}" required>
                </div>
                <div class="mb-3">
                    <label for="end_time" class="form-label">End time </label>
                    <input type="datetime-local" class="form-control" id="end_time" name="end_time" value="{{$flashSale->end_time}}" required>
                </div>

            </div>
            <div id="variants">
                @foreach ($productVariantFlashSales as $product)
                <div class="variant">
                    <h4>Sản phẩm flash sale</h4>
                    <div class="mb-3">
                    <input type="checkbox" name="delete_variants[]" value="{{ $product->pivot->id }}"> Xóa
                    {{-- id bảng trung gian  --}}
                    <input type="hidden" name="variant_id[]" value="{{$product->pivot->id }}">

                        <label for="product_ids" class="form-label">Products</label>
                        <select  class="form-control" id="product_ids" name="product_variant_ids[]">
                            @foreach ($productVariants as $item)
                                <option value="{{$item->id}}"
                                    @if ($product->id == $item->id)
                                        selected
                                    @endif
                                    >{{ $item->name }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="quantity" class="form-label">Stock</label>
                        <input type="number" class="form-control" id="quantity" name="stocks[]" value="{{$product->pivot->stock}}" required>
                    </div>
                    <div class="mb-3">
                        <label for="quantity" class="form-label">Discount percent</label>
                        <input type="number" class="form-control" id="quantity" name="discount_percents[]"  value="{{$product->pivot->discount_percent}}" required>
                    </div>
                </div>
                    @endforeach
                
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
                    <h4>Thêm sản phẩm flash sale</h4>
                    <div class="mb-3">
                        <label for="product_ids" class="form-label">Products</label>
                        <select  class="form-control" id="product_ids" name="product_variant_ids[]">
                            @foreach ($productVariants as $item)
                                <option value="{{ $item->id }}">{{ $item->name }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="quantity" class="form-label">Stock</label>
                        <input type="number" class="form-control" id="quantity" name="stocks[]" required>
                    </div>
                    <div class="mb-3">
                        <label for="quantity" class="form-label">Discount percent</label>
                        <input type="number" class="form-control" id="quantity" name="discount_percents[]" required>
                    </div>
                </div>
            <hr>


            `;
            document.getElementById('variants').insertAdjacentHTML('beforeend', newVariant);
        });
    </script>
</body>

</html>
