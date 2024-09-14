import { describe, expect, test, vi } from "vitest";
import { useObserveElementExistence } from "./use-observe-element-existence";

import { render } from "@testing-library/react";
import { useEffect, useState } from "react";

describe(useObserveElementExistence, () => {
  test("要素が存在しなければrefの値はnull", async () => {
    const Component = () => {
      const { elementRef } = useObserveElementExistence<HTMLDivElement>({
        appearParams: ["[data-testid='target']"],
      });

      return <div data-testid="ref-state">{elementRef.current === null ? "null" : "not null"}</div>;
    };

    const { unmount } = render(<Component />);

    // 一瞬だけ待つ
    await new Promise((resolve) => requestAnimationFrame(resolve));

    expect(document.querySelector("[data-testid='ref-state']")?.textContent).toBe("null");

    unmount();
  });

  test("要素が出現したらrefに要素がセットされる", async () => {
    const Component = () => {
      const { elementRef } = useObserveElementExistence<HTMLDivElement>({
        appearParams: ["[data-testid='target']"],
      });

      return (
        <>
          <div data-testid="target" />
          <div data-testid="ref-state">
            {elementRef.current?.isEqualNode(document.querySelector("[data-testid='target']"))
              ? "target"
              : "not target"}
          </div>
        </>
      );
    };

    const { unmount } = render(<Component />);

    // 一瞬だけ待つ
    await new Promise((resolve) => requestAnimationFrame(resolve));

    expect(document.querySelector("[data-testid='ref-state']")?.textContent).toBe("target");

    unmount();
  });

  test("要素が出現したときにonAppearが呼ばれる", async () => {
    const mockOnAppear = vi.fn();

    const Component = () => {
      useObserveElementExistence<HTMLDivElement>({
        appearParams: ["[data-testid='target']"],
        onAppear: mockOnAppear,
      });

      return <div data-testid="target" />;
    };

    const { unmount } = render(<Component />);

    // 一瞬だけ待つ
    await new Promise((resolve) => requestAnimationFrame(resolve));

    expect(mockOnAppear).toHaveBeenCalled();

    // アンマウントしないとなぜか別のテストにも要素が残ってしまう (なぜ？)
    unmount();
  });

  test("要素が消失したときにonDisappearが呼ばれる", async () => {
    const mockOnDisappear = vi.fn();

    const Component = () => {
      useObserveElementExistence<HTMLDivElement>({
        appearParams: ["[data-testid='target']"],
        onDisappear: mockOnDisappear,
      });

      const [isDisplay, setIsDisplay] = useState(true);

      useEffect(() => {
        // 一瞬だけ表示してから消す
        setTimeout(() => setIsDisplay(false), 50);
      }, []);

      if (!isDisplay) return null;

      return <div data-testid="target" />;
    };

    const { unmount } = render(<Component />);

    // 要素の消失を待つ
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockOnDisappear).toHaveBeenCalled();

    unmount();
  });

  test("要素が消失しなければonDisappearは呼ばれない", async () => {
    const mockOnDisappear = vi.fn();

    const Component = () => {
      useObserveElementExistence<HTMLDivElement>({
        appearParams: ["[data-testid='target']"],
        onDisappear: mockOnDisappear,
      });

      return <div data-testid="target" />;
    };

    const { unmount } = render(<Component />);

    // 一瞬だけ待つ
    await new Promise((resolve) => requestAnimationFrame(resolve));

    expect(mockOnDisappear).not.toHaveBeenCalled();

    unmount();
  });

  test("要素が消失した後再度出現した場合2回目のonAppearが呼ばれる", async () => {
    const mockOnAppear = vi.fn();

    const Component = () => {
      useObserveElementExistence<HTMLDivElement>({
        appearParams: ["[data-testid='target']"],
        onAppear: mockOnAppear,
      });

      const [isDisplay, setIsDisplay] = useState(true);

      useEffect(() => {
        // 一瞬だけ表示してから消す
        setTimeout(() => setIsDisplay(false), 50);

        // 一瞬だけ消してから再度表示
        setTimeout(() => setIsDisplay(true), 100);
      }, []);

      if (!isDisplay) return null;

      return <div data-testid="target" />;
    };

    const { unmount } = render(<Component />);

    // 要素の再出現を待つ
    await new Promise((resolve) => setTimeout(resolve, 150));

    expect(mockOnAppear).toHaveBeenCalledTimes(2);

    unmount();
  });

  test("要素が2回出現した後消失した場合2回目のonDisappearが呼ばれる", async () => {
    const mockOnDisappear = vi.fn();

    const Component = () => {
      useObserveElementExistence<HTMLDivElement>({
        appearParams: ["[data-testid='target']"],
        onDisappear: mockOnDisappear,
      });

      const [isDisplay, setIsDisplay] = useState(true);

      useEffect(() => {
        // 一瞬だけ表示してから消す
        setTimeout(() => setIsDisplay(false), 50);

        // 一瞬だけ消してから再度表示
        setTimeout(() => setIsDisplay(true), 100);

        // 一瞬だけ表示してから消す
        setTimeout(() => setIsDisplay(false), 150);
      }, []);

      if (!isDisplay) return null;

      return <div data-testid="target" />;
    };

    const { unmount } = render(<Component />);

    // 要素の再出現を待つ
    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(mockOnDisappear).toHaveBeenCalledTimes(2);

    unmount();
  });

  test("アンマウント時にAbortController.abortが呼ばれる", async () => {
    const spyAbort = vi.spyOn(window.AbortController.prototype, "abort");

    const Component = () => {
      useObserveElementExistence<HTMLDivElement>({
        appearParams: ["[data-testid='target']"],
      });

      return null;
    };

    const { unmount } = render(<Component />);

    unmount();

    expect(spyAbort).toHaveBeenCalledOnce();
  });

  test("アンマウントされなければAbortController.abortは呼ばれない", async () => {
    const spyAbort = vi.spyOn(window.AbortController.prototype, "abort");

    const Component = () => {
      useObserveElementExistence<HTMLDivElement>({
        appearParams: ["[data-testid='target']"],
      });

      return null;
    };

    const { unmount } = render(<Component />);

    expect(spyAbort).not.toHaveBeenCalled();

    unmount();
  });
});
