import { render, screen, fireEvent } from "@testing-library/react";
import LoginForm from "./LoginForm";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from 'react-dom/test-utils';

test('display error when submitting with empty field', async () => {
    //render(<LoginForm />);
    render(
        <Router>
          <LoginForm />
        </Router>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Login now' });

    const user = {
      email: '',
      password: 'Password123&',
    };

    //simulate typing the user.email value into the emailInput field
    fireEvent.change(emailInput, { target: { value: user.email } });
    fireEvent.change(passwordInput, { target: { value: user.password } });
    act(() => {
        fireEvent.click(submitButton);
    });

    //const errorText = await screen.findByText('"email" is not allowed to be empty');
    const errorText = await screen.findByText(/email.+is not allowed to be empty/i);
    expect(errorText).toBeInTheDocument();
});

test('email is valid', () => {
    render(
        <Router>
          <LoginForm />
        </Router>
    );
    
    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: 'Login now' });
  
    const validEmail = 'test@example.com';
  
    fireEvent.change(emailInput, { target: { value: validEmail } });
    fireEvent.click(submitButton);
  
    expect(screen.queryByText(/error/i)).toBeNull();
  });

  test('password is valid', () => {
    render(
        <Router>
          <LoginForm />
        </Router>
    );
    
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Login now' });
  
    const validPassword = 'Test123Hallo&!';
  
    fireEvent.change(passwordInput, { target: { value: validPassword } });
    fireEvent.click(submitButton);
  
    expect(screen.queryByText(/error/i)).toBeNull();
  });
  
  test('displaay error when invalid email format', async () => {
    render(
      <Router>
        <LoginForm />
      </Router>
    );
  
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Login now' });
  
    const user = {
      email: 'invalid-email',
      password: 'Password123&',
    };
  
    fireEvent.change(emailInput, { target: { value: user.email } });
    fireEvent.change(passwordInput, { target: { value: user.password } });
    act(() => {
      fireEvent.click(submitButton);
    });
  
    const errorText = await screen.findByText(/email.+must be a valid email/i);
    expect(errorText).toBeInTheDocument();
  });