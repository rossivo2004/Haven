import { Breadcrumbs, BreadcrumbItem as NextUiBreadcrumbItem } from "@nextui-org/react";

interface BreadcrumbItem {
  name: string;
  link: string;
}

function BreadcrumbNav({ items }: { items: BreadcrumbItem[] }) {
    return (
        <Breadcrumbs className="overflow-hidden">
            {items.map((item, index) => (
                <NextUiBreadcrumbItem key={index} href={item.link}>
                    {item.name}
                </NextUiBreadcrumbItem>
            ))}
        </Breadcrumbs>
    );
}

export default BreadcrumbNav;
