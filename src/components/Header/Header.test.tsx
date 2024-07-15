import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header, { HeaderProps, CustomSelect } from './Header';


// Mock search options
const mockSearchOption = { value: 'name', label: 'Name' };

const renderHeader = (props: Partial<HeaderProps> = {}) => {
  const defaultProps: HeaderProps = {
    handleSearchChange: jest.fn(),
    searchTerm: '',
    searchBy: mockSearchOption,
    setSearchBy: jest.fn(),
    setSearchTerm: jest.fn(),
    ...props,
  };

  return render(<Header {...defaultProps} />);
};

test('renders Header component with search input and CustomSelect component', () => {
  renderHeader();

  const searchInput = screen.getByPlaceholderText(/Search for a country by name/i);
  expect(searchInput).toBeInTheDocument();

  const selectDropdown = screen.getByRole('select-input');
  expect(selectDropdown).toBeInTheDocument();
});

test('calls handleSearchChange on input change', () => {
  const handleSearchChange = jest.fn();
  renderHeader({ handleSearchChange });

  const searchInput = screen.getByPlaceholderText(/Search for a country by name/i);
  fireEvent.change(searchInput, { target: { value: 'Germany' } });

  expect(handleSearchChange).toHaveBeenCalledTimes(1);
  expect(handleSearchChange).toHaveBeenCalledWith(expect.any(Object));
});

test('calls setSearchTerm when clear button is clicked', () => {
  const setSearchTerm = jest.fn();
  renderHeader({ searchTerm: 'Germany', setSearchTerm });

  const clearButton = screen.getByRole('button', { name: /clear search/i });
  fireEvent.click(clearButton);

  expect(setSearchTerm).toHaveBeenCalledTimes(1);
  expect(setSearchTerm).toHaveBeenCalledWith('');
});

test('calls setSearchBy when a new search option is selected', async () => {
  const setSearchBy = jest.fn();
  renderHeader({ setSearchBy });

  const selectDropdown = screen.getByText('Name');
  fireEvent.click(selectDropdown);

  const option = await screen.findByText('Region');
  fireEvent.click(option);

  expect(setSearchBy).toHaveBeenCalledTimes(1);
  expect(setSearchBy).toHaveBeenCalledWith({ value: 'region', label: 'Region' });
});

test('CustomSelect component handles keyboard navigation', () => {
  const handleChange = jest.fn();
  const options = [
    { value: 'name', label: 'Name' },
    { value: 'region', label: 'Region' },
  ];

  render(<CustomSelect value={options[0]} options={options} onChange={handleChange} />);

  const select = screen.getByText('Name');
  fireEvent.click(select);

  // Navigate with keyboard
  fireEvent.keyDown(select, { key: 'ArrowDown', code: 'ArrowDown' });
  fireEvent.keyDown(select, { key: 'Enter', code: 'Enter' });

  expect(handleChange).toHaveBeenCalledTimes(1);
  expect(handleChange).toHaveBeenCalledWith(options[1]);
});

test('CustomSelect component closes when clicking outside', () => {
  const handleChange = jest.fn();
  const options = [
    { value: 'name', label: 'Name' },
    { value: 'region', label: 'Region' },
  ];

  render(<CustomSelect value={options[0]} options={options} onChange={handleChange} />);

  const select = screen.getByText('Name');
  fireEvent.click(select);

  const option = screen.getByText('Region');
  expect(option).toBeInTheDocument();

  // Click outside
  fireEvent.mouseDown(document);

  expect(option).not.toBeInTheDocument();
});
