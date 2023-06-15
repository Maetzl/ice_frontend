import { render, screen, fireEvent, act } from "@testing-library/react";
import SignupForm from "./SignupForm";
import { BrowserRouter as Router } from "react-router-dom";

test('renders all form fields', () => {
    render(
        <Router>
            <SignupForm />
        </Router>
    );

    //expect(screen.getByLabelText('Country')).toBeInTheDocument();
    //expect(screen.getByRole('textbox', { name: 'country' })).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Surname')).toBeInTheDocument();
    expect(screen.getByLabelText('Display Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('I understand and accept the terms of Service')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign up now' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
});

test('display error when submitting with empty field', async () => {
    render(
        <Router>
            <SignupForm />
        </Router>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign up now' });

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


test('should submit the form successfully', async () => {
    render(
        <Router>
            <SignupForm />
        </Router>
    );

    const displayInput = screen.getByLabelText('Display Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign up now' });

    const user = {
        displayName: 'ICEacount34',
        email: 'john.doe@example.com',
        password: 'Password123&',
    };

    act(() => {
        fireEvent.change(displayInput, { target: { value: user.displayName } });
        fireEvent.change(emailInput, { target: { value: user.email } });
        fireEvent.change(passwordInput, { target: { value: user.password } });
    });

    act(() => {
        fireEvent.click(submitButton);
    });

    expect(screen.queryByText(/error/i)).toBeNull();
});