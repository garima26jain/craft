// Header.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Header from './Header';
import { searchOptions } from '../../utils/constants';

const mockHandleSearchChange = jest.fn();
const mockSetSearchBy = jest.fn();
const mockHandleKeyDown = jest.fn();

const defaultProps = {
  handleSearchChange: mockHandleSearchChange,
  searchTerm: '',
  searchBy: searchOptions[0],
  setSearchBy: mockSetSearchBy,
  handleKeyDown: mockHandleKeyDown
};

describe('Header Component', () => {
  beforeEach(() => {
    render(<Header {...defaultProps} />);
  });

  test('renders header title', () => {
    const titleElement = screen.getByText(/Countries/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders search input with placeholder', () => {
    const inputElement = screen.getByPlaceholderText(/Search for a country by name.../i);
    expect(inputElement).toBeInTheDocument();
  });

  test('calls handleSearchChange when input changes', () => {
    const inputElement = screen.getByPlaceholderText(/Search for a country by name.../i);
    fireEvent.change(inputElement, { target: { value: 'Canada' } });
    expect(mockHandleSearchChange).toHaveBeenCalledTimes(1);
  });

  test('calls handleKeyDown when a key is pressed', () => {
    const inputElement = screen.getByPlaceholderText(/Search for a country by name.../i);
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });
    expect(mockHandleKeyDown).toHaveBeenCalledTimes(1);
  });

  test('renders react-select component', () => {
    const selectElement = screen.getByLabelText(/Search By/i);
    expect(selectElement).toBeInTheDocument();
  });

  test('calls setSearchBy when an option is selected', () => {
    const newOption = searchOptions[1];
    const selectElement = screen.getByLabelText(/Search By/i);
    fireEvent.change(selectElement, { target: { value: newOption.value } });
    expect(mockSetSearchBy).toHaveBeenCalledWith(newOption);
  });
});
