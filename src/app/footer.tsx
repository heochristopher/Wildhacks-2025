import logo from "./Logo.png";
import Image from "next/image";

export default function Footer() {
  return (
    <footer
      aria-labelledby="footer-heading"
      className="w-full bg-green-800 text-white border-t border-green-900 py-6 px-6 font-mono"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="flex flex-col items-center text-center gap-2">
        <h1 className="text-sm">
          Created By: Chris Heo, Hajo Wolfram, Anthony Chung, and Elaine Cui
        </h1>
        <a
          className="text-sm underline hover:text-gray-200"
          href="https://github.com/elainecui9/Wildhacks-2025"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
