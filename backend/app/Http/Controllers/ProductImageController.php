<?php

namespace App\Http\Controllers;

use App\Models\Product_image;
use App\Http\Requests\StoreProduct_imageRequest;
use App\Http\Requests\UpdateProduct_imageRequest;
use App\Models\ProductImage;

class ProductImageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProduct_imageRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductImage $product_image)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductImage $product_image)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProduct_imageRequest $request, ProductImage $product_image)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductImage $product_image)
    {
        //
    }
}
