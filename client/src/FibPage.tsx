import React, { useState, useEffect } from 'react';
import axios from 'axios';

type IndexValue = {
  number: string;
};

type SeenIndexValues = {
  [index: string]: IndexValue;
};

export const FibPage: React.FunctionComponent = () => {
  const [values, setValues] = useState<SeenIndexValues>({});
  const [seen, setSeenIndexes] = useState<IndexValue[]>([]);
  const [inputIndex, setInputIndex] = useState<string>('');

  const fetchValues = async () => {
    const values = await axios.get<SeenIndexValues>('/api/values/current');
    setValues(values.data);
  };

  const fetchIndexes = async () => {
    const seenIndexes = await axios.get<IndexValue[]>('/api/values/all');
    setSeenIndexes(seenIndexes.data);
  };

  useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, []);

  const renderSeenIndexes = () => {
    return seen!.map(({ number }) => number).join(', ');
  };

  const renderValues = () => {
    return Object.keys(values).map(key => (
      <div key={key}>
        For index {key} I calculated {values[key]}
      </div>
    ));
  };

  const handleIndexChange = (event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    setInputIndex(event.currentTarget.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios.post('/api/values', {
      index: inputIndex,
    });
    setInputIndex('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Index:</label>
        <input type="text" value={inputIndex} onChange={handleIndexChange} />
        <button type="submit">Submit</button>
      </form>

      <h3>Seen:</h3>
      <div>{renderSeenIndexes()}</div>

      <h3>Calculated:</h3>
      <div>{renderValues()}</div>
    </div>
  );
};
