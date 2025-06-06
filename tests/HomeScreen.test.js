import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';

describe('HomeScreen', () => {
  it('renders welcome text and button', () => {
    const { getByText } = render(<HomeScreen />);

    expect(getByText('Welcome to StarSteps 🌟')).toBeTruthy();
    expect(getByText('Start Learning')).toBeTruthy();
  });

  it('responds to button press', () => {
    const { getByText } = render(<HomeScreen />);
    const button = getByText('Start Learning');
    
    fireEvent.press(button);
    // Currently it only logs to console; nothing to assert
  });

  // ✅ Snapshot test
  it('matches the snapshot', () => {
    const { toJSON } = render(<HomeScreen />);
    expect(toJSON()).toMatchSnapshot();
  });
});
