import { showToast, Toast, LaunchProps } from "@raycast/api";
import { execFile } from "child_process";
import { promisify } from "util";
import { join } from "path";

const execFileAsync = promisify(execFile);
const SCRIPT_PATH = join(__dirname, "..", "scripts", "capture.js");

interface Arguments {
  url: string;
}

interface CaptureResult {
  success?: boolean;
  files?: string[];
  error?: string;
}

export default async function Command(props: LaunchProps<{ arguments: Arguments }>) {
  const { url } = props.arguments;

  const toast = await showToast({
    style: Toast.Style.Animated,
    title: "Capturing screenshots...",
    message: url,
  });

  try {
    const { stdout, stderr } = await execFileAsync("/opt/homebrew/bin/node", [SCRIPT_PATH, url], {
      timeout: 60000,
    });

    const output = stdout || stderr;
    const result: CaptureResult = JSON.parse(output);

    if (result.error) {
      throw new Error(result.error);
    }

    toast.style = Toast.Style.Success;
    toast.title = "Screenshots saved!";
    const firstFile = result.files?.[0] || "";
    const dir = firstFile.substring(0, firstFile.lastIndexOf("/")).replace(process.env.HOME || "", "~");
    toast.message = `${result.files?.length || 0} screenshots in ${dir}/`;
  } catch (error) {
    toast.style = Toast.Style.Failure;
    toast.title = "Capture failed";
    toast.message = error instanceof Error ? error.message : "Unknown error";
  }
}
