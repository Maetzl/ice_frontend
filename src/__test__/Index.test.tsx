import React from "react";
import { render, screen } from "@testing-library/react";
import Index from "../pages/Index";

describe("Index", () => {
  test("renders welcome message", () => {
    render(<Index />);
    const welcomeMessage = screen.getByText(
      /Welcome to the Gaming Marketplace/i
    );
    expect(welcomeMessage).toBeInTheDocument();
  });
});
