import React, { useState } from "react";
import '../App.css'

const Collapse = ({ items, limit = 5, renderItem }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const displayedItems = isCollapsed ? items.slice(0, limit) : items;

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {displayedItems.map((item,index) => (
          <React.Fragment key={`${item.id}-${index}`}>{renderItem(item)}</React.Fragment>
        ))}
      </div>

      {items.length > limit && (
        <div className="mt-6 text-center">
          <button
            onClick={toggleCollapse}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
          >
            {isCollapsed ? `Show All (${items.length})` : "Show Less"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Collapse;
