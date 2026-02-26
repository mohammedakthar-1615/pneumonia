const Navbar = () => {
  return (
    <nav className="w-full bg-slate-900 shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        

        <a href="/" className="text-xl font-bold text-white">
          PneumoAI
        </a>

        <div className="space-x-6 hidden md:flex">
          <a href="/" className="text-slate-300 hover:text-white transition">
            Home
          </a>
          <a href="#" className="text-slate-300 hover:text-white transition">
            About
          </a>
          <a href="#" className="text-slate-300 hover:text-white transition">
            Contact
          </a>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
