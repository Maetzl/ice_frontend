import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";
import { BrowserRouter } from "react-router-dom";
import { Auth0_provider } from "../Auth0_provider";

test("Some Test Test", () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const linkElement = screen.getByText("Profile");
  expect(linkElement).toBeInTheDocument();
});
