import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import Typography from '../core/Typography';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`flex items-center space-x-2 py-2 ${className}`}
    >
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            to="/"
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Home"
          >
            <Home className="w-4 h-4" />
          </Link>
        </li>
        
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.label} className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
              {isLast ? (
                <Typography
                  variant="body-sm"
                  color="primary"
                  className="font-medium"
                  aria-current="page"
                >
                  {item.label}
                </Typography>
              ) : (
                <Link
                  to={item.href || '#'}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;