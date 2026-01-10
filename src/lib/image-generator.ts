import type { BracketState } from "@/types";

export interface GenerateImageOptions {
  userName: string;
  bracketName: string;
}

/**
 * Generates a bracket image by calling the server-side API
 * This ensures consistent rendering across all devices, including iOS Safari
 */
export async function generateBracketImage(
  bracket: BracketState,
): Promise<Blob> {
  const response = await fetch("/api/generate-bracket-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bracket }),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || "Failed to generate image");
  }

  return response.blob();
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
  } catch {
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
  } catch {
    // User cancelled or share failed
    return false;
  }
}
