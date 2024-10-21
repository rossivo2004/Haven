// Haven/frontend/src/app/[lang]/(auth)/layout.tsx

import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div>
          
            <main>
                {children}
            </main>
         
        </div>
    );
};

export default Layout;