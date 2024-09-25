<?php

namespace App\Http\Controllers;

use App\Models\Product_variant;
use App\Http\Requests\StoreProduct_variantRequest;
use App\Http\Requests\UpdateProduct_variantRequest;
use App\Models\ProductVariant;

class ProductVariantController extends Controller
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
    public function store(StoreProduct_variantRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductVariant $product_variant)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductVariant $product_variant)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProduct_variantRequest $request, ProductVariant $product_variant)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductVariant $product_variant)
    {
        //
    }
}
