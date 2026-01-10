import html2canvas from "html2canvas";

export interface GenerateImageOptions {
  userName: string;
  bracketName: string;
}

export async function generateBracketImage(
  element: HTMLElement,
  options: GenerateImageOptions,
): Promise<Blob> {
  const canvas = await html2canvas(element, {
    backgroundColor: "#111827", // gray-900
    scale: 2, // Higher resolution
    useCORS: true,
    logging: false,
  });

  // Add header with user info
  const finalCanvas = document.createElement("canvas");
  const ctx = finalCanvas.getContext("2d")!;
  const headerHeight = 80;
  const padding = 40;

  finalCanvas.width = canvas.width + padding * 2;
  finalCanvas.height = canvas.height + headerHeight + padding * 2;

  // Background
  ctx.fillStyle = "#111827";
  ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

  // Header gradient
  const gradient = ctx.createLinearGradient(0, 0, finalCanvas.width, 0);
  gradient.addColorStop(0, "#DC2626"); // red-600
  gradient.addColorStop(1, "#2563EB"); // blue-600
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, finalCanvas.width, headerHeight);

  // Header text
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 32px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(
    `${options.userName}'s NFL Playoff Bracket`,
    finalCanvas.width / 2,
    35,
  );

  ctx.font = "20px system-ui, sans-serif";
  ctx.fillStyle = "#E5E7EB";
  ctx.fillText(options.bracketName, finalCanvas.width / 2, 62);

  // Draw the bracket
  ctx.drawImage(canvas, padding, headerHeight + padding);

  // Footer
  ctx.font = "14px system-ui, sans-serif";
  ctx.fillStyle = "#6B7280";
  ctx.textAlign = "right";
  ctx.fillText(
    "NFL Playoff Bracket 2025-26",
    finalCanvas.width - padding,
    finalCanvas.height - 15,
  );

  return new Promise((resolve, reject) => {
    finalCanvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to generate image"));
        }
      },
      "image/png",
      1.0,
    );
  });
}

export async function downloadImage(
  blob: Blob,
  filename: string,
): Promise<void> {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function copyImageToClipboard(blob: Blob): Promise<void> {
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": blob,
      }),
    ]);
  } catch (error) {
    throw new Error("Failed to copy image to clipboard");
  }
}

export async function shareImage(
  blob: Blob,
  title: string,
  text: string,
): Promise<boolean> {
  if (!navigator.share || !navigator.canShare) {
    return false;
  }

  const file = new File([blob], "bracket.png", { type: "image/png" });

  if (!navigator.canShare({ files: [file] })) {
    return false;
  }

  try {
    await navigator.share({
      title,
      text,
      files: [file],
    });
    return true;
  } catch (error) {
    // User cancelled or share failed
    return false;
  }
}
