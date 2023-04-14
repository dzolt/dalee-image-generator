import Image from "next/image";
import Link from "next/link";

function Header() {
  return (
    <header className="flex justify-between p-5 sticky top-0 bg-white z-50 shadow-md">
      <div className="flex space-x-2 items-center">
        <div>
          <Image
            src="https://links.papareact.com/4t3"
            alt="ChatGPT Logo"
            height={30}
            width={30}
          />
        </div>

        <div>
          <h1 className="font-bold">
            Damian Zoltowski's <span className="text-violet-500">AI</span> Image
            Generator
          </h1>
          <h2 className="text-xs">
            Powered by DALLE 2, Chat GPT & Microsoft Azure
          </h2>
        </div>
      </div>

      <div className="flex text-xs md:text-base items-center text-gray-500">
        <Link href="https://github.com/dzolt" className="px-2 font-light">
          GitHub
        </Link>
      </div>
    </header>
  );
}

export default Header;
