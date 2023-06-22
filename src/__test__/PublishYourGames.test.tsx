import React from "react";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import PublishYourGames from "../pages/PublishYourGames";
import "@auth0/auth0-react";
import AWSMock from "aws-sdk-mock";

jest.mock("@auth0/auth0-react", () => ({
  Auth0Provider: ({ children }: any) => children,
  withAuthenticationRequired: (component: any, _: any) => component,
  useAuth0: () => {
    return {
      isLoading: false,
      user: { sub: "auth0|TestID123" },
      isAuthenticated: true,
      loginWithRedirect: jest.fn(),
      getAccessTokenSilently: jest.fn(),
    };
  },
}));

const mockGetSignedUrl = () => {
  AWSMock.mock(
    "S3",
    "getSignedUrlPromise",
    (method: string, params: any, callback: any) => {
      // Simuliere das erfolgreiche Erhalten der vorzeichenierten URL
      const uploadURL = "https://mocked-upload-url";
      console.log("testtestest");
      callback(null, uploadURL);
    }
  );
};

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ test: 100 }),
  })
) as jest.Mock;

const mockFileList = (files: File[]): FileList => {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("name", "file-upload");
  input.multiple = true;
  const fileList: FileList = Object.create(input.files);
  for (let i = 0; i < files.length; i++) {
    fileList[i] = files[i];
  }
  Object.defineProperty(fileList, "length", { value: files.length });
  return fileList;
};

beforeAll(() => {
  mockGetSignedUrl();
});

afterAll(() => {
  jest.restoreAllMocks();
  AWSMock.restore();
});

describe("PublishYourGames component", () => {
  it("renders the form correctly", () => {
    render(<PublishYourGames />);

    expect(screen.getByLabelText("Game Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Game Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Price in €")).toBeInTheDocument();
    expect(screen.getByLabelText("Tags")).toBeInTheDocument();
    expect(screen.getByLabelText("Game Image")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Publish Game" })
    ).toBeInTheDocument();
  });

  it("disables the submit button if the form is invalid", () => {
    render(<PublishYourGames />);

    const submitButton = screen.getByRole("button", { name: "Publish Game" });

    expect(submitButton).toBeDisabled();
  });

  it("enables the submit button if the form is valid", async () => {
    render(<PublishYourGames />);

    const nameInput = screen.getByLabelText("Game Name") as HTMLInputElement;
    const descriptionInput = screen.getByLabelText(
      "Game Description"
    ) as HTMLTextAreaElement;
    const priceInput = screen.getByLabelText("Price in €") as HTMLInputElement;
    const imageInput = screen.getByLabelText("Game Image") as HTMLInputElement;
    const exeInput = screen.getByLabelText(
      "Game Executable"
    ) as HTMLInputElement;
    const submitButton = screen.getByRole("button", { name: "Publish Game" });

    await act(async () => {
      await fireEvent.change(nameInput, { target: { value: "Test Game" } });
      await fireEvent.change(descriptionInput, {
        target: { value: "Test Description" },
      });
      await fireEvent.change(priceInput, { target: { value: "10.99" } });
      await fireEvent.change(imageInput, {
        target: {
          files: [new File(["image data"], "test.jpg", { type: "image/jpeg" })],
        },
      });
      await fireEvent.change(exeInput, {
        target: {
          files: [new File(["image data"], "game.exe", { type: ".exe" })],
        },
      });
    });

    expect(submitButton).toBeEnabled();
  });

  it("prints an error when more than 7 files are uploaded", async () => {
    render(<PublishYourGames />);

    const imageInput = screen.getByLabelText("Game Image") as HTMLInputElement;

    await act(async () => {
      var inputFiles = [];

      for (let i = 0; i < 10; i++) {
        inputFiles.push(
          new File(["image data"], `test${i}.jpg`, { type: "image/jpeg" })
        );
      }

      await fireEvent.change(imageInput, {
        target: {
          files: inputFiles,
        },
      });
    });

    const errorMessage = screen.queryByText("Maximum picture count is 7");

    expect(errorMessage).toBeInTheDocument();
  });

  it("Should not print an Error when uploading 2 Files", async () => {
    render(<PublishYourGames />);

    const imageInput = screen.getByLabelText("Game Image") as HTMLInputElement;

    const fileList = mockFileList([
      new File(["image data"], `test0.jpg`, {
        type: "image/jpeg",
      }),
      new File(["image data"], `test1.jpg`, {
        type: "image/jpeg",
      }),
    ]);

    await act(async () => {
      await fireEvent.change(imageInput, {
        target: {
          files: fileList,
        },
      });
    });

    const errorMessage = screen.queryByText("Maximum picture count is 7");

    expect(errorMessage).toBeNull;
  });

  it("Should not print an Error when uploading 2 Files", async () => {
    render(<PublishYourGames />);

    const imageInput = screen.getByLabelText("Game Image") as HTMLInputElement;

    const fileList = null;

    await act(async () => {
      await fireEvent.change(imageInput, {
        target: {
          files: fileList,
        },
      });
    });

    const errorMessage = screen.queryByText(
      "Es können maximal 7 Bilder hochgeladen werden."
    );

    expect(errorMessage).toBeNull;
  });

  it("Should print an Error when uploading more than 7 Files", async () => {
    render(<PublishYourGames />);

    const imageInput = screen.getByLabelText("Game Image") as HTMLInputElement;

    const fileList = mockFileList([
      new File(["image data"], `test0.jpg`, {
        type: "image/jpeg",
      }),
      new File(["image data"], `test1.jpg`, {
        type: "image/jpeg",
      }),
      new File(["image data"], `test2.jpg`, {
        type: "image/jpeg",
      }),
      new File(["image data"], `test3.jpg`, {
        type: "image/jpeg",
      }),
      new File(["image data"], `test4.jpg`, {
        type: "image/jpeg",
      }),
      new File(["image data"], `test5.jpg`, {
        type: "image/jpeg",
      }),
      new File(["image data"], `test6.jpg`, {
        type: "image/jpeg",
      }),
      new File(["image data"], `test7.jpg`, {
        type: "image/jpeg",
      }),
      new File(["image data"], `test8.jpg`, {
        type: "image/jpeg",
      }),
      new File(["image data"], `test9.jpg`, {
        type: "image/jpeg",
      }),
    ]);

    await act(async () => {
      await fireEvent.change(imageInput, {
        target: {
          files: fileList,
        },
      });
    });

    const errorMessage = screen.queryByText("Maximum picture count is 7");

    expect(errorMessage).toBeInTheDocument();
  });

  it("Should print an Error when uploading more than 1 .exe File", async () => {
    render(<PublishYourGames />);

    const exeInput = screen.getByLabelText(
      "Game Executable"
    ) as HTMLInputElement;

    const fileList = mockFileList([
      new File(["exe data"], `game1.exe`, {
        type: ".exe",
      }),
      new File(["exe data"], `test2.exe`, {
        type: ".exe",
      }),
    ]);

    await act(async () => {
      await fireEvent.change(exeInput, {
        target: {
          files: fileList,
        },
      });
    });

    const errorMessage = screen.queryByText("You can only upload one .exe");

    expect(errorMessage).toBeInTheDocument();
  });

  it("Should print an Error when uploading any other file than an .exe", async () => {
    render(<PublishYourGames />);

    const exeInput = screen.getByLabelText(
      "Game Executable"
    ) as HTMLInputElement;

    const fileList = mockFileList([
      new File(["image data"], `game1.jpg`, {
        type: ".jpg",
      }),
    ]);

    await act(async () => {
      await fireEvent.change(exeInput, {
        target: {
          files: fileList,
        },
      });
    });

    const errorMessage = screen.queryByText("You can only upload .exe");

    expect(errorMessage).toBeInTheDocument();
  });

  it("Should accept an file that ends with .*.exe", async () => {
    render(<PublishYourGames />);

    const exeInput = screen.getByLabelText(
      "Game Executable"
    ) as HTMLInputElement;

    const fileList = mockFileList([
      new File(["image data"], `game1.jpg.exe`, {
        type: ".exe",
      }),
    ]);

    await act(async () => {
      await fireEvent.change(exeInput, {
        target: {
          files: fileList,
        },
      });
    });

    const errorMessage = screen.queryByText("You can only upload .exe");

    expect(errorMessage).toBeNull();
  });

  it("Should print Errors when price is wrong", async () => {
    render(<PublishYourGames />);

    const priceInput = screen.getByLabelText("Price in €") as HTMLInputElement;

    await act(async () => {
      await fireEvent.change(priceInput, { target: { value: "-10.99" } });
    });

    let errorMessage = screen.queryByText("Price can't be lower than 0");

    expect(errorMessage).toBeInTheDocument();

    await act(async () => {
      await fireEvent.change(priceInput, { target: { value: "Abc" } });
    });

    errorMessage = screen.queryByText(
      "Please enter a valid number for the price."
    );

    expect(errorMessage).toBeInTheDocument();
  });

  it("Should not print Errors when price is a correct Value", async () => {
    render(<PublishYourGames />);

    const priceInput = screen.getByLabelText("Price in €") as HTMLInputElement;

    await act(async () => {
      await fireEvent.change(priceInput, { target: { value: "10.99" } });
    });

    const errorMessageValid = screen.queryByText(
      "Please enter a valid number for the price."
    );

    const errorMessageLower = screen.queryByText("Price can't be lower than 0");

    expect(errorMessageLower).toBeNull();
    expect(errorMessageValid).toBeNull();
  });

  it("should publish the game when form is submitted", async () => {
    render(<PublishYourGames />);

    const nameInput = screen.getByLabelText("Game Name") as HTMLInputElement;
    const descriptionInput = screen.getByLabelText(
      "Game Description"
    ) as HTMLTextAreaElement;
    const priceInput = screen.getByLabelText("Price in €") as HTMLInputElement;
    const imageInput = screen.getByLabelText("Game Image") as HTMLInputElement;
    const exeInput = screen.getByLabelText(
      "Game Executable"
    ) as HTMLInputElement;
    const submitButton = screen.getByRole("button", { name: "Publish Game" });

    await act(async () => {
      await fireEvent.change(nameInput, { target: { value: "Test Game" } });
      await fireEvent.change(descriptionInput, {
        target: { value: "Test Description" },
      });
      await fireEvent.change(priceInput, { target: { value: "10.99" } });
      await fireEvent.change(imageInput, {
        target: {
          files: [new File(["image data"], "test.jpg", { type: "image/jpeg" })],
        },
      });
      await fireEvent.change(exeInput, {
        target: {
          files: [new File(["image data"], "Game.exe", { type: ".exe" })],
        },
      });
    });

    expect(submitButton).toBeEnabled();

    await act(async () => {
      await fireEvent.click(submitButton);
    });
  });

  it("should add a tag", async () => {
    render(<PublishYourGames />);
    const tagInput = screen.getByLabelText("Tags") as HTMLInputElement;
    const tagButton = screen.getByRole("button", { name: "Add Tag" });
    await act(async () => {
      await fireEvent.change(tagInput, { target: { value: "Test Tag" } });
      await fireEvent.click(tagButton);
    });

    const tag = screen.getByRole("button", { name: "Test Tag" });

    expect(tag).toBeInTheDocument();
  });

  it("should add a tag if you type name and press enter", async () => {
    render(<PublishYourGames />);
    const tagInput = screen.getByLabelText("Tags") as HTMLInputElement;
    const tagButton = screen.getByRole("button", { name: "Add Tag" });
    await act(async () => {
      await fireEvent.change(tagInput, { target: { value: "Test Tag" } });
      await fireEvent.keyDown(tagInput, {
        key: "Enter",
        code: "Enter",
        charCode: 13,
      });
    });

    const tag = screen.getByRole("button", { name: "Test Tag" });

    expect(tag).toBeInTheDocument();
  });

  it("shouldn't add a tag if there is already a tag with the same name and show a error message", async () => {
    render(<PublishYourGames />);
    const tagInput = screen.getByLabelText("Tags") as HTMLInputElement;
    const tagButton = screen.getByRole("button", { name: "Add Tag" });
    await act(async () => {
      await fireEvent.change(tagInput, { target: { value: "Test Tag" } });
      await fireEvent.click(tagButton);
      await fireEvent.change(tagInput, { target: { value: "test tag" } });
      await fireEvent.click(tagButton);
      await fireEvent.change(tagInput, { target: { value: "Test Tag" } });
      await fireEvent.click(tagButton);
    });

    const tag = screen.getAllByRole("button", { name: "Test Tag" });
    expect(tag.length == 1).toBeTruthy();

    const errorMessageTags = screen.queryByText("Tag already exists");

    expect(errorMessageTags).toBeInTheDocument();
  });

  it("shouldn't add a tag if there is already 10 tags and there should be a error message if you try to add more", async () => {
    render(<PublishYourGames />);
    const tagInput = screen.getByLabelText("Tags") as HTMLInputElement;
    const tagButton = screen.getByRole("button", { name: "Add Tag" });
    await act(async () => {
      for (let i = 0; i < 11; i++) {
        await fireEvent.change(tagInput, { target: { value: `Tag ${i}` } });
        await fireEvent.click(tagButton);
      }
    });

    for (let i = 0; i < 10; i++) {
      expect(
        screen.getByRole("button", { name: `Tag ${i}` })
      ).toBeInTheDocument();
    }

    const errorMessageTags = screen.queryByText(
      "Too many tags. Maximum tag count is 10."
    );

    expect(errorMessageTags).toBeInTheDocument();
  });

  it("should delete the tag if you click on it", async () => {
    render(<PublishYourGames />);
    const tagInput = screen.getByLabelText("Tags") as HTMLInputElement;
    const tagButton = screen.getByRole("button", { name: "Add Tag" });
    await act(async () => {
      await fireEvent.change(tagInput, { target: { value: "Test Tag" } });
      await fireEvent.click(tagButton);
    });

    const tag = screen.getByRole("button", { name: "Test Tag" });

    await act(async () => {
      await fireEvent.click(tag);
    });

    const tagDeleted = screen.queryByRole("button", { name: "Test Tag" });

    expect(tagDeleted).toBeNull();
  });

  it("should not add an empty tag", async () => {
    render(<PublishYourGames />);
    const tagInput = screen.getByLabelText("Tags") as HTMLInputElement;
    const tagButton = screen.getByRole("button", { name: "Add Tag" });
    await act(async () => {
      await fireEvent.change(tagInput, { target: { value: "" } });
      await fireEvent.click(tagButton);
    });

    const tag = screen.queryAllByRole("button", { name: "" });

    expect(tag.length == 0).toBeTruthy();
  });

  it("shouldn't add a tag if you type name and press any other key", async () => {
    render(<PublishYourGames />);
    const tagInput = screen.getByLabelText("Tags") as HTMLInputElement;
    const tagButton = screen.getByRole("button", { name: "Add Tag" });
    await act(async () => {
      await fireEvent.change(tagInput, { target: { value: "Test Tag" } });
      await fireEvent.keyDown(tagInput, {
        key: "A",
        code: "KeyA",
      });
    });

    const tag = screen.queryByRole("button", { name: "Test Tag" });

    expect(tag).toBeNull();
  });
});
