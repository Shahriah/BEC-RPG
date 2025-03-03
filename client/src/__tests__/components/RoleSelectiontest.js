
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RoleSelectionSection from '../../components/RoleSelectionSection';
import { Roles } from '../../types/roleTypes';


jest.mock('lucide-react', () => ({
  Shield: () => <div data-testid="shield-icon">Shield</div>,
  Users: () => <div data-testid="users-icon">Users</div>,
  BadgeDollarSign: () => <div data-testid="badge-dollar-icon">BadgeDollarSign</div>,
  UserCog: () => <div data-testid="usercog-icon">UserCog</div>
}));

describe('RoleSelectionSection', () => {
  
  const mockRoles = Object.values(Roles);
  const ceoRole = mockRoles.find(role => role.id === 'ceo');

  test('renders section header correctly', () => {
    render(<RoleSelectionSection selectedRole={null} onRoleSelect={() => {}} />);

    
    expect(screen.getByText('Select Your Role')).toBeInTheDocument();
    expect(screen.getByText('Choose your role to experience different security perspectives')).toBeInTheDocument();
  });

  test('renders all role cards', () => {
    render(<RoleSelectionSection selectedRole={null} onRoleSelect={() => {}} />);

    
    mockRoles.forEach(role => {
      const titleElements = screen.getAllByText(role.title);
      expect(titleElements.length).toBeGreaterThan(0);
      expect(screen.getByText(role.description)).toBeInTheDocument();
    });
  });

  test('handles role selection', () => {
    const mockOnRoleSelect = jest.fn();
    render(<RoleSelectionSection selectedRole={null} onRoleSelect={mockOnRoleSelect} />);

    
    const ceoRoleCards = screen.getAllByText(ceoRole.title);
    const ceoRoleCard = ceoRoleCards.find(el => 
      el.closest('div[class*="bg-white rounded-lg p-4"]')
    );
    
    fireEvent.click(ceoRoleCard);

    
    expect(mockOnRoleSelect).toHaveBeenCalledWith(ceoRole);
  });

  test('shows selected role details when a role is selected', () => {
    render(<RoleSelectionSection selectedRole={ceoRole} onRoleSelect={() => {}} />);

    
    expect(screen.getByText('Current Role:')).toBeInTheDocument();
    
    
    const roleNameElements = screen.getAllByText(ceoRole.title);
    const currentRoleSpan = roleNameElements.find(el => 
      el.closest('span[class="text-sm text-gray-900"]')
    );
    expect(currentRoleSpan).toBeInTheDocument();
  });

  test('allows changing selected role', () => {
    const mockOnRoleSelect = jest.fn();
    render(<RoleSelectionSection selectedRole={ceoRole} onRoleSelect={mockOnRoleSelect} />);

    
    const changeRoleButton = screen.getByText('Change Role');
    fireEvent.click(changeRoleButton);

    
    expect(mockOnRoleSelect).toHaveBeenCalledWith(null);
  });

  test('applies correct styling to selected role card', () => {
    render(<RoleSelectionSection selectedRole={ceoRole} onRoleSelect={() => {}} />);

    
    const ceoRoleCards = screen.getAllByText(ceoRole.title);
    const ceoRoleCard = ceoRoleCards.find(el => 
      el.closest('div[class*="ring-2 ring-blue-500 shadow-md"]')
    );
    
    const parentDiv = ceoRoleCard.closest('div[class*="bg-white rounded-lg p-4"]');
    
    
    expect(parentDiv).toHaveClass('ring-2');
    expect(parentDiv).toHaveClass('ring-blue-500');
    expect(parentDiv).toHaveClass('shadow-md');
  });

  test('renders correct icons for each role', () => {
    render(<RoleSelectionSection selectedRole={null} onRoleSelect={() => {}} />);

    
    const expectedIcons = {
      ceo: 'shield-icon',
      finance: 'badge-dollar-icon',
      it_security: 'usercog-icon',
      hr: 'users-icon'
    };

    mockRoles.forEach(role => {
      const iconTestId = expectedIcons[role.id];
      const iconElements = screen.getAllByTestId(iconTestId);
      expect(iconElements.length).toBeGreaterThan(0);
    });
  });
});
