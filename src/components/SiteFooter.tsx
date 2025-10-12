import { Link } from "react-router-dom";

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-emerald-100 bg-white/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 grid gap-8 md:grid-cols-4">
        <div>
          <h3 className="font-semibold text-emerald-900">Rent & Swap</h3>
          <p className="mt-2 text-sm text-emerald-900/70">
            Why buy when you can rent & swap? Save money, reduce waste, and
            build community.
          </p>
        </div>
        <div>
          <h4 className="font-medium text-emerald-900">Product</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/rent" className="hover:underline">
                Browse Rentals
              </Link>
            </li>
            <li>
              <Link to="/swap" className="hover:underline">
                Find Swaps
              </Link>
            </li>
            <li>
              <Link to="/list" className="hover:underline">
                List Your Item
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-emerald-900">Company</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/about" className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/how-it-works" className="hover:underline">
                How it Works
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-emerald-900">Legal</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/terms" className="hover:underline">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-emerald-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-emerald-900/70">
          <p>©{new Date().getFullYear()} Rent & Swap. All rights reserved.</p>
          <p>Made with ♻️ for smarter sharing.</p>
        </div>
      </div>
    </footer>
  );
}
