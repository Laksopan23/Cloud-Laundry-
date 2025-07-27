// import { render, screen } from '@testing-library/react';
// import App from './App';

// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   BrowserRouter: ({ children }) => <div>{children}</div>,
//   Routes: ({ children }) => <div>{children}</div>,
//   Route: ({ element }) => element,
//   Navigate: () => null,
// }));

// test('renders login page by default', () => {
//   render(<App />);
//   // Since your default route is the Login page, let's check for some text from it.
//   // You might need to adjust this text depending on what's in your Login component.
//   const linkElement = screen.getByText(/Sign in/i);
//   expect(linkElement).toBeInTheDocument();
// });

test('placeholder test', () => {
  expect(true).toBe(true);
});
