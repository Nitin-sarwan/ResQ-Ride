import React from 'react';

const LocationSearchPanel = (props) => {
  const suggestions = props.suggestions || [];

  return (
    <div className='bg-black-500'>
      {/* Display fetched suggestions */}
      {
        suggestions.map((elem, index) => (
          <div
            key={index}
            onClick={() => {
              props.handleSuggestionClick(elem, props.activeField);
              // props.setVehiclePanelOpen(true);
              // props.setPanelOpen(false);
            }}
            className='flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start'
          >
            <h2 className='bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full'><i className="ri-map-pin-fill"></i></h2>
            <h4 className='font-medium capitalize'>{elem.description}</h4>
          </div>
        ))
      }
    </div>
  );
};

export default LocationSearchPanel;