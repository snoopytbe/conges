import React from 'react';
import './style.css';
import Calendrier from './Calendrier';

export default function App() {
  return (
    <div>
      <Calendrier annee={2020} />
    </div>
  );
}
