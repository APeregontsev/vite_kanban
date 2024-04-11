import Dashboard from "./Dashboard";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import { act, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "src/store/store";
import userEvent from "@testing-library/user-event";
import { axiosWithAuth } from "src/api/api";
import { axiosResponseData } from "./mokedAxiosResponse";
/* import * as searchHelpers from "src/components/Search/helper"; */
import { renderWithRedux } from "./renderWithRedux";
import { storeData } from "./mokedStoreData";
import { State, getCurrentBoardToRender } from "./helper";

// Mocked Stars components cause it breaks render
jest.mock("src/components/StarsCounter/StarsCounter");

// Mocked Axios response
jest.mock("src/api/api");
const mockAxiosWithAuth = axiosWithAuth as jest.MockedFunction<typeof axiosWithAuth>;
mockAxiosWithAuth.mockReturnValue(Promise.resolve({ data: axiosResponseData }));

// Clearing mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

describe("Dashboard", () => {
  test("1. Page loaded correctly", () => {
    const { container } = render(
      <BrowserRouter>
        <Provider store={store}>
          <Dashboard />
        </Provider>
      </BrowserRouter>
    );

    // Lets check number of inputs on the page
    const inputs = container.getElementsByTagName("input");
    expect(inputs).toHaveLength(1);

    // Lets check input with correct placeholder to be present on the page
    const searchInput = screen.getByPlaceholderText(/Enter repo URL here/i);
    expect(searchInput).toBeInTheDocument();

    // Lets check Titles of the columns to be present on the page
    expect(container).toHaveTextContent(/open/i);
    expect(container).toHaveTextContent(/inprogress/i);
    expect(container).toHaveTextContent(/done/i);

    // Lets check correct buttons to be present on the page
    expect(
      screen.getByRole("button", {
        name: /clear/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /load issues/i,
      })
    ).toBeInTheDocument();
  });

  test("2. Issues rendered correctly from Axios response", async () => {
    const { container } = render(
      <BrowserRouter>
        <Provider store={store}>
          <Dashboard />
        </Provider>
      </BrowserRouter>
    );

    // Lets select neccessary elements on the page
    const searchInput = container.querySelector(`input`);
    const submitButton = container.querySelector(`button[type="submit"]`);

    // Lets fill input with repo address
    await act(async () => {
      await userEvent.type(searchInput!, "github.com/nashsu/FreeAskInternet");
    });

    // Lets press "Load issues" button
    await act(async () => {
      await userEvent.click(submitButton!);
    });

    // Lets check that necessary issue (present in mocked axios response) to be rendered on the page
    expect(container).toHaveTextContent(/mocked_axios_response/i);
  });

  test("3. Issues rendered correctly from mocked Redux Store", async () => {
    /*   const mockedGetRepoDetailsFromUR = jest.spyOn(searchHelpers, "getRepoDetailsFromURL");
    mockedGetRepoDetailsFromUR.mockReturnValue({ owner: "nashsu", repo: "FreeAskInternet" });
    mockAxiosWithAuth.mockResolvedValue({ data: axiosResponseData }); */

    /*   const mockedUseAppSelector = jest.spyOn(searchHelper, "getRepoDetailsFromURL");
    mockedUseAppSelector.mockReturnValue(storeData); */

    await act(async () => {
      renderWithRedux(<Dashboard />, storeData);
    });

    const { container } = renderWithRedux(<Dashboard />, storeData);

    // Lets check that necessary issue (present in mocked axios response) to be rendered on the page
    expect(container).toHaveTextContent(/mocked_closed/i);
    expect(container).toHaveTextContent(/mocked_inprogress/i);
    expect(container).toHaveTextContent(/mocked_open/i);

    screen.debug();

    // Lets check rendered data on the page
  }, 5000);

  test("4. Correct owner and repo links are present on the page", async () => {
    const { container } = render(
      <BrowserRouter>
        <Provider store={store}>
          <Dashboard />
        </Provider>
      </BrowserRouter>
    );

    // Lets select neccessary elements on the page
    const searchInput = container.querySelector(`input`);
    const submitButton = container.querySelector(`button[type="submit"]`);

    // Lets fill input with repo address
    await act(async () => {
      await userEvent.type(searchInput!, "github.com/nashsu/FreeAskInternet");
    });

    // Lets press "Load issues" button
    await act(async () => {
      await userEvent.click(submitButton!);
    });

    // Lets check that owner and repo links rendered on the page
    expect(container).toHaveTextContent(/nashsu/i);
    expect(container).toHaveTextContent(/FreeAskInternet/i);
  });

  test("5. Unit: renders issues into correct columns based on their state when no board changes are saved", () => {
    const state: State = {
      issues: {
        owner: "loadedRepoOwner",
        repo: "loadedRepo",
        issues: [
          {
            id: 1,
            number: 101,
            title: "Issue 1",
            comments: 0,
            state: "open",
            created_at: "2024-01-01",
            user: "user1",
          },
          {
            id: 2,
            number: 102,
            title: "Issue 2",
            comments: 2,
            state: "closed",
            created_at: "2024-01-02",
            user: "user2",
          },
          {
            id: 3,
            number: 103,
            title: "Issue 3",
            comments: 1,
            state: "inProgress",
            created_at: "2024-01-03",
            user: "user3",
          },
          {
            id: 4,
            number: 104,
            title: "Issue 4",
            comments: 3,
            state: "open",
            created_at: "2024-01-04",
            user: "user4",
          },
        ],
      },
      boards: {
        data: [], // No saved changes in the board
      },
    };

    const expectedBoardToRender = {
      open: [
        {
          id: 1,
          number: 101,
          title: "Issue 1",
          comments: 0,
          state: "open",
          created_at: "2024-01-01",
          user: "user1",
        },
        {
          id: 4,
          number: 104,
          title: "Issue 4",
          comments: 3,
          state: "open",
          created_at: "2024-01-04",
          user: "user4",
        },
      ],
      inProgress: [
        {
          id: 3,
          number: 103,
          title: "Issue 3",
          comments: 1,
          state: "inProgress",
          created_at: "2024-01-03",
          user: "user3",
        },
      ],
      closed: [
        {
          id: 2,
          number: 102,
          title: "Issue 2",
          comments: 2,
          state: "closed",
          created_at: "2024-01-02",
          user: "user2",
        },
      ],
    };

    const result = getCurrentBoardToRender(state);

    // Check for the presence and correct order of issues in each column
    expect(result.open).toEqual(expect.arrayContaining(expectedBoardToRender.open));
    expect(result.inProgress).toEqual(expect.arrayContaining(expectedBoardToRender.inProgress));
    expect(result.closed).toEqual(expect.arrayContaining(expectedBoardToRender.closed));

    // Additional checks can include the length of each array to ensure no missing or extra issues
    expect(result.open.length).toBe(expectedBoardToRender.open.length);
    expect(result.inProgress.length).toBe(expectedBoardToRender.inProgress.length);
    expect(result.closed.length).toBe(expectedBoardToRender.closed.length);
  });

  test("6. Unit: handles an empty issues array gracefully, producing an empty board", () => {
    const emptyState: State = {
      issues: {
        owner: "emptyRepoOwner",
        repo: "emptyRepo",
        issues: [], // No issues loaded
      },
      boards: {
        data: [
          {
            owner: "emptyRepoOwner",
            repo: "emptyRepo",
            inProgress: [],
            closed: [],
            open: [],
          },
        ],
      },
    };

    const expectedEmptyBoardToRender = {
      open: [],
      inProgress: [],
      closed: [],
    };

    const result = getCurrentBoardToRender(emptyState);

    // Verify that each column in the board is empty
    expect(result.open).toEqual(expectedEmptyBoardToRender.open);
    expect(result.inProgress).toEqual(expectedEmptyBoardToRender.inProgress);
    expect(result.closed).toEqual(expectedEmptyBoardToRender.closed);

    // Additionally, check for the length of each array to ensure they are indeed empty
    expect(result.open.length).toBe(0);
    expect(result.inProgress.length).toBe(0);
    expect(result.closed.length).toBe(0);
  });

  test("7. Unit: correctly renders the board accounting for preserved changes in issues’ columns and order", () => {
    const stateWithChanges: State = {
      issues: {
        owner: "changedRepoOwner",
        repo: "changedRepo",
        issues: [
          {
            id: 1,
            number: 101,
            title: "Issue 1",
            comments: 0,
            state: "open",
            created_at: "2024-02-01",
            user: "user1",
          },
          {
            id: 2,
            number: 102,
            title: "Issue 2",
            comments: 2,
            state: "closed",
            created_at: "2024-02-02",
            user: "user2",
          },
          {
            id: 3,
            number: 103,
            title: "Issue 3",
            comments: 1,
            state: "inProgress",
            created_at: "2024-02-03",
            user: "user3",
          },
          {
            id: 4,
            number: 104,
            title: "Issue 4",
            comments: 3,
            state: "open",
            created_at: "2024-02-04",
            user: "user4",
          },
        ],
      },
      boards: {
        data: [
          {
            owner: "changedRepoOwner",
            repo: "changedRepo",
            inProgress: [4, 3], // Issue 4 moved to inProgress and reordered with Issue 3
            closed: [1], // Issue 1 moved to closed
            open: [2], // Issue 2 moved to open
          },
        ],
      },
    };

    const expectedResult = {
      open: [
        {
          id: 2,
          number: 102,
          title: "Issue 2",
          comments: 2,
          state: "open",
          created_at: "2024-02-02",
          user: "user2",
        }, // Moved to open
      ],
      inProgress: [
        {
          id: 4,
          number: 104,
          title: "Issue 4",
          comments: 3,
          state: "inProgress",
          created_at: "2024-02-04",
          user: "user4",
        }, // Moved to inProgress and should be first
        {
          id: 3,
          number: 103,
          title: "Issue 3",
          comments: 1,
          state: "inProgress",
          created_at: "2024-02-03",
          user: "user3",
        }, // Remains in inProgress but now second
      ],
      closed: [
        {
          id: 1,
          number: 101,
          title: "Issue 1",
          comments: 0,
          state: "closed",
          created_at: "2024-02-01",
          user: "user1",
        }, // Moved to closed
      ],
    };

    const renderedBoard = getCurrentBoardToRender(stateWithChanges);

    // Verify the board accurately reflects the preserved changes
    expect(renderedBoard.open).toEqual(expect.arrayContaining(expectedResult.open));
    expect(renderedBoard.inProgress).toEqual(expect.arrayContaining(expectedResult.inProgress));
    expect(renderedBoard.closed).toEqual(expect.arrayContaining(expectedResult.closed));

    // Ensure the order of issues is correctly preserved
    expect(renderedBoard.inProgress.map((issue) => issue.id)).toEqual([4, 3]);
    expect(renderedBoard.open.map((issue) => issue.id)).toEqual([2]);
    expect(renderedBoard.closed.map((issue) => issue.id)).toEqual([1]);
  });
});
