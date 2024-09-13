import { describe, expect, it, vi } from "vitest";
import { useObserveElementExistence } from "./use-observe-element-existence";

import { render } from "@testing-library/react";
import { useEffect, useState } from "react";

describe(useObserveElementExistence, () => {
  it("要素が出現したときにonAppearが呼ばれる", async () => {
    const mockOnAppear = vi.fn();

    const Component1 = () => {
      useObserveElementExistence<HTMLDivElement>({
        appearParams: ["[data-testid='target']"],
        onAppear: mockOnAppear,
      });

      return <div data-testid="target" />;
    };

    const { unmount } = render(<Component1 />);

    // 一瞬だけ待つ
    await new Promise((resolve) => requestAnimationFrame(resolve));

    expect(mockOnAppear).toHaveBeenCalled();

    // アンマウントしないとなぜか別のテストにも要素が残ってしまう (なぜ？)
    unmount();
  });

  it("要素が消失したときにonDisappearが呼ばれる", async () => {
    const mockOnDisappear = vi.fn();

    const Component2 = () => {
      useObserveElementExistence<HTMLDivElement>({
        appearParams: ["[data-testid='target']"],
        disappearParams: ["[data-testid='target']"],
        onDisappear: mockOnDisappear,
      });

      const [isDisplay, setIsDisplay] = useState(true);

      useEffect(() => {
        // 一瞬だけ表示してから消す
        setTimeout(() => {
          setIsDisplay(false);
        }, 50);
      }, []);

      if (!isDisplay) return <div data-testid="no-target" />;

      return <div data-testid="target" />;
    };

    const { unmount } = render(<Component2 />);

    // これは別のテストケースでやる
    // // 一瞬だけ待つ
    // await new Promise((resolve) => requestAnimationFrame(resolve));

    // // この時点ではまだ要素がある
    // expect(mockOnDisappear).not.toHaveBeenCalled();

    // 要素の消失を待つ
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockOnDisappear).toHaveBeenCalled();

    // アンマウントしないとなぜか別のテストにも要素が残ってしまう (なぜ？)
    unmount();
  });
});
