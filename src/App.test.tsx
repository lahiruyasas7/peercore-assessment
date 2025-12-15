import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { describe, expect, it } from "vitest";

describe("Elevator App", () => {
  it("renders the title", () => {
    render(<App />);
    expect(screen.getByText("Elevator Playground")).toBeInTheDocument();
  });

  it("renders all floor numbers", () => {
    render(<App />);
    ["0", "1", "2", "3", "4", "5"].forEach((floor) => {
      expect(screen.getAllByText(floor).length).toBeGreaterThan(0);
    });
  });

  it("allows clicking inside elevator buttons", async () => {
    render(<App />);
    const user = userEvent.setup();

    const insideButtons = screen.getAllByRole("button");
    await user.click(insideButtons[3]);

    expect(insideButtons[3]).toBeEnabled();
  });
});
