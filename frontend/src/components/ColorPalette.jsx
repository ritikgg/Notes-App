import React from 'react';

const COLORS = [
    "#ffffff", // White
    "#fae8ff", // Purple
    "#fef9c3", // Yellow
    "#dcfce7", // Green
    "#e0f2fe", // Blue
    "#ffedd5", // Orange
];

const ColorPalette = ({ selectedColor, onSelectColor }) => {
  return (
    <div className="flex gap-2 items-center mt-2 mb-2">
        {COLORS.map((color) => (
            <div
                key={color}
                onClick={() => onSelectColor(color)}
                className={`w-6 h-6 rounded-full cursor-pointer border border-gray-300 transition-transform hover:scale-110 ${
                    selectedColor === color ? "ring-2 ring-blue-500 ring-offset-1" : ""
                }`}
                style={{ backgroundColor: color }}
            />
        ))}
    </div>
  );
};

export default ColorPalette;