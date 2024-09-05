'use client'
import { formatVND } from "@/src/utils";
import Link from "next/link";
import { Blog } from "@/src/interface";
import DateRangeIcon from '@mui/icons-material/DateRange';

function BoxBlog({ blog }: { blog: Blog }) {
    const {id, name, date_created, description, img} = blog;

    return (
        <Link href={`/${id}`}>
        <div className="w-full h-auto flex flex-col lg:flex-row group gap-5">
          <div className="w-full h-[240px] lg:h-[240px] object-cover flex items-center justify-center overflow-hidden rounded-lg">
            <img
              src={img}
              alt="Product  gg"
              className="w-full h-full object-cover group-hover:scale-110 transition-all rounded-lg"
            />
          </div>
          <div className="w-full h-auto flex flex-col justify-between mt-4 lg:mt-0">
            <div className="font-semibold text-base lg:text-xl text-start group-hover:text-main">
              {name}
            </div>
            
            <div className="flex flex-col justify-between gap-2">
                <div>
              <DateRangeIcon className="mr-2" />{date_created}
                </div>
              <div className="font-bold text-xs lg:text-sm">
                {description.length > 200 ? `${description.slice(0, 200)}...` : description}
              </div>
            </div>
          </div>
        </div>
      </Link>
      
    );
}

export default BoxBlog;
