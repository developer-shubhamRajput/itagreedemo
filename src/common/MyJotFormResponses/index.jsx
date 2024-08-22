import React, { useEffect, useState } from 'react';

const MyJotFormResponses = () => {
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const fetchResponses = async () => {
      const response = await fetch(
        `https://api.jotform.com/form/242281979236062/submissions?apiKey=09112de56b04f72a6b01037e5acda05c`
      );
      const data = await response.json();
      setResponses(data.content);
    };

    fetchResponses();
  }, []);

  return (
    <div>
      <h1>JotForm Responses</h1>
      <ul>
        {responses.map((response, index) => (
          <li key={index}>{JSON.stringify(response)}</li>
        ))}
      </ul>
    </div>
  );
};

export default MyJotFormResponses;
