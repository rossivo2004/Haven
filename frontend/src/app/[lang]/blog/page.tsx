// import { title } from "@/src/components/primitives";

// export default function BlogPage() {
//   return (
//     <div>
//       <h1 className={title()}>Blog</h1>
//     </div>
//   );
// }

import BlogDetail from '@/src/components/BlogDetail/BlogDetail';
import BodyBlog from '@/src/components/BodyBlog/BodyBlog';



const BlogPage = () => {
  return (
    <div>
      <BodyBlog />
    </div>
  );
};

export default BlogPage;
