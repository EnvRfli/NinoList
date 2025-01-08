import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-blue-600 text-white fixed top-0 left-0 w-full shadow-lg z-50">
      <div className="mx-20 flex justify-between items-center pt-4 pb-4">
        {/* Logo */}
        <a href="/">
          <h1 className="text-2xl font-bold">NinoList</h1>
        </a>
        {/* Navigation */}
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="/about" className="hover:underline hover:text-yellow-200">
                About
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;

