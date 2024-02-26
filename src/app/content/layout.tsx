import React from "react";

export default function layout({children}: {children: React.ReactNode}) {
    return (
        <div className="flex flex-col md:flex-row md:overflow-hidden">
            <div className="flex-grow w-full md:overflow-y-auto md:p-12 flex items-center justify-center">
                {children}
            </div>
        </div>
    );
}