import React from "react";
import { render, screen } from "@testing-library/react";
import Index from "../pages/Index";

describe("Index", () => {
  test("renders welcome message", () => {
    // Render the component
    render(<Index />);

    // Find the welcome message element
    const welcomeMessage = screen.getByText(
      /Welcome to the Gaming Marketplace/i
    );

    // Assert that the welcome message is rendered
    expect(welcomeMessage).toBeInTheDocument();
  });
});
