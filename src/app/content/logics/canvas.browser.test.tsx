import { render } from "@testing-library/react";
import { page } from "@vitest/browser/context";
import { describe, expect, test, vi } from "vitest";
import { fillCanvasLikeContribGraphAsVisualizer, fillCanvasLikeContribGraphBg } from "./canvas";

describe(fillCanvasLikeContribGraphBg, () => {
  const canvasHeight = 88;
  const canvasWidth = 686;

  const Canvas = () => {
    return <canvas data-testid="canvas" width={canvasWidth} height={canvasHeight} />;
  };

  test("GitHubのContributionグラフの背景のように描画されたcanvasが取得できる", async () => {
    const { baseElement } = render(<Canvas />);

    const canvas = baseElement.querySelector("canvas[data-testid='canvas']") as HTMLCanvasElement;

    const canvasCtx = canvas.getContext("2d") as CanvasRenderingContext2D;

    canvasCtx.fillStyle = "#ff0000";

    fillCanvasLikeContribGraphBg({ canvas, canvasCtx });

    page.viewport(canvasWidth, canvasHeight);

    const { base64 } = await page.screenshot({ element: canvas, base64: true });

    expect(base64).toMatchInlineSnapshot(
      `"iVBORw0KGgoAAAANSUhEUgAAAq4AAABYCAIAAAC7yeJ8AAAAAXNSR0IArs4c6QAAAqJJREFUeJzt3TFOw0AURdFxVuas3N6ZqQgogpSjke85ovMV9S8G3riO49r3a4z3n32/juN6kclkMplMdsds/P3tVbzIZDKZTCa7Y7Zd46Pr+/u2yWQymUwmu1/2+PQrAIC7cwoAQJpTAADSnAIAkOYUAIC0x9j3fz/+/iSTyWQymeyW2YL/60Amk8lkMtm0bLtef3QIAPR4KwAAaU4BAEh7jPMcz+fYtvef53Oc508ok8lkMpnsltmCuwgymUwmk8mmZeaIZDKZTCZLZ94KAECaUwAA0pwCAJDmFACANKcAAKSZI5LJZDKZrJ0tuIsgk8lkMplsWmaOCADSvBUAgDSnAACkmSOSyWQymaydLbiLIJPJZDKZbFpmjkgmk8lksnTmrQAApDkFACDNKQAAaU4BAEhzCgBAmjkimUwmk8na2YK7CDKZTCaTyaZl5ogAIM1bAQBIcwoAQJo5IplMJpPJ2tmCuwgymUwmk8mmZeaIZDKZTCZLZ94KAECaUwAA0pwCAJDmFACANKcAAKSZI5LJZDKZrJ0tuIsgk8lkMplsWmaOCADSvBUAgDSnAACkmSOSyWQymaydLbiLIJPJZDKZbFpmjkgmk8lksnTmrQAApDkFACDNKQAAaU4BAEhzCgBAmjkimUwmk8na2YK7CDKZTCaTyaZl5ogAIM1bAQBIcwoAQJo5IplMJpPJ2tmCuwgymUwmk8mmZeaIZDKZTCZLZ94KAECaUwAA0pwCAJDmFACANKcAAKSZI5LJZDKZrJ0tuIsgk8lkMplsWmaOCADSvBUAgDSnAACkmSOSyWQymaydLbiLIJPJZDKZbFpmjkgmk8lksnTmrQAApDkFACDNKQAAaU4BAEhzCgBAmjkimUwmk8na2YK7CDKZTCaTyaZlX7kJwJhPh3DDAAAAAElFTkSuQmCC"`,
    );
  });

  test("fillが呼ばれている", async () => {
    const { baseElement } = render(<Canvas />);

    const canvas = baseElement.querySelector("canvas[data-testid='canvas']") as HTMLCanvasElement;

    const canvasCtx = canvas.getContext("2d") as CanvasRenderingContext2D;

    const mockFill = vi.fn();

    canvasCtx.fill = mockFill;

    fillCanvasLikeContribGraphBg({ canvas, canvasCtx });

    expect(mockFill).toHaveBeenCalled();
  });

  test("fillStyleが変更されていない", async () => {
    const { baseElement } = render(<Canvas />);

    const canvas = baseElement.querySelector("canvas[data-testid='canvas']") as HTMLCanvasElement;

    const canvasCtx = canvas.getContext("2d") as CanvasRenderingContext2D;

    const initialFillStyle = canvasCtx.fillStyle;

    fillCanvasLikeContribGraphBg({ canvas, canvasCtx });

    expect(canvasCtx.fillStyle).toBe(initialFillStyle);
  });
});

describe(fillCanvasLikeContribGraphAsVisualizer, () => {
  const canvasHeight = 88;
  const canvasWidth = 686;

  const dataArray = new Uint8Array(64);

  for (let i = 0; i < dataArray.length; i++) {
    dataArray[i] = i;
  }

  const Canvas = () => {
    return <canvas data-testid="canvas" width={canvasWidth} height={canvasHeight} />;
  };

  test("周波数データがGitHubのContributionグラフのセルの形で描画されたcanvasが取得できる", async () => {
    const { baseElement } = render(<Canvas />);

    const canvas = baseElement.querySelector("canvas[data-testid='canvas']") as HTMLCanvasElement;

    const canvasCtx = canvas.getContext("2d") as CanvasRenderingContext2D;

    canvasCtx.fillStyle = "#ff0000";

    fillCanvasLikeContribGraphAsVisualizer({ canvas, canvasCtx, dataArray });

    page.viewport(canvasWidth, canvasHeight);

    const { base64 } = await page.screenshot({ element: canvas, base64: true });

    expect(base64).toMatchInlineSnapshot(
      `"iVBORw0KGgoAAAANSUhEUgAAAq4AAABYCAIAAAC7yeJ8AAAAAXNSR0IArs4c6QAAAz5JREFUeJzt3F1um0AAhVFcdV8erwyzMsLK6AOSTfFAaRLZOPcc8ZR+cl1X7dz84NM4jg0AkOrXq58AAPBKpgAARDMFACCaKQAA0UwBAIhmCgBANFMAAKKZAgAQzRQAgGimAABEMwUAIJopAADRTAEAiGYKAEA0UwAAopkCABDNFACAaKYAAEQzBQAgmikAANFMAQCIZgoAQDRTAACimQIAEM0UAIBopgAARDMFACCaKQAA0UwBAIhmCgBANFMAAKKZAgAQzRQAgGimAABEMwUAIJopAADRTAEAiGYKAEA0UwAAopkCABDNFACAaKYAAEQzBQAgmikAANFMAQCIZgoAQDRTAACimQIAEM0UAIBopgAARDMFACCaKQAA0UwBAIhmCgBANFMAAKKZAgAQzRQAgGimAABEMwUAIJopAADRTAEAiGYKAEA0UwAAopkCABDNFACAaKYAAEQzBQAgmikAANFMAQCI9vvVTwAAWPHxsfxIKZXmMWua5nr9q+m6Sta2TSmmAADs8JRT+f6Y12vTdfVn0rb3B9zIhqHp+388sa5rhuE0jmP9IQDgmI5zKvf9rqyU+6m8Mzud6s3+rGma2xG/mfmqAACfUj1oJ/ODee1Insw/ux2GenM+37PLZfXR5p8rb2Rddz8gqztg+vg8W3ti02+0J5vbmZWy9brtyeZ/C5uZKQAQY+epfLmsNvNTee0cXXzaup3dDMOuk69tmz1fFdjIpl+SzTLfIACAaG4mBIBopgAARDMFgHXTt5YXVzW7XJbX/Oe0b83ptLwWP94lk8men43Au+j7yrXQtmMpy2uR9f3YtmPTLK9FWW2mq213ZaXcs1JkMtkxMz82CJ9ynNuad95AtTN70W3NMpnshZkpwPs75qn8vW82snF4H/u/GJlMdvzMFOBbfe+p/Oh8jnoLMJlMJntCZgr8XE84leeZU1kmk8neMzMFDsOpfOx/KjKZTPZTM1Ogpnoqz78u/V+n8tq7aTqVZTKZTHaM7MCmW57Wrpvq3VPT9ZhVb6WYZ1+/MWP+qn49O/YtKDKZTCZ792z3FKje0Px4Z/Pakbw4lV/yQqxNgcVz6/vVbP4nlclkMpnsR2R/AHYKbJ8sDiu5AAAAAElFTkSuQmCC"`,
    );
  });

  test("fillが呼ばれている", async () => {
    const { baseElement } = render(<Canvas />);

    const canvas = baseElement.querySelector("canvas[data-testid='canvas']") as HTMLCanvasElement;

    const canvasCtx = canvas.getContext("2d") as CanvasRenderingContext2D;

    const mockFill = vi.fn();

    canvasCtx.fill = mockFill;

    fillCanvasLikeContribGraphAsVisualizer({ canvas, canvasCtx, dataArray });

    expect(mockFill).toHaveBeenCalled();
  });

  test("fillStyleが変更されていない", async () => {
    const { baseElement } = render(<Canvas />);

    const canvas = baseElement.querySelector("canvas[data-testid='canvas']") as HTMLCanvasElement;

    const canvasCtx = canvas.getContext("2d") as CanvasRenderingContext2D;

    const initialFillStyle = canvasCtx.fillStyle;

    fillCanvasLikeContribGraphAsVisualizer({ canvas, canvasCtx, dataArray });

    expect(canvasCtx.fillStyle).toBe(initialFillStyle);
  });
});
