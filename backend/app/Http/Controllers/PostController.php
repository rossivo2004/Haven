<?php

namespace App\Http\Controllers;

use App\Models\Post;
use DOMDocument;
use Illuminate\Http\Request;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Exception;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::all();
        return response()->json(['posts' => $posts], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $content = $request->content;
        $dom = new DOMDocument();
        @$dom->loadHTML('<?xml encoding="utf-8" ?>' . $content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        $images = $dom->getElementsByTagName('img');

        foreach ($images as $key => $img) {
            $src = $img->getAttribute('src');

            if (strpos($src, 'data:image/') === 0) {
                $data = base64_decode(explode(',', explode(';', $src)[1])[1]);

                $tempImage = tmpfile();
                fwrite($tempImage, $data);
                $tempFilePath = stream_get_meta_data($tempImage)['uri'];

                try {
                    $uploadedFileUrl = Cloudinary::upload($tempFilePath)->getSecurePath();
                    $img->removeAttribute('src');
                    $img->setAttribute('src', $uploadedFileUrl);
                } catch (Exception $e) {
                    fclose($tempImage);
                    return response()->json(['error' => 'Failed to upload image to Cloudinary'], 500);
                } finally {
                    fclose($tempImage);
                }
            }
        }

        $content = $dom->saveHTML();
        $post = Post::create([
            'title' => $request->title,
            'content' => $content,
        ]);

        return response()->json(['message' => 'Post created successfully', 'post' => $post], 201);
    }

    public function show($id)
    {
        $post = Post::find($id);
        if (!$post) {
            return response()->json(['error' => 'Post not found'], 404);
        }
        return response()->json(['post' => $post], 200);
    }

    public function update(Request $request, $id)
    {
        $post = Post::find($id);
        if (!$post) {
            return response()->json(['error' => 'Post not found'], 404);
        }

        $content = $request->content;
        $dom = new DOMDocument();
        @$dom->loadHTML('<?xml encoding="utf-8" ?>' . $content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);

        $images = $dom->getElementsByTagName('img');

        foreach ($images as $key => $img) {
            $src = $img->getAttribute('src');

            if (strpos($src, 'data:image/') === 0) {
                $data = base64_decode(explode(',', explode(';', $src)[1])[1]);

                $tempImage = tmpfile();
                fwrite($tempImage, $data);
                $tempFilePath = stream_get_meta_data($tempImage)['uri'];

                try {
                    $uploadedFileUrl = Cloudinary::upload($tempFilePath)->getSecurePath();
                    $img->removeAttribute('src');
                    $img->setAttribute('src', $uploadedFileUrl);
                } catch (Exception $e) {
                    fclose($tempImage);
                    return response()->json(['error' => 'Failed to upload image to Cloudinary'], 500);
                } finally {
                    fclose($tempImage);
                }
            }
        }

        $content = $dom->saveHTML();
        $post->update([
            'title' => $request->title,
            'content' => $content,
        ]);

        return response()->json(['message' => 'Post updated successfully', 'post' => $post], 200);
    }

    public function destroy($id)
    {
        $post = Post::find($id);
        if (!$post) {
            return response()->json(['error' => 'Post not found'], 404);
        }

        $dom = new DOMDocument();
        @$dom->loadHTML($post->content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        $images = $dom->getElementsByTagName('img');

        foreach ($images as $img) {
            $src = $img->getAttribute('src');

            $publicId = basename($src, '.' . pathinfo($src, PATHINFO_EXTENSION));
            try {
                Cloudinary::destroy($publicId);
            } catch (Exception $e) {
                return response()->json(['error' => 'Failed to delete image from Cloudinary'], 500);
            }
        }

        $post->delete();
        return response()->json(['message' => 'Post deleted successfully'], 200);
    }
}
