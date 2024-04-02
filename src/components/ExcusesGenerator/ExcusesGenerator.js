import React, { useState, useEffect } from 'react';
import initialExcuses from '../ExcusesData/ExcusesData';
import './ExcusesGenerator.scss';
import DogExcuse from "../../assets/images/dog-excuse.jpg";

function ExcusesGenerator() {
  const [excuses, setExcuses] = useState(() => {
    const storedExcuses = localStorage.getItem('excuses');
    return storedExcuses ? JSON.parse(storedExcuses) : initialExcuses;
  });
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [currentExcuse, setCurrentExcuse] = useState('');
  const [newExcuse, setNewExcuse] = useState('');
  const [viewMode, setViewMode] = useState('random');

  const categories = Object.keys(excuses);
  const subcategories = category ? Object.keys(excuses[category]) : [];

  useEffect(() => {
    localStorage.setItem('excuses', JSON.stringify(excuses));
  }, [excuses]);

  const generateExcuse = () => {
    if (category && subcategory) {
      const randomIndex = Math.floor(Math.random() * excuses[category][subcategory].length);
      setCurrentExcuse(excuses[category][subcategory][randomIndex]);
    }
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setSubcategory('');
    setCurrentExcuse('');
  };
  
  const handleSubcategoryChange = (e) => {
    setSubcategory(e.target.value);
    setCurrentExcuse('');
  };

  const addExcuse = (e) => {
    e.preventDefault();
    if (newExcuse && category && subcategory) {
      const updatedExcuses = { ...excuses };
      if (!updatedExcuses[category][subcategory]) {
        updatedExcuses[category][subcategory] = [];
      }
      updatedExcuses[category][subcategory].push(newExcuse);
      setExcuses(updatedExcuses);
      setNewExcuse('');
    }
  };

  const deleteExcuse = (excuseToDelete) => {
    const updatedExcuses = { ...excuses };
    const categoryKeys = Object.keys(updatedExcuses);
    for (const catKey of categoryKeys) {
      const subcategoryKeys = Object.keys(updatedExcuses[catKey]);
      for (const subKey of subcategoryKeys) {
        // Check if the excuseToDelete is not included in the initialExcuses
        if (!initialExcuses[catKey][subKey].includes(excuseToDelete)) {
          updatedExcuses[catKey][subKey] = updatedExcuses[catKey][subKey].filter(excuse => excuse !== excuseToDelete);
        }
      }
    }
    setExcuses(updatedExcuses);
  };

  return (
    <div className="excuse-generator">
      <img src={DogExcuse} className="dog-excuse" alt="dog excuse" />
      <h2 className="title">Need an excuse?</h2>
      <select className="excuse-generator__select-category" onChange={handleCategoryChange} value={category}>
        <option value="">Select Category</option>
        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
      </select>

      <select className="excuse-generator__select-subcategory" onChange={handleSubcategoryChange} value={subcategory} disabled={!category}>
        <option value="">Select Subcategory</option>
        {subcategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
      </select>

      <div className="excuse-generator__buttons">
        <button className="excuse-generator__button" onClick={() => {setViewMode('random'); generateExcuse();}}>Random Excuse</button>
        <button className="excuse-generator__button" onClick={() => setViewMode('choose')}>Choose Excuse</button>
      </div>

      {viewMode === 'choose' && category && subcategory && (
        <div>
          <select className="excuse-generator__select" onChange={(e) => setCurrentExcuse(e.target.value)} value={currentExcuse}>
            <option value="">--Please choose an excuse--</option>
            {excuses[category][subcategory].map((excuse, index) => (
              <option key={index} value={excuse}>{excuse}</option>
            ))}
          </select>
          <button className="excuse-generator__button delete" onClick={() => deleteExcuse(currentExcuse)}>Delete Excuse</button>
        </div>
      )}

      {currentExcuse && <p className="excuse-generator__current-excuse">{currentExcuse}</p>}

      <form className="excuse-generator__form" onSubmit={addExcuse}>
        <input
          className="excuse-generator__input"
          type="text"
          value={newExcuse}
          onChange={(e) => setNewExcuse(e.target.value)}
          placeholder="Type your new excuse"
        />
        <button className="excuse-generator__button" type="submit">Add Excuse</button>
      </form>
    </div>
  );
}

export default ExcusesGenerator;
