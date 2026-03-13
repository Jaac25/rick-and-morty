import { MockedProvider } from "@apollo/client/testing/react";
import { render, screen } from "@testing-library/react";
import commentsMock from "../__mocks__/comments.json";
import { Comments } from "../components/Comments";
import { GET_COMMENTS } from "../graphql/queries/getComments";

describe("Coments component", () => {
  it("shows loading state", async () => {
    render(
      <MockedProvider mocks={[]}>
        <Comments characterId={1} />
      </MockedProvider>,
    );

    expect(screen.getByText("Comments")).toBeInTheDocument();
  });

  it("shows message when there are no comments", async () => {
    render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: GET_COMMENTS,
              variables: { characterId: 1 },
            },
            result: {
              data: { comments: [] },
            },
          },
        ]}
      >
        <Comments characterId={1} />
      </MockedProvider>,
    );

    const empty = await screen.findByText("There aren't comments");

    expect(empty).toBeInTheDocument();
  });

  it("renders comments list", async () => {
    render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: GET_COMMENTS,
              variables: { characterId: 1 },
            },
            result: {
              data: { comments: commentsMock },
            },
          },
        ]}
      >
        <Comments characterId={1} />
      </MockedProvider>,
    );

    const comments = await screen.findAllByRole("listitem");

    expect(comments).toHaveLength(7);
  });
});
