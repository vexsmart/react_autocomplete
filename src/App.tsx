import React, { useState, useEffect, useRef, useMemo } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [appliedQuery, setAppliedQuery] = useState<string>('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number>(0);

  const peopleData = peopleFromServer;

  const delay = 300;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);

    setSelectedPerson(null);

    window.clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(() => {
      setAppliedQuery(event.target.value);
    }, delay);
  };

  const filteredPeople = useMemo(() => {
    if (appliedQuery.trim().length > 0) {
      return peopleData.filter(person =>
        person.name
          .toLowerCase()
          .trim()
          .includes(appliedQuery.toLowerCase().trim()),
      );
    }

    return peopleData;
  }, [appliedQuery, peopleData]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : `No selected person`}
        </h1>

        <div className={`dropdown ${isDropDownOpen ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              ref={inputRef}
              placeholder="Enter a part of the name"
              value={query}
              onChange={handleSearch}
              className="input"
              data-cy="search-input"
              onFocus={() => setIsDropDownOpen(true)}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  key={person.slug}
                  data-cy="suggestion-item"
                  onClick={() => {
                    setSelectedPerson(person);
                    setQuery(person.name);
                    setIsDropDownOpen(false);
                  }}
                >
                  <p
                    className={
                      person.sex === 'm' ? 'has-text-info' : 'has-text-danger'
                    }
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {filteredPeople.length === 0 && (
          <div
            className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </main>
    </div>
  );
};
