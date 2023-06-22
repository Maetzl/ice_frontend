import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation, useNavigate } from "react-router-dom";
import EditData from "../pages/EditData";
import { updateProfile } from "../services/profile_service";

jest.mock("@auth0/auth0-react");
jest.mock("react-router-dom");
jest.mock("../services/profile_service");

describe("EditData", () => {
  let useAuth0Mock: jest.SpyInstance<any, unknown[]>;
  let useLocationMock: jest.SpyInstance<any, unknown[]>;
  let useNavigateMock: jest.SpyInstance<any, unknown[]>;
  let updateProfileMock: jest.SpyInstance<any, unknown[]>;

  beforeEach(() => {
    useAuth0Mock = jest.spyOn(require("@auth0/auth0-react"), "useAuth0");
    useLocationMock = jest.spyOn(require("react-router-dom"), "useLocation");
    useNavigateMock = jest.spyOn(require("react-router-dom"), "useNavigate");
    updateProfileMock = jest.spyOn(
      require("../services/profile_service"),
      "updateProfile"
    );

    useAuth0Mock.mockReturnValue({
      user: { sub: "test-sub|123" },
      getAccessTokenSilently: jest.fn(),
    });

    useLocationMock.mockReturnValue({ state: {} });

    useNavigateMock.mockReturnValue(jest.fn());
  });

  afterEach(() => {
    useAuth0Mock.mockRestore();
    useLocationMock.mockRestore();
    useNavigateMock.mockRestore();
    updateProfileMock.mockRestore();
  });

  it("renders the edit form", () => {
    render(<EditData />);

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Country")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Bild hochladen")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Speichern" })
    ).toBeInTheDocument();
  });

  it("updates the form values", () => {
    render(<EditData />);

    const nameInput = screen.getByLabelText("Name") as HTMLInputElement;
    const countryInput = screen.getByLabelText("Country") as HTMLSelectElement;
    const descriptionInput = screen.getByLabelText(
      "Description"
    ) as HTMLTextAreaElement;

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(countryInput, { target: { value: "Germany" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Lorem ipsum dolor sit amet" },
    });

    expect(nameInput.value).toBe("John Doe");
    expect(countryInput.value).toBe("Germany");
    expect(descriptionInput.value).toBe("Lorem ipsum dolor sit amet");
  });

  //it("submits the form and updates the profile", async () => {
  //  render(<EditData />);
  //
  //  updateProfileMock.mockResolvedValue({ data: {} });
  //
  //  fireEvent.click(screen.getByRole("button", { name: "Speichern" }));
  //
  //  expect(updateProfileMock).toHaveBeenCalled();
  //});
});
