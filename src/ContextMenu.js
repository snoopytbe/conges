import React from 'react';

const [mousePos, setMousePos] = React.useState({
  mouseX: null,
  mouseY: null,
});
const [activeMenu, setActiveMenu] = React.useState({});
const [contextData, setContextData] = React.useState(null);

export function handleCellClick(params) {
  const { event, myDate } = params;

  event.preventDefault();
  setMousePos({
    mouseX: event.clientX - 2,
    mouseY: event.clientY - 4,
  });
  setActiveMenu({});
  setContextData({ date: myDate });
  alert(JSON.stringify(myDate));
}
