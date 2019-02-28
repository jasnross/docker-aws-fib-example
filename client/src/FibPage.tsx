import React, { useState, useEffect } from 'react';
import axios from 'axios';

type IndexValue = {
  number: string;
};

type SeenIndexValues = {
  [index: string]: IndexValue;
};

type FibPageState = {
  seenIndexes: IndexValue[];
  values: SeenIndexValues;
  inputIndex: string;
};

export const FibPage: React.FunctionComponent = () => {
  const [state, setState] = useState<FibPageState>({
    inputIndex: '',
    seenIndexes: [],
    values: {},
  });

  const fetchValues = async () => {
    const values = await axios.get<SeenIndexValues>('/api/values/current');
    setState({
      ...state,
      values: values.data,
    });
  };

  const fetchIndexes = async () => {
    const seenIndexes = await axios.get<IndexValue[]>('/api/values/all');
    setState({
      ...state,
      seenIndexes: seenIndexes.data,
    });
  };

  useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, []);

  const renderSeenIndexes = () => {
    return state.seenIndexes.map(({ number }) => number).join(', ');
  };

  const renderValues = () => {
    return Object.keys(state.values).map(key => (
      <div key={key}>
        For index {key} I calculated {state.values[key]}
      </div>
    ));
  };

  const handleIndexChange = (event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    setState({ ...state, inputIndex: event.currentTarget.value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios.post('/api/values', {
      index: state.inputIndex,
    });
    setState({
      ...state,
      inputIndex: '',
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Index:</label>
        <input
          type="text"
          value={state.inputIndex}
          onChange={handleIndexChange}
        />
        <button type="submit">Submit</button>
      </form>

      <h3>Seen:</h3>
      {renderSeenIndexes()}

      <h3>Calculated:</h3>
      {renderValues()}
    </div>
  );
};
