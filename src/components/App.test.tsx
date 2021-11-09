import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('routes using array of routers ', () => {
  render(<App />);

  //Implement Testing from here...
  // const linkElement = screen.getByText(/learn react/i);
  // expect(linkElement).toBeInTheDocument();
});
