import { describe, expect, it } from "vitest";
import { createRoundRectPath } from "./canvas";

import { render } from "@testing-library/react";
import { page } from "@vitest/browser/context";

describe(createRoundRectPath, () => {
  const Canvas = () => {
    return <canvas data-testid="canvas" width={100} height={100} />;
  };

  it("角丸四角形のパスを作成する", async () => {
    const { baseElement } = render(<Canvas />);

    const canvas = baseElement.querySelector("canvas[data-testid='canvas']") as HTMLCanvasElement;

    const canvasCtx = canvas.getContext("2d") as CanvasRenderingContext2D;

    createRoundRectPath({ ctx: canvasCtx, x: 10, y: 10, w: 70, h: 70, r: 20 });

    canvasCtx.fill();

    const canvasLocator = page.getByTestId("canvas");

    const { base64 } = await canvasLocator.screenshot({ base64: true });

    expect(base64).toMatchInlineSnapshot(
      `"iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAAXNSR0IArs4c6QAAAhZJREFUeJzt3FGOgyAURmGczL7KzmhXZrsy54GkbTpJ4XgvIvp/b/PS6gmiNQPTsixB6vz0PoCRKBagWIBiAYoFKBagWIBiAYoF/Hp90P1+DyHcbrf3P9uJMYYQLpdLCOF6vTb9rpfFLKWUD72vlJL9XL4zxUop9U70qWmylbHmee6d5ZtGydbE2uGA+q9FLxxriFKZey8Wa6BSmW8vEGu4Upljr9pYg5bK5nl2iTVVvlaepqn9STXk8va86ufOdo/IzbicQtXIGn1YZfbBVR5ZBxhWmcOJFGc1lwPdgxijcYI/USz7bbFwGR7mGnRxrpd/z9dt6xRiPR4Py6cfzLlGllHhOesYT1jvLLcsjSxAsQDFAhQLUCxAsQDFAhQLUCxAsQDFAhQLUCxAsQDFAhQLUCxAsQDFAhQLUCxAsQDFAhQLUCxAsQDFAhQLUCxAsQDFAgqx9rBE1ZHxdDSygHPFygvQVyvEGnoxmL/v/ya/87XQlGXFQNUKiyPN8cZY5TnLeJ3vh31K0RI6oOpueIBp3uUUtOwXqH3OGvq26HZl1N8LBr0YO2xVMGivbptgDNer8/YqA/XaxcY92c57eW0R8kGbjQE+29j1ThRijBtsY1f7UFojL9XPy6q32SDx+Qy1za99z1iHd643pUaKBSgWoFiAYgGKBSgWoFiAYgGKBSgWoFiAYgGKBSgWoFiAYgGKBSgW8AcUucEYkZO6qAAAAABJRU5ErkJggg=="`,
    );
  });
});
