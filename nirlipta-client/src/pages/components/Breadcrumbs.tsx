import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
    label: string;
    icon?: React.ReactNode;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
    return (
        <div className="breadcrumbs text-sm">
            <ul>
                {items.map((item, index) => (
                    <li key={index}>
                        {item.href ? (
                            <Link to={item.href} className="flex items-center gap-2">
                                {item.icon && <span className="h-4 w-4 stroke-current">{item.icon}</span>}
                                {item.label}
                            </Link>
                        ) : (
                            <span className="inline-flex items-center gap-2">
                {item.icon && <span className="h-4 w-4 stroke-current">{item.icon}</span>}
                                {item.label}
              </span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Breadcrumbs;
